class HW0ShaderProgram {
    private program_: WebGLProgram | null = null;
    constructor(private gl: WebGLRenderingContext, public vertShaderSource: string, public fragShaderSource: string) {
        let vshader = this.createShader(gl.VERTEX_SHADER, vertShaderSource);
        let fshader = this.createShader(gl.FRAGMENT_SHADER, fragShaderSource);
        if (!vshader || !fshader)
            return;
        this.program_ = gl.createProgram();
        if (!this.program_)
            return;
        gl.attachShader(this.program_, vshader);
        gl.attachShader(this.program_, fshader);
        gl.linkProgram(this.program_);
        if (!gl.getProgramParameter(this.program_, gl.LINK_STATUS)) {
            console.error("Program Link Error")
            console.error(this.gl.getProgramInfoLog(this.program_));
            gl.deleteShader(vshader);
            gl.deleteShader(fshader);
            gl.deleteProgram(this.program_);
            this.program_ = null;
            return;
        }
    }

    Use(): void {
        if (!this.program_)
            return;
        this.gl.useProgram(this.program_);
    }

    GetVertexPosition(vertexName: string): number {
        return this.gl.getAttribLocation(this.program_, vertexName);
    }

    private createShader(type: number, sourceCode: string): WebGLShader | null {
        let shader = this.gl.createShader(type);
        if (!shader)
            return null;
        this.gl.shaderSource(shader, sourceCode);
        this.gl.compileShader(shader);
        let status = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        if (!status) {
            if (type == this.gl.VERTEX_SHADER) console.error("Vertex shader compile error");
            if (type == this.gl.FRAGMENT_SHADER) console.error("Fragment shader compile error");
            console.error(this.gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }
}

