precision highp float;

uniform samplerCube EnviroCube;

varying vec3 vTexcoord;
uniform vec3 Ka;

void main() {
  gl_FragColor = vec4(textureCube(EnviroCube, vTexcoord).rgb * Ka, 1.0);
}
