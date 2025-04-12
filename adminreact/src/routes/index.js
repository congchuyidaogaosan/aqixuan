// src/routes/index.js
import { lazy } from 'react';

// 布局
const MainLayout = lazy(() => import('../layouts/MainLayout'));

// 页面
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Login = lazy(() => import('../pages/Login'));

// 用户管理
const UserList = lazy(() => import('../pages/User/UserList'));
const UserDetail = lazy(() => import('../pages/User/UserDetail'));

// 消息管理
const MessageList = lazy(() => import('../pages/Message/MessageList'));
const MessageStatistics = lazy(() => import('../pages/Message/MessageStatistics'));

// 动态管理
const PostList = lazy(() => import('../pages/Post/PostList'));
const PostDetail = lazy(() => import('../pages/Post/PostDetail'));

// 活动管理
const ActivityList = lazy(() => import('../pages/Activity/ActivityList'));
const ActivityCreate = lazy(() => import('../pages/Activity/ActivityCreate'));
const ActivityDetail = lazy(() => import('../pages/Activity/ActivityDetail'));

// 文件管理
const FileList = lazy(() => import('../pages/File/FileList'));
const FileStatistics = lazy(() => import('../pages/File/FileStatistics'));

// 系统设置
const SystemSettings = lazy(() => import('../pages/System/Settings'));
const SensitiveWords = lazy(() => import('../pages/System/SensitiveWords'));

// 数据统计
const Statistics = lazy(() => import('../pages/Statistics'));

// 安全管理
const SecurityLog = lazy(() => import('../pages/Security/SecurityLog'));
const OperationLog = lazy(() => import('../pages/Security/OperationLog'));

// 公告管理
const AnnouncementList = lazy(() => import('../pages/Announcement/AnnouncementList'));
const AnnouncementCreate = lazy(() => import('../pages/Announcement/AnnouncementCreate'));

// 管理员设置
const AdminList = lazy(() => import('../pages/Admin/AdminList'));
const RoleList = lazy(() => import('../pages/Admin/RoleList'));

// 路由配置
const routes = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: 'user',
        children: [
          { path: '', element: <UserList /> },
          { path: ':id', element: <UserDetail /> },
        ],
      },
      {
        path: 'message',
        children: [
          { path: '', element: <MessageList /> },
          { path: 'statistics', element: <MessageStatistics /> },
        ],
      },
      {
        path: 'post',
        children: [
          { path: '', element: <PostList /> },
          { path: ':id', element: <PostDetail /> },
        ],
      },
      {
        path: 'activity',
        children: [
          { path: '', element: <ActivityList /> },
          { path: 'create', element: <ActivityCreate /> },
          { path: ':id', element: <ActivityDetail /> },
          { path: 'edit/:id', element: <ActivityCreate /> },
        ],
      },
      {
        path: 'file',
        children: [
          { path: '', element: <FileList /> },
          { path: 'statistics', element: <FileStatistics /> },
        ],
      },
      {
        path: 'system',
        children: [
          { path: 'settings', element: <SystemSettings /> },
          { path: 'sensitive-words', element: <SensitiveWords /> },
        ],
      },
      {
        path: 'statistics',
        element: <Statistics />,
      },
      {
        path: 'security',
        children: [
          { path: 'login-log', element: <SecurityLog /> },
          { path: 'operation-log', element: <OperationLog /> },
        ],
      },
      {
        path: 'announcement',
        children: [
          { path: '', element: <AnnouncementList /> },
          { path: 'create', element: <AnnouncementCreate /> },
          { path: 'edit/:id', element: <AnnouncementCreate /> },
        ],
      },
      {
        path: 'admin',
        children: [
          { path: 'list', element: <AdminList /> },
          { path: 'role', element: <RoleList /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <div>404 Not Found</div>,
  },
];

export default routes;