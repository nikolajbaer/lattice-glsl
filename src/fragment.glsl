uniform float time;
uniform vec3 color;
uniform vec3 ro;
//uniform vec3 rd;
varying vec2 vUv;

#define MAX_STEPS 100
#define MAX_DIST 100.0
#define SURF_DIST 0.001

//https://www.youtube.com/watch?v=S8AWd66hoCo&t=169s
float GetDist(vec3 p){
  float d = length(p) - .5;
  return d;
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
  vec3 rd = normalize(vec3(uv.x,uv.y,1));

  float d = Raymarch(ro,rd);
  gl_FragColor.rgba = vec4(0.0,0.0,0.0,1.0);

  if(d<MAX_DIST){
    gl_FragColor.r = 1.0;
  }

}