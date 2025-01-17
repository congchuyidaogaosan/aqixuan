import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
// 开发环境下使用mock
if (process.env.NODE_ENV === 'development') {
  // 确保mock在其他请求之前加载
  await import('./api/mock.js')
}

export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif