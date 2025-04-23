// src/pages/Dashboard/index.js
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Spin, message } from 'antd';
import {
  UserOutlined,
  MessageOutlined,
  FileImageOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { getTotalStats } from '../../api/statistics';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMessages: 0,
    totalPosts: 0,
    totalActivities: 0
  });

  useEffect(() => {
    fetchTotalStats();
  }, []);

  const fetchTotalStats = async () => {
    try {
      const response = await getTotalStats();
      if (response.code === 200) {
        setStats(response.data);
      } else {
        message.error(response.message || '获取统计数据失败');
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
      message.error('获取统计数据失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <div>
        <h2>系统概览</h2>
        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="用户总数"
                value={stats.totalUsers}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#3f8600' }}
                suffix="人"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="消息总数"
                value={stats.totalMessages}
                prefix={<MessageOutlined />}
                valueStyle={{ color: '#cf1322' }}
                suffix="条"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="动态总数"
                value={stats.totalPosts}
                prefix={<FileImageOutlined />}
                valueStyle={{ color: '#1890ff' }}
                suffix="条"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="活动总数"
                value={stats.totalActivities}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#722ed1' }}
                suffix="个"
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card title="系统信息">
              <p>欢迎使用雅趣轩管理系统！</p>
              <p>这里是系统仪表盘，您可以看到系统的关键指标。</p>
              <p>系统数据概览：</p>
              <ul>
                <li>用户总数：{stats.totalUsers} 人</li>
                <li>消息总数：{stats.totalMessages} 条</li>
                <li>动态总数：{stats.totalPosts} 条</li>
                <li>活动总数：{stats.totalActivities} 个</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </div>
    </Spin>
  );
};

export default Dashboard;