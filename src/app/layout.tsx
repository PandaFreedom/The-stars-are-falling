"use client"
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import Providers from "./providers";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AntdRegistry>
          <Providers>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
