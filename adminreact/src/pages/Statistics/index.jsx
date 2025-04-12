import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, Statistic, DatePicker,
  Spin, Empty
} from 'antd';
import {
  UserOutlined, FileOutlined,
  MessageOutlined, EyeOutlined
} from '@ant-design/icons';
import { Line, Column, Pie } from '@ant-design/plots';
import styled from 'styled-components';

const { RangePicker } = DatePicker;

const StyledCard = styled(Card)`
  margin-bottom: 20px;
`;

const Statistics = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([]);
  const [overview, setOverview] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    totalViews: 0
  });
  const [trendsData, setTrendsData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [sourceData, setSourceData] = useState([]);

  // 获取统计数据
  const fetchStatistics = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockOverview = {
        totalUsers: 12345,
        totalPosts: 5678,
        totalComments: 9012,
        totalViews: 345678
      };

      const mockTrends = Array.from({ length: 30 }, (_, i) => ({
        date: `2024-${String(i + 1).padStart(2, '0')}-01`,
        users: Math.floor(Math.random() * 100),
        posts: Math.floor(Math.random() * 50),
        comments: Math.floor(Math.random() * 200)
      }));

      // 转换数据格式以适应折线图要求
      const formattedTrends = mockTrends.reduce((acc, item) => {
        return acc.concat([
          { date: item.date, type: '用户数', value: item.users },
          { date: item.date, type: '文章数', value: item.posts },
          { date: item.date, type: '评论数', value: item.comments }
        ]);
      }, []);

      const mockCategories = [
        { category: '技术', value: 40 },
        { category: '生活', value: 25 },
        { category: '工作', value: 20 },
        { category: '其他', value: 15 }
      ];

      const mockSources = [
        { source: 'PC端', value: 45 },
        { source: '移动端', value: 35 },
        { source: '小程序', value: 15 },
        { source: 'API', value: 5 }
      ];

      setOverview(mockOverview);
      setTrendsData(formattedTrends);
      setCategoryData(mockCategories);
      setSourceData(mockSources);
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [dateRange]);

  // 趋势图配置
  const trendConfig = {
    data: trendsData,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000
      }
    }
  };

  // 分类图配置
  const categoryConfig = {
    data: categoryData,
    angleField: 'value',
    colorField: 'category',
    radius: 0.8,
    label: {
      offset: '50%',
      style: {
        textAlign: 'center'
      }
    }
  };

  // 来源图配置
  const sourceConfig = {
    data: sourceData,
    xField: 'source',
    yField: 'value',
    label: {
      position: 'top',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6
      }
    }
  };

  return (
    <Spin spinning={loading}>
      <StyledCard>
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col span={24}>
            <RangePicker
              onChange={(dates) => setDateRange(dates)}
              style={{ float: 'right' }}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="总用户数"
              value={overview.totalUsers}
              prefix={<UserOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="总文章数"
              value={overview.totalPosts}
              prefix={<FileOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="总评论数"
              value={overview.totalComments}
              prefix={<MessageOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="总浏览量"
              value={overview.totalViews}
              prefix={<EyeOutlined />}
            />
          </Col>
        </Row>
      </StyledCard>

      <Row gutter={16}>
        <Col span={24}>
          <StyledCard title="趋势统计">
            {trendsData.length > 0 ? (
              <Line {...trendConfig} />
            ) : (
              <Empty />
            )}
          </StyledCard>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <StyledCard title="分类统计">
            {categoryData.length > 0 ? (
              <Pie {...categoryConfig} />
            ) : (
              <Empty />
            )}
          </StyledCard>
        </Col>
        <Col span={12}>
          <StyledCard title="来源统计">
            {sourceData.length > 0 ? (
              <Column {...sourceConfig} />
            ) : (
              <Empty />
            )}
          </StyledCard>
        </Col>
      </Row>
    </Spin>
  );
};

export default Statistics; 