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

