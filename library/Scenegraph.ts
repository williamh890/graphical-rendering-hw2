

enum SGAssetType {
    Scene,
    GeometryGroup,
    MaterialLibrary,
    ShaderProgram,
    Image,
};


class ScenegraphNode {
    public geometryGroup: string = "";
    public transform: Matrix4 = Matrix4.makeIdentity();

    constructor(public name: string) {
    }
}


class Scenegraph {
    private textfiles: Utils.TextFileLoader[] = [];
    private imagefiles: Utils.ImageFileLoader[] = [];
    private shaderSrcFiles: Utils.ShaderLoader[] = [];

    private _renderConfigs: Map<string, RenderConfig> = new Map<string, RenderConfig>();
    private _cubeTextures: Map<string, WebGLTexture> = new Map<string, WebGLTexture>();
    private _textures: Map<string, WebGLTexture> = new Map<string, WebGLTexture>();
    private _nodes: Array<ScenegraphNode> = [];
    private _meshes: Map<string, IndexedGeometryMesh> = new Map<string, IndexedGeometryMesh>();
    private _tempNode: ScenegraphNode = new ScenegraphNode("working");

    private _defaultRenderConfig: RenderConfig;

    constructor(private _renderingContext: RenderingContext) {
        this._defaultRenderConfig = new RenderConfig(this._renderingContext,
            `attribute vec4 aPosition;
             void main() {
                 gl_Position = aPosition;
            }`,
            `void main() {
                gl_FragColor = vec4(0.4, 0.3, 0.2, 1.0);
            }`);
    }

    get loaded(): boolean {
        for (let t of this.textfiles) {
            if (!t.loaded) return false;
        }
        for (let i of this.imagefiles) {
            if (!i.loaded) return false;
        }
        for (let s of this.shaderSrcFiles) {
            if (!s.loaded) return false;
        }
        return true;
    }

    get failed(): boolean {
        for (let t of this.textfiles) {
            if (t.failed) return true;
        }
        for (let i of this.imagefiles) {
            if (i.failed) return true;
        }
        for (let s of this.shaderSrcFiles) {
            if (s.failed) return true;
        }
        return false;
    }

    get percentLoaded(): number {
        let a = 0;
        for (let t of this.textfiles) {
            if (t.loaded) a++;
        }
        for (let i of this.imagefiles) {
            if (i.loaded) a++;
        }
        for (let s of this.shaderSrcFiles) {
            if (s.loaded) a++;
        }
        return 100.0 * a / (this.textfiles.length + this.imagefiles.length + this.shaderSrcFiles.length);
    }

    Load(url: string): void {
        let name = Utils.GetURLResource(url);
        let self = this;
        let assetType: SGAssetType;
        let ext = Utils.GetExtension(name);
        let path = Utils.GetURLPath(url);

        if (ext == "scn") assetType = SGAssetType.Scene;
        else if (ext == "obj") assetType = SGAssetType.GeometryGroup;
        else if (ext == "mtl") assetType = SGAssetType.MaterialLibrary;
        else if (ext == "png") assetType = SGAssetType.Image;
        else if (ext == "jpg") assetType = SGAssetType.Image;
        else return;

        console.log("Scenegraph::Load() => Requesting " + url);

        if (assetType == SGAssetType.Image) {
            this.imagefiles.push(new Utils.ImageFileLoader(url, (data, name, assetType) => {
                console.log("Scenegraph::Load() => Loaded " + name);
                self.processTextureMap(data, name, assetType);
                console.log("Scenegraph::Load() => done: " + self.percentLoaded + "%");
            }));
        } else {
            this.textfiles.push(new Utils.TextFileLoader(url, (data, name, assetType) => {
                console.log("Scenegraph::Load() => Loaded " + name);
                self.processTextFile(data, name, path, assetType);
                console.log("Scenegraph::Load() => done: " + self.percentLoaded + "%");
            }, assetType));
        }
    }

    AddRenderConfig(name: string, vertshaderUrl: string, fragshaderUrl: string) {
        let self = this;
        this.shaderSrcFiles.push(new Utils.ShaderLoader(vertshaderUrl, fragshaderUrl, (vertShaderSource: string, fragShaderSource: string) => {
            console.log("Scenegraph::Load() => Loaded " + vertshaderUrl);
            console.log("Scenegraph::Load() => Loaded " + fragshaderUrl);
            this._renderConfigs.set(name, new RenderConfig(this._renderingContext, vertShaderSource, fragShaderSource));
            console.log("Scenegraph::Load() => done: " + self.percentLoaded + "%");
        }));
    }

    UseRenderConfig(name: string): RenderConfig {
        let rc = this._renderConfigs.get(name);
        if (rc) {
            rc.Use();
            return rc;
        }
        return this._defaultRenderConfig;
    }

    UseMaterial(rc: RenderConfig, mtllib: string, mtl: string) {

    }

    RenderMesh(name: string, rc: RenderConfig) {
        let mesh = this._meshes.get(name);
        if (mesh) {
            mesh.Render(rc, this);
        }
    }

    RenderScene(shaderName: string) {

    }

