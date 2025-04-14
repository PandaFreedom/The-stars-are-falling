"use client"
import { Button, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation'; // 导入路由

const { Item } = Form;

function LoginForm() {
  const router = useRouter(); // 初始化路由
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // 添加加载状态

  // 定义表单值的类型
  interface FormValues {
    username: string;
    password: string;
    confirmPassword?: string; // 可选字段
    svgText?: string;
  }

  // 获取验证码
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['svg'],
    queryFn: () => {
      return fetch('http://localhost:3001/auth/svg', {
        credentials: 'include',
      }).then((res) => res.text())
      .then(svgData => {
        console.log('获取到的SVG数据:', svgData.slice(0, 100) + '...'); // 只显示前100个字符
        return svgData;
      });
    },
  });

  // 用户注册处理
  const handleRegister = (values: FormValues) => {
    setLoading(true);
    fetch('http://localhost:3001/auth/creactUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(values),
    })
    .then((res) => res.json())
    .then((data) => {
      setLoading(false);
      console.log('响应数据:', data);

      if (data.success) {
        // 注册成功，保存token
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('userId', data.id);

        message.success('注册成功！');

        // 跳转到首页或仪表板
        router.push('/dashboard');
      } else {
        // 注册失败，显示错误信息
        message.error(data.message || '注册失败，请重试');
      }
    })
    .catch((error) => {
      setLoading(false);
      console.error('请求错误:', error);
      message.error('网络错误，请重试');
    });
  };

  // 用户登录处理
  const handleLogin = (values: FormValues) => {
    setLoading(true);
    fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        name: values.username,
        password: values.password
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      setLoading(false);
      console.log('登录响应:', data);

      if (data.success) {
        // 登录成功，保存token
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('username', data.user.name);
        localStorage.setItem('userId', data.user.id);

        message.success('登录成功！');

        // 跳转到首页或仪表板
        router.push('/dashboard');
      } else {
        // 登录失败，显示错误信息
        message.error(data.message || '登录失败，请检查用户名和密码');
      }
    })
    .catch((error) => {
      setLoading(false);
      console.error('登录请求错误:', error);
      message.error('网络错误，请重试');
    });
  };

  // 表单提交处理
  const onFinish = (values: FormValues) => {
    console.log('提交的值:', values);

    if (isRegistering) {
      // 注册流程
      handleRegister(values);
    } else {
      // 登录流程
      handleLogin(values);
    }
  };

  const [isRegistering, setIsRegistering] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // 切换登录/注册模式，并重置表单
  const toggleMode = () => {
    form.resetFields();
    setIsRegistering(!isRegistering);
  };

  // 刷新验证码
  const refreshSvg = () => {
    refetch();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isRegistering ? '用户注册' : '用户登录'}
      </h2>

      <Form form={form} onFinish={onFinish} layout="vertical">
        <Item
          name="username"
          rules={[{ required: true, message: '请输入用户名!' }]}
          label="用户名"
        >
          <Input placeholder='请输入用户名' />
        </Item>

        <Item
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
          label="密码"
        >
          <Input
            placeholder='请输入密码'
            type={passwordVisible ? 'text' : 'password'}
            suffix={
              passwordVisible ? (
                <EyeOutlined onClick={() => setPasswordVisible(false)} />
              ) : (
                <EyeInvisibleOutlined onClick={() => setPasswordVisible(true)} />
              )
            }
          />
        </Item>

        {isRegistering && (
          <>
            <Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致!'));
                  },
                }),
              ]}
              label="确认密码"
            >
              <Input
                placeholder='请再次输入密码'
                type={confirmPasswordVisible ? 'text' : 'password'}
                suffix={
                  confirmPasswordVisible ? (
                    <EyeOutlined onClick={() => setConfirmPasswordVisible(false)} />
                  ) : (
                    <EyeInvisibleOutlined onClick={() => setConfirmPasswordVisible(true)} />
                  )
                }
              />
            </Item>

            <Item label="验证码">
              <div className='flex flex-row gap-3 items-center'>
                {data && (
                  <div
                    className="cursor-pointer border rounded p-1"
                    dangerouslySetInnerHTML={{ __html: data }}
                    onClick={refreshSvg}
                  />
                )}
                <Item
                  name='svgText'
                  rules={[{ required: true, message: '请输入验证码!' }]}
                  noStyle
                >
                  <Input placeholder='请输入验证码' className="flex-1" />
                </Item>
                <Button onClick={refreshSvg} type="link">
                  刷新验证码
                </Button>
              </div>
            </Item>
          </>
        )}

        <div className="flex justify-between items-center mt-6">
          <Button
            type='primary'
            htmlType='submit'
            loading={loading}
            block
          >
            {!isRegistering ? '登录' : '注册'}
          </Button>
        </div>

        <div className="text-center mt-4">
          <Button type="link" onClick={toggleMode}>
            {isRegistering ? '已有账号？点击登录' : '没有账号？点击注册'}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default LoginForm;
