import React, { useState, useEffect } from 'react';
import {
  Card, Table, Form, Input, Select,
  Button, Space, Tag, message,
  Modal, Switch
} from 'antd';
import {
  SearchOutlined, ReloadOutlined,
  PlusOutlined, EditOutlined,
  DeleteOutlined, ExclamationCircleOutlined,
  LockOutlined, UnlockOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { confirm } = Modal;

const AdminList = () => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [roles, setRoles] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条记录`,
  });
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();

  // 获取管理员列表
  const fetchAdmins = async (params = {}) => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockData = Array.from({ length: 100 }, (_, index) => ({
        id: index + 1,
        username: `admin${index + 1}`,
        nickname: `管理员${index + 1}`,
        email: `admin${index + 1}@example.com`,
        phone: `1381234${String(index + 1).padStart(4, '0')}`,
        role: ['super_admin', 'admin', 'editor'][Math.floor(Math.random() * 3)],
        status: Math.random() > 0.2,
        lastLoginTime: moment().subtract(Math.floor(Math.random() * 30), 'days').format('YYYY-MM-DD HH:mm:ss'),
        createTime: moment().subtract(Math.floor(Math.random() * 365), 'days').format('YYYY-MM-DD HH:mm:ss'),
      }));

      // 模拟角色数据
      const mockRoles = [
        { id: 1, name: 'super_admin', description: '超级管理员' },
        { id: 2, name: 'admin', description: '管理员' },
        { id: 3, name: 'editor', description: '编辑' },
      ];
      setRoles(mockRoles);

      const { current, pageSize } = params;
      const start = (current - 1) * pageSize;
      const end = start + pageSize;

      setAdmins(mockData.slice(start, end));
      setPagination({
        ...pagination,
        current,
        total: mockData.length,
      });
    } catch (error) {
      message.error('获取管理员列表失败');
      console.error('获取管理员列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  }, []);

  // 处理表格变化
  const handleTableChange = (newPagination, filters, sorter) => {
    fetchAdmins({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
      ...filters,
    });
  };

  // 处理搜索
  const handleSearch = (values) => {
    fetchAdmins({
      current: 1,
      pageSize: pagination.pageSize,
      ...values,
    });
  };

  // 处理重置
  const handleReset = () => {
    form.resetFields();
    fetchAdmins({
      current: 1,
      pageSize: pagination.pageSize,
    });
  };

  // 处理删除
  const handleDelete = (id) => {
    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除这个管理员吗？',
      onOk() {
        message.success('删除成功');
        fetchAdmins(pagination);
      },
    });
  };

  // 处理状态变更
  const handleStatusChange = async (id, checked) => {
    try {
      message.success(`${checked ? '启用' : '禁用'}成功`);
      fetchAdmins(pagination);
    } catch (error) {
      message.error(`${checked ? '启用' : '禁用'}失败`);
    }
  };

  // 处理编辑或新建
  const handleSubmit = async (values) => {
    try {
      console.log('提交数据:', values);
      message.success(editingAdmin ? '更新成功' : '创建成功');
      setVisible(false);
      modalForm.resetFields();
      fetchAdmins(pagination);
    } catch (error) {
      message.error(editingAdmin ? '更新失败' : '创建失败');
    }
  };

  // 获取角色标签
  const getRoleTag = (role) => {
    const roleMap = {
      super_admin: { color: 'red', text: '超级管理员' },
      admin: { color: 'blue', text: '管理员' },
      editor: { color: 'green', text: '编辑' },
    };
    const { color, text } = roleMap[role] || { color: 'default', text: '未知' };
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
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '角色',
      dataIndex: 'role',
      render: (role) => getRoleTag(role),
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status, record) => (
        <Switch
          checkedChildren={<UnlockOutlined />}
          unCheckedChildren={<LockOutlined />}
          checked={status}
          onChange={(checked) => handleStatusChange(record.id, checked)}
        />
      ),
    },
    {
      title: '最后登录时间',
      dataIndex: 'lastLoginTime',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingAdmin(record);
              modalForm.setFieldsValue(record);
              setVisible(true);
            }}
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
    <>
      <Card title="管理员列表">
        <Form
          form={form}
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: 20 }}
        >
          <Form.Item name="username" label="用户名">
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item name="nickname" label="昵称">
            <Input placeholder="请输入昵称" />
          </Form.Item>

          <Form.Item name="role" label="角色">
            <Select style={{ width: 120 }} allowClear>
              {roles.map(role => (
                <Option key={role.name} value={role.name}>
                  {role.description}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="status" label="状态">
            <Select style={{ width: 120 }} allowClear>
              <Option value="true">启用</Option>
              <Option value="false">禁用</Option>
            </Select>
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
                onClick={() => {
                  setEditingAdmin(null);
                  modalForm.resetFields();
                  setVisible(true);
                }}
              >
                新建管理员
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={admins}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />
      </Card>

      <Modal
        title={editingAdmin ? '编辑管理员' : '新建管理员'}
        open={visible}
        onCancel={() => {
          setVisible(false);
          modalForm.resetFields();
        }}
        onOk={() => modalForm.submit()}
        confirmLoading={loading}
      >
        <Form
          form={modalForm}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' },
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          {!editingAdmin && (
            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' },
              ]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          )}

          <Form.Item
            name="nickname"
            label="昵称"
            rules={[{ required: true, message: '请输入昵称' }]}
          >
            <Input placeholder="请输入昵称" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>

          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select>
              {roles.map(role => (
                <Option key={role.name} value={role.name}>
                  {role.description}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch
              checkedChildren={<UnlockOutlined />}
              unCheckedChildren={<LockOutlined />}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AdminList; 