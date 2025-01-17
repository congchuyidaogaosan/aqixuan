import axios from 'axios'

// 创建axios实例
const request = axios.create({
  // 开发环境下不需要baseURL，因为Mock会直接拦截请求
  baseURL: process.env.NODE_ENV === 'development' ? '' : 'http://localhost:3000',
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 获取token
    const token = uni.getStorageSync('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
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