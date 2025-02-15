<template>
  <view class="profile-container">
    <!-- 顶部渐变遮罩 -->
    <view class="top-gradient">
      <!-- 返回按钮 -->
      <view class="back-btn" @click="goBack">
        <image src="/static/images/fanhui.png" mode="aspectFit" class="icon"></image>
      </view>
    </view>
    
    <!-- 头像轮播和基本信息区域 -->
    <view class="header">
      <swiper 
        class="avatar-swiper" 
        circular 
        :indicator-dots="true"
        :indicator-color="'rgba(255, 255, 255, 0.4)'"
        :indicator-active-color="'#ffffff'"
        :style="{ height: swiperHeight + 'px' }"
        @change="handleChange"
      >
        <swiper-item v-for="(item, index) in userInfo.avatars" :key="index">
          <image :src="item.avatarUrl" mode="aspectFill" class="swiper-image"></image>
        </swiper-item>
      </swiper>
      
      <!-- 自定义指示器 -->
      <view class="custom-indicators">
        <view 
          v-for="(item, index) in userInfo.avatars" 
          :key="index"
          class="indicator-line"
          :class="{active: currentIndex === index }"
        ></view>
      </view>
      
      <!-- 基本信息覆盖层 -->
      <view class="info-overlay">
        <view class="basic-info">
          <view class="left">
            <text class="nickname">{{userInfo.nickname || '未设置昵称'}}</text>
            <view class="stats">
              <text class="stat">{{calculateAge(userInfo.birthday) || '--'}}岁</text>
              <text class="dot">·</text>
              <text class="stat">{{userInfo.height || '--'}}cm</text>
              <text class="dot">/</text>
              <text class="stat">{{userInfo.weight || '--'}}kg</text>
              <text class="dot">·</text>
              <text class="stat">{{distance || '--'}}米</text>
            </view>
            <view class="popularity">
              {{fansCount || 0}}人气
            </view>
          </view>
          <view class="right">
            <view class="ip">IP属地：{{ipLocation || '未知'}}</view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 用户基本信息 -->
    <view class="user-info">
      <view class="introduction">
        <text>{{userInfo.introduction || '这个人很懒，什么都没写~'}}</text>
      </view>
      
     
      
      <!-- 标签信息 -->
      <view class="tags">
        <view class="tag-item" v-if="userInfo.interests?.length">
          <image src="/static/images/xingqu.png" mode="aspectFill" class="icon"></image>
          <text class="label">兴趣是</text>
          <text class="value">{{userInfo.interests.join('、')}}</text>
        </view>
        <view class="tag-item" v-if="userInfo.industry">
          <image src="/static/images/hangye.png" mode="aspectFill" class="icon"></image>
          <text class="label">从事的行业是</text>
          <text class="value">{{userInfo.industry}}</text>
        </view>
        <view class="tag-item" v-if="userInfo.location">
          <image src="/static/images/juzhudi.png" mode="aspectFill" class="icon"></image>
          <text class="label">居住地址</text>
          <text class="value">{{userInfo.location}}</text>
        </view>
        <view class="tag-item" v-if="userInfo.emotionStatus">
          <image src="/static/images/ganqing.png" mode="aspectFill" class="icon"></image>
          <!-- <text class="label">感情状况</text> -->
          <text class="value">{{userInfo.emotionStatus}}</text>
        </view>
        <view class="tag-item" v-if="userInfo.datingPurpose">
          <image src="/static/images/mudi.png" mode="aspectFill" class="icon"></image>
          <text class="label"></text>
          <text class="value">{{userInfo.datingPurpose}}</text>
        </view>
      </view>
    </view>
    
     <!-- 星座和MBTI -->
     <view class="constellation-mbti">
        <view class="constellation" v-if="userInfo.constellation">
          <image 
            :src="`/static/images/${constellations[userInfo.constellation]}.png`"
            mode="aspectFill" 
            class="icon"
          ></image>
          <text class="value">{{userInfo.constellation}}</text>
        </view>
        
        <view class="mbti">
          <image src="/static/images/mbti.png" mode="aspectFill" class="icon"></image>
          <text class="value">{{userInfo.mbti}}</text>
        </view>
      </view>

    <!-- 动态列表 -->
    <scroll-view 
      class="moment-list"
      scroll-y
      @scrolltolower="loadMore"
      :refresher-enabled="true"
      :refresher-triggered="refreshing"
      @refresherrefresh="refresh"
    >
      <!-- 空状态 -->
      <view class="empty-state" v-if="!loading && momentList.length === 0">
        <image 
          src="/static/images/empty-moment.png" 
          mode="aspectFit" 
          class="empty-image"
        ></image>
        <text class="empty-text">还没有发布任何动态哦~</text>
      </view>
      
      <!-- 动态列表 -->
      <template v-else>
        <!-- 媒体网格 -->
        <view class="media-grid">
          <template v-for="moment in momentList" :key="moment.id">
            <template v-if="moment.list && moment.list.length">
              <template v-for="(media, index) in moment.list" :key="media.id">
                <video
                  v-if="media.mediaType === '2'"
                  :src="media.mediaUrl"
                  class="media-item"
                  :controls="true"
                  :show-center-play-btn="true"
                  object-fit="cover"
                  @click="goToMomentList(moment.id)"
                ></video>
                <image 
                  v-else
                  :src="media.mediaUrl"
                  mode="aspectFill"
                  class="media-item"
                  @click="goToMomentList(moment.id)"
                ></image>
              </template>
            </template>
          </template>
        </view>
        
        <!-- 加载更多 -->
        <uni-load-more :status="loadingStatus" :content-text="loadMoreText"></uni-load-more>
      </template>
    </scroll-view>
    
    <!-- 底部按钮 -->
    <view class="bottom-btns">
      <template v-if="isMyProfile">
        <button class="action-btn" @click="publishMoment">
          <image src="/static/images/xiangji.png" mode="aspectFill" class="icon"></image>
        </button>
      </template>
      <template v-else>
        <!-- 关注 -->
        <button 
          class="action-btn" 
          :class="{ followed: isFollowed }"
          @click="handleFollow"
        >
          <image 
            :src="isFollowed ? '/static/images/yiguanzhu.png' : '/static/images/weiguanzhu.png'" 
            mode="aspectFill" 
            class="icon"
          ></image>
        </button>
        <!-- 私信 -->
        <button class="action-btn" @click="sendMessage">
          <image src="/static/images/dazhaohu.png" mode="aspectFill" class="icon"></image>
        </button>
      </template>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  getUserInfo as fetchUserInfo, 
  getUserAvatars, 
  getMyAvatarList, 
  getIpLocation,
  followUser,
  unfollowUser,
  checkFollow,
  getMomentList,
  getMomentListByUserId
} from '@/api/user.js'
import { calculateDistance, formatDistance, parseLocation } from '@/utils/distance.js'
// import { formatTime } from '@/utils/date.js'

