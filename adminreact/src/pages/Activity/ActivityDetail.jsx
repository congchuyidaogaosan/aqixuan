import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Button, Image, Space, Tag, List, Avatar,
  Descriptions, Modal, message, Spin, Statistic, Row, Col
} from 'antd';
import {
  ArrowLeftOutlined, DeleteOutlined, ExclamationCircleOutlined,
  UserOutlined, ClockCircleOutlined, EnvironmentOutlined,
  EditOutlined
} from '@ant-design/icons';
import moment from 'moment';
import styled from 'styled-components';

const { confirm } = Modal;

const StyledCard = styled(Card)`
  margin-bottom: 20px;
`;

const ContentWrapper = styled.div`
  white-space: pre-wrap;
  margin-bottom: 24px;
  font-size: 16px;
  line-height: 1.8;
`;

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [participantPagination, setParticipantPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 获取活动详情
  const fetchActivityDetail = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockActivity = {
        id: parseInt(id),
        title: `活动${id}`,
        cover: `https://picsum.photos/800/400?random=${id}`,
        startTime: moment().add(id, 'days').format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().add(parseInt(id) + 7, 'days').format('YYYY-MM-DD HH:mm:ss'),
        location: ['线上', '北京', '上海', '广州', '深圳'][Math.floor(Math.random() * 5)],
        type: ['offline', 'online'][Math.floor(Math.random() * 2)],
        maxParticipants: 1000,
        currentParticipants: Math.floor(Math.random() * 1000),
        description: `这是活动${id}的详细描述，包含了活动的具体内容和安排...\n\n这是第二段描述，可以包含更多细节。`,
        notice: `1. 请准时参加\n2. 请遵守活动规则\n3. 注意安全`,
        status: ['draft', 'ongoing', 'ended', 'cancelled'][Math.floor(Math.random() * 4)],
        createdAt: moment().subtract(id, 'days').format('YYYY-MM-DD HH:mm:ss'),
        createdBy: {
          id: 1,
          nickname: '管理员',
          avatar: `https://api.dicebear.com/7.x/avatars/svg?seed=admin`,
        },
      };
      
      setActivity(mockActivity);
    } catch (error) {
      message.error('获取活动详情失败');
      console.error('获取活动详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取参与者列表
  const fetchParticipants = async (page = 1) => {
    try {
      // 模拟API调用
      const mockParticipants = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        userId: Math.floor(Math.random() * 1000) + 1,
        nickname: `用户${Math.floor(Math.random() * 1000) + 1}`,
        avatar: `https://api.dicebear.com/7.x/avatars/svg?seed=user${index}`,
        joinTime: moment().subtract(index, 'hours').format('YYYY-MM-DD HH:mm:ss'),
        status: Math.random() > 0.1 ? 'joined' : 'cancelled',
      }));

      const start = (page - 1) * participantPagination.pageSize;
      const end = start + participantPagination.pageSize;
      
      setParticipants(mockParticipants.slice(start, end));
      setParticipantPagination({
        ...participantPagination,
        current: page,
        total: mockParticipants.length,
      });
    } catch (error) {
      message.error('获取参与者列表失败');
      console.error('获取参与者列表失败:', error);
    }
  };

  useEffect(() => {
    fetchActivityDetail();
    fetchParticipants();
  }, [id]);

  // 处理删除活动
  const handleDelete = () => {
    confirm({
      title: '确定要删除这个活动吗？',
      icon: <ExclamationCircleOutlined />,
      content: '删除后不可恢复',
      onOk: async () => {
        try {
          // 模拟API调用
          message.success('删除成功');
          navigate('/activity');
        } catch (error) {
          message.error('删除失败');
          console.error('删除失败:', error);
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!activity) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        活动不存在或已被删除
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
              onClick={() => navigate('/activity')}
            >
              返回列表
            </Button>
            <span>活动详情</span>
          </Space>
        }
        extra={
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/activity/edit/${activity.id}`)}
            >
              编辑
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
        <Image
          src={activity.cover}
          alt={activity.title}
          style={{ width: '100%', height: 400, objectFit: 'cover', marginBottom: 24 }}
        />

        <Row gutter={24} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Statistic
              title="参与人数"
              value={activity.currentParticipants}
              suffix={`/ ${activity.maxParticipants}`}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="活动类型"
              value={activity.type === 'online' ? '线上活动' : '线下活动'}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="活动状态"
              value={getStatusTag(activity.status)}
            />
          </Col>
        </Row>

        <Descriptions
          title="基本信息"
          bordered
          column={2}
          style={{ marginBottom: 24 }}
        >
          <Descriptions.Item label="活动ID">{activity.id}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{activity.createdAt}</Descriptions.Item>
          <Descriptions.Item label="开始时间">{activity.startTime}</Descriptions.Item>
          <Descriptions.Item label="结束时间">{activity.endTime}</Descriptions.Item>
          <Descriptions.Item label="活动地点">{activity.location}</Descriptions.Item>
          <Descriptions.Item label="创建者">
            <Space>
              <Avatar src={activity.createdBy.avatar} />
              {activity.createdBy.nickname}
            </Space>
          </Descriptions.Item>
        </Descriptions>

        <Card title="活动描述" style={{ marginBottom: 24 }}>
          <ContentWrapper>{activity.description}</ContentWrapper>
        </Card>

        {activity.notice && (
          <Card title="活动须知" style={{ marginBottom: 24 }}>
            <ContentWrapper>{activity.notice}</ContentWrapper>
          </Card>
        )}

        <Card title="参与者列表">
          <List
            dataSource={participants}
            pagination={{
              ...participantPagination,
              onChange: (page) => fetchParticipants(page),
            }}
            renderItem={(participant) => (
              <List.Item
                actions={[
                  <Tag color={participant.status === 'joined' ? 'green' : 'red'}>
                    {participant.status === 'joined' ? '已参与' : '已取消'}
                  </Tag>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={participant.avatar} />}
                  title={participant.nickname}
                  description={`用户ID: ${participant.userId} · 参与时间: ${participant.joinTime}`}
                />
              </List.Item>
            )}
          />
        </Card>
      </StyledCard>
    </div>
  );
};

export default ActivityDetail; 