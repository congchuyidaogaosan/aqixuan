import request from '../utils/request';

// 获取概览数据
export function getStatisticsOverview() {
  return request({
    url: '/api/manage/statistics/overview',
    method: 'get'
  });
}

// 获取趋势数据
export function getStatisticsTrends(startDate, endDate) {
  return request({
    url: '/api/manage/statistics/trends',
    method: 'get',
    params: startDate && endDate ? { startDate, endDate } : {}
  });
}

// 获取活动类型统计
export function getActivityTypes() {
  return request({
    url: '/api/manage/statistics/activity-types',
    method: 'get'
  });
}

// 获取报名统计
export function getSignupStats() {
  return request({
    url: '/api/manage/statistics/signup-stats',
    method: 'get'
  });
}

