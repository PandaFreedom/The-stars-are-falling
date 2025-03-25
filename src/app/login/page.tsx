import React from 'react';
import LoginForm from './_components/LoginForm';

function LoginPage() {
  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">登录系统</h1>
      <LoginForm />
    </div>
  );
}

export default LoginPage;
