import React, { useState, useEffect } from 'react';
import {
  Table, Card, Button, Space, Input,
  Form, Select, Tag, Modal, message,
  Tooltip, Upload, Image
} from 'antd';
import {
  FileOutlined, DeleteOutlined, DownloadOutlined,
  SearchOutlined, UploadOutlined, ReloadOutlined,
  FileImageOutlined, FileWordOutlined, FilePdfOutlined,
  FileExcelOutlined, FileZipOutlined
} from '@ant-design/icons';
import styled from 'styled-components';

const { Option } = Select;

const StyledCard = styled(Card)`
  margin-bottom: 20px;
`;

const FileList = () => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
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

  // 获取文件列表
  const fetchFiles = async (params = {}) => {
    setLoading(true);
    try {
      const { current, pageSize, type, status, keyword } = params;
      const response = await fetch(`/api/manage/file/list?pageNum=${current}&pageSize=${pageSize}${type ? `&type=${type}` : ''}${status !== undefined ? `&status=${status}` : ''}${keyword ? `&keyword=${keyword}` : ''}`);
      const data = await response.json();

      if (data.code === 200) {
        setFiles(data.data.records);
        setPagination({
          ...pagination,
          current: data.data.current,
          pageSize: data.data.size,
          total: data.data.total,
        });
      } else {
        message.error(data.message || '获取文件列表失败');
      }
    } catch (error) {
      message.error('获取文件列表失败');
      console.error('获取文件列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 首次加载获取数据
  useEffect(() => {
    fetchFiles({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  }, []);

  // 处理表格变化
  const handleTableChange = (newPagination, filters, sorter) => {
    fetchFiles({
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
    fetchFiles({
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
    fetchFiles({
      current: 1,
      pageSize: pagination.pageSize,
    });
  };

  // 处理删除
  const handleDelete = (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个文件吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await fetch(`/api/manage/file/delete/${id}`, {
            method: 'POST'
          });
          const data = await response.json();
          
          if (data.code === 200) {
            message.success('删除成功');
            fetchFiles({
              current: pagination.current,
              pageSize: pagination.pageSize,
            });
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

  // 处理批量删除
  const handleBatchDelete = () => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除这 ${selectedRowKeys.length} 个文件吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await fetch('/api/manage/file/batchDelete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(selectedRowKeys)
          });
          const data = await response.json();
          
          if (data.code === 200) {
            message.success('批量删除成功');
            setSelectedRowKeys([]);
            fetchFiles({
              current: pagination.current,
              pageSize: pagination.pageSize,
            });
          } else {
            message.error(data.message || '批量删除失败');
          }
        } catch (error) {
          message.error('批量删除失败');
          console.error('批量删除失败:', error);
        }
      },
    });
  };

  // 处理下载
  const handleDownload = (record) => {
    window.open(record.url, '_blank');
  };

  // 处理上传
  const handleUpload = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`);
      fetchFiles({
        current: 1,
        pageSize: pagination.pageSize,
      });
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  };

  // 获取文件图标
  const getFileIcon = (type) => {
    const iconMap = {
      image: <FileImageOutlined />,
      document: <FileWordOutlined />,
      pdf: <FilePdfOutlined />,
      spreadsheet: <FileExcelOutlined />,
      archive: <FileZipOutlined />,
    };
    return iconMap[type] || <FileOutlined />;
  };

  // 格式化文件大小
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // 表格列配置
  const columns = [
    {
      title: '文件名',
      dataIndex: 'filename',
      width: 300,
      fixed: 'left',
      render: (text, record) => (
        <Space>
          {getFileIcon(record.type)}
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '预览',
      dataIndex: 'url',
      width: 120,
      render: (url, record) => (
        record.type === 'image' ? (
          <Image
            src={url}
            alt={record.filename}
            style={{ width: 50, height: 50, objectFit: 'cover' }}
            fallback="https://via.placeholder.com/50x50?text=加载失败"
          />
        ) : (
          <FileOutlined style={{ fontSize: 24 }} />
        )
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 120,
      render: (type) => {
        const typeMap = {
          image: '图片',
          video: '视频',
          document: '文档',
          pdf: 'PDF',
          spreadsheet: '表格',
          archive: '压缩包'
        };
        return typeMap[type] || type;
      }
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      width: 180,
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status ? 'success' : 'error'}>
          {status ? '正常' : '已删除'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="下载">
            <Button
              type="link"
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record)}
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
              placeholder="文件名"
              prefix={<SearchOutlined />}
              allowClear
            />
          </Form.Item>
          <Form.Item name="type">
            <Select placeholder="文件类型" allowClear style={{ width: 120 }}>
              <Option value="image">图片</Option>
              <Option value="document">文档</Option>
              <Option value="pdf">PDF</Option>
              <Option value="spreadsheet">表格</Option>
              <Option value="archive">压缩包</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status">
            <Select placeholder="状态" allowClear style={{ width: 120 }}>
              <Option value={true}>正常</Option>
              <Option value={false}>已删除</Option>
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
          <Upload
            showUploadList={false}
            customRequest={({ onSuccess }) => setTimeout(() => onSuccess('ok'), 0)}
            onChange={handleUpload}
          >
            <Button type="primary" icon={<UploadOutlined />}>
              上传文件
            </Button>
          </Upload>
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
          dataSource={files}
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

export default FileList; 