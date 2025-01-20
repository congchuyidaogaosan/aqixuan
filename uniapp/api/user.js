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
  },

  // 更新用户信息
  updateUser: (data) => {
    return request({
      url: '/user/update',
      method: 'POST',
      data
    })
  },

  // 获取IP地址信息
  getIpLocation: (ip) => {
    return request({
      url: '/ip/getIpLocation',
      method: 'GET',
      params: { ip }
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
export const updateUser = async (data) => {
  try {
    const res = await api.updateUser(data)
    const userInfo = uni.getStorageSync('userInfo')
    const newUserInfo = {
      ...userInfo,
      ...res.data
    }
    uni.setStorageSync('userInfo', newUserInfo)
    return res
  } catch (e) {
    throw new Error(e.message || '更新用户信息失败')
  }
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

// 保存头像
export function saveAvatar(data) {
  return request({
    url: '/UserAvatar/save',
    method: 'POST',
    data
  })
}

// 获取我的头像列表
export function getMyAvatarList() {
  return request({
    url: '/UserAvatar/myAvatarList',
    method: 'GET'
  })
}

// 删除头像
export function deleteAvatar(id) {
  return request({
    url: `/UserAvatar/delete/${id}`,
    method: 'POST'
  })
}

// 根据昵称搜索用户
export const findUserByName = (nickname) => {
  return request({
    url: '/user/findByName',
    method: 'GET',
    params: { nickname }
  })
}

// 获取用户信息
export const getUserInfo = (userId) => {
  return request({
    url: `/user/find/${userId}`,
    method: 'GET'
  })
}

// 获取用户头像列表
export const getUserAvatars = (userId) => {
  return request({
    url: '/UserAvatar/findAvatarByUserId',
    method: 'GET',
    params: { userId }
  })
}

// 获取IP地址信息
export const getIpLocation = async (ip) => {
  try {
    const res = await api.getIpLocation(ip)
    if (res.code === 200) {
      return res.data
    } else {
      console.log('获取IP地址信息失败：', res.msg)
      return null
    }
  } catch (e) {
    console.log('获取IP地址信息失败：', e)
    return null
  }
} 