    private processTextFile(data: string, name: string, path: string, assetType: SGAssetType): void {
        let textParser = new TextParser(data);

        switch (assetType) {
            // ".SCN"
            case SGAssetType.Scene:
                this.loadScene(textParser.lines, name, path);
                break;
            // ".OBJ"
            case SGAssetType.GeometryGroup:
                this.loadOBJ(textParser.lines, name, path);
                break;
            // ".MTL"
            case SGAssetType.MaterialLibrary:
                this.loadMTL(textParser.lines, name, path);
                break;
        }
    }

    private processTextureMap(image: HTMLImageElement, name: string, assetType: SGAssetType): void {
        let gl = this._renderingContext.gl;
        if (image.width = 6 * image.height) {
            let images: Array<ImageData> = new Array<ImageData>(6);
            Utils.SeparateCubeMapImages(image, images);
            let texture = gl.createTexture();
            if (texture) {
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                for (let i = 0; i < 6; i++) {
                    if (!images[i])
                        continue;
                    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[i]);
                }
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                this._cubeTextures.set(name, texture);
            }
        } else {
            let texture = gl.createTexture();
            if (texture) {
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.generateMipmap(gl.TEXTURE_2D);
                this._textures.set(name, texture);
            }
        }
    }

    private loadScene(lines: string[][], name: string, path: string): void {
        // sundir <direction: Vector3>
        // camera <eye: Vector3> <center: Vector3> <up: Vector3>
        // transform <worldMatrix: Matrix4>
        // geometryGroup <objUrl: string>

        for (let tokens of lines) {
            if (tokens[0] == "geometryGroup") {
                this.Load(path + tokens[1]);
            }
        }
    }

    private loadOBJ(lines: string[][], name: string, path: string): void {
        // mtllib <mtlUrl: string>
        // usemtl <name: string>
        // v <position: Vector3>
        // vn <normal: Vector3>
        // vt <texcoord: Vector2|Vector3>
        // vc <color: Vector4>
        // f <v1: number> <v2: number> <v3: number>
        // f <v1: number>/<vt1:number> <v2: number>/<vt2:number> <v2: number>/<vt2:number>
        // f <v1: number>//<vt1:number> <v2: number>//<vt2:number> <v2: number>//<vt2:number>
        // f <v1: number>/<vn1:number>/<vt1:number> <v2: number>/<vn2:number>/<vt2:number> <v2: number>/<vn3:number>/<vt2:number>
        // o <objectName: string>
        // g <newSmoothingGroup: string>
        // s <newSmoothingGroup: string>

        let gl = this._renderingContext.gl;
        let positions: Vector3[] = [];
        let normals: Vector3[] = [];
        let colors: Vector3[] = [];
        let texcoords: Vector3[] = [];
        let mesh: IndexedGeometryMesh = new IndexedGeometryMesh(this._renderingContext);

        // in case there are no mtllib's, usemtl's, o's, g's, or s's
        mesh.BeginSurface(gl.TRIANGLES);
        for (let tokens of lines) {
            if (tokens.length >= 2) {
                if (tokens[0] == "mtllib") {
                    this.Load(path + tokens[1]);
                    mesh.SetMtllib(TextParser.ParseIdentifier(tokens));
                    mesh.BeginSurface(gl.TRIANGLES);
                } else if (tokens[1] == "usemtl") {
                    mesh.SetMtl(TextParser.ParseIdentifier(tokens));
                    mesh.BeginSurface(gl.TRIANGLES);
                } else if (tokens[1] == "o") {
                    mesh.BeginSurface(gl.TRIANGLES);
                } else if (tokens[1] == "g") {
                    mesh.BeginSurface(gl.TRIANGLES);
                } else if (tokens[1] == "s") {
                    mesh.BeginSurface(gl.TRIANGLES);
                }
            }
            if (tokens.length >= 4) {
                if (tokens[0] == "v") {
                    positions.push(TextParser.ParseVector(tokens));
                } else if (tokens[0] == "vn") {
                    normals.push(TextParser.ParseVector(tokens));
                } else if (tokens[0] == "vt") {
                    texcoords.push(TextParser.ParseVector(tokens));
                } else if (tokens[0] == "f") {
                    let indices = TextParser.ParseFace(tokens);
                    for (let i = 0; i < 3; i++) {
                        try {
                            mesh.SetNormal(normals[indices[i * 3 + 2]]);
                            mesh.SetTexCoord(texcoords[indices[i * 3 + 1]]);
                            mesh.AddVertex(positions[indices[i * 3 + 0]]);
                            mesh.AddIndex(-1);
                        }
                        catch (s) {
                            console.log(s);
                        }
                    }
                }
            }
        }

        mesh.BuildBuffers();
        this._meshes.set(name, mesh);
    }

    private loadMTL(lines: string[][], name: string, path: string): void {
        // newmtl <name: string>
        // Kd <color: Vector3>
        // Ks <color: Vector3>
        // map_Kd <url: string>
        // map_Ks <url: string>
        // map_normal <url: string>

        for (let tokens of lines) {
            if (tokens[0] == "map_Kd") {
                this.Load(path + tokens[1]);
            }
            else if (tokens[0] == "map_Ks") {
                this.Load(path + tokens[1]);
            }
            else if (tokens[0] == "map_normal") {
                this.Load(path + tokens[1]);
            }
            else {
                console.log("MTLLIB: Ignoring");
                for (let t of tokens) {
                    console.log("\"" + t + "\"");
                }
            }
        }
    }
}