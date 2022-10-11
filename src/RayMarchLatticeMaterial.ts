import vertexShader from './vertex.glsl?raw'
import fragmentShader from './fragment.glsl?raw'
import { Texture } from 'three'
import { shaderMaterial } from '@react-three/drei'

export const RayMarchLatticeMaterial = shaderMaterial(
  { 
    radius: 0.1,
    latticeDataTex:  new Texture(),
    segments: 1,
  },
  vertexShader,
  fragmentShader
)