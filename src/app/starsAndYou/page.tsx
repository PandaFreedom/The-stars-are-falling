'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import styles from './starsAndYou.module.css';
import Card3D from './components/Card3D';
import { HoverProvider } from './contexts/HoverContext';

// 动态导入星空背景
const StarsCanvas = dynamic(() => import('./components/StarsCanvas'), { ssr: false });

// 流星组件
const Meteor = ({ delay = 0 }) => {
  return (
    <motion.div
      className={styles.meteor}
      initial={{ top: "-10%", left: "100%", opacity: 0 }}
      animate={{
        top: "120%",
        left: "-10%",
        opacity: [0, 0.8, 0.8, 0]
      }}
      transition={{
        duration: Math.random() * 2 + 2,
        delay: delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 15 + 10
      }}
    />
  );
};

// 添加一些前景星星，增强3D视差效果
function ParallaxStars() {
  const [stars, setStars] = useState<{id: number, x: number, y: number, size: number, delay: number}[]>([]);

  useEffect(() => {
    // 创建15-25颗前景星星
    const starCount = Math.floor(Math.random() * 10) + 15;
    const newStars = [];

    for (let i = 0; i < starCount; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100, // 百分比位置
        y: Math.random() * 100,
        size: Math.random() * 6 + 2, // 2-8px
        delay: Math.random() * 5 // 动画延迟
      });
    }

    setStars(newStars);
  }, []);

  return (
    <div className={styles.depthContainer}>
      {stars.map(star => (
        <div
          key={star.id}
          className={styles.parallaxStar}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`
          }}
        />
      ))}
    </div>
  );
}

export default function StarsAndYou() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollDir, setScrollDir] = useState('none');
  const lastScrollY = useRef(0);

  // 鼠标和滚动处理
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      // 检测滚动方向
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        setScrollDir('down');
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDir('up');
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 滚动动画控制
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start", "end"],
  });

  // 视差效果变量
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const titleScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const titleRotateX = useTransform(scrollYProgress, [0, 0.2], [0, -20]);

  // 内容部分
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

  return (
    <HoverProvider>
      <div ref={containerRef} className={styles.container}>
        {/* 星空背景 */}
        <StarsCanvas />

        {/* 装饰元素 - 流星 */}
        {[...Array(3)].map((_, i) => (
          <Meteor key={i} delay={i * 5} />
        ))}

        {/* 鼠标光晕跟随效果 */}
        <motion.div
          className={styles.cursorGlow}
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />

        {/* 3D滚动指示器 */}
        <div className={`${styles.scrollIndicator3D} ${scrollDir === 'down' ? styles.scrollDown : scrollDir === 'up' ? styles.scrollUp : ''}`}>
          <div className={styles.scrollLayer}></div>
          <div className={styles.scrollLayer}></div>
          <div className={styles.scrollLayer}></div>
        </div>

        {/* 添加前景星星，增强3D效果 */}
        <ParallaxStars />

        {/* 头部区域 - 欢迎部分 */}
        <motion.div
          className={styles.heroSection}
          style={{
            opacity: titleOpacity,
            y: titleY,
            scale: titleScale,
            rotateX: titleRotateX
          }}
        >
          <Card3D>
            <motion.div
              className={styles.nameContainer}
              whileHover={{
                scale: 1.1,
                rotateY: 10,
                z: 30
              }}
              whileTap={{ scale: 0.95, z: 10 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 17
              }}
            >
              <h1 className={styles.name}>尹丽</h1>
            </motion.div>

            <motion.p
              className={styles.subtitle}
              initial={{ opacity: 0, y: 20, z: -10 }}
              animate={{ opacity: 1, y: 0, z: 0 }}
              transition={{ delay: 0.8, duration: 1.2 }}
            >
              天天开心！～
            </motion.p>
          </Card3D>

          <motion.div
            className={styles.scrollIndicator}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.3, 1, 0.3],
              y: [0, 10, 0],
              filter: ["blur(0px)", "blur(1px)", "blur(0px)"]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            <span>向下滚动探索宇宙</span>
            <div className={styles.arrow}></div>
          </motion.div>
        </motion.div>

        {/* 内容区域 - 滚动部分 */}
        <div className={styles.sectionsContainer}>
          <AnimatePresence>
            {sections.map((section, index) => (
              <Card3D key={index} delay={0.2} index={index}>
                <h2 className={styles.sectionTitle}>
                  {section.title.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 20, rotateY: 90 }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                        rotateY: 0,
                        transition: {
                          delay: i * 0.05,
                          type: "spring",
                          stiffness: 100
                        }
                      }}
                      viewport={{ once: false, amount: 0.8 }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </h2>

                <motion.p
                  initial={{ opacity: 0, y: 20, z: -20 }}
                  whileInView={{ opacity: 1, y: 0, z: 0 }}
                  viewport={{ once: false, amount: 0.4 }}
                  transition={{
                    delay: 0.5,
                    type: "spring",
                    stiffness: 50
                  }}
                >
                  {section.text}
                </motion.p>

                <motion.button
                  className={styles.exploreButton}
                  initial={{ opacity: 0, scale: 0.8, z: -30 }}
                  whileInView={{ opacity: 1, scale: 1, z: 0 }}
                  whileHover={{
                    scale: 1.1,
                    z: 30,
                    boxShadow: "0 0 25px rgba(138, 43, 226, 0.8)"
                  }}
                  whileTap={{ scale: 0.95, z: 20 }}
                  viewport={{ once: false }}
                  transition={{
                    delay: 0.8,
                    type: "spring",
                    stiffness: 200,
                    damping: 10
                  }}
                >
                </motion.button>
              </Card3D>
            ))}
          </AnimatePresence>
        </div>

        {/* 页脚 */}
        <div className={styles.footer}>
          <p>© 2023 星辰与你 | 无限宇宙的奇妙旅程</p>
        </div>
      </div>
    </HoverProvider>
  );
}
