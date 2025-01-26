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
  },

  // 关注用户
  followUser: (followedUserId) => {
    return request({
      url: '/follow/add',
      method: 'POST',
      data: { followedUserId }
    })
  },

  // 取消关注
  unfollowUser: (id) => {
    return request({
      url: '/follow/delete',
      method: 'GET',
      params: { id }
    })
  },

  // 检查是否已关注
  checkFollow: (userId) => {
    return request({
      url: '/follow/check',
      method: 'GET',
      params: { userId }
    })
  },

  // 获取关注统计
  getFollowStats: () => {
    return request({
      url: '/follow/stats',
      method: 'GET'
    })
  },

  // 发布动态
  publishMoment: (data) => {
    return request({
      url: '/Moment/save',
      method: 'POST',
      data
    })
  },

  // 获取关注列表
  getFollowingList: (params) => {
    return request({
      url: '/follow/GuanZhuList',
      method: 'GET',
      params
    })
  },

  // 获取粉丝列表
  getFansList: (params) => {
    return request({
      url: '/follow/FenSiList',
      method: 'GET',
      params
    })
  },

  // 获取用户动态列表
  getMomentList: () => {
    return request({
      url: '/Moment/list',
      method: 'POST',
      
    })
  },

  // 获取用户动态列表
  getMomentListByUserId: (userId) => {
    return request({
      url: `/Moment/find/${userId}`,
      method: 'GET',
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

// 关注用户
export const followUser = async (followedUserId) => {
  try {
    const res = await api.followUser(followedUserId)
    return res.code === 200
  } catch (e) {
    console.log('关注失败：', e)
    return false
  }
}

// 取消关注
export const unfollowUser = async (id) => {
  try {
    const res = await api.unfollowUser(id)
    return res.code === 200
  } catch (e) {
    console.log('取消关注失败：', e)
    return false
  }
}

// 检查是否已关注
export const checkFollow = async (userId) => {
  try {
    const res = await api.checkFollow(userId)
    if (res.code === 200) {
        return res.data
    }
  } catch (e) {
    console.log('检查关注状态失败：', e)
    return false
  }
}

// 获取关注统计
export const getFollowStats = async () => {
  try {
    const res = await api.getFollowStats()
    if (res.code === 200) {
      return {
        followingCount: res.data.followingCount || 0, // 关注数
        fansCount: res.data.fansCount || 0      // 粉丝数（人气值）
      }
    }
    return {
      followingCount: 0,
      fansCount: 0
    }
  } catch (e) {
    console.log('获取关注统计失败：', e)
    return {
      followingCount: 0,
      fansCount: 0
    }
  }
}

// 发布动态
export const publishMoment = async (data) => {
  try {
    const res = await api.publishMoment(data)
    return res.code === 200
  } catch (e) {
    console.log('发布动态失败：', e)
    return false
  }
}

// 获取关注列表
export const getFollowingList = async (params) => {
  try {
    const res = await api.getFollowingList(params)
    return res.code === 200 ? res.data : []
  } catch (e) {
    console.log('获取关注列表失败：', e)
    return []
  }
}

// 获取粉丝列表
export const getFansList = async (params) => {
  try {
    const res = await api.getFansList(params)
    return res.code === 200 ? res.data : []
  } catch (e) {
    console.log('获取粉丝列表失败：', e)
    return []
  }
}

// 获取用户动态列表
export const getMomentList = async () => {
  try {
    const res = await api.getMomentList()
    return res.code === 200 ? res.data : []
  } catch (e) {
    console.log('获取动态列表失败：', e)
    return []
  }
} 

// 获取用户动态列表
export const getMomentListByUserId = async (userId) => {
  try {
    const res = await api.getMomentListByUserId(userId)
    return res.code === 200 ? res.data : []
  } catch (e) {
    console.log('获取动态列表失败：', e)
    return []
  }
}