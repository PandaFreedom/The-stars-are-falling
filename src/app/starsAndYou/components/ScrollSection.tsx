'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from '../starsAndYou.module.css';

const ScrollSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleSections, setVisibleSections] = useState<boolean[]>([false, false, false]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const sections = [
    {
      title: "关心的问候",
      text: "亲爱的朋友，有胃病，希望你更要能好好照顾自己。记得多吃些对胃好的食物。"
    },
    {
      title: "温暖的陪伴",
      text: "在这个浩瀚的宇宙中，愿你感受到来自星辰的关怀。每一颗星星都在为你闪烁，提醒你要好好照顾自己，享受生活中的美好。"
    },
    {
      title: "希望的光芒",
      text: "当你仰望星空时，记得你并不孤单。星星的光芒,总有那么一束是为你而亮。"
    }
  ];

  // 创建滚动进度相关的动画值
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
  const rotateZ = useTransform(scrollYProgress, [0, 1], [0, 10]);

  // 使用Intersection Observer API检测元素可见性
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = sectionsRef.current.findIndex(ref => ref === entry.target);
          if (index !== -1) {
            setVisibleSections(prev => {
              const updated = [...prev];
              updated[index] = entry.isIntersecting;
              return updated;
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    sectionsRef.current.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionsRef.current.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.scrollSections}>
      {sections.map((section, index) => (
        <motion.div
          key={index}
          className={styles.section}
          ref={el => {
            if (el) sectionsRef.current[index] = el; // 修复类型错误
          }}
          style={{
            opacity: index === 1 ? opacity : undefined,
            scale: index === 1 ? scale : undefined
          }}
        >
          <motion.div
            className={styles.sectionContent}
            initial={{ opacity: 0, y: 50 }}
            animate={visibleSections[index] ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            style={{
              rotateZ: index === 2 ? rotateZ : undefined,
              transformOrigin: "center"
            }}
          >
            <motion.h2
              className={styles.sectionTitle}
              initial={{ opacity: 0 }}
              animate={visibleSections[index] ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {section.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={visibleSections[index] ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {section.text}
            </motion.p>

            {/* 装饰性星星 */}
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className={styles.star}
                style={{
                  position: "absolute",
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                  background: "white",
                  borderRadius: "50%",
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default ScrollSection;
