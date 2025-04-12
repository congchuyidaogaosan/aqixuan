// src/api/message.js
import request from '@/utils/request';

// 获取消息列表
export const getMessageList = (params) => {
  return request.get('/messages', { params });
};

// 获取消息详情
export const getMessageDetail = (id) => {
  return request.get(`/messages/${id}`);
};

// 删除消息
export const deleteMessage = (id) => {
  return request.delete(`/messages/${id}`);
};

// 批量删除消息
export const batchDeleteMessages = (ids) => {
  return request.post('/messages/batch-delete', { ids });
};

// 审核消息
export const reviewMessage = (id, status, reason) => {
  return request.post(`/messages/${id}/review`, { status, reason });
};

// 获取消息统计数据
export const getMessageStatistics = (params) => {
  return request.get('/messages/statistics', { params });
};

// 获取消息趋势数据
export const getMessageTrend = (params) => {
  return request.get('/messages/trend', { params });
};

// 获取活跃用户排行
export const getActiveUsers = (params) => {
  return request.get('/messages/active-users', { params });
};

// 导出消息数据
export const exportMessages = (params) => {
  return request.get('/messages/export', { 
    params,
    responseType: 'blob'
  });
};