import React, { useState, useEffect } from 'react';
import { 
  Table, Card, Button, Input, Space, Modal, 
  message, Form, DatePicker, Row, Col, Image,
  Tag, Avatar, List, Spin, Typography, Popconfirm
} from 'antd';
import { 
  SearchOutlined, DeleteOutlined, ExclamationCircleOutlined, 
  EyeOutlined, MessageOutlined
} from '@ant-design/icons';
import moment from 'moment';
import styled from 'styled-components';
import { getMomentList, deleteMoment, batchDeleteMoments, getMomentComments, deleteComment } from '../../api/moment';

const { confirm } = Modal;
const { RangePicker } = DatePicker;
const { Text } = Typography;

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

const ImageList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const CommentItem = styled.div`
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
  margin-left: ${props => props.$level * 24}px;
`;

const CommentContent = styled.div`
  flex: 1;
  margin-left: 12px;
`;

const CommentMeta = styled.div`
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .left {
    display: flex;
    align-items: center;
  }
  
  .author {
    font-weight: 500;
    margin-right: 8px;
  }
  
  .time {
    color: #999;
    font-size: 12px;
  }

  .reply-to {
    color: #1890ff;
    margin: 0 8px;
  }
`;

const CommentActions = styled.div`
  display: flex;
  gap: 8px;
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
    pageSizeOptions: ['10', '20', '50', '100'],
    showTotal: (total) => `共 ${total} 条记录`
  });
  const [searchParams, setSearchParams] = useState(null);
  const [form] = Form.useForm();
  const [postDetailVisible, setPostDetailVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const fetchPosts = async () => {
    if (!searchParams && !pagination.current) return;
    
    setLoading(true);
    try {
      const params = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        ...(searchParams || {})
      };

      const response = await getMomentList(params);
      
      if (response.code === 200) {
        setPosts(response.data.records);
        setPagination(prev => ({
          ...prev,
          current: response.data.current,
          pageSize: response.data.size,
          total: response.data.total
        }));
      } else {
        message.error(response.msg || '获取动态列表失败');
      }
    } catch (error) {
      console.error('获取动态列表失败:', error);
      message.error('获取动态列表失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (searchParams !== null) {
      fetchPosts();
    }
  }, [pagination.current, pagination.pageSize, searchParams]);

  const handleSearch = () => {
    const values = form.getFieldsValue();
    const { timeRange, ...restValues } = values;
    
    const params = { ...restValues };
    if (timeRange && timeRange[0] && timeRange[1]) {
      params.startTime = timeRange[0].format('YYYY-MM-DD HH:mm:ss');
      params.endTime = timeRange[1].format('YYYY-MM-DD HH:mm:ss');
    }

    setPagination(prev => ({
      ...prev,
      current: 1
    }));
    setSearchParams(params);
  };

  const handleReset = () => {
    form.resetFields();
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
    setSearchParams({});
  };

  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize
    }));
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleDelete = (id) => {
    confirm({
      title: '确认删除',
      content: '确定要删除这条动态吗？删除后将无法恢复！',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          const response = await deleteMoment(id);
          if (response.code === 200) {
            message.success('删除成功');
            fetchPosts();
          } else {
            message.error(response.msg || '删除失败');
          }
        } catch (error) {
          message.error('删除失败');
        }
      }
    });
  };

  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的动态');
      return;
    }

    confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 条动态吗？删除后将无法恢复！`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          const response = await batchDeleteMoments(selectedRowKeys);
          if (response.code === 200) {
            message.success('批量删除成功');
            setSelectedRowKeys([]);
            fetchPosts();
          } else {
            message.error(response.msg || '批量删除失败');
          }
        } catch (error) {
          message.error('批量删除失败');
        }
      }
    });
  };

  const handleViewPost = async (record) => {
    setCurrentPost(record);
    setPostDetailVisible(true);
    await fetchComments(record.moment.id);
  };

  const fetchComments = async (momentId) => {
    setLoadingComments(true);
    try {
      const response = await getMomentComments(momentId);
      if (response.code === 200) {
        setComments(response.data || []);
      } else {
        message.error(response.msg || '获取评论失败');
      }
    } catch (error) {
      console.error('获取评论失败:', error);
      message.error('获取评论失败');
    }
    setLoadingComments(false);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await deleteComment(commentId);
      if (response.code === 200) {
        message.success('删除评论成功');
        // 重新获取评论列表
        await fetchComments(currentPost.moment.id);
      } else {
        message.error(response.msg || '删除评论失败');
      }
    } catch (error) {
      console.error('删除评论失败:', error);
      message.error('删除评论失败');
    }
  };

  // 递归渲染评论及其回复
  const renderCommentTree = (comments, parentId = null, level = 0) => {
    return comments
      .filter(comment => String(comment.parentId) === String(parentId || 0))
      .sort((a, b) => moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf())
      .map(comment => {
        const replies = comments.filter(reply => String(reply.parentId) === String(comment.id));
        // 找到父评论的用户昵称
        const parentComment = comments.find(c => c.id === comment.parentId);
        
        return (
          <React.Fragment key={comment.id}>
            <CommentItem $level={level}>
              <Avatar src={comment.handImg}>
                {comment.nickname ? comment.nickname.charAt(0) : ''}
              </Avatar>
              <CommentContent>
                <CommentMeta>
                  <div className="left">
                    <Text className="author">{comment.nickname}</Text>
                    {parentComment && comment.parentId !== 0 && (
                      <>
                        <span className="reply-to">回复</span>
                        <Text className="author">{parentComment.nickname}</Text>
                      </>
                    )}
                    <Text className="time">
                      {moment(comment.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                    </Text>
                  </div>
                  <CommentActions>
                    <Popconfirm
                      title="确定要删除这条评论吗？"
                      onConfirm={() => handleDeleteComment(comment.id)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button type="link" danger icon={<DeleteOutlined />}>
                        删除
                      </Button>
                    </Popconfirm>
                  </CommentActions>
                </CommentMeta>
                <div>{comment.content}</div>
              </CommentContent>
            </CommentItem>
            {replies.length > 0 && renderCommentTree(comments, comment.id, level + 1)}
          </React.Fragment>
        );
      });
  };

  const columns = [
    {
      title: '用户信息',
      key: 'userInfo',
      width: 200,
      render: (_, record) => (
        <Space>
          <Avatar src={record.userAvatar} size="small">
            {record.userNickname ? record.userNickname.charAt(0) : ''}
          </Avatar>
          <span>{record.userNickname}</span>
        </Space>
      )
    },
    {
      title: '动态内容',
      key: 'content',
      render: (_, record) => (
        <div>
          <PostContent>{record.moment.content}</PostContent>
          {record.mediaList && record.mediaList.length > 0 && (
            <ImageList>
              {record.mediaList.slice(0, 3).map((media, index) => (
                <Image
                  key={media.id}
                  src={media.mediaUrl}
                  alt={`动态图片${index + 1}`}
                  style={{ width: 60, height: 60, objectFit: 'cover' }}
                  preview={{
                    src: media.mediaUrl
                  }}
                />
              ))}
              {record.mediaList.length > 3 && (
                <div style={{ fontSize: 12, color: '#999' }}>
                  +{record.mediaList.length - 3}张
                </div>
              )}
            </ImageList>
          )}
        </div>
      )
    },
    {
      title: '互动数据',
      key: 'interactions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Tag color="blue">点赞: {record.moment.likesCount}</Tag>
          <Tag color="green">评论: {record.moment.commentsCount}</Tag>
        </Space>
      )
    },
    {
      title: '位置',
      dataIndex: ['moment', 'location'],
      width: 120
    },
    {
      title: '发布时间',
      dataIndex: ['moment', 'createdAt'],
      width: 180,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleViewPost(record)}
          >
            查看
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.moment.id)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  const renderPostDetail = () => {
    if (!currentPost) return null;
    
    return (
      <Modal
        title="动态详情"
        open={postDetailVisible}
        onCancel={() => {
          setPostDetailVisible(false);
          setComments([]);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setPostDetailVisible(false);
            setComments([]);
          }}>
            关闭
          </Button>,
          <Button 
            key="delete" 
            type="primary" 
            danger
            onClick={() => {
              setPostDetailVisible(false);
              setComments([]);
              handleDelete(currentPost.moment.id);
            }}
          >
            删除
          </Button>
        ]}
        width={800}
      >
        <Card bordered={false}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Space align="center" style={{ marginBottom: 16 }}>
                <Avatar 
                  src={currentPost.userAvatar} 
                  size={48}
                >
                  {currentPost.userNickname ? currentPost.userNickname.charAt(0) : ''}
                </Avatar>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{currentPost.userNickname}</div>
                  <div style={{ fontSize: 12, color: '#999' }}>
                    {moment(currentPost.moment.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                    {currentPost.moment.location && ` · ${currentPost.moment.location}`}
                  </div>
                </div>
              </Space>
            </Col>
            
            <Col span={24}>
              <div style={{ whiteSpace: 'pre-wrap', marginBottom: 16 }}>
                {currentPost.moment.content}
              </div>
              {currentPost.mediaList && currentPost.mediaList.length > 0 && (
                <ImageList>
                  {currentPost.mediaList.map((media) => (
                    <Image
                      key={media.id}
                      src={media.mediaUrl}
                      alt="动态图片"
                      style={{ maxWidth: '100%', maxHeight: 300 }}
                    />
                  ))}
                </ImageList>
              )}
            </Col>
            
            <Col span={24}>
              <Space split={<span style={{ margin: '0 8px' }}>·</span>}>
                <span>点赞 {currentPost.moment.likesCount}</span>
                <span>评论 {currentPost.moment.commentsCount}</span>
                {currentPost.moment.location && (
                  <span>位置：{currentPost.moment.location}</span>
                )}
              </Space>
            </Col>

            <Col span={24}>
              <Card
                title={`评论列表 (${comments.length})`}
                type="inner"
                bordered={false}
              >
                <Spin spinning={loadingComments}>
                  {comments.length > 0 ? (
                    <List>
                      {renderCommentTree(comments)}
                    </List>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px 0', color: '#999' }}>
                      暂无评论
                    </div>
                  )}
                </Spin>
              </Card>
            </Col>
          </Row>
        </Card>
      </Modal>
    );
  };

  return (
    <div>
      <StyledCard>
        <Form
          form={form}
          name="search"
          onFinish={handleSearch}
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item name="keyword" label="动态内容">
                <Input placeholder="请输入动态内容关键词" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="userNickname" label="用户昵称">
                <Input placeholder="请输入用户昵称" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="timeRange" label="发布时间">
                <RangePicker 
                  showTime 
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Space>
                <Button type="primary" onClick={handleSearch}>
                  搜索
                </Button>
                <Button onClick={handleReset}>
                  重置
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </StyledCard>

      <Card
        title={
          <Space>
            动态列表
            <Tag color="blue">{`共 ${pagination.total} 条记录`}</Tag>
          </Space>
        }
        extra={
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={handleBatchDelete}
            disabled={selectedRowKeys.length === 0}
          >
            批量删除 {selectedRowKeys.length > 0 ? `(${selectedRowKeys.length})` : ''}
          </Button>
        }
      >
        <Table
          rowKey={record => record.moment.id}
          columns={columns}
          dataSource={posts}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys
          }}
        />
      </Card>

      {renderPostDetail()}
    </div>
  );
};

export default PostList; 