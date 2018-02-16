// Fluxions WebGL Library
// Copyright (c) 2017 - 2018 Jonathan Metzgar
// All Rights Reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
/// <reference path="GTE.ts" />
/// <reference path="Utils.ts" />
/// <reference path="RenderConfig.ts" />
/// // <reference path="Scenegraph.ts" />
/// // <reference path="IndexedGeometryMesh.ts" />
/// // <reference path="Texture.ts" />
/// // <reference path="MaterialLibrary.ts" />


class RenderingContext {
    private enabledExtensions: any[] = [];
    private divElement_: HTMLDivElement | null = null;
    private canvasElement_: HTMLCanvasElement | null = null;
    public gl: WebGLRenderingContext;
    public aspectRatio: number = 1.0;

    constructor(public width: number = 512, public height: number = 384) {
        this.divElement_ = document.createElement("div");
        this.canvasElement_ = document.createElement("canvas");
        this.canvasElement_.width = width;
        this.canvasElement_.height = height;
        if (this.canvasElement_) {
            let gl = this.canvasElement_.getContext("webgl");
            if (!gl) {
                gl = this.canvasElement_.getContext("experimental-webgl");
            }
            if (!gl) {
                this.divElement_.innerText = "WebGL not supported.";
                throw "Unable to create rendering context!";
            }
            else {
                this.gl = gl;
                this.divElement_.appendChild(this.canvasElement_);
                this.divElement_.align = "center";
                this.aspectRatio = width / height;
            }
        } else {
            throw "Unable to create canvas!";
        }
        document.body.appendChild(this.divElement_);

        this.EnableExtensions([
            "OES_standard_derivatives",
            "WEBGL_depth_texture",
            "OES_texture_float",
            "OES_element_index_uint"
        ]);
    }

    // ...
    EnableExtensions(names: string[]): boolean {
        let supportedExtensions = this.gl.getSupportedExtensions();
        if (!supportedExtensions)
            return false;
        let allFound = true;
        for (var name of names) {
            let found = false;
            for (var ext of supportedExtensions) {
                if (name == ext) {
                    this.enabledExtensions.push(this.gl.getExtension(name));
                    console.log("Extension " + name + " enabled")
                    found = true;
                    break;
                }
            }
            if (!found) {
                console.log("Extension " + name + " not enabled")
                allFound = false;
                break;
            }
        }
        return allFound;
    }
}