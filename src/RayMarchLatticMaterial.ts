import { extend } from '@react-three/fiber'
import vertexShader from './vertex.glsl?raw'
import fragmentShader from './fragment.glsl?raw'
import { Color } from 'three'
import { shaderMaterial } from '@react-three/drei'

export const ColorShiftMaterial = shaderMaterial(
  { time: 0, color: new Color(0.2, 0.0, 0.1) },
  vertexShader,
  fragmentShader
)