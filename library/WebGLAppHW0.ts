
class WebGLAppHW0 {
    private renderingContext: RenderingContext;
    private vbo: HW0StaticVertexBufferObject | null = null;
    private scenegraph: Scenegraph;
    private aspectRatio: number = 1.0;
    private t0: number = 0;
    private t1: number = 0;
    private dt: number = 0;

    constructor(public width: number = 512, public height: number = 384) {
        this.renderingContext = new RenderingContext(width, height);
        if (!this.renderingContext)
            throw "Unable to create rendering context!";
        this.scenegraph = new Scenegraph(this.renderingContext);
    }

    run(): void {
        this.init();
        this.mainloop(0);
    }

    private init(): void {
        let gl = this.renderingContext.gl;
        this.vbo = new HW0StaticVertexBufferObject(gl, gl.TRIANGLES, new Float32Array([
            -1, -1, 0,
            1, -1, 0,
            0, 1, 0
        ]));
        this.scenegraph.AddRenderConfig("default",
            "shaders/rtr-homework0.vert",
            "shaders/rtr-homework0.frag");
    }

    private mainloop(timestamp: number): void {
        let self = this;
        this.t0 = this.t1;
        this.t1 = timestamp / 1000.0;
        this.dt = this.t1 - this.t0;
        this.update();
        this.display();
        window.requestAnimationFrame((t: number) => {
            self.mainloop(t);
        });
    }

    private update(): void {
        // update sim/game loop code here
        // this.t1 = elapsed time of program
        // this.dt = elapsed time between frames
    }

    private display(): void {
        if (!this.renderingContext) return;
        let gl = this.renderingContext.gl;
        gl.clearColor(0.2, 0.2 + 0.2 * Math.sin(this.t1), 0.2, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, this.renderingContext.width, this.renderingContext.height);
        let rc = this.scenegraph.UseRenderConfig("default");
        if (rc.usable && this.vbo) {
            rc.Use();
            rc.SetUniform3f("SunDirTo", Vector3.makeUnit(0.25, 0.5, Math.sin(this.t1)));
            rc.SetUniform3f("SunE0", Vector3.make(1.0, 1.0, 1.0).mul(Math.sin(this.t1)));
            rc.SetMatrix4f("ProjectionMatrix", Matrix4.makePerspectiveX(45.0, this.renderingContext.aspectRatio, 0.1, 100.0));
            rc.SetMatrix4f("CameraMatrix", Matrix4.makeTranslation(0.0, 0.0, -5.0));
            rc.SetMatrix4f("WorldMatrix", Matrix4.makeRotation(10 * this.t1, 0.0, 1.0, 0.0));
            this.vbo.Render(rc.GetAttribLocation("aPosition"));
            rc.Restore();
        }
        gl.useProgram(null);
    }
}