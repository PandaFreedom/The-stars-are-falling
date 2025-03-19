"use client"
import { Button, Card, Form, Input } from 'antd';
const ZooPage = () => {
  const [form] = Form.useForm();

  const handleFinish = (values: { name: string; age: number }) => {
    fetch('http://localhost:3000/api/zoo', {
      method: 'POST',
      body: JSON.stringify(values),
    })
      .then((res) => {
        console.log(res);
        form.resetFields(); // 清空输入框
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-400">
      <h1>Zoo Data</h1>
      <Card className='w-1/2 mx-auto'>
        <Form form={form} onFinish={handleFinish}>
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Age" name="age">
            <Input />
          </Form.Item>
          <Button type='primary' htmlType='submit'>Submit</Button>
        </Form>
      </Card>
    </div>
  );
};

export default ZooPage;
