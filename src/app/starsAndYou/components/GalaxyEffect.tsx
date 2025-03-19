'use client';

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import styles from '../starsAndYou.module.css';

// 星系模型
function Galaxy() {
  const galaxyRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  useEffect(() => {
    // 创建星系粒子
    if (particlesRef.current) {
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 5000;

      const positions = new Float32Array(particlesCount * 3);
      const colors = new Float32Array(particlesCount * 3);

      for (let i = 0; i < particlesCount; i++) {
        // 螺旋星系数学模型
        const radius = Math.random() * 5;
        const spinAngle = radius * 5;
        const branchAngle = (i % 3) * Math.PI * 2 / 3;

        const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3;
        const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3;
        const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3;

        positions[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i * 3 + 1] = randomY;
        positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        // 根据位置设置颜色（中心偏紫，边缘偏蓝）
        const mixedColor = new THREE.Color();
        const centerColor = new THREE.Color('#ff00ff');
        const edgeColor = new THREE.Color('#00ffff');
        mixedColor.lerpColors(centerColor, edgeColor, radius / 5);

        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
      });

      particlesRef.current.geometry = particlesGeometry;
      particlesRef.current.material = particlesMaterial;
    }
  }, []);

  useFrame(({ clock }) => {
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={galaxyRef}>
      <points ref={particlesRef} />
    </group>
  );
}

export default function GalaxyEffect() {
  return (
    <div className={styles.galaxyContainer}>
      <Canvas
        camera={{ position: [0, 2, 5], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Galaxy />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  );
}
