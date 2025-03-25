import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  console.log("Middleware is running!", request.nextUrl.pathname);
  console.log(11123);

  // 使用request.cookies检查登录状态
  const token = request.cookies.get('admin-token');

  console.log("Token:", token);

  // 访问登录页或者已登录的用户可以继续
  if (request.nextUrl.pathname === "/login") {
    return NextResponse.next();
  }

  // 如果未登录且访问除登录页外的页面，重定向到登录页
  if (!token) {
    console.log("Redirecting to login page...");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - api 路由
     * - _next/static (静态文件)
     * - _next/image (图片优化API)
     * - favicon.ico (浏览器请求的图标)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

