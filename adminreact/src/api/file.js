import request from '../utils/request';

// 上传文件
export const uploadFile = (file) => {
  return request.post('/file/upload', { file });
};

