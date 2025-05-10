// src/layouts/MainLayout.js
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  MessageOutlined,
  FileOutlined,
  SettingOutlined,
  BarChartOutlined,
  SafetyOutlined,
  NotificationOutlined,
  TeamOutlined,
  PieChartOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileImageOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';

const { Header, Sider, Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledLogo = styled.div`
  height: 64px;
  margin: 0;
  color: white;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledHeader = styled(Header)`
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
`;

const StyledContent = styled(Content)`
  margin: 24px 16px;
  padding: 24px;
  background: #fff;
  min-height: 280px;
  overflow: auto;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const Username = styled.span`
  margin-left: 8px;
  margin-right: 16px;
`;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleLogout = () => {
    // 处理登出逻辑
    navigate('/login');
  };

  const userMenu = [
    {
      key: '1',
      label: '个人信息',
      icon: <UserOutlined />,
    },
    {
      key: '2',
      label: '修改密码',
      icon: <SafetyOutlined />,
    },
    {
      key: '3',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path === '/') return ['/'];
    
    // 匹配一级路径
    const mainPath = '/' + path.split('/')[1];
    return [mainPath];
  };

  return (
    <StyledLayout>
      <Sider trigger={null} collapsible collapsed={collapsed} width={256}>
        <StyledLogo>
          {collapsed ? '缘分配对' : '缘分配对管理系统'}
        </StyledLogo>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          onClick={handleMenuClick}
          items={[
            {
              key: '/',
              icon: <DashboardOutlined />,
              label: '首页',
            },
            {
              key: '/user',
              icon: <UserOutlined />,
              label: '用户管理',
            },
            {
              key: '/message',
              icon: <MessageOutlined />,
              label: '消息管理',
            },
            {
              key: '/post',
              icon: <FileImageOutlined />,
              label: '动态管理',
            },
            {
              key: '/activity',
              icon: <CalendarOutlined />,
              label: '活动管理',
            },
            {
              key: '/file',
              icon: <FileOutlined />,
              label: '文件管理',
            },
            // {
            //   key: '/system',
            //   icon: <SettingOutlined />,
            //   label: '系统设置',
            //   children: [
            //     {
            //       key: '/system/settings',
            //       label: '基本设置',
            //     },
            //     {
            //       key: '/system/sensitive-words',
            //       label: '敏感词设置',
            //     },
            //   ],
            // },
            {
              key: '/statistics',
              icon: <BarChartOutlined />,
              label: '基础统计'
            },
            // {
            //   key: '/security',
            //   icon: <SafetyOutlined />,
            //   label: '安全管理',
            //   children: [
            //     {
            //       key: '/security/login-log',
            //       label: '登录日志',
            //     },
            //     {
            //       key: '/security/operation-log',
            //       label: '操作日志',
            //     },
            //   ],
            // },
            // {
            //   key: '/announcement',
            //   icon: <NotificationOutlined />,
            //   label: '公告管理',
            // },
            // {
            //   key: '/admin',
            //   icon: <TeamOutlined />,
            //   label: '管理员设置',
            //   children: [
            //     {
            //       key: '/admin/list',
            //       label: '管理员列表',
            //     },
            //     {
            //       key: '/admin/role',
            //       label: '角色管理',
            //     },
            //   ],
            // },
          ]}
        />
      </Sider>
      <Layout>
        <StyledHeader>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapsed}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <UserInfo>
            <Dropdown
              menu={{ items: userMenu }}
              placement="bottomRight"
              arrow
            >
              <div style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <Username>管理员</Username>
              </div>
            </Dropdown>
          </UserInfo>
        </StyledHeader>
        <StyledContent>
          <Outlet />
        </StyledContent>
      </Layout>
    </StyledLayout>
  );
};

export default MainLayout;