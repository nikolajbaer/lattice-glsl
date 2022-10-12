import { useFrame } from "@react-three/fiber"
import { FloatType,DataTexture,Mesh,Vector3, RGBAFormat, UVMapping } from 'three'
import { useMemo,useRef } from "react"
import vertexShader from './vertex.glsl?raw'
import fragmentShader from './fragment.glsl?raw'

export function Lattice(props:{latticeData:Vector3[],s:number,r:number}){
  // Identify width required for 2d data tex, and increase to nearest power of 2
  // per https://stackoverflow.com/a/466256
  const base_width = Math.ceil(Math.sqrt(props.latticeData.length))
  const width = Math.pow(2,Math.ceil(Math.log(base_width)/Math.log(2)))
  console.log(`Texture Width is ${width} for ${props.latticeData.length}`)

  const latticeDataTex = useMemo(() => {
    //https://threejs.org/docs/#api/en/textures/DataTexture
    const data:Float32Array = new Float32Array(width*4*width)
    props.latticeData.forEach((p,i)=>{
      data[i*4] = p.x;
      data[i*4+1] = p.y;
      data[i*4+2] = p.z;
      data[i*4+3] = 1.0;
    })
    for(var i=base_width;i<width;i++){
      data[i] = 1.0;
    }
    console.log(`Data is ${width}x${width} (${width*width}) ${data.length} length`)
    const tex = new DataTexture(data,width,width,RGBAFormat,FloatType,UVMapping)
    tex.needsUpdate = true
    return tex
  },[props.latticeData])

  const uniforms = useMemo(() => {
    return {
      radius:{value:props.r},
      latticeDataTex:{value:latticeDataTex},
      segments:{value:props.latticeData.length/2},
      width:{value:width},
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