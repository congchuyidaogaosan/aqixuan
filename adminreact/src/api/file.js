import request from '../utils/request';

// 上传文件
export const uploadFile = (formData) => {
  return request({
    url: '/file/upload',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  });
};

// 获取文件列表
export const getFileList = (params) => {
  return request({
    url: '/manage/file/list',
    method: 'GET',
    params
  });
};

// 删除文件
export const deleteFile = (id) => {
  return request({
    url: `/manage/file/delete/${id}`,
    method: 'POST'
  });
};

// 批量删除文件
export const batchDeleteFiles = (ids) => {
  return request({
    url: '/manage/file/batch-delete',
    method: 'POST',
    data: { ids }
  });
};

// 获取文件详情
export const getFileDetail = (id) => {
  return request({
    url: `/manage/file/detail/${id}`,
    method: 'GET'
  });
};

// 更新文件信息
export const updateFile = (id, data) => {
  return request({
    url: `/manage/file/update/${id}`,
    method: 'POST',
    data
  });
};

// 下载文件
export const downloadFile = (id) => {
  return request({
    url: `/manage/file/download/${id}`,
    method: 'GET',
    responseType: 'blob'
  });
};

