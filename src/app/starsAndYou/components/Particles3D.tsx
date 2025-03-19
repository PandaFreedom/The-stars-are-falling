'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

interface Particles3DProps {
  mousePosition: { x: number, y: number };
}

function ParticlesInstance({ mousePosition }: Particles3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  // 更新鼠标位置
  useEffect(() => {
    if (mousePosition.x && mousePosition.y) {
      mouse.current.x = (mousePosition.x / window.innerWidth) * 2 - 1;
      mouse.current.y = -(mousePosition.y / window.innerHeight) * 2 + 1;
    }
  }, [mousePosition]);

  // 创建粒子
  useEffect(() => {
    if (particlesRef.current) {
      const geometry = new THREE.BufferGeometry();
      const count = 1000;

      const positions = new Float32Array(count * 3);
      const scales = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

        scales[i] = Math.random();
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

      // 更新材质
      const material = new THREE.PointsMaterial({
        size: 0.1,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8,
        color: new THREE.Color('#ffffff'),
        blending: THREE.AdditiveBlending,
      });

      particlesRef.current.geometry = geometry;
      particlesRef.current.material = material;
    }
  }, []);

  // 动画和交互
  useFrame(({ clock, camera }) => {
    if (groupRef.current && particlesRef.current) {
      // 旋转粒子群
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;

      // 鼠标交互 - 使用光线投射
      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObject(particlesRef.current);

      if (intersects.length > 0) {
        // 获取交点附近的粒子
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        const intersection = intersects[0].point;

        for (let i = 0; i < positions.length; i += 3) {
          const x = positions[i];
          const y = positions[i + 1];
          const z = positions[i + 2];

          const particlePos = new THREE.Vector3(x, y, z);
          const distance = particlePos.distanceTo(intersection);

          // 如果粒子在交点附近，向外推
          if (distance < 1) {
            const direction = particlePos.sub(intersection).normalize();
            const pushStrength = (1 - distance) * 0.05;

            positions[i] += direction.x * pushStrength;
            positions[i + 1] += direction.y * pushStrength;
            positions[i + 2] += direction.z * pushStrength;
          }
        }

        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={particlesRef} />
    </group>
  );
}

export default function Particles3D({ mousePosition }: Particles3DProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 简单使用超时来模拟视图进入效果
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 3,
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 1s ease-in-out'
    }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ParticlesInstance mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
}
