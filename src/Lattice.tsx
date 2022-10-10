import { useFrame,extend } from "@react-three/fiber"
import { Mesh,Color } from 'three'
import { useRef } from "react"
import { ColorShiftMaterial } from "./RayMarchLatticMaterial"

extend({ColorShiftMaterial})

export function Lattice(){
  const ref = useRef<Mesh>(null)
  useFrame((delta) =>{
    if(ref && ref.current){
      //ref.current.rotation.y += 0.01
      ref.current.material.uniforms.time.value += 0.01 
    }
  })

  return (
      <mesh ref={ref}>
        <boxGeometry args={[2,2,2]} />
        <colorShiftMaterial
          key={ColorShiftMaterial.key}
          color="blue"
          time={1}
        />
      </mesh>
  )
}