<template>
  <view class="message-container">
    <!-- 顶部搜索框 -->
    <view class="search-box">
      <uni-search-bar 
        v-model="searchText"
        placeholder="搜索用户"
        @confirm="handleSearch"
        @clear="handleClear"
      ></uni-search-bar>
    </view>
    
    <!-- 消息列表 -->
    <scroll-view 
      class="message-list"
      scroll-y
      @scrolltolower="loadMore"
    >
      <view 
        class="message-item"
        v-for="item in messageList" 
        :key="item.id"
        @click="goToChat(item)"
      >
        <image class="avatar" :src="item.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
        <view class="content">
          <view class="header">
            <text class="nickname">{{item.nickname}}</text>
            <text class="time">{{item.lastTime}}</text>
          </view>
          <view class="message">
            <text class="text">{{item.lastMessage}}</text>
            <view v-if="item.unread" class="badge">{{item.unread}}</view>
          </view>
        </view>
      </view>
      
      <!-- 加载更多 -->
      <uni-load-more :status="loadingStatus"></uni-load-more>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

// 搜索文本
const searchText = ref('')

// 消息列表
const messageList = ref([
  {
    id: 1,
    avatar: '',
    nickname: '张三',
    lastMessage: '你好，在吗？',
    lastTime: '12:30',
    unread: 2
  },
  {
    id: 2,
    avatar: '',
    nickname: '李四',
    lastMessage: '好的，明天见',
    lastTime: '昨天',
    unread: 0
  }
])

// 加载状态
const loadingStatus = ref('more')

// 搜索处理
const handleSearch = (e) => {
  console.log('搜索:', searchText.value)
}

// 清除搜索
const handleClear = () => {
  searchText.value = ''
}

// 加载更多
const loadMore = () => {
  if (loadingStatus.value === 'loading') return
  loadingStatus.value = 'loading'
  
  // 模拟加载数据
  setTimeout(() => {
    loadingStatus.value = 'noMore'
  }, 1000)
}

// 跳转到聊天页面
const goToChat = (item) => {
  uni.navigateTo({
    url: `/pages/chat/chat?id=${item.id}&nickname=${item.nickname}`
  })
}
</script>

<style lang="less" scoped>
.message-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  
  .search-box {
    padding: 20rpx;
    background: #fff;
  }
  
  .message-list {
    flex: 1;
    background: #f8f8f8;
    
    .message-item {
      display: flex;
      align-items: center;
      padding: 30rpx;
      background: #fff;
      border-bottom: 1rpx solid #eee;
      
      .avatar {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50rpx;
        margin-right: 20rpx;
      }
      
      .content {
        flex: 1;
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10rpx;
          
          .nickname {
            font-size: 32rpx;
            color: #333;
          }
          
          .time {
            font-size: 24rpx;
            color: #999;
          }
        }
        
        .message {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .text {
            font-size: 28rpx;
            color: #666;
          }
          
          .badge {
            min-width: 36rpx;
            height: 36rpx;
            line-height: 36rpx;
            text-align: center;
            background: #ff4d4f;
            color: #fff;
            border-radius: 18rpx;
            font-size: 24rpx;
            padding: 0 10rpx;
          }
        }
      }
    }
  }
}
</style> 