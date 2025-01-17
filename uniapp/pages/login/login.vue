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

    <uni-popup ref="popup" type="dialog">
      <uni-popup-dialog
        type="input"
        mode="input"
        title="设置昵称"
        placeholder="请输入昵称"
        :value="nickname"
        @confirm="confirmNickname"
        @close="closePopup"
      ></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { sendSmsCode, loginByCode, updateNickname } from '@/api/user.js'

const phone = ref('')
const code = ref('')
const nickname = ref('')
const counting = ref(0)
const popup = ref(null)

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
    console.log(res)
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
      code: code.value
    }
    
    const res = await loginByCode(loginData)
    console.log('登录响应:', res)

    // 处理新用户需要设置昵称的情况
    if(res.needNickname) {
      nickname.value = '' // 清空昵称
      popup.value.open()
      return
    }
    
    // 登录成功，保存token和用户信息
    uni.setStorageSync('token', res.token)
    uni.setStorageSync('userInfo', res.userInfo)
    
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })
    
    // 登录成功后跳转
    setTimeout(() => {
      uni.switchTab({
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

// 确认昵称
const confirmNickname = async (val) => {
  if(!val.trim()) {
    uni.showToast({
      title: '请输入昵称',
      icon: 'none'
    })
    return
  }
  
  try {
    const loginData = {
      phone: phone.value,
      code: code.value,
      nickname: val.trim()
    }
    
    const res = await loginByCode(loginData)
    
    if(res.needNickname) {
      uni.showToast({
        title: '请设置昵称',
        icon: 'none'
      })
      return
    }
    
    // 登录成功，保存token和用户信息
    uni.setStorageSync('token', res.token)
    uni.setStorageSync('userInfo', res.userInfo)
    
    popup.value.close()
    
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })
    
    // 登录成功后跳转
    setTimeout(() => {
      uni.switchTab({
        url: '/pages/index/index'
      })
    }, 1500)
    
  } catch(e) {
    uni.showToast({
      title: e.message || '设置失败',
      icon: 'none'
    })
  }
}

// 关闭弹框
const closePopup = () => {
  popup.value.close()
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
</style> 