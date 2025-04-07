"use client"
import { Button, Form, Input } from 'antd';
import React, { useState } from 'react';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
const { Item } = Form;
function LoginForm() {
  const [form] = Form.useForm();
  // 定义表单值的类型
  interface FormValues {
    username: string;
    password: string;
    confirmPassword?: string; // 可选字段
    svgText?: string;
  }

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['svg'],
    queryFn: () => {
      return fetch('http://localhost:3001/login/svg', {
        credentials: 'include',
      }).then((res) => res.text())
      .then(svgData => {
        console.log('获取到的SVG数据:', svgData.slice(0, 100) + '...'); // 只显示前100个字符
        return svgData;
      });
    },
  });

  // console.log('data', data); //验证码

  const onFinish = (values: FormValues) => {
    console.log('提交的值:', values);

    // 根据是否在注册模式确定请求URL
    const url = isRegistering ? 'http://localhost:3001/login/creactUser' : 'http://localhost:3001/login/userLogin';

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(values),
    })
    .then((res) => res.json())
    .then((data) => {
      console.log('响应数据:', data);
      // 这里可以添加处理响应的逻辑
    })
    .catch((error) => {
      console.error('请求错误:', error);
    });

    form.resetFields();
  };

  const [isRegistering, setIsRegistering] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const refreshSvg = () => {
    refetch();
  };
  return (
    <div>
      <Form form={form} onFinish={onFinish}>
        <Item name="username" rules={[{ required: true, message: '请输入用户名!' }]}>
          <Input placeholder='用户名' />
        </Item>
        <Item name="password" rules={[{ required: true, message: '请输入密码!' }]}>
          <Input
            placeholder='密码'
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
            <Item name="confirmPassword" rules={[{ required: true, message: '请输入确认密码!' }]}>
              <Input
                placeholder='确认密码'
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
            <div className='flex flex-row gap-3'>
              {data && (
                <div dangerouslySetInnerHTML={{ __html: data }} onClick={refreshSvg} />
              )}
              <Item name='svgText' rules={[{ required: true, message: '请输入验证码!' }]}>
                <Input placeholder='请输入验证码' />
              </Item>
              <Button type='primary' onClick={refreshSvg}>
                刷新验证码
              </Button>
            </div>
          </>
        )}
        <Item className='flex justify-between gap-3 flex-row mt-5'>
          <Button type='primary' htmlType='submit'>
            {!isRegistering ? '登录' : '注册'}
          </Button>
          <Button type='default' onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? '登录' : '注册'}
          </Button>
        </Item>
      </Form>
    </div>
  );
}

export default LoginForm;
