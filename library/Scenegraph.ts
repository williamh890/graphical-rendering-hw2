

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

    constructor(public name: string = "unknown", public parent: string = "unknown") {
    }
}


class Texture {
    public id: string = "";

    constructor(private _renderingContext: RenderingContext,
        public name: string, public url: string, public target: number, public texture: WebGLTexture) {
    }
}


class Scenegraph {
    private textfiles: Utils.TextFileLoader[] = [];
    private imagefiles: Utils.ImageFileLoader[] = [];
    private shaderSrcFiles: Utils.ShaderLoader[] = [];

    private _renderConfigs: Map<string, RenderConfig> = new Map<string, RenderConfig>();
    //private _cubeTextures: Map<string, WebGLTexture> = new Map<string, WebGLTexture>();
    private _textures: Map<string, Texture> = new Map<string, Texture>();
    private _materials: Map<string, Material> = new Map<string, Material>();
    private _sceneResources: Map<string, string> = new Map<string, string>();
    private _nodes: Array<ScenegraphNode> = [];
    private _meshes: Map<string, IndexedGeometryMesh> = new Map<string, IndexedGeometryMesh>();
    private _tempNode: ScenegraphNode = new ScenegraphNode("", "");

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
            if (this._textures.has(name))
                return;
            this.imagefiles.push(new Utils.ImageFileLoader(url, (data, name, assetType) => {
                self.processTextureMap(data, name, assetType);
                console.log("Scenegraph::Load() => loaded " + self.percentLoaded + "% " + name);
                let log = document.getElementById("log");
                if (log) {
                    log.appendChild(document.createElement("br"));
                    log.appendChild(document.createTextNode("Loaded " + Math.round(self.percentLoaded) + "% " + name));
                }
            }));
        } else {
            this.textfiles.push(new Utils.TextFileLoader(url, (data, name, assetType) => {
                self.processTextFile(data, name, path, assetType);
                console.log("Scenegraph::Load() => loaded " + self.percentLoaded + "% " + name);
                let log = document.getElementById("log");
                if (log) {
                    log.appendChild(document.createElement("br"));
                    log.appendChild(document.createTextNode("Loaded " + Math.round(self.percentLoaded) + "% " + name));
                }
            }, assetType));
        }
    }

    AddRenderConfig(name: string, vertshaderUrl: string, fragshaderUrl: string) {
        let self = this;
        this.shaderSrcFiles.push(new Utils.ShaderLoader(vertshaderUrl, fragshaderUrl, (vertShaderSource: string, fragShaderSource: string) => {
            this._renderConfigs.set(name, new RenderConfig(this._renderingContext, vertShaderSource, fragShaderSource));
            console.log("Scenegraph::Load() => loaded " + vertshaderUrl);
            console.log("Scenegraph::Load() => loaded " + fragshaderUrl);
            console.log("Scenegraph::Load() => loaded " + self.percentLoaded + "% " + name);
            let log = document.getElementById("log");
            if (log) {
                log.appendChild(document.createElement("br"));
                log.appendChild(document.createTextNode("Loaded " + Math.round(self.percentLoaded) + "% " + name));
            }
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
        let gl = this._renderingContext.gl;
        for (let ml of this._materials) {
            console.log("Material: ", ml);
            if (ml["0"] == mtllib && ml["1"].name == mtl) {
                let m = ml["1"];
                let tnames = ["map_Kd", "map_normal", "map_Ks"];
                let textures = [m.map_Kd, m.map_normal, m.map_Ks];
                for (let i = 0; i < textures.length; i++) {
                    let loc = rc.GetUniformLocation(tnames[i]);
                    if (loc && loc >= 0) {
                        this.UseTexture(textures[i], i);
                        rc.SetUniform1i(tnames[i], i);
                    }
                }

                let mnames = ["map_Kd_mix", "map_normal_mix", "map_Ks_mix", "PBKdm", "PBKsm", "PBn2", "PBk2"];
                let mvalues = [m.map_Kd_mix, m.map_normal_mix, m.PBKdm, m.PBKsm, m.PBn2, m.PBk2];
                for (let i = 0; i < mnames.length; i++) {
                    let mix_loc = rc.GetUniformLocation(mnames[i]);
                    if (!mix_loc || mix_loc < 0) {
                        throw new Error(`error getting vec3 uniform: ${mix_loc}`);
                    }

                    rc.SetUniform1f(tnames[i], mvalues[i]);
                }

                // TODO: Add these params:
                // Ka r g b
                // Kd r g b
                // Ks r g b
                const kvalues: Array<[string, Vector3]> = [["Ka", m.Ka], ["Kd", m.Kd], ["Ks", m.Ks]];
                for (const [key, val] of kvalues)  {
                    const loc = rc.GetUniformLocation(key);
                    console.log("location for ", key, loc);
                    if (!loc || loc < 0) {
                        throw new Error(`error getting vec3 uniform: ${key}`);
                    }

                    rc.SetUniform3f(key, val);
                }
            }
        }
    }

    RenderMesh(name: string, rc: RenderConfig) {
        if (name.length == 0) {
            for (let mesh of this._meshes) {
                mesh["1"].Render(rc, this);
            }
            return;
        }
        let mesh = this._meshes.get(name);
        if (mesh) {
            mesh.Render(rc, this);
        }
    }

    UseTexture(textureName: string, unit: number, enable: boolean = true) {
        let texunit = unit | 0;
        let gl = this._renderingContext.gl;

        let minFilter = gl.LINEAR_MIPMAP_LINEAR;
        let magFilter = gl.NEAREST;

        let t = this._textures.get(textureName);
        if (!t) {
            let alias = this._sceneResources.get(textureName);
            if (alias) {
                t = this._textures.get(alias);
            }
        }
        if (t) {
            if (unit <= 31) {
                unit += gl.TEXTURE0;
            }
            gl.activeTexture(unit);
            if (enable) {
                gl.bindTexture(t.target, t.texture)
                gl.texParameteri(t.target, gl.TEXTURE_MIN_FILTER, minFilter);
                gl.texParameteri(t.target, gl.TEXTURE_MAG_FILTER, magFilter);
            } else {
                gl.bindTexture(t.target, null);
            }
        }
        if (!t) {
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

        }
        gl.activeTexture(gl.TEXTURE0);
    }

    RenderScene(shaderName: string, sceneName: string) {
        let rc = this.UseRenderConfig(shaderName);
        if (!rc) {
            console.error("Scenegraph::RenderScene(): \"" + shaderName + "\" is not a render config");
            return;
        }
        for (let node of this._nodes) {
            if (sceneName.length > 0 && node.parent != sceneName) {
                continue;
            }

            let mesh = this._meshes.get(node.name);
            if (mesh) {
                mesh.Render(rc, this);
            }
        }
        rc.Restore();
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

        let minFilter = gl.NEAREST;
        let magFilter = gl.NEAREST;

        let ext = gl.getExtension("EXT_texture_filter_anisotropic")
        if (ext) {
            magFilter = ext.TEXTURE_MAX_ANISOTROPY_EXT;
        }

        if (image.width == 6 * image.height) {
            let images: Array<ImageData> = new Array<ImageData>(6);
            Utils.SeparateCubeMapImages(image, images);
            let texture = gl.createTexture();
            if (texture) {
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                for (let i = 0; i < 6; i++) {
                    if (!images[i]) {
                        continue;
                    } else {
                        console.log("image " + i + " w:" + images[i].width + "/h:" + images[i].height);
                    }
                    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[i]);
                }
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                let t = new Texture(this._renderingContext, name, name, gl.TEXTURE_CUBE_MAP, texture);
                this._textures.set(name, t);
            }
        } else {
            let texture = gl.createTexture();
            if (texture) {
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
                if (ext) {
                    gl.texParameteri(gl.TEXTURE_2D, magFilter, 16);
                }
                let t = new Texture(this._renderingContext, name, name, gl.TEXTURE_2D, texture);
                this._textures.set(name, t);
            }
        }
    }

    private loadScene(lines: string[][], name: string, path: string): void {
        // sundir <direction: Vector3>
        // camera <eye: Vector3> <center: Vector3> <up: Vector3>
        // transform <worldMatrix: Matrix4>
        // geometryGroup <objUrl: string>

        for (let tokens of lines) {
            if (tokens[0] == "enviroCube") {
                this._sceneResources.set("enviroCube", Utils.GetURLResource(tokens[1]));
                this.Load(path + tokens[1]);
            }
            else if (tokens[0] == "transform") {
                this._tempNode.transform = TextParser.ParseMatrix(tokens);
            }
            else if (tokens[0] == "geometryGroup") {
                this._tempNode.parent = name;
                this._tempNode.name = tokens[1];
                this._tempNode.geometryGroup = TextParser.ParseIdentifier(tokens);
                this.Load(path + tokens[1]);
                this._nodes.push(this._tempNode);
                this._tempNode = new ScenegraphNode();
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
                            if (indices[i * 3 + 2] >= 0)
                                mesh.SetNormal(normals[indices[i * 3 + 2]]);
                            if (indices[i * 3 + 1] >= 0)
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
            else if (tokens.length >= 2) {
                if (tokens[0] == "mtllib") {
                    this.Load(path + tokens[1]);
                    mesh.SetMtllib(TextParser.ParseIdentifier(tokens));
                    mesh.BeginSurface(gl.TRIANGLES);
                } else if (tokens[0] == "usemtl") {
                    mesh.SetMtl(TextParser.ParseIdentifier(tokens));
                    mesh.BeginSurface(gl.TRIANGLES);
                } else if (tokens[0] == "o") {
                    mesh.BeginSurface(gl.TRIANGLES);
                } else if (tokens[0] == "g") {
                    mesh.BeginSurface(gl.TRIANGLES);
                } else if (tokens[0] == "s") {
                    mesh.BeginSurface(gl.TRIANGLES);
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
        let mtl = "";
        let mtllib = TextParser.MakeIdentifier(name);
        let curmtl: Material | undefined;
        console.log("LOADING MATERIAL ", name);

        for (let tokens of lines) {
            if (tokens.length >= 2) {
                const firstToken = tokens[0];

                if (!curmtl) {
                    if (firstToken == "newmtl") {
                        mtl = TextParser.MakeIdentifier(tokens[1]);
                        console.log("Starting new material...", mtl)
                        curmtl = new Material(mtl);
                        this._materials.set(mtllib, curmtl);
                    }

                    continue;
                }

                // Material is set
                switch(firstToken) {
                    case "map_Kd": {
                        curmtl.map_Kd = TextParser.MakeIdentifier(tokens[1]);
                        curmtl.map_Kd_mix = 1.0;
                        this.Load(path + tokens[1]);

                        break;
                    }

                    case "map_Ks": {
                        const textureFile = TextParser.MakeIdentifier(tokens[1]);
                        curmtl.map_Ks = textureFile;
                        curmtl.map_Ks_mix = 1.0;

                        this.Load(path + tokens[1]);

                        break;
                    }

                    case "map_normal": {
                        curmtl.map_normal = TextParser.MakeIdentifier(tokens[1]);
                        curmtl.map_normal_mix = 2.0;
                        this.Load(path + tokens[1]);

                        break;
                    }

                    case "map_Kd_mix": {
                        const amount = +tokens[1];
                        curmtl.map_Kd_mix = amount;

                        break;
                    }

                    case "map_Ks_mix": {
                        const amount = +tokens[1];
                        curmtl.map_Ks_mix = amount;

                        break;
                    }

                    case "map_normal_mix": {
                        const amount = +tokens[1];
                        curmtl.map_normal_mix = amount;

                        break;
                    }

                    case "PBn2": {
                        curmtl.PBn2 = parseFloat(tokens[1]);

                        break;
                    }
                    case "Ka": {
                        const ka = TextParser.ParseVector(tokens);
                        curmtl.Ka = ka

                        break;
                    }
                    case "Kd": {
                        const kd = TextParser.ParseVector(tokens);
                        curmtl.Kd = kd

                        break;
                    }
                    case "Ks": {
                        const ks = TextParser.ParseVector(tokens);
                        curmtl.Ks = ks

                        break;
                    }
                    case "PBKdm": {
                        const roughness = +tokens[1];
                        console.log("adding PBKdm: ", roughness);
                        curmtl.PBKdm = roughness;

                        break;
                    }
                    case "PBKsm": {
                        const roughness = +tokens[1];
                        console.log("adding PBKsm: ", roughness);
                        curmtl.PBKdm = roughness;

                        break;
                    }
                    case "PBn2": {
                        const indexOfRefaction = +tokens[1];
                        curmtl.PBn2 = indexOfRefaction;

                        break;
                    }
                    case "PBk2": {
                        const absorbtibeIndex = +tokens[1];
                        curmtl.PBk2 = absorbtibeIndex;

                        break;
                    }
                }
            }
        }
    }
}
