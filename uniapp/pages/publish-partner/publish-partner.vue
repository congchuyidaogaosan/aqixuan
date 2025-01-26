<template>
  <view class="publish-partner">
    <!-- 头部导航 -->
    <view class="nav-header">
      <view class="left" @click="goBack">
        <image src="/static/images/back.png" mode="aspectFit" class="back-icon"></image>
      </view>
      <view class="title">发布活动</view>
      <view class="right"></view>
    </view>
    
    <!-- 表单内容 -->
    <scroll-view class="content" scroll-y>
      <!-- 活动类型 -->
      <view class="form-item" @click="showActivityTypePopup">
        <view class="label">活动类型</view>
        <view class="value">
          <text :class="{'placeholder': !formData.activityType}">{{formData.activityType || '请选择活动类型'}}</text>
          <image src="/static/images/arrow-right.png" mode="aspectFit" class="arrow-icon"></image>
        </view>
      </view>
      
      <!-- 可见范围 -->
      <view class="form-item" @click="showVisibilityPopup">
        <view class="label">可见范围</view>
        <view class="value">
          <text :class="{'placeholder': !formData.visibility}">{{formData.visibility || '公开'}}</text>
          <image src="/static/images/arrow-right.png" mode="aspectFit" class="arrow-icon"></image>
        </view>
      </view>
      
      <!-- 活动详情 -->
      <view class="form-section">
        <view class="section-title">活动详情</view>
        
        <!-- 活动名称 -->
        <view class="input-item">
          <input 
            type="text" 
            v-model="formData.title"
            placeholder="请填写活动名称"
            placeholder-class="placeholder"
          />
        </view>
        
        <!-- 活动人数 -->
        <view class="input-item">
          <input 
            type="number" 
            v-model="formData.peopleCount"
            placeholder="请填写活动人数(含发起人)"
            placeholder-class="placeholder"
          />
        </view>
        
        <!-- 活动时间 -->
        <view class="time-section">
          <view class="time-type">
            <text 
              :class="['type-btn', {'active': formData.timeType === 'specific'}]"
              @click="formData.timeType = 'specific'"
            >具体时间</text>
            <text 
              :class="['type-btn', {'active': formData.timeType === 'long'}]"
              @click="formData.timeType = 'long'"
            >长期</text>
          </view>
          
          <block v-if="formData.timeType === 'specific'">
            <view class="time-picker" @click="showStartTimePicker">
              <text class="label">开始时间</text>
              <text :class="{'placeholder': !formData.startTime}">{{formData.startTime || '请选择'}}</text>
              <image src="/static/images/arrow-right.png" mode="aspectFit" class="arrow-icon"></image>
            </view>
            <view class="time-picker" @click="showEndTimePicker">
              <text class="label">结束时间</text>
              <text :class="{'placeholder': !formData.endTime}">{{formData.endTime || '请选择'}}</text>
              <image src="/static/images/arrow-right.png" mode="aspectFit" class="arrow-icon"></image>
            </view>
          </block>
        </view>
        
        <!-- 活动地点 -->
        <view class="location-section">
          <view class="location-picker" @click="chooseLocation">
            <image src="/static/images/location.png" mode="aspectFit" class="location-icon"></image>
            <text :class="{'placeholder': !formData.location}">{{formData.location || '请选择活动地点'}}</text>
            <image src="/static/images/arrow-right.png" mode="aspectFit" class="arrow-icon"></image>
          </view>
        </view>
        
        <!-- 费用类型 -->
        <view class="cost-section">
          <view class="cost-type">
            <text 
              :class="['type-btn', {'active': formData.costType === 'free'}]"
              @click="formData.costType = 'free'"
            >免费</text>
            <text 
              :class="['type-btn', {'active': formData.costType === 'aa'}]"
              @click="formData.costType = 'aa'"
            >AA</text>
            <text 
              :class="['type-btn', {'active': formData.costType === 'other'}]"
              @click="formData.costType = 'other'"
            >其他</text>
          </view>
          
          <view class="deposit-input" v-if="formData.costType === 'other'">
            <input 
              type="digit" 
              v-model="formData.deposit"
              placeholder="请输入金额"
              placeholder-class="placeholder"
            />
            <text class="unit">元</text>
          </view>
        </view>
        
        <!-- 活动介绍 -->
        <view class="desc-section">
          <textarea 
            v-model="formData.description"
            placeholder="请详细描述活动内容、要求等"
            placeholder-class="placeholder"
            maxlength="500"
            :show-confirm-bar="false"
          ></textarea>
          <text class="word-count">{{formData.description.length}}/500</text>
        </view>
      </view>
    </scroll-view>
    
    <!-- 底部按钮 -->
    <view class="bottom-btn">
      <button class="publish-btn" @click="handlePublish">立即发布</button>
    </view>
    
    <!-- 活动类型弹窗 -->
    <uni-popup ref="activityTypePopup" type="bottom">
      <view class="popup-content">
        <view class="popup-header">
          <text class="title">选择活动类型</text>
          <text class="close" @click="hideActivityTypePopup">关闭</text>
        </view>
        <view class="popup-body">
          <view 
            class="popup-item"
            v-for="type in activityTypes"
            :key="type.value"
            @click="selectActivityType(type)"
          >
            <text :class="{'active': formData.activityType === type.label}">{{type.label}}</text>
          </view>
        </view>
      </view>
    </uni-popup>
    
    <!-- 可见范围弹窗 -->
    <uni-popup ref="visibilityPopup" type="bottom">
      <view class="popup-content">
        <view class="popup-header">
          <text class="title">选择可见范围</text>
          <text class="close" @click="hideVisibilityPopup">关闭</text>
        </view>
        <view class="popup-body">
          <view 
            class="popup-item"
            v-for="item in visibilityOptions"
            :key="item.value"
            @click="selectVisibility(item)"
          >
            <text :class="{'active': formData.visibility === item.label}">{{item.label}}</text>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref } from 'vue'

