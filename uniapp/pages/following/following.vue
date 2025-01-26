<template>
  <view class="following-container">
    <!-- 筛选和排序栏 -->
    <view class="filter-bar">
      <!-- 筛选按钮 -->
      <button class="filter-btn" @click="showFilter">
        <image
            src="/static/images/shaixuan.png"
            mode="scaleToFill"
            class="icon"
        />
        <text>筛选</text>
      </button>
      
      <!-- 排序选项 -->
      <view class="sort-options">
        <view 
          class="sort-item" 
          :class="{ active: sortType === 'time' }"
          @click="handleSort('time')"
        >
          关注时间
        </view>
        <view 
          class="sort-item" 
          :class="{ active: sortType === 'distance' }"
          @click="handleSort('distance')"
        >
          距离优先
        </view>
      </view>
    </view>
    
    <!-- 用户列表 -->
    <scroll-view 
      class="user-list"
      scroll-y
      @scrolltolower="loadMore"
      :refresher-enabled="true"
      :refresher-triggered="refreshing"
      @refresherrefresh="refresh"
    >
      <!-- 空状态 -->
      <view class="empty-state" v-if="!loading && userList.length === 0">
        <image 
          src="/static/images/empty-follow.png" 
          mode="aspectFit" 
          class="empty-image"
        ></image>
        <text class="empty-text">还没有关注任何人哦~</text>
      </view>
      
      <!-- 用户列表 -->
      <template v-else>
        <view 
          class="user-item"
          v-for="user in userList"
          :key="user.id"
          @click="goToProfile(user.followedUserId)"
        >
          <image :src="user.avatarUrl || '/static/default-avatar.png'" mode="aspectFill" class="avatar"></image>
          <view class="info">
            <view class="basic">
              <text class="nickname">{{user.nickname}}</text>
            </view>
            <view class="extra">
              <text class="age" v-if="user.birthday">{{calculateAge(user.birthday)}}岁</text>
              <!-- <text class="role">{{user.roleType || '未设置'}}</text> -->
              <text class="distance">{{calculateDistance(user.positioning)}}</text>
            </view>
          </view>
        </view>
        
        <!-- 加载更多 -->
        <uni-load-more :status="loadingStatus" :content-text="loadMoreText"></uni-load-more>
      </template>
    </scroll-view>
    
    <!-- 筛选弹框 -->
    <uni-popup ref="filterPopup" type="bottom">
      <view class="filter-popup">
        <view class="popup-header">
          <text>筛选条件</text>
          <text class="close" @click="hideFilter">关闭</text>
        </view>
        
        <!-- 年龄筛选 -->
        <view class="filter-section">
          <view class="section-title">年龄</view>
          <view class="option-list">
            <view 
              class="option-item"
              v-for="(age, index) in ageRanges"
              :key="index"
              :class="{ active: ageIndex === index }"
              @click="selectAge(index)"
            >
              {{age}}
            </view>
          </view>
        </view>
        
        <!-- 角色筛选 -->
        <view class="filter-section">
          <view class="section-title">角色</view>
          <view class="option-list">
            <view 
              class="option-item"
              v-for="(role, index) in roleTypes"
              :key="index"
              :class="{ active: roleIndex === index }"
              @click="selectRole(index)"
            >
              {{role}}
            </view>
          </view>
        </view>
        
        <!-- 确认按钮 -->
        <button class="confirm-btn" @click="confirmFilter">确认</button>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFollowingList } from '@/api/user.js'
import { formatDistance } from '@/utils/distance.js'

// 筛选选项
const ageRanges = ['全部', '18-24岁', '25-30岁', '31-40岁', '40岁以上']
const roleTypes = ['全部', '学生', '职场人', '创业者', '自由职业']

// 选中的索引
const ageIndex = ref(0)
const roleIndex = ref(0)
const sortType = ref('time') // 'time' 或 'distance'

// 弹框引用
const filterPopup = ref(null)

// 列表数据
const userList = ref([])
const page = ref(1)
const pageSize = ref(20)
const loadingStatus = ref('more')
const refreshing = ref(false)

// 加载状态
const loading = ref(false)
const loadMoreText = {
  contentdown: '上拉加载更多',
  contentrefresh: '加载中...',
  contentnomore: '没有更多了'
}

// 计算年份
const calculateYear = (age) => {
  const currentYear = new Date().getFullYear()
  return currentYear - age
}

