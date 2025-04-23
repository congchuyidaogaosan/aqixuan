import request from '../utils/request';

// 获取活动列表
export function getActivityList(params) {
  return request({
    url: '/manage/activity/list',
    method: 'get',
    params
  });
}

// 获取活动详情
export function getActivityDetail(id) {
  return request({
    url: `/manage/activity/detail/${id}`,
    method: 'get'
  });
}

// 获取活动参与者列表
export function getActivityParticipants(activityId, pageNum, pageSize) {
  return request({
    url: `/manage/activity/participants/${activityId}`,
    method: 'get',
    params: {
      pageNum,
      pageSize
    }
  });
}

// 删除活动
export function deleteActivity(id) {
  return request({
    url: `/manage/activity/delete/${id}`,
    method: 'post'
  });
}

// 批量删除活动
export function batchDeleteActivities(ids) {
  return request({
    url: '/manage/activity/batchDelete',
    method: 'post',
    data: ids
  });
} 