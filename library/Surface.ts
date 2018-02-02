class Surface {
    public count: number = 0;
    constructor(readonly mode: number, readonly offset: number,
        readonly mtllib: string, readonly mtl: string) {
    }
    Add(): void {
        this.count++;
    }
}