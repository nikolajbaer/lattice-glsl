import { useFrame,extend } from "@react-three/fiber"
import { FloatType,RGBFormat,DataTexture,Mesh,Vector3 } from 'three'
import { useMemo,useRef } from "react"
import { RayMarchLatticeMaterial } from "./RayMarchLatticeMaterial"

extend({RayMarchLatticeMaterial})

export function Lattice(props:{latticeData:Vector3[],s:number,r:number}){
  const latticeDataTex = useMemo(() => {
    //https://threejs.org/docs/#api/en/textures/DataTexture
    const data = new Float32Array(props.latticeData.length*3)
    props.latticeData.forEach((p,i)=>{
      data[i*3] = p.x
      data[i*3+1] = p.y
      data[i*3+2] = p.z
    })
    const w = props.latticeData.length*3
    const tex = new DataTexture(data,w,1,RGBFormat,FloatType)
    tex.needsUpdate = true
    return tex
  },[props.latticeData])

  const ref = useRef<Mesh>(null)
  useFrame((delta) =>{
//    if(ref && ref.current){
//      ref.current.material.uniforms.time.value += 0.01 
//    }
  })

  return (
      <mesh ref={ref} frustumCulled={false}>
        <boxGeometry args={[props.s,props.s,props.s]} />
        <rayMarchLatticeMaterial
          key={RayMarchLatticeMaterial.key}
          transparent={true}
          radius={props.r}
          latticeDataTex={latticeDataTex}
          segments={props.latticeData.length/2}
        />
      </mesh>
  )
}