import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, Card, Button, Input, Space, Tag, Modal,
  message, Form, Select, DatePicker, Row, Col, Image
} from 'antd';
import {
  SearchOutlined, PlusOutlined, DeleteOutlined,
  ExclamationCircleOutlined, EyeOutlined
} from '@ant-design/icons';
import moment from 'moment';
import styled from 'styled-components';
import { getActivityList, deleteActivity, batchDeleteActivities } from '../../api/activity';

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
      const { current, pageSize, ...restParams } = params;
      const response = await getActivityList({
        pageNum: current,
        pageSize,
        ...restParams
      });

      if (response.code === 200) {
        const { records, total, size, current: currentPage } = response.data;
        // 确保每个记录都有正确的数据结构
        const formattedRecords = records.map(record => ({
          ...record,
          activity: {
            ...record.activity,
            id: record.activity.id.toString() // 确保id是字符串类型
          }
        }));
        setActivities(formattedRecords);
        setPagination({
          ...pagination,
          current: currentPage,
          pageSize: size,
          total
        });
      } else {
        message.error(response.msg || '获取活动列表失败');
      }
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
    const { dateRange, ...rest } = values;
    const newFilters = {
      ...rest,
      startTime: dateRange?.[0]?.format('YYYY-MM-DD HH:mm:ss'),
      endTime: dateRange?.[1]?.format('YYYY-MM-DD HH:mm:ss'),
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
          const response = await deleteActivity(id);
          if (response.code === 200) {
          message.success('删除成功');
          fetchActivities({
            current: pagination.current,
            pageSize: pagination.pageSize,
            ...filters,
          });
          } else {
            message.error(response.msg || '删除失败');
          }
        } catch (error) {
          message.error('删除失败');
          console.error('删除失败:', error);
        }
      },
    });
  };

  // 批量删除
  const handleBatchDelete = () => {
    const activityIds = selectedRowKeys.map(key => parseInt(key));
    confirm({
      title: `确定要删除选中的 ${activityIds.length} 个活动吗？`,
      icon: <ExclamationCircleOutlined />,
      content: '删除后不可恢复',
      onOk: async () => {
        try {
          const response = await batchDeleteActivities(activityIds);
          if (response.code === 200) {
            message.success('批量删除成功');
            setSelectedRowKeys([]);
            fetchActivities({
              current: pagination.current,
              pageSize: pagination.pageSize,
              ...filters,
            });
          } else {
            message.error(response.msg || '批量删除失败');
          }
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
      1: { color: 'green', text: '进行中' },
      2: { color: 'blue', text: '已结束' },
      3: { color: 'red', text: '已取消' }
    };
    const { color, text } = statusMap[status] || { color: 'default', text: '未知' };
    return <Tag key={`status-tag-${status}`} color={color}>{text}</Tag>;
  };

  // 表格列配置
  const columns = [
    {
      title: '活动图片',
      dataIndex: ['activity', 'handImg'],
      key: 'handImg',
      render: (handImg) => (
        <Image
          src={handImg}
          alt="活动图片"
          style={{ width: 100, height: 100, objectFit: 'cover' }}
        />
      ),
    },
    {
      title: '活动标题',
      dataIndex: ['activity', 'title'],
      key: 'title',
    },
    {
      title: '活动类型',
      dataIndex: ['activity', 'activityType'],
      key: 'activityType',
      render: (type) => (
        <Tag key={`type-${type}`} color={type === '0' ? 'blue' : 'green'}>
          {type === '0' ? '户外活动' : '室内活动'}
        </Tag>
      ),
    },
    {
      title: '创建者',
      dataIndex: 'creatorNickname',
      key: 'creatorNickname',
    },
    {
      title: '活动地点',
      dataIndex: ['activity', 'location'],
      key: 'location',
    },
    {
      title: '参与人数',
      key: 'participants',
      render: (_, record) => (
        <span key={`participants-${record.activity.id}`}>{record.activity.currentNumber}/{record.activity.totalNumber}</span>
      ),
    },
    {
      title: '活动时间',
      key: 'time',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div key="start">开始：{moment(record.activity.startTime).format('YYYY-MM-DD HH:mm')}</div>
          <div key="end">结束：{moment(record.activity.endTime).format('YYYY-MM-DD HH:mm')}</div>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: ['activity', 'status'],
      key: 'status',
      render: (status) => (
        <Tag key={`status-${status}`} color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '进行中' : '已结束'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <ActionButton
            key="view"
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/activity/detail/${record.activity.id}`)}
          >
            查看
          </ActionButton>
          <ActionButton
            key="delete"
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.activity.id)}
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
        <Row key="row-1" gutter={24}>
          <Col key="keyword" span={8}>
            <Form.Item name="keyword" label="关键词">
              <Input placeholder="搜索活动标题" />
            </Form.Item>
          </Col>
          <Col key="status" span={8}>
            <Form.Item name="status" label="状态">
              <Select placeholder="请选择状态">
                <Option key="all" value={undefined}>全部</Option>
                <Option key="draft" value="draft">草稿</Option>
                <Option key="ongoing" value="ongoing">进行中</Option>
                <Option key="ended" value="ended">已结束</Option>
                <Option key="cancelled" value="cancelled">已取消</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col key="type" span={8}>
            <Form.Item name="type" label="活动类型">
              <Select placeholder="请选择类型">
                <Option key="all" value={undefined}>全部</Option>
                <Option key="online" value="online">线上活动</Option>
                <Option key="offline" value="offline">线下活动</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row key="row-2" gutter={24}>
          <Col key="dateRange" span={8}>
            <Form.Item name="dateRange" label="活动时间">
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row key="row-3">
          <Col key="buttons" span={24} style={{ textAlign: 'right' }}>
            <Button key="search" type="primary" htmlType="submit" icon={<SearchOutlined />}>
              搜索
            </Button>
            <Button key="reset" style={{ marginLeft: 8 }} onClick={handleReset}>
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
            {/* <Button
              key="create"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/activity/create')}
            >
              创建活动
            </Button> */}
            <Button
              key="batchDelete"
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
          rowKey={(record) => record.activity.id}
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