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
        :key="item.chatMessage.id"
        @click="goToChat(item)"
      >
        <image class="avatar" :src="item.userAvatar?.avatarUrl || '/static/default-avatar.png'" mode="aspectFill"></image>
        <view class="content">
          <view class="header">
            <text class="nickname">{{item.user?.nickname}}</text>
            <text class="time">{{formatTime(item.chatMessage.createdAt)}}</text>
          </view>
          <view class="message">
            <text class="text">{{item.chatMessage.content}}</text>
            <view v-if="!item.chatMessage.isRead" class="badge">1</view>
          </view>
        </view>
      </view>
      
      <!-- 加载更多 -->
      <uni-load-more :status="loadingStatus"></uni-load-more>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'

import { getMessageList,  markMessageRead } from '@/api/user'
import { formatTime } from '@/utils/date'

// 搜索文本
const searchText = ref('')

// 消息列表
const messageList = ref([])

// 加载状态
const loadingStatus = ref('more')

// 分页参数
const page = ref(1)
const pageSize = ref(10)

// 获取消息列表
const loadMessages = async (isRefresh = false) => {
  try {
    if (isRefresh) {
      page.value = 1
      messageList.value = []
    }
    
    loadingStatus.value = 'loading'
    const params = {
      page: page.value,
      pageSize: pageSize.value,
      // keyword: searchText.value
    }
    
    const res = await getMessageList(params)
    console.log('res', res)
    if (res) {
      // if (isRefresh) {
        messageList.value = res
      // } else {
        // messageList.value = [...messageList.value, ...res]
      // }
      
      // 更新加载状态
      if (res.length < pageSize.value) {
        loadingStatus.value = 'noMore'
      } else {
        loadingStatus.value = 'more'
        page.value++
      }
    }
  } catch (error) {
    console.error('获取消息列表失败：', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
    loadingStatus.value = 'more'
  }
}

// 搜索处理
const handleSearch = () => {
  loadMessages(true)
}

// 清除搜索
const handleClear = () => {
  searchText.value = ''
  loadMessages(true)
}

// 加载更多
const loadMore = () => {
  if (loadingStatus.value === 'loading' || loadingStatus.value === 'noMore') return
  loadMessages()
}

// 跳转到聊天页面
const goToChat = async (item) => {
  try {
    console.log('item', item)
    // 标记消息为已读
    // if (!item.chatMessage.isRead) {
    //   // await markMessageRead(item.chatMessage.id)
    // }
    
    uni.navigateTo({
      url: `/pages/chat/chat?userId=${item.user.id}&nickname=${encodeURIComponent(item.user.nickname)}&avatar=${encodeURIComponent(item.userAvatar?.avatarUrl || '')}`
    })
  } catch (error) {
    console.error('标记已读失败：', error)
  }
}

// 下拉刷新
const onPullDownRefresh = async () => {
  await loadMessages(true)
  uni.stopPullDownRefresh()
}

// 页面加载
onMounted(() => {
  loadMessages()
})

// 监听页面显示
onShow(() => {
	console.log('页面显示')
  loadMessages(true)
})

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