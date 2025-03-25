"use client"
import { Button, Card, Form, Input, Select } from 'antd';
import React from 'react';
import ShowTodoList from './_component/showTodoList';
import { FormValues } from '../types/todolist';
import { useQueryClient } from '@tanstack/react-query';

function Page () {
    const queryClient = useQueryClient();
    const [form] = Form.useForm();

    const onFinish = async (values: FormValues) => {
        try {
            const response = await fetch('http://localhost:3001/api/todolist/create', {
                method: 'POST',
                body: JSON.stringify(values),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                console.log('任务创建成功，正在刷新数据...');
                // 使用await确保invalidateQueries完成
                await queryClient.invalidateQueries({ queryKey: ['todolist'] });
                // 强制刷新
                await queryClient.refetchQueries({ queryKey: ['todolist'] });
                form.resetFields(); // 清空表单
            } else {
                console.error('创建任务失败');
            }
        } catch (error) {
            console.error('创建请求出错:', error);
        }
    };

    return (
        <div>
            <Card>
                <Form form={form} onFinish={onFinish}>
                    <Form.Item label="任务名称" name="title" rules={[{ required: true, message: '请输入任务名称!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="任务描述" name="description">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item label="任务状态" name="status" rules={[{ required: true, message: '请选择任务状态!' }]}>
                        <Select>
                            <Select.Option value="未完成">未完成</Select.Option>
                            <Select.Option value="已完成">已完成</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit" type='primary'>提交</Button>
                    </Form.Item>
                </Form>
            </Card>
            <Card>
                <p className='text-7xl text-red-500'>todolist:</p>
                <div>
                    <ShowTodoList />
                </div>
            </Card>
        </div>
    );
}

export default Page;