// 表单数据
const formData = ref({
  activityType: '',
  visibility: '公开',
  title: '',
  peopleCount: '',
  timeType: 'specific',
  startTime: '',
  endTime: '',
  location: '',
  costType: 'free',
  deposit: '',
  description: ''
})

// 活动类型选项
const activityTypes = [
  { label: '运动', value: 'sports' },
  { label: '游戏', value: 'games' },
  { label: '旅行', value: 'travel' },
  { label: '学习', value: 'study' },
  { label: '美食', value: 'food' },
  { label: '电影', value: 'movie' },
  { label: '其他', value: 'other' }
]

// 可见范围选项
const visibilityOptions = [
  { label: '公开', value: 'public' },
  { label: '仅关注者可见', value: 'followers' }
]

// 活动类型弹窗
const activityTypePopup = ref(null)
const showActivityTypePopup = () => {
  activityTypePopup.value.open()
}
const hideActivityTypePopup = () => {
  activityTypePopup.value.close()
}
const selectActivityType = (type) => {
  formData.value.activityType = type.label
  hideActivityTypePopup()
}

// 可见范围弹窗
const visibilityPopup = ref(null)
const showVisibilityPopup = () => {
  visibilityPopup.value.open()
}
const hideVisibilityPopup = () => {
  visibilityPopup.value.close()
}
const selectVisibility = (item) => {
  formData.value.visibility = item.label
  hideVisibilityPopup()
}

// 选择开始时间
const showStartTimePicker = () => {
  uni.showDatePicker({
    type: 'datetime',
    success: (res) => {
      formData.value.startTime = res.value
    }
  })
}

// 选择结束时间
const showEndTimePicker = () => {
  uni.showDatePicker({
    type: 'datetime',
    success: (res) => {
      formData.value.endTime = res.value
    }
  })
}

// 选择地点
const chooseLocation = () => {
  uni.chooseLocation({
    success: (res) => {
      formData.value.location = res.name
      formData.value.latitude = res.latitude
      formData.value.longitude = res.longitude
    }
  })
}

// 发布活动
const handlePublish = () => {
  // 表单验证
  if (!formData.value.activityType) {
    uni.showToast({
      title: '请选择活动类型',
      icon: 'none'
    })
    return
  }
  if (!formData.value.title) {
    uni.showToast({
      title: '请填写活动名称',
      icon: 'none'
    })
    return
  }
  if (!formData.value.peopleCount) {
    uni.showToast({
      title: '请填写活动人数',
      icon: 'none'
    })
    return
  }
  if (formData.value.timeType === 'specific') {
    if (!formData.value.startTime) {
      uni.showToast({
        title: '请选择开始时间',
        icon: 'none'
      })
      return
    }
    if (!formData.value.endTime) {
      uni.showToast({
        title: '请选择结束时间',
        icon: 'none'
      })
      return
    }
  }
  if (!formData.value.location) {
    uni.showToast({
      title: '请选择活动地点',
      icon: 'none'
    })
    return
  }
  if (formData.value.costType === 'other' && !formData.value.deposit) {
    uni.showToast({
      title: '请输入费用金额',
      icon: 'none'
    })
    return
  }
  if (!formData.value.description) {
    uni.showToast({
      title: '请填写活动介绍',
      icon: 'none'
    })
    return
  }

  // TODO: 调用发布接口
  console.log('发布活动：', formData.value)
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}
</script>

