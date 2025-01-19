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
              <text class="stat">{{userInfo.age || '--'}}岁</text>
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
            <view class="ip">IP：{{ipLocation || '未知'}}</view>
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
        <view class="constellation">
          <image 
            :src="`/static/images/constellation/${userInfo.constellation}.png`" 
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
    <view class="moments">
      <view class="section-title">动态</view>
      <view class="moment-list">
        <view 
          class="moment-item" 
          v-for="(item, index) in moments" 
          :key="index"
          @click="goToMomentDetail(item.id)"
        >
          <image :src="item.image" mode="aspectFill" class="moment-image"></image>
        </view>
      </view>
    </view>
    
    <!-- 底部按钮 -->
    <view class="bottom-btns">
      <template v-if="isMyProfile">
        <button class="action-btn" @click="publishMoment">
          <image src="/static/images/xiangji.png" mode="aspectFill" class="icon"></image>
        </button>
      </template>
      <template v-else>
        <button class="action-btn" @click="sendMessage">
          <image src="/static/images/dazhaohu.png" mode="aspectFill" class="icon"></image>
        </button>
      </template>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUserInfo as fetchUserInfo, getUserAvatars, getMyAvatarList } from '@/api/user.js'

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
const moments = ref([]) // 动态列表
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

// 监听轮播图变化
const handleChange = (e) => {
  currentIndex.value = e.detail.current
}

// 获取设备宽度
const getSystemInfo = () => {
  const systemInfo = uni.getSystemInfoSync()
  swiperHeight.value = systemInfo.windowWidth
}



// 获取用户信息
const loadUserInfo = async (userId) => {
  try {
    if (userId) {
      // 获取指定用户信息
      const [userRes, avatarRes] = await Promise.all([
        fetchUserInfo(userId),
        getUserAvatars(userId)
      ])
      
      if (userRes.data) {
        const info = userRes.data
        // 处理头像列表路径
        info.avatars = avatarRes.data 
        if (typeof info.interests === 'string') {
          info.interests = info.interests.split('、')
        }
        userInfo.value = info
        console.log(userInfo.value)
      }
    } else {
      // 获取当前登录用户信息
      const info = uni.getStorageSync('userInfo')
      if (info) {
        // 获取当前用户的头像列表
        try {
          const avatarRes = await getMyAvatarList()
          info.avatars = avatarRes.data
        } catch (error) {
          info.avatars = []
        }
        
        if (typeof info.interests === 'string') {
          info.interests = info.interests.split('、')
        }
        userInfo.value = info
      }
    }
  } catch (error) {
    uni.showToast({
      title: '获取用户信息失败',
      icon: 'none'
    })
  }
}

// 跳转到动态详情
const goToMomentDetail = (id) => {
  uni.navigateTo({
    url: `/pages/moment-detail/moment-detail?id=${id}`
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
  uni.navigateBack()
}

// 页面加载时获取用户信息和设备信息
onMounted(() => {
  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const userId = currentPage.options?.userId
  
  console.log('当前用户ID：', userId)
  
  // 根据userId判断是否是我的主页
  isMyProfile.value = !userId || userId === uni.getStorageSync('userInfo')?.id
  
  // 获取用户信息
  loadUserInfo(userId)
  getSystemInfo()
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
    margin-bottom: 20rpx;
    
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
        width: 80rpx;
        height: 80rpx;
        margin-right: 8rpx;
      }
      
      .value {
        font-size: 24rpx;
        color: #333;
      }
    }
  }
  
  .moments {
    padding: 30rpx;
    background: #fff;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
    }
    
    .moment-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10rpx;
      
      .moment-item {
        width: 226rpx;
        height: 226rpx;
        
        .moment-image {
          width: 100%;
          height: 100%;
          border-radius: 12rpx;
        }
      }
    }
  }
  
  .bottom-btns {
    position: fixed;
    bottom: 40rpx;  // 距离底部的距离
    left: 50%;
    transform: translateX(-50%);  // 水平居中
    
    .action-btn {
      width: 100rpx;
      height: 100rpx;
      padding: 0;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;  // 圆形按钮
      background: linear-gradient(135deg, #ffd700, #ff4d4f);  // 黄到红的渐变
      box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.1);  // 添加阴影效果
      
      &::after {
        border: none;  // 移除默认边框
      }
      
      .icon {
        width: 48rpx;
        height: 48rpx;
      }
    }
  }
}
</style> 