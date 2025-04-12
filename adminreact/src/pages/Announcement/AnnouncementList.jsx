import React, { useState, useEffect } from 'react';
import {
  Card, Table, Form, Input, Select,
  DatePicker, Button, Space, Tag,
  message, Modal, Typography
} from 'antd';
import {
  SearchOutlined, ReloadOutlined,
  PlusOutlined, EditOutlined,
  DeleteOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { confirm } = Modal;
const { Paragraph } = Typography;

const AnnouncementList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条记录`,
  });
  const [form] = Form.useForm();

  // 获取公告列表
  const fetchAnnouncements = async (params = {}) => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockData = Array.from({ length: 100 }, (_, index) => ({
        id: index + 1,
        title: `公告标题${index + 1}`,
        content: `这是公告内容${index + 1}，包含一些重要信息...`,
        type: ['notice', 'announcement', 'system'][Math.floor(Math.random() * 3)],
        priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
        status: ['published', 'draft', 'expired'][Math.floor(Math.random() * 3)],
        publisher: `admin${Math.floor(Math.random() * 10)}`,
        publishTime: moment().subtract(index, 'days').format('YYYY-MM-DD HH:mm:ss'),
        expireTime: moment().add(30 - index, 'days').format('YYYY-MM-DD HH:mm:ss'),
      }));

      const { current, pageSize } = params;
      const start = (current - 1) * pageSize;
      const end = start + pageSize;

      setAnnouncements(mockData.slice(start, end));
      setPagination({
        ...pagination,
        current,
        total: mockData.length,
      });
    } catch (error) {
      message.error('获取公告列表失败');
      console.error('获取公告列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  }, []);

  // 处理表格变化
  const handleTableChange = (newPagination, filters, sorter) => {
    fetchAnnouncements({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
      ...filters,
    });
  };

  // 处理搜索
  const handleSearch = (values) => {
    fetchAnnouncements({
      current: 1,
      pageSize: pagination.pageSize,
      ...values,
    });
  };

  // 处理重置
  const handleReset = () => {
    form.resetFields();
    fetchAnnouncements({
      current: 1,
      pageSize: pagination.pageSize,
    });
  };

  // 处理删除
  const handleDelete = (id) => {
    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除这条公告吗？',
      onOk() {
        message.success('删除成功');
        fetchAnnouncements(pagination);
      },
    });
  };

  // 获取类型标签
  const getTypeTag = (type) => {
    const typeMap = {
      notice: { color: 'blue', text: '通知' },
      announcement: { color: 'green', text: '公告' },
      system: { color: 'orange', text: '系统' },
    };
    const { color, text } = typeMap[type] || { color: 'default', text: '未知' };
    return <Tag color={color}>{text}</Tag>;
  };

  // 获取优先级标签
  const getPriorityTag = (priority) => {
    const priorityMap = {
      high: { color: 'red', text: '高' },
      medium: { color: 'orange', text: '中' },
      low: { color: 'blue', text: '低' },
    };
    const { color, text } = priorityMap[priority] || { color: 'default', text: '未知' };
    return <Tag color={color}>{text}</Tag>;
  };

  // 获取状态标签
  const getStatusTag = (status) => {
    const statusMap = {
      published: { color: 'success', text: '已发布' },
      draft: { color: 'default', text: '草稿' },
      expired: { color: 'error', text: '已过期' },
    };
    const { color, text } = statusMap[status] || { color: 'default', text: '未知' };
    return <Tag color={color}>{text}</Tag>;
  };

  // 表格列配置
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '标题',
      dataIndex: 'title',
      ellipsis: true,
    },
    {
      title: '内容',
      dataIndex: 'content',
      ellipsis: true,
      render: (text) => (
        <Paragraph ellipsis={{ rows: 2 }}>{text}</Paragraph>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (type) => getTypeTag(type),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      render: (priority) => getPriorityTag(priority),
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: '发布人',
      dataIndex: 'publisher',
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      sorter: true,
    },
    {
      title: '过期时间',
      dataIndex: 'expireTime',
      sorter: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/announcement/edit/${record.id}`)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="公告管理">
      <Form
        form={form}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 20 }}
      >
        <Form.Item name="title" label="标题">
          <Input placeholder="请输入标题" style={{ width: 200 }} />
        </Form.Item>

        <Form.Item name="type" label="类型">
          <Select style={{ width: 120 }} allowClear>
            <Option value="notice">通知</Option>
            <Option value="announcement">公告</Option>
            <Option value="system">系统</Option>
          </Select>
        </Form.Item>

        <Form.Item name="priority" label="优先级">
          <Select style={{ width: 120 }} allowClear>
            <Option value="high">高</Option>
            <Option value="medium">中</Option>
            <Option value="low">低</Option>
          </Select>
        </Form.Item>

        <Form.Item name="status" label="状态">
          <Select style={{ width: 120 }} allowClear>
            <Option value="published">已发布</Option>
            <Option value="draft">草稿</Option>
            <Option value="expired">已过期</Option>
          </Select>
        </Form.Item>

        <Form.Item name="dateRange" label="时间范围">
          <RangePicker showTime />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              htmlType="submit"
            >
              搜索
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleReset}
            >
              重置
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/announcement/create')}
            >
              新建公告
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={announcements}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default AnnouncementList; 