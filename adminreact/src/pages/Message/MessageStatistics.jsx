// src/pages/Message/MessageStatistics.js
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, DatePicker, Radio, Spin, Table, Statistic } from 'antd';
import { 
  MessageOutlined, 
  RiseOutlined, 
  UserOutlined, 
  ClockCircleOutlined, 
  WarningOutlined 
} from '@ant-design/icons';
import moment from 'moment';
import styled from 'styled-components';

// 由于没有安装@ant-design/charts，我们使用模拟图表
// 实际项目中需要安装：npm install @ant-design/charts
const MockChart = ({ data, title, type }) => (
  <div style={{ height: '100%', padding: '20px' }}>
    <h3>{title}</h3>
    <div style={{ 
      height: '250px', 
      backgroundColor: '#f5f5f5', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      borderRadius: '4px'
    }}>
      {type} 图表 - 请安装 @ant-design/charts
    </div>
    <div style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
      注: 此为模拟图表，实际项目中需安装图表库
    </div>
  </div>
);

// 导入API
// import { getMessageStatistics, getMessageTrend, getActiveUsers } from '../../api/message';

const { RangePicker } = DatePicker;
const { Option } = Select;

const StyledCard = styled(Card)`
  margin-bottom: 20px;
`;

const ChartCard = styled(Card)`
  margin-bottom: 20px;
  height: 380px;
`;

