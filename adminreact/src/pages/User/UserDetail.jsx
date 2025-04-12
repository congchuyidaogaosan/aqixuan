// src/pages/User/UserDetail.js
import React, { useState, useEffect } from 'react';
import { 
  Card, Descriptions, Button, Tabs, Table, Avatar, 
  message, Tag, Modal, Form, Input, Select, Row, Col,
  Statistic
} from 'antd';
import { 
  UserOutlined, EditOutlined, RollbackOutlined,
  MessageOutlined, FileImageOutlined, CalendarOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';

// 假设有一个用户API服务
// import { getUserDetail, updateUser } from '../../api/user';

const { TabPane } = Tabs;
const { confirm } = Modal;
const { Option } = Select;

const ActionButton = styled(Button)`
  margin-right: 8px;
`;

const AvatarContainer = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const UserAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
`;

const StatisticCard = styled(Card)`
  margin-bottom: 24px;
`;

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 获取用户详情
  const fetchUserDetail = async () => {
    setLoading(true);
    try {
      // 在实际项目中，这里会调用API获取数据
      // const response = await getUserDetail(id);
      
      // 使用模拟数据
      const mockUser = {
        id: parseInt(id),
        username: `user${id}`,
        nickname: `用户${id}`,
        avatar: `https://randomuser.me/api/portraits/${parseInt(id) % 2 ? 'women' : 'men'}/${id}.jpg`,
        phone: `1381234${id.padStart(4, '0')}`,
        email: `user${id}@example.com`,
        gender: parseInt(id) % 3,  // 0: 未知, 1: 男, 2: 女
        status: parseInt(id) % 5 === 0 ? 0 : 1,  // 0: 禁用, 1: 正常
        registerTime: moment().subtract(parseInt(id), 'days').format('YYYY-MM-DD HH:mm:ss'),
        lastLoginTime: moment().subtract(parseInt(id) * 2, 'hours').format('YYYY-MM-DD HH:mm:ss'),
        bio: `这是用户${id}的个人简介，用户很懒，没有留下更多信息。`,
        location: '北京市',
        statistics: {
          posts: parseInt(id) * 5,
          followers: parseInt(id) * 20,
          following: parseInt(id) * 10,
          activities: parseInt(id) * 2,
        }
      };
      
      setUser(mockUser);
      
      // 填充表单
      form.setFieldsValue({
        nickname: mockUser.nickname,
        phone: mockUser.phone,
        email: mockUser.email,
        gender: mockUser.gender,
        status: mockUser.status,
        bio: mockUser.bio,
        location: mockUser.location,
      });
    } catch (error) {
      message.error('获取用户详情失败');
      console.error('获取用户详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 首次加载获取用户详情
  useEffect(() => {
    fetchUserDetail();
  }, [id]);

  // 返回列表
  const handleBack = () => {
    navigate('/user');
  };

  // 打开编辑模态框
  const handleEdit = () => {
    setEditModalVisible(true);
  };

  // 提交编辑
  const handleSubmit = async (values) => {
    try {
      // 在实际项目中，这里会调用API更新用户信息
      // await updateUser(id, values);
      
      // 更新本地状态
      setUser({ ...user, ...values });
      
      message.success('更新用户信息成功');
      setEditModalVisible(false);
    } catch (error) {
      message.error('更新用户信息失败');
      console.error('更新用户信息失败:', error);
    }
  };

  // 修改用户状态
  const handleChangeStatus = () => {
    const newStatus = user.status === 1 ? 0 : 1;
    const action = newStatus === 1 ? '启用' : '禁用';
    
    confirm({
      title: `确定要${action}该用户吗？`,
      icon: <ExclamationCircleOutlined />,
      content: `用户名：${user.username}`,
      onOk: async () => {
        try {
          // 在实际项目中，这里会调用API更新状态
          // await updateUserStatus(user.id, newStatus);
          
          // 更新本地状态
          setUser({ ...user, status: newStatus });
          
          message.success(`${action}用户成功`);
        } catch (error) {
          message.error(`${action}用户失败`);
          console.error(`${action}用户失败:`, error);
        }
      },
    });
  };

  // 动态列表
  const postsColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: '图片数',
      dataIndex: 'imageCount',
      key: 'imageCount',
      width: 80,
    },
    {
      title: '点赞数',
      dataIndex: 'likes',
      key: 'likes',
      width: 80,
    },
    {
      title: '评论数',
      dataIndex: 'comments',
      key: 'comments',
      width: 80,
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '正常' : '已删除'}
        </Tag>
      ),
    },
  ];

  // 活动参与记录
  const activitiesColumns = [
    {
      title: '活动ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '活动名称',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '活动时间',
      dataIndex: 'time',
      key: 'time',
      width: 180,
    },
    {
      title: '参与状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const statusMap = {
          1: { text: '已报名', color: 'blue' },
          2: { text: '已参与', color: 'green' },
          3: { text: '已取消', color: 'orange' },
        };
        const { text, color } = statusMap[status] || { text: '未知', color: 'gray' };
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  // 消息记录
  const messagesColumns = [
    {
      title: '消息ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '对方',
      dataIndex: 'targetName',
      key: 'targetName',
      width: 120,
    },
    {
      title: '消息内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: '消息类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => {
        const typeMap = {
          1: { text: '文本', color: '' },
          2: { text: '图片', color: 'blue' },
          3: { text: '语音', color: 'green' },
        };
        const { text, color } = typeMap[type] || { text: '未知', color: 'gray' };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '发送时间',
      dataIndex: 'sendTime',
      key: 'sendTime',
      width: 180,
    },
  ];

  // 操作日志
  const logsColumns = [
    {
      title: '日志ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '操作类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
    },
    {
      title: '操作内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 120,
    },
    {
      title: '设备信息',
      dataIndex: 'device',
      key: 'device',
      width: 180,
    },
    {
      title: '操作时间',
      dataIndex: 'time',
      key: 'time',
      width: 180,
    },
  ];

  // 模拟数据
  const generateMockData = (type, count) => {
    const result = [];
    for (let i = 1; i <= count; i++) {
      if (type === 'posts') {
        result.push({
          id: i,
          content: `这是用户${id}发布的第${i}条动态，内容很精彩...`,
          imageCount: Math.floor(Math.random() * 9) + 1,
          likes: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 50),
          createTime: moment().subtract(i, 'days').format('YYYY-MM-DD HH:mm:ss'),
          status: Math.random() > 0.1 ? 1 : 0,
        });
      } else if (type === 'activities') {
        result.push({
          id: i,
          title: `活动${i}: ${['周末聚会', '户外徒步', '读书分享会', '篮球比赛'][i % 4]}`,
          time: moment().add(i, 'days').format('YYYY-MM-DD HH:mm:ss'),
          status: (i % 3) + 1,
        });
      } else if (type === 'messages') {
        result.push({
          id: i,
          targetName: `用户${i + 10}`,
          content: `这是一条${['问候', '聊天', '约会', '讨论'][i % 4]}消息...`,
          type: (i % 3) + 1,
          sendTime: moment().subtract(i, 'hours').format('YYYY-MM-DD HH:mm:ss'),
        });
      } else if (type === 'logs') {
        result.push({
          id: i,
          type: ['登录', '发布动态', '点赞', '评论', '参与活动'][i % 5],
          content: `用户在${moment().subtract(i, 'hours').format('YYYY-MM-DD HH:mm:ss')}进行了操作`,
          ip: `192.168.1.${i}`,
          device: `${['iPhone', 'Android', 'iPad', 'Windows'][i % 4]} ${['Chrome', 'Safari', 'Firefox', 'Edge'][i % 4]}`,
          time: moment().subtract(i, 'hours').format('YYYY-MM-DD HH:mm:ss'),
        });
      }
    }
    return result;
  };

  // 如果用户数据尚未加载完成，显示加载状态
  if (loading || !user) {
    return <Card loading={true} />;
  }

  return (
    <div>
      <Card 
        title="用户详情"
        extra={
          <Space>
            <ActionButton icon={<RollbackOutlined />} onClick={handleBack}>
              返回
            </ActionButton>
            <ActionButton type="primary" icon={<EditOutlined />} onClick={handleEdit}>
              编辑
            </ActionButton>
            <ActionButton 
              type={user.status === 1 ? "danger" : "primary"}
              onClick={handleChangeStatus}
            >
              {user.status === 1 ? '禁用用户' : '启用用户'}
            </ActionButton>
          </Space>
        }
      >
        <Row gutter={24}>
          <Col span={6}>
            <AvatarContainer>
              <UserAvatar src={user.avatar} icon={<UserOutlined />} />
              <h2>{user.nickname}</h2>
              <p>{user.username}</p>
              <Tag color={user.status === 1 ? 'green' : 'red'}>
                {user.status === 1 ? '正常' : '禁用'}
              </Tag>
            </AvatarContainer>
            
            <StatisticCard>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic 
                    title="动态" 
                    value={user.statistics.posts} 
                    prefix={<FileImageOutlined />} 
                  />
                </Col>
                <Col span={12}>
                  <Statistic 
                    title="活动" 
                    value={user.statistics.activities} 
                    prefix={<CalendarOutlined />} 
                  />
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={12}>
                  <Statistic 
                    title="关注" 
                    value={user.statistics.following} 
                    prefix={<UserOutlined />} 
                  />
                </Col>
                <Col span={12}>
                  <Statistic 
                    title="粉丝" 
                    value={user.statistics.followers} 
                    prefix={<UserOutlined />} 
                  />
                </Col>
              </Row>
            </StatisticCard>
          </Col>
          
          <Col span={18}>
            <Descriptions title="基本信息" bordered column={2}>
              <Descriptions.Item label="用户ID">{user.id}</Descriptions.Item>
              <Descriptions.Item label="用户名">{user.username}</Descriptions.Item>
              <Descriptions.Item label="昵称">{user.nickname}</Descriptions.Item>
              <Descriptions.Item label="手机号">{user.phone}</Descriptions.Item>
              <Descriptions.Item label="邮箱">{user.email}</Descriptions.Item>
              <Descriptions.Item label="性别">
                {['未知', '男', '女'][user.gender]}
              </Descriptions.Item>
              <Descriptions.Item label="地区">{user.location}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={user.status === 1 ? 'green' : 'red'}>
                  {user.status === 1 ? '正常' : '禁用'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="注册时间">{user.registerTime}</Descriptions.Item>
              <Descriptions.Item label="最后登录">{user.lastLoginTime}</Descriptions.Item>
              <Descriptions.Item label="个人简介" span={2}>
                {user.bio}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        
        <Tabs defaultActiveKey="posts" style={{ marginTop: 24 }}>
          <TabPane tab="动态列表" key="posts">
            <Table
              rowKey="id"
              columns={postsColumns}
              dataSource={generateMockData('posts', 10)}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>
          
          <TabPane tab="活动参与" key="activities">
            <Table
              rowKey="id"
              columns={activitiesColumns}
              dataSource={generateMockData('activities', 5)}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>
          
          <TabPane tab="消息记录" key="messages">
            <Table
              rowKey="id"
              columns={messagesColumns}
              dataSource={generateMockData('messages', 20)}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>
          
          <TabPane tab="操作日志" key="logs">
            <Table
              rowKey="id"
              columns={logsColumns}
              dataSource={generateMockData('logs', 30)}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>
        </Tabs>
      </Card>
      
      {/* 编辑用户信息模态框 */}
      <Modal
        title="编辑用户信息"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="nickname"
            label="昵称"
            rules={[{ required: true, message: '请输入昵称' }]}
          >
            <Input placeholder="请输入昵称" />
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1\d{10}$/, message: '请输入有效的手机号码' }
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="性别"
              >
                <Select placeholder="请选择性别">
                  <Option value={0}>未知</Option>
                  <Option value={1}>男</Option>
                  <Option value={2}>女</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择状态">
                  <Option value={1}>正常</Option>
                  <Option value={0}>禁用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item name="location" label="地区">
            <Input placeholder="请输入地区" />
          </Form.Item>
          
          <Form.Item name="bio" label="个人简介">
            <Input.TextArea rows={4} placeholder="请输入个人简介" />
          </Form.Item>
          
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button onClick={() => setEditModalVisible(false)} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserDetail;