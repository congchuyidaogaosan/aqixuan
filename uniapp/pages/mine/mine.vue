<template>
  <view class="mine-container">
    <!-- 设置按钮 -->
    <view class="settings">
      <button class="settings-btn" @click="goToSettings">
        <uni-icons type="gear" size="24"></uni-icons>
      </button>
    </view>
    
    <!-- 个人信息卡片 -->
    <view class="user-card" @click="goToProfile">
      <view class="user-info">
        <image class="avatar" :src="userInfo.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
        <view class="info-content">
          <text class="nickname">{{userInfo.nickname || '未设置昵称'}}</text>
          <text class="bio">{{userInfo.bio || '这个人很懒，什么都没写~'}}</text>
        </view>
      </view>
    </view>
    
    <!-- 统计数据 -->
    <view class="stats">
      <view class="stat-item" @click="goToFans">
        <text class="num">{{userInfo.fansCount || 0}}</text>
        <text class="label">人气</text>
      </view>
      <view class="stat-item" @click="goToFollowing">
        <text class="num">{{userInfo.followingCount || 0}}</text>
        <text class="label">关注</text>
      </view>
    </view>
    
    <!-- 编辑资料按钮 -->
    <button class="edit-btn" @click="goToEdit">编辑资料</button>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 用户信息
const userInfo = ref({})

// 获取用户信息
const getUserInfo = () => {
  const info = uni.getStorageSync('userInfo')
  if (info) {
    userInfo.value = info
  }
}

// 页面加载时获取用户信息
onMounted(() => {
  getUserInfo()
})

// 跳转到设置页面
const goToSettings = () => {
  uni.navigateTo({
    url: '/pages/settings/settings'
  })
}

// 跳转到个人主页
const goToProfile = () => {
  uni.navigateTo({
    url: '/pages/profile/profile'
  })
}

// 跳转到粉丝列表
const goToFans = () => {
  uni.navigateTo({
    url: '/pages/fans/fans'
  })
}

// 跳转到关注列表
const goToFollowing = () => {
  uni.navigateTo({
    url: '/pages/following/following'
  })
}

// 跳转到编辑资料页面
const goToEdit = () => {
  uni.navigateTo({
    url: '/pages/edit-profile/edit-profile'
  })
}
</script>

<style lang="less" scoped>
.mine-container {
  padding: 40rpx;
  
  .settings {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 40rpx;
    
    .settings-btn {
      width: 80rpx;
      height: 80rpx;
      padding: 0;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      
      &::after {
        border: none;
      }
    }
  }
  
  .user-card {
    background: #fff;
    border-radius: 20rpx;
    padding: 40rpx;
    margin-bottom: 40rpx;
    
    .user-info {
      display: flex;
      align-items: center;
      
      .avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 60rpx;
        margin-right: 30rpx;
        border: 4rpx solid #ff4d4f;
      }
      
      .info-content {
        flex: 1;
        
        .nickname {
          font-size: 32rpx;
          font-weight: bold;
          margin-bottom: 10rpx;
          display: block;
        }
        
        .bio {
          font-size: 28rpx;
          color: #666;
          display: block;
        }
      }
    }
  }
  
  .stats {
    display: flex;
    justify-content: space-around;
    background: #fff;
    border-radius: 20rpx;
    padding: 40rpx;
    margin-bottom: 40rpx;
    
    .stat-item {
      text-align: center;
      
      .num {
        font-size: 36rpx;
        font-weight: bold;
        color: #333;
        display: block;
        margin-bottom: 10rpx;
      }
      
      .label {
        font-size: 28rpx;
        color: #666;
      }
    }
  }
  
  .edit-btn {
    width: 100%;
    height: 90rpx;
    line-height: 90rpx;
    background: #ff4d4f;
    color: #fff;
    border-radius: 45rpx;
    font-size: 32rpx;
  }
}
</style> 