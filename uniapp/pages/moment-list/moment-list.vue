<template>
  <view class="moment-list">
    <!-- 头部导航 -->
    <view class="nav-header">
      <view class="left" @click="goBack">
        <image src="/static/images/back.png" mode="aspectFit" class="back-icon"></image>
      </view>
      <view class="title">{{userInfo.nickname || '动态列表'}}</view>
      <view class="right"></view>
    </view>
    
    <!-- 动态列表 -->
    <scroll-view 
      class="content" 
      scroll-y
      :scroll-into-view="scrollToId"
      :scroll-with-animation="true"
      :scroll-top="scrollTop"
      @scrolltolower="loadMore"
      :refresher-enabled="true"
      :refresher-triggered="refreshing"
      @refresherrefresh="refresh"
    >
      <view 
        v-for="(moment, index) in momentList" 
        :key="moment.id"
        :id="`moment-${moment.id}`"
        class="moment-item"
      >
        <!-- 用户信息 -->
        <view class="user-info">
          <image :src="userInfo.avatarUrl" mode="aspectFill" class="avatar"></image>
          <text class="nickname">{{userInfo.nickname}}</text>
        </view>
        
        <!-- 媒体轮播 -->
        <swiper 
          class="media-swiper" 
          :indicator-dots="moment.list?.length > 1"
          :autoplay="false"
          :duration="500"
          :circular="true"
        >
          <swiper-item v-for="media in moment.list" :key="media.id">
            <video
              v-if="media.mediaType === '2'"
              :src="media.mediaUrl"
              class="media-item"
              :controls="true"
              :show-center-play-btn="true"
              object-fit="cover"
            ></video>
            <image 
              v-else
              :src="media.mediaUrl"
              mode="aspectFill"
              class="media-item"
            ></image>
          </swiper-item>
        </swiper>
        
        <!-- 互动数据 -->
        <view class="interaction">
          <view class="stats">
            <view class="item">
              <text class="count">{{moment.likesCount || 0}}</text>
              <text class="label">点赞</text>
            </view>
            <view class="item">
              <text class="count">{{moment.commentsCount || 0}}</text>
              <text class="label">评论</text>
            </view>
          </view>
          <view class="time-location">
            <text class="time">{{(moment.createdAt)}}</text>
            <text class="location" v-if="moment.location">{{moment.location}}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { formatTime } from '@/utils/date.js'
import { getMomentList, getMomentListByUserId } from '@/api/user.js'

const userInfo = ref({})
const momentList = ref([])
const scrollToId = ref('')
const scrollTop = ref(0)
const refreshing = ref(false)
const loading = ref(false)
const loadingStatus = ref('more')

// 获取动态列表
const loadMoments = async (userId) => {
  try {
    loading.value = true
    let res = []
    if (userId) {
      res = await getMomentListByUserId(userId)
    } else {
      res = await getMomentList()
    }
    momentList.value = res || []
    
    // 获取要滚动到的动态ID
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const momentId = currentPage.options?.momentId
    
    if (momentId) {
      // 使用Vue的nextTick确保DOM更新后再滚动
      nextTick(() => {
        scrollToId.value = `moment-${momentId}`
      })
    }
  } catch (error) {
    console.log('获取动态列表失败：', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

// 监听列表数据变化
watch(() => momentList.value, (newVal) => {
  if (newVal.length > 0) {
    // 列表数据加载完成后，重新触发一次滚动
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const momentId = currentPage.options?.momentId
    
    if (momentId) {
      nextTick(() => {
        scrollToId.value = `moment-${momentId}`
      })
    }
  }
}, { immediate: true })

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 获取页面参数并设置用户信息
const initUserInfo = () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options || {}
  
  userInfo.value = {
    nickname: decodeURIComponent(options.nickname || ''),
    avatarUrl: decodeURIComponent(options.avatarUrl || ''),
  }
  // console.log(options)
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const userId = currentPage.options?.userId
  
  // 初始化用户信息
  initUserInfo()
  
  // 加载动态列表
  loadMoments(userId)
})
</script>

<style lang="less" scoped>
.moment-list {
  min-height: 100vh;
  background: #f8f8f8;
  
  .nav-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20rpx;
    height: 88rpx;
    background: #fff;
    position: sticky;
    top: 0;
    z-index: 100;
    
    .left {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      
      .back-icon {
        width: 40rpx;
        height: 40rpx;
      }
    }
    
    .title {
      font-size: 32rpx;
      font-weight: 500;
      color: #333;
    }
    
    .right {
      width: 60rpx;
    }
  }
  
  .content {
    height: calc(100vh - 88rpx);
    
    .moment-item {
      background: #fff;
      margin-bottom: 20rpx;
      scroll-margin-top: 88rpx;
      
      .user-info {
        display: flex;
        align-items: center;
        padding: 20rpx;
        
        .avatar {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
          margin-right: 20rpx;
        }
        
        .nickname {
          font-size: 28rpx;
          font-weight: 500;
          color: #333;
        }
      }
      
      .media-swiper {
        width: 100%;
        height: 750rpx;
        
        .media-item {
          width: 100%;
          height: 100%;
        }
      }
      
      .interaction {
        padding: 20rpx;
        
        .stats {
          display: flex;
          gap: 30rpx;
          margin-bottom: 16rpx;
          
          .item {
            display: flex;
            align-items: center;
            gap: 8rpx;
            
            .count {
              font-size: 28rpx;
              color: #333;
              font-weight: 500;
            }
            
            .label {
              font-size: 24rpx;
              color: #999;
            }
          }
        }
        
        .time-location {
          font-size: 24rpx;
          color: #999;
          
          .location {
            margin-left: 20rpx;
          }
        }
      }
    }
  }
}
</style> 