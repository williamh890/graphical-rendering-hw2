
class IndexedGeometryMesh {
    public vertices: Vertex[] = [];
    public indices: number[] = [];
    public surfaces: Surface[] = [];

    private _mtllib: string = "";
    private _mtl: string = "";
    private _vertex: Vertex = new Vertex();

    constructor(private _renderingContext: RenderingContext) {
    }

    SetMtllib(mtllib: string): void {
        this._mtllib = mtllib;
    }
    SetMtl(mtl: string): void {
        this._mtl = mtl;
    }
    BeginSurface(mode: number) {
        if (this.surfaces.length == 0) {
            // if no surfaces exist, add one
            this.surfaces.push(new Surface(mode, this.indices.length, this._mtllib, this._mtl));
        }
        else if (this.currentIndexCount != 0) {
            // do not add a surface if the most recent one is empty
            this.surfaces.push(new Surface(mode, this.indices.length, this._mtllib, this._mtl));
        }
    }
    AddIndex(i: number): void {
        if (this.surfaces.length == 0) return;
        if (i < 0) {
            this.indices.push(this.vertices.length - i);
        } else {
            this.indices.push(i);
        }
        this.surfaces[this.surfaces.length - 1].Add();
    }
    get currentIndexCount(): number {
        if (this.surfaces.length == 0)
            return 0;
        return this.surfaces[this.surfaces.length - 1].count;
    }

    SetNormal(n: Vector3): void {
        this._vertex.normal.copy(n);
    }
    SetColor(c: Vector3): void {
        this._vertex.color.copy(c);
    }
    SetTexCoord(t: Vector3): void {
        this._vertex.texcoord.copy(c);
    }
    AddVertex(v: Vector3): void {
        this._vertex.position.copy(v);
        this.vertices.push(this._vertex);
        this._vertex = new Vertex();
    }

    BuildBuffers(): void {
        // Building the VBO goes here
    }

    Render(rc: RenderConfig): void {
        // Rendering code goes here
    }
}