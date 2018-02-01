#version 100

#ifdef GL_ES
#extension OES_standard_derivatives: true;
#endif

uniform mat4 ProjectionMatrix;
uniform mat4 CameraMatrix;
uniform mat4 WorldMatrix;
uniform vec4 CameraPosition;

attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec3 aColor;
attribute vec3 aTexcoord;

varying vec4 vPosition;
varying vec3 vViewDir;
varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vTexcoord;

void main() {
    vPosition = WorldMatrix * vec4(aPosition, 1.0);
    vViewDir = CameraPosition.xyz - vPosition.xyz;
    vNormal = aNormal;
    vColor = aColor;
    vTexcoord = aTexcoord;

    gl_Position = ProjectionMatrix * CameraMatrix * WorldMatrix * vec4(aPosition, 1.0);
}