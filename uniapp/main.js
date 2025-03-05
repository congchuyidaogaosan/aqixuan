import App from './App'
import router from './router'
import webSocketManager from './utils/websocket'
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App,
  router
})

// 初始化WebSocket连接
const userInfo = uni.getStorageSync('userInfo')
const userId = userInfo.id
if (userId) {
  webSocketManager.connect(userId)
}

// 创建定时器，每2秒打印一次连接状态和最新消息
setInterval(() => {
  if (userId && webSocketManager.isConnected) {
    console.log('WebSocket连接状态：', webSocketManager.isConnected)
    console.log('当前时间：', new Date().toLocaleTimeString())
  }
}, 2000)

app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
// 开发环境下使用mock
// if (process.env.NODE_ENV === 'development') {
//   // 确保mock在其他请求之前加载
//   await import('@/api/mock.js')
// }

export function createApp() {
  const app = createSSRApp(App)
  app.use(router)
  
  // 初始化WebSocket连接
  const userInfo = uni.getStorageSync('userInfo')
  const userId = userInfo.id
  if (userId) {
    webSocketManager.connect(userId)
  }
  
  return {
    app
  }
}
// #endif