<template>
  <view class="login-container">
    <view class="login-form">
      <view class="form-item">
        <input 
          type="number" 
          v-model="phone" 
          placeholder="请输入手机号"
          maxlength="11"
          class="input"
        />
      </view>
      
      <view class="form-item code-item">
        <input 
          type="number" 
          v-model="code" 
          placeholder="请输入验证码"
          maxlength="6"
          class="input code-input"
        />
        <button 
          class="send-code-btn" 
          :disabled="counting > 0"
          @click="sendCode"
        >
          {{counting > 0 ? `${counting}s后重新发送` : '发送验证码'}}
        </button>
      </view>
      
      <button class="login-btn" @click="handleLogin">登录</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { sendSmsCode, loginByCode, getMyAvatarList } from '@/api/user.js'

const phone = ref('')
const code = ref('')
const counting = ref(0)
const codeKey = ref('')

// 发送验证码
const sendCode = async () => {
  if(!/^1[3-9]\d{9}$/.test(phone.value)) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none'
    })
    return
  }
  try {
    const res = await sendSmsCode(phone.value)
    startCount()
    uni.showToast({
      title: '验证码已发送',
      icon: 'none'
    })
    codeKey.value = res.key
    code.value = res.code
  } catch(e) {
    uni.showToast({
      title: e.message || '发送失败',
      icon: 'none'
    })
  }
}

// 开始倒计时
const startCount = () => {
  counting.value = 60
  const timer = setInterval(() => {
    counting.value--
    if(counting.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 登录处理
const handleLogin = async () => {
  if(!/^1[3-9]\d{9}$/.test(phone.value)) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none'
    })
    return
  }
  
  if(!/^\d{6}$/.test(code.value)) {
    uni.showToast({
      title: '请输入6位验证码',
      icon: 'none'
    })
    return
  }
  try {
    const loginData = {
      phone: phone.value,
      code: code.value,
      key: codeKey.value,
    }
    const res = await loginByCode(loginData)
    // 登录成功，保存token和用户信息
    uni.setStorageSync('token', res.data.token)
    // 获取头像列表
    const avatarRes = await getMyAvatarList()
    // 保存头像列表到用户信息
    res.data.userInfo.avatars = avatarRes.data.map(item => item.avatarUrl)
    // 保存用户信息
    uni.setStorageSync('userInfo', res.data.userInfo)
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })
    // 修改登录成功后的跳转
    setTimeout(() => {
      uni.reLaunch({
        url: '/pages/index/index'
      })
    }, 1500)
  } catch(e) {
    uni.showToast({
      title: e.message || '登录失败',
      icon: 'none'
    })
  }
}
</script>

<style lang="less" scoped>
.login-container {
  padding: 40rpx;
//   width: 100%;
  .login-form {
    margin-top: 100rpx;
    
    .form-item {
      margin-bottom: 30rpx;
      
      .input {
        // width: 100%;
        height: 90rpx;
        background: #f8f8f8;
        border-radius: 45rpx;
        padding: 0 40rpx;
        font-size: 28rpx;
      }
      
      &.code-item {
        display: flex;
        align-items: center;
        
        .code-input {
          flex: 1;
          margin-right: 20rpx;
        }
        
        .send-code-btn {
          width: 200rpx;
          height: 90rpx;
          line-height: 90rpx;
          text-align: center;
          background: #007aff;
          color: #fff;
          border-radius: 45rpx;
          font-size: 26rpx;
          
          &[disabled] {
            background: #ccc;
          }
        }
      }
    }
    
    .login-btn {
      width: 100%;
      height: 90rpx;
      line-height: 90rpx;
      background: #007aff;
      color: #fff;
      border-radius: 45rpx;
      margin-top: 60rpx;
      font-size: 32rpx;
    }
  }
}

.popup-content {
  width: 600rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  
  .popup-title {
    font-size: 32rpx;
    font-weight: bold;
    text-align: center;
    margin-bottom: 40rpx;
  }
  
  .popup-input {
    // width: 100%;
    height: 80rpx;
    background: #f8f8f8;
    border-radius: 40rpx;
    padding: 0 30rpx;
    font-size: 28rpx;
    margin-bottom: 40rpx;
  }
  
  .popup-btns {
    display: flex;
    justify-content: space-between;
    
    .popup-btn {
      width: 240rpx;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      border-radius: 40rpx;
      font-size: 28rpx;
      
      &.cancel-btn {
        background: #f8f8f8;
        color: #666;
      }
      
      &.confirm-btn {
        background: #007aff;
        color: #fff;
      }
    }
  }
}
</style> 