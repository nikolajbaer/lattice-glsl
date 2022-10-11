import { useFrame } from "@react-three/fiber"
import { FloatType,DataTexture,Mesh,Vector3, RGBAFormat, UVMapping } from 'three'
import { useMemo,useRef } from "react"
import vertexShader from './vertex.glsl?raw'
import fragmentShader from './fragment.glsl?raw'

export function Lattice(props:{latticeData:Vector3[],s:number,r:number}){
  const latticeDataTex = useMemo(() => {
    //https://threejs.org/docs/#api/en/textures/DataTexture
    const data:number[] = []
    props.latticeData.forEach((p,i)=>{
      data.push(p.x,p.y,p.z,1.0);
    })
    const tex = new DataTexture(Float32Array.from(data),props.latticeData.length,1,RGBAFormat,FloatType,UVMapping)
    tex.needsUpdate = true
    return tex
  },[props.latticeData])

  const uniforms = useMemo(() => {
    return {
      radius:{value:props.r},
      latticeDataTex:{value:latticeDataTex},
      segments:{value:props.latticeData.length/2},
    }
  },[])

  const ref = useRef<Mesh>(null)
  useFrame((delta) =>{
//    if(ref && ref.current){
//      ref.current.material.uniforms.time.value += 0.01 
//    }
  })

  return (
      <mesh ref={ref} frustumCulled={false}>
        <boxGeometry args={[props.s,props.s,props.s]} />
        <shaderMaterial
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          transparent={true}
          uniforms={uniforms}
        />
      </mesh>
  )
}