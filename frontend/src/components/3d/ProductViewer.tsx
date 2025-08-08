'use client'

import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'
import { Mesh } from 'three'

interface Product3DProps {
  modelUrl?: string
  className?: string
}

const DefaultModel = () => {
  const meshRef = useRef<Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.3
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#4F46E5" />
    </mesh>
  )
}

const Model = ({ modelUrl }: { modelUrl: string }) => {
  try {
    const { scene } = useGLTF(modelUrl)
    return <primitive object={scene} scale={1.5} />
  } catch (error) {
    console.error('Failed to load 3D model:', error)
    return <DefaultModel />
  }
}

const ProductViewer: React.FC<Product3DProps> = ({ 
  modelUrl, 
  className = "w-full h-96" 
}) => {
  return (
    <div className={`${className} relative rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <Environment preset="studio" />
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          {modelUrl ? (
            <Model modelUrl={modelUrl} />
          ) : (
            <DefaultModel />
          )}
          
          <OrbitControls 
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            autoRotate={!modelUrl}
            autoRotateSpeed={2}
          />
        </Suspense>
      </Canvas>
      
      {/* Controls Info */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-600 bg-white/80 backdrop-blur-sm px-2 py-1 rounded">
        Click and drag to rotate • Scroll to zoom
      </div>
    </div>
  )
}

export default ProductViewer