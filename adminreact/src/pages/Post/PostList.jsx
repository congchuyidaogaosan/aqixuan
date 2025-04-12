import React, { useState, useEffect } from 'react';
import { 
  Table, Card, Button, Input, Space, Tag, Modal, 
  message, Form, Select, DatePicker, Row, Col, Tooltip,
  Image
} from 'antd';
import { 
  SearchOutlined, DeleteOutlined, ExclamationCircleOutlined, 
  EyeOutlined, CheckCircleOutlined, StopOutlined,
  FileImageOutlined
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

const PostContent = styled.div`
  max-width: 300px;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const PostList = () => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
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
  const [postDetailVisible, setPostDetailVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  // 获取动态列表
  const fetchPosts = async (params = {}) => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockData = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        userId: Math.floor(Math.random() * 1000) + 1,
        userNickname: `用户${Math.floor(Math.random() * 1000) + 1}`,
        userAvatar: `https://api.dicebear.com/7.x/avatars/svg?seed=${index}`,
        content: `这是第${index + 1}条动态内容，包含了一些文字描述...`,
        images: Array.from({ length: Math.floor(Math.random() * 9) + 1 }, (_, i) => ({
          id: i + 1,
          url: `https://picsum.photos/300/300?random=${index * 10 + i}`,
        })),
        likesCount: Math.floor(Math.random() * 1000),
        commentsCount: Math.floor(Math.random() * 100),
        status: Math.random() > 0.1 ? 1 : 0,
        createdAt: moment().subtract(index, 'hours').format('YYYY-MM-DD HH:mm:ss'),
        location: ['北京', '上海', '广州', '深圳'][Math.floor(Math.random() * 4)],
      }));

      const { current, pageSize } = params;
      const start = (current - 1) * pageSize;
      const end = start + pageSize;

      setPosts(mockData.slice(start, end));
      setPagination({
        ...pagination,
        current,
        total: mockData.length,
      });
    } catch (error) {
      message.error('获取动态列表失败');
      console.error('获取动态列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 首次加载获取动态列表
  useEffect(() => {
    fetchPosts({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    });
  }, []);

  // 处理表格变化
  const handleTableChange = (newPagination, newFilters, sorter) => {
    fetchPosts({
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
    fetchPosts({
      current: 1,
      pageSize: pagination.pageSize,
      ...newFilters,
    });
  };

  // 重置搜索
  const handleReset = () => {
    form.resetFields();
    setFilters({});
    fetchPosts({
      current: 1,
      pageSize: pagination.pageSize,
    });
  };

  // 查看动态详情
  const handleView = (record) => {
    setCurrentPost(record);
    setPostDetailVisible(true);
  };

  // 删除动态
  const handleDelete = (id) => {
    confirm({
      title: '确定要删除这条动态吗？',
      icon: <ExclamationCircleOutlined />,
      content: '删除后不可恢复',
      onOk: async () => {
        try {
          // 模拟API调用
          message.success('删除成功');
          fetchPosts({
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
      title: `确定要删除选中的 ${selectedRowKeys.length} 条动态吗？`,
      icon: <ExclamationCircleOutlined />,
      content: '删除后不可恢复',
      onOk: async () => {
        try {
          // 模拟API调用
          message.success('批量删除成功');
          setSelectedRowKeys([]);
          fetchPosts({
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

  // 修改动态状态
  const handleChangeStatus = async (id, newStatus) => {
    try {
      // 模拟API调用
      message.success('状态修改成功');
      fetchPosts({
        current: pagination.current,
        pageSize: pagination.pageSize,
        ...filters,
      });
    } catch (error) {
      message.error('状态修改失败');
      console.error('状态修改失败:', error);
    }
  };

  // 表格列配置
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户信息',
      key: 'userInfo',
      width: 200,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src={record.userAvatar}
            alt={record.userNickname}
            style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 8 }}
          />
          <div>
            <div>{record.userNickname}</div>
            <div style={{ fontSize: 12, color: '#999' }}>ID: {record.userId}</div>
          </div>
        </div>
      ),
    },
    {
      title: '内容',
      key: 'content',
      render: (_, record) => (
        <Space direction="vertical">
          <PostContent>{record.content}</PostContent>
          {record.images && record.images.length > 0 && (
            <Space wrap>
              {record.images.slice(0, 3).map((image) => (
                <Image
                  key={image.id}
                  src={image.url}
                  alt="动态图片"
                  style={{ width: 50, height: 50, objectFit: 'cover' }}
                  preview={{
                    src: image.url,
                  }}
                />
              ))}
              {record.images.length > 3 && (
                <div style={{ fontSize: 12, color: '#999' }}>
                  +{record.images.length - 3}张
                </div>
              )}
            </Space>
          )}
        </Space>
      ),
    },
    {
      title: '互动数据',
      key: 'interactions',
      width: 150,
      render: (_, record) => (
        <Space>
          <span>点赞: {record.likesCount}</span>
          <span>评论: {record.commentsCount}</span>
        </Space>
      ),
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 100,
    },
    {
      title: '发布时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '正常' : '已禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Tooltip title="查看">
            <ActionButton
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title={record.status === 1 ? '禁用' : '启用'}>
            <ActionButton
              type="link"
              icon={record.status === 1 ? <StopOutlined /> : <CheckCircleOutlined />}
              onClick={() => handleChangeStatus(record.id, record.status === 1 ? 0 : 1)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <ActionButton
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

  // 渲染搜索表单
  const renderSearchForm = () => (
    <StyledCard>
      <Form
        form={form}
        name="search"
        onFinish={handleSearch}
        initialValues={{
          status: undefined,
          dateRange: undefined,
        }}
      >
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="keyword" label="关键词">
              <Input placeholder="搜索用户昵称/动态内容" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="status" label="状态">
              <Select placeholder="请选择状态">
                <Option value={undefined}>全部</Option>
                <Option value={1}>正常</Option>
                <Option value={0}>已禁用</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="dateRange" label="发布时间">
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

  // 渲染动态详情
  const renderPostDetail = () => {
    if (!currentPost) return null;
    
    return (
      <Modal
        title="动态详情"
        visible={postDetailVisible}
        onCancel={() => setPostDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPostDetailVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        <div style={{ padding: '20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
            <Image
              src={currentPost.userAvatar}
              alt={currentPost.userNickname}
              style={{ width: 48, height: 48, borderRadius: '50%', marginRight: 16 }}
            />
            <div>
              <div style={{ fontWeight: 'bold' }}>{currentPost.userNickname}</div>
              <div style={{ fontSize: 12, color: '#999' }}>
                {currentPost.createdAt} · {currentPost.location}
              </div>
            </div>
          </div>
          
          <div style={{ marginBottom: 24 }}>
            <div style={{ whiteSpace: 'pre-wrap', marginBottom: 16 }}>
              {currentPost.content}
            </div>
            {currentPost.images && currentPost.images.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {currentPost.images.map((image) => (
                  <Image
                    key={image.id}
                    src={image.url}
                    alt="动态图片"
                    style={{ width: 200, height: 200, objectFit: 'cover' }}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#999' }}>
            <div>
              <span style={{ marginRight: 24 }}>
                <FileImageOutlined /> {currentPost.images?.length || 0} 张图片
              </span>
              <span>
                位置：{currentPost.location}
              </span>
            </div>
            <div>
              <span style={{ marginRight: 24 }}>
                点赞：{currentPost.likesCount}
              </span>
              <span>
                评论：{currentPost.commentsCount}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div>
      {renderSearchForm()}
      
      <Card
        title="动态列表"
        extra={
          <Button 
            type="primary" 
            danger 
            icon={<DeleteOutlined />} 
            disabled={selectedRowKeys.length === 0}
            onClick={handleBatchDelete}
          >
            批量删除
          </Button>
        }
      >
        <Table
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          columns={columns}
          dataSource={posts}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />
      </Card>
      
      {renderPostDetail()}
    </div>
  );
};

export default PostList; 