<style lang="less" scoped>
.publish-partner {
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
    height: calc(100vh - 88rpx - 120rpx);
    
    .form-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 30rpx 20rpx;
      background: #fff;
      margin-bottom: 2rpx;
      
      .label {
        font-size: 28rpx;
        color: #333;
      }
      
      .value {
        display: flex;
        align-items: center;
        gap: 8rpx;
        
        text {
          font-size: 28rpx;
          color: #333;
          
          &.placeholder {
            color: #999;
          }
        }
        
        .arrow-icon {
          width: 32rpx;
          height: 32rpx;
        }
      }
    }
    
    .form-section {
      margin-top: 20rpx;
      background: #fff;
      padding: 0 20rpx;
      
      .section-title {
        padding: 20rpx 0;
        font-size: 28rpx;
        font-weight: 500;
        color: #333;
      }
      
      .input-item {
        padding: 20rpx 0;
        border-bottom: 1rpx solid #f5f5f5;
        
        input {
          width: 100%;
          height: 40rpx;
          font-size: 28rpx;
          color: #333;
        }
      }
      
      .time-section {
        padding: 20rpx 0;
        
        .time-type {
          display: flex;
          gap: 20rpx;
          margin-bottom: 20rpx;
          
          .type-btn {
            padding: 10rpx 30rpx;
            font-size: 26rpx;
            color: #666;
            background: #f5f5f5;
            border-radius: 30rpx;
            
            &.active {
              color: #fff;
              background: #007AFF;
            }
          }
        }
        
        .time-picker {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20rpx 0;
          border-bottom: 1rpx solid #f5f5f5;
          
          .label {
            font-size: 28rpx;
            color: #333;
          }
          
          text {
            flex: 1;
            margin: 0 20rpx;
            font-size: 28rpx;
            color: #333;
            
            &.placeholder {
              color: #999;
            }
          }
          
          .arrow-icon {
            width: 32rpx;
            height: 32rpx;
          }
        }
      }
      
      .location-section {
        padding: 20rpx 0;
        border-bottom: 1rpx solid #f5f5f5;
        
        .location-picker {
          display: flex;
          align-items: center;
          gap: 12rpx;
          
          .location-icon {
            width: 32rpx;
            height: 32rpx;
          }
          
          text {
            flex: 1;
            font-size: 28rpx;
            color: #333;
            
            &.placeholder {
              color: #999;
            }
          }
          
          .arrow-icon {
            width: 32rpx;
            height: 32rpx;
          }
        }
      }
      
      .cost-section {
        padding: 20rpx 0;
        
        .cost-type {
          display: flex;
          gap: 20rpx;
          margin-bottom: 20rpx;
          
          .type-btn {
            padding: 10rpx 30rpx;
            font-size: 26rpx;
            color: #666;
            background: #f5f5f5;
            border-radius: 30rpx;
            
            &.active {
              color: #fff;
              background: #007AFF;
            }
          }
        }
        
        .deposit-input {
          display: flex;
          align-items: center;
          gap: 12rpx;
          
          input {
            flex: 1;
            height: 40rpx;
            font-size: 28rpx;
            color: #333;
          }
          
          .unit {
            font-size: 28rpx;
            color: #666;
          }
        }
      }
      
      .desc-section {
        padding: 20rpx 0;
        position: relative;
        
        textarea {
          width: 100%;
          height: 200rpx;
          font-size: 28rpx;
          color: #333;
        }
        
        .word-count {
          position: absolute;
          right: 0;
          bottom: 20rpx;
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }
  
  .bottom-btn {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 20rpx;
    background: #fff;
    
    .publish-btn {
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      font-size: 30rpx;
      color: #fff;
      background: #007AFF;
      border-radius: 40rpx;
    }
  }
}

.popup-content {
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
  
  .popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx 20rpx;
    border-bottom: 1rpx solid #f5f5f5;
    
    .title {
      font-size: 30rpx;
      font-weight: 500;
      color: #333;
    }
    
    .close {
      font-size: 28rpx;
      color: #999;
    }
  }
  
  .popup-body {
    padding: 20rpx;
    max-height: 60vh;
    overflow-y: auto;
    
    .popup-item {
      padding: 20rpx 0;
      text-align: center;
      
      text {
        font-size: 28rpx;
        color: #333;
        
        &.active {
          color: #007AFF;
        }
      }
    }
  }
}

.placeholder {
  color: #999;
}
</style> 