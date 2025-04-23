// 用户相关接口
import request from '../utils/request';
// 获取用户列表
export const getUserList = (params) => {
    return request.get('/manage/user/list', { params });
};
// 获取用户详情
export const getUserDetail = (id) => {
    return request.get(`/manage/user/detail/${id}`);
};
// 创建用户
export const createUser = (data) => {
    return request.post('/manage/user/create', data);
};
// 更新用户
export const updateUser = (data) => {
    return request.post('/manage/user/update', data);
};
// 更新用户状态
export const updateUserStatus = (id, status) => {
    return request.post(`/users/${id}/status`, { status });
};
// 删除用户
export const deleteUser = (id) => {
    return request.get(`/manage/user/delete/${id}`);
};
// 获取用户统计信息
export const getUserStatistics = () => {
    return request.post('/users/statistics');
};
// 批量删除用户
export const batchDeleteUsers = (ids) => {
    return request.post('/manage/user/batchDelete', ids);
};



