import { useFrame,extend } from "@react-three/fiber"
import { Mesh,Vector3 } from 'three'
import { useRef } from "react"
import { RayMarchLatticeMaterial } from "./RayMarchLatticeMaterial"

extend({RayMarchLatticeMaterial})

export function Lattice(){
  const ref = useRef<Mesh>(null)
  useFrame((delta) =>{
    if(ref && ref.current){
      const t = performance.now()
      //ref.current.position.x = Math.sin(t/1000)
      ref.current.material.uniforms.time.value += 0.01 
    }
  })

  return (
      <mesh ref={ref}>
        <boxGeometry args={[2,2,2]} />
        <rayMarchLatticeMaterial
          key={RayMarchLatticeMaterial.key}
          color="blue"
          time={1}
          transparent={true}
        />
      </mesh>
  )
}