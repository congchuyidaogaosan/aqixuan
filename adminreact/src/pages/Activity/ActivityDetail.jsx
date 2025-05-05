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
      const response = await fetch(`/api/manage/activity/detail/${id}`);
      const data = await response.json();
      
      if (data.code === 200) {
        setActivity({
          ...data.data.activity,
          createdBy: data.data.creator,
          currentParticipants: data.data.signupCount
        });
      } else {
        message.error(data.message || '获取活动详情失败');
      }
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
      const response = await fetch(`/api/manage/activity/participants/${id}?pageNum=${page}&pageSize=${participantPagination.pageSize}`);
      const data = await response.json();
      
      if (data.code === 200) {
        setParticipants(data.data.records);
      setParticipantPagination({
          current: data.data.current,
          pageSize: data.data.size,
          total: data.data.total,
      });
      } else {
        message.error(data.message || '获取参与者列表失败');
      }
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
          const response = await fetch(`/api/manage/activity/delete/${id}`, {
            method: 'POST',
          });
          const data = await response.json();
          
          if (data.code === 200) {
          message.success('删除成功');
          navigate('/activity');
          } else {
            message.error(data.message || '删除失败');
          }
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
      1: { color: 'green', text: '进行中' },
      2: { color: 'blue', text: '已结束' },
      3: { color: 'red', text: '已取消' }
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
          src={activity.handImg || 'https://via.placeholder.com/800x400?text=暂无图片'}
          alt={activity.title}
          style={{ width: '100%', height: 400, objectFit: 'cover', marginBottom: 24 }}
          fallback="https://via.placeholder.com/800x400?text=图片加载失败"
        />

        <Row gutter={24} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Statistic
              title="参与人数"
              value={activity.currentParticipants}
              suffix={`/ ${activity.totalNumber}`}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="活动类型"
              value={activity.activityType === '0' ? '户外活动' : '室内活动'}
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
              <Avatar 
                src={activity.createdBy?.avatar || 'https://via.placeholder.com/40x40?text=暂无头像'} 
                icon={<UserOutlined />}
              />
              {activity.createdBy?.nickname}
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
                key={participant.id}
                actions={[
                  <Tag key={`tag-${participant.id}`} color={participant.status === 1 ? 'green' : 'red'}>
                    {participant.status === 1 ? '已参与' : '已取消'}
                  </Tag>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      src={participant.avatar || 'https://via.placeholder.com/40x40?text=暂无头像'} 
                      icon={<UserOutlined />}
                    />
                  }
                  title={participant.nickname}
                  description={
                    <Space>
                      <UserOutlined /> 用户ID: {participant.userId}
                      <ClockCircleOutlined /> 参与时间: {participant.joinTime}
                    </Space>
                  }
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