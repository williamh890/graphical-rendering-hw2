precision highp float;

uniform samplerCube EnviroCube;

varying vec3 vTexcoord;

void main() {
  gl_FragColor = vec4(textureCube(EnviroCube, vTexcoord).rgb, 1.0);
}
