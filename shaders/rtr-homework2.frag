#extension GL_OES_standard_derivatives: enable

precision highp float;

const vec3 White = vec3(1.0, 1.0, 1.0);
const vec3 Black = vec3(0.0, 0.0, 0.0);
const vec3 Gold = vec3(0.8118, 0.7216, 0.4863);
const vec3 Clay = vec3(0.7290, 0.2120, 0.1920);
uniform vec3 SunDirTo;
uniform vec3 SunE0;
uniform samplerCube EnviroCube;

vec3 Kd = Clay;
vec3 Ks = White;
float Roughness = 1.0;
uniform float Shininess;
uniform sampler2D map_Kd;
uniform sampler2D map_normal;
uniform float map_Kd_mix;
uniform float map_normal_mix;
uniform float PBKdm;
uniform float PBKsm;
uniform float PBn2;
uniform float PBk2;

uniform float PageValue1;

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
    vec3 L;
    vec3 H;
    vec3 D;
    float NdotL;
    float NdotH;
    float LdotD; // difference angle
    float VdotH;
    vec3 E0;
};

struct MaterialInfo
{
	vec3 Kd;
	vec3 Ks;
	vec3 Ka;
	float diffuseRoughness;
	float diffuseRoughness2;
	float specularRoughness;
	float specularRoughness2;
	float specularExponent;
	float specularGGXgamma;
	float specularN2;
	float specularK2;
	float F0;
};

MaterialInfo Material;
FragmentInfo Fragment;
LightInfo Lights[8];


// Physically Based Lighting -------------------------------


float ComputeFresnelSchlick2(float F0, float cos_theta)
{
	return F0 + (1.0 - F0) * pow(1.0 - cos_theta, 5.0);
}


// Fragment Preparation ------------------------------------

mat3 transpose(mat3 m) {
  return mat3(
    m[0].x, m[1].x, m[2].x,
    m[0].y, m[1].y, m[2].y,
    m[0].z, m[1].z, m[2].z);
}

mat3 MakeInverseMat3(mat3 M)
{
	mat3 M_t = transpose(M);
	float det = dot(cross(M_t[0], M_t[1]), M_t[2]);
	mat3 adjugate = mat3(
		cross(M_t[1], M_t[2]),
		cross(M_t[2], M_t[1]),
		cross(M_t[0], M_t[1]));
	return adjugate / det;
}

mat3 MakeCotangentFrame(vec3 N, vec3 p, vec2 uv)
{
	vec3 dp1 = dFdx(p);
	vec3 dp2 = dFdy(p);
	vec2 duv1 = dFdx(uv);
	vec2 duv2 = dFdy(uv);

	vec3 dp2perp = cross(dp2, N);
	vec3 dp1perp = cross(N, dp1);
	vec3 T = dp2perp * duv1.x + dp1perp * duv2.x;
	vec3 B = dp2perp * duv1.y + dp1perp * duv2.y;

	float fragmentArea = length(dp1) * length(dp2);

	float invmax = inversesqrt(max(dot(T,T), dot(B,B)));
	return mat3(T * invmax, B * invmax, N);
}

vec3 PerturbNormal(vec3 N, vec3 V, vec2 texcoord)
{
	vec3 map = 2.0 * texture2D(map_normal, texcoord).rgb - 1.0;
	//map.z *= BumpinessFactor;
	//vec3 map = texture(map_normal, texcoord).rgb;
	mat3 TBN = MakeCotangentFrame(N, -V, texcoord);
	return normalize(TBN * map);
}


void PrepareForShading() {
  vec3 dp1 = dFdx(vPosition);
  vec3 dp2 = dFdy(vPosition);
  Fragment.N = normalize(vNormal);
  Fragment.Nbump = normalize(cross(dp1, dp2));
  if (length(Fragment.N) < 0.1)
    Fragment.N = Fragment.Nbump;
  Fragment.V = normalize(-vViewDir);
  Fragment.R = reflect(Fragment.N, Fragment.V);
  Fragment.NdotV = max(0.0, dot(Fragment.N, Fragment.V));
  Fragment.NdotR = max(0.0, dot(Fragment.N, Fragment.R));
}


