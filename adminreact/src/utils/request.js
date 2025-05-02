// src/utils/request.js
import axios from 'axios';
import { message } from 'antd';

// 获取环境变量中的API基础URL，如果不存在则使用默认值

// 创建axios实例
const request = axios.create({
  baseURL: "/api",
  timeout: 30000, // 请求超时时间：30秒
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    
    // 如果存在token，则添加到请求头中
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data;
    
    // 如果接口返回的状态码不是200，则判定为错误
    if (res.code !== 200) {
      message.error(res.message || '请求失败');
      
      // 处理特定的错误码
      if (res.code === 401) {
        // 未登录或token过期，跳转到登录页
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        
        // 如果当前页面不是登录页，则重定向到登录页
        if (window.location.pathname !== '/login') {
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
        }
      }
      
      return Promise.reject(new Error(res.message || '请求失败'));
    }
    
    // 正常返回数据
    return res;
  },
  (error) => {
    // 处理网络错误
    if (error.message.includes('timeout')) {
      message.error('请求超时，请检查您的网络连接');
    } else if (error.message.includes('Network Error')) {
      message.error('网络异常，请检查您的网络连接');
    } else {
      // 获取HTTP状态码相关错误
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 401:
            // 未授权，清除localStorage中的token，并重定向到登录页
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            message.error('登录状态已过期，请重新登录');
            
            // 如果当前页面不是登录页，则重定向到登录页
            if (window.location.pathname !== '/login') {
              setTimeout(() => {
                window.location.href = '/login';
              }, 1500);
            }
            break;
            
          case 403:
            message.error('您没有权限访问该资源');
            break;
            
          case 404:
            message.error('请求的资源不存在');
            break;
            
          case 500:
            message.error('服务器错误，请稍后再试');
            break;
            
          default:
            message.error(data?.message || `请求失败，错误码: ${status}`);
        }
      } else {
        message.error('请求失败，请稍后再试');
      }
    }
    
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 封装GET请求
export const get = (url, params, config = {}) => {
  return request.get(url, { params, ...config });
};

// 封装POST请求
export const post = (url, data, config = {}) => {
  return request.post(url, data, config);
};

// 封装PUT请求
export const put = (url, data, config = {}) => {
  return request.put(url, data, config);
};

// 封装DELETE请求
export const del = (url, config = {}) => {
  return request.delete(url, config);
};

// 封装PATCH请求
export const patch = (url, data, config = {}) => {
  return request.patch(url, data, config);
};

// 导出axios实例和封装的方法
export default request;