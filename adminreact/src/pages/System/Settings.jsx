import React, { useState, useEffect } from 'react';
import {
  Card, Form, Input, Button, Switch, InputNumber,
  Select, Space, message, Tabs, Upload, Row, Col,
  Divider
} from 'antd';
import {
  UploadOutlined, SaveOutlined, ReloadOutlined
} from '@ant-design/icons';
import styled from 'styled-components';

const { Option } = Select;
const { TextArea } = Input;

const StyledCard = styled(Card)`
  margin-bottom: 20px;
`;

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('basic');

  // 获取系统设置
  const fetchSettings = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockSettings = {
        // 基本设置
        siteName: '后台管理系统',
        siteDescription: '这是一个功能强大的后台管理系统',
        logo: 'https://example.com/logo.png',
        favicon: 'https://example.com/favicon.ico',
        recordNumber: 'ICP备12345678号',
        
        // 上传设置
        uploadMaxSize: 10,
        allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'doc', 'docx', 'pdf'],
        imageCompressQuality: 80,
        storageType: 'local',
        ossAccessKey: '',
        ossSecretKey: '',
        ossBucket: '',
        ossEndpoint: '',
        
        // 安全设置
        loginAttempts: 5,
        lockTime: 30,
        passwordMinLength: 8,
        passwordComplexity: ['number', 'lowercase', 'uppercase', 'special'],
        sessionTimeout: 120,
        enableCaptcha: true,
        
        // 邮件设置
        smtpHost: 'smtp.example.com',
        smtpPort: 465,
        smtpUser: 'noreply@example.com',
        smtpPass: '',
        smtpFrom: 'System <noreply@example.com>',
        enableSsl: true,
      };

      form.setFieldsValue(mockSettings);
    } catch (error) {
      message.error('获取系统设置失败');
      console.error('获取系统设置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // 处理表单提交
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // 模拟API调用
      console.log('提交的设置:', values);
      message.success('保存成功');
    } catch (error) {
      message.error('保存失败');
      console.error('保存失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理重置
  const handleReset = () => {
    confirm({
      title: '确定要重置所有设置吗？',
      content: '重置后将恢复系统默认设置',
      onOk: () => {
        fetchSettings();
        message.success('已重置为默认设置');
      },
    });
  };

  // 标签页配置
  const tabs = [
    {
      key: 'basic',
      label: '基本设置',
      children: (
        <div>
          <Form.Item
            label="网站名称"
            name="siteName"
            rules={[{ required: true, message: '请输入网站名称' }]}
          >
            <Input placeholder="请输入网站名称" />
          </Form.Item>

          <Form.Item
            label="网站描述"
            name="siteDescription"
          >
            <TextArea
              placeholder="请输入网站描述"
              rows={4}
              maxLength={200}
              showCount
            />
          </Form.Item>

          <Form.Item
            label="网站Logo"
            name="logo"
          >
            <Input.Group compact>
              <Input style={{ width: 'calc(100% - 100px)' }} />
              <Upload>
                <Button icon={<UploadOutlined />}>上传</Button>
              </Upload>
            </Input.Group>
          </Form.Item>

          <Form.Item
            label="Favicon"
            name="favicon"
          >
            <Input.Group compact>
              <Input style={{ width: 'calc(100% - 100px)' }} />
              <Upload>
                <Button icon={<UploadOutlined />}>上传</Button>
              </Upload>
            </Input.Group>
          </Form.Item>

          <Form.Item
            label="备案号"
            name="recordNumber"
          >
            <Input placeholder="请输入备案号" />
          </Form.Item>
        </div>
      ),
    },
    {
      key: 'upload',
      label: '上传设置',
      children: (
        <div>
          <Form.Item
            label="最大上传大小"
            name="uploadMaxSize"
            rules={[{ required: true, message: '请输入最大上传大小' }]}
          >
            <InputNumber
              min={1}
              max={100}
              addonAfter="MB"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="允许的文件类型"
            name="allowedFileTypes"
            rules={[{ required: true, message: '请选择允许的文件类型' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择允许的文件类型"
              style={{ width: '100%' }}
            >
              <Option value="jpg">JPG</Option>
              <Option value="jpeg">JPEG</Option>
              <Option value="png">PNG</Option>
              <Option value="gif">GIF</Option>
              <Option value="doc">DOC</Option>
              <Option value="docx">DOCX</Option>
              <Option value="pdf">PDF</Option>
              <Option value="zip">ZIP</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="图片压缩质量"
            name="imageCompressQuality"
            rules={[{ required: true, message: '请输入图片压缩质量' }]}
          >
            <InputNumber
              min={1}
              max={100}
              addonAfter="%"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="存储方式"
            name="storageType"
            rules={[{ required: true, message: '请选择存储方式' }]}
          >
            <Select>
              <Option value="local">本地存储</Option>
              <Option value="oss">阿里云OSS</Option>
              <Option value="cos">腾讯云COS</Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.storageType !== currentValues.storageType}
          >
            {({ getFieldValue }) => (
              getFieldValue('storageType') !== 'local' && (
                <>
                  <Form.Item
                    label="AccessKey"
                    name="ossAccessKey"
                    rules={[{ required: true, message: '请输入AccessKey' }]}
                  >
                    <Input placeholder="请输入AccessKey" />
                  </Form.Item>

                  <Form.Item
                    label="SecretKey"
                    name="ossSecretKey"
                    rules={[{ required: true, message: '请输入SecretKey' }]}
                  >
                    <Input.Password placeholder="请输入SecretKey" />
                  </Form.Item>

                  <Form.Item
                    label="Bucket"
                    name="ossBucket"
                    rules={[{ required: true, message: '请输入Bucket' }]}
                  >
                    <Input placeholder="请输入Bucket" />
                  </Form.Item>

                  <Form.Item
                    label="Endpoint"
                    name="ossEndpoint"
                    rules={[{ required: true, message: '请输入Endpoint' }]}
                  >
                    <Input placeholder="请输入Endpoint" />
                  </Form.Item>
                </>
              )
            )}
          </Form.Item>
        </div>
      ),
    },
    {
      key: 'security',
      label: '安全设置',
      children: (
        <div>
          <Form.Item
            label="登录尝试次数"
            name="loginAttempts"
            rules={[{ required: true, message: '请输入登录尝试次数' }]}
          >
            <InputNumber
              min={1}
              max={10}
              style={{ width: '100%' }}
              addonAfter="次"
            />
          </Form.Item>

          <Form.Item
            label="锁定时间"
            name="lockTime"
            rules={[{ required: true, message: '请输入锁定时间' }]}
          >
            <InputNumber
              min={1}
              max={1440}
              style={{ width: '100%' }}
              addonAfter="分钟"
            />
          </Form.Item>

          <Form.Item
            label="密码最小长度"
            name="passwordMinLength"
            rules={[{ required: true, message: '请输入密码最小长度' }]}
          >
            <InputNumber
              min={6}
              max={32}
              style={{ width: '100%' }}
              addonAfter="位"
            />
          </Form.Item>

          <Form.Item
            label="密码复杂度要求"
            name="passwordComplexity"
            rules={[{ required: true, message: '请选择密码复杂度要求' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择密码复杂度要求"
            >
              <Option value="number">数字</Option>
              <Option value="lowercase">小写字母</Option>
              <Option value="uppercase">大写字母</Option>
              <Option value="special">特殊字符</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="会话超时时间"
            name="sessionTimeout"
            rules={[{ required: true, message: '请输入会话超时时间' }]}
          >
            <InputNumber
              min={1}
              max={1440}
              style={{ width: '100%' }}
              addonAfter="分钟"
            />
          </Form.Item>

          <Form.Item
            label="启用验证码"
            name="enableCaptcha"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </div>
      ),
    },
    {
      key: 'email',
      label: '邮件设置',
      children: (
        <div>
          <Form.Item
            label="SMTP服务器"
            name="smtpHost"
            rules={[{ required: true, message: '请输入SMTP服务器' }]}
          >
            <Input placeholder="请输入SMTP服务器地址" />
          </Form.Item>

          <Form.Item
            label="SMTP端口"
            name="smtpPort"
            rules={[{ required: true, message: '请输入SMTP端口' }]}
          >
            <InputNumber
              min={1}
              max={65535}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="SMTP用户名"
            name="smtpUser"
            rules={[{ required: true, message: '请输入SMTP用户名' }]}
          >
            <Input placeholder="请输入SMTP用户名" />
          </Form.Item>

          <Form.Item
            label="SMTP密码"
            name="smtpPass"
            rules={[{ required: true, message: '请输入SMTP密码' }]}
          >
            <Input.Password placeholder="请输入SMTP密码" />
          </Form.Item>

          <Form.Item
            label="发件人"
            name="smtpFrom"
            rules={[{ required: true, message: '请输入发件人' }]}
          >
            <Input placeholder="请输入发件人" />
          </Form.Item>

          <Form.Item
            label="启用SSL"
            name="enableSsl"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </div>
      ),
    },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        enableCaptcha: true,
        enableSsl: true,
      }}
    >
      <Card
        title="系统设置"
        extra={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleReset}
            >
              重置
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={loading}
              onClick={() => form.submit()}
            >
              保存
            </Button>
          </Space>
        }
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabs}
        />
      </Card>
    </Form>
  );
};

export default Settings; 