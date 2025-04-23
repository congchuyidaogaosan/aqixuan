// src/routes/index.js
import React, { lazy, Suspense } from 'react';
import { Spin } from 'antd';

// 加载中组件
const LoadingComponent = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
    <Spin size="large" tip="加载中..." />
  </div>
);

// 错误边界组件
const ErrorBoundary = () => {
  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px'
    }}>
      <h2>页面加载出错</h2>
      <p>抱歉，页面加载过程中出现了错误。</p>
      <button onClick={() => window.location.reload()} style={{
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#1890ff',
        color: 'white',
        cursor: 'pointer'
      }}>
        重新加载
      </button>
    </div>
  );
};

// 创建懒加载组件
const createLazyComponent = (importFn) => {
  const LazyComponent = lazy(importFn);
  return function WrappedLazyComponent(props) {
    return (
      <Suspense fallback={<LoadingComponent />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
};

// 懒加载组件
const MainLayout = createLazyComponent(() => import('../layouts/MainLayout'));
const Dashboard = createLazyComponent(() => import('../pages/Dashboard'));
const Login = createLazyComponent(() => import('../pages/Login'));
const UserList = createLazyComponent(() => import('../pages/User/UserList'));
const UserDetail = createLazyComponent(() => import('../pages/User/UserDetail'));
const MessageList = createLazyComponent(() => import('../pages/Message/MessageList'));
const MessageStatistics = createLazyComponent(() => import('../pages/Message/MessageStatistics'));
const PostList = createLazyComponent(() => import('../pages/Post/PostList'));
const PostDetail = createLazyComponent(() => import('../pages/Post/PostDetail'));
const ActivityList = createLazyComponent(() => import('../pages/Activity/ActivityList'));
const ActivityCreate = createLazyComponent(() => import('../pages/Activity/ActivityCreate'));
const ActivityDetail = createLazyComponent(() => import('../pages/Activity/ActivityDetail'));
const FileList = createLazyComponent(() => import('../pages/File/FileList'));
const FileStatistics = createLazyComponent(() => import('../pages/File/FileStatistics'));
const SystemSettings = createLazyComponent(() => import('../pages/System/Settings'));
const SensitiveWords = createLazyComponent(() => import('../pages/System/SensitiveWords'));
const Statistics = createLazyComponent(() => import('../pages/Statistics'));
const SecurityLog = createLazyComponent(() => import('../pages/Security/SecurityLog'));
const OperationLog = createLazyComponent(() => import('../pages/Security/OperationLog'));
const AnnouncementList = createLazyComponent(() => import('../pages/Announcement/AnnouncementList'));
const AnnouncementCreate = createLazyComponent(() => import('../pages/Announcement/AnnouncementCreate'));
const AdminList = createLazyComponent(() => import('../pages/Admin/AdminList'));
const RoleList = createLazyComponent(() => import('../pages/Admin/RoleList'));

// 路由配置
const routes = [
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: 'user',
        children: [
          { 
            path: '', 
            element: <UserList />,
            errorElement: <ErrorBoundary />,
          },
          { 
            path: ':id', 
            element: <UserDetail />,
            errorElement: <ErrorBoundary />,
          },
        ],
      },
      {
        path: 'message',
        children: [
          { 
            path: '', 
            element: <MessageList />,
            errorElement: <ErrorBoundary />,
          },
          { 
            path: 'statistics', 
            element: <MessageStatistics />,
            errorElement: <ErrorBoundary />,
          },
        ],
      },
      {
        path: 'post',
        children: [
          { 
            path: '', 
            element: <PostList />,
            errorElement: <ErrorBoundary />,
          },
          { 
            path: ':id', 
            element: <PostDetail />,
            errorElement: <ErrorBoundary />,
          },
        ],
      },
      {
        path: 'activity',
        children: [
          { 
            path: '', 
            element: <ActivityList />,
            errorElement: <ErrorBoundary />,
          },
          { 
            path: 'create', 
            element: <ActivityCreate />,
            errorElement: <ErrorBoundary />,
          },
          { 
            path: 'detail/:id', 
            element: <ActivityDetail />,
            errorElement: <ErrorBoundary />,
          },
          { 
            path: 'edit/:id', 
            element: <ActivityCreate />,
            errorElement: <ErrorBoundary />,
          },
        ],
      },
      {
        path: 'file',
        children: [
          { 
            path: '', 
            element: <FileList />,
            errorElement: <ErrorBoundary />,
          },
          { 
            path: 'statistics', 
            element: <FileStatistics />,
            errorElement: <ErrorBoundary />,
          },
        ],
      },
      {
        path: 'system',
        children: [
          { 
            path: 'settings', 
            element: <SystemSettings />,
            errorElement: <ErrorBoundary />,
          },
          { 
            path: 'sensitive-words', 
            element: <SensitiveWords />,
            errorElement: <ErrorBoundary />,
          },
        ],
      },
      {
        path: 'statistics',
        element: <Statistics />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: 'security',
        children: [
          { 
            path: 'login-log', 
            element: <SecurityLog />,
            errorElement: <ErrorBoundary />,
          },
          { 
            path: 'operation-log', 
            element: <OperationLog />,
            errorElement: <ErrorBoundary />,
          },
        ],
      },
      {
        path: 'announcement',
        children: [
          { 
            path: '', 
            element: <AnnouncementList />,
            errorElement: <ErrorBoundary />,
          },
          { 
            path: 'create', 
            element: <AnnouncementCreate />,
            errorElement: <ErrorBoundary />,
          },
          { 
            path: 'edit/:id', 
            element: <AnnouncementCreate />,
            errorElement: <ErrorBoundary />,
          },
        ],
      },
      {
        path: 'admin',
        children: [
          { 
            path: 'list', 
            element: <AdminList />,
            errorElement: <ErrorBoundary />,
          },
          { 
            path: 'role', 
            element: <RoleList />,
            errorElement: <ErrorBoundary />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <ErrorBoundary />,
  },
];

export default routes;