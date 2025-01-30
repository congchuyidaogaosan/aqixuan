<template>
  <view class="activity-list">
    <!-- 头部搜索 -->
    <view class="header">
      <view class="location" @click="chooseLocation">
        <image src="/static/images/location.png" mode="aspectFit" class="location-icon"></image>
        <text>{{currentLocation || '故宫博物院'}}</text>
        <image src="/static/images/arrow-down.png" mode="aspectFit" class="arrow-icon"></image>
      </view>
      <view class="search-box" @click="goToSearch">
        <image src="/static/images/search.png" mode="aspectFit" class="search-icon"></image>
        <text class="placeholder">搜索活动</text>
      </view>
    </view>
    
    <!-- 活动类型筛选 -->
    <scroll-view class="filter-tabs" scroll-x>
      <view class="tab-list">
        <view 
          class="tab-item" 
          :class="{'active': selectedType === 'all'}"
          @click="selectType('all')"
        >
          <text>筛选</text>
        </view>
        <view 
          class="tab-item" 
          :class="{'active': selectedType === 'date'}"
          @click="selectType('date')"
        >
          <text>日期</text>
        </view>
        <view 
          class="tab-item" 
          :class="{'active': selectedType === 'sports'}"
          @click="selectType('sports')"
        >
          <text>运动搭</text>
        </view>
        <view 
          class="tab-item" 
          :class="{'active': selectedType === 'food'}"
          @click="selectType('food')"
        >
          <text>饭搭子</text>
        </view>
        <view 
          class="tab-item" 
          :class="{'active': selectedType === 'art'}"
          @click="selectType('art')"
        >
          <text>文艺搭</text>
        </view>
        <view 
          class="tab-item" 
          :class="{'active': selectedType === 'travel'}"
          @click="selectType('travel')"
        >
          <text>旅游搭</text>
        </view>
        <view 
          class="tab-item" 
          :class="{'active': selectedType === 'outdoor'}"
          @click="selectType('outdoor')"
        >
          <text>户外搭</text>
        </view>
      </view>
    </scroll-view>
    
    <!-- 活动列表 -->
    <scroll-view class="activity-content" scroll-y @scrolltolower="loadMore">
      <view class="activity-item" v-for="(item, index) in activityList" :key="index" @click="goToDetail(item.id)">
        <!-- 活动图片 -->
        <image :src="item.image" mode="aspectFill" class="activity-image"></image>
        
        <!-- 活动信息 -->
        <view class="activity-info">
          <!-- 活动类型标签 -->
          <text class="type-tag">{{getActivityTypeName(item.activityType)}}</text>
          
          <!-- 活动标题 -->
          <view class="title">{{item.title}}</view>
          
          <!-- 活动描述 -->
          <view class="description">{{item.description}}</view>
          
          <!-- 活动状态 -->
          <view class="status-row">
            <view class="participants">
              <text>共{{item.totalNumber}}人，差{{item.totalNumber - item.currentNumber}}人</text>
            </view>
            <view class="distance">{{item.distance}}km</view>
          </view>
          
          <!-- 评论数 -->
          <view class="comment-count" v-if="item.commentCount > 0">
            评论({{item.commentCount}})
          </view>
          
          <!-- 报名按钮 -->
          <view class="join-btn" :class="{'full': item.currentNumber >= item.totalNumber}">
            {{item.currentNumber >= item.totalNumber ? '人数已满' : '立即报名'}}
          </view>
        </view>
      </view>
      
      <!-- 加载更多 -->
      <view class="loading-more" v-if="isLoading">
        <text>加载中...</text>
      </view>
      <view class="no-more" v-if="noMore">
        <text>没有更多了</text>
      </view>
    </scroll-view>
    
    <!-- 发布按钮 -->
    <view class="publish-btn" @click="goToPublish">
      <image src="/static/images/publish.png" mode="aspectFit"></image>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 当前位置
const currentLocation = ref('')

// 选中的类型
const selectedType = ref('all')

// 活动列表
const activityList = ref([])

// 加载状态
const isLoading = ref(false)
const noMore = ref(false)
const page = ref(1)
const pageSize = 10

// 选择位置
const chooseLocation = () => {
  uni.chooseLocation({
    success: (res) => {
      currentLocation.value = res.name
      // 重新加载列表
      refreshList()
    }
  })
}

// 前往搜索页
const goToSearch = () => {
  uni.navigateTo({
    url: '/pages/activity-search/activity-search'
  })
}

// 选择类型
const selectType = (type) => {
  selectedType.value = type
  refreshList()
}

// 获取活动类型名称
const getActivityTypeName = (type) => {
  const types = {
    0: '运动',
    1: '游戏',
    2: '旅行',
    3: '学习',
    4: '美食',
    5: '电影',
    6: '其他'
  }
  return types[type] || '其他'
}

// 刷新列表
const refreshList = () => {
  page.value = 1
  noMore.value = false
  activityList.value = []
  loadActivityList()
}

