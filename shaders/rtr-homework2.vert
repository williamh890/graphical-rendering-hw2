uniform mat4 ProjectionMatrix;
uniform mat4 CameraMatrix;
uniform mat4 WorldMatrix;

attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec3 aColor;
attribute vec3 aTexcoord;

varying vec3 vPosition;
varying vec3 vViewDir;
varying vec3 vNormal;
varying vec4 vColor;
varying vec3 vTexcoord;

// The inverse transpose of a rotation matrix
// is the original matrix itself!
mat3 Top3x3(in mat4 m)
{
  return mat3(
    m[0].x, m[0].y, m[0].z,
    m[1].x, m[1].y, m[1].z,
    m[2].x, m[2].y, m[2].z);
}
// The transpose of a rotation matrix
// is its inverse.
mat3 Top3x3Transpose(in mat4 m)
{
  return mat3(
    m[0].x, m[1].x, m[2].x,
    m[0].y, m[1].y, m[2].y,
    m[0].z, m[1].z, m[2].z);
}

void main() {
    vec4 P = WorldMatrix * vec4(aPosition, 1.0);
    vPosition = P.xyz;
    vViewDir = CameraMatrix[3].xyz - P.xyz;
    vNormal = Top3x3(WorldMatrix) * aNormal;
    vColor = vec4(aColor, 1.0);
    vTexcoord = aTexcoord;

    gl_Position = ProjectionMatrix * CameraMatrix * P;
}