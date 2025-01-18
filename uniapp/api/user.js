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
        isFlag:'1160' //开发带，上线去掉
    }
    })
  },

  // 登录/注册
  loginByCode: (data) => {
    return request({
      url: '/user/login',
      method: 'post',
      data
    })
  },

  // 设置用户昵称
  updateNickname: (nickname) => {
    return request({
      url: '/user/update/nickname',
      method: 'post',
      data: { nickname }
    })
  }
}

// 发送验证码
export const sendSmsCode = async (phone) => {
  try {
    const res = await api.sendSmsCode(phone)
    return res.data
  } catch (e) {
    throw new Error(e.message || '发送失败')
  }
}

// 登录/注册
export const loginByCode = async (data) => {
  try {
    const res = await api.loginByCode(data)
    // 如果是新用户需要设置昵称
    if (res.data?.needNickname) {
      return {
        needNickname: true,
        isNewUser: true
      }
    }
    // 登录成功
    return {
      token: res.data.token,
      userInfo: res.data.userInfo,
      needNickname: false
    }
  } catch (e) {
    throw new Error(e.message || '登录失败')
  }
}

// 设置用户昵称
export const updateNickname = async (nickname) => {
  try {
    const res = await api.updateNickname(nickname)
    return res.data
  } catch (e) {
    throw new Error(e.message || '设置失败')
  }
} 