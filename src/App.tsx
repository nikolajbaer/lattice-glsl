import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { GizmoHelper, OrbitControls } from '@react-three/drei'
import './App.css'
import { Lattice } from './Lattice'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Canvas>
      <Lattice />
      <gridHelper />
      <OrbitControls />
    </Canvas>
  )
}

export default App
