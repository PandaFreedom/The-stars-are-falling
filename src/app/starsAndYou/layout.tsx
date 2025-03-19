import React from 'react';

export default function StarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="stars-layout">
      {children}
    </div>
  );
}

