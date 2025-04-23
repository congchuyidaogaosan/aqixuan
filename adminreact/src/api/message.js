// src/api/message.js
import request from '../utils/request';

// 获取消息列表
export function getMessageList(params) {
  return request({
    url: '/manage/message/list',
    method: 'get',
    params
  });
}

// 获取消息列表（包含用户信息）
export function getMessageListWithUserInfo(params) {
  return request({
    url: '/manage/message/listWithUser',
    method: 'get',
    params
  });
}

// 获取消息详情
export function getMessageDetail(id) {
  return request({
    url: `/manage/message/detail/${id}`,
    method: 'get'
  });
}

// 删除消息
export function deleteMessage(id) {
  return request({
    url: `/manage/message/delete/${id}`,
    method: 'post'
  });
}

// 批量删除消息
export function batchDeleteMessages(ids) {
  return request({
    url: '/manage/message/batchDelete',
    method: 'post',
    data: ids
  });
}

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