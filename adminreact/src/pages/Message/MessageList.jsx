// src/pages/Message/MessageList.js
import React, { useState, useEffect } from 'react';
import { 
  Table, Card, Button, Input, Space, Tag, Modal, 
  message, Form, Select, DatePicker, Row, Col, Menu, Dropdown, Tooltip 
} from 'antd';
import { 
  SearchOutlined, DeleteOutlined, ExclamationCircleOutlined, 
  EyeOutlined, CheckCircleOutlined, StopOutlined, DownOutlined,
  ExportOutlined, FileTextOutlined, FileImageOutlined, AudioOutlined
} from '@ant-design/icons';
import moment from 'moment';
import styled from 'styled-components';

// 导入API
// import { getMessageList, deleteMessage, batchDeleteMessages, reviewMessage, exportMessages } from '../../api/message';

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

const MessageList = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
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
  const [messageDetailVisible, setMessageDetailVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);

  // 获取消息列表
  const fetchMessages = async (params = {}) => {
    setLoading(true);
    try {
      // 在实际项目中，这里会调用API获取数据
      // const response = await getMessageList(params);
      
      // 使用模拟数据
      const mockData = {
        data: {
          records: Array(20).fill().map((_, index) => ({
            id: index + 1,
            senderId: 100 + index,
            senderName: `用户${100 + index}`,
            senderAvatar: `https://randomuser.me/api/portraits/${index % 2 ? 'women' : 'men'}/${index + 1}.jpg`,
            receiverId: 200 + index,
            receiverName: `用户${200 + index}`,
            receiverAvatar: `https://randomuser.me/api/portraits/${index % 2 ? 'men' : 'women'}/${index + 1}.jpg`,
            content: `这是一条${['普通', '重要', '紧急'][index % 3]}消息，内容为${['问候', '聊天', '约会', '讨论'][index % 4]}...`,
            type: (index % 3) + 1, // 1: 文本, 2: 图片, 3: 语音
            status: index % 10 === 0 ? 0 : (index % 5 === 0 ? 2 : 1), // 0: 待审核, 1: 正常, 2: 违规
            createdAt: moment().subtract(index, 'hours').format('YYYY-MM-DD HH:mm:ss'),
            reviewedAt: index % 5 === 0 ? moment().subtract(index, 'hours').add(10, 'minutes').format('YYYY-MM-DD HH:mm:ss') : null,
            reviewReason: index % 5 === 0 ? '含有敏感词' : null,
          })),
          total: 100,
        },
      };
      
      setMessages(mockData.data.records);
      setPagination({
        ...pagination,
        current: params.page || 1,
        total: mockData.data.total,
      });
    } catch (error) {
      message.error('获取消息列表失败');
      console.error('获取消息列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 首次加载和筛选条件变化时获取数据
  useEffect(() => {
    fetchMessages({
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    });
  }, [pagination.current, pagination.pageSize, filters]);

  // 表格变化处理
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  // 搜索处理
  const handleSearch = (values) => {
    const { dateRange, ...restValues } = values;
    const filters = { ...restValues };
    
    if (dateRange) {
      filters.startTime = dateRange[0].format('YYYY-MM-DD');
      filters.endTime = dateRange[1].format('YYYY-MM-DD');
    }
    
    setFilters(filters);
    setPagination({ ...pagination, current: 1 });
  };

  // 重置搜索
  const handleReset = () => {
    form.resetFields();
    setFilters({});
    setPagination({ ...pagination, current: 1 });
  };

  // 查看消息详情
  const handleViewMessage = (record) => {
    setCurrentMessage(record);
    setMessageDetailVisible(true);
  };

  // 删除消息
  const handleDeleteMessage = (id) => {
    confirm({
      title: '确定要删除该消息吗？',
      icon: <ExclamationCircleOutlined />,
      content: '删除后无法恢复',
      onOk: async () => {
        try {
          // 在实际项目中，这里会调用API删除数据
          // await deleteMessage(id);
          
          // 更新本地状态
          setMessages(messages.filter(item => item.id !== id));
          message.success('删除成功');
        } catch (error) {
          message.error('删除失败');
          console.error('删除失败:', error);
        }
      },
    });
  };

  // 批量删除消息
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的消息');
      return;
    }
    
    confirm({
      title: `确定要删除选中的 ${selectedRowKeys.length} 条消息吗？`,
      icon: <ExclamationCircleOutlined />,
      content: '删除后无法恢复',
      onOk: async () => {
        try {
          // 在实际项目中，这里会调用API批量删除数据
          // await batchDeleteMessages(selectedRowKeys);
          
          // 更新本地状态
          setMessages(messages.filter(item => !selectedRowKeys.includes(item.id)));
          setSelectedRowKeys([]);
          message.success('批量删除成功');
        } catch (error) {
          message.error('批量删除失败');
          console.error('批量删除失败:', error);
        }
      },
    });
  };

  // 审核消息
  const handleReviewMessage = (id, status, reason = '') => {
    confirm({
      title: status === 1 ? '确定通过该消息吗？' : '确定拒绝该消息吗？',
      icon: <ExclamationCircleOutlined />,
      content: status === 2 ? (
        <Form.Item 
          label="拒绝原因"
          rules={[{ required: true, message: '请输入拒绝原因' }]}
        >
          <Input.TextArea 
            rows={3} 
            placeholder="请输入拒绝原因"
            onChange={(e) => reason = e.target.value}
          />
        </Form.Item>
      ) : null,
      onOk: async () => {
        try {
          // 在实际项目中，这里会调用API审核消息
          // await reviewMessage(id, status, reason);
          
          // 更新本地状态
          setMessages(messages.map(item => 
            item.id === id ? { 
              ...item, 
              status, 
              reviewedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
              reviewReason: status === 2 ? reason : null
            } : item
          ));
          
          message.success(status === 1 ? '审核通过成功' : '审核拒绝成功');
        } catch (error) {
          message.error('审核失败');
          console.error('审核失败:', error);
        }
      },
    });
  };

  // 导出消息数据
  const handleExport = async () => {
    try {
      // 在实际项目中，这里会调用API导出数据
      // const response = await exportMessages(filters);
      
      // 模拟导出成功
      message.success('导出成功');
      
      // // 创建一个下载链接
      // const url = window.URL.createObjectURL(new Blob([response]));
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', `消息数据_${moment().format('YYYY-MM-DD')}.xlsx`);
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
    } catch (error) {
      message.error('导出失败');
      console.error('导出失败:', error);
    }
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '发送者',
      dataIndex: 'senderName',
      key: 'senderName',
      width: 120,
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={record.senderAvatar} 
            alt={text} 
            style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 8 }}
          />
          {text}
        </div>
      ),
    },
    {
      title: '接收者',
      dataIndex: 'receiverName',
      key: 'receiverName',
      width: 120,
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={record.receiverAvatar} 
            alt={text} 
            style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 8 }}
          />
          {text}
        </div>
      ),
    },
    {
      title: '消息内容',
      dataIndex: 'content',
      key: 'content',
      render: (text, record) => (
        <MessageContent>
          {record.type === 1 ? (
            <span>{text}</span>
          ) : record.type === 2 ? (
            <span><FileImageOutlined /> [图片消息]</span>
          ) : (
            <span><AudioOutlined /> [语音消息]</span>
          )}
        </MessageContent>
      ),
    },
    {
      title: '消息类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type) => {
        const typeMap = {
          1: { text: '文本', icon: <FileTextOutlined /> },
          2: { text: '图片', icon: <FileImageOutlined /> },
          3: { text: '语音', icon: <AudioOutlined /> },
        };
        const { text, icon } = typeMap[type] || {};
        return (
          <span>
            {icon} {text}
          </span>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const statusMap = {
          0: { text: '待审核', color: 'warning' },
          1: { text: '正常', color: 'success' },
          2: { text: '违规', color: 'error' },
        };
        const { text, color } = statusMap[status] || {};
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '发送时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      sorter: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => {
        const moreMenu = (
          <Menu>
            {record.status === 0 && (
              <>
                <Menu.Item 
                  key="approve" 
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleReviewMessage(record.id, 1)}
                >
                  审核通过
                </Menu.Item>
                <Menu.Item 
                  key="reject" 
                  icon={<StopOutlined />}
                  onClick={() => handleReviewMessage(record.id, 2)}
                >
                  审核拒绝
                </Menu.Item>
                <Menu.Divider />
              </>
            )}
            <Menu.Item 
              key="delete" 
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteMessage(record.id)}
            >
              删除
            </Menu.Item>
          </Menu>
        );
        
        return (
          <Space>
            <Tooltip title="查看详情">
              <Button 
                type="primary" 
                icon={<EyeOutlined />} 
                size="small"
                onClick={() => handleViewMessage(record)}
              />
            </Tooltip>
            
            <Dropdown overlay={moreMenu}>
              <Button size="small">
                更多 <DownOutlined />
              </Button>
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  // 消息详情模态框
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
        ]}
        width={700}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Card title="发送者信息" bordered={false}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <img 
                  src={currentMessage.senderAvatar} 
                  alt={currentMessage.senderName} 
                  style={{ width: 48, height: 48, borderRadius: '50%', marginRight: 16 }}
                />
                <div>
                  <div style={{ fontWeight: 'bold' }}>{currentMessage.senderName}</div>
                  <div>ID: {currentMessage.senderId}</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="接收者信息" bordered={false}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <img 
                  src={currentMessage.receiverAvatar} 
                  alt={currentMessage.receiverName} 
                  style={{ width: 48, height: 48, borderRadius: '50%', marginRight: 16 }}
                />
                <div>
                  <div style={{ fontWeight: 'bold' }}>{currentMessage.receiverName}</div>
                  <div>ID: {currentMessage.receiverId}</div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        
        <Card title="消息内容" style={{ marginTop: 16 }} bordered={false}>
          <Row gutter={16}>
            <Col span={8}>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 'bold', marginRight: 8 }}>消息ID:</span>
                <span>{currentMessage.id}</span>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 'bold', marginRight: 8 }}>消息类型:</span>
                <span>
                  {
                    currentMessage.type === 1 ? '文本' :
                    currentMessage.type === 2 ? '图片' :
                    currentMessage.type === 3 ? '语音' : '未知'
                  }
                </span>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 'bold', marginRight: 8 }}>发送时间:</span>
                <span>{currentMessage.createdAt}</span>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 'bold', marginRight: 8 }}>状态:</span>
                <Tag color={
                  currentMessage.status === 0 ? 'warning' :
                  currentMessage.status === 1 ? 'success' :
                  'error'
                }>
                  {
                    currentMessage.status === 0 ? '待审核' :
                    currentMessage.status === 1 ? '正常' :
                    '违规'
                  }
                </Tag>
              </div>
            </Col>
            {currentMessage.status === 2 && (
              <>
                <Col span={8}>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ fontWeight: 'bold', marginRight: 8 }}>审核时间:</span>
                    <span>{currentMessage.reviewedAt}</span>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ fontWeight: 'bold', marginRight: 8 }}>审核原因:</span>
                    <span>{currentMessage.reviewReason}</span>
                  </div>
                </Col>
              </>
            )}
          </Row>
          
          <div style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>内容:</div>
            <div 
              style={{ 
                padding: 16, 
                background: '#f5f5f5', 
                borderRadius: 4,
                minHeight: 80,
              }}
            >
              {currentMessage.type === 1 ? (
                <div>{currentMessage.content}</div>
              ) : currentMessage.type === 2 ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: 8 }}>[图片消息]</div>
                  <img 
                    src="https://via.placeholder.com/300x200" 
                    alt="图片消息" 
                    style={{ maxWidth: '100%', maxHeight: 300 }}
                  />
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: 8 }}>[语音消息]</div>
                  <Button icon={<AudioOutlined />}>播放语音</Button>
                </div>
              )}
            </div>
          </div>
        </Card>
        
        {currentMessage.status === 0 && (
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
            <Button 
              type="primary" 
              icon={<CheckCircleOutlined />}
              style={{ marginRight: 16 }}
              onClick={() => {
                setMessageDetailVisible(false);
                handleReviewMessage(currentMessage.id, 1);
              }}
            >
              审核通过
            </Button>
            <Button 
              danger 
              icon={<StopOutlined />}
              onClick={() => {
                setMessageDetailVisible(false);
                handleReviewMessage(currentMessage.id, 2);
              }}
            >
              审核拒绝
            </Button>
          </div>
        )}
      </Modal>
    );
  };

  return (
    <div>
      <h2>消息管理</h2>
      
      {/* 搜索表单 */}
      <StyledCard>
        <Form
          form={form}
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: 16 }}
        >
          <Form.Item name="keyword" label="关键词">
            <Input placeholder="消息内容" allowClear />
          </Form.Item>
          
          <Form.Item name="senderId" label="发送者ID">
            <Input placeholder="发送者ID" allowClear />
          </Form.Item>
          
          <Form.Item name="receiverId" label="接收者ID">
            <Input placeholder="接收者ID" allowClear />
          </Form.Item>
          
          <Form.Item name="type" label="消息类型">
            <Select placeholder="请选择" allowClear style={{ width: 120 }}>
              <Option value={1}>文本</Option>
              <Option value={2}>图片</Option>
              <Option value={3}>语音</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择" allowClear style={{ width: 120 }}>
              <Option value={0}>待审核</Option>
              <Option value={1}>正常</Option>
              <Option value={2}>违规</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="dateRange" label="发送时间">
            <RangePicker />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              搜索
            </Button>
          </Form.Item>
          
          <Form.Item>
            <Button onClick={handleReset}>重置</Button>
          </Form.Item>
        </Form>
      </StyledCard>
      
      {/* 消息列表 */}
      <Card
        title="消息列表"
        extra={
          <Space>
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />} 
              disabled={selectedRowKeys.length === 0}
              onClick={handleBatchDelete}
            >
              批量删除
            </Button>
            <Button 
              type="primary" 
              icon={<ExportOutlined />}
              onClick={handleExport}
            >
              导出数据
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
          dataSource={messages}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />
      </Card>
      
      {/* 消息详情模态框 */}
      {renderMessageDetail()}
    </div>
  );
};

export default MessageList;