import request from '@/utils/request'

// 是否使用mock数据
// const USE_MOCK = process.env.NODE_ENV === 'development'

// 统一的API实现
const api = {
  // 发送验证码
  sendSmsCode: (phone) => {
    return request({
      url: '/phone/getPhone',
      method: 'get',
      params: { 
        phone,
        isFlag:'1160'
      }
    })
  },

  // 登录/注册
  loginByCode: (data) => {
    return request({
      url: '/phone/isPhone',
      method: 'get',
      params: data
    })
  }
}

// 发送验证码
export const sendSmsCode = async (phone) => {
  try {
    const res = await api.sendSmsCode(phone)
    console.log(res.data);
    
    return res.data
  } catch (e) {
    throw new Error(e.message || '发送失败')
  }
}

// 登录/注册
export const loginByCode = async (data) => {
  try {
    const res = await api.loginByCode(data)
    return res
  } catch (e) {
    console.log(e)
    throw new Error(e.message || '登录失败')
  }
}

// 更新用户信息
export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'POST',
    data
  })
}

// 上传文件
export function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  
  return request({
    url: '/file/upload',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData,
    transformRequest: [function (data) {
      return data // 不转换formData
    }]
  })
} 