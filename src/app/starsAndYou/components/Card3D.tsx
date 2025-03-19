'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from '../starsAndYou.module.css';
import { useHover } from '../contexts/HoverContext';

// 简化的卡片组件 - 移除所有3D效果和鼠标交互
interface Card3DProps {
  children: React.ReactNode;
  delay?: number;
  index?: number;
}

export default function Card3D({ children, delay = 0, index = 0 }: Card3DProps) {
  const { setIsHovering } = useHover();
  // 方向交替
  const direction = index % 2 === 0 ? -1 : 1;

  // 处理鼠标进入和离开事件
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <motion.div
      className={styles.card3dContainer}
      initial={{
        opacity: 0,
        y: 20,
        x: 10 * direction,
        scale: 0.95
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1
      }}
      transition={{
        type: "spring",
        stiffness: 50,
        damping: 15,
        delay: delay,
        mass: 1
      }}
      viewport={{ once: true, margin: "-5%" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.card3dContent}>
        {/* 添加装饰元素 */}
        <div className={styles.cardDecor}></div>

        <div className={styles.cardInner}>
          {children}
        </div>
      </div>
    </motion.div>
  );
}
