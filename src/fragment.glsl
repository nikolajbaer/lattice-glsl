precision highp float;
uniform float radius;
uniform sampler2D latticeDataTex;
uniform int segments;
varying vec2 vUv;
varying vec3 ro; // ray origin
varying vec3 hitPos; // hit position

#define MAX_STEPS 100
#define MAX_DIST 100.0
#define SURF_DIST 0.001

// Baseline Reference (Unity/hlsl)
//https://www.youtube.com/watch?v=S8AWd66hoCo&t=169s


// https://iquilezles.org/articles/distfunctions/
float sdCapsule( vec3 p, vec3 a, vec3 b, float r ){
  vec3 pa = p - a, ba = b - a;
  float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
  return length( pa - ba*h ) - r;
}

vec3 GetDataPoint(int i){
  // i is the index of our point
  vec2 segUV = vec2(float(i)/float(segments*2),0);
  return texture2D( latticeDataTex, segUV).xyz;
}

float GetDist(vec3 p){
  float d = MAX_DIST;

  // TODO how can we efficiently not compute 
  // every SDF for every segment every step for every fragment!!
  for(int i=0;i<32;i++){
    vec3 a = GetDataPoint(i);
    vec3 b = GetDataPoint(i+1);
    float d1 = sdCapsule(p,a,b,radius);
    if(d1 < d) d = d1;
  }
  return d;
}

vec3 GetNormal(vec3 p){
  vec2 e = vec2(0.01,0);
  vec3 n = GetDist(p) - vec3(
    GetDist(p-e.xyy),
    GetDist(p-e.yxy),
    GetDist(p-e.yyx)
  );
  return normalize(n);
}

float Raymarch(vec3 ro, vec3 rd){
  float dO = 0.0; // distance we have marched
  float dS; // distance to the scene 
  // Step forward 
  for(int i=0;i<MAX_STEPS;i++){
    // ray marching position
    // origin + distance from origin time ray direction
    vec3 p = ro + dO * rd;
    // distance to surface from our current point
    dS = GetDist(p);
    // move forward by shortest distance to the scene
    dO += dS;
    // if distance to scene is less than some small value
    // or we marched past objects into the distance
    if(dS<SURF_DIST || dO>MAX_DIST) break;
  }
  // how far we marched forward
  return dO;
}

void main() {
  vec2 uv = vUv - .5;
  vec3 rd = normalize(hitPos-ro);
  gl_FragColor.rgba = vec4(0.0,0.0,0.0,0.0);

  float d = Raymarch(ro,rd);
  if(d < MAX_DIST){
    vec3 p = ro + rd * d;
    vec3 n = GetNormal(p);
    gl_FragColor.rgb = n;
    gl_FragColor.a = 1.0;
  }
}


// References
// https://iquilezles.org/articles/distfunctions/
// https://iquilezles.org/articles/sdfbounding/