const SelectWrapper = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MessageStatistics = () => {
  const [loading, setLoading] = useState(false);
  const [statisticsData, setStatisticsData] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [timeRange, setTimeRange] = useState([moment().subtract(30, 'days'), moment()]);
  const [timeType, setTimeType] = useState('day');
  const [chartType, setChartType] = useState('msg_count');

  // 获取统计数据
  const fetchStatisticsData = async () => {
    setLoading(true);
    try {
      // 在实际项目中，这里会调用API获取数据
      // const response = await getMessageStatistics({
      //   startTime: timeRange[0].format('YYYY-MM-DD'),
      //   endTime: timeRange[1].format('YYYY-MM-DD'),
      // });
      
      // 使用模拟数据
      const mockData = {
        totalCount: 12546,
        todayCount: 356,
        pendingReviewCount: 28,
        violationCount: 187,
        typeDistribution: [
          { type: 1, name: '文本', value: 8765 },
          { type: 2, name: '图片', value: 2890 },
          { type: 3, name: '语音', value: 891 },
        ],
        statusDistribution: [
          { status: 1, name: '正常', value: 12331 },
          { status: 0, name: '待审核', value: 28 },
          { status: 2, name: '违规', value: 187 },
        ],
        hourDistribution: Array(24).fill().map((_, index) => ({
          hour: index,
          count: Math.floor(Math.random() * 200) + 50,
        })),
      };
      
      setStatisticsData(mockData);
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取趋势数据
  const fetchTrendData = async () => {
    setLoading(true);
    try {
      // 在实际项目中，这里会调用API获取数据
      // const response = await getMessageTrend({
      //   startTime: timeRange[0].format('YYYY-MM-DD'),
      //   endTime: timeRange[1].format('YYYY-MM-DD'),
      //   type: timeType,
      // });
      
      // 使用模拟数据
      const days = timeType === 'day' 
        ? Math.ceil(moment(timeRange[1]).diff(moment(timeRange[0]), 'days')) 
        : (timeType === 'week' ? Math.ceil(moment(timeRange[1]).diff(moment(timeRange[0]), 'weeks')) : Math.ceil(moment(timeRange[1]).diff(moment(timeRange[0]), 'months')));
      
      const mockData = Array(days).fill().map((_, index) => {
        let date;
        if (timeType === 'day') {
          date = moment(timeRange[0]).add(index, 'days').format('YYYY-MM-DD');
        } else if (timeType === 'week') {
          date = `第${index + 1}周`;
        } else {
          date = moment(timeRange[0]).add(index, 'months').format('YYYY-MM');
        }
        
        return {
          date,
          msg_count: Math.floor(Math.random() * 500) + 100,
          user_count: Math.floor(Math.random() * 200) + 50,
          review_count: Math.floor(Math.random() * 50) + 10,
        };
      });
      
      setTrendData(mockData);
    } catch (error) {
      console.error('获取趋势数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取活跃用户数据
  const fetchActiveUsers = async () => {
    setLoading(true);
    try {
      // 在实际项目中，这里会调用API获取数据
      // const response = await getActiveUsers({
      //   startTime: timeRange[0].format('YYYY-MM-DD'),
      //   endTime: timeRange[1].format('YYYY-MM-DD'),
      // });
      
      // 使用模拟数据
      const mockData = Array(10).fill().map((_, index) => ({
        id: index + 1,
        userId: 1000 + index,
        username: `user${1000 + index}`,
        nickname: `用户${1000 + index}`,
        avatar: `https://randomuser.me/api/portraits/${index % 2 ? 'women' : 'men'}/${index + 1}.jpg`,
        messageCount: Math.floor(Math.random() * 1000) + 500,
        lastActiveTime: moment().subtract(Math.floor(Math.random() * 24), 'hours').format('YYYY-MM-DD HH:mm:ss'),
      }));
      
      setActiveUsers(mockData);
    } catch (error) {
      console.error('获取活跃用户数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理时间范围变化
  const handleTimeRangeChange = (dates) => {
    setTimeRange(dates);
  };

  // 处理时间类型变化
  const handleTimeTypeChange = (e) => {
    setTimeType(e.target.value);
  };

  // 处理图表类型变化
  const handleChartTypeChange = (value) => {
    setChartType(value);
  };

  // 首次加载获取数据
  useEffect(() => {
    fetchStatisticsData();
    fetchTrendData();
    fetchActiveUsers();
  }, []);

  // 时间范围或类型变化时重新获取趋势数据
  useEffect(() => {
    fetchTrendData();
  }, [timeRange, timeType]);

  // 活跃用户表格列
  const activeUserColumns = [
    {
      title: '排名',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户',
      dataIndex: 'nickname',
      key: 'nickname',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={record.avatar} 
            alt={text} 
            style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 8 }}
          />
          <div>
            <div>{text}</div>
            <div style={{ fontSize: 12, color: '#999' }}>ID: {record.userId}</div>
          </div>
        </div>
      ),
    },
    {
      title: '消息数量',
      dataIndex: 'messageCount',
      key: 'messageCount',
      sorter: (a, b) => a.messageCount - b.messageCount,
    },
    {
      title: '最后活跃时间',
      dataIndex: 'lastActiveTime',
      key: 'lastActiveTime',
    },
  ];

  return (
    <div>
      <h2>消息统计</h2>
      
      {/* 统计卡片 */}
      {statisticsData && (
        <Row gutter={16}>
          <Col span={6}>
            <StyledCard>
              <Statistic 
                title="消息总数" 
                value={statisticsData.totalCount} 
                prefix={<MessageOutlined />} 
              />
            </StyledCard>
          </Col>
          <Col span={6}>
            <StyledCard>
              <Statistic 
                title="今日消息" 
                value={statisticsData.todayCount} 
                prefix={<RiseOutlined />} 
                valueStyle={{ color: '#3f8600' }}
              />
            </StyledCard>
          </Col>
          <Col span={6}>
            <StyledCard>
              <Statistic 
                title="待审核消息" 
                value={statisticsData.pendingReviewCount} 
                prefix={<ClockCircleOutlined />} 
                valueStyle={{ color: '#faad14' }}
              />
            </StyledCard>
          </Col>
          <Col span={6}>
            <StyledCard>
              <Statistic 
                title="违规消息" 
                value={statisticsData.violationCount} 
                prefix={<WarningOutlined />} 
                valueStyle={{ color: '#f5222d' }}
              />
            </StyledCard>
          </Col>
        </Row>
      )}
      
      {/* 趋势图表 */}
      <ChartCard title="消息趋势">
        <SelectWrapper>
          <div>
            <Radio.Group 
              value={timeType} 
              onChange={handleTimeTypeChange}
              style={{ marginRight: 16 }}
            >
              <Radio.Button value="day">日</Radio.Button>
              <Radio.Button value="week">周</Radio.Button>
              <Radio.Button value="month">月</Radio.Button>
            </Radio.Group>
            
            <RangePicker 
              value={timeRange} 
              onChange={handleTimeRangeChange} 
            />
          </div>
          
          <Select 
            value={chartType} 
            onChange={handleChartTypeChange}
            style={{ width: 150 }}
          >
            <Option value="msg_count">消息数量</Option>
            <Option value="user_count">用户数量</Option>
            <Option value="review_count">审核数量</Option>
          </Select>
        </SelectWrapper>
        
        {loading ? (
          <div style={{ height: 250, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Spin />
          </div>
        ) : (
          <MockChart 
            data={trendData} 
            title="消息趋势图表" 
            type="折线图" 
          />
        )}
      </ChartCard>
      
      {/* 分类统计图表 */}
      <Row gutter={16}>
        <Col span={12}>
          <ChartCard title="消息类型分布">
            {loading ? (
              <div style={{ height: 250, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin />
              </div>
            ) : statisticsData && (
              <MockChart 
                data={statisticsData.typeDistribution} 
                title="消息类型分布图表" 
                type="饼图" 
              />
            )}
          </ChartCard>
        </Col>
        
        <Col span={12}>
          <ChartCard title="消息状态分布">
            {loading ? (
              <div style={{ height: 250, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin />
              </div>
            ) : statisticsData && (
              <MockChart 
                data={statisticsData.statusDistribution} 
                title="消息状态分布图表" 
                type="饼图" 
              />
            )}
          </ChartCard>
        </Col>
      </Row>
      
      {/* 高峰时段分析 */}
      <ChartCard title="消息发送高峰时段分析">
        {loading ? (
          <div style={{ height: 250, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Spin />
          </div>
        ) : statisticsData && (
          <MockChart 
            data={statisticsData.hourDistribution} 
            title="24小时消息分布图表" 
            type="柱状图" 
          />
        )}
      </ChartCard>
      
      {/* 活跃用户排行 */}
      <Card title="活跃用户排行">
        <Table
          rowKey="id"
          columns={activeUserColumns}
          dataSource={activeUsers}
          loading={loading}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default MessageStatistics;