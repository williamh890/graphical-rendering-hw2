class HW0StaticVertexBufferObject {
    public buffer: WebGLBuffer | null = null;
    private gl: WebGLRenderingContext | null = null;
    private bufferLength: number = 0;
    private count: number = 0;
    constructor(gl: WebGLRenderingContext, private drawArraysMode: number, vertexData: Float32Array) {
        this.buffer = gl.createBuffer();
        if (!this.buffer)
            return;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
        this.bufferLength = vertexData.length * 3;
        this.count = vertexData.length / 3;
        this.gl = gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    Render(vertexLoc: number): void {
        if (!this.buffer || !this.gl || vertexLoc < 0)
            return;
        let gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.vertexAttribPointer(vertexLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vertexLoc);
        gl.drawArrays(this.drawArraysMode, 0, this.count);
        gl.disableVertexAttribArray(vertexLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}