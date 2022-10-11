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

struct Intersection {
  vec3 position;
  vec3 normal;
  float dist;
};

Intersection SphereIntersects(vec3 ro, vec3 rd,vec3 p,float r){
  Intersection i;
  vec3 L = p - ro;
  float ll = length(L);
  float tc = dot(L,rd);
  if(tc < 0.0){
    i.dist = MAX_DIST;
    return i;
  }
  float d = sqrt(ll*ll - tc*tc);
  float t1c = sqrt(r*r - d*d);
  float dp = t1c-tc;
  vec3 pi = ro + rd * dp;
  i.position = pi; // point of intersection
  i.normal = normalize(pi-p);  // normal of intersection
  i.dist = dp; // distance from ro to intersection
  return i;
}

Intersection CylinderIntersects(vec3 ro, vec3 rd,vec3 l0,vec3 l1,float r){
  // does the ray r0->p intersect cylinder l0=>l1? with radius r?
  // or does it intersect the sphere at l0/r or l1/r?
  // if so return depth
  // if not, return MAX_DIST
  Intersection i0 = SphereIntersects(ro,rd,l0,r);
  Intersection i1 = SphereIntersects(ro,rd,l1,r);
  if(i0.dist < i1.dist ) return i0;
  return i1;
}

Intersection GetIntersection(vec3 ro, vec3 rd){
  Intersection d;
  d.dist = MAX_DIST;

  //vec3 points[] = vec3[3](vec3(0.9,0.0,0.0),vec3(0.0,0.9,0.0),vec3(0.0,0.0,0.9));
  vec3 points[] = vec3[1](vec3(0.0,0.0,0.0));

  for(int i=0;i<points.length();i++){
    //vec3 data = texture2D( latticeDataTex, vec2(i*2,0) ).xyz;
    vec3 data = points[i];
    Intersection d1 = SphereIntersects(ro,rd,data,0.3);
    if(d1.dist < d.dist ) d = d1;
  }

  return d;
}

float GetDist(vec3 p){
  // Torus
  float d = length(p) - .5;
  d = length(vec2(length(p.xz)-.5,p.y)) - .1;
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

  Intersection i = GetIntersection(ro,rd);
  if(i.dist < MAX_DIST){
    gl_FragColor.rgb = i.normal;
    gl_FragColor.a = 1.0;
  }

}