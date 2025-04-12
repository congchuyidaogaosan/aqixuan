import React, { useState, useEffect } from 'react';
import {
  Table, Card, Button, Space, Input,
  Form, Select, Tag, Modal, message,
  Avatar, Tooltip, Switch
} from 'antd';
import {
  UserOutlined, EditOutlined, DeleteOutlined,
  SearchOutlined, PlusOutlined, ReloadOutlined
} from '@ant-design/icons';
import styled from 'styled-components';

const { Option } = Select;

const StyledCard = styled(Card)`
  margin-bottom: 20px;
`;

const UserList = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条记录`,
  });
  const [filters, setFilters] = useState({});
  const [form] = Form.useForm();

  // 获取用户列表
  const fetchUsers = async (params = {}) => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockData = Array.from({ length: 100 }, (_, index) => ({
        id: index + 1,
        username: `user${index + 1}`,
        nickname: `用户${index + 1}`,
        email: `user${index + 1}@example.com`,
        phone: `1${String(Math.floor(Math.random() * 1000000000)).padStart(10, '0')}`,
        avatar: `https://api.dicebear.com/7.x/avatars/svg?seed=${index}`,
        status: Math.random() > 0.2,
        role: ['admin', 'user', 'editor'][Math.floor(Math.random() * 3)],
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      }));

      const { current, pageSize } = params;
      const start = (current - 1) * pageSize;
      const end = start + pageSize;

      setUsers(mockData.slice(start, end));
      setPagination({
        ...pagination,
        current,
        total: mockData.length,
      });
    } catch (error) {
      message.error('获取用户列表失败');
      console.error('获取用户列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 首次加载获取数据
  useEffect(() => {
    fetchUsers({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  }, []);

  // 处理表格变化
  const handleTableChange = (newPagination, filters, sorter) => {
    fetchUsers({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
      ...filters,
      ...sorter,
    });
  };

  // 处理搜索
  const handleSearch = (values) => {
    setFilters(values);
    setPagination({ ...pagination, current: 1 });
    fetchUsers({
      current: 1,
      pageSize: pagination.pageSize,
      ...values,
    });
  };

  // 处理重置
  const handleReset = () => {
    form.resetFields();
    setFilters({});
    setPagination({ ...pagination, current: 1 });
    fetchUsers({
      current: 1,
      pageSize: pagination.pageSize,
    });
  };

  // 处理删除
  const handleDelete = (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个用户吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          // 模拟API调用
          message.success('删除成功');
          fetchUsers({
            current: pagination.current,
            pageSize: pagination.pageSize,
          });
        } catch (error) {
          message.error('删除失败');
          console.error('删除失败:', error);
        }
      },
    });
  };

  // 处理批量删除
  const handleBatchDelete = () => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除这 ${selectedRowKeys.length} 个用户吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          // 模拟API调用
          message.success('批量删除成功');
          setSelectedRowKeys([]);
          fetchUsers({
            current: pagination.current,
            pageSize: pagination.pageSize,
          });
        } catch (error) {
          message.error('批量删除失败');
          console.error('批量删除失败:', error);
        }
      },
    });
  };

  // 表格列配置
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      fixed: 'left',
    },
    {
      title: '用户信息',
      dataIndex: 'username',
      fixed: 'left',
      width: 200,
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <div>{record.nickname}</div>
            <div style={{ fontSize: '12px', color: '#999' }}>{record.username}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 200,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 150,
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 100,
      render: (role) => {
        const colorMap = {
          admin: 'red',
          editor: 'blue',
          user: 'green',
        };
        return <Tag color={colorMap[role]}>{role.toUpperCase()}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status) => (
        <Switch
          checkedChildren="启用"
          unCheckedChildren="禁用"
          checked={status}
          disabled
        />
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      width: 200,
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="编辑">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => console.log('编辑用户:', record.id)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <StyledCard>
        <Form
          form={form}
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: 16 }}
        >
          <Form.Item name="keyword">
            <Input
              placeholder="用户名/昵称/邮箱"
              prefix={<SearchOutlined />}
              allowClear
            />
          </Form.Item>
          <Form.Item name="role">
            <Select placeholder="角色" allowClear style={{ width: 120 }}>
              <Option value="admin">管理员</Option>
              <Option value="editor">编辑</Option>
              <Option value="user">普通用户</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status">
            <Select placeholder="状态" allowClear style={{ width: 120 }}>
              <Option value={true}>启用</Option>
              <Option value={false}>禁用</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button onClick={handleReset} icon={<ReloadOutlined />}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </StyledCard>

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />}>
            新增用户
          </Button>
          {selectedRowKeys.length > 0 && (
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleBatchDelete}
            >
              批量删除
            </Button>
          )}
        </Space>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={users}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: 1300 }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
        />
      </Card>
    </div>
  );
};

export default UserList;
