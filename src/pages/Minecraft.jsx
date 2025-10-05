import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function MinecraftModel() {
  const group = useRef();
  const { scene } = useGLTF("/ice_spikes_minecraft/scene.gltf");

  return <primitive ref={group} object={scene} scale={7} />;
}

export default function Minecraft() {
  return (
    <Canvas
      style={{ width: "100vw", height: "100vh", display: "block" }}
      camera={{ position: [10, 10, 30], fov: 45 }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[20, 20, 10]} intensity={1.2} />
      <OrbitControls enableZoom={false} rotateSpeed={0.6} />
      <MinecraftModel />
    </Canvas>
  );
}

useGLTF.preload("/ice_spikes_minecraft/scene.gltf");
