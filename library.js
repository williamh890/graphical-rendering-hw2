"use strict";
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
class Vector2 {
    constructor(x = 0.0, y = 0.0) {
        this.x = x;
        this.y = y;
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }
    reset(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }
    sub(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }
    mul(multiplicand) {
        return new Vector2(this.x * multiplicand, this.y * multiplicand);
    }
    // returns 0 if denominator is 0
    div(divisor) {
        if (divisor == 0.0)
            return new Vector2();
        return new Vector2(this.x / divisor, this.y / divisor);
    }
    toFloat32Array() {
        return new Float32Array([this.x, this.y]);
    }
    toVector2() {
        return new Vector2(this.x, this.y);
    }
    toVector3() {
        return new Vector3(this.x, this.y, 0.0);
    }
    toVector4() {
        return new Vector4(this.x, this.y, 0.0, 0.0);
    }
    project() {
        return this.x / this.y;
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    lengthSquared() {
        return this.x * this.x + this.y * this.y;
    }
    norm() {
        let len = this.lengthSquared();
        if (len == 0.0)
            return new Vector2();
        else
            len = Math.sqrt(len);
        return new Vector2(this.x / len, this.y / len);
    }
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }
    static cross(a, b) {
        return a.x * b.y - a.y * b.x;
    }
    static normalize(v) {
        let len = v.length();
        if (len == 0.0) {
            v.reset(0.0, 0.0);
        }
        else {
            v.x /= len;
            v.y /= len;
        }
        return v;
    }
}
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
/// <reference path="./GTE.ts" />
class Vector3 {
    constructor(x = 0.0, y = 0.0, z = 0.0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }
    reset(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    static make(x, y, z) {
        return new Vector3(x, y, z);
    }
    static makeUnit(x, y, z) {
        return (new Vector3(x, y, z)).norm();
    }
    add(v) {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    sub(v) {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    mul(multiplicand) {
        return new Vector3(this.x * multiplicand, this.y * multiplicand, this.z * multiplicand);
    }
    // returns 0 if denominator is 0
    div(divisor) {
        if (divisor == 0.0)
            return new Vector3();
        return new Vector3(this.x / divisor, this.y / divisor, this.z / divisor);
    }
    toArray() {
        return [this.x, this.y, this.z];
    }
    toFloat32Array() {
        return new Float32Array([this.x, this.y, this.z]);
    }
    toVector2() {
        return new Vector2(this.x, this.y);
    }
    toVector4(w) {
        return new Vector4(this.x, this.y, this.z, w);
    }
    project() {
        return new Vector2(this.x / this.z, this.y / this.z);
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    lengthSquared() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    norm() {
        let len = this.lengthSquared();
        if (len == 0.0)
            return new Vector3();
        else
            len = Math.sqrt(len);
        return new Vector3(this.x / len, this.y / len, this.z / len);
    }
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.x * v2.y;
    }
    static cross(a, b) {
        return new Vector3(a.y * b.z - b.y * a.z, a.z * b.x - b.z * a.x, a.x * b.y - b.x * a.y);
    }
    static add(a, b) {
        return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
    }
    static sub(a, b) {
        return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
    }
    static mul(a, b) {
        return new Vector3(a.x * b.x, a.y * b.y, a.z * b.z);
    }
    static div(a, b) {
        return new Vector3(a.x / b.x, a.y / b.y, a.z / b.z);
    }
}
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
class Vector4 {
    constructor(x = 0.0, y = 0.0, z = 0.0, w = 1.0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = v.w;
        return this;
    }
    reset(x = 0.0, y = 0.0, z = 0.0, w = 1.0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        return this;
    }
    add(v) {
        return new Vector4(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w);
    }
    sub(v) {
        return new Vector4(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w);
    }
    mul(multiplicand) {
        return new Vector4(this.x * multiplicand, this.y * multiplicand, this.z * multiplicand, this.w * multiplicand);
    }
    // returns 0 if denominator is 0
    div(divisor) {
        if (divisor == 0.0)
            return new Vector4();
        return new Vector4(this.x / divisor, this.y / divisor, this.z / divisor, this.w / divisor);
    }
    toFloat32Array() {
        return new Float32Array([this.x, this.y, this.z, this.w]);
    }
    toArray() {
        return [this.x, this.y, this.z, this.w];
    }
    toVector2() {
        return new Vector2(this.x, this.y);
    }
    toVector3() {
        return new Vector3(this.x, this.y, this.z);
    }
    project() {
        return new Vector3(this.x / this.w, this.y / this.w, this.z / this.w);
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }
    lengthSquared() {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }
    norm() {
        let len = this.lengthSquared();
        if (len == 0.0)
            return new Vector4();
        else
            len = Math.sqrt(len);
        return new Vector4(this.x / len, this.y / len, this.z / len, this.w / len);
    }
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z + v1.w * v2.w;
    }
    static normalize(v) {
        let len = v.length();
        if (len == 0.0) {
            v.reset(0.0, 0.0, 0.0, 0.0);
        }
        else {
            v.x /= len;
            v.y /= len;
            v.z /= len;
            v.w /= len;
        }
        return v;
    }
}
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
class Matrix2 {
    constructor(m11, m21, m12, m22) {
        this.m11 = m11;
        this.m21 = m21;
        this.m12 = m12;
        this.m22 = m22;
    }
    static makeIdentity() {
        return new Matrix2(1, 0, 0, 1);
    }
    static makeZero() {
        return new Matrix2(0, 0, 0, 0);
    }
    static makeColMajor(m11, m21, m12, m22) {
        return new Matrix2(m11, m21, m12, m22);
    }
    static makeRowMajor(m11, m12, m21, m22) {
        return new Matrix2(m11, m21, m12, m22);
    }
    static fromRowMajorArray(v) {
        if (v.length >= 4)
            return new Matrix2(v[0], v[2], v[1], v[3]);
        return new Matrix2(0, 0, 0, 0);
    }
    static fromColMajorArray(v) {
        if (v.length >= 4)
            return new Matrix2(v[0], v[1], v[2], v[3]);
        return new Matrix2(0, 0, 0, 0);
    }
    static makeScale(x, y) {
        return Matrix2.makeRowMajor(x, 0, 0, y);
    }
    static makeRotation(angleInDegrees, x, y, z) {
        var c = Math.cos(angleInDegrees * Math.PI / 180.0);
        var s = Math.sin(angleInDegrees * Math.PI / 180.0);
        return Matrix2.makeRowMajor(c, -s, s, c);
    }
    asColMajorArray() {
        return [
            this.m11, this.m21,
            this.m12, this.m22
        ];
    }
    asRowMajorArray() {
        return [
            this.m11, this.m12,
            this.m21, this.m22
        ];
    }
    static multiply(m1, m2) {
        return new Matrix2(m1.m11 * m2.m11 + m1.m21 * m2.m12, m1.m11 * m2.m21 + m1.m21 * m2.m22, m1.m12 * m2.m11 + m1.m22 * m2.m12, m1.m12 * m2.m21 + m1.m22 * m2.m22);
    }
    copy(m) {
        this.m11 = m.m11;
        this.m21 = m.m21;
        this.m12 = m.m12;
        this.m22 = m.m22;
        return this;
    }
    concat(m) {
        this.copy(Matrix2.multiply(this, m));
        return this;
    }
    transform(v) {
        return new Vector2(this.m11 * v.x + this.m12 * v.y, this.m21 * v.x + this.m22 * v.y);
    }
    asInverse() {
        var tmpD = 1.0 / (this.m11 * this.m22 - this.m12 * this.m21);
        return Matrix2.makeRowMajor(this.m22 * tmpD, -this.m12 * tmpD, -this.m21 * tmpD, this.m11 * tmpD);
    }
    asTranspose() {
        return Matrix2.makeRowMajor(this.m11, this.m21, this.m12, this.m22);
    }
} // class Matrix2
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
/// <reference path="GTE.ts"/>
class Matrix3 {
    constructor(m11, m21, m31, m12, m22, m32, m13, m23, m33) {
        this.m11 = m11;
        this.m21 = m21;
        this.m31 = m31;
        this.m12 = m12;
        this.m22 = m22;
        this.m32 = m32;
        this.m13 = m13;
        this.m23 = m23;
        this.m33 = m33;
    }
    static makeIdentity() {
        return new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);
    }
    static makeZero() {
        return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static makeColMajor(m11, m21, m31, m12, m22, m32, m13, m23, m33) {
        return new Matrix3(m11, m21, m31, m12, m22, m32, m13, m23, m33);
    }
    static makeRowMajor(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        return new Matrix3(m11, m21, m31, m12, m22, m32, m13, m23, m33);
    }
    static fromRowMajorArray(v) {
        if (v.length >= 9)
            return new Matrix3(v[0], v[3], v[6], v[1], v[4], v[7], v[2], v[5], v[8]);
        return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static fromColMajorArray(v) {
        if (v.length >= 9)
            return new Matrix3(v[0], v[1], v[2], v[3], v[4], v[5], v[6], v[7], v[8]);
        return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static makeScale(x, y, z) {
        return Matrix3.makeRowMajor(x, 0, 0, 0, y, 0, 0, 0, z);
    }
    static makeRotation(angleInDegrees, x, y, z) {
        var c = Math.cos(angleInDegrees * Math.PI / 180.0);
        var s = Math.sin(angleInDegrees * Math.PI / 180.0);
        var invLength = 1.0 / Math.sqrt(x * x + y * y + z * z);
        x *= invLength;
        y *= invLength;
        z *= invLength;
        return Matrix3.makeRowMajor(x * x * (1 - c) + c, x * y * (1 - c) - z * s, x * z * (1 - c) + y * s, y * x * (1 - c) + z * s, y * y * (1 - c) + c, y * z * (1 - c) - x * s, x * z * (1 - c) - y * s, y * z * (1 - c) + x * s, z * z * (1 - c) + c);
    }
    static makeCubeFaceMatrix(face) {
        // +X
        if (face == 0)
            return Matrix3.makeRotation(90.0, 0.0, 1.0, 0.0);
        // -X
        if (face == 1)
            return Matrix3.makeRotation(270.0, 0.0, 1.0, 0.0);
        // +Y
        if (face == 2)
            return Matrix3.makeRotation(90.0, 1.0, 0.0, 0.0);
        // -Y
        if (face == 3)
            return Matrix3.makeRotation(270.0, 1.0, 0.0, 0.0);
        // +Z
        if (face == 4)
            return Matrix3.makeIdentity();
        // -Z
        if (face == 5)
            return Matrix3.makeRotation(180.0, 0.0, 1.0, 0.0);
        return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    asColMajorArray() {
        return [
            this.m11, this.m21, this.m31,
            this.m12, this.m22, this.m32,
            this.m13, this.m23, this.m33
        ];
    }
    asRowMajorArray() {
        return [
            this.m11, this.m12, this.m13,
            this.m21, this.m22, this.m23,
            this.m31, this.m32, this.m33
        ];
    }
    static multiply(m1, m2) {
        return new Matrix3(m1.m11 * m2.m11 + m1.m21 * m2.m12 + m1.m31 * m2.m13, m1.m11 * m2.m21 + m1.m21 * m2.m22 + m1.m31 * m2.m23, m1.m11 * m2.m31 + m1.m21 * m2.m32 + m1.m31 * m2.m33, m1.m12 * m2.m11 + m1.m22 * m2.m12 + m1.m32 * m2.m13, m1.m12 * m2.m21 + m1.m22 * m2.m22 + m1.m32 * m2.m23, m1.m12 * m2.m31 + m1.m22 * m2.m32 + m1.m32 * m2.m33, m1.m13 * m2.m11 + m1.m23 * m2.m12 + m1.m33 * m2.m13, m1.m13 * m2.m21 + m1.m23 * m2.m22 + m1.m33 * m2.m23, m1.m13 * m2.m31 + m1.m23 * m2.m32 + m1.m33 * m2.m33);
    }
    copy(m) {
        this.m11 = m.m11;
        this.m21 = m.m21;
        this.m31 = m.m31;
        this.m12 = m.m12;
        this.m22 = m.m22;
        this.m32 = m.m32;
        this.m13 = m.m13;
        this.m23 = m.m23;
        this.m33 = m.m33;
        return this;
    }
    concat(m) {
        this.copy(Matrix3.multiply(this, m));
        return this;
    }
    transform(v) {
        return new Vector3(this.m11 * v.x + this.m12 * v.y + this.m13 * v.z, this.m21 * v.x + this.m22 * v.y + this.m23 * v.z, this.m31 * v.x + this.m32 * v.y + this.m33 * v.z);
    }
    asInverse() {
        var tmpA = this.m22 * this.m33 - this.m23 * this.m32;
        var tmpB = this.m21 * this.m32 - this.m22 * this.m31;
        var tmpC = this.m23 * this.m31 - this.m21 * this.m33;
        var tmpD = 1.0 / (this.m11 * tmpA + this.m12 * tmpC + this.m13 * tmpB);
        return new Matrix3(tmpA * tmpD, (this.m13 * this.m32 - this.m12 * this.m33) * tmpD, (this.m12 * this.m23 - this.m13 * this.m22) * tmpD, tmpC * tmpD, (this.m11 * this.m33 - this.m13 * this.m31) * tmpD, (this.m13 * this.m21 - this.m11 * this.m23) * tmpD, tmpB * tmpD, (this.m12 * this.m31 - this.m11 * this.m32) * tmpD, (this.m11 * this.m22 - this.m12 * this.m21) * tmpD);
    }
    asTranspose() {
        return new Matrix3(this.m11, this.m12, this.m13, this.m21, this.m22, this.m23, this.m31, this.m32, this.m33);
    }
} // class Matrix3
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
///<reference path="GTE.ts"/>
class Matrix4 {
    constructor(m11, m21, m31, m41, m12, m22, m32, m42, m13, m23, m33, m43, m14, m24, m34, m44) {
        this.m11 = m11;
        this.m21 = m21;
        this.m31 = m31;
        this.m41 = m41;
        this.m12 = m12;
        this.m22 = m22;
        this.m32 = m32;
        this.m42 = m42;
        this.m13 = m13;
        this.m23 = m23;
        this.m33 = m33;
        this.m43 = m43;
        this.m14 = m14;
        this.m24 = m24;
        this.m34 = m34;
        this.m44 = m44;
    }
    copy(m) {
        return this.LoadMatrix(m);
    }
    LoadRowMajor(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        this.m11 = m11;
        this.m12 = m12;
        this.m13 = m13;
        this.m14 = m14;
        this.m21 = m21;
        this.m22 = m22;
        this.m23 = m23;
        this.m24 = m24;
        this.m31 = m31;
        this.m32 = m32;
        this.m33 = m33;
        this.m34 = m34;
        this.m41 = m41;
        this.m42 = m42;
        this.m43 = m43;
        this.m44 = m44;
        return this;
    }
    LoadColMajor(m11, m21, m31, m41, m12, m22, m32, m42, m13, m23, m33, m43, m14, m24, m34, m44) {
        this.m11 = m11;
        this.m12 = m12;
        this.m13 = m13;
        this.m14 = m14;
        this.m21 = m21;
        this.m22 = m22;
        this.m23 = m23;
        this.m24 = m24;
        this.m31 = m31;
        this.m32 = m32;
        this.m33 = m33;
        this.m34 = m34;
        this.m41 = m41;
        this.m42 = m42;
        this.m43 = m43;
        this.m44 = m44;
        return this;
    }
    LoadIdentity() {
        return this.LoadMatrix(Matrix4.makeIdentity());
    }
    Translate(x, y, z) {
        return this.MultMatrix(Matrix4.makeTranslation(x, y, z));
    }
    Rotate(angleInDegrees, x, y, z) {
        return this.MultMatrix(Matrix4.makeRotation(angleInDegrees, x, y, z));
    }
    Scale(sx, sy, sz) {
        return this.MultMatrix(Matrix4.makeScale(sx, sy, sz));
    }
    LookAt(eye, center, up) {
        return this.MultMatrix(Matrix4.makeLookAt(eye, center, up));
    }
    Frustum(left, right, bottom, top, near, far) {
        return this.MultMatrix(Matrix4.makeFrustum(left, right, bottom, top, near, far));
    }
    Ortho(left, right, bottom, top, near, far) {
        return this.MultMatrix(Matrix4.makeOrtho(left, right, bottom, top, near, far));
    }
    Ortho2D(left, right, bottom, top) {
        return this.MultMatrix(Matrix4.makeOrtho2D(left, right, bottom, top));
    }
    PerspectiveX(fovx, aspect, near, far) {
        return this.MultMatrix(Matrix4.makePerspectiveX(fovx, aspect, near, far));
    }
    PerspectiveY(fovy, aspect, near, far) {
        return this.MultMatrix(Matrix4.makePerspectiveY(fovy, aspect, near, far));
    }
    ShadowBias() {
        return this.MultMatrix(Matrix4.makeShadowBias());
    }
    CubeFaceMatrix(face) {
        return this.MultMatrix(Matrix4.makeCubeFaceMatrix(face));
    }
    static makeIdentity() {
        return new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    static makeZero() {
        return new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static makeColMajor(m11, m21, m31, m41, m12, m22, m32, m42, m13, m23, m33, m43, m14, m24, m34, m44) {
        return new Matrix4(m11, m21, m31, m41, m12, m22, m32, m42, m13, m23, m33, m43, m14, m24, m34, m44);
    }
    static makeRowMajor(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        return new Matrix4(m11, m21, m31, m41, m12, m22, m32, m42, m13, m23, m33, m43, m14, m24, m34, m44);
    }
    static fromRowMajorArray(v) {
        if (v.length >= 16)
            return new Matrix4(v[0], v[4], v[8], v[12], v[1], v[5], v[9], v[13], v[2], v[6], v[10], v[14], v[3], v[7], v[11], v[15]);
        return new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static fromColMajorArray(v) {
        if (v.length >= 16)
            return new Matrix4(v[0], v[1], v[2], v[3], v[4], v[5], v[6], v[7], v[8], v[9], v[10], v[11], v[12], v[13], v[14], v[15]);
        return new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static makeTranslation(x, y, z) {
        return Matrix4.makeRowMajor(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);
    }
    static makeScale(x, y, z) {
        return Matrix4.makeRowMajor(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);
    }
    static makeRotation(angleInDegrees, x, y, z) {
        var c = Math.cos(angleInDegrees * Math.PI / 180.0);
        var s = Math.sin(angleInDegrees * Math.PI / 180.0);
        var invLength = 1.0 / Math.sqrt(x * x + y * y + z * z);
        x *= invLength;
        y *= invLength;
        z *= invLength;
        return Matrix4.makeRowMajor(x * x * (1 - c) + c, x * y * (1 - c) - z * s, x * z * (1 - c) + y * s, 0.0, y * x * (1 - c) + z * s, y * y * (1 - c) + c, y * z * (1 - c) - x * s, 0.0, x * z * (1 - c) - y * s, y * z * (1 - c) + x * s, z * z * (1 - c) + c, 0.0, 0.0, 0.0, 0.0, 1.0);
    }
    static makeOrtho(left, right, bottom, top, near, far) {
        var tx = -(right + left) / (right - left);
        var ty = -(top + bottom) / (top - bottom);
        var tz = -(far + near) / (far - near);
        return Matrix4.makeRowMajor(2 / (right - left), 0, 0, tx, 0, 2 / (top - bottom), 0, ty, 0, 0, -2 / (far - near), tz, 0, 0, 0, 1);
    }
    static makeOrtho2D(left, right, bottom, top) {
        return Matrix4.makeOrtho(left, right, bottom, top, -1, 1);
    }
    static makeFrustum(left, right, bottom, top, near, far) {
        var A = (right + left) / (right - left);
        var B = (top + bottom) / (top - bottom);
        var C = -(far + near) / (far - near);
        var D = -2 * far * near / (far - near);
        return Matrix4.makeRowMajor(2 * near / (right - left), 0, A, 0, 0, 2 * near / (top - bottom), B, 0, 0, 0, C, D, 0, 0, -1, 0);
    }
    static makePerspectiveY(fovy, aspect, near, far) {
        var f = 1.0 / Math.tan(Math.PI * fovy / 360.0);
        return Matrix4.makeRowMajor(f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), 2 * far * near / (near - far), 0, 0, -1, 0);
    }
    static makePerspectiveX(fovx, aspect, near, far) {
        var f = 1.0 / Math.tan(Math.PI * fovx / 360.0);
        return Matrix4.makeRowMajor(f, 0, 0, 0, 0, f * aspect, 0, 0, 0, 0, (far + near) / (near - far), 2 * far * near / (near - far), 0, 0, -1, 0);
    }
    static makeLookAt(eye, center, up) {
        var F = Vector3.sub(center, eye).norm();
        var UP = up.norm();
        var S = Vector3.cross(F, UP).norm();
        var U = Vector3.cross(S, F).norm();
        return Matrix4.multiply(Matrix4.makeRowMajor(S.x, S.y, S.z, 0, U.x, U.y, U.z, 0, -F.x, -F.y, -F.z, 0, 0, 0, 0, 1), Matrix4.makeTranslation(-eye.x, -eye.y, -eye.z));
    }
    static makeShadowBias() {
        return Matrix4.makeRowMajor(0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0);
    }
    static makeCubeFaceMatrix(face) {
        // +X
        if (face == 0)
            return Matrix4.makeRotation(90.0, 0.0, 1.0, 0.0);
        // -X
        if (face == 1)
            return Matrix4.makeRotation(270.0, 0.0, 1.0, 0.0);
        // +Y
        if (face == 2)
            return Matrix4.makeRotation(90.0, 1.0, 0.0, 0.0);
        // -Y
        if (face == 3)
            return Matrix4.makeRotation(270.0, 1.0, 0.0, 0.0);
        // +Z
        if (face == 4)
            return Matrix4.makeIdentity();
        // -Z
        if (face == 5)
            return Matrix4.makeRotation(180.0, 0.0, 1.0, 0.0);
        return new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    toColMajorArray() {
        return [
            this.m11, this.m21, this.m31, this.m41,
            this.m12, this.m22, this.m32, this.m42,
            this.m13, this.m23, this.m33, this.m43,
            this.m14, this.m24, this.m34, this.m44
        ];
    }
    toRowMajorArray() {
        return [
            this.m11, this.m12, this.m13, this.m14,
            this.m21, this.m22, this.m23, this.m24,
            this.m31, this.m32, this.m33, this.m34,
            this.m41, this.m42, this.m43, this.m44
        ];
    }
    static multiply(m1, m2) {
        return new Matrix4(m1.m11 * m2.m11 + m1.m21 * m2.m12 + m1.m31 * m2.m13 + m1.m41 * m2.m14, m1.m11 * m2.m21 + m1.m21 * m2.m22 + m1.m31 * m2.m23 + m1.m41 * m2.m24, m1.m11 * m2.m31 + m1.m21 * m2.m32 + m1.m31 * m2.m33 + m1.m41 * m2.m34, m1.m11 * m2.m41 + m1.m21 * m2.m42 + m1.m31 * m2.m43 + m1.m41 * m2.m44, m1.m12 * m2.m11 + m1.m22 * m2.m12 + m1.m32 * m2.m13 + m1.m42 * m2.m14, m1.m12 * m2.m21 + m1.m22 * m2.m22 + m1.m32 * m2.m23 + m1.m42 * m2.m24, m1.m12 * m2.m31 + m1.m22 * m2.m32 + m1.m32 * m2.m33 + m1.m42 * m2.m34, m1.m12 * m2.m41 + m1.m22 * m2.m42 + m1.m32 * m2.m43 + m1.m42 * m2.m44, m1.m13 * m2.m11 + m1.m23 * m2.m12 + m1.m33 * m2.m13 + m1.m43 * m2.m14, m1.m13 * m2.m21 + m1.m23 * m2.m22 + m1.m33 * m2.m23 + m1.m43 * m2.m24, m1.m13 * m2.m31 + m1.m23 * m2.m32 + m1.m33 * m2.m33 + m1.m43 * m2.m34, m1.m13 * m2.m41 + m1.m23 * m2.m42 + m1.m33 * m2.m43 + m1.m43 * m2.m44, m1.m14 * m2.m11 + m1.m24 * m2.m12 + m1.m34 * m2.m13 + m1.m44 * m2.m14, m1.m14 * m2.m21 + m1.m24 * m2.m22 + m1.m34 * m2.m23 + m1.m44 * m2.m24, m1.m14 * m2.m31 + m1.m24 * m2.m32 + m1.m34 * m2.m33 + m1.m44 * m2.m34, m1.m14 * m2.m41 + m1.m24 * m2.m42 + m1.m34 * m2.m43 + m1.m44 * m2.m44);
    }
    LoadMatrix(m) {
        this.m11 = m.m11;
        this.m21 = m.m21;
        this.m31 = m.m31;
        this.m41 = m.m41;
        this.m12 = m.m12;
        this.m22 = m.m22;
        this.m32 = m.m32;
        this.m42 = m.m42;
        this.m13 = m.m13;
        this.m23 = m.m23;
        this.m33 = m.m33;
        this.m43 = m.m43;
        this.m14 = m.m14;
        this.m24 = m.m24;
        this.m34 = m.m34;
        this.m44 = m.m44;
        return this;
    }
    MultMatrix(m) {
        this.LoadMatrix(Matrix4.multiply(this, m));
        return this;
    }
    transform(v) {
        return new Vector4(this.m11 * v.x + this.m12 * v.y + this.m13 * v.z + this.m14 * v.w, this.m21 * v.x + this.m22 * v.y + this.m23 * v.z + this.m24 * v.w, this.m31 * v.x + this.m32 * v.y + this.m33 * v.z + this.m34 * v.w, this.m41 * v.x + this.m42 * v.y + this.m43 * v.z + this.m44 * v.w);
    }
    asInverse() {
        var tmp1 = this.m32 * this.m43 - this.m33 * this.m42;
        var tmp2 = this.m32 * this.m44 - this.m34 * this.m42;
        var tmp3 = this.m33 * this.m44 - this.m34 * this.m43;
        var tmp4 = this.m22 * tmp3 - this.m23 * tmp2 + this.m24 * tmp1;
        var tmp5 = this.m31 * this.m42 - this.m32 * this.m41;
        var tmp6 = this.m31 * this.m43 - this.m33 * this.m41;
        var tmp7 = -this.m21 * tmp1 + this.m22 * tmp6 - this.m23 * tmp5;
        var tmp8 = this.m31 * this.m44 - this.m34 * this.m41;
        var tmp9 = this.m21 * tmp2 - this.m22 * tmp8 + this.m24 * tmp5;
        var tmp10 = -this.m21 * tmp3 + this.m23 * tmp8 - this.m24 * tmp6;
        var tmp11 = 1 / (this.m11 * tmp4 + this.m12 * tmp10 + this.m13 * tmp9 + this.m14 * tmp7);
        var tmp12 = this.m22 * this.m43 - this.m23 * this.m42;
        var tmp13 = this.m22 * this.m44 - this.m24 * this.m42;
        var tmp14 = this.m23 * this.m44 - this.m24 * this.m43;
        var tmp15 = this.m22 * this.m33 - this.m23 * this.m32;
        var tmp16 = this.m22 * this.m34 - this.m24 * this.m32;
        var tmp17 = this.m23 * this.m34 - this.m24 * this.m33;
        var tmp18 = this.m21 * this.m43 - this.m23 * this.m41;
        var tmp19 = this.m21 * this.m44 - this.m24 * this.m41;
        var tmp20 = this.m21 * this.m33 - this.m23 * this.m31;
        var tmp21 = this.m21 * this.m34 - this.m24 * this.m31;
        var tmp22 = this.m21 * this.m42 - this.m22 * this.m41;
        var tmp23 = this.m21 * this.m32 - this.m22 * this.m31;
        return new Matrix4(tmp4 * tmp11, (-this.m12 * tmp3 + this.m13 * tmp2 - this.m14 * tmp1) * tmp11, (this.m12 * tmp14 - this.m13 * tmp13 + this.m14 * tmp12) * tmp11, (-this.m12 * tmp17 + this.m13 * tmp16 - this.m14 * tmp15) * tmp11, tmp10 * tmp11, (this.m11 * tmp3 - this.m13 * tmp8 + this.m14 * tmp6) * tmp11, (-this.m11 * tmp14 + this.m13 * tmp19 - this.m14 * tmp18) * tmp11, (this.m11 * tmp17 - this.m13 * tmp21 + this.m14 * tmp20) * tmp11, tmp9 * tmp11, (-this.m11 * tmp2 + this.m12 * tmp8 - this.m14 * tmp5) * tmp11, (this.m11 * tmp13 - this.m12 * tmp19 + this.m14 * tmp22) * tmp11, (-this.m11 * tmp16 + this.m12 * tmp21 - this.m14 * tmp23) * tmp11, tmp7 * tmp11, (this.m11 * tmp1 - this.m12 * tmp6 + this.m13 * tmp5) * tmp11, (-this.m11 * tmp12 + this.m12 * tmp18 - this.m13 * tmp22) * tmp11, (this.m11 * tmp15 - this.m12 * tmp20 + this.m13 * tmp23) * tmp11);
    }
    asTranspose() {
        return new Matrix4(this.m11, this.m12, this.m13, this.m14, this.m21, this.m22, this.m23, this.m24, this.m31, this.m32, this.m33, this.m34, this.m41, this.m42, this.m43, this.m44);
    }
} // class Matrix4
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
/// <reference path="./RenderingContext.ts"/>
class RenderConfig {
    constructor(_context, _vertShaderSource, _fragShaderSource) {
        this._context = _context;
        this._vertShaderSource = _vertShaderSource;
        this._fragShaderSource = _fragShaderSource;
        this._isCompiled = false;
        this._isLinked = false;
        this._vertShader = null;
        this._fragShader = null;
        this._program = null;
        this._vertShaderInfoLog = "";
        this._fragShaderInfoLog = "";
        this._vertShaderCompileStatus = false;
        this._fragShaderCompileStatus = false;
        this._programInfoLog = "";
        this._programLinkStatus = false;
        this.uniforms = new Map();
        this.uniformInfo = new Map();
        this.useDepthTest = true;
        this.depthTest = WebGLRenderingContext.LESS;
        this.depthMask = true;
        this.Reset(this._vertShaderSource, this._fragShaderSource);
    }
    get usable() { return this.IsCompiledAndLinked(); }
    IsCompiledAndLinked() {
        if (this._isCompiled && this._isLinked)
            return true;
        return false;
    }
    Use() {
        let gl = this._context.gl;
        gl.useProgram(this._program);
        if (this.useDepthTest) {
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(this.depthTest);
        }
        gl.depthMask(this.depthMask);
    }
    Restore() {
        let gl = this._context.gl;
        gl.useProgram(null);
        if (this.useDepthTest) {
            gl.disable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LESS);
        }
        gl.depthMask(true);
    }
    SetMatrix4f(uniformName, m) {
        let gl = this._context.gl;
        let location = gl.getUniformLocation(this._program, uniformName);
        if (location != null) {
            gl.uniformMatrix4fv(location, false, m.toColMajorArray());
        }
    }
    SetUniform1i(uniformName, x) {
        let gl = this._context.gl;
        let location = gl.getUniformLocation(this._program, uniformName);
        if (location != null) {
            gl.uniform1i(location, x);
        }
    }
    SetUniform3f(uniformName, v) {
        let gl = this._context.gl;
        let location = gl.getUniformLocation(this._program, uniformName);
        if (location != null) {
            gl.uniform3fv(location, v.toFloat32Array());
        }
    }
    SetUniform4f(uniformName, v) {
        let gl = this._context.gl;
        let location = gl.getUniformLocation(this._program, uniformName);
        if (location) {
            gl.uniform4fv(location, v.toFloat32Array());
        }
    }
    GetAttribLocation(name) {
        let gl = this._context.gl;
        return gl.getAttribLocation(this._program, name);
    }
    GetUniformLocation(name) {
        let gl = this._context.gl;
        let uloc = gl.getUniformLocation(this._program, name);
        if (!uloc)
            return -1;
        return uloc;
    }
    Reset(vertShaderSource, fragShaderSource) {
        let gl = this._context.gl;
        let vertShader = gl.createShader(gl.VERTEX_SHADER);
        if (vertShader) {
            gl.shaderSource(vertShader, vertShaderSource);
            gl.compileShader(vertShader);
            let status = gl.getShaderParameter(vertShader, gl.COMPILE_STATUS);
            let infoLog = null;
            if (!status) {
                infoLog = gl.getShaderInfoLog(vertShader);
                let errorElement = document.getElementById("errors");
                if (!errorElement && infoLog) {
                    let newDiv = document.createElement("div");
                    newDiv.appendChild(document.createTextNode("Vertex shader info log"));
                    newDiv.appendChild(document.createElement("br"));
                    newDiv.appendChild(document.createTextNode(infoLog));
                    let pre = document.createElement("pre");
                    pre.textContent = this._fragShaderSource;
                    newDiv.appendChild(pre);
                    document.body.appendChild(newDiv);
                }
            }
            if (status)
                this._vertShaderCompileStatus = true;
            if (infoLog)
                this._vertShaderInfoLog = infoLog;
            this._vertShader = vertShader;
        }
        else {
            return false;
        }
        let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        if (fragShader) {
            gl.shaderSource(fragShader, fragShaderSource);
            gl.compileShader(fragShader);
            let status = gl.getShaderParameter(fragShader, gl.COMPILE_STATUS);
            let infoLog = null;
            if (!status) {
                infoLog = gl.getShaderInfoLog(fragShader);
                let errorElement = document.getElementById("errors");
                if (!errorElement && infoLog) {
                    let newDiv = document.createElement("div");
                    newDiv.appendChild(document.createTextNode("Fragment shader info log"));
                    newDiv.appendChild(document.createElement("br"));
                    newDiv.appendChild(document.createTextNode(infoLog));
                    let pre = document.createElement("pre");
                    pre.textContent = this._fragShaderSource;
                    newDiv.appendChild(pre);
                    document.body.appendChild(newDiv);
                }
            }
            if (status)
                this._fragShaderCompileStatus = true;
            if (infoLog)
                this._fragShaderInfoLog = infoLog;
            this._fragShader = fragShader;
        }
        else {
            return false;
        }
        if (this._vertShaderCompileStatus && this._fragShaderCompileStatus) {
            this._isCompiled = true;
            this._program = gl.createProgram();
            if (this._program) {
                gl.attachShader(this._program, this._vertShader);
                gl.attachShader(this._program, this._fragShader);
                gl.linkProgram(this._program);
                if (gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
                    this._programLinkStatus = true;
                    this._isLinked = true;
                }
                else {
                    this._programLinkStatus = false;
                    let infoLog = gl.getProgramInfoLog(this._program);
                    if (infoLog) {
                        this._programInfoLog = infoLog;
                        let errorElement = document.getElementById("errors");
                        if (!errorElement && infoLog) {
                            let newDiv = document.createElement("div");
                            newDiv.appendChild(document.createTextNode("PROGRAM INFO LOG"));
                            newDiv.appendChild(document.createElement("br"));
                            newDiv.appendChild(document.createTextNode(infoLog));
                            document.body.appendChild(newDiv);
                        }
                    }
                }
            }
        }
        else {
            return false;
        }
        this.updateActiveUniforms();
        return true;
    }
    updateActiveUniforms() {
        let gl = this._context.gl;
        let numUniforms = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);
        this.uniforms.clear();
        this.uniformInfo.clear();
        for (let i = 0; i < numUniforms; i++) {
            let uniform = gl.getActiveUniform(this._program, i);
            if (!uniform)
                continue;
            this.uniformInfo.set(uniform.name, uniform);
            this.uniforms.set(uniform.name, gl.getUniformLocation(this._program, uniform.name));
        }
        return true;
    }
}
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
    constructor(width = 512, height = 384) {
        this.width = width;
        this.height = height;
        this.enabledExtensions = [];
        this.divElement_ = null;
        this.canvasElement_ = null;
        this.aspectRatio = 1.0;
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
        }
        else {
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
    EnableExtensions(names) {
        let supportedExtensions = this.gl.getSupportedExtensions();
        if (!supportedExtensions)
            return false;
        let allFound = true;
        for (var name of names) {
            let found = false;
            for (var ext of supportedExtensions) {
                if (name == ext) {
                    this.enabledExtensions.push(this.gl.getExtension(name));
                    console.log("Extension " + name + " enabled");
                    found = true;
                    break;
                }
            }
            if (!found) {
                console.log("Extension " + name + " not enabled");
                allFound = false;
                break;
            }
        }
        return allFound;
    }
}
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
/// <reference path="./RenderingContext.ts" />
/// <reference path="./RenderConfig.ts" />
var Utils;
(function (Utils) {
    // return last part of the url name ignoring possible ending slash
    function GetURLResource(url) {
        let parts = url.split('/');
        let lastSection = parts.pop() || parts.pop();
        if (lastSection) {
            return lastSection;
        }
        else {
            return "unknown";
        }
    }
    Utils.GetURLResource = GetURLResource;
    function GetURLPath(url) {
        let parts = url.split('/');
        if (!parts.pop())
            parts.pop();
        let path = parts.join("/") + "/";
        if (path) {
            return path;
        }
        else {
            return "";
        }
    }
    Utils.GetURLPath = GetURLPath;
    function IsExtension(sourceString, extensionWithDot) {
        let start = sourceString.length - extensionWithDot.length - 1;
        if (start >= 0 && sourceString.substr(start, extensionWithDot.length) == extensionWithDot) {
            return true;
        }
        return false;
    }
    Utils.IsExtension = IsExtension;
    function GetExtension(sourceString) {
        let position = sourceString.lastIndexOf(".");
        if (position >= 0) {
            return sourceString.substr(position + 1).toLowerCase();
        }
        return "";
    }
    Utils.GetExtension = GetExtension;
    class ShaderLoader {
        constructor(vertShaderUrl, fragShaderUrl, callbackfn) {
            this.vertShaderUrl = vertShaderUrl;
            this.fragShaderUrl = fragShaderUrl;
            this.callbackfn = callbackfn;
            this.vertLoaded = false;
            this.fragLoaded = false;
            this.vertFailed = false;
            this.fragFailed = false;
            this.vertShaderSource = "";
            this.fragShaderSource = "";
            let self = this;
            let vertXHR = new XMLHttpRequest();
            vertXHR.addEventListener("load", (e) => {
                self.vertShaderSource = vertXHR.responseText;
                self.vertLoaded = true;
                if (this.loaded) {
                    self.callbackfn(self.vertShaderSource, self.fragShaderSource);
                }
            });
            vertXHR.addEventListener("abort", (e) => {
                self.vertFailed = true;
                console.error("unable to GET " + vertShaderUrl);
            });
            vertXHR.addEventListener("error", (e) => {
                self.vertFailed = true;
                console.error("unable to GET " + vertShaderUrl);
            });
            vertXHR.open("GET", vertShaderUrl);
            vertXHR.send();
            let fragXHR = new XMLHttpRequest();
            fragXHR.addEventListener("load", (e) => {
                self.fragShaderSource = fragXHR.responseText;
                self.fragLoaded = true;
                if (this.loaded) {
                    self.callbackfn(self.vertShaderSource, self.fragShaderSource);
                }
            });
            fragXHR.addEventListener("abort", (e) => {
                self.fragFailed = true;
                console.error("unable to GET " + fragShaderUrl);
            });
            fragXHR.addEventListener("error", (e) => {
                self.vertFailed = true;
                console.error("unable to GET " + fragShaderUrl);
            });
            fragXHR.open("GET", fragShaderUrl);
            fragXHR.send();
        }
        get failed() { return this.vertFailed || this.fragFailed; }
        get loaded() { return this.vertLoaded && this.fragLoaded; }
    }
    Utils.ShaderLoader = ShaderLoader;
    class TextFileLoader {
        constructor(url, callbackfn, parameter = 0) {
            this.callbackfn = callbackfn;
            this._loaded = false;
            this._failed = false;
            this.data = "";
            this.name = GetURLResource(url);
            let self = this;
            let xhr = new XMLHttpRequest();
            xhr.addEventListener("load", (e) => {
                if (!xhr.responseText) {
                    self._failed = true;
                    self.data = "unknown";
                }
                else {
                    self.data = xhr.responseText;
                }
                self._loaded = true;
                callbackfn(self.data, self.name, parameter);
            });
            xhr.addEventListener("abort", (e) => {
                self._failed = true;
                console.error("unable to GET " + url);
            });
            xhr.addEventListener("error", (e) => {
                self._failed = true;
                console.error("unable to GET " + url);
            });
            xhr.open("GET", url);
            xhr.send();
        }
        get loaded() { return this._loaded; }
        get failed() { return this._failed; }
    }
    Utils.TextFileLoader = TextFileLoader;
    class ImageFileLoader {
        constructor(url, callbackfn, parameter = 0) {
            this.callbackfn = callbackfn;
            this._loaded = false;
            this._failed = false;
            this.image = new Image();
            this.name = GetURLResource(url);
            let self = this;
            let ajax = new XMLHttpRequest();
            this.image.addEventListener("load", (e) => {
                self._loaded = true;
                callbackfn(self.image, this.name, parameter);
            });
            this.image.addEventListener("error", (e) => {
                self._failed = true;
                console.error("unable to GET " + url);
            });
            this.image.addEventListener("abort", (e) => {
                self._failed = true;
                console.error("unable to GET " + url);
            });
            this.image.src = url;
        }
        get loaded() { return this._loaded; }
        get failed() { return this._failed; }
    }
    Utils.ImageFileLoader = ImageFileLoader;
    function SeparateCubeMapImages(image, images) {
        if (image.width != 6 * image.height) {
            return;
        }
        // images are laid out: +X, -X, +Y, -Y, +Z, -Z
        let canvas = document.createElement("canvas");
        if (canvas) {
            canvas.width = image.width;
            canvas.height = image.height;
            let ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(image, 0, 0);
                for (let i = 0; i < 6; i++) {
                    images[i] = ctx.getImageData(i * image.height, 0, image.height, image.height);
                }
            }
        }
    }
    Utils.SeparateCubeMapImages = SeparateCubeMapImages;
    class GLTypeInfo {
        constructor(type, baseType, components, sizeOfType) {
            this.type = type;
            this.baseType = baseType;
            this.components = components;
            this.sizeOfType = sizeOfType;
        }
        CreateArray(size) {
            switch (this.type) {
                case WebGLRenderingContext.FLOAT:
                case WebGLRenderingContext.FLOAT_VEC2:
                case WebGLRenderingContext.FLOAT_VEC3:
                case WebGLRenderingContext.FLOAT_VEC4:
                case WebGLRenderingContext.FLOAT_MAT2:
                case WebGLRenderingContext.FLOAT_MAT3:
                case WebGLRenderingContext.FLOAT_MAT4:
                    return new Float32Array(size);
                case WebGLRenderingContext.INT:
                case WebGLRenderingContext.INT_VEC2:
                case WebGLRenderingContext.INT_VEC3:
                case WebGLRenderingContext.INT_VEC4:
                    return new Int32Array(size);
                case WebGLRenderingContext.SHORT:
                    return new Int16Array(size);
                case WebGLRenderingContext.UNSIGNED_INT:
                    return new Uint32Array(size);
                case WebGLRenderingContext.UNSIGNED_SHORT:
                    return new Uint16Array(size);
                case WebGLRenderingContext.UNSIGNED_BYTE:
                    return new Uint8ClampedArray(size);
                case WebGLRenderingContext.BOOL:
                    return new Uint32Array(size);
            }
            return null;
        }
    }
    Utils.WebGLTypeInfo = new Map([
        [WebGLRenderingContext.BYTE, new GLTypeInfo(WebGLRenderingContext.BYTE, WebGLRenderingContext.BYTE, 1, 1)],
        [WebGLRenderingContext.UNSIGNED_BYTE, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_BYTE, WebGLRenderingContext.UNSIGNED_BYTE, 1, 1)],
        [WebGLRenderingContext.SHORT, new GLTypeInfo(WebGLRenderingContext.SHORT, WebGLRenderingContext.SHORT, 1, 2)],
        [WebGLRenderingContext.UNSIGNED_SHORT, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_SHORT, WebGLRenderingContext.UNSIGNED_SHORT, 1, 2)],
        [WebGLRenderingContext.INT, new GLTypeInfo(WebGLRenderingContext.INT, WebGLRenderingContext.INT, 1, 4)],
        [WebGLRenderingContext.UNSIGNED_INT, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_INT, WebGLRenderingContext.UNSIGNED_INT, 1, 4)],
        [WebGLRenderingContext.BOOL, new GLTypeInfo(WebGLRenderingContext.BOOL, WebGLRenderingContext.INT, 1, 4)],
        [WebGLRenderingContext.FLOAT, new GLTypeInfo(WebGLRenderingContext.FLOAT, WebGLRenderingContext.FLOAT, 1, 4)],
        [WebGLRenderingContext.FLOAT_VEC2, new GLTypeInfo(WebGLRenderingContext.FLOAT_VEC2, WebGLRenderingContext.FLOAT, 2, 4)],
        [WebGLRenderingContext.FLOAT_VEC3, new GLTypeInfo(WebGLRenderingContext.FLOAT_VEC3, WebGLRenderingContext.FLOAT, 3, 4)],
        [WebGLRenderingContext.FLOAT_VEC4, new GLTypeInfo(WebGLRenderingContext.FLOAT_VEC4, WebGLRenderingContext.FLOAT, 4, 4)],
        [WebGLRenderingContext.FLOAT_MAT2, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT2, WebGLRenderingContext.FLOAT, 4, 4)],
        [WebGLRenderingContext.FLOAT_MAT3, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT3, WebGLRenderingContext.FLOAT, 9, 4)],
        [WebGLRenderingContext.FLOAT_MAT4, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT4, WebGLRenderingContext.FLOAT, 16, 4)],
        // [WebGLRenderingContext.FLOAT_MAT2x3, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT2x3, WebGLRenderingContext.FLOAT, 6, 4)],
        // [WebGLRenderingContext.FLOAT_MAT2x4, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT2x4, WebGLRenderingContext.FLOAT, 8, 4)],
        // [WebGLRenderingContext.FLOAT_MAT3x2, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT3x2, WebGLRenderingContext.FLOAT, 6, 4)],
        // [WebGLRenderingContext.FLOAT_MAT3x4, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT3x4, WebGLRenderingContext.FLOAT, 12, 4)],
        // [WebGLRenderingContext.FLOAT_MAT4x2, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT4x2, WebGLRenderingContext.FLOAT, 8, 4)],
        // [WebGLRenderingContext.FLOAT_MAT4x3, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT4x3, WebGLRenderingContext.FLOAT, 12, 4)],
        // [WebGLRenderingContext.SAMPLER_1D, new GLTypeInfo(WebGLRenderingContext.SAMPLER_1D, WebGLRenderingContext.FLOAT, 1, 4)],
        [WebGLRenderingContext.SAMPLER_2D, new GLTypeInfo(WebGLRenderingContext.SAMPLER_2D, WebGLRenderingContext.FLOAT, 1, 4)],
        // [WebGLRenderingContext.SAMPLER_3D, new GLTypeInfo(WebGLRenderingContext.SAMPLER_3D, WebGLRenderingContext.FLOAT, 1, 4)],
        [WebGLRenderingContext.SAMPLER_CUBE, new GLTypeInfo(WebGLRenderingContext.SAMPLER_CUBE, WebGLRenderingContext.FLOAT, 1, 4)],
    ]);
})(Utils || (Utils = {}));
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
/// <reference path="./Vector2.ts" />
/// <reference path="./Vector3.ts" />
/// <reference path="./Vector4.ts" />
/// <reference path="./Matrix2.ts" />
/// <reference path="./Matrix3.ts" />
/// <reference path="./Matrix4.ts" />
/// <reference path="./Utils.ts" />
var GTE;
(function (GTE) {
    function clamp(x, a, b) {
        return x < a ? a : x > b ? b : x;
    }
    GTE.clamp = clamp;
    // 0 <= mix <= 1
    function lerp(a, b, mix) {
        return mix * a + (1 - mix) * b;
    }
    GTE.lerp = lerp;
    class WaveletNoiseCalculator {
        constructor(noiseTileSize = 128) {
            this.noiseTileSize = noiseTileSize;
            this.initialized = false;
            this.noiseTileData = new Float32Array(noiseTileSize * noiseTileSize * noiseTileSize);
            this.GenerateNoiseTile(noiseTileSize);
        }
        Mod(x, n) {
            let m = x % n;
            return m < 0 ? m + n : m;
        }
        Downsample(from, to, n, stride) {
            const ARAD = 16;
            let coefs = new Float32Array([
                0.000334, -0.001528, 0.000410, 0.003545, -0.000938, -0.008233, 0.002172, 0.019120,
                -0.005040, -0.044412, 0.011655, 0.103311, -0.025936, -0.243780, 0.033979, 0.655340,
                0.655340, 0.033979, -0.243780, -0.025936, 0.103311, 0.011655, -0.044412, -0.005040,
                0.019120, 0.002172, -0.008233, -0.000938, 0.003546, 0.000410, -0.001528, 0.000334,
                0
            ]);
            let a = coefs.subarray(ARAD);
            for (let i = 0; i < ((n / 2) | 0); i++) {
                to[i * stride] = 0;
                for (let k = 2 * i - ARAD; k <= 2 * i + ARAD; k++) {
                    let _a = coefs[ARAD + k - 2 * i];
                    to[i * stride] += _a * from[this.Mod(k, n) * stride];
                    if (!isFinite(to[i * stride])) {
                        console.error("non finite number produced");
                    }
                }
            }
        }
        Upsample(from, to, n, stride) {
            const ARAD = 16;
            let pCoefs = new Float32Array([0.25, 0.75, 0.75, 0.25]);
            let p = pCoefs.subarray(2);
            for (let i = 0; i < n; i++) {
                to[i * stride] = 0;
                let k1 = (i / 2) | 0;
                let k2 = k1 + 1;
                for (let k = k1; k <= k2; k++) {
                    let _p = pCoefs[2 + i - 2 * k];
                    to[i * stride] += _p * from[this.Mod(k, n / 2) * stride];
                    if (!isFinite(to[i * stride])) {
                        console.error("non finite number produced");
                    }
                }
            }
        }
        GenerateNoiseTile(n) {
            if (n % 2) {
                n++;
            }
            let ix = 0;
            let iy = 0;
            let iz = 0;
            let sz = n * n * n * 4;
            let temp1 = new Float32Array(n * n * n);
            let temp2 = new Float32Array(n * n * n);
            let noise = new Float32Array(n * n * n);
            for (let i = 0; i < n * n * n; i++) {
                // Wavelet noise paper says "GaussianNoise"
                noise[i] = Math.random() * 2 - 1;
            }
            // Downsample and upsample
            for (iy = 0; iy < n; iy++) {
                for (iz = 0; iz < n; iz++) {
                    let i = iy * n + iz * n * n;
                    this.Downsample(noise.subarray(i), temp1.subarray(i), n, 1);
                    this.Upsample(temp1.subarray(i), temp2.subarray(i), n, 1);
                }
            }
            for (ix = 0; ix < n; ix++) {
                for (iz = 0; iz < n; iz++) {
                    let i = ix + iz * n * n;
                    this.Downsample(temp2.subarray(i), temp1.subarray(i), n, n);
                    this.Upsample(temp1.subarray(i), temp2.subarray(i), n, n);
                }
            }
            for (ix = 0; ix < n; ix++) {
                for (iy = 0; iy < n; iy++) {
                    let i = ix + iy * n;
                    this.Downsample(temp2.subarray(i), temp1.subarray(i), n, n * n);
                    this.Upsample(temp1.subarray(i), temp2.subarray(i), n, n * n);
                }
            }
            for (let i = 0; i < n * n * n; i++) {
                noise[i] -= temp2[i];
            }
            let offset = n / 2;
            if (offset % 2) {
                offset++;
            }
            for (let i = 0, ix = 0; ix < n; ix++) {
                for (iy = 0; iy < n; iy++) {
                    for (iz = 0; iz < n; iz++) {
                        temp1[i++] = noise[this.Mod(ix + offset, n) + this.Mod(iy + offset, n) * n + this.Mod(iz + offset, n) * n * n];
                    }
                }
            }
            for (let i = 0; i < n * n * n; i++) {
                noise[i] += temp1[i];
            }
            this.noiseTileData = noise;
            this.initialized = true;
        }
        WaveletNoise(x, y, z, octave = 128) {
            let p = [octave * x, octave * y, octave * z];
            let i = 0;
            let f = [0, 0, 0];
            let c = [0, 0, 0];
            let n = this.noiseTileSize;
            let mid = [0, 0, 0];
            let w = [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ];
            let t = 0;
            let result = 0;
            // B-spline quadratic basis function
            for (i = 0; i < 3; i++) {
                mid[i] = Math.ceil(p[i] - 0.5);
                t = mid[i] - (p[i] - 0.5);
                w[i][0] = t * t / 2;
                w[i][2] = (1 - t) * (1 - t) / 2;
                w[i][1] = 1 - w[i][0] - w[i][2];
            }
            for (f[2] = -1; f[2] <= 1; f[2]++) {
                for (f[1] = -1; f[1] <= 1; f[1]++) {
                    for (f[0] = -1; f[0] <= 1; f[0]++) {
                        let weight = 1;
                        for (i = 0; i < 3; i++) {
                            c[i] = this.Mod(mid[i] + f[i], n);
                            weight *= w[i][f[i] + 1];
                            result += weight * this.noiseTileData[c[2] * n * n + c[1] * n + c[0]];
                        }
                    }
                }
            }
            return result;
        }
    }
    GTE.WaveletNoiseCalculator = WaveletNoiseCalculator;
    GTE.WaveletNoise = new WaveletNoiseCalculator(64);
})(GTE || (GTE = {}));
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
var Colors;
(function (Colors) {
    const DarkIntensity = 30;
    const LightIntensity = 210;
    const MediumIntensity = GTE.lerp(DarkIntensity, LightIntensity, 0.5);
    const GrayIntensity33 = GTE.lerp(DarkIntensity, LightIntensity, 0.66);
    const GrayIntensity66 = GTE.lerp(DarkIntensity, LightIntensity, 0.33);
    const Gr33Intensity = GTE.lerp(DarkIntensity, LightIntensity, 0.66);
    const Gr66Intensity = GTE.lerp(DarkIntensity, LightIntensity, 0.33);
    Colors.Black = [30, 30, 30, 255];
    Colors.White = [210, 210, 210, 255];
    Colors.Gray66 = [150, 150, 150, 255];
    Colors.Gray33 = [91, 91, 91, 255];
    Colors.Red = [210, 30, 30, 255];
    Colors.Orange = [210, 150, 30, 255];
    Colors.Yellow = [210, 210, 30, 255];
    Colors.Green = [30, 210, 30, 255];
    Colors.Cyan = [30, 210, 210, 255];
    Colors.Blue = [30, 30, 210, 255];
    Colors.Indigo = [91, 30, 210, 255];
    Colors.Violet = [150, 30, 150, 255];
    Colors.Magenta = [210, 30, 210, 255];
    // export const DarkGreen: number[] = [30, 91, 30, 255];
    Colors.Brown = [150, 91, 30, 255];
    Colors.SkyBlue = [30, 150, 210, 255];
    Colors.DarkRed = [120, 30, 30, 255];
    Colors.DarkCyan = [30, 120, 120, 255];
    Colors.DarkGreen = [30, 120, 30, 255];
    Colors.DarkMagenta = [120, 30, 120, 255];
    Colors.DarkBlue = [30, 30, 120, 255];
    Colors.DarkYellow = [120, 120, 30, 255];
    Colors.LightRed = [210, 120, 120, 255];
    Colors.LightCyan = [120, 210, 210, 255];
    Colors.LightGreen = [120, 210, 120, 255];
    Colors.LightMagenta = [210, 120, 210, 255];
    Colors.LightBlue = [120, 120, 210, 255];
    Colors.LightYellow = [210, 210, 120, 255];
    Colors.ArneOrange = [235, 137, 49, 255];
    Colors.ArneYellow = [247, 226, 107, 255];
    Colors.ArneDarkGreen = [47, 72, 78, 255];
    Colors.ArneGreen = [68, 137, 26, 255];
    Colors.ArneSlimeGreen = [163, 206, 39, 255];
    Colors.ArneNightBlue = [27, 38, 50, 255];
    Colors.ArneSeaBlue = [0, 87, 132, 255];
    Colors.ArneSkyBlue = [49, 162, 242, 255];
    Colors.ArneCloudBlue = [178, 220, 239, 255];
    Colors.ArneDarkBlue = [52, 42, 151, 255];
    Colors.ArneDarkGray = [101, 109, 113, 255];
    Colors.ArneLightGray = [204, 204, 204, 255];
    Colors.ArneDarkRed = [115, 41, 48, 255];
    Colors.ArneRose = [203, 67, 167, 255];
    Colors.ArneTaupe = [82, 79, 64, 255];
    Colors.ArneGold = [173, 157, 51, 255];
    Colors.ArneTangerine = [236, 71, 0, 255];
    Colors.ArneHoney = [250, 180, 11, 255];
    Colors.ArneMossyGreen = [17, 94, 51, 255];
    Colors.ArneDarkCyan = [20, 128, 126, 255];
    Colors.ArneCyan = [21, 194, 165, 255];
    Colors.ArneBlue = [34, 90, 246, 255];
    Colors.ArneIndigo = [153, 100, 249, 255];
    Colors.ArnePink = [247, 142, 214, 255];
    Colors.ArneSkin = [244, 185, 144, 255];
    Colors.ArneBlack = [30, 30, 30, 255];
})(Colors || (Colors = {}));
class HW0ShaderProgram {
    constructor(gl, vertShaderSource, fragShaderSource) {
        this.gl = gl;
        this.vertShaderSource = vertShaderSource;
        this.fragShaderSource = fragShaderSource;
        this.program_ = null;
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
            console.error("Program Link Error");
            console.error(this.gl.getProgramInfoLog(this.program_));
            gl.deleteShader(vshader);
            gl.deleteShader(fshader);
            gl.deleteProgram(this.program_);
            this.program_ = null;
            return;
        }
    }
    Use() {
        if (!this.program_)
            return;
        this.gl.useProgram(this.program_);
    }
    GetVertexPosition(vertexName) {
        return this.gl.getAttribLocation(this.program_, vertexName);
    }
    createShader(type, sourceCode) {
        let shader = this.gl.createShader(type);
        if (!shader)
            return null;
        this.gl.shaderSource(shader, sourceCode);
        this.gl.compileShader(shader);
        let status = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        if (!status) {
            if (type == this.gl.VERTEX_SHADER)
                console.error("Vertex shader compile error");
            if (type == this.gl.FRAGMENT_SHADER)
                console.error("Fragment shader compile error");
            console.error(this.gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }
}
class HW0StaticVertexBufferObject {
    constructor(gl, drawArraysMode, vertexData) {
        this.drawArraysMode = drawArraysMode;
        this.buffer = null;
        this.gl = null;
        this.bufferLength = 0;
        this.count = 0;
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
    Render(vertexLoc) {
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
class IndexedGeometryMesh {
    constructor(_renderingContext) {
        this._renderingContext = _renderingContext;
        this.vertices = [];
        this.indices = [];
        this.surfaces = [];
        this._mtllib = "";
        this._mtl = "";
        this._vertex = new Vertex();
        this._dirty = true;
        this._vboData = new Float32Array();
        this._iboData = new Uint32Array();
        let gl = this._renderingContext.gl;
        let vbo = gl.createBuffer();
        let ibo = gl.createBuffer();
        if (!vbo || !ibo)
            throw "IndexedGeometryMesh::constructor() Unable to create buffer";
        this._vbo = vbo;
        this._ibo = ibo;
    }
    SetMtllib(mtllib) {
        this._mtllib = mtllib;
    }
    SetMtl(mtl) {
        this._mtl = mtl;
    }
    BeginSurface(mode) {
        if (this.surfaces.length == 0) {
            // if no surfaces exist, add one
            this.surfaces.push(new Surface(mode, this.indices.length, this._mtllib, this._mtl));
        }
        else if (this.currentIndexCount != 0) {
            // do not add a surface if the most recent one is empty
            this.surfaces.push(new Surface(mode, this.indices.length, this._mtllib, this._mtl));
        }
    }
    AddIndex(i) {
        if (this.surfaces.length == 0)
            return;
        if (i < 0) {
            this.indices.push((this.vertices.length / 12) + i);
        }
        else {
            this.indices.push(i);
        }
        this.surfaces[this.surfaces.length - 1].Add();
        this._dirty = true;
    }
    get currentIndexCount() {
        if (this.surfaces.length == 0)
            return 0;
        return this.surfaces[this.surfaces.length - 1].count;
    }
    SetNormal(n) {
        this._vertex.normal.copy(n);
    }
    SetColor(c) {
        this._vertex.color.copy(c);
    }
    SetTexCoord(t) {
        this._vertex.texcoord.copy(t);
    }
    AddVertex(v) {
        this._vertex.position.copy(v);
        this.vertices.push(...this._vertex.asArray());
        this._vertex = new Vertex();
    }
    BuildBuffers() {
        // Building the VBO goes here
        if (!this._dirty)
            return;
        this._vboData = new Float32Array(this.vertices);
        this._iboData = new Uint32Array(this.indices);
        let gl = this._renderingContext.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
        gl.bufferData(gl.ARRAY_BUFFER, this._vboData, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._iboData, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        this._dirty = false;
    }
    Render(rc, sg) {
        // Rendering code goes here
        this.BuildBuffers();
        let gl = this._renderingContext.gl;
        let offsets = [0, 12, 24, 36];
        let locs = [
            rc.GetAttribLocation("aPosition"),
            rc.GetAttribLocation("aNormal"),
            rc.GetAttribLocation("aColor"),
            rc.GetAttribLocation("aTexcoord")
        ];
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._ibo);
        for (let i = 0; i < 4; i++) {
            if (locs[i] >= 0) {
                gl.enableVertexAttribArray(locs[i]);
                gl.vertexAttribPointer(locs[i], 3, gl.FLOAT, false, 48, offsets[i]);
            }
        }
        for (let s of this.surfaces) {
            sg.UseMaterial(rc, s.mtllib, s.mtl);
            gl.drawElements(s.mode, s.count, gl.UNSIGNED_INT, s.offset);
        }
        for (let i = 0; i < 4; i++) {
            if (locs[i] >= 0) {
                gl.disableVertexAttribArray(locs[i]);
            }
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
}
class OldWebGLAppHW0 {
    constructor(width = 512, height = 384) {
        this.width = width;
        this.height = height;
        this.divElement_ = null;
        this.canvasElement_ = null;
        this.gl = null;
        this.vbo = null;
        this.program = null;
        this.divElement_ = document.createElement("div");
        this.canvasElement_ = document.createElement("canvas");
        if (this.canvasElement_) {
            this.gl = this.canvasElement_.getContext("webgl");
            if (!this.gl) {
                this.gl = this.canvasElement_.getContext("experimental-webgl");
            }
            if (!this.gl) {
                this.canvasElement_ = null;
                this.divElement_.innerText = "WebGL not supported.";
            }
            else {
                this.divElement_.appendChild(this.canvasElement_);
                this.divElement_.align = "center";
            }
        }
        document.body.appendChild(this.divElement_);
    }
    run() {
        if (!this.gl)
            return;
        this.init(this.gl);
        this.mainloop(0);
    }
    mainloop(timestamp) {
        let self = this;
        this.display(timestamp / 1000.0);
        window.requestAnimationFrame((t) => {
            self.mainloop(t);
        });
    }
    init(gl) {
        this.vbo = new HW0StaticVertexBufferObject(gl, gl.TRIANGLES, new Float32Array([
            -1, -1, 0, 1,
            1, -1, 0, 1,
            0, 1, 0, 1
        ]));
        this.program = new HW0ShaderProgram(gl, "attribute vec4 position; void main(){ gl_Position = position; }", "void main() { gl_FragColor = vec4(0.4, 0.3, 0.2, 1.0); }");
    }
    display(t) {
        if (!this.gl || !this.canvasElement_)
            return;
        let gl = this.gl;
        gl.clearColor(0.2, 0.15 * Math.sin(t) + 0.15, 0.4, 1.0);
        gl.clear(this.gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, this.canvasElement_.width, this.canvasElement_.height);
        if (this.vbo && this.program) {
            this.program.Use();
            this.vbo.Render(this.program.GetVertexPosition("position"));
        }
        gl.useProgram(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}
var SGAssetType;
(function (SGAssetType) {
    SGAssetType[SGAssetType["Scene"] = 0] = "Scene";
    SGAssetType[SGAssetType["GeometryGroup"] = 1] = "GeometryGroup";
    SGAssetType[SGAssetType["MaterialLibrary"] = 2] = "MaterialLibrary";
    SGAssetType[SGAssetType["ShaderProgram"] = 3] = "ShaderProgram";
    SGAssetType[SGAssetType["Image"] = 4] = "Image";
})(SGAssetType || (SGAssetType = {}));
;
class ScenegraphNode {
    constructor(name = "unknown", parent = "unknown") {
        this.name = name;
        this.parent = parent;
        this.geometryGroup = "";
        this.transform = Matrix4.makeIdentity();
    }
}
class Texture {
    constructor(_renderingContext, name, url, target, texture) {
        this._renderingContext = _renderingContext;
        this.name = name;
        this.url = url;
        this.target = target;
        this.texture = texture;
        this.id = "";
    }
}
class Scenegraph {
    constructor(_renderingContext) {
        this._renderingContext = _renderingContext;
        this.textfiles = [];
        this.imagefiles = [];
        this.shaderSrcFiles = [];
        this._renderConfigs = new Map();
        //private _cubeTextures: Map<string, WebGLTexture> = new Map<string, WebGLTexture>();
        this._textures = new Map();
        this._sceneResources = new Map();
        this._nodes = [];
        this._meshes = new Map();
        this._tempNode = new ScenegraphNode("", "");
        this._defaultRenderConfig = new RenderConfig(this._renderingContext, `attribute vec4 aPosition;
             void main() {
                 gl_Position = aPosition;
            }`, `void main() {
                gl_FragColor = vec4(0.4, 0.3, 0.2, 1.0);
            }`);
    }
    get loaded() {
        for (let t of this.textfiles) {
            if (!t.loaded)
                return false;
        }
        for (let i of this.imagefiles) {
            if (!i.loaded)
                return false;
        }
        for (let s of this.shaderSrcFiles) {
            if (!s.loaded)
                return false;
        }
        return true;
    }
    get failed() {
        for (let t of this.textfiles) {
            if (t.failed)
                return true;
        }
        for (let i of this.imagefiles) {
            if (i.failed)
                return true;
        }
        for (let s of this.shaderSrcFiles) {
            if (s.failed)
                return true;
        }
        return false;
    }
    get percentLoaded() {
        let a = 0;
        for (let t of this.textfiles) {
            if (t.loaded)
                a++;
        }
        for (let i of this.imagefiles) {
            if (i.loaded)
                a++;
        }
        for (let s of this.shaderSrcFiles) {
            if (s.loaded)
                a++;
        }
        return 100.0 * a / (this.textfiles.length + this.imagefiles.length + this.shaderSrcFiles.length);
    }
    Load(url) {
        let name = Utils.GetURLResource(url);
        let self = this;
        let assetType;
        let ext = Utils.GetExtension(name);
        let path = Utils.GetURLPath(url);
        if (ext == "scn")
            assetType = SGAssetType.Scene;
        else if (ext == "obj")
            assetType = SGAssetType.GeometryGroup;
        else if (ext == "mtl")
            assetType = SGAssetType.MaterialLibrary;
        else if (ext == "png")
            assetType = SGAssetType.Image;
        else if (ext == "jpg")
            assetType = SGAssetType.Image;
        else
            return;
        console.log("Scenegraph::Load() => Requesting " + url);
        if (assetType == SGAssetType.Image) {
            if (this._textures.has(name))
                return;
            this.imagefiles.push(new Utils.ImageFileLoader(url, (data, name, assetType) => {
                self.processTextureMap(data, name, assetType);
                console.log("Scenegraph::Load() => loaded " + self.percentLoaded + "% " + name);
                let log = document.getElementById("log");
                if (log) {
                    log.innerText = "Loaded " + self.percentLoaded + "% " + name;
                }
            }));
        }
        else {
            this.textfiles.push(new Utils.TextFileLoader(url, (data, name, assetType) => {
                self.processTextFile(data, name, path, assetType);
                console.log("Scenegraph::Load() => loaded " + self.percentLoaded + "% " + name);
                let log = document.getElementById("log");
                if (log) {
                    log.innerText = "Loaded " + self.percentLoaded + "% " + name;
                }
            }, assetType));
        }
    }
    AddRenderConfig(name, vertshaderUrl, fragshaderUrl) {
        let self = this;
        this.shaderSrcFiles.push(new Utils.ShaderLoader(vertshaderUrl, fragshaderUrl, (vertShaderSource, fragShaderSource) => {
            this._renderConfigs.set(name, new RenderConfig(this._renderingContext, vertShaderSource, fragShaderSource));
            console.log("Scenegraph::Load() => loaded " + vertshaderUrl);
            console.log("Scenegraph::Load() => loaded " + fragshaderUrl);
            console.log("Scenegraph::Load() => loaded " + self.percentLoaded + "% " + name);
            let log = document.getElementById("log");
            if (log) {
                log.innerText = "Loaded " + self.percentLoaded + "% " + name;
            }
        }));
    }
    UseRenderConfig(name) {
        let rc = this._renderConfigs.get(name);
        if (rc) {
            rc.Use();
            return rc;
        }
        return this._defaultRenderConfig;
    }
    UseMaterial(rc, mtllib, mtl) {
    }
    RenderMesh(name, rc) {
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
    UseTexture(textureName, unit, enable = true) {
        let texunit = unit | 0;
        let gl = this._renderingContext.gl;
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
                gl.bindTexture(t.target, t.texture);
            }
            else {
                gl.bindTexture(t.target, null);
            }
        }
        if (!t) {
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        }
        gl.activeTexture(gl.TEXTURE0);
    }
    RenderScene(shaderName, sceneName) {
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
    processTextFile(data, name, path, assetType) {
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
    processTextureMap(image, name, assetType) {
        let gl = this._renderingContext.gl;
        if (image.width == 6 * image.height) {
            let images = new Array(6);
            Utils.SeparateCubeMapImages(image, images);
            let texture = gl.createTexture();
            if (texture) {
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                for (let i = 0; i < 6; i++) {
                    if (!images[i]) {
                        continue;
                    }
                    else {
                        console.log("image " + i + " w:" + images[i].width + "/h:" + images[i].height);
                    }
                    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[i]);
                }
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                let t = new Texture(this._renderingContext, name, name, gl.TEXTURE_CUBE_MAP, texture);
                this._textures.set(name, t);
            }
        }
        else {
            let texture = gl.createTexture();
            if (texture) {
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.generateMipmap(gl.TEXTURE_2D);
                let t = new Texture(this._renderingContext, name, name, gl.TEXTURE_2D, texture);
                this._textures.set(name, t);
            }
        }
    }
    loadScene(lines, name, path) {
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
    loadOBJ(lines, name, path) {
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
        let positions = [];
        let normals = [];
        let colors = [];
        let texcoords = [];
        let mesh = new IndexedGeometryMesh(this._renderingContext);
        // in case there are no mtllib's, usemtl's, o's, g's, or s's
        mesh.BeginSurface(gl.TRIANGLES);
        for (let tokens of lines) {
            if (tokens.length >= 2) {
                if (tokens[0] == "mtllib") {
                    this.Load(path + tokens[1]);
                    mesh.SetMtllib(TextParser.ParseIdentifier(tokens));
                    mesh.BeginSurface(gl.TRIANGLES);
                }
                else if (tokens[1] == "usemtl") {
                    mesh.SetMtl(TextParser.ParseIdentifier(tokens));
                    mesh.BeginSurface(gl.TRIANGLES);
                }
                else if (tokens[1] == "o") {
                    mesh.BeginSurface(gl.TRIANGLES);
                }
                else if (tokens[1] == "g") {
                    mesh.BeginSurface(gl.TRIANGLES);
                }
                else if (tokens[1] == "s") {
                    mesh.BeginSurface(gl.TRIANGLES);
                }
            }
            if (tokens.length >= 4) {
                if (tokens[0] == "v") {
                    positions.push(TextParser.ParseVector(tokens));
                }
                else if (tokens[0] == "vn") {
                    normals.push(TextParser.ParseVector(tokens));
                }
                else if (tokens[0] == "vt") {
                    texcoords.push(TextParser.ParseVector(tokens));
                }
                else if (tokens[0] == "f") {
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
        }
        mesh.BuildBuffers();
        this._meshes.set(name, mesh);
    }
    loadMTL(lines, name, path) {
        // newmtl <name: string>
        // Kd <color: Vector3>
        // Ks <color: Vector3>
        // map_Kd <url: string>
        // map_Ks <url: string>
        // map_normal <url: string>
        for (let tokens of lines) {
            if (tokens[0] == "map_Kd") {
                this.Load(path + tokens[1]);
            }
            else if (tokens[0] == "map_Ks") {
                this.Load(path + tokens[1]);
            }
            else if (tokens[0] == "map_normal") {
                this.Load(path + tokens[1]);
            }
            else {
                // console.log("MTLLIB: Ignoring");
                // for (let t of tokens) {
                //     console.log("\"" + t + "\"");
                // }
            }
        }
    }
}
class Surface {
    constructor(mode, offset, mtllib, mtl) {
        this.mode = mode;
        this.offset = offset;
        this.mtllib = mtllib;
        this.mtl = mtl;
        this.count = 0;
    }
    Add() {
        this.count++;
    }
}
class TextParser {
    constructor(data) {
        this.lines = [];
        // split using regex any sequence of 1 or more newlines or carriage returns
        let lines = data.split(/[\n\r]+/);
        for (let line of lines) {
            let unfilteredTokens = line.split(/\s+/);
            let tokens = [];
            for (let t of unfilteredTokens) {
                if (t.length > 0) {
                    if (t[0] != '#') {
                        tokens.push(t);
                    }
                }
            }
            if (tokens.length == 0) {
                continue;
            }
            this.lines.push(tokens);
        }
    }
    static ParseIdentifier(tokens) {
        if (tokens.length >= 2)
            return tokens[1].replace(/[^\w]+/, "_");
        return "unknown";
    }
    static ParseVector(tokens) {
        let x = (tokens.length >= 2) ? parseFloat(tokens[1]) : 0.0;
        let y = (tokens.length >= 3) ? parseFloat(tokens[2]) : 0.0;
        let z = (tokens.length >= 4) ? parseFloat(tokens[3]) : 0.0;
        return new Vector3(x, y, z);
    }
    static ParseMatrix(tokens) {
        if (tokens.length > 16 && tokens[0] == "transform") {
            let m = new Matrix4(parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]), parseFloat(tokens[4]), parseFloat(tokens[5]), parseFloat(tokens[6]), parseFloat(tokens[7]), parseFloat(tokens[8]), parseFloat(tokens[9]), parseFloat(tokens[10]), parseFloat(tokens[11]), parseFloat(tokens[12]), parseFloat(tokens[13]), parseFloat(tokens[14]), parseFloat(tokens[15]), parseFloat(tokens[16]));
            return m;
        }
        return Matrix4.makeZero();
    }
    static ParseFaceIndices(token) {
        let indices = [0, 0, 0];
        if (token.search("//"))
            token.replace("//", "/0/");
        let tokens = token.split("/");
        if (tokens.length >= 1) {
            indices[0] = parseInt(tokens[0]) - 1;
        }
        if (tokens.length == 2) {
            indices[2] = parseInt(tokens[2]) - 1;
        }
        else if (tokens.length == 3) {
            indices[1] = parseInt(tokens[1]) - 1;
            indices[2] = parseInt(tokens[2]) - 1;
        }
        return indices;
    }
    static ParseFace(tokens) {
        let indices = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        if (tokens.length < 4) {
            return indices;
        }
        let v1 = TextParser.ParseFaceIndices(tokens[1]);
        let v2 = TextParser.ParseFaceIndices(tokens[2]);
        let v3 = TextParser.ParseFaceIndices(tokens[3]);
        return [...v1, ...v2, ...v3];
    }
}
class Vertex {
    constructor(position = new Vector3(0, 0, 0), normal = new Vector3(0, 0, 1), color = new Vector3(1, 1, 1), texcoord = new Vector3(0, 0, 0)) {
        this.position = position;
        this.normal = normal;
        this.color = color;
        this.texcoord = texcoord;
    }
    asFloat32Array() {
        return new Float32Array([
            this.position.x, this.position.y, this.position.z,
            this.normal.x, this.normal.y, this.normal.z,
            this.color.x, this.color.y, this.color.z,
            this.texcoord.x, this.texcoord.y, this.texcoord.z
        ]);
    }
    asArray() {
        return [
            this.position.x, this.position.y, this.position.z,
            this.normal.x, this.normal.y, this.normal.z,
            this.color.x, this.color.y, this.color.z,
            this.texcoord.x, this.texcoord.y, this.texcoord.z
        ];
    }
}
;
class WebGLAppHW0 {
    constructor(width = 512, height = 384) {
        this.width = width;
        this.height = height;
        this.vbo = null;
        this.aspectRatio = 1.0;
        this.t0 = 0;
        this.t1 = 0;
        this.dt = 0;
        this.renderingContext = new RenderingContext(width, height);
        if (!this.renderingContext)
            throw "Unable to create rendering context!";
        this.scenegraph = new Scenegraph(this.renderingContext);
    }
    run() {
        this.init();
        this.mainloop(0);
    }
    init() {
        let gl = this.renderingContext.gl;
        this.vbo = new HW0StaticVertexBufferObject(gl, gl.TRIANGLES, new Float32Array([
            -1, -1, 0,
            1, -1, 0,
            0, 1, 0
        ]));
        this.scenegraph.AddRenderConfig("default", "shaders/rtr-homework0.vert", "shaders/rtr-homework0.frag");
    }
    mainloop(timestamp) {
        let self = this;
        this.t0 = this.t1;
        this.t1 = timestamp / 1000.0;
        this.dt = this.t1 - this.t0;
        this.update();
        this.display();
        window.requestAnimationFrame((t) => {
            self.mainloop(t);
        });
    }
    update() {
        // update sim/game loop code here
        // this.t1 = elapsed time of program
        // this.dt = elapsed time between frames
    }
    display() {
        if (!this.renderingContext)
            return;
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
class WebGLAppHW1 {
    constructor(width = 512, height = 384) {
        this.width = width;
        this.height = height;
        this.aspectRatio = 1.0;
        this.t0 = 0;
        this.t1 = 0;
        this.dt = 0;
        this.renderingContext = new RenderingContext(width, height);
        if (!this.renderingContext)
            throw "Unable to create rendering context!";
        this.scenegraph = new Scenegraph(this.renderingContext);
    }
    run() {
        this.init();
        this.mainloop(0);
    }
    init() {
        this.scenegraph.AddRenderConfig("default", "shaders/rtr-homework1.vert", "shaders/rtr-homework1.frag");
        this.scenegraph.Load("../assets/test_scene.scn");
    }
    mainloop(timestamp) {
        let self = this;
        this.t0 = this.t1;
        this.t1 = timestamp / 1000.0;
        this.dt = this.t1 - this.t0;
        this.update();
        this.display();
        window.requestAnimationFrame((t) => {
            self.mainloop(t);
        });
    }
    update() {
        // update sim/game loop code here
        // this.t1 = elapsed time of program
        // this.dt = elapsed time between frames
    }
    display() {
        if (!this.renderingContext)
            return;
        let gl = this.renderingContext.gl;
        gl.clearColor(0.2, 0.15 * Math.sin(this.t1) + 0.15, 0.4, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, this.renderingContext.width, this.renderingContext.height);
        let rc = this.scenegraph.UseRenderConfig("default");
        if (rc) {
            rc.Use();
            rc.SetUniform3f("SunDirTo", Vector3.makeUnit(0.25, 0.5, Math.sin(this.t1)));
            rc.SetUniform3f("SunE0", Vector3.make(1.0, 1.0, 1.0).mul(Math.sin(this.t1)));
            rc.SetMatrix4f("ProjectionMatrix", Matrix4.makePerspectiveX(45.0, this.renderingContext.aspectRatio, 0.1, 100.0));
            rc.SetMatrix4f("CameraMatrix", Matrix4.makeTranslation(0.0, 0.0, -2.0));
            let m = Matrix4.makeRotation(5 * Math.sin(10 * this.t1), 1.0, 0.0, 0.0);
            m.Rotate(10.0 * this.t1, 0.0, 1.0, 0.0);
            rc.SetMatrix4f("WorldMatrix", m); //Matrix4.makeRotation(10 * this.t1, 0.0, 1.0, 0.0));
            // rc.SetMatrix4f("ProjectionMatrix", Matrix4.makeIdentity());
            // rc.SetMatrix4f("CameraMatrix", Matrix4.makeIdentity());
            // rc.SetMatrix4f("WorldMatrix", Matrix4.makeIdentity());
            // "" renders everything
            this.scenegraph.RenderMesh("", rc);
            rc.Restore();
        }
        gl.useProgram(null);
    }
}
class WebGLAppHW2 {
    constructor(width = 512, height = 384) {
        this.width = width;
        this.height = height;
        this.aspectRatio = 1.0;
        this.t0 = 0;
        this.t1 = 0;
        this.dt = 0;
        this.renderingContext = new RenderingContext(width, height);
        if (!this.renderingContext)
            throw "Unable to create rendering context!";
        this.scenegraph = new Scenegraph(this.renderingContext);
    }
    run() {
        this.init();
        this.mainloop(0);
    }
    init() {
        this.scenegraph.AddRenderConfig("default", "shaders/rtr-homework2.vert", "shaders/rtr-homework2.frag");
        this.scenegraph.AddRenderConfig("skybox", "shaders/skybox.vert", "shaders/skybox.frag");
        this.scenegraph.Load("../assets/test_scene.scn");
        this.scenegraph.Load("../assets/skybox.scn");
    }
    mainloop(timestamp) {
        let self = this;
        this.t0 = this.t1;
        this.t1 = timestamp / 1000.0;
        this.dt = this.t1 - this.t0;
        this.update();
        this.display();
        window.requestAnimationFrame((t) => {
            self.mainloop(t);
        });
    }
    update() {
        // update sim/game loop code here
        // this.t1 = elapsed time of program
        // this.dt = elapsed time between frames
    }
    display() {
        if (!this.renderingContext)
            return;
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
            rc.SetMatrix4f("CameraMatrix", Matrix4.makeTranslation(0.0, 0.0, -2.0));
            rc.SetMatrix4f("WorldMatrix", Matrix4.makeRotation(10 * this.t1, 0.0, 1.0, 0.0));
            this.scenegraph.UseTexture("enviroCube", 10);
            rc.SetUniform1i("EnviroCube", 10);
            // "" renders everything
            this.scenegraph.RenderScene("default", "test_scene.scn");
            this.scenegraph.UseTexture("enviroCube", 10, false);
            rc.Restore();
        }
        gl.useProgram(null);
    }
}
//# sourceMappingURL=library.js.map