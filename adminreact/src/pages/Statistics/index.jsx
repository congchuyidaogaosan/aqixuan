import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, Statistic, DatePicker,
  Spin, Empty, message
} from 'antd';
import {
  UserOutlined, FileOutlined,
  MessageOutlined, TeamOutlined
} from '@ant-design/icons';
import { Line, Column, Pie } from '@ant-design/plots';
import styled from 'styled-components';
import moment from 'moment';
import {
  getStatisticsOverview,
  getStatisticsTrends,
  getActivityTypes,
  getSignupStats
} from '../../api/statistics';

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
    totalActivities: 0,
    newUsers: 0,
    newPosts: 0,
    newActivities: 0
  });
  const [trendsData, setTrendsData] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [signupStats, setSignupStats] = useState([]);

  // 获取概览数据
  const fetchOverview = async () => {
    try {
      const response = await getStatisticsOverview();
      if (response.code === 200) {
        setOverview(response.data);
      } else {
        message.error(response.message || '获取概览数据失败');
      }
    } catch (error) {
      console.error('获取概览数据失败:', error);
      message.error('获取概览数据失败');
    }
  };

  // 获取趋势数据
  const fetchTrends = async () => {
    try {
      let startDate, endDate;
      if (dateRange.length === 2) {
        startDate = moment(dateRange[0]).format('YYYY-MM-DD');
        endDate = moment(dateRange[1]).format('YYYY-MM-DD');
      }

      const response = await getStatisticsTrends(startDate, endDate);
      if (response.code === 200) {
        // 转换数据格式以适应折线图要求
        const formattedTrends = response.data.trends.reduce((acc, item) => {
          return acc.concat([
            { date: item.date, type: '用户数', value: item.users },
            { date: item.date, type: '动态数', value: item.posts },
            { date: item.date, type: '活动数', value: item.activities }
          ]);
        }, []);
        setTrendsData(formattedTrends);
      } else {
        message.error(response.message || '获取趋势数据失败');
      }
    } catch (error) {
      console.error('获取趋势数据失败:', error);
      message.error('获取趋势数据失败');
    }
  };

  // 获取活动类型统计
  const fetchActivityTypes = async () => {
    try {
      const response = await getActivityTypes();
      if (response.code === 200) {
        setActivityTypes(response.data.types);
      } else {
        message.error(response.message || '获取活动类型统计失败');
      }
    } catch (error) {
      console.error('获取活动类型统计失败:', error);
      message.error('获取活动类型统计失败');
    }
  };

  // 获取报名统计
  const fetchSignupStats = async () => {
    try {
      const response = await getSignupStats();
      if (response.code === 200) {
        setSignupStats(response.data.signups);
      } else {
        message.error(response.message || '获取报名统计失败');
      }
    } catch (error) {
      console.error('获取报名统计失败:', error);
      message.error('获取报名统计失败');
    }
  };

  // 获取所有统计数据
  const fetchAllStats = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchOverview(),
        fetchTrends(),
        fetchActivityTypes(),
        fetchSignupStats()
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStats();
  }, []);

  useEffect(() => {
    fetchTrends();
  }, [dateRange]);

  // 趋势图配置
  const trendConfig = {
    data: trendsData,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    animation: false,
    legend: {
      position: 'top'
    },
    xAxis: {
      label: {
        autoRotate: true,
        autoHide: false
      }
    }
  };

  // 活动类型图配置
  const typeConfig = {
    data: activityTypes,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    animation: false,
    label: {
      text: (item) => `${item.type}: ${item.value}`,
      position: 'outside'
    },
    legend: {
      position: 'bottom'
    },
    interactions: [
      {
        type: 'element-active'
      }
    ]
  };

  // 报名状态图配置
  const signupConfig = {
    data: signupStats,
    xField: 'status',
    yField: 'value',
    animation: false,
    label: {
      text: (item) => item.value,
    },
    color: '#1890ff',
    style: {
      fillOpacity: 0.85
    },
    state: {
      active: {
        style: {
          fillOpacity: 0.95
        }
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
              title="今日新增用户"
              value={overview.newUsers || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
              suffix="人"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="今日新增动态"
              value={overview.newPosts || 0}
              prefix={<FileOutlined />}
              valueStyle={{ color: '#cf1322' }}
              suffix="条"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="今日新增活动"
              value={overview.newActivities || 0}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix="个"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="活动参与率"
              value={overview.newActivities > 0 ? Math.round((overview.newUsers / overview.newActivities) * 100) : 0}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#722ed1' }}
              suffix="%"
            />
          </Col>
        </Row>
      </StyledCard>

      <Row gutter={16}>
        <Col span={24}>
          <StyledCard title="数据趋势">
            {trendsData && trendsData.length > 0 ? (
              <Line {...trendConfig} />
            ) : (
              <Empty description="暂无趋势数据" />
            )}
          </StyledCard>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <StyledCard title="活动类型分布">
            {activityTypes && activityTypes.length > 0 ? (
              <Pie {...typeConfig} />
            ) : (
              <Empty description="暂无活动类型数据" />
            )}
          </StyledCard>
        </Col>
        <Col span={12}>
          <StyledCard title="活动报名状态">
            {signupStats && signupStats.length > 0 ? (
              <Column {...signupConfig} />
            ) : (
              <Empty description="暂无报名数据" />
            )}
          </StyledCard>
        </Col>
      </Row>
    </Spin>
  );
};

export default Statistics; 