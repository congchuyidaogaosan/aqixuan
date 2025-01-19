<template>
  <view class="search-container">
    <!-- 搜索框 -->
    <view class="search-header">
      <view class="search-box">
        <image src="/static/images/search-input.png" mode="aspectFit" class="search-icon"></image>
        <input 
          type="text" 
          v-model="searchKey" 
          placeholder="搜索昵称" 
          placeholder-class="placeholder"
          @confirm="handleSearch"
          auto-focus
        />
      </view>
      <text class="cancel-btn" @click="goBack">取消</text>
    </view>

    <!-- 搜索结果列表 -->
    <view class="search-results" v-if="searchResults.length">
      <view 
        class="user-item" 
        v-for="user in searchResults" 
        :key="user.id"
        @click="goToProfile(user.id)"
      >
        <image :src="handleAvatarPath(user.avatars?.[0])" mode="aspectFill" class="avatar"></image>
        <view class="info">
          <text class="nickname">{{user.nickname}}</text>
          <text class="age" v-if="user.age">{{user.age}}岁</text>
        </view>
      </view>
    </view>

    <!-- 无搜索结果提示 -->
    <view class="no-result" v-else-if="hasSearched">
      <text>未找到相关用户</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { findUserByName } from '@/api/user.js'

const searchKey = ref('')
const searchResults = ref([])
const hasSearched = ref(false)

// 处理搜索
const handleSearch = async () => {
  if (!searchKey.value.trim()) return
  
  try {
    const res = await findUserByName(searchKey.value.trim())
    console.log('搜索结果：', res.data)
    searchResults.value = res.data || []
    hasSearched.value = true
  } catch (error) {
    uni.showToast({
      title: '搜索失败',
      icon: 'none'
    })
  }
}

// 跳转到用户主页
const goToProfile = (userId) => {
  console.log('跳转到用户主页：', userId)
  uni.navigateTo({
    url: `/pages/profile/profile?userId=${userId}`
  })
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 处理头像路径
const handleAvatarPath = (filePath) => {
  if (!filePath) return ''
  if (filePath.indexOf('http') === 0) return filePath
  return 'http://localhost:9090' + filePath
}
</script>

<style lang="less" scoped>
.search-container {
  padding: calc(var(--status-bar-height) + 20rpx) 20rpx 0;  // 适配状态栏
  
  .search-header {
    display: flex;
    align-items: center;
    gap: 20rpx;
    
    .search-box {
      flex: 1;
      height: 72rpx;
      background: #f5f5f5;
      border-radius: 36rpx;
      display: flex;
      align-items: center;
      padding: 0 30rpx;
      
      .search-icon {
        width: 32rpx;
        height: 32rpx;
        margin-right: 16rpx;
      }
      
      input {
        flex: 1;
        height: 100%;
        font-size: 28rpx;
      }
      
      .placeholder {
        color: #999;
      }
    }
    
    .cancel-btn {
      font-size: 28rpx;
      color: #ff4d4f;
      padding: 10rpx;  // 增加点击区域
    }
  }
  
  .search-results {
    margin-top: 30rpx;
    
    .user-item {
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f5f5f5;
      
      .avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        margin-right: 20rpx;
      }
      
      .info {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 16rpx;
        
        .nickname {
          font-size: 28rpx;
          color: #333;
          font-weight: 500;
        }
        
        .age {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }
  
  .no-result {
    margin-top: 200rpx;
    text-align: center;
    color: #999;
    font-size: 28rpx;
  }
}
</style> 