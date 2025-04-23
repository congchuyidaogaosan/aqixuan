import React, { useState, useEffect } from 'react';
import {
  Table, Card, Button, Space, Input,
  Form, Select, Tag, Modal, message,
  Avatar, Tooltip, Switch, Carousel,
  Typography
} from 'antd';
import {
  UserOutlined, EditOutlined, DeleteOutlined,
  SearchOutlined, PlusOutlined, ReloadOutlined,
  PhoneOutlined, EnvironmentOutlined, CalendarOutlined,
  HeartOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getUserList, deleteUser } from '../../api/user';

const { Option } = Select;
const { Text } = Typography;

const StyledCard = styled(Card)`
  margin-bottom: 20px;
`;

const StyledCarousel = styled(Carousel)`
  .slick-slide {
    text-align: center;
    height: 160px;
    line-height: 160px;
    overflow: hidden;
    background: #f5f5f5;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .slick-dots {
    display: none !important;
  }
`;

const UserInfoCard = styled.div`
  .user-info-item {
    font-size: 12px;
    color: #666;
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .user-tags {
    margin-top: 8px;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
`;

const ImageWrapper = styled.div`
  width: 160px;
  height: 160px;
  margin-right: 16px;
  .ant-carousel {
    height: 100%;
  }
`;

// 用户表单组件
const UserForm = ({ form, initialValues }) => (
  <Form form={form} layout="vertical" initialValues={initialValues}>
    <Form.Item name="phone" label="手机号" rules={[{ required: true, message: '请输入手机号' }]}>
      <Input placeholder="请输入手机号" />
    </Form.Item>
    <Form.Item name="nickname" label="昵称" rules={[{ required: true, message: '请输入昵称' }]}>
      <Input placeholder="请输入昵称" />
    </Form.Item>
    <Form.Item name="introduction" label="简介">
      <Input.TextArea placeholder="请输入简介" />
    </Form.Item>
    <Form.Item name="location" label="位置">
      <Input placeholder="请输入位置" />
    </Form.Item>
  </Form>
);

export const UserList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
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

  // 获取用户列表
  const fetchUsers = async (params = {}) => {
    setLoading(true);
    try {
      const { current, pageSize, keyword, status } = params;
      const response = await getUserList({
        current,
        pageSize,
        keyword,
        status
      });
      
      const { data } = response;
      setUsers(data.records);
      setPagination({
        ...pagination,
        current: data.current,
        pageSize: data.size,
        total: data.total,
      });
    } catch (error) {
      message.error('获取用户列表失败');
      console.error('获取用户列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  }, []);

  // 查看用户详情
  const handleViewDetail = (userId) => {
    navigate(`/user/${userId}`);
  };

  // 处理表格变化
  const handleTableChange = (newPagination, filters, sorter) => {
    fetchUsers({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
      ...filters,
      ...sorter,
    });
  };

  // 处理搜索
  const handleSearch = (values) => {
    setFilters(values);
    setPagination({ ...pagination, current: 1 });
    fetchUsers({
      current: 1,
      pageSize: pagination.pageSize,
      ...values,
    });
  };

  // 处理重置
  const handleReset = () => {
    form.resetFields();
    setFilters({});
    setPagination({ ...pagination, current: 1 });
    fetchUsers({
      current: 1,
      pageSize: pagination.pageSize,
    });
  };

  // 处理删除
  const handleDelete = (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个用户吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteUser(id);
          message.success('删除成功');
          fetchUsers({
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
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除这 ${selectedRowKeys.length} 个用户吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const deletePromises = selectedRowKeys.map(id => deleteUser(id));
          await Promise.all(deletePromises);
          message.success('批量删除成功');
          setSelectedRowKeys([]);
          fetchUsers({
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

  // 表格列配置
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
      fixed: 'left',
    },
    {
      title: '头像/照片',
      dataIndex: 'photos',
      width: 180,
      fixed: 'left',
      render: (_, record) => (
        <ImageWrapper>
          {record.carouselImgs && record.carouselImgs.length > 0 ? (
            <StyledCarousel autoplay>
              {record.carouselImgs.map((img, index) => (
                <div key={index}>
                  <img src={img} alt={`照片${index + 1}`} />
                </div>
              ))}
            </StyledCarousel>
          ) : (
            <Avatar 
              size={160} 
              src={record.handImg} 
              icon={<UserOutlined />} 
              style={{ width: '100%', height: '100%' }}
            />
          )}
        </ImageWrapper>
      ),
    },
    {
      title: '基本信息',
      dataIndex: 'basicInfo',
      width: 200,
      render: (_, record) => (
        <UserInfoCard>
          <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>
            {record.nickname}
          </div>
          <div className="user-info-item">
            <PhoneOutlined /> {record.phone}
          </div>
          {record.location && (
            <div className="user-info-item">
              <EnvironmentOutlined /> {record.location}
            </div>
          )}
          {record.introduction && (
            <div className="user-info-item">
              {record.introduction}
            </div>
          )}
        </UserInfoCard>
      ),
    },
    {
      title: '个人特征',
      dataIndex: 'traits',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.roleType && <Tag color="blue">{record.roleType}</Tag>}
          {record.industry && <Tag color="cyan">{record.industry}</Tag>}
          {record.emotionStatus && <Tag color="pink">{record.emotionStatus}</Tag>}
          {record.mbti && <Tag color="purple">{record.mbti}</Tag>}
          {record.datingPurpose && <Tag color="orange">{record.datingPurpose}</Tag>}
        </Space>
      ),
    },
    {
      title: '兴趣爱好',
      dataIndex: 'interests',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.interests && (
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>兴趣：</Text>
              <br />
              <Text>{record.interests}</Text>
            </div>
          )}
          {record.sports && (
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>运动：</Text>
              <br />
              <Text>{record.sports}</Text>
            </div>
          )}
        </Space>
      ),
    },
    {
      title: '身高体重',
      dataIndex: 'bodyInfo',
      width: 100,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.height && <Text>身高：{record.height}cm</Text>}
          {record.weight && <Text>体重：{record.weight}kg</Text>}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Tag color={record.isVerified ? 'green' : 'orange'}>
            {record.isVerified ? '已认证' : '未认证'}
          </Tag>
          {record.isDeleted && <Tag color="red">已删除</Tag>}
        </Space>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Space>
          <Tooltip title="查看详情">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleViewDetail(record.id)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
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

  return (
    <div>
      <StyledCard>
        <Form
          form={form}
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: 16 }}
        >
          <Form.Item name="keyword">
            <Input
              placeholder="用户名/昵称/手机号"
              prefix={<SearchOutlined />}
              allowClear
            />
          </Form.Item>
          <Form.Item name="status">
            <Select placeholder="认证状态" allowClear style={{ width: 120 }}>
              <Option value={true}>已认证</Option>
              <Option value={false}>未认证</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button onClick={handleReset} icon={<ReloadOutlined />}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </StyledCard>

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/user/new')}>
            新增用户
          </Button>
          {selectedRowKeys.length > 0 && (
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleBatchDelete}
            >
              批量删除
            </Button>
          )}
        </Space>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={users}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: 1300 }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
        />
      </Card>
    </div>
  );
};

export default UserList;
