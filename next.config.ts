import type { NextConfig } from "next";
import { codeInspectorPlugin } from 'code-inspector-plugin'; // 使用 import 语法替代 require

const nextConfig: NextConfig = {
  webpack: (config) => { // 移除未使用的参数 dev 和 isServer
    config.plugins.push(codeInspectorPlugin({ bundler: 'webpack' }));
    return config;
  },
};

// export const config = {
//   matcher: "/:path*", // 作用于所有路由
// };

export default nextConfig;
