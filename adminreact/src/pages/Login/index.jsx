// src/pages/Login/index.js
import React from 'react';
import { Form, Input, Button, Checkbox, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
`;

const LoginCard = styled(Card)`
  width: 380px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const LogoTitle = styled.div`
  text-align: center;
  margin-bottom: 30px;
  
  h1 {
    font-size: 24px;
    margin-bottom: 0;
  }
  
  p {
    color: #888;
  }
`;

const Login = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('登录信息:', values);
    // 模拟登录成功
    message.success('登录成功！');
    navigate('/');
  };

  return (
    <LoginContainer>
      <LoginCard bordered={false}>
        <LogoTitle>
          <h1>爱奇轩管理系统</h1>
          <p>专业的社交平台管理后台</p>
        </LogoTitle>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
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
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
            <a style={{ float: 'right' }} href="#">
              忘记密码?
            </a>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" style={{ width: '100%' }}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;