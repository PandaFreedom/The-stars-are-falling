"use client"
import { Button, Card, Form, Input } from 'antd';
const ZooPage = () => {
  const [form] = Form.useForm();

  const handleFinish = () => {
    const values = form.getFieldsValue(); // 获取表单数据
    // 确保 age 是数字类型
    values.age = Number(values.age);

    // 检查 age 是否有效
    if (isNaN(values.age)) {
      console.error("无效的年龄值");
      return; // 终止请求
    }

    fetch('http://localhost:3001/api/zoo', {
      method: 'POST',
      body: JSON.stringify(values), // 使用表单数据
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log(res);
        form.resetFields();
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
            <Input type="number" />
          </Form.Item>
          <Button type='primary' htmlType='submit'>Submit</Button>
        </Form>
      </Card>
    </div>
  );
};

export default ZooPage;
