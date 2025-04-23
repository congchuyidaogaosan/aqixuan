import request from '../utils/request';

// 获取动态列表
export function getMomentList(params) {
  return request({
    url: '/manage/moment/list',
    method: 'get',
    params
  });
}

// 删除动态
export function deleteMoment(id) {
  return request({
    url: `/manage/moment/delete/${id}`,
    method: 'post'
  });
}

// 批量删除动态
export function batchDeleteMoments(ids) {
  return request({
    url: '/manage/moment/batchDelete',
    method: 'post',
    data: ids
  });
}

// 获取动态评论列表
export function getMomentComments(momentId) {
  return request({
    url: `/manage/moment/comments/${momentId}`,
    method: 'get'
  });
}

// 删除评论
export function deleteComment(id) {
  return request({
    url: `/manage/moment/comment/delete/${id}`,
    method: 'post'
  });
} 