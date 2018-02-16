
class WebGLAppHW2 {
    private renderingContext: RenderingContext;
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
        this.loadShaders();
        this.scenegraph.Load("../assets/hw2.scn");
        this.scenegraph.Load("../assets/skybox.scn")
    }

    private loadShaders() {
        this.scenegraph.AddRenderConfig("default",
            "shaders/rtr-homework2.vert",
            "shaders/rtr-homework2.frag");
        this.scenegraph.AddRenderConfig("skybox",
            "shaders/skybox.vert", "shaders/skybox.frag");
    }

    private mainloop(timestamp: number): void {
        let self = this;
        this.t0 = this.t1;
        this.t1 = timestamp / 1000.0;
        this.dt = this.t1 - this.t0;
        this.update();
        this.display();
        setTimeout(function () { }, 0);
        window.requestAnimationFrame((t: number) => {
            self.mainloop(t);
        });
    }

    private update(): void {
        // update sim/game loop code here
        // this.t1 = elapsed time of program
        // this.dt = elapsed time between frames
        let el: HTMLInputElement | null = <HTMLInputElement>document.getElementById("checkReloadShaders");
        if (el && el.checked) {
            this.loadShaders();
            el.checked = false;
        }
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
            rc.SetMatrix4f("WorldMatrix", Matrix4.makeRotation(this.t1 * 10.0, 0.0, 1.0, 0.0));

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
            rc.SetMatrix4f("ProjectionMatrix", Matrix4.makePerspectiveX(45.0, this.renderingContext.aspectRatio, 0.1, 100.0));
            rc.SetMatrix4f("CameraMatrix", Matrix4.makeTranslation(0.0, 0.0, Math.sin(0.25 * this.t1) * 0.25 - 2.0));
            rc.SetMatrix4f("WorldMatrix", Matrix4.makeRotation(10 * this.t1, 0.0, 1.0, 0.0));

            rc.SetUniform1f("PageValue1", this.getRangeValue(1));
            rc.SetUniform1f("PageValue2", this.getRangeValue(2));

            this.scenegraph.UseTexture("enviroCube", 10);
            rc.SetUniform1i("EnviroCube", 10);

            // "" renders everything
            this.scenegraph.RenderScene("default", "hw2.scn");
            this.scenegraph.UseTexture("enviroCube", 10, false);
            rc.Restore();
        }

        gl.useProgram(null);
    }

    private getRangeValue(index: number): number {
        if (index <= 0 || index > 4)
            return 0.0;
        let el: HTMLInputElement | null = <HTMLInputElement>document.getElementById("value" + index);
        if (el && el.value) {
            let svalue: string | null = el.value;
            if (svalue)
                return parseFloat(svalue);
        }
        return 0.0;
    }
}
