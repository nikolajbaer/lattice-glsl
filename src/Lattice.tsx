import { useFrame,extend } from "@react-three/fiber"
import { Mesh,Vector3 } from 'three'
import { useRef } from "react"
import { RayMarchLatticeMaterial } from "./RayMarchLatticeMaterial"

extend({RayMarchLatticeMaterial})

export function Lattice(){
  const ref = useRef<Mesh>(null)
  useFrame((delta) =>{
    if(ref && ref.current){
      ref.current.material.uniforms.time.value += 0.01 
    }
  })

  return (
      <mesh ref={ref}>
        <boxGeometry args={[2,2,2]} />
        <rayMarchLatticeMaterial
          key={RayMarchLatticeMaterial.key}
          ro={new Vector3(0,0,-3)}
          //rd={new Vector3(0,0,-1)}
          color="blue"
          time={1}
        />
      </mesh>
  )
}