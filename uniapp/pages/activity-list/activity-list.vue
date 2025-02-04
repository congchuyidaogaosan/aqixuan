<template>
  <view class="activity-list">
    <!-- 头部搜索 -->
    <view class="header">
      <view class="location" @click="chooseLocation">
        <image src="/static/images/location.png" mode="aspectFit" class="location-icon"></image>
        <text>{{currentLocation || '故宫博物院'}}</text>
        <image src="/static/images/arrow-down.png" mode="aspectFit" class="arrow-icon"></image>
      </view>
      <view class="filter-box">
        <view class="filter-item" @click="showFilterPopup">
          <text class="label">{{getFilterText()}}</text>
          <image src="/static/images/arrow-down.png" mode="aspectFit" class="arrow-icon"></image>
        </view>
      </view>
    </view>
    
    <!-- 活动类型筛选 -->
    <scroll-view class="filter-tabs" scroll-x>
      <view class="tab-list">
        <view 
          class="tab-item" 
          :class="{'active': active.value.activityType === ''}"
          @click="showFilterPopup"
        >
          <text>筛选</text>
        </view>
        <view 
          class="tab-item" 
          :class="{'active': active.value.activityType === 0}"
          @click="selectType(0)"
        >
          <text>运动</text>
        </view>
        <view 
          class="tab-item" 
          :class="{'active': active.value.activityType === 1}"
          @click="selectType(1)"
        >
          <text>游戏</text>
        </view>
        <view 
          class="tab-item" 
          :class="{'active': active.value.activityType === 2}"
          @click="selectType(2)"
        >
          <text>旅行</text>
        </view>
        <view 
          class="tab-item" 
          :class="{'active': active.value.activityType === 3}"
          @click="selectType(3)"
        >
          <text>学习</text>
        </view>
        <view 
          class="tab-item" 
          :class="{'active': active.value.activityType === 4}"
          @click="selectType(4)"
        >
          <text>美食</text>
        </view>
        <view 
          class="tab-item" 
          :class="{'active': active.value.activityType === 5}"
          @click="selectType(5)"
        >
          <text>电影</text>
        </view>
        <view 
          class="tab-item" 
          :class="{'active': active.value.activityType === 6}"
          @click="selectType(6)"
        >
          <text>其他</text>
        </view>
      </view>
    </scroll-view>
    
    <!-- 活动列表 -->
    <scroll-view class="activity-content" scroll-y @scrolltolower="loadMore">
      <view class="activity-item" v-for="(item, index) in activityList" :key="index" @click="goToDetail(item.id)">
        <view class="activity-main">
          <!-- 活动图片 -->
          <image :src="item.image || '/static/images/default-activity.png'" mode="aspectFill" class="activity-image"></image>
          
          <!-- 活动基本信息 -->
          <view class="activity-info">
            <!-- 活动类型标签 -->
            <text class="type-tag">{{getActivityTypeName(item.activityType)}}</text>
            
            <!-- 发起人信息 -->
            <view class="organizer-info">
              <image :src="item.organizer.avatarUrl || '/static/images/default-avatar.png'" mode="aspectFill" class="avatar"></image>
              <text class="nickname">{{item.organizer.nickname}}</text>
            </view>
            
            <!-- 活动标题 -->
            <view class="title">{{item.title}}</view>
            
            <!-- 活动描述 -->
            <view class="description">{{item.description}}</view>
          </view>
        </view>
        
        <!-- 底部信息 -->
        <view class="activity-footer">
          <view class="left-info">
            <!-- 活动状态 -->
            <view class="status-row">
              <text class="participants">共{{item.totalNumber}}人，差{{item.totalNumber - item.currentNumber}}人</text>
              <text class="time">{{item.startTime}}</text>
            </view>
            
            <!-- 费用信息 -->
            <view class="cost-info" v-if="item.costType !== 0">
              <text class="cost">{{getCostTypeText(item.costType, item.cost)}}</text>
              <text class="penalty" v-if="item.penaltyCost > 0">鸽子费{{item.penaltyCost}}元</text>
            </view>
          </view>
          
          <!-- 报名按钮 -->
          <view class="join-btn" :class="{
            'full': item.currentNumber >= item.totalNumber,
            'joined': item.signup
          }">
            {{getJoinButtonText(item)}}
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
      <image src="/static/images/xiangji.png" mode="aspectFit"></image>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getActivityList } from '@/api/user'

// 当前位置
const currentLocation = ref('')

