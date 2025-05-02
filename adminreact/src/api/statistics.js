import request from '../utils/request';

// 获取总数统计
export function getTotalStats() {
  return request({
    url: '/manage/statistics/total-stats',
    method: 'get'
  });
}

// 获取概览数据
export function getStatisticsOverview() {
  return request({
    url: '/manage/statistics/overview',
    method: 'get'
  });
}

// 获取趋势数据
export function getStatisticsTrends(startDate, endDate) {
  return request({
    url: '/manage/statistics/trends',
    method: 'get',
    params: startDate && endDate ? { startDate, endDate } : {}
  });
}

// 获取活动类型统计
export function getActivityTypes() {
  return request({
    url: '/manage/statistics/activity-types',
    method: 'get'
  });
}

// 获取报名统计
export function getSignupStats() {
  return request({
    url: '/manage/statistics/signup-stats',
    method: 'get'
  });
}

// 获取活动费用分布
export function getActivityCostDistribution() {
  return request({
    url: '/manage/statistics/activity-cost',
    method: 'get'
  });
}

// 获取用户活跃度热力图数据
export function getUserActivityHeatmap() {
  return request({
    url: '/manage/statistics/user-activity-heatmap',
    method: 'get'
  });
}

// 获取活动地点热力图数据
export function getActivityLocationHeatmap() {
  return request({
    url: '/manage/statistics/activity-location-heatmap',
    method: 'get'
  });
}