// 加载活动列表
const loadActivityList = () => {
  if (isLoading.value || noMore.value) return
  
  isLoading.value = true
  
  uni.request({
    url: '/Activity/findall',
    method: 'GET',
    data: {
      page: page.value,
      pageSize: pageSize,
      type: selectedType.value === 'all' ? '' : selectedType.value
    },
    success: (res) => {
      const { data } = res
      if (data.code === 0 && data.data) {
        const list = data.data.list || []
        activityList.value = page.value === 1 ? list : [...activityList.value, ...list]
        
        // 判断是否还有更多数据
        if (list.length < pageSize) {
          noMore.value = true
        }
        page.value++
      } else {
        uni.showToast({
          title: data.msg || '加载失败',
          icon: 'none'
        })
      }
    },
    fail: () => {
      uni.showToast({
        title: '网络错误',
        icon: 'none'
      })
    },
    complete: () => {
      isLoading.value = false
    }
  })
}

// 加载更多
const loadMore = () => {
  loadActivityList()
}

// 前往详情页
const goToDetail = (id) => {
  uni.navigateTo({
    url: '/pages/activity-detail/activity-detail?id=' + id
  })
}

// 前往发布页
const goToPublish = () => {
  uni.navigateTo({
    url: '/pages/publish-partner/publish-partner'
  })
}

onMounted(() => {
  loadActivityList()
})
</script>

<style lang="less" scoped>
.activity-list {
  min-height: 100vh;
  background: #f8f8f8;
  
  .header {
    display: flex;
    align-items: center;
    padding: 20rpx;
    background: #fff;
    
    .location {
      display: flex;
      align-items: center;
      gap: 8rpx;
      margin-right: 20rpx;
      
      .location-icon {
        width: 32rpx;
        height: 32rpx;
      }
      
      text {
        font-size: 28rpx;
        color: #333;
        max-width: 200rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .arrow-icon {
        width: 24rpx;
        height: 24rpx;
      }
    }
    
    .search-box {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8rpx;
      height: 64rpx;
      padding: 0 20rpx;
      background: #f5f5f5;
      border-radius: 32rpx;
      
      .search-icon {
        width: 32rpx;
        height: 32rpx;
      }
      
      .placeholder {
        font-size: 28rpx;
        color: #999;
      }
    }
  }
  
  .filter-tabs {
    background: #fff;
    white-space: nowrap;
    border-bottom: 1rpx solid #f5f5f5;
    
    .tab-list {
      display: inline-flex;
      padding: 0 20rpx;
      
      .tab-item {
        padding: 20rpx 30rpx;
        
        text {
          font-size: 28rpx;
          color: #666;
        }
        
        &.active {
          position: relative;
          
          text {
            color: #007AFF;
            font-weight: 500;
          }
          
          &::after {
            content: '';
            position: absolute;
            left: 50%;
            bottom: 0;
            transform: translateX(-50%);
            width: 40rpx;
            height: 4rpx;
            background: #007AFF;
            border-radius: 2rpx;
          }
        }
      }
    }
  }
  
  .activity-content {
    height: calc(100vh - 88rpx - 88rpx);
    padding: 20rpx;
    
    .activity-item {
      margin-bottom: 20rpx;
      background: #fff;
      border-radius: 12rpx;
      overflow: hidden;
      
      .activity-image {
        width: 100%;
        height: 300rpx;
      }
      
      .activity-info {
        padding: 20rpx;
        
        .type-tag {
          display: inline-block;
          padding: 4rpx 16rpx;
          font-size: 24rpx;
          color: #007AFF;
          background: rgba(0, 122, 255, 0.1);
          border-radius: 20rpx;
          margin-bottom: 16rpx;
        }
        
        .title {
          font-size: 32rpx;
          font-weight: 500;
          color: #333;
          margin-bottom: 12rpx;
        }
        
        .description {
          font-size: 28rpx;
          color: #666;
          margin-bottom: 16rpx;
        }
        
        .status-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16rpx;
          
          .participants {
            font-size: 26rpx;
            color: #666;
          }
          
          .distance {
            font-size: 26rpx;
            color: #999;
          }
        }
        
        .comment-count {
          font-size: 26rpx;
          color: #999;
          margin-bottom: 16rpx;
        }
        
        .join-btn {
          display: inline-block;
          padding: 12rpx 40rpx;
          font-size: 28rpx;
          color: #fff;
          background: #007AFF;
          border-radius: 30rpx;
          
          &.full {
            background: #ccc;
          }
        }
      }
    }
    
    .loading-more, .no-more {
      text-align: center;
      padding: 20rpx 0;
      
      text {
        font-size: 26rpx;
        color: #999;
      }
    }
  }
  
  .publish-btn {
    position: fixed;
    right: 40rpx;
    bottom: 40rpx;
    width: 100rpx;
    height: 100rpx;
    background: #007AFF;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 16rpx rgba(0, 122, 255, 0.3);
    
    image {
      width: 48rpx;
      height: 48rpx;
    }
  }
}
</style> 