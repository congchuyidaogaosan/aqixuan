import React, { useState, useEffect } from 'react';
import {
  Card, Table, Form, Input, Button,
  Space, Tag, message, Modal, Tree,
  Descriptions
} from 'antd';
import {
  SearchOutlined, ReloadOutlined,
  PlusOutlined, EditOutlined,
  DeleteOutlined, ExclamationCircleOutlined,
  SettingOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { confirm } = Modal;

const RoleList = () => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [permissionVisible, setPermissionVisible] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
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

  // 模拟权限树数据
  const permissionTree = [
    {
      title: '系统管理',
      key: 'system',
      children: [
        {
          title: '用户管理',
          key: 'user',
          children: [
            { title: '查看用户', key: 'user:view' },
            { title: '创建用户', key: 'user:create' },
            { title: '编辑用户', key: 'user:edit' },
            { title: '删除用户', key: 'user:delete' },
          ],
        },
        {
          title: '角色管理',
          key: 'role',
          children: [
            { title: '查看角色', key: 'role:view' },
            { title: '创建角色', key: 'role:create' },
            { title: '编辑角色', key: 'role:edit' },
            { title: '删除角色', key: 'role:delete' },
          ],
        },
      ],
    },
    {
      title: '内容管理',
      key: 'content',
      children: [
        {
          title: '文章管理',
          key: 'article',
          children: [
            { title: '查看文章', key: 'article:view' },
            { title: '创建文章', key: 'article:create' },
            { title: '编辑文章', key: 'article:edit' },
            { title: '删除文章', key: 'article:delete' },
          ],
        },
        {
          title: '分类管理',
          key: 'category',
          children: [
            { title: '查看分类', key: 'category:view' },
            { title: '创建分类', key: 'category:create' },
            { title: '编辑分类', key: 'category:edit' },
            { title: '删除分类', key: 'category:delete' },
          ],
        },
      ],
    },
  ];

  // 获取角色列表
  const fetchRoles = async (params = {}) => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockData = Array.from({ length: 100 }, (_, index) => ({
        id: index + 1,
        name: ['super_admin', 'admin', 'editor', 'visitor'][index % 4],
        description: ['超级管理员', '管理员', '编辑', '访客'][index % 4],
        permissions: ['system', 'content', 'user', 'role', 'article', 'category']
          .slice(0, Math.floor(Math.random() * 6) + 1),
        createTime: moment().subtract(Math.floor(Math.random() * 365), 'days').format('YYYY-MM-DD HH:mm:ss'),
        updateTime: moment().subtract(Math.floor(Math.random() * 30), 'days').format('YYYY-MM-DD HH:mm:ss'),
      }));

      const { current, pageSize } = params;
      const start = (current - 1) * pageSize;
      const end = start + pageSize;

      setRoles(mockData.slice(start, end));
      setPagination({
        ...pagination,
        current,
        total: mockData.length,
      });
    } catch (error) {
      message.error('获取角色列表失败');
      console.error('获取角色列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  }, []);

  // 处理表格变化
  const handleTableChange = (newPagination, filters, sorter) => {
    fetchRoles({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
      ...filters,
    });
  };

  // 处理搜索
  const handleSearch = (values) => {
    fetchRoles({
      current: 1,
      pageSize: pagination.pageSize,
      ...values,
    });
  };

  // 处理重置
  const handleReset = () => {
    form.resetFields();
    fetchRoles({
      current: 1,
      pageSize: pagination.pageSize,
    });
  };

  // 处理删除
  const handleDelete = (id) => {
    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除这个角色吗？',
      onOk() {
        message.success('删除成功');
        fetchRoles(pagination);
      },
    });
  };

  // 处理编辑或新建
  const handleSubmit = async (values) => {
    try {
      console.log('提交数据:', values);
      message.success(editingRole ? '更新成功' : '创建成功');
      setVisible(false);
      modalForm.resetFields();
      fetchRoles(pagination);
    } catch (error) {
      message.error(editingRole ? '更新失败' : '创建失败');
    }
  };

  // 处理权限变更
  const handlePermissionChange = async () => {
    try {
      console.log('权限变更:', checkedKeys);
      message.success('权限配置成功');
      setPermissionVisible(false);
      fetchRoles(pagination);
    } catch (error) {
      message.error('权限配置失败');
    }
  };

  // 表格列配置
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '权限',
      dataIndex: 'permissions',
      render: (permissions) => (
        <Space wrap>
          {permissions.map((item) => (
            <Tag key={item} color="blue">{item}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
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
              setEditingRole(record);
              modalForm.setFieldsValue(record);
              setVisible(true);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            icon={<SettingOutlined />}
            onClick={() => {
              setCurrentRole(record);
              setCheckedKeys(record.permissions);
              setPermissionVisible(true);
            }}
          >
            权限配置
          </Button>
          {record.name !== 'super_admin' && (
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            >
              删除
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card title="角色列表">
        <Form
          form={form}
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: 20 }}
        >
          <Form.Item name="name" label="角色名称">
            <Input placeholder="请输入角色名称" />
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
                  setEditingRole(null);
                  modalForm.resetFields();
                  setVisible(true);
                }}
              >
                新建角色
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={roles}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />
      </Card>

      <Modal
        title={editingRole ? '编辑角色' : '新建角色'}
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
            name="name"
            label="角色名称"
            rules={[
              { required: true, message: '请输入角色名称' },
              { pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/, message: '角色名称只能包含字母、数字和下划线，且必须以字母或下划线开头' },
            ]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input.TextArea placeholder="请输入描述" rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="权限配置"
        open={permissionVisible}
        onCancel={() => setPermissionVisible(false)}
        onOk={handlePermissionChange}
        width={600}
      >
        {currentRole && (
          <>
            <Descriptions size="small" column={1} style={{ marginBottom: 20 }}>
              <Descriptions.Item label="角色名称">{currentRole.name}</Descriptions.Item>
              <Descriptions.Item label="描述">{currentRole.description}</Descriptions.Item>
            </Descriptions>

            <Tree
              checkable
              checkedKeys={checkedKeys}
              onCheck={setCheckedKeys}
              treeData={permissionTree}
              defaultExpandAll
            />
          </>
        )}
      </Modal>
    </>
  );
};

export default RoleList; 