// 用户信息
const userInfo = ref({
  avatars: [],
  nickname: '',
  introduction: '',
  age: '',
  height: '',
  weight: '',
  interests: [],
  industry: '',
  datingPurpose: '',
  constellation: '',
  mbti: ''
})

// 统计数据
const fansCount = ref(0)
const distance = ref('') // 距离
const ipLocation = ref('') // IP地址
const momentList = ref([])
const isMyProfile = ref(false) // 是否是我的主页

// 设备宽度
const swiperHeight = ref(0)

// 当前轮播图索引
const currentIndex = ref(0)

// 星座映射表（使用拼音作为图片名称）
const constellations = {
  '白羊座': 'muyangzuo',
  '金牛座': 'jinniuzuo',
  '双子座': 'shuangzizuo',
  '巨蟹座': 'juxiezuo',
  '狮子座': 'shizi',
  '处女座': 'chunvzuo',
  '天秤座': 'tianpingzuo',
  '天蝎座': 'tianxiezuo',
  '射手座': 'sheshouzuo',
  '摩羯座': 'mojiezuo',
  '水瓶座': 'shuipingzuo',
  '双鱼座': 'shuangyuzuo'
}

// 关注状态
const isFollowed = ref(false)
const followed = ref({})

// 动态列表数据
const loadingStatus = ref('more')
const refreshing = ref(false)
const loading = ref(false)

const loadMoreText = {
  contentdown: '上拉加载更多',
  contentrefresh: '加载中...',
  contentnomore: '没有更多了'
}

// 监听轮播图变化
const handleChange = (e) => {
  currentIndex.value = e.detail.current
}

