// src/pages/Message/MessageList.js
import React, { useState, useEffect } from 'react';
import { 
  Table, Card, Button, Input, Space, Tag, Modal, 
  message, Form, Select, DatePicker, Row, Col, Menu, Dropdown, Tooltip, Avatar 
} from 'antd';
import { 
  SearchOutlined, DeleteOutlined, ExclamationCircleOutlined, 
  EyeOutlined, CheckCircleOutlined, StopOutlined, DownOutlined,
  ExportOutlined, FileTextOutlined, FileImageOutlined, AudioOutlined
} from '@ant-design/icons';
import moment from 'moment';
import styled from 'styled-components';
import { getMessageListWithUserInfo, deleteMessage, batchDeleteMessages } from '../../api/message';

const { confirm } = Modal;
const { RangePicker } = DatePicker;
const { Option } = Select;

const StyledCard = styled(Card)`
  margin-bottom: 20px;
`;

const ActionButton = styled(Button)`
  margin-right: 8px;
`;

const MessageContent = styled.div`
  max-width: 300px;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const UserInfo = ({ avatar, nickname, id }) => (
  <Space>
    <Avatar src={avatar} size="small">
      {nickname ? nickname.charAt(0) : id}
    </Avatar>
    <span>{nickname || id}</span>
  </Space>
);

const MessageList = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchParams, setSearchParams] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    showTotal: (total) => `共 ${total} 条记录`
  });
  const [form] = Form.useForm();
  const [messageDetailVisible, setMessageDetailVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);

  const fetchMessages = async () => {
    if (!searchParams && !pagination.current) return;
    
    setLoading(true);
    try {
      const queryParams = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        ...(searchParams || {})
      };

      const response = await getMessageListWithUserInfo(queryParams);
      
      if (response.code === 200) {
        setMessages(response.data.records);
        setPagination(prev => ({
          ...prev,
          current: response.data.current,
          pageSize: response.data.size,
          total: response.data.total
        }));
      } else {
        message.error(response.msg || '获取消息列表失败');
      }
    } catch (error) {
      console.error('获取消息列表失败:', error);
      message.error('获取消息列表失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (searchParams !== null) {
      fetchMessages();
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
      content: '确定要删除这条消息吗？',
      onOk: async () => {
        try {
          const response = await deleteMessage(id);
          if (response.code === 200) {
            message.success('删除成功');
            fetchMessages();
          }
        } catch (error) {
          message.error('删除失败');
        }
      }
    });
  };

  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的消息');
      return;
    }

    confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 条消息吗？`,
      onOk: async () => {
        try {
          const response = await batchDeleteMessages(selectedRowKeys);
          if (response.code === 200) {
            message.success('批量删除成功');
            setSelectedRowKeys([]);
            fetchMessages();
          }
        } catch (error) {
          message.error('批量删除失败');
        }
      }
    });
  };

  const handleViewMessage = (record) => {
    setCurrentMessage(record);
    setMessageDetailVisible(true);
  };

  const columns = [
    {
      title: '发送者',
      dataIndex: 'sender',
      width: 200,
      render: (_, record) => (
        <UserInfo 
          avatar={record.senderAvatar} 
          nickname={record.senderNickname} 
          id={record.senderId} 
        />
      )
    },
    {
      title: '接收者',
      dataIndex: 'receiver',
      width: 200,
      render: (_, record) => (
        <UserInfo 
          avatar={record.receiverAvatar} 
          nickname={record.receiverNickname} 
          id={record.receiverId} 
        />
      )
    },
    {
      title: '消息类型',
      dataIndex: 'messageType',
      width: 100,
      render: (type) => {
        switch (type) {
          case '1':
            return '文本';
          case '2':
            return '图片';
          default:
            return '未知';
        }
      }
    },
    {
      title: '消息内容',
      dataIndex: 'content',
      ellipsis: true,
      render: (content, record) => {
        if (record.messageType === '2') {
          return (
            <img 
              src={content} 
              alt="消息图片" 
              style={{ maxWidth: '100px', maxHeight: '60px', cursor: 'pointer' }}
              onClick={() => window.open(content, '_blank')}
            />
          );
        }
        return content;
      }
    },
    {
      title: '已读状态',
      dataIndex: 'isRead',
      width: 100,
      render: (isRead) => (
        <Tag color={isRead ? 'green' : 'red'}>
          {isRead ? '已读' : '未读'}
        </Tag>
      )
    },
    {
      title: '发送时间',
      dataIndex: 'createdAt',
      width: 180,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleViewMessage(record)}>
            查看
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      )
    }
  ];

  const renderMessageDetail = () => {
    if (!currentMessage) return null;
    
    return (
      <Modal
        title="消息详情"
        visible={messageDetailVisible}
        onCancel={() => setMessageDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setMessageDetailVisible(false)}>
            关闭
          </Button>,
          <Button 
            key="delete" 
            type="primary" 
            danger
            onClick={() => {
              setMessageDetailVisible(false);
              handleDelete(currentMessage.id);
            }}
          >
            删除
          </Button>
        ]}
        width={700}
      >
        <Card title="消息信息" bordered={false}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 8 }}>发送者：</div>
                <UserInfo 
                  avatar={currentMessage.senderAvatar}
                  nickname={currentMessage.senderNickname}
                  id={currentMessage.senderId}
                />
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 8 }}>接收者：</div>
                <UserInfo 
                  avatar={currentMessage.receiverAvatar}
                  nickname={currentMessage.receiverNickname}
                  id={currentMessage.receiverId}
                />
              </div>
            </Col>
            <Col span={12}>
              <div>消息类型: {currentMessage.messageType === '1' ? '文本' : '图片'}</div>
            </Col>
            <Col span={12}>
              <div>已读状态: <Tag color={currentMessage.isRead ? 'green' : 'red'}>
                {currentMessage.isRead ? '已读' : '未读'}
              </Tag></div>
            </Col>
            <Col span={24}>
              <div>发送时间: {moment(currentMessage.createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
            </Col>
            <Col span={24}>
              <div>消息内容:</div>
              {currentMessage.messageType === '2' ? (
                <div style={{ marginTop: 8 }}>
                  <img 
                    src={currentMessage.content} 
                    alt="消息图片" 
                    style={{ maxWidth: '100%', cursor: 'pointer' }}
                    onClick={() => window.open(currentMessage.content, '_blank')}
                  />
                </div>
              ) : (
                <div style={{ 
                  marginTop: 8,
                  padding: 16,
                  background: '#f5f5f5',
                  borderRadius: 4
                }}>
                  {currentMessage.content}
                </div>
              )}
            </Col>
          </Row>
        </Card>
      </Modal>
    );
  };

  return (
    <div>
      <h2>消息管理</h2>
      
      <StyledCard>
        <Form
          form={form}
          layout="inline"
          style={{ marginBottom: 16 }}
        >
          <Form.Item name="keyword" label="关键词">
            <Input placeholder="请输入消息内容关键词" allowClear />
          </Form.Item>
          
          <Form.Item name="senderNickname" label="发送者">
            <Input placeholder="请输入发送者用户名" allowClear />
          </Form.Item>
          
          <Form.Item name="receiverNickname" label="接收者">
            <Input placeholder="请输入接收者用户名" allowClear />
          </Form.Item>
          
          <Form.Item name="messageType" label="消息类型">
            <Select placeholder="请选择消息类型" allowClear style={{ width: 120 }}>
              <Option value="1">文本</Option>
              <Option value="2">图片</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="timeRange" label="发送时间">
            <RangePicker showTime />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" onClick={handleSearch}>
                搜索
              </Button>
              <Button onClick={handleReset}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </StyledCard>
      
      <Card
        title={
          <Space>
            消息列表
            <Tag color="blue">{`共 ${pagination.total} 条记录`}</Tag>
          </Space>
        }
        extra={
          <Space>
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />} 
              disabled={selectedRowKeys.length === 0}
              onClick={handleBatchDelete}
            >
              批量删除 {selectedRowKeys.length > 0 ? `(${selectedRowKeys.length})` : ''}
            </Button>
          </Space>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={messages}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys
          }}
        />
      </Card>
      
      {renderMessageDetail()}
    </div>
  );
};

export default MessageList;