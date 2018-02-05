#extension GL_OES_standard_derivatives: enable

precision highp float;

uniform vec3 SunDirTo;
uniform vec3 SunE0;
uniform samplerCube EnviroCube;

varying vec3 vPosition;
varying vec3 vViewDir;
varying vec3 vNormal;
varying vec4 vColor;
varying vec3 vTexcoord;

struct FragmentInfo {
  vec3 N;
  vec3 Nbump;
  vec3 tangent;
  vec3 binormal;
  vec3 R; // reflection vector
  vec3 V; // view vector
  float NdotV;
  float NdotR;
};

struct LightInfo {
    float enabled;
    float NdotL;
    vec3 L;
    vec3 E0;
};

FragmentInfo Fragment;
LightInfo Lights[8];

const vec3 White = vec3(1.0, 1.0, 1.0);

void PrepareForShading() {
  vec3 dp1 = dFdx(vPosition);
  vec3 dp2 = dFdy(vPosition);
  Fragment.N = normalize(vNormal);
  Fragment.Nbump = normalize(cross(dp1, dp2));
  if (length(Fragment.N) < 0.1)
    Fragment.N = Fragment.Nbump;
  Fragment.V = normalize(vViewDir);
  Fragment.R = reflect(Fragment.N, Fragment.V);
  Fragment.NdotV = max(0.0, dot(Fragment.N, Fragment.V));
  Fragment.NdotR = max(0.0, dot(Fragment.N, Fragment.R));
}

void PrepareLights() {
    Lights[0].enabled = 1.0;
    Lights[0].L = SunDirTo;
    Lights[0].E0 = SunE0;
    for (int i = 0; i < 8; i++) {
      if (Lights[0].enabled == 0.0)
        continue;
      Lights[0].NdotL = max(0.0, dot(Fragment.Nbump, SunDirTo));
    }
}

void main() {
  PrepareForShading();
  PrepareLights();
  vec3 enviroColor = Fragment.NdotR * textureCube(EnviroCube, Fragment.R).rgb;
    //vec3(Fragment.R.x, -Fragment.R.z, Fragment.R.y)).rgb;
  vec3 finalColor = enviroColor + Lights[0].NdotL * Lights[0].E0 * vec3(1.0,1.0,1.0);
  gl_FragColor = vec4(finalColor, 1.0);
}
