import React, { useState, useEffect } from 'react';
import {
  Card, Form, Input, Select,
  DatePicker, Button, Space,
  message
} from 'antd';
import {
  SaveOutlined,
  SendOutlined,
  RollbackOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import moment from 'moment';
import styled from 'styled-components';

const { Option } = Select;

const EditorWrapper = styled.div`
  .ql-editor {
    min-height: 300px;
  }
`;

const AnnouncementCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // 富文本编辑器配置
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  // 获取公告详情
  const fetchAnnouncementDetail = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      // 模拟API调用
      const mockData = {
        title: '测试公告标题',
        content: '<p>这是一条测试公告的内容...</p>',
        type: 'notice',
        priority: 'medium',
        publishTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        expireTime: moment().add(30, 'days').format('YYYY-MM-DD HH:mm:ss'),
      };

      form.setFieldsValue({
        ...mockData,
        publishTime: moment(mockData.publishTime),
        expireTime: moment(mockData.expireTime),
      });
    } catch (error) {
      message.error('获取公告详情失败');
      console.error('获取公告详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncementDetail();
  }, [id]);

  // 处理表单提交
  const handleSubmit = async (values, isDraft = false) => {
    setLoading(true);
    try {
      const submitData = {
        ...values,
        status: isDraft ? 'draft' : 'published',
        publishTime: values.publishTime?.format('YYYY-MM-DD HH:mm:ss'),
        expireTime: values.expireTime?.format('YYYY-MM-DD HH:mm:ss'),
      };

      console.log('提交数据:', submitData);
      message.success(isDraft ? '保存成功' : '发布成功');
      navigate('/announcement/list');
    } catch (error) {
      message.error(isDraft ? '保存失败' : '发布失败');
      console.error('提交失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title={id ? '编辑公告' : '新建公告'}>
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => handleSubmit(values, false)}
        initialValues={{
          type: 'notice',
          priority: 'medium',
          publishTime: moment(),
          expireTime: moment().add(30, 'days'),
        }}
      >
        <Form.Item
          name="title"
          label="标题"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input placeholder="请输入标题" maxLength={100} showCount />
        </Form.Item>

        <Form.Item
          name="type"
          label="类型"
          rules={[{ required: true, message: '请选择类型' }]}
        >
          <Select>
            <Option value="notice">通知</Option>
            <Option value="announcement">公告</Option>
            <Option value="system">系统</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="priority"
          label="优先级"
          rules={[{ required: true, message: '请选择优先级' }]}
        >
          <Select>
            <Option value="high">高</Option>
            <Option value="medium">中</Option>
            <Option value="low">低</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="publishTime"
          label="发布时间"
          rules={[{ required: true, message: '请选择发布时间' }]}
        >
          <DatePicker
            showTime
            style={{ width: '100%' }}
            placeholder="请选择发布时间"
          />
        </Form.Item>

        <Form.Item
          name="expireTime"
          label="过期时间"
          rules={[{ required: true, message: '请选择过期时间' }]}
        >
          <DatePicker
            showTime
            style={{ width: '100%' }}
            placeholder="请选择过期时间"
          />
        </Form.Item>

        <Form.Item
          name="content"
          label="内容"
          rules={[{ required: true, message: '请输入内容' }]}
        >
          <EditorWrapper>
            <ReactQuill
              modules={modules}
              placeholder="请输入内容"
            />
          </EditorWrapper>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              icon={<SendOutlined />}
              htmlType="submit"
              loading={loading}
            >
              发布
            </Button>
            <Button
              icon={<SaveOutlined />}
              onClick={() => {
                form.validateFields()
                  .then((values) => handleSubmit(values, true))
                  .catch((error) => console.error('表单验证失败:', error));
              }}
              loading={loading}
            >
              保存草稿
            </Button>
            <Button
              icon={<RollbackOutlined />}
              onClick={() => navigate('/announcement/list')}
            >
              返回
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AnnouncementCreate; 