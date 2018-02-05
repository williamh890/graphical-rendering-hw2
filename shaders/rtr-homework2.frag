#extension GL_OES_standard_derivatives: enable

precision highp float;

uniform vec3 SunDirTo;
uniform vec3 SunE0;
uniform samplerCube EnviroCube;

uniform sampler2D map_normal;

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