void PrepareMaterial() {
  float n2 = 1.333;
  float t = (1.0 - n2) / (1.0 + n2);
  float m = PageValue1 * PageValue1;//0.15;
  Material.Kd = Kd;
  Material.Ks = Ks;
  Material.specularExponent = max(0.0, 2.0 / (m * m) - 2.0);
  Material.F0 = t*t;
}


void PrepareLights() {
    Lights[0].enabled = 1.0;
    Lights[0].L = SunDirTo;
    Lights[0].E0 = 30.0 * SunE0;
    Lights[1].enabled = 1.0;
    Lights[1].L = Fragment.N;
    Lights[1].E0 = textureCube(EnviroCube, Fragment.N).rgb;
    Lights[2].enabled = 1.0;
    Lights[2].L = Fragment.R;
    Lights[2].E0 = textureCube(EnviroCube, Fragment.R).rgb;

    for (int i = 0; i < 8; i++) {
      if (Lights[i].enabled == 0.0)
        continue;
      Lights[i].H = normalize(Lights[i].L + Fragment.V);
      Lights[i].D = normalize(Lights[i].L + Lights[i].H);
      Lights[i].NdotL = max(0.0, dot(Fragment.N, Lights[i].L));
      Lights[i].NdotH = max(0.0, dot(Fragment.N, Lights[i].H));
      Lights[i].LdotD = max(0.0, dot(Lights[i].L, Lights[i].D));
      Lights[i].VdotH = max(0.0, dot(Fragment.V, Lights[i].H));
    }
}

vec3 GetEnviroColor()
{
  float denom = 4.0 * Fragment.NdotV * Fragment.NdotV;
  float LdotD = Fragment.NdotR;
  float F = ComputeFresnelSchlick2(Material.F0, LdotD);
  float D = 1.0;
  float G = 1.0;
  float f_r = (D * F * G) / denom;
  return f_r * Fragment.NdotR * textureCube(EnviroCube, Fragment.R).rgb * Material.Ks;
}

vec3 GetNormalColor()
{
  float F = ComputeFresnelSchlick2(Material.F0, 1.0);
  return textureCube(EnviroCube, Fragment.N).rgb * Material.Ks;
}

float MaskingShadowingG2(float NdotL, float NdotV, float NdotH, float VdotH)
{
	float G1 = 2.0 * NdotH * NdotV / VdotH;
	float G2 = 2.0 * NdotH * NdotL / VdotH;
	return min(1.0, min(G1, G2));
}

float BlinnPhongD(float e, float NdotH)
{
		float C = (2.0 + e) / (2.0 * 3.14159);
		float D = C * pow(NdotH, e);
    return D;
}

void main() {
  PrepareForShading();
  PrepareMaterial();
  PrepareLights();

  vec3 enviroColor = GetEnviroColor() + GetNormalColor();

  vec3 c_d = texture2D(map_Kd, vTexcoord.st).rgb;
  vec3 c_normal = texture2D(map_normal, vTexcoord.st).rgb;

  vec3 finalColor = Black;//enviroColor;
  for (int i = 0; i < 8; i++) {
    if (Lights[i].enabled == 0.0)
      continue;
    vec3 diffuseColor = Lights[i].E0 * Material.Kd * Lights[i].NdotL / 3.14159;

    //float D = BlinnPhongD(Material.specularExponent, Fragment.NdotV);
    float D = BlinnPhongD(Material.specularExponent, Lights[i].NdotH);
    float F = ComputeFresnelSchlick2(Material.F0, Lights[i].LdotD);
    float G = MaskingShadowingG2(Lights[i].NdotL, Fragment.NdotV, Lights[i].NdotH, Lights[i].VdotH);
    float denom = 4.0 * Lights[i].NdotL * Fragment.NdotV;

    vec3 specularColor = Black;
    if (denom >= 0.00001) {
      float f_r = (D * F * G) / denom;
      specularColor += f_r * Material.Ks * Lights[i].E0 * Lights[i].NdotL;
    }
    

    finalColor += diffuseColor + specularColor;
  }

    //vec3(Fragment.R.x, -Fragment.R.z, Fragment.R.y)).rgb;
  float toneMapScale = 0.25;
  gl_FragColor = vec4(toneMapScale * finalColor, 1.0);
}
