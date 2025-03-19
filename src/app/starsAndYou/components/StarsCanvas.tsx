'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useHover } from '../contexts/HoverContext';

// 创建五角星形状
function createStarShape(innerRadius = 0.4, outerRadius = 1, points = 5) {
  const shape = new THREE.Shape();
  const angle = Math.PI / points;

  // 生成五角星的点
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const x = Math.cos(i * angle) * radius;
    const y = Math.sin(i * angle) * radius;
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }

  shape.closePath();
  return shape;
}

// 飞行的3D五角星组件
function FallingStarCover({
  initialPosition = [0, 0, 0],
  size = 1,
  initialRotation = [0, 0, 0],
  color = 0xffffff,
  fallSpeed = 1,
  rotationSpeed = 0.01,
  side = 0  // 0 = 中间, -1 = 左侧, 1 = 右侧
}) {
  const { isHovering } = useHover();
  const mesh = useRef<THREE.Mesh>(null);
  const maxY = 60;  // 视野顶部
  const minY = -60; // 视野底部
  const sideOffset = side * 20; // 侧向偏移

  // 当前速度插值
  const currentSpeedRef = useRef(fallSpeed);

  // 星星下落和旋转
  useFrame((state) => {
    if (mesh.current) {
      // 平滑过渡到目标速度 (悬停时减速到原速度的20%)
      const targetSpeed = isHovering ? fallSpeed * 0.2 : fallSpeed;
      currentSpeedRef.current += (targetSpeed - currentSpeedRef.current) * 0.05;

      // 从上到下飞行
      mesh.current.position.y -= currentSpeedRef.current * 0.1;

      // 左右轻微摆动
      mesh.current.position.x = initialPosition[0] + Math.sin(state.clock.getElapsedTime() * 0.5 + sideOffset) * 2;

      // 3D旋转效果 - 悬停时也减慢旋转
      const currentRotSpeed = isHovering ? rotationSpeed * 0.3 : rotationSpeed;
      mesh.current.rotation.x += currentRotSpeed;
      mesh.current.rotation.y += currentRotSpeed * 0.7;
      mesh.current.rotation.z += currentRotSpeed * 0.5;

      // 当星星飞出底部，将其重置到顶部
      if (mesh.current.position.y < minY) {
        mesh.current.position.y = maxY;
        mesh.current.position.x = initialPosition[0];
        mesh.current.position.z = initialPosition[2];
      }
    }
  });

  // 创建五角星几何体
  const geometry = useMemo(() => {
    const starShape = createStarShape();
    const extrudeSettings = {
      depth: size * 0.1,
      bevelEnabled: true,
      bevelThickness: size * 0.05,
      bevelSize: size * 0.02,
      bevelSegments: 3
    };
    return new THREE.ExtrudeGeometry(starShape, extrudeSettings);
  }, [size]);

  return (
    <mesh
      ref={mesh}
      position={[initialPosition[0], initialPosition[1], initialPosition[2]]}
      rotation={initialRotation as [number, number, number]}
      scale={[size, size, size]}
    >
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial
        color={color}
        roughness={0.3}
        metalness={0.7}
        emissive={color}
        emissiveIntensity={isHovering ? 0.7 : 0.5}
      />
    </mesh>
  );
}

// 前景飞行星空
function FallingStarsField() {
  // 生成随机星星
  const stars = useMemo(() => {
    const temp = [];
    const colors = [0xffffff, 0xffffdd, 0xddddff, 0xffdddd]; // 白、淡黄、淡蓝、淡红

    for (let i = 0; i < 50; i++) { // 前景星星
      const x = (Math.random() - 0.5) * 80;
      const y = Math.random() * 120 - 70; // 随机分布在整个高度
      const z = (Math.random() - 0.5) * 40 + 10;

      const size = Math.random() * 0.5 + 0.3; // 0.3-0.8的大小
      const rotation = [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const fallSpeed = Math.random() * 0.5 + 0.9; // 随机下落速度
      const rotationSpeed = Math.random() * 0.01 + 0.005;
      const side = Math.floor(Math.random() * 3) - 1; // -1, 0, 1

      temp.push({
        position: [x, y, z],
        size,
        rotation,
        color,
        fallSpeed,
        rotationSpeed,
        side,
        id: i
      });
    }
    return temp;
  }, []);

  return (
    <group>
      {stars.map((star) => (
        <FallingStarCover
          key={star.id}
          initialPosition={star.position as [number, number, number]}
          size={star.size}
          initialRotation={star.rotation as [number, number, number]}
          color={star.color}
          fallSpeed={star.fallSpeed}
          rotationSpeed={star.rotationSpeed}
          side={star.side}
        />
      ))}
    </group>
  );
}

// 背景飞行星空
function BackgroundFallingStars() {
  // 生成随机背景星星
  const stars = useMemo(() => {
    const temp = [];
    const colors = [0xffffff, 0xffffee, 0xeeeeff]; // 背景星星颜色

    for (let i = 0; i < 200; i++) { // 背景星星更多
      const x = (Math.random() - 0.5) * 120;
      const y = Math.random() * 120 - 60; // 随机分布在整个高度
      const z = (Math.random() - 0.5) * 60 - 30; // 放到更远处

      const size = Math.random() * 0.3 + 0.1; // 更小的星星
      const rotation = [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const fallSpeed = Math.random() * 0.3 + 0.2; // 背景星星下落更慢
      const rotationSpeed = Math.random() * 0.005 + 0.002;
      const side = Math.floor(Math.random() * 3) - 1; // -1, 0, 1

      temp.push({
        position: [x, y, z],
        size,
        rotation,
        color,
        fallSpeed,
        rotationSpeed,
        side,
        id: i
      });
    }
    return temp;
  }, []);

  return (
    <group>
      {stars.map((star) => (
        <FallingStarCover
          key={star.id}
          initialPosition={star.position as [number, number, number]}
          size={star.size}
          initialRotation={star.rotation as [number, number, number]}
          color={star.color}
          fallSpeed={star.fallSpeed}
          rotationSpeed={star.rotationSpeed}
          side={star.side}
        />
      ))}
    </group>
  );
}

// 星空画布组件
export default function StarsCanvas() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      pointerEvents: 'none',
    }}>
      <Canvas
        camera={{ position: [0, 0, 50], fov: 45, near: 0.1, far: 1000 }}
        style={{
          background: 'linear-gradient(to bottom, #0d1424 0%, #030610 100%)',
          width: '100%',
          height: '100%',
        }}
        dpr={[1, 2]}
      >
        {/* 光源 - 增强3D感 */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#8844ff" />

        {/* 星星图层 */}
        <BackgroundFallingStars />
        <FallingStarsField />
      </Canvas>
    </div>
  );
}

