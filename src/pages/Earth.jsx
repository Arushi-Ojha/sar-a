import React, { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
function EarthSphere() {
  const ref = useRef();
  const baseColorTexture = useLoader(
    THREE.TextureLoader,
    "/earth/textures/Clouds_baseColor.png"
  );
  const emissiveTexture = useLoader(
    THREE.TextureLoader,
    "/earth/textures/Earth_emissive.jpeg"
  );
  const cloudTexture = useLoader(
    THREE.TextureLoader,
    "/earth/textures/Earth_baseColor.jpeg"
  );

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.001;
  });

  return (
    <>
      <mesh ref={ref}>
        <sphereGeometry args={[22, 64, 64]} />
        <meshStandardMaterial
          map={baseColorTexture}
          emissiveMap={emissiveTexture}
          emissiveIntensity={0.3}
          metalness={0.1}
          roughness={1}
        />
      </mesh>
      <mesh scale={[1.01, 1.01, 1.01]}>
        <sphereGeometry args={[22, 64, 64]} />
        <meshStandardMaterial
          map={cloudTexture}
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}
export default function Earth() {
  return (
    <Canvas
  style={{ width: "100vw", height: "100vh", display: "block" }}
  camera={{ position: [0, 12, 60], fov: 45 }}
>
  <ambientLight intensity={1} />
  <OrbitControls
        enableZoom={false}  
        enablePan={true}    
        rotateSpeed={0.5}     
      />
  <directionalLight position={[20, 20, 20]} intensity={1} />
  <EarthSphere />
</Canvas>

  );
}