// 获取列表数据
const loadData = async (isRefresh = false) => {
  if (loadingStatus.value === 'loading') return
  
  if (isRefresh) {
    page.value = 1
    loading.value = true
  } else {
    loadingStatus.value = 'loading'
  }
  
  try {
    // 处理年龄范围
    let minAge = null
    let maxAge = null
    if (ageIndex.value > 0) {
      const ageRange = ageRanges[ageIndex.value]
      const ages = ageRange.replace('岁', '').split('-')
      // 将年龄转换为年份
      if (ages.length === 2) {
        // 处理范围，如"18-24岁"
        maxAge = calculateYear(parseInt(ages[1])) // 24岁对应2000年（较小年份）
        minAge = calculateYear(parseInt(ages[0])) // 18岁对应2006年（较大年份）
      } else {
        // 处理"40岁以上"的情况
        maxAge = calculateYear(parseInt(ages[0])) // 40岁对应1984年（较小年份）
        minAge = calculateYear(parseInt(ages[0])) + 1 // 1985年（比40岁的年份大）
      }
    }
    
    // 基础参数
    const params = {
      page: page.value,
      limit: pageSize.value,
      ORDER: 'DESC'
    }

    // 只有选择了年龄范围才添加年龄参数
    if (ageIndex.value > 0) {
      params.MaxAge = maxAge + "-01-01"
      params.MinAge = minAge + "-12-31"
    }

    // 只有选择了角色才添加角色参数
    if (roleIndex.value > 0) {
      params.Role = roleTypes[roleIndex.value]
    }

    // 只有在对应排序方式下才添加排序参数
    if (sortType.value === 'time') {
      params.payAttentionToTime = true
    } else if (sortType.value === 'distance') {
      params.Distance = true
    }

    const res = await getFollowingList(params)
    const records = res.records || []
    
    if (isRefresh) {
      userList.value = records
    } else {
      userList.value.push(...records)
    }
    
    // 根据total判断是否还有更多数据
    const total = res.total || 0
    loadingStatus.value = userList.value.length >= total ? 'noMore' : 'more'
    
    if (loadingStatus.value === 'more') {
      page.value++
    }
  } catch (error) {
    console.log('获取关注列表失败：', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
    loadingStatus.value = 'more'
  } finally {
    loading.value = false
    if (isRefresh) {
      refreshing.value = false
      uni.stopPullDownRefresh()
    }
  }
}

// 显示/隐藏筛选弹框
const showFilter = () => {
  filterPopup.value.open()
}

const hideFilter = () => {
  filterPopup.value.close()
}

// 选择筛选条件
const selectAge = (index) => {
  ageIndex.value = index
}

const selectRole = (index) => {
  roleIndex.value = index
}

// 确认筛选
const confirmFilter = () => {
  hideFilter()
  refresh()
}

// 切换排序方式
const handleSort = (type) => {
  if (sortType.value === type) return
  sortType.value = type
  refresh()
}

// 加载更多
const loadMore = () => {
  loadData()
}

// 刷新
const refresh = async () => {
  refreshing.value = true
  await loadData(true)
}

// 跳转到用户主页
const goToProfile = (userId) => {
  uni.navigateTo({
    url: `/pages/profile/profile?userId=${userId}`
  })
}

// 计算年龄
const calculateAge = (birthday) => {
  const today = new Date()
  const birthDate = new Date(birthday)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

// 计算距离
const calculateDistance = (positioning) => {
  if (!positioning) return '未知'
  // 距离单位转换 1000米=1公里
  const distance = positioning / 1000
  if (distance < 1) {
    return distance * 1000 + '米'
  } else {
    return distance + '公里'
  }
}

// 页面加载
onMounted(() => {
  loadData()
})
</script>

<style lang="less" scoped>
.following-container {
  min-height: 100vh;
  background: #f8f8f8;
  
  .filter-bar {
    display: flex;
    align-items: center;
    padding: 20rpx;
    background: #fff;
    position: sticky;
    top: 0;
    z-index: 1;
    
    .filter-btn {
      display: flex;
      align-items: center;
      gap: 4rpx;
      font-size: 24rpx;
      color: #666;
      background: none;
      padding: 10rpx 20rpx;
      margin: 0;
      height: 56rpx;
      line-height: 1;
      
      .icon {
        width: 28rpx;
        height: 28rpx;
      }
      
      &::after {
        border: none;
      }
    }
    
    .sort-options {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      gap: 40rpx;
      padding-right: 20rpx;
      
      .sort-item {
        font-size: 24rpx;
        color: #666;
        padding: 10rpx 0;
        position: relative;
        
        &.active {
          color: #007AFF;
          
          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
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
  
  .filter-popup {
    background: #fff;
    border-radius: 24rpx 24rpx 0 0;
    padding: 30rpx;
    
    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30rpx;
      padding: 20rpx 0;
      font-size: 28rpx;
      font-weight: 500;
      
      .close {
        color: #999;
        font-size: 24rpx;
        font-weight: normal;
      }
    }
    
    .filter-section {
      margin-bottom: 30rpx;
      
      .section-title {
        font-size: 26rpx;
        color: #333;
        margin-bottom: 16rpx;
      }
      
      .option-list {
        display: flex;
        flex-wrap: wrap;
        gap: 16rpx;
        
        .option-item {
          padding: 8rpx 24rpx;
          border-radius: 30rpx;
          font-size: 24rpx;
          color: #666;
          background: #f5f5f5;
          
          &.active {
            color: #fff;
            background: #007AFF;
          }
        }
      }
    }
    
    .confirm-btn {
      width: 100%;
      height: 90rpx;
      line-height: 90rpx;
      background: #007AFF;
      color: #fff;
      border-radius: 45rpx;
      font-size: 32rpx;
      margin-top: 30rpx;
    }
  }
  
  .user-list {
    height: calc(100vh - 112rpx);
    
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding-top: 200rpx;
      
      .empty-image {
        width: 240rpx;
        height: 240rpx;
        margin-bottom: 20rpx;
      }
      
      .empty-text {
        font-size: 28rpx;
        color: #999;
      }
    }
    
    .user-item {
      display: flex;
      align-items: center;
      padding: 30rpx;
      background: #fff;
      margin-bottom: 2rpx;
      
      .avatar {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        margin-right: 20rpx;
      }
      
      .info {
        flex: 1;
        
        .basic {
          display: flex;
          align-items: center;
          gap: 20rpx;
          margin-bottom: 10rpx;
          
          .nickname {
            font-size: 32rpx;
            font-weight: 500;
            color: #333;
          }
        }
        
        .extra {
          display: flex;
          align-items: center;
          gap: 20rpx;
          font-size: 24rpx;
          color: #666;
        }
      }
    }
  }
}
</style> 