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
        <image 
          class="avatar" 
          :src="userInfo.avatars[0] ? userInfo.avatars[0] : '/static/default-avatar.png'" 
          mode="aspectFill"
        ></image>
        <view class="info-content">
          <text class="nickname">{{userInfo.nickname || '未设置昵称'}}</text>
          <text class="bio">{{userInfo.introduction || '这个人很懒，什么都没写~'}}</text>
        </view>
      </view>
    </view>
    
    <!-- 统计数据 -->
    <view class="stats">
      <view class="stat-item" @click="goToFans">
        <text class="num">{{fansCount || 0}}</text>
        <text class="label">人气</text>
      </view>
      <view class="stat-item" @click="goToFollowing">
        <text class="num">{{followingCount || 0}}</text>
        <text class="label">关注</text>
      </view>
    </view>
    
    <!-- 添加关注统计显示
    <view class="follow-stats">
      <view class="stat-item">
        <text class="count">{{followCount}}</text>
        <text class="label">关注</text>
      </view>
      <view class="stat-item">
        <text class="count">{{fansCount}}</text>
        <text class="label">人气</text>
      </view>
    </view> -->
    
    <!-- 编辑资料按钮 -->
    <button class="edit-btn" @click="goToEdit">编辑资料</button>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getFollowStats } from '@/api/user.js'


// 用户信息 - 添加默认值
const userInfo = ref({
  avatars: [], // 添加默认的avatars数组
  nickname: '',
  bio: ''
})
// 人气
const fansCount = ref(0)
// 关注
const followingCount = ref(0)

// 获取用户信息
const getUserInfo = () => {
  const info = uni.getStorageSync('userInfo')
  if (info) {
    // 确保avatars存在
    if (!info.avatars) {
      info.avatars = []
    }
    userInfo.value = info
  }
}

// 获取关注统计
const loadFollowStats = async () => {
  const stats = await getFollowStats()
  fansCount.value = stats.fansCount
  followingCount.value = stats.followingCount
}

// 页面加载时获取用户信息
onMounted(() => {
  getUserInfo()
})

// 每次显示页面时更新统计数据
onShow(() => {
  loadFollowStats()
})

// 监听页面显示
uni.$on('onShow', getUserInfo)

// 组件卸载时移除监听
onUnmounted(() => {
  uni.$off('onShow', getUserInfo)
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
  
  .follow-stats {
    display: flex;
    padding: 20rpx 30rpx;
    background: #fff;
    margin-top: 20rpx;
    
    .stat-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .count {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 4rpx;
      }
      
      .label {
        font-size: 24rpx;
        color: #999;
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