// 获取设备宽度
const getSystemInfo = () => {
  const systemInfo = uni.getSystemInfoSync()
  swiperHeight.value = systemInfo.windowWidth
}

// 计算年龄
const calculateAge = (birthday) => {
  if (!birthday) return null
  
  const birthDate = new Date(birthday)
  const today = new Date()
  
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  // 如果还没到生日月份，或者到了生日月份但还没到具体日期，年龄减1
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

// 计算星座
const calculateConstellation = (birthday) => {
  if (!birthday) return null
  
  const date = new Date(birthday)
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  const constellationDates = {
    '白羊座': [3, 21, 4, 19],
    '金牛座': [4, 20, 5, 20],
    '双子座': [5, 21, 6, 21],
    '巨蟹座': [6, 22, 7, 22],
    '狮子座': [7, 23, 8, 22],
    '处女座': [8, 23, 9, 22],
    '天秤座': [9, 23, 10, 23],
    '天蝎座': [10, 24, 11, 22],
    '射手座': [11, 23, 12, 21],
    '摩羯座': [12, 22, 1, 19],
    '水瓶座': [1, 20, 2, 18],
    '双鱼座': [2, 19, 3, 20]
  }
  
  for (const [constellation, [startMonth, startDay, endMonth, endDay]] of Object.entries(constellationDates)) {
    if (
      (month === startMonth && day >= startDay) ||
      (month === endMonth && day <= endDay) ||
      // 特殊处理摩羯座跨年的情况
      (constellation === '摩羯座' && ((month === 12 && day >= 22) || (month === 1 && day <= 19)))
    ) {
      return constellation
    }
  }
  
  return null
}

// 获取IP地址信息
const getLocationByIp = async (ip) => {
  try {
    const res = await getIpLocation(ip)
    if (res) {
      ipLocation.value = res.location || '未知'
    }
  } catch (error) {
    console.log('获取IP地址信息失败：', error)
    ipLocation.value = '未知'
  }
}

// 获取用户信息
const loadUserInfo = async (userId) => {
  try {
    if (userId) {
      const [userRes, avatarRes] = await Promise.all([
        fetchUserInfo(userId),
        getUserAvatars(userId)
      ])
      
      if (userRes.data) {
        const info = userRes.data
        console.log(info)
        info.avatars = avatarRes.data
        if (typeof info.interests === 'string') {
          info.interests = info.interests.split('、')
        }
        // 计算星座
        info.constellation = calculateConstellation(info.birthday)
        userInfo.value = info
        console.log(userInfo.value)

        // 计算距离
        const myInfo = uni.getStorageSync('userInfo')
        if (myInfo?.ipAddress && info.ipAddress) {
          console.log(myInfo.ipAddress)
          console.log(info.ipAddress)
          const myLocation = parseLocation(myInfo.ipAddress)
          const targetLocation = parseLocation(info.ipAddress)
          if (myLocation && targetLocation) {
            const dist = calculateDistance(myLocation, targetLocation)
            distance.value = formatDistance(dist)
          }
        }

        // 获取IP地址信息
        if (info.ip) {
          await getLocationByIp(info.ip)
        }
      }
    } else {
      // 获取当前登录用户信息
      const info = uni.getStorageSync('userInfo')
      if (info) {
        try {
          const avatarRes = await getMyAvatarList()
          info.avatars = avatarRes.data
        } catch (error) {
          info.avatars = []
        }
        
        if (typeof info.interests === 'string') {
          info.interests = info.interests.split('、')
        }
        // 计算星座
        info.constellation = calculateConstellation(info.birthday)
        userInfo.value = info
      }
      // 获取IP地址信息
      if (info.ip) {
          await getLocationByIp(info.ip)
        }
    }
  } catch (error) {
    uni.showToast({
      title: '获取用户信息失败',
      icon: 'none'
    })
  }
}

// 获取动态列表
const loadMoments = async (userId, isRefresh = false) => {
  if (loadingStatus.value === 'loading') return
  
  if (isRefresh) {
    loading.value = true
  } else {
    loadingStatus.value = 'loading'
  }
  
  try {
    let res = []
    if (userId) {
      res = await getMomentListByUserId(userId)
    } else {
      res = await getMomentList()
    }
    const list = res || []
    if (isRefresh) {
      momentList.value = list
    } else {
      momentList.value.push(...list)
    }
    
    // 由于返回的是完整列表，所以加载完就没有更多了
    loadingStatus.value = 'noMore'
  } catch (error) {
    console.log('获取动态列表失败：', error)
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

// 跳转到动态列表
const goToMomentList = (momentId) => {
  // 获取当前用户ID
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const currentUserId = currentPage.options?.userId || uni.getStorageSync('userInfo')?.id
  
  // 构建跳转参数
  const params = {
    userId: currentUserId,
    nickname: userInfo.value.nickname,
    avatarUrl: userInfo.value.avatars[0].avatarUrl,
    momentId: momentId // 添加momentId参数
  }
  
  console.log(userInfo.value)

  // 将参数转换为查询字符串
  const query = Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')
  
  uni.navigateTo({
    url: `/pages/moment-list/moment-list?${query}`
  })
}

// 发布动态
const publishMoment = () => {
  uni.navigateTo({
    url: '/pages/publish-moment/publish-moment'
  })
}

// 发送私信
const sendMessage = () => {
  uni.navigateTo({
    url: `/pages/chat/chat?userId=${userInfo.value.id}`
  })
}

// 返回上一页
const goBack = () => {
  history.back();
}

// 检查关注状态
const checkFollowStatus = async (userId) => {
  if (!userId) return
  const res = await checkFollow(userId)
  if(res){
    followed.value = res
    isFollowed.value = true
  }else{
    isFollowed.value = false
  }
}

// 处理关注/取消关注
const handleFollow = async () => {
  if (!userInfo.value.id) return
  
  try {
    const success = isFollowed.value 
      ? await unfollowUser(followed.value.id)
      : await followUser(userInfo.value.id)
      
    if (success) {
      isFollowed.value = !isFollowed.value
      followed.value = {}
      checkFollowStatus(userInfo.value.id)
      uni.showToast({
        title: isFollowed.value ? '关注成功' : '已取消关注',
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

// 加载更多
const loadMore = () => {
  loadMoments()
}

// 刷新
const refresh = async () => {
  refreshing.value = true
  await loadMoments(true)
}

// 页面加载时获取用户信息和设备信息
onMounted(() => {
  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const userId = currentPage.options?.userId

  // 根据userId判断是否是我的主页
  isMyProfile.value = !userId || userId === uni.getStorageSync('userInfo')?.id
  
  // 获取用户信息
  loadUserInfo(userId)
  // 获取动态列表
  loadMoments(userId)
  getSystemInfo()
  
  // 如果不是自己的主页，检查关注状态
  if (!isMyProfile.value && userId) {
    checkFollowStatus(userId)
  }
  
})
</script>

<style lang="less" scoped>
.profile-container {
  position: relative;  // 添加相对定位
  
  // 顶部渐变遮罩
  .top-gradient {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 200rpx;
    z-index: 10;
    pointer-events: none;  // 允许点击穿透
    background: linear-gradient(to bottom, 
      rgba(0,0,0,0.1) 20%, 
      rgba(0,0,0,0) 100%
    );
    
    // 返回按钮
    .back-btn {
      position: absolute;
      left: 20rpx;  // 改为20rpx以与其他元素对齐
      top: calc(var(--status-bar-height) + 30rpx);  // 状态栏高度 + 20rpx的间距
      width: 37rpx;  // 改为27rpx以与其他图标一致
      height: 37rpx;  // 改为27rpx以与其他图标一致
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
      
      .icon {
        width: 100%;  // 使用100%以填充容器
        height: 100%;
      }
    }
  }
  
  .header {
    position: relative;
    
    .avatar-swiper {
      width: 100%;
      
      .swiper-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      // 隐藏原有指示点
      :deep(.uni-swiper-dots) {
        display: none;
      }
    }
    
    // 自定义指示器样式
    .custom-indicators {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 10;
      display: flex;
      padding: 12rpx;
      gap: 8rpx;
      
      .indicator-line {
        flex: 1;
        height: 4rpx;
        background: rgba(255, 255, 255, 0.4);
        transition: all 0.3s;
        
        &.active {
          background: #ffffff;
        }
      }
    }
    
    .info-overlay {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 40rpx 30rpx 30rpx;
      background: linear-gradient(to top, 
        rgba(0,0,0,0.2) 30%, 
        rgba(0,0,0,0) 100%
      );
      height: 240rpx;
      display: flex;
      align-items: flex-end;
      z-index: 9;
      
      .basic-info {
        width: 100%;
        display: flex;
        justify-content: space-between;
        
        .left {
          .nickname {
            font-size: 36rpx;
            font-weight: bold;
            color: #fff;
            margin-bottom: 10rpx;
            display: block;
          }
          
          .stats {
            display: flex;
            align-items: center;
            color: rgba(255,255,255,0.9);
            font-size: 26rpx;
            
            .dot {
              margin: 0 10rpx;
            }
          }
          
          .follow-stats {
            display: flex;
            align-items: center;
            color: rgba(255,255,255,0.9);
            font-size: 24rpx;
            margin-top: 8rpx;
            
            .dot {
              margin: 0 10rpx;
            }
            
            .stat {
              color: rgba(255,255,255,0.9);
            }
          }
          
          .popularity {
            display: inline-flex;
            align-items: center;
            background: rgba(255, 255, 255, 0.3);
            padding: 4rpx 12rpx;
            border-radius: 24rpx;
            font-size: 24rpx;
            color: rgba(255,255,255,0.9);
          }
        }
        
        .right {
          text-align: right;
          display: flex;
          flex-direction: column-reverse;
          .ip {
            font-size: 24rpx;
            color: rgba(255,255,255,0.9);
          }
        }
      }
    }
  }
  
  .user-info {
    padding: 20rpx;
    background: #fff;
    // margin-bottom: 20rpx;
    
    .introduction {
      font-size: 28rpx;
      color: #333;
      line-height: 1.5;
      margin-bottom: 20rpx;
    }
    
    .tags {
      .tag-item {
        display: flex;
        align-items: center;
        margin-bottom: 10rpx;
        font-size: 22rpx;
        color: #999;
        
        .icon {
          width: 27rpx;
          height: 27rpx;
          margin-right: 10rpx;
        }
      }
    }
  }
  
  // 将constellation-mbti移到这里，作为独立区域
  .constellation-mbti {
    padding: 20rpx;
    background: #fff;
    margin-bottom: 20rpx;
    display: flex;
    gap: 20rpx;
    
    .constellation,
    .mbti {
      display: flex;
      align-items: center;
      
      .icon {
        width: 70rpx;
        height: 70rpx;
        margin-right: 8rpx;
        background: #8F8BFA;  // 添加背景色
        border-radius: 50%;  // 圆形
        padding: 16rpx;  // 添加内边距使图标居中
        box-sizing: border-box;  // 确保padding不会增加总宽高
      }
      
      .value {
        font-size: 24rpx;
        color: #333;
      }
    }
    
    // MBTI图标不需要背景色和圆形
    .mbti .icon {
      background: transparent;
      border-radius: 0;
      padding: 0;
    }
  }
  
  .moment-list {
    padding: 20rpx;
    
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
    
    .media-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10rpx;
      
      .media-item {
        width: calc((100% - 20rpx) / 3);  // 三列布局，减去间距
        height: 220rpx;
        border-radius: 8rpx;
        
        // 添加点击效果
        &:active {
          opacity: 0.8;
        }
      }
    }
  }
  
  .bottom-btns {
    position: fixed;
    bottom: 40rpx;
    left: 50%;
    transform: translateX(-50%);
    display: flex;  // 添加flex布局
    gap: 20rpx;    // 按钮之间的间距
    
    .action-btn {
      width: 100rpx;
      height: 100rpx;
      padding: 0;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: linear-gradient(135deg, #8F8BFA, #7B78F9);  // 修改为紫色渐变
      box-shadow: 0 4rpx 16rpx rgba(143,139,250,0.3);  // 添加带颜色的阴影
      transition: all 0.3s ease;  // 添加过渡效果
      
      &:active {
        transform: scale(0.95);  // 点击时缩小效果
      }
      
      &::after {
        border: none;
      }
      
      .icon {
        width: 48rpx;
        height: 48rpx;
      }
      
      // 已关注状态的样式
      &.followed {
        background: linear-gradient(135deg, #F0F0F0, #E0E0E0);  // 灰色渐变
        box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.1);
      }
    }
  }
}
</style> 