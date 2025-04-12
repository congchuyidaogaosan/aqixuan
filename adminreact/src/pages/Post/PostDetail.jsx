import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, Button, Image, Space, Tag, List, Comment, 
  Avatar, Tooltip, Modal, message, Spin, Typography
} from 'antd';
import { 
  ArrowLeftOutlined, DeleteOutlined, ExclamationCircleOutlined,
  LikeOutlined, CommentOutlined, FileImageOutlined,
  CheckCircleOutlined, StopOutlined, EnvironmentOutlined,
  DislikeOutlined, MessageOutlined
} from '@ant-design/icons';
import moment from 'moment';
import styled from 'styled-components';

const { confirm } = Modal;
const { Text } = Typography;

const StyledCard = styled(Card)`
  margin-bottom: 20px;
`;

const ContentWrapper = styled.div`
  white-space: pre-wrap;
  margin-bottom: 24px;
  font-size: 16px;
  line-height: 1.8;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  color: #999;
  font-size: 14px;
  margin-bottom: 24px;
  
  & > span {
    margin-right: 24px;
    display: flex;
    align-items: center;
    
    & > .anticon {
      margin-right: 8px;
    }
  }
`;

const CommentWrapper = styled.div`
  .comment-action {
    padding-left: 8px;
    cursor: pointer;
    &:hover {
      color: #1890ff;
    }
  }
  .comment-content {
    margin-top: 8px;
  }
  .reply-list {
    margin-left: 44px;
  }
`;

