import axios from 'axios'

// 创建axios实例
const request = axios.create({
  baseURL: '/aqixuan',
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 获取token
    const token = uni.getStorageSync('token')
    if (token) {
      config.headers['token'] = `${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    // 新用户需要设置昵称
    if (res.code === 201) {
      return res
    }
    // 其他非200状态码都是错误
    if (res.code !== 200) {
      uni.showToast({
        title: res.message || '请求失败',
        icon: 'none'
      })
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res
  },
  error => {
    uni.showToast({
      title: error.message || '网络错误',
      icon: 'none'
    })
    return Promise.reject(error)
  }
)

export default request 