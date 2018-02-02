
class WebGLAppHW0 {
    private renderingContext: RenderingContext | undefined;
    private vbo: HW0StaticVertexBufferObject | null = null;
    private scenegraph: Scenegraph;
    private aspectRatio: number = 1.0;

    constructor(public width: number = 512, public height: number = 384) {
        this.renderingContext = new RenderingContext(width, height);
        if (!this.renderingContext)
            throw "Unable to create rendering context!";
        this.scenegraph = new Scenegraph(this.renderingContext);
    }

    run(): void {
        if (!this.renderingContext) return;
        this.init();
        this.mainloop(0);
    }

    private mainloop(timestamp: number): void {
        let self = this;
        this.display(timestamp / 1000.0);
        window.requestAnimationFrame((t: number) => {
            self.mainloop(t);
        });
    }

    private init(): void {
        if (!this.renderingContext) return;
        let gl = this.renderingContext.gl;
        this.vbo = new HW0StaticVertexBufferObject(gl, gl.TRIANGLES, new Float32Array([
            -1, -1, 0,
            1, -1, 0,
            0, 1, 0
        ]));
        this.scenegraph.AddRenderConfig("default", "rtr-homework0-shader.vert", "rtr-homework0-shader.frag");
        this.scenegraph.Load("../assets/test_scene.scn");
    }

    private display(t: number): void {
        if (!this.renderingContext) return;
        let gl = this.renderingContext.gl;
        gl.clearColor(0.2, 0.15 * Math.sin(t) + 0.15, 0.4, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, this.renderingContext.width, this.renderingContext.height);
        let rc = this.scenegraph.UseRenderConfig("default");
        if (this.vbo) {
            rc.Use();
            rc.SetUniform3f("SunDirTo", Vector3.makeUnit(0.25, 0.5, Math.sin(t)));
            rc.SetUniform3f("SunE0", Vector3.make(1.0, 1.0, 1.0).mul(Math.sin(t)));
            rc.SetMatrix4("ProjectionMatrix", Matrix4.makePerspectiveX(45.0, this.aspectRatio, 0.1, 100.0));
            rc.SetMatrix4("CameraMatrix", Matrix4.makeTranslation(0.0, 0.0, -10.0));
            rc.SetMatrix4("WorldMatrix", Matrix4.makeRotation(10 * t, 0.0, 1.0, 0.0));
            this.vbo.Render(rc.GetAttribLocation("aPosition"));

            //this.scenegraph.Render("teapot");
        }
        gl.useProgram(null);
    }
}