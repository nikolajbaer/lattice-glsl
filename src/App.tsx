import { useState,useMemo,useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { GizmoHelper, OrbitControls, Stats } from '@react-three/drei'
import './App.css'
import { BufferGeometry,Vector3 } from 'three'
import { Lattice } from './Lattice'

function App() {
  const [count, setCount] = useState(0)
  const linesRef = useRef<BufferGeometry>(null)
  const n = 5 
  const s = 2
  const r = 0.025 

  const lattice = useMemo<Vector3[]>(()=>{
    const data = []
    const n3 = n * 3 * 2
    const sm = s - r*2
    const i = sm/n
    const s2m = -sm/2

    for(let x=0;x<=n;x++){
      for(let y=0;y<=n;y++){
        for(let z=0;z<=n;z++){
          // +X
          if(x<n){
            data.push(new Vector3(s2m+x*i,s2m+y*i,s2m+z*i))
            data.push(new Vector3(s2m+(x+1)*i,s2m+y*i,s2m+z*i))
          }
          // +Y
          if(y<n){
            data.push(new Vector3(s2m+x*i,s2m+y*i,s2m+z*i))
            data.push(new Vector3(s2m+x*i,s2m+(y+1)*i,s2m+z*i))
          }
          // +Z
          if(z<n){
            data.push(new Vector3(s2m+x*i,s2m+y*i,s2m+z*i))
            data.push(new Vector3(s2m+x*i,s2m+y*i,s2m+(z+1)*i))
          }
        }
      }
    }
    return data
  },[])

  const latticeData = useMemo<Float32Array>(() => {
      const data = new Float32Array(lattice.length*3) 
      lattice.forEach((v,i) => {
        data[i*3] = v.x
        data[i*3+1] = v.y
        data[i*3+2] = v.z
      })
      return data
  },[lattice])

  return (
    <Canvas camera={{near:0.001}}>
      <Lattice latticeData={lattice} s={s} r={r} />
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
        <bufferAttribute
          attach={"attributes-position"}
          count={latticeData.length/3}
          itemSize={3}
          array={latticeData}
          />
        </bufferGeometry>
        <lineBasicMaterial color="blue" />
      </lineSegments>
      <gridHelper />
      <OrbitControls />
      <Stats />
    </Canvas>
  )
}

export default App
