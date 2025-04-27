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
  },

  // 获取动态详情
  getMomentDetail: (momentId) => {
    return request({
      url: `/Moment/detail/${momentId}`,
      method: 'GET'
    })
  },

  // 点赞动态
  likeMoment: (momentId) => {
    return request({
      url: '/MomentLike/like',
      method: 'POST',
      data: { momentId }
    })
  },

  // 取消点赞
  unlikeMoment: (momentId) => {
    return request({
      url: '/MomentLike/unlike',
      method: 'POST',
      data: { momentId }
    })
  },

  // 发表评论
  addComment: (data) => {
    return request({
      url: '/MomentComment/save',
      method: 'POST',
      data
    })
  },

  // 获取评论列表
  getCommentList: (momentId) => {
    return request({
      url: '/MomentComment/list',
      method: 'GET',
      params: { momentId }
    })
  },

  // 删除评论
  deleteComment: (commentId) => {
    return request({
      url: '/MomentComment/delete',
      method: 'POST',
      data: { commentId }
    })
  },

  // 发布活动
  publishActivity: (data) => {
    return request({
      url: '/Activity/save',
      method: 'POST',
      data
    })
  },

  // 获取活动列表
  getActivityList: (current, size, active) => {
    return request({
      // 页数，每页数量，筛选条件
      url: `/Activity/list/${current}/${size}`,
      method: 'POST',
      data: active
    })
  },

  // 获取活动详情
  getActivityDetail: (id) => {
    return request({
      url: `/Activity/find/${id}`,
      method: 'GET'
    })
  },

  // 报名活动
  joinActivity: (data) => {
    return request({
      url: '/ActivitySignup/signup',
      method: 'POST',
      data
    })
  },

  // 同意或拒绝
  agreeOrRefuse: (data) => {
    return request({
      url: '/ActivitySignup/updateStatus',
      method: 'POST',
      data
    })
  },

  // 获取用户列表 apping("/{page}/{size}")
  getRecommendUserList: (page, size) => {
    return request({
      url: `/Recommend/${page}/${size}`,
      method: 'GET',
    })
  },
  // 获取聊天消息列表
  getMessageList: (data) => {
    return request({
      url: `/ChatMessage/userID`,
      method: 'GET',
      params: data
    })
  },
  // 标记消息为已读
  markMessageRead: (messageId) => {
    return request({
      url: '/message/read',
      method: 'POST',
      data: { messageId }
    })
  },
  // 获取聊天消息详情
  getChatMessageDetail: (userId) => {
    return request({
      url: `/ChatMessage/detail/${userId}`,
      method: 'GET',
    })
  },
  // 发送消息
  sendMessage: (data) => {
    return request({
      url: '/chat/send',
      method: 'POST',
      data
    })
  },
  // 获取聊天消息
  getChatMessages: (params) => {
    return request({
      url: `/ChatMessage/sty/${params.chatId}`,
      method: 'GET',
      params
    })
  },
  // 实名认证
  realNameAuth: (data) => {
    return request({
      url: '/code/yanzheng',
      method: 'GET',
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

// 获取用户信息有头像
export const getUserInfoById = (id) => {
  return request({
    url: `/user/findById`,
    method: 'GET',
    params: { id }
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

// 获取动态详情
export const getMomentDetail = async (momentId) => {
  try {
    const res = await api.getMomentDetail(momentId)
    return res.code === 200 ? res.data : null
  } catch (e) {
    console.log('获取动态详情失败：', e)
    return null
  }
}

// 点赞动态
export const likeMoment = async (momentId) => {
  try {
    const res = await api.likeMoment(momentId)
    return res
  } catch (e) {
    throw new Error(e.message || '点赞失败')
  }
}

// 取消点赞
export const unlikeMoment = async (momentId) => {
  try {
    const res = await api.unlikeMoment(momentId)
    return res
  } catch (e) {
    throw new Error(e.message || '取消点赞失败')
  }
}

// 获取评论列表
export const getCommentList = async (momentId) => {
  try {
    const res = await api.getCommentList(momentId)
    return res.code === 200 ? res.data : []
  } catch (e) {
    console.log('获取评论列表失败：', e)
    return []
  }
}

// 发表评论
export const addComment = async (data) => {
  try {
    const res = await api.addComment(data)
    return res.code === 200 ? res.data : null
  } catch (e) {
    throw new Error(e.message || '发表评论失败')
  }
}

// 删除评论
export const deleteComment = async (commentId) => {
  try {
    const res = await api.deleteComment(commentId)
    return res.code === 200
  } catch (e) {
    throw new Error(e.message || '删除评论失败')
  }
}

// 发布活动
export const publishActivity = async (data) => {
  try {
    const res = await api.publishActivity(data)
    return res.code === 200 ? res.data : null
  } catch (e) {
    throw new Error(e.message || '发布活动失败')
  }
}

// 获取活动列表
export const getActivityList = async (current, size, active) => {
  try {
    const res = await api.getActivityList(current, size, active)
    return res.code === 200 ? res.data : []
  } catch (e) {
    console.log('获取活动列表失败：', e)
    return []
  }
}

// 获取活动详情
export const getActivityDetail = async (id) => {
  try {
    const res = await api.getActivityDetail(id)
    return res.code === 200 ? res.data : null
  } catch (e) {
    console.log('获取活动详情失败：', e)
    return null
  }
}

// 报名活动
export const joinActivity = async (data) => {
  try {
    const res = await api.joinActivity(data)
    return res.code === 200
  } catch (e) {
    console.log('报名活动失败：', e)
    return false
  }
}

// 同意或拒绝
export const agreeOrRefuse = async (data) => {
  try {
    const res = await api.agreeOrRefuse(data)
    return res.code === 200
  } catch (e) {
    console.log('同意或拒绝失败：', e)
    return false
  }
}

// 获取用户列表
export const getRecommendUserList = async (page, size) => {
  try {
    const res = await api.getRecommendUserList(page, size)
    return res.code === 200 ? res.data : []
  } catch (e) {
    console.log('获取用户列表失败：', e)
    return []
  }
}

// 获取消息列表
export const getMessageList = async (data) => {
  try {
    const res = await api.getMessageList(data)
    // res.data=null时为空【】
    if (res.data === null) {
      res.data = []
    }
    return res.code === 200 ? res.data : []
  } catch (e) {
    console.log('获取消息列表失败：', e)
    return []
  }
}


// 标记消息为已读
export const markMessageRead = async (messageId) => {
  try {
    const res = await api.markMessageRead(messageId)
    return res.code === 200
  } catch (e) {
    console.log('标记消息为已读失败：', e)
    return false
  }
}
// 获取与他人聊天消息详情
export const getChatMessageDetail = async (userId) => {
  try {
    const res = await api.getChatMessageDetail(userId)
    return res.code === 200 ? res.data : null
  } catch (e) {
    console.log('获取聊天消息详情失败：', e)
    return null
  }
}
  /* 请求数据格式示例：
  {
    "id": "2", // 消息ID
    "page": 1, // 当前页码
    "pageSize": 20 // 每页数量
  }
  */
  /* 返回数据格式示例：
  {
    "code": 200,
    "msg": "success",
    "data": {
      "messages": [
        {
          "id": "1", // 消息ID
          "senderId": "1", // 发送者ID
          "receiverId": "2", // 接收者ID
          "content": "你好", // 消息内容
          "messageType": "text", // text-文本, image-图片, voice-语音
          "duration": 0, // 语音消息时长（秒）
          "createdAt": "2024-03-20 12:30:00",
          "status": "read", // unread-未读, read-已读
          "avatar": "http://example.com/avatar.jpg",
          "nickname": "张三"
        }
      ],
      "total": 100,
      "pageSize": 20,
      "currentPage": 1
    }
  }
  */


// 发送消息
export const sendMessage = async (data) => {
  try {
    const res = await api.sendMessage(data)
    return res.code === 200 ? res.data : null
  } catch (e) {
    console.log('发送消息失败：', e)
    return null
  }
}
  /* 请求数据格式示例：
  {
    "receiverId": "2",  // 接收者ID
    "content": "你好",  // 消息内容
    "messageType": "text"  // 消息类型：text-文本, image-图片, voice-语音
  }
  返回数据格式示例：
  {
    "code": 200,
    "msg": "success",
    "data": {
      "id": "1",  // 消息ID
      "senderId": "1",  // 发送者ID
      "receiverId": "2",  // 接收者ID
      "content": "你好",  // 消息内容
      "messageType": "text",  // 消息类型
      "createdAt": "2024-03-20 12:30:00",  // 发送时间
      "status": "sent"  // 消息状态：sent-已发送
    }
  }
  */

// 获取聊天消息
export const getChatMessages = async (params) => {
  try {
    const res = await api.getChatMessages(params)
    return res.code === 200 ? res.data : []
  } catch (e) {
    console.log('获取聊天消息失败：', e)
    return []
  }
}

// 实名认证接口
export const realNameAuth = async (data) => {
  try {
    const res = await api.realNameAuth(data)
    return res.code === 200 ? res.data : null
  } catch (e) {
    console.log('实名认证失败：', e)
    return null
  }
}

