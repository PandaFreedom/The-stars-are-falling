"use client";

import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, ReloadOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
interface LoginFormValues {
  username: string;
  password: string;
  captcha: string;
}

const LoginForm: React.FC = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['captcha'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3001/api/user/loginSvg', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('网络错误，无法获取验证码');
      }
      return response.text(); // 返回 SVG 文本
    }
  });
  // 刷新验证码函数
  const refreshCaptcha = () => {
    queryClient.invalidateQueries({ queryKey: ['captcha'] });
  };

  const onFinish = (values: LoginFormValues) => {
    operation.mutate(values);
    console.log('values', values);
  };

  const operation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const response = await fetch('http://localhost:3001/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error('登录失败');
      }
      return response.json();
    },
    onSuccess: (data) => {
      if (data.code === 200) {
        message.success('登录成功');
        // 登录成功后可以进行跳转
        router.push('/dashboard');
      } else {
        message.error(data.message || '登录失败');
        // 登录失败后刷新验证码
        refreshCaptcha();
      }
    },
    onError: () => {
      message.error('登录失败，请重试');
      // 发生错误时也刷新验证码
      refreshCaptcha();
    }
  });

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

      <Form.Item
        name="captcha"
        rules={[{ required: true, message: '请输入验证码!' }]}
      >
        <div className="flex items-center gap-2">
          <Input placeholder='请输入验证码' />
          <div className="flex items-center">
            {isLoading ? (
              <div>加载验证码...</div>
            ) : (
              <>
                <div dangerouslySetInnerHTML={{ __html: data || '' }} />
                <Button
                  type="text"
                  icon={<ReloadOutlined />}
                  onClick={refreshCaptcha}
                  title="刷新验证码"
                />
              </>
            )}
          </div>
        </div>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="w-full"
          size="large"
          loading={operation.isPending}
        >
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
