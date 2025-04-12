// src/pages/Dashboard/index.js
import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
  UserOutlined,
  MessageOutlined,
  FileImageOutlined,
  CalendarOutlined,
} from '@ant-design/icons';

const Dashboard = () => {
  return (
    <div>
      <h2>系统概览</h2>
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="用户总数"
              value={1200}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="消息总数"
              value={8846}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="动态总数"
              value={563}
              prefix={<FileImageOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活动总数"
              value={25}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
      </Row>
      <div style={{ marginTop: 24 }}>
        <Card title="系统信息">
          <p>欢迎使用爱奇轩管理系统！</p>
          <p>这里是系统仪表盘，您可以看到系统的关键指标和最新动态。</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;