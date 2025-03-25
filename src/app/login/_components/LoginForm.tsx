"use client";

import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface LoginFormValues {
  username: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  // 处理登录请求的mutation
  const loginMutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '登录失败');
      }

      return response.json();
    },
    onSuccess: (data) => {
      message.success('登录成功');
      // 存储token
      document.cookie = `admin-token=${data.token}; path=/`;
      // 跳转到首页或仪表盘
      router.push('/dashboard');
    },
    onError: (error: Error) => {
      message.error(error.message || '登录失败，请重试');
    },
  });

  const onFinish = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  return (
    <Form
      form={form}
      name="login"
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: '请输入用户名!' }]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="用户名"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: '请输入密码!' }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="密码"
          size="large"
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="w-full"
          size="large"
          loading={loginMutation.isPending}
        >
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
