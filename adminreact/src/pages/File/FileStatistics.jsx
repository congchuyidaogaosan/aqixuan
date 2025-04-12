import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, Statistic, DatePicker,
  Table, Progress, Space, Typography
} from 'antd';
import {
  FileOutlined, CloudUploadOutlined, DownloadOutlined,
  UserOutlined, FileImageOutlined, FileWordOutlined,
  FilePdfOutlined, FileExcelOutlined, FileZipOutlined
} from '@ant-design/icons';
import moment from 'moment';
import styled from 'styled-components';
import { Line, Pie } from '@ant-design/plots';

const { RangePicker } = DatePicker;
const { Title } = Typography;

const StyledCard = styled(Card)`
  margin-bottom: 20px;
`;

const ChartCard = styled(Card)`
  margin-bottom: 20px;
  .ant-card-head-title {
    font-size: 16px;
  }
`;

const FileStatistics = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([moment().subtract(7, 'days'), moment()]);
  const [statistics, setStatistics] = useState({
    totalFiles: 0,
    totalSize: 0,
    totalDownloads: 0,
    activeUsers: 0,
  });
  const [typeDistribution, setTypeDistribution] = useState([]);
  const [dailyStats, setDailyStats] = useState([]);
  const [topFiles, setTopFiles] = useState([]);

  // 获取统计数据
  const fetchStatistics = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockStatistics = {
        totalFiles: Math.floor(Math.random() * 10000),
        totalSize: Math.floor(Math.random() * 1000000000),
        totalDownloads: Math.floor(Math.random() * 50000),
        activeUsers: Math.floor(Math.random() * 1000),
      };

      const mockTypeDistribution = [
        { type: '图片', value: Math.floor(Math.random() * 1000) },
        { type: '文档', value: Math.floor(Math.random() * 1000) },
        { type: 'PDF', value: Math.floor(Math.random() * 1000) },
        { type: '表格', value: Math.floor(Math.random() * 1000) },
        { type: '压缩包', value: Math.floor(Math.random() * 1000) },
      ];

      const mockDailyStats = Array.from({ length: 7 }, (_, index) => ({
        date: moment().subtract(6 - index, 'days').format('YYYY-MM-DD'),
        uploads: Math.floor(Math.random() * 100),
        downloads: Math.floor(Math.random() * 200),
      }));

      const mockTopFiles = Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        filename: `热门文件${index + 1}.${['jpg', 'doc', 'pdf', 'xlsx', 'zip'][Math.floor(Math.random() * 5)]}`,
        downloads: Math.floor(Math.random() * 1000),
        size: Math.floor(Math.random() * 10000000),
        uploadTime: moment().subtract(Math.floor(Math.random() * 30), 'days').format('YYYY-MM-DD HH:mm:ss'),
      }));

      setStatistics(mockStatistics);
      setTypeDistribution(mockTypeDistribution);
      setDailyStats(mockDailyStats);
      setTopFiles(mockTopFiles);
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [dateRange]);

  // 格式化文件大小
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // 文件类型图表配置
  const typeConfig = {
    data: typeDistribution,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
    },
    interactions: [{ type: 'element-active' }],
  };

  // 每日统计图表配置
  const dailyConfig = {
    data: dailyStats,
    xField: 'date',
    yField: 'value',
    seriesField: 'category',
    yAxis: {
      label: {
        formatter: (v) => `${v}`,
      },
    },
    legend: {
      position: 'top',
    },
  };

  // 热门文件表格列配置
  const columns = [
    {
      title: '排名',
      dataIndex: 'id',
      width: 80,
      render: (id) => `#${id}`,
    },
    {
      title: '文件名',
      dataIndex: 'filename',
    },
    {
      title: '下载次数',
      dataIndex: 'downloads',
      sorter: (a, b) => a.downloads - b.downloads,
    },
    {
      title: '文件大小',
      dataIndex: 'size',
      render: (size) => formatFileSize(size),
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
    },
  ];

  // 处理日期范围变化
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  // 准备每日统计数据
  const dailyStatsData = dailyStats.reduce((acc, curr) => {
    acc.push(
      { date: curr.date, value: curr.uploads, category: '上传数' },
      { date: curr.date, value: curr.downloads, category: '下载数' }
    );
    return acc;
  }, []);

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <StyledCard>
            <Space style={{ marginBottom: 16 }}>
              <RangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                allowClear={false}
              />
            </Space>
          </StyledCard>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <StyledCard>
            <Statistic
              title="总文件数"
              value={statistics.totalFiles}
              prefix={<FileOutlined />}
              loading={loading}
            />
          </StyledCard>
        </Col>
        <Col span={6}>
          <StyledCard>
            <Statistic
              title="总存储空间"
              value={formatFileSize(statistics.totalSize)}
              prefix={<CloudUploadOutlined />}
              loading={loading}
            />
          </StyledCard>
        </Col>
        <Col span={6}>
          <StyledCard>
            <Statistic
              title="总下载次数"
              value={statistics.totalDownloads}
              prefix={<DownloadOutlined />}
              loading={loading}
            />
          </StyledCard>
        </Col>
        <Col span={6}>
          <StyledCard>
            <Statistic
              title="活跃用户数"
              value={statistics.activeUsers}
              prefix={<UserOutlined />}
              loading={loading}
            />
          </StyledCard>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <ChartCard title="文件类型分布">
            <Pie {...typeConfig} />
          </ChartCard>
        </Col>
        <Col span={12}>
          <ChartCard title="每日上传/下载统计">
            <Line {...dailyConfig} data={dailyStatsData} />
          </ChartCard>
        </Col>
      </Row>

      <ChartCard title="热门文件排行">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={topFiles}
          pagination={false}
          loading={loading}
        />
      </ChartCard>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <ChartCard title="存储空间使用情况">
            <Row gutter={[16, 16]}>
              {typeDistribution.map((item, index) => (
                <Col span={8} key={item.type}>
                  <Card size="small">
                    <Statistic
                      title={item.type}
                      value={item.value}
                      suffix="个文件"
                    />
                    <Progress
                      percent={Math.round((item.value / statistics.totalFiles) * 100)}
                      status="active"
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </ChartCard>
        </Col>
      </Row>
    </div>
  );
};

export default FileStatistics; 