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
	constructor(
		public m11: number, public m21: number, public m31: number, public m41: number,
		public m12: number, public m22: number, public m32: number, public m42: number,
		public m13: number, public m23: number, public m33: number, public m43: number,
		public m14: number, public m24: number, public m34: number, public m44: number
	) { }

	copy(m: Matrix4): Matrix4 {
		return this.LoadMatrix(m);
	}

	LoadRowMajor(
		m11: number, m12: number, m13: number, m14: number,
		m21: number, m22: number, m23: number, m24: number,
		m31: number, m32: number, m33: number, m34: number,
		m41: number, m42: number, m43: number, m44: number): Matrix4 {
		this.m11 = m11; this.m12 = m12; this.m13 = m13; this.m14 = m14;
		this.m21 = m21; this.m22 = m22; this.m23 = m23; this.m24 = m24;
		this.m31 = m31; this.m32 = m32; this.m33 = m33; this.m34 = m34;
		this.m41 = m41; this.m42 = m42; this.m43 = m43; this.m44 = m44;
		return this;
	}

	LoadColMajor(
		m11: number, m21: number, m31: number, m41: number,
		m12: number, m22: number, m32: number, m42: number,
		m13: number, m23: number, m33: number, m43: number,
		m14: number, m24: number, m34: number, m44: number): Matrix4 {
		this.m11 = m11; this.m12 = m12; this.m13 = m13; this.m14 = m14;
		this.m21 = m21; this.m22 = m22; this.m23 = m23; this.m24 = m24;
		this.m31 = m31; this.m32 = m32; this.m33 = m33; this.m34 = m34;
		this.m41 = m41; this.m42 = m42; this.m43 = m43; this.m44 = m44;
		return this;
	}

	LoadIdentity(): Matrix4 {
		return this.LoadMatrix(Matrix4.makeIdentity());
	}

	Translate(x: number, y: number, z: number): Matrix4 {
		return this.MultMatrix(Matrix4.makeTranslation(x, y, z));
	}

	Rotate(angleInDegrees: number, x: number, y: number, z: number): Matrix4 {
		return this.MultMatrix(Matrix4.makeRotation(angleInDegrees, x, y, z));
	}

	Scale(sx: number, sy: number, sz: number): Matrix4 {
		return this.MultMatrix(Matrix4.makeScale(sx, sy, sz));
	}

	LookAt(eye: Vector3, center: Vector3, up: Vector3): Matrix4 {
		return this.MultMatrix(Matrix4.makeLookAt(eye, center, up));
	}

	Frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4 {
		return this.MultMatrix(Matrix4.makeFrustum(left, right, bottom, top, near, far));
	}

	Ortho(left: number, right: number, bottom: number, top: number, near: number, far: number) {
		return this.MultMatrix(Matrix4.makeOrtho(left, right, bottom, top, near, far));
	}

	Ortho2D(left: number, right: number, bottom: number, top: number): Matrix4 {
		return this.MultMatrix(Matrix4.makeOrtho2D(left, right, bottom, top));
	}

	PerspectiveX(fovx: number, aspect: number, near: number, far: number): Matrix4 {
		return this.MultMatrix(Matrix4.makePerspectiveX(fovx, aspect, near, far));
	}

	PerspectiveY(fovy: number, aspect: number, near: number, far: number): Matrix4 {
		return this.MultMatrix(Matrix4.makePerspectiveY(fovy, aspect, near, far));
	}

	ShadowBias(): Matrix4 {
		return this.MultMatrix(Matrix4.makeShadowBias());
	}

	CubeFaceMatrix(face: number): Matrix4 {
		return this.MultMatrix(Matrix4.makeCubeFaceMatrix(face));
	}

	static makeIdentity(): Matrix4 {
		return new Matrix4(
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		)
	}

	static makeZero(): Matrix4 {
		return new Matrix4(
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0
		)
	}

	static makeColMajor(
		m11: number, m21: number, m31: number, m41: number,
		m12: number, m22: number, m32: number, m42: number,
		m13: number, m23: number, m33: number, m43: number,
		m14: number, m24: number, m34: number, m44: number
	) {
		return new Matrix4(
			m11, m21, m31, m41,
			m12, m22, m32, m42,
			m13, m23, m33, m43,
			m14, m24, m34, m44
		);
	}

	static makeRowMajor(
		m11: number, m12: number, m13: number, m14: number,
		m21: number, m22: number, m23: number, m24: number,
		m31: number, m32: number, m33: number, m34: number,
		m41: number, m42: number, m43: number, m44: number): Matrix4 {
		return new Matrix4(
			m11, m21, m31, m41,
			m12, m22, m32, m42,
			m13, m23, m33, m43,
			m14, m24, m34, m44
		);
	}

	static fromRowMajorArray(v: number[]): Matrix4 {
		if (v.length >= 16)
			return new Matrix4(
				v[0], v[4], v[8], v[12],
				v[1], v[5], v[9], v[13],
				v[2], v[6], v[10], v[14],
				v[3], v[7], v[11], v[15]
			);
		return new Matrix4(
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0
		);
	}

	static fromColMajorArray(v: number[]): Matrix4 {
		if (v.length >= 16)
			return new Matrix4(
				v[0], v[1], v[2], v[3],
				v[4], v[5], v[6], v[7],
				v[8], v[9], v[10], v[11],
				v[12], v[13], v[14], v[15]
			);
		return new Matrix4(
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0
		);
	}

	static makeTranslation(x: number, y: number, z: number): Matrix4 {
		return Matrix4.makeRowMajor(
			1, 0, 0, x,
			0, 1, 0, y,
			0, 0, 1, z,
			0, 0, 0, 1
		);
	}

	static makeScale(x: number, y: number, z: number): Matrix4 {
		return Matrix4.makeRowMajor(
			x, 0, 0, 0,
			0, y, 0, 0,
			0, 0, z, 0,
			0, 0, 0, 1
		);
	}

	static makeRotation(angleInDegrees: number, x: number, y: number, z: number): Matrix4 {
		var c = Math.cos(angleInDegrees * Math.PI / 180.0);
		var s = Math.sin(angleInDegrees * Math.PI / 180.0);
		var invLength = 1.0 / Math.sqrt(x * x + y * y + z * z);
		x *= invLength;
		y *= invLength;
		z *= invLength;

		return Matrix4.makeRowMajor(
			x * x * (1 - c) + c, x * y * (1 - c) - z * s, x * z * (1 - c) + y * s, 0.0,
			y * x * (1 - c) + z * s, y * y * (1 - c) + c, y * z * (1 - c) - x * s, 0.0,
			x * z * (1 - c) - y * s, y * z * (1 - c) + x * s, z * z * (1 - c) + c, 0.0,
			0.0, 0.0, 0.0, 1.0
		);
	}

	static makeOrtho(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4 {
		var tx = -(right + left) / (right - left);
		var ty = -(top + bottom) / (top - bottom);
		var tz = -(far + near) / (far - near);

		return Matrix4.makeRowMajor(
			2 / (right - left), 0, 0, tx,
			0, 2 / (top - bottom), 0, ty,
			0, 0, -2 / (far - near), tz,
			0, 0, 0, 1
		);
	}

	static makeOrtho2D(left: number, right: number, bottom: number, top: number): Matrix4 {
		return Matrix4.makeOrtho(left, right, bottom, top, -1, 1);
	}

	static makeFrustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4 {
		var A = (right + left) / (right - left);
		var B = (top + bottom) / (top - bottom);
		var C = - (far + near) / (far - near);
		var D = - 2 * far * near / (far - near);

		return Matrix4.makeRowMajor(
			2 * near / (right - left), 0, A, 0,
			0, 2 * near / (top - bottom), B, 0,
			0, 0, C, D,
			0, 0, -1, 0
		);
	}

	static makePerspectiveY(fovy: number, aspect: number, near: number, far: number): Matrix4 {
		var f = 1.0 / Math.tan(Math.PI * fovy / 360.0);

		return Matrix4.makeRowMajor(
			f / aspect, 0, 0, 0,
			0, f, 0, 0,
			0, 0, (far + near) / (near - far), 2 * far * near / (near - far),
			0, 0, -1, 0
		);
	}

	static makePerspectiveX(fovx: number, aspect: number, near: number, far: number): Matrix4 {
		var f = 1.0 / Math.tan(Math.PI * fovx / 360.0);

		return Matrix4.makeRowMajor(
			f, 0, 0, 0,
			0, f * aspect, 0, 0,
			0, 0, (far + near) / (near - far), 2 * far * near / (near - far),
			0, 0, -1, 0
		);
	}

	static makeLookAt(eye: Vector3, center: Vector3, up: Vector3): Matrix4 {
		var F = Vector3.sub(center, eye).norm();
		var UP = up.norm();
		var S = Vector3.cross(F, UP).norm();
		var U = Vector3.cross(S, F).norm();

		return Matrix4.multiply(
			Matrix4.makeRowMajor(
				S.x, S.y, S.z, 0,
				U.x, U.y, U.z, 0,
				-F.x, -F.y, -F.z, 0,
				0, 0, 0, 1),
			Matrix4.makeTranslation(-eye.x, -eye.y, -eye.z)
		);
	}

	static makeShadowBias(): Matrix4 {
		return Matrix4.makeRowMajor(
			0.5, 0.0, 0.0, 0.5,
			0.0, 0.5, 0.0, 0.5,
			0.0, 0.0, 0.5, 0.5,
			0.0, 0.0, 0.0, 1.0
		);
	}

	static makeCubeFaceMatrix(face: number): Matrix4 {
		// +X
		if (face == 0) return Matrix4.makeRotation(90.0, 0.0, 1.0, 0.0);
		// -X
		if (face == 1) return Matrix4.makeRotation(270.0, 0.0, 1.0, 0.0);
		// +Y
		if (face == 2) return Matrix4.makeRotation(90.0, 1.0, 0.0, 0.0);
		// -Y
		if (face == 3) return Matrix4.makeRotation(270.0, 1.0, 0.0, 0.0);
		// +Z
		if (face == 4) return Matrix4.makeIdentity();
		// -Z
		if (face == 5) return Matrix4.makeRotation(180.0, 0.0, 1.0, 0.0);
		return new Matrix4(
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0
		);
	}

	toColMajorArray(): number[] {
		return [
			this.m11, this.m21, this.m31, this.m41,
			this.m12, this.m22, this.m32, this.m42,
			this.m13, this.m23, this.m33, this.m43,
			this.m14, this.m24, this.m34, this.m44
		];
	}

	toRowMajorArray(): number[] {
		return [
			this.m11, this.m12, this.m13, this.m14,
			this.m21, this.m22, this.m23, this.m24,
			this.m31, this.m32, this.m33, this.m34,
			this.m41, this.m42, this.m43, this.m44
		];
	}

	static multiply(m1: Matrix4, m2: Matrix4): Matrix4 {
		return new Matrix4(
			m1.m11 * m2.m11 + m1.m21 * m2.m12 + m1.m31 * m2.m13 + m1.m41 * m2.m14,
			m1.m11 * m2.m21 + m1.m21 * m2.m22 + m1.m31 * m2.m23 + m1.m41 * m2.m24,
			m1.m11 * m2.m31 + m1.m21 * m2.m32 + m1.m31 * m2.m33 + m1.m41 * m2.m34,
			m1.m11 * m2.m41 + m1.m21 * m2.m42 + m1.m31 * m2.m43 + m1.m41 * m2.m44,
			m1.m12 * m2.m11 + m1.m22 * m2.m12 + m1.m32 * m2.m13 + m1.m42 * m2.m14,
			m1.m12 * m2.m21 + m1.m22 * m2.m22 + m1.m32 * m2.m23 + m1.m42 * m2.m24,
			m1.m12 * m2.m31 + m1.m22 * m2.m32 + m1.m32 * m2.m33 + m1.m42 * m2.m34,
			m1.m12 * m2.m41 + m1.m22 * m2.m42 + m1.m32 * m2.m43 + m1.m42 * m2.m44,
			m1.m13 * m2.m11 + m1.m23 * m2.m12 + m1.m33 * m2.m13 + m1.m43 * m2.m14,
			m1.m13 * m2.m21 + m1.m23 * m2.m22 + m1.m33 * m2.m23 + m1.m43 * m2.m24,
			m1.m13 * m2.m31 + m1.m23 * m2.m32 + m1.m33 * m2.m33 + m1.m43 * m2.m34,
			m1.m13 * m2.m41 + m1.m23 * m2.m42 + m1.m33 * m2.m43 + m1.m43 * m2.m44,
			m1.m14 * m2.m11 + m1.m24 * m2.m12 + m1.m34 * m2.m13 + m1.m44 * m2.m14,
			m1.m14 * m2.m21 + m1.m24 * m2.m22 + m1.m34 * m2.m23 + m1.m44 * m2.m24,
			m1.m14 * m2.m31 + m1.m24 * m2.m32 + m1.m34 * m2.m33 + m1.m44 * m2.m34,
			m1.m14 * m2.m41 + m1.m24 * m2.m42 + m1.m34 * m2.m43 + m1.m44 * m2.m44
		);
	}

	LoadMatrix(m: Matrix4): Matrix4 {
		this.m11 = m.m11; this.m21 = m.m21; this.m31 = m.m31; this.m41 = m.m41;
		this.m12 = m.m12; this.m22 = m.m22; this.m32 = m.m32; this.m42 = m.m42;
		this.m13 = m.m13; this.m23 = m.m23; this.m33 = m.m33; this.m43 = m.m43;
		this.m14 = m.m14; this.m24 = m.m24; this.m34 = m.m34; this.m44 = m.m44;
		return this;
	}

	MultMatrix(m: Matrix4): Matrix4 {
		this.LoadMatrix(Matrix4.multiply(this, m));
		return this;
	}

	transform(v: Vector4): Vector4 {
		return new Vector4(
			this.m11 * v.x + this.m12 * v.y + this.m13 * v.z + this.m14 * v.w,
			this.m21 * v.x + this.m22 * v.y + this.m23 * v.z + this.m24 * v.w,
			this.m31 * v.x + this.m32 * v.y + this.m33 * v.z + this.m34 * v.w,
			this.m41 * v.x + this.m42 * v.y + this.m43 * v.z + this.m44 * v.w
		);
	}

	asInverse(): Matrix4 {
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

		return new Matrix4(
			tmp4 * tmp11,
			(-this.m12 * tmp3 + this.m13 * tmp2 - this.m14 * tmp1) * tmp11,
			(this.m12 * tmp14 - this.m13 * tmp13 + this.m14 * tmp12) * tmp11,
			(-this.m12 * tmp17 + this.m13 * tmp16 - this.m14 * tmp15) * tmp11,
			tmp10 * tmp11,
			(this.m11 * tmp3 - this.m13 * tmp8 + this.m14 * tmp6) * tmp11,
			(-this.m11 * tmp14 + this.m13 * tmp19 - this.m14 * tmp18) * tmp11,
			(this.m11 * tmp17 - this.m13 * tmp21 + this.m14 * tmp20) * tmp11,
			tmp9 * tmp11,
			(-this.m11 * tmp2 + this.m12 * tmp8 - this.m14 * tmp5) * tmp11,
			(this.m11 * tmp13 - this.m12 * tmp19 + this.m14 * tmp22) * tmp11,
			(-this.m11 * tmp16 + this.m12 * tmp21 - this.m14 * tmp23) * tmp11,
			tmp7 * tmp11,
			(this.m11 * tmp1 - this.m12 * tmp6 + this.m13 * tmp5) * tmp11,
			(-this.m11 * tmp12 + this.m12 * tmp18 - this.m13 * tmp22) * tmp11,
			(this.m11 * tmp15 - this.m12 * tmp20 + this.m13 * tmp23) * tmp11
		);
	}

	asTranspose(): Matrix4 {
		return new Matrix4(
			this.m11, this.m12, this.m13, this.m14,
			this.m21, this.m22, this.m23, this.m24,
			this.m31, this.m32, this.m33, this.m34,
			this.m41, this.m42, this.m43, this.m44
		);
	}
} // class Matrix4