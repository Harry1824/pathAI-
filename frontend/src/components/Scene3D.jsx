import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedSphere() {
  const meshRef = useRef();
  const { mouse } = useThree();

  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 0.2;
    meshRef.current.rotation.x += delta * 0.1;

    // Interactive tracking (smoothly lerp to mouse position)
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mouse.x * 2.5, 0.05);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, mouse.y * 2.5, 0.05);
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2, 1]} />
        <meshStandardMaterial 
          color="#45a29e" 
          wireframe 
          emissive="#66fcf1" 
          emissiveIntensity={0.6} 
        />
      </mesh>
    </Float>
  );
}

export default function Scene3D() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#66fcf1" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1.5} />
        <AnimatedSphere />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.3} />
      </Canvas>
    </div>
  );
}