// 筛选条件
const active = ref({
  activityType: '',  // 空字符串表示不筛选
  minNumber: undefined,  // 最小人数
  maxNumber: undefined,  // 最大人数
  minCost: undefined,  // 最小费用
  maxCost: undefined  // 最大费用
})

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
  // 如果点击当前已选中的类型，则取消选择
  if (active.value.activityType === type) {
    active.value.activityType = ''
  } else {
    active.value.activityType = type
  }
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
  console.log(active.value)
  getActivityList(page.value, pageSize, active.value)
    .then(res => {
      if (res && Array.isArray(res)) {
        // 处理数据，将活动信息和用户信息组合
        const list = res.map(item => ({
          id: item.activity.id,
          userId: item.activity.userId,
          activityType: Number(item.activity.activityType),
          title: item.activity.title,
          description: item.activity.description,
          location: item.activity.location,
          totalNumber: item.activity.totalNumber,
          currentNumber: item.activity.currentNumber,
          startTime: item.activity.startTime,
          endTime: item.activity.endTime,
          cost: item.activity.cost,
          costType: item.activity.costType,
          penaltyCost: item.activity.penaltyCost,
          status: item.activity.status,
          // 用户信息
          organizer: {
            id: item.user.id,
            nickname: item.user.nickname,
            avatarUrl: item.user.avatarUrl
          },
          // 报名信息
          signup: item.activitySignup
        }))
        
        activityList.value = page.value === 1 ? list : [...activityList.value, ...list]
        
        // 判断是否还有更多数据
        if (list.length < pageSize) {
          noMore.value = true
        }
        page.value++
      } else {
        uni.showToast({
          title: '数据格式错误',
          icon: 'none'
        })
      }
    })
    .catch(err => {
      uni.showToast({
        title: err.message || '网络错误',
        icon: 'none'
      })
    })
    .finally(() => {
      isLoading.value = false
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

// 人数筛选
const showNumberFilter = () => {
  uni.showActionSheet({
    itemList: ['不限', '2人', '3-5人', '5-10人', '10人以上'],
    success: (res) => {
      switch(res.tapIndex) {
        case 0: // 不限
          active.value.minNumber = undefined
          active.value.maxNumber = undefined
          break
        case 1: // 2人
          active.value.minNumber = 2
          active.value.maxNumber = 2
          break
        case 2: // 3-5人
          active.value.minNumber = 3
          active.value.maxNumber = 5
          break
        case 3: // 5-10人
          active.value.minNumber = 5
          active.value.maxNumber = 10
          break
        case 4: // 10人以上
          active.value.minNumber = 10
          active.value.maxNumber = 999
          break
      }
      refreshList()
    }
  })
}

// 金额筛选
const showCostFilter = () => {
  uni.showActionSheet({
    itemList: ['不限', '免费', '1-50元', '50-100元', '100元以上'],
    success: (res) => {
      switch(res.tapIndex) {
        case 0: // 不限
          active.value.minCost = undefined
          active.value.maxCost = undefined
          break
        case 1: // 免费
          active.value.minCost = 0
          active.value.maxCost = 0
          break
        case 2: // 1-50元
          active.value.minCost = 1
          active.value.maxCost = 50
          break
        case 3: // 50-100元
          active.value.minCost = 50
          active.value.maxCost = 100
          break
        case 4: // 100元以上
          active.value.minCost = 100
          active.value.maxCost = 999999
          break
      }
      refreshList()
    }
  })
}

// 重置筛选
const resetActive = () => {
  active.value = {
    activityType: '',  // 重置为空字符串
    minNumber: undefined,  // 重置为undefined
    maxNumber: undefined,
    minCost: undefined,  // 重置为undefined
    maxCost: undefined
  }
  refreshList()
}

// 筛选弹窗
const showFilterPopup = () => {
  uni.showActionSheet({
    itemList: ['按类型筛选', '按人数筛选', '按金额筛选', '重置筛选'],
    success: (res) => {
      switch(res.tapIndex) {
        case 0:
          setTimeout(() => {
            showTypeFilter()
          }, 100)
          break
        case 1:
          setTimeout(() => {
            showNumberFilter()
          }, 100)
          break
        case 2:
          setTimeout(() => {
            showCostFilter()
          }, 100)
          break
        case 3:
          resetActive()
          break
      }
    }
  })
}

// 类型筛选
const showTypeFilter = () => {
  uni.showActionSheet({
    itemList: ['不限', '运动', '游戏', '旅行', '学习', '美食', '电影', '其他'],
    success: (res) => {
      // 如果选择"不限"，则设置为空字符串
      active.value.activityType = res.tapIndex === 0 ? '' : res.tapIndex - 1
      refreshList()
    }
  })
}

// 获取费用类型文本
const getCostTypeText = (costType, cost) => {
  switch(costType) {
    case 1:
      return `AA制 每人${(cost / totalNumber).toFixed(2)}元`
    case 2:
      return `费用${cost}元`
    default:
      return '免费'
  }
}

// 获取报名按钮文本
const getJoinButtonText = (item) => {
  if (item.signup) return '已报名'
  if (item.currentNumber >= item.totalNumber) return '人数已满'
  return '立即报名'
}

// 获取筛选文本
const getFilterText = () => {
  const texts = []
  
  // 活动类型
  if (active.value.activityType !== '') {
    texts.push(getActivityTypeName(active.value.activityType))
  }
  
  // 人数
  if (active.value.minNumber !== undefined) {
    if (active.value.minNumber === active.value.maxNumber) {
      if (active.value.minNumber === 2) {
        texts.push('2人')
      }
    } else if (active.value.minNumber === 3 && active.value.maxNumber === 5) {
      texts.push('3-5人')
    } else if (active.value.minNumber === 5 && active.value.maxNumber === 10) {
      texts.push('5-10人')
    } else if (active.value.minNumber === 10) {
      texts.push('10人以上')
    }
  }
  
  // 费用
  if (active.value.minCost !== undefined) {
    if (active.value.minCost === 0 && active.value.maxCost === 0) {
      texts.push('免费')
    } else if (active.value.minCost === 1 && active.value.maxCost === 50) {
      texts.push('1-50元')
    } else if (active.value.minCost === 50 && active.value.maxCost === 100) {
      texts.push('50-100元')
    } else if (active.value.minCost === 100) {
      texts.push('100元以上')
    }
  }
  
  return texts.length > 0 ? texts.join('·') : '筛选'
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
    
    .filter-box {
      flex: 1;
      
      .filter-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 64rpx;
        padding: 0 20rpx;
        background: #f5f5f5;
        border-radius: 32rpx;
        
        .label {
          font-size: 28rpx;
          color: #333;
        }
        
        .arrow-icon {
          width: 24rpx;
          height: 24rpx;
          margin-left: 8rpx;
        }
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
    width: auto;
    height: calc(100vh - 88rpx - 88rpx);
    padding: 20rpx;
    
    .activity-item {
      margin-bottom: 20rpx;
      background: #fff;
      border-radius: 12rpx;
      overflow: hidden;
      
      .activity-main {
        display: flex;
        height: 300rpx;
        
        .activity-image {
          width: 50%;
          height: 100%;
        }
        
        .activity-info {
          flex: 1;
          padding: 20rpx;
          display: flex;
          flex-direction: column;
          
          .type-tag {
            display: inline-block;
            padding: 4rpx 16rpx;
            font-size: 24rpx;
            color: #007AFF;
            background: rgba(0, 122, 255, 0.1);
            border-radius: 20rpx;
            margin-bottom: 12rpx;
          }
          
          .title {
            font-size: 32rpx;
            font-weight: 500;
            color: #333;
            margin-bottom: 12rpx;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }
          
          .description {
            font-size: 26rpx;
            color: #666;
            margin-bottom: 12rpx;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }
          
          .organizer-info {
            display: flex;
            align-items: center;
            gap: 12rpx;
            margin-bottom: 12rpx;
            
            .avatar {
              width: 40rpx;
              height: 40rpx;
              border-radius: 50%;
            }
            
            .nickname {
              font-size: 24rpx;
              color: #666;
            }
          }
        }
      }
      
      .activity-footer {
        padding: 16rpx 20rpx;
        border-top: 1rpx solid #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: space-between;
        
        .left-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8rpx;
          
          .status-row {
            display: flex;
            align-items: center;
            gap: 16rpx;
            
            .participants {
              font-size: 24rpx;
              color: #666;
            }
            
            .time {
              font-size: 24rpx;
              color: #999;
            }
          }
          
          .cost-info {
            display: flex;
            align-items: center;
            gap: 12rpx;
            
            .cost {
              font-size: 24rpx;
              color: #ff6b6b;
              font-weight: 500;
            }
            
            .penalty {
              font-size: 22rpx;
              color: #999;
              background: #f5f5f5;
              padding: 4rpx 12rpx;
              border-radius: 20rpx;
            }
          }
        }
        
        .join-btn {
          padding: 8rpx 24rpx;
          font-size: 24rpx;
          color: #fff;
          background: #007AFF;
          border-radius: 24rpx;
          margin-left: 20rpx;
          
          &.full {
            background: #ccc;
          }
          
          &.joined {
            background: #67C23A;
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
    right: 30rpx;
    bottom: 120rpx;
    width: 88rpx;
    height: 88rpx;
    background: linear-gradient(135deg, #007AFF, #0056b3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6rpx 20rpx rgba(0, 122, 255, 0.3);
    z-index: 100;
    
    image {
      width: 40rpx;
      height: 40rpx;
    }
    
    &::after {
      content: '';
      position: absolute;
      left: -6rpx;
      top: -6rpx;
      right: -6rpx;
      bottom: -6rpx;
      background: rgba(0, 122, 255, 0.1);
      border-radius: 50%;
      z-index: -1;
    }
  }
}
</style> 