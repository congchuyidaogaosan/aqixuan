import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Input, Space, Tag, Modal,
  message, Form, Select, Row, Col, Upload
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, ExclamationCircleOutlined,
  UploadOutlined, DownloadOutlined, EditOutlined
} from '@ant-design/icons';
import moment from 'moment';
import styled from 'styled-components';

const { confirm } = Modal;
const { Option } = Select;
const { TextArea } = Input;

const StyledCard = styled(Card)`
  margin-bottom: 20px;
`;

const SensitiveWords = () => {
  const [loading, setLoading] = useState(false);
  const [words, setWords] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editingWord, setEditingWord] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条记录`,
  });
  const [form] = Form.useForm();

  // 获取敏感词列表
  const fetchWords = async (params = {}) => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockData = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        word: `敏感词${index + 1}`,
        type: ['politics', 'porn', 'spam', 'custom'][Math.floor(Math.random() * 4)],
        level: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        replacement: `***`,
        createdAt: moment().subtract(index, 'days').format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().subtract(index, 'hours').format('YYYY-MM-DD HH:mm:ss'),
        status: Math.random() > 0.1 ? 'active' : 'disabled',
      }));

      const { current, pageSize } = params;
      const start = (current - 1) * pageSize;
      const end = start + pageSize;

      setWords(mockData.slice(start, end));
      setPagination({
        ...pagination,
        current,
        total: mockData.length,
      });
    } catch (error) {
      message.error('获取敏感词列表失败');
      console.error('获取敏感词列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWords({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  }, []);

  // 处理表格变化
  const handleTableChange = (newPagination, filters, sorter) => {
    fetchWords({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  // 处理添加/编辑
  const handleSubmit = async (values) => {
    try {
      // 模拟API调用
      if (editingWord) {
        message.success('编辑成功');
      } else {
        message.success('添加成功');
      }
      setVisible(false);
      form.resetFields();
      setEditingWord(null);
      fetchWords({
        current: pagination.current,
        pageSize: pagination.pageSize,
      });
    } catch (error) {
      message.error(editingWord ? '编辑失败' : '添加失败');
      console.error(editingWord ? '编辑失败:' : '添加失败:', error);
    }
  };

  // 处理删除
  const handleDelete = (id) => {
    confirm({
      title: '确定要删除这个敏感词吗？',
      icon: <ExclamationCircleOutlined />,
      content: '删除后不可恢复',
      onOk: async () => {
        try {
          // 模拟API调用
          message.success('删除成功');
          fetchWords({
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
    confirm({
      title: `确定要删除选中的 ${selectedRowKeys.length} 个敏感词吗？`,
      icon: <ExclamationCircleOutlined />,
      content: '删除后不可恢复',
      onOk: async () => {
        try {
          // 模拟API调用
          message.success('批量删除成功');
          setSelectedRowKeys([]);
          fetchWords({
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

  // 处理编辑
  const handleEdit = (record) => {
    setEditingWord(record);
    form.setFieldsValue(record);
    setVisible(true);
  };

  // 处理导入
  const handleImport = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 导入成功`);
      fetchWords({
        current: 1,
        pageSize: pagination.pageSize,
      });
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 导入失败`);
    }
  };

  // 处理导出
  const handleExport = () => {
    message.success('导出成功');
  };

  // 获取敏感词类型标签
  const getTypeTag = (type) => {
    const typeMap = {
      politics: { color: 'red', text: '政治' },
      porn: { color: 'orange', text: '色情' },
      spam: { color: 'gold', text: '垃圾信息' },
      custom: { color: 'blue', text: '自定义' },
    };
    const { color, text } = typeMap[type] || { color: 'default', text: '未知' };
    return <Tag color={color}>{text}</Tag>;
  };

  // 获取敏感词等级标签
  const getLevelTag = (level) => {
    const levelMap = {
      low: { color: 'green', text: '低' },
      medium: { color: 'orange', text: '中' },
      high: { color: 'red', text: '高' },
    };
    const { color, text } = levelMap[level] || { color: 'default', text: '未知' };
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
      title: '敏感词',
      dataIndex: 'word',
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (type) => getTypeTag(type),
    },
    {
      title: '等级',
      dataIndex: 'level',
      render: (level) => getLevelTag(level),
    },
    {
      title: '替换为',
      dataIndex: 'replacement',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
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
    <div>
      <Card
        title="敏感词管理"
        extra={
          <Space>
            <Upload
              accept=".txt,.csv"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              onChange={handleImport}
            >
              <Button icon={<UploadOutlined />}>导入</Button>
            </Upload>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleExport}
            >
              导出
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingWord(null);
                form.resetFields();
                setVisible(true);
              }}
            >
              添加敏感词
            </Button>
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              disabled={selectedRowKeys.length === 0}
              onClick={handleBatchDelete}
            >
              批量删除
            </Button>
          </Space>
        }
      >
        <Table
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          columns={columns}
          dataSource={words}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />
      </Card>

      <Modal
        title={editingWord ? '编辑敏感词' : '添加敏感词'}
        open={visible}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
          setEditingWord(null);
        }}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="word"
            label="敏感词"
            rules={[{ required: true, message: '请输入敏感词' }]}
          >
            <TextArea
              rows={4}
              placeholder="请输入敏感词，多个敏感词请用换行分隔"
            />
          </Form.Item>

          <Form.Item
            name="type"
            label="类型"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select placeholder="请选择类型">
              <Option value="politics">政治</Option>
              <Option value="porn">色情</Option>
              <Option value="spam">垃圾信息</Option>
              <Option value="custom">自定义</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="level"
            label="等级"
            rules={[{ required: true, message: '请选择等级' }]}
          >
            <Select placeholder="请选择等级">
              <Option value="low">低</Option>
              <Option value="medium">中</Option>
              <Option value="high">高</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="replacement"
            label="替换为"
            rules={[{ required: true, message: '请输入替换内容' }]}
          >
            <Input placeholder="请输入替换内容" />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="active">启用</Option>
              <Option value="disabled">禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SensitiveWords; 