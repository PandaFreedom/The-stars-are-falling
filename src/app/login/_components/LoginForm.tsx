"use client"
import { Button, Form, Input } from 'antd';
import React, { useState } from 'react';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

const { Item } = Form;

function LoginForm() {
  const [form] = Form.useForm();
  // 定义表单值的类型
  interface FormValues {
    username: string;
    password: string;
    confirmPassword?: string; // 可选字段
  }

  const onFinish = (values: FormValues) => {
    console.log(values);
    form.resetFields();
  };

  const [isRegistering, setIsRegistering] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

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
        )}
        <Item className='flex justify-between gap-3'>
          {!isRegistering ? (
            <Button type='primary' htmlType='submit'> 登录 </Button>
          ) : (
            <Button type='primary' htmlType='submit'> 注册 </Button>
          )}
          <Button type='default' onClick={() => {
            setIsRegistering(!isRegistering);
          }}>
            {isRegistering ? '登录' : '注册'}
          </Button>
        </Item>
      </Form>
    </div>
  );
}

export default LoginForm;
