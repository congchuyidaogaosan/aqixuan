import React, { useState, useEffect } from 'react';
import {
  Card, Table, Form, Input, Select,
  DatePicker, Button, Space, Tag,
  message, Modal
} from 'antd';
import {
  SearchOutlined, ReloadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import moment from 'moment';
import styled from 'styled-components';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const DetailWrapper = styled.div`
  .detail-item {
    margin-bottom: 16px;
    
    .label {
      font-weight: bold;
      margin-right: 8px;
    }
  }
`;

const OperationLog = () => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentLog, setCurrentLog] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条记录`,
  });
  const [form] = Form.useForm();

  // 获取操作日志
  const fetchLogs = async (params = {}) => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockData = Array.from({ length: 100 }, (_, index) => ({
        id: index + 1,
        module: ['用户管理', '角色管理', '权限管理', '系统设置'][Math.floor(Math.random() * 4)],
        type: ['create', 'update', 'delete', 'query'][Math.floor(Math.random() * 4)],
        operator: `admin${Math.floor(Math.random() * 10)}`,
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        method: ['GET', 'POST', 'PUT', 'DELETE'][Math.floor(Math.random() * 4)],
        path: '/api/v1/users',
        params: JSON.stringify({ id: Math.floor(Math.random() * 1000) }),
        result: Math.random() > 0.1 ? 'success' : 'failed',
        duration: Math.floor(Math.random() * 1000),
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
      message.error('获取操作日志失败');
      console.error('获取操作日志失败:', error);
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

  // 查看详情
  const handleViewDetail = (record) => {
    setCurrentLog(record);
    setDetailVisible(true);
  };

  // 获取操作类型标签
  const getTypeTag = (type) => {
    const typeMap = {
      create: { color: 'success', text: '创建' },
      update: { color: 'warning', text: '更新' },
      delete: { color: 'error', text: '删除' },
      query: { color: 'processing', text: '查询' },
    };
    const { color, text } = typeMap[type] || { color: 'default', text: '未知' };
    return <Tag color={color}>{text}</Tag>;
  };

  // 获取请求方法标签
  const getMethodTag = (method) => {
    const methodMap = {
      GET: 'green',
      POST: 'blue',
      PUT: 'orange',
      DELETE: 'red',
    };
    return <Tag color={methodMap[method] || 'default'}>{method}</Tag>;
  };

  // 表格列配置
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '模块',
      dataIndex: 'module',
    },
    {
      title: '操作类型',
      dataIndex: 'type',
      render: (type) => getTypeTag(type),
    },
    {
      title: '操作人',
      dataIndex: 'operator',
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      render: (method) => getMethodTag(method),
    },
    {
      title: '请求路径',
      dataIndex: 'path',
      ellipsis: true,
    },
    {
      title: '执行时长',
      dataIndex: 'duration',
      render: (duration) => `${duration}ms`,
      sorter: true,
    },
    {
      title: '操作时间',
      dataIndex: 'createdAt',
      sorter: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          详情
        </Button>
      ),
    },
  ];

  return (
    <>
      <Card title="操作日志">
        <Form
          form={form}
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: 20 }}
        >
          <Form.Item name="module" label="模块">
            <Select style={{ width: 120 }} allowClear>
              <Option value="用户管理">用户管理</Option>
              <Option value="角色管理">角色管理</Option>
              <Option value="权限管理">权限管理</Option>
              <Option value="系统设置">系统设置</Option>
            </Select>
          </Form.Item>

          <Form.Item name="type" label="操作类型">
            <Select style={{ width: 120 }} allowClear>
              <Option value="create">创建</Option>
              <Option value="update">更新</Option>
              <Option value="delete">删除</Option>
              <Option value="query">查询</Option>
            </Select>
          </Form.Item>

          <Form.Item name="operator" label="操作人">
            <Input placeholder="请输入操作人" />
          </Form.Item>

          <Form.Item name="ip" label="IP地址">
            <Input placeholder="请输入IP地址" />
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

      <Modal
        title="操作详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={800}
      >
        {currentLog && (
          <DetailWrapper>
            <div className="detail-item">
              <span className="label">模块：</span>
              <span>{currentLog.module}</span>
            </div>
            <div className="detail-item">
              <span className="label">操作类型：</span>
              <span>{getTypeTag(currentLog.type)}</span>
            </div>
            <div className="detail-item">
              <span className="label">操作人：</span>
              <span>{currentLog.operator}</span>
            </div>
            <div className="detail-item">
              <span className="label">IP地址：</span>
              <span>{currentLog.ip}</span>
            </div>
            <div className="detail-item">
              <span className="label">请求方法：</span>
              <span>{getMethodTag(currentLog.method)}</span>
            </div>
            <div className="detail-item">
              <span className="label">请求路径：</span>
              <span>{currentLog.path}</span>
            </div>
            <div className="detail-item">
              <span className="label">请求参数：</span>
              <TextArea
                value={currentLog.params}
                autoSize={{ minRows: 2, maxRows: 6 }}
                readOnly
              />
            </div>
            <div className="detail-item">
              <span className="label">执行时长：</span>
              <span>{currentLog.duration}ms</span>
            </div>
            <div className="detail-item">
              <span className="label">操作时间：</span>
              <span>{currentLog.createdAt}</span>
            </div>
          </DetailWrapper>
        )}
      </Modal>
    </>
  );
};

export default OperationLog; 