const CommentItem = ({ comment }) => {
  const actions = [
    <Tooltip key="like" title="点赞">
      <Space className="comment-action">
        <LikeOutlined />
        <span>{comment.likes || 0}</span>
      </Space>
    </Tooltip>,
    <Tooltip key="dislike" title="不喜欢">
      <Space className="comment-action">
        <DislikeOutlined />
        <span>{comment.dislikes || 0}</span>
      </Space>
    </Tooltip>,
    <Space key="reply" className="comment-action">
      <MessageOutlined />
      <span>回复</span>
    </Space>,
  ];

  return (
    <List.Item actions={actions}>
      <List.Item.Meta
        avatar={<Avatar src={comment.avatar}>{comment.author.charAt(0)}</Avatar>}
        title={
          <Space>
            <Text strong>{comment.author}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {moment(comment.datetime).fromNow()}
            </Text>
          </Space>
        }
        description={
          <div className="comment-content">
            {comment.content}
          </div>
        }
      />
      {comment.replies && comment.replies.length > 0 && (
        <div className="reply-list">
          <List
            itemLayout="horizontal"
            dataSource={comment.replies}
            renderItem={(reply) => (
              <CommentItem comment={reply} />
            )}
          />
        </div>
      )}
    </List.Item>
  );
};

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentPagination, setCommentPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 获取动态详情
  const fetchPostDetail = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockPost = {
        id: parseInt(id),
        userId: Math.floor(Math.random() * 1000) + 1,
        userNickname: `用户${Math.floor(Math.random() * 1000) + 1}`,
        userAvatar: `https://api.dicebear.com/7.x/avatars/svg?seed=${id}`,
        content: `这是第${id}条动态的详细内容，包含了更多的文字描述...\n\n这是第二段内容，展示了换行效果。`,
        images: Array.from({ length: Math.floor(Math.random() * 9) + 1 }, (_, i) => ({
          id: i + 1,
          url: `https://picsum.photos/800/600?random=${id * 10 + i}`,
        })),
        likesCount: Math.floor(Math.random() * 1000),
        commentsCount: Math.floor(Math.random() * 100),
        status: Math.random() > 0.1 ? 1 : 0,
        createdAt: moment().subtract(id, 'hours').format('YYYY-MM-DD HH:mm:ss'),
        location: ['北京', '上海', '广州', '深圳'][Math.floor(Math.random() * 4)],
      };
      
      setPost(mockPost);
    } catch (error) {
      message.error('获取动态详情失败');
      console.error('获取动态详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取评论列表
  const fetchComments = async (page = 1) => {
    try {
      // 模拟API调用
      const mockComments = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        userId: Math.floor(Math.random() * 1000) + 1,
        userNickname: `评论用户${Math.floor(Math.random() * 1000) + 1}`,
        userAvatar: `https://api.dicebear.com/7.x/avatars/svg?seed=comment${index}`,
        content: `这是第${index + 1}条评论内容，可能会很长很长很长很长很长很长很长很长很长很长很长很长...`,
        createdAt: moment().subtract(index, 'hours').format('YYYY-MM-DD HH:mm:ss'),
        likesCount: Math.floor(Math.random() * 100),
        status: Math.random() > 0.1 ? 1 : 0,
      }));

      const start = (page - 1) * commentPagination.pageSize;
      const end = start + commentPagination.pageSize;
      
      setComments(mockComments.slice(start, end));
      setCommentPagination({
        ...commentPagination,
        current: page,
        total: mockComments.length,
      });
    } catch (error) {
      message.error('获取评论列表失败');
      console.error('获取评论列表失败:', error);
    }
  };

  useEffect(() => {
    fetchPostDetail();
    fetchComments();
  }, [id]);

  // 处理删除动态
  const handleDelete = () => {
    confirm({
      title: '确定要删除这条动态吗？',
      icon: <ExclamationCircleOutlined />,
      content: '删除后不可恢复',
      onOk: async () => {
        try {
          // 模拟API调用
          message.success('删除成功');
          navigate('/post');
        } catch (error) {
          message.error('删除失败');
          console.error('删除失败:', error);
        }
      },
    });
  };

  // 处理修改动态状态
  const handleChangeStatus = async (newStatus) => {
    try {
      // 模拟API调用
      message.success('状态修改成功');
      setPost({
        ...post,
        status: newStatus,
      });
    } catch (error) {
      message.error('状态修改失败');
      console.error('状态修改失败:', error);
    }
  };

  // 处理删除评论
  const handleDeleteComment = (commentId) => {
    confirm({
      title: '确定要删除这条评论吗？',
      icon: <ExclamationCircleOutlined />,
      content: '删除后不可恢复',
      onOk: async () => {
        try {
          // 模拟API调用
          message.success('删除评论成功');
          fetchComments(commentPagination.current);
        } catch (error) {
          message.error('删除评论失败');
          console.error('删除评论失败:', error);
        }
      },
    });
  };

  // 处理修改评论状态
  const handleChangeCommentStatus = async (commentId, newStatus) => {
    try {
      // 模拟API调用
      message.success('评论状态修改成功');
      const newComments = comments.map(comment => 
        comment.id === commentId ? { ...comment, status: newStatus } : comment
      );
      setComments(newComments);
    } catch (error) {
      message.error('评论状态修改失败');
      console.error('评论状态修改失败:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        动态不存在或已被删除
      </div>
    );
  }

  return (
    <div>
      <StyledCard
        title={
          <Space>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/post')}
            >
              返回列表
            </Button>
            <span>动态详情</span>
          </Space>
        }
        extra={
          <Space>
            <Button
              type={post.status === 1 ? 'default' : 'primary'}
              icon={post.status === 1 ? <StopOutlined /> : <CheckCircleOutlined />}
              onClick={() => handleChangeStatus(post.status === 1 ? 0 : 1)}
            >
              {post.status === 1 ? '禁用' : '启用'}
            </Button>
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />}
              onClick={handleDelete}
            >
              删除
            </Button>
          </Space>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          <Avatar
            src={post.userAvatar}
            size={64}
            style={{ marginRight: 16 }}
          />
          <div>
            <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>
              {post.userNickname}
            </div>
            <div style={{ color: '#999' }}>
              用户ID: {post.userId}
            </div>
          </div>
        </div>

        <ContentWrapper>
          {post.content}
        </ContentWrapper>

        {post.images && post.images.length > 0 && (
          <ImageGrid>
            {post.images.map((image) => (
              <Image
                key={image.id}
                src={image.url}
                alt="动态图片"
                style={{ width: '100%', height: 200, objectFit: 'cover' }}
              />
            ))}
          </ImageGrid>
        )}

        <MetaInfo>
          <span>
            <FileImageOutlined /> {post.images?.length || 0} 张图片
          </span>
          <span>
            <LikeOutlined /> {post.likesCount} 点赞
          </span>
          <span>
            <CommentOutlined /> {post.commentsCount} 评论
          </span>
          <span>
            <EnvironmentOutlined /> {post.location}
          </span>
          <span>
            发布时间：{post.createdAt}
          </span>
          <Tag color={post.status === 1 ? 'green' : 'red'}>
            {post.status === 1 ? '正常' : '已禁用'}
          </Tag>
        </MetaInfo>
      </StyledCard>

      <Card title="评论列表">
        <CommentWrapper>
          <List
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={(comment) => (
              <CommentItem comment={comment} />
            )}
          />
        </CommentWrapper>
      </Card>
    </div>
  );
};

export default PostDetail; 