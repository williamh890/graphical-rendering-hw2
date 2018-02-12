
class WebGLAppHW2_texfiltering {
    private renderingContext: RenderingContext;
    private scenegraph: Scenegraph;
    private aspectRatio: number = 1.0;
    private t0: number = 0;
    private t1: number = 0;
    private dt: number = 0;
    private sceneName: string = "hw2.scn";

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
        this.scenegraph.AddRenderConfig("default",
            "shaders/rtr-homework2.vert",
            "shaders/rtr-homework2.frag");
        this.scenegraph.AddRenderConfig("skybox",
            "shaders/skybox.vert", "shaders/skybox.frag");
        this.scenegraph.Load("../assets/" + this.sceneName);
        this.scenegraph.Load("../assets/skybox.scn")
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
        gl.clearColor(0.2, 0.15 * Math.sin(this.t1) + 0.15, 0.4, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, this.renderingContext.width, this.renderingContext.height);
        let rc = this.scenegraph.UseRenderConfig("skybox");
        if (rc) {
            rc.depthMask = false;
            rc.useDepthTest = false;
            rc.Use();
            rc.SetMatrix4f("ProjectionMatrix", Matrix4.makePerspectiveX(90.0, this.renderingContext.aspectRatio, 0.1, 100.0));
            rc.SetMatrix4f("CameraMatrix", Matrix4.makeTranslation(0.0, 0.0, 0.0));
            rc.SetMatrix4f("WorldMatrix", Matrix4.makeRotation(0.0, 0.0, 1.0, 0.0));

            this.scenegraph.UseTexture("enviroCube", 10);
            rc.SetUniform1i("EnviroCube", 10);

            // "" renders everything
            this.scenegraph.RenderScene("skybox", "skybox.scn");
            this.scenegraph.UseTexture("enviroCube", 10, false);
            rc.Restore();
        }
        rc = this.scenegraph.UseRenderConfig("default");
        if (rc) {
            rc.Use();
            rc.SetUniform3f("SunDirTo", Vector3.makeUnit(0, 1, 0));
            rc.SetUniform3f("SunE0", Vector3.make(1.0, 1.0, 1.0));
            rc.SetMatrix4f("ProjectionMatrix", Matrix4.makePerspectiveX(45.0, this.renderingContext.aspectRatio, 0.1, 500.0));
            rc.SetMatrix4f("CameraMatrix", Matrix4.makeTranslation(0.0, 0.0, -2.0));
            rc.SetMatrix4f("WorldMatrix", Matrix4.makeRotation(45.0, 0.0, 1.0, 0.0));

            this.scenegraph.UseTexture("enviroCube", 10);
            rc.SetUniform1i("EnviroCube", 10);

            // "" renders everything
            this.scenegraph.RenderScene("default", this.sceneName);
            this.scenegraph.UseTexture("enviroCube", 10, false);
            rc.Restore();
        }

        gl.useProgram(null);
    }
}