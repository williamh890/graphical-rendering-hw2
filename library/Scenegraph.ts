

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
    private _tempNode: ScenegraphNode = new ScenegraphNode("working");

    private _defaultRenderConfig: RenderConfig;

    constructor(private renderingContext: RenderingContext) {
        this._defaultRenderConfig = new RenderConfig(this.renderingContext,
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
            this._renderConfigs.set(name, new RenderConfig(this.renderingContext, vertShaderSource, fragShaderSource));
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

    private processTextFile(data: string, name: string, path: string, assetType: SGAssetType): void {
        // split into lines
        let lines = data.split(/[\n\r]+/);

        for (let line of lines) {
            let splittokens = line.split(/\s+/);
            let tokens: string[] = [];
            for (let t of splittokens) {
                if (t.length != 0)
                    tokens.push(t);
            }

            // ignore blank lines
            if (tokens.length == 0) {
                continue;
            }
            // ignore comments
            if (tokens[0] == '#') {
                continue;
            }

            // console.log(name + ": " + line);

            switch (assetType) {
                // ".SCN"
                case SGAssetType.Scene:
                    this.processSceneTokens(tokens, path);
                    break;
                // ".OBJ"
                case SGAssetType.GeometryGroup:
                    this.processGeometryGroupTokens(tokens, path);
                    break;
                // ".MTL"
                case SGAssetType.MaterialLibrary:
                    console.log("MTLLIB: " + line);
                    this.processMaterialLibraryTokens(tokens, path);
                    break;
            }
        }
    }

    private processTextureMap(image: HTMLImageElement, name: string, assetType: SGAssetType): void {
        let gl = this.renderingContext.gl;
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

    private processSceneTokens(tokens: string[], path: string): void {
        // sundir <direction: Vector3>
        // camera <eye: Vector3> <center: Vector3> <up: Vector3>
        // transform <worldMatrix: Matrix4>
        // geometryGroup <objUrl: string>

        if (tokens[0] == "geometryGroup") {
            this.Load(path + tokens[1]);
        }
    }

    private processGeometryGroupTokens(tokens: string[], path: string): void {
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

        if (tokens[0] == "mtllib") {
            this.Load(path + tokens[1]);
        }
    }

    private processMaterialLibraryTokens(tokens: string[], path: string): void {
        // newmtl <name: string>
        // Kd <color: Vector3>
        // Ks <color: Vector3>
        // map_Kd <url: string>
        // map_Ks <url: string>
        // map_normal <url: string>

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