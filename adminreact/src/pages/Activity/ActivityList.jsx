import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, Card, Button, Input, Space, Tag, Modal,
  message, Form, Select, DatePicker, Row, Col, Image
} from 'antd';
import {
  SearchOutlined, PlusOutlined, DeleteOutlined,
  ExclamationCircleOutlined, EyeOutlined,
  CheckCircleOutlined, StopOutlined
} from '@ant-design/icons';
import moment from 'moment';
import styled from 'styled-components';

const { confirm } = Modal;
const { RangePicker } = DatePicker;
const { Option } = Select;

const StyledCard = styled(Card)`
  margin-bottom: 20px;
`;

const ActionButton = styled(Button)`
  margin-right: 8px;
`;

const ActivityList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState([]);
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

  // 获取活动列表
  const fetchActivities = async (params = {}) => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockData = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        title: `活动${index + 1}`,
        cover: `https://picsum.photos/400/300?random=${index}`,
        startTime: moment().add(index, 'days').format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().add(index + 7, 'days').format('YYYY-MM-DD HH:mm:ss'),
        location: ['线上', '北京', '上海', '广州', '深圳'][Math.floor(Math.random() * 5)],
        participantsCount: Math.floor(Math.random() * 1000),
        status: ['draft', 'ongoing', 'ended', 'cancelled'][Math.floor(Math.random() * 4)],
        type: ['offline', 'online'][Math.floor(Math.random() * 2)],
        createdAt: moment().subtract(index, 'days').format('YYYY-MM-DD HH:mm:ss'),
      }));

      const { current, pageSize } = params;
      const start = (current - 1) * pageSize;
      const end = start + pageSize;

      setActivities(mockData.slice(start, end));
      setPagination({
        ...pagination,
        current,
        total: mockData.length,
      });
    } catch (error) {
      message.error('获取活动列表失败');
      console.error('获取活动列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    });
  }, []);

  // 处理表格变化
  const handleTableChange = (newPagination, newFilters, sorter) => {
    fetchActivities({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
      ...filters,
      ...newFilters,
    });
  };

  // 处理搜索
  const handleSearch = (values) => {
    const newFilters = {
      ...filters,
      ...values,
      dateRange: values.dateRange ? [
        values.dateRange[0].format('YYYY-MM-DD'),
        values.dateRange[1].format('YYYY-MM-DD'),
      ] : undefined,
    };
    setFilters(newFilters);
    fetchActivities({
      current: 1,
      pageSize: pagination.pageSize,
      ...newFilters,
    });
  };

  // 重置搜索
  const handleReset = () => {
    form.resetFields();
    setFilters({});
    fetchActivities({
      current: 1,
      pageSize: pagination.pageSize,
    });
  };

  // 处理删除活动
  const handleDelete = (id) => {
    confirm({
      title: '确定要删除这个活动吗？',
      icon: <ExclamationCircleOutlined />,
      content: '删除后不可恢复',
      onOk: async () => {
        try {
          // 模拟API调用
          message.success('删除成功');
          fetchActivities({
            current: pagination.current,
            pageSize: pagination.pageSize,
            ...filters,
          });
        } catch (error) {
          message.error('删除失败');
          console.error('删除失败:', error);
        }
      },
    });
  };

  // 批量删除
  const handleBatchDelete = () => {
    confirm({
      title: `确定要删除选中的 ${selectedRowKeys.length} 个活动吗？`,
      icon: <ExclamationCircleOutlined />,
      content: '删除后不可恢复',
      onOk: async () => {
        try {
          // 模拟API调用
          message.success('批量删除成功');
          setSelectedRowKeys([]);
          fetchActivities({
            current: pagination.current,
            pageSize: pagination.pageSize,
            ...filters,
          });
        } catch (error) {
          message.error('批量删除失败');
          console.error('批量删除失败:', error);
        }
      },
    });
  };

  // 获取活动状态标签
  const getStatusTag = (status) => {
    const statusMap = {
      draft: { color: 'default', text: '草稿' },
      ongoing: { color: 'green', text: '进行中' },
      ended: { color: 'blue', text: '已结束' },
      cancelled: { color: 'red', text: '已取消' },
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
      title: '活动信息',
      key: 'info',
      render: (_, record) => (
        <Space>
          <Image
            src={record.cover}
            alt={record.title}
            style={{ width: 100, height: 60, objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.title}</div>
            <div style={{ fontSize: 12, color: '#999' }}>
              {record.type === 'online' ? '线上活动' : '线下活动'}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '活动时间',
      key: 'time',
      render: (_, record) => (
        <div>
          <div>开始：{record.startTime}</div>
          <div>结束：{record.endTime}</div>
        </div>
      ),
    },
    {
      title: '地点',
      dataIndex: 'location',
    },
    {
      title: '参与人数',
      dataIndex: 'participantsCount',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <ActionButton
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/activity/detail/${record.id}`)}
          >
            查看
          </ActionButton>
          <ActionButton
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </ActionButton>
        </Space>
      ),
    },
  ];

  // 渲染搜索表单
  const renderSearchForm = () => (
    <StyledCard>
      <Form
        form={form}
        name="search"
        onFinish={handleSearch}
        initialValues={{
          status: undefined,
          type: undefined,
          dateRange: undefined,
        }}
      >
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="keyword" label="关键词">
              <Input placeholder="搜索活动标题" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="status" label="状态">
              <Select placeholder="请选择状态">
                <Option value={undefined}>全部</Option>
                <Option value="draft">草稿</Option>
                <Option value="ongoing">进行中</Option>
                <Option value="ended">已结束</Option>
                <Option value="cancelled">已取消</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="type" label="活动类型">
              <Select placeholder="请选择类型">
                <Option value={undefined}>全部</Option>
                <Option value="online">线上活动</Option>
                <Option value="offline">线下活动</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="dateRange" label="活动时间">
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              搜索
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    </StyledCard>
  );

  return (
    <div>
      {renderSearchForm()}
      
      <Card
        title="活动列表"
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/activity/create')}
            >
              创建活动
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
          dataSource={activities}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
};

export default ActivityList; 