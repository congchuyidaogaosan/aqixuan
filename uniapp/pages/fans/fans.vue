<template>
  <view class="fans-container">
    <!-- 筛选栏 -->
    <view class="filter-bar">
      <!-- 年龄筛选 -->
      <picker 
        mode="selector" 
        :range="ageRanges" 
        :value="ageIndex"
        @change="handleAgeChange"
      >
        <view class="filter-item">
          <text>年龄：{{ageRanges[ageIndex]}}</text>
          <uni-icons type="bottom" size="12"></uni-icons>
        </view>
      </picker>
      
      <!-- 角色筛选 -->
      <picker 
        mode="selector" 
        :range="roleTypes" 
        :value="roleIndex"
        @change="handleRoleChange"
      >
        <view class="filter-item">
          <text>角色：{{roleTypes[roleIndex]}}</text>
          <uni-icons type="bottom" size="12"></uni-icons>
        </view>
      </picker>
      
      <!-- 排序方式 -->
      <picker 
        mode="selector" 
        :range="sortTypes" 
        :value="sortIndex"
        @change="handleSortChange"
      >
        <view class="filter-item">
          <text>排序：{{sortTypes[sortIndex]}}</text>
          <uni-icons type="bottom" size="12"></uni-icons>
        </view>
      </picker>
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
      <view 
        class="user-item"
        v-for="user in userList"
        :key="user.id"
        @click="goToProfile(user.id)"
      >
        <image :src="user.handImg || '/static/default-avatar.png'" mode="aspectFill" class="avatar"></image>
        <view class="info">
          <view class="basic">
            <text class="nickname">{{user.nickname}}</text>
            <!-- <text class="id">ID: {{user.id}}</text> -->
          </view>
          <view class="extra">
            <text class="age" v-if="user.age">{{user.age}}岁</text>
            <text class="role">{{user.roleType || '未设置'}}</text>
            <!-- 距离 -->
            <text class="distance">{{formatDistance(user.distance)}}</text>
          </view>
        </view>
        <!-- 关注按钮 -->
        <button 
          class="follow-btn" 
          :class="{ active: user.isFollowed }"
          @click.stop="handleFollow(user)"
        >
          {{user.isFollowed ? '已关注' : '关注'}}
        </button>
      </view>
      
      <!-- 加载更多 -->
      <uni-load-more :status="loadingStatus"></uni-load-more>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFansList, followUser, unfollowUser } from '@/api/user.js'
import { formatDistance } from '@/utils/distance.js'

// 筛选选项
const ageRanges = ['全部', '18-24岁', '25-30岁', '31-40岁', '40岁以上']
const roleTypes = ['全部', '学生', '职场人', '创业者', '自由职业']
const sortTypes = ['关注时间', '距离']

// 选中的索引
const ageIndex = ref(0)
const roleIndex = ref(0)
const sortIndex = ref(0)

// 列表数据
const userList = ref([])
const page = ref(1)
const pageSize = ref(20)
const loadingStatus = ref('more')
const refreshing = ref(false)

// 获取列表数据
const loadData = async (isRefresh = false) => {
  if (loadingStatus.value === 'loading') return
  
  if (isRefresh) {
    page.value = 1
  } else {
    loadingStatus.value = 'loading'
  }
  
  try {
    const params = {
      page: page.value,
      pageSize: pageSize.value,
      ageRange: ageIndex.value > 0 ? ageRanges[ageIndex.value] : null,
      roleType: roleIndex.value > 0 ? roleTypes[roleIndex.value] : null,
      sortBy: sortTypes[sortIndex.value]
    }
    
    const data = await getFansList(params)
    
    if (isRefresh) {
      userList.value = data
    } else {
      userList.value.push(...data)
    }
    
    loadingStatus.value = data.length < pageSize.value ? 'noMore' : 'more'
    page.value++
  } catch (error) {
    loadingStatus.value = 'more'
  } finally {
    if (isRefresh) {
      refreshing.value = false
    }
  }
}

// 处理关注/取消关注
const handleFollow = async (user) => {
  try {
    const success = user.isFollowed 
      ? await unfollowUser(user.followId)
      : await followUser(user.id)
      
    if (success) {
      user.isFollowed = !user.isFollowed
      uni.showToast({
        title: user.isFollowed ? '关注成功' : '已取消关注',
        icon: 'none'
      })
    }
  } catch (error) {
    uni.showToast({
      title: '操作失败',
      icon: 'none'
    })
  }
}

// 筛选变化处理
const handleAgeChange = (e) => {
  ageIndex.value = e.detail.value
  refresh()
}

const handleRoleChange = (e) => {
  roleIndex.value = e.detail.value
  refresh()
}

const handleSortChange = (e) => {
  sortIndex.value = e.detail.value
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

// 页面加载
onMounted(() => {
  loadData()
})
</script>

<style lang="less" scoped>
.fans-container {
  min-height: 100vh;
  background: #f8f8f8;
  
  .filter-bar {
    display: flex;
    justify-content: space-around;
    padding: 20rpx;
    background: #fff;
    position: sticky;
    top: 0;
    z-index: 1;
    
    .filter-item {
      display: flex;
      align-items: center;
      gap: 8rpx;
      font-size: 28rpx;
      color: #666;
    }
  }
  
  .user-list {
    height: calc(100vh - 112rpx);
    
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
          
          .id {
            font-size: 24rpx;
            color: #999;
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
      
      .follow-btn {
        min-width: 120rpx;
        height: 56rpx;
        line-height: 56rpx;
        font-size: 24rpx;
        color: #fff;
        background: linear-gradient(135deg, #8F8BFA, #7B78F9);
        border-radius: 28rpx;
        padding: 0 20rpx;
        margin: 0;
        
        &.active {
          background: #f5f5f5;
          color: #666;
        }
        
        &::after {
          border: none;
        }
      }
    }
  }
}
</style> 