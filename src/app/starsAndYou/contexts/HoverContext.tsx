'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

// 定义Context类型
interface HoverContextType {
  isHovering: boolean;
  setIsHovering: (hovering: boolean) => void;
}

// 创建Context
const HoverContext = createContext<HoverContextType | undefined>(undefined);

// 提供Context的Provider组件
export function HoverProvider({ children }: { children: ReactNode }) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <HoverContext.Provider value={{ isHovering, setIsHovering }}>
      {children}
    </HoverContext.Provider>
  );
}

// 自定义Hook便于使用Context
export function useHover() {
  const context = useContext(HoverContext);
  if (context === undefined) {
    throw new Error('useHover must be used within a HoverProvider');
  }
  return context;
}
