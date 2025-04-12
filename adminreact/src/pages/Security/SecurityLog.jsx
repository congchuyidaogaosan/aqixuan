import React, { useState, useEffect } from 'react';
import {
  Card, Table, Form, Input, Select,
  DatePicker, Button, Space, Tag,
  message
} from 'antd';
import {
  SearchOutlined, ReloadOutlined,
  ExclamationCircleOutlined, CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

const SecurityLog = () => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条记录`,
  });
  const [form] = Form.useForm();

  // 获取安全日志
  const fetchLogs = async (params = {}) => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockData = Array.from({ length: 100 }, (_, index) => ({
        id: index + 1,
        type: ['login', 'logout', 'password', 'permission'][Math.floor(Math.random() * 4)],
        username: `user${Math.floor(Math.random() * 1000)}`,
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        location: ['北京', '上海', '广州', '深圳'][Math.floor(Math.random() * 4)],
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        status: Math.random() > 0.2 ? 'success' : 'failed',
        description: '尝试登录系统',
        createdAt: moment().subtract(index, 'hours').format('YYYY-MM-DD HH:mm:ss'),
      }));

      const { current, pageSize } = params;
      const start = (current - 1) * pageSize;
      const end = start + pageSize;

      setLogs(mockData.slice(start, end));
      setPagination({
        ...pagination,
        current,
        total: mockData.length,
      });
    } catch (error) {
      message.error('获取安全日志失败');
      console.error('获取安全日志失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  }, []);

  // 处理表格变化
  const handleTableChange = (newPagination, filters, sorter) => {
    fetchLogs({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
      ...filters,
    });
  };

  // 处理搜索
  const handleSearch = (values) => {
    fetchLogs({
      current: 1,
      pageSize: pagination.pageSize,
      ...values,
    });
  };

  // 处理重置
  const handleReset = () => {
    form.resetFields();
    fetchLogs({
      current: 1,
      pageSize: pagination.pageSize,
    });
  };

  // 获取日志类型标签
  const getTypeTag = (type) => {
    const typeMap = {
      login: { color: 'blue', text: '登录' },
      logout: { color: 'green', text: '登出' },
      password: { color: 'orange', text: '密码' },
      permission: { color: 'purple', text: '权限' },
    };
    const { color, text } = typeMap[type] || { color: 'default', text: '未知' };
    return <Tag color={color}>{text}</Tag>;
  };

  // 获取状态标签
  const getStatusTag = (status) => {
    if (status === 'success') {
      return <Tag icon={<CheckCircleOutlined />} color="success">成功</Tag>;
    }
    return <Tag icon={<CloseCircleOutlined />} color="error">失败</Tag>;
  };

  // 表格列配置
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (type) => getTypeTag(type),
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
    },
    {
      title: '位置',
      dataIndex: 'location',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      sorter: true,
    },
  ];

  return (
    <Card title="安全日志">
      <Form
        form={form}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 20 }}
      >
        <Form.Item name="type" label="类型">
          <Select style={{ width: 120 }} allowClear>
            <Option value="login">登录</Option>
            <Option value="logout">登出</Option>
            <Option value="password">密码</Option>
            <Option value="permission">权限</Option>
          </Select>
        </Form.Item>

        <Form.Item name="username" label="用户名">
          <Input placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item name="ip" label="IP地址">
          <Input placeholder="请输入IP地址" />
        </Form.Item>

        <Form.Item name="status" label="状态">
          <Select style={{ width: 120 }} allowClear>
            <Option value="success">成功</Option>
            <Option value="failed">失败</Option>
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
          </Space>
        </Form.Item>
      </Form>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={logs}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default SecurityLog; 