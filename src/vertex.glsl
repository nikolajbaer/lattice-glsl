varying vec2 vUv;
varying vec3 ro;
varying vec3 hitPos;

// https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram
void main() {
  mat4 worldToObject = inverse(modelMatrix);
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  // camera to object space
  ro = (worldToObject * vec4(cameraPosition,1.0)).xyz;
  // position is already object space
  hitPos = position;
}