<template>
  <view class="edit-container">
    <!-- 头像上传区域 -->
    <view class="avatar-section">
      <view class="section-title">头像相册</view>
      <view class="avatar-list">
        <view 
          class="avatar-item" 
          v-for="(item, index) in avatars" 
          :key="index"
        >
          <image 
            v-if="item" 
            :src="item" 
            mode="aspectFill"
            @click="previewImage(index)"
          ></image>
          <view 
            v-else 
            class="upload-btn"
            @click="chooseImage(index)"
          >
            <uni-icons type="plusempty" size="30" color="#999"></uni-icons>
          </view>
          <view 
            v-if="item" 
            class="delete-btn"
            @click="deleteImage(index)"
          >
            <uni-icons type="close" size="20" color="#fff"></uni-icons>
          </view>
        </view>
      </view>
      <text class="tips">最多可上传6张照片</text>
    </view>
    
    <!-- 基本信息 -->
    <view class="info-section">
      <view class="section-title">基本信息</view>
      <view class="info-list">
        <view class="info-item" @click="goToEditItem('nickname', null, formData.nickname, false, 'input')">
          <text class="label">昵称</text>
          <view class="value">
            <text>{{formData.nickname}}</text>
            <uni-icons type="right" size="16" color="#999"></uni-icons>
          </view>
        </view>
        
        <view class="info-item" @click="goToEditItem('bio', null, formData.bio, false, 'textarea')">
          <text class="label">个人介绍</text>
          <view class="value">
            <text>{{formData.bio}}</text>
            <uni-icons type="right" size="16" color="#999"></uni-icons>
          </view>
        </view>
        
        <view class="info-item" @click="goToEditItem('region', regionColumns, formData.region, false, 'region')">
          <text class="label">居住地</text>
          <view class="value">
            <text>{{formData.region?.join(' ')}}</text>
            <uni-icons type="right" size="16" color="#999"></uni-icons>
          </view>
        </view>
        
        <!-- 其他选项类似修改 -->
        <view class="info-item" v-for="(item, key) in infoItems" :key="key"
          @click="goToEditItem(item.type, item.options, formData[item.type], item.multiple, item.mode)">
          <text class="label">{{item.label}}</text>
          <view class="value">
            <text>{{formatValue(item.type, formData[item.type])}}</text>
            <uni-icons type="right" size="16" color="#999"></uni-icons>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import cityData from '@/common/city.js'
import { uploadFile as uploadFileApi, updateUser } from '@/api/user'

// 表单数据
const formData = ref({
  nickname: '',
  bio: '',
  region: [],
  height: '',
  weight: '',
  birth: '',
  role: '',
  interests: [],
  industry: '',
  sports: [],
  relationship: '',
  mbti: '',
  purpose: ''
})

// 头像数组
const avatars = ref(Array(6).fill(''))

// 各种选项数据
const heightRange = Array.from({length: 81}, (_, i) => i + 130) // 130-210cm
const weightRange = Array.from({length: 91}, (_, i) => i + 40) // 40-130kg
const roleOptions = ['学生', '职场人', '创业者', '自由职业']
const interestOptions = [
  '看电影', '听音乐', '读书', '旅行', '摄影', '美食', 
  '游戏', '购物', '健身', '瑜伽', '绘画', '手工', 
  '烹饪', '园艺', '收藏', '钓鱼', '宠物', '汽车', 
  '时尚', '科技'
]
const industryOptions = ['IT互联网', '金融', '教育', '医疗', '房地产', '其他']
const sportsOptions = [
  '跑步', '健身', '游泳', '篮球', '足球', '羽毛球', 
  '网球', '乒乓球', '瑜伽', '舞蹈', '滑板', '骑行', 
  '登山', '滑雪', '冲浪', '高尔夫'
]
const relationshipOptions = ['单身', '恋爱中', '已婚']
const mbtiOptions = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 
                     'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP']
const purposeOptions = ['找对象', '交朋友', '运动伙伴', '商务合作']

// 页面加载时获取用户信息
onMounted(() => {
  const userInfo = uni.getStorageSync('userInfo')
  if (userInfo) {
    formData.value = {
      ...formData.value,
      ...userInfo
    }
  }
})

// 选择图片
const chooseImage = async (index) => {
  try {
    const res = await uni.chooseImage({
      count: 1
    })
    
    uni.showLoading({ title: '上传中...' })
    
    // 创建文件对象
    const file = res.tempFiles[0]
    const blob = new Blob([file], { type: file.type || 'image/jpeg' })
    const fileToUpload = new File([blob], file.name || 'image.jpg', {
      type: file.type || 'image/jpeg'
    })
    
    // 上传文件
    const uploadRes = await uploadFileApi(fileToUpload)
    console.log(uploadRes)
    // 更新头像数组
    avatars.value[index] = uploadRes.data
    avatars.value = [...avatars.value]
    
    // 保存到用户信息并更新服务器
    const userInfo = uni.getStorageSync('userInfo') || {}
    userInfo.avatars = avatars.value.filter(Boolean)
    uni.setStorageSync('userInfo', userInfo)
    
    await updateUser({ avatars: userInfo.avatars })
    
    uni.hideLoading()
  } catch (error) {
    console.error('上传失败:', error)
    uni.hideLoading()
    uni.showToast({
      title: '上传失败',
      icon: 'none'
    })
  }
}

// 预览图片
const previewImage = (index) => {
  const urls = avatars.value.filter(item => item)
  uni.previewImage({
    urls,
    current: index
  })
}

// 删除图片
const deleteImage = async (index) => {
  try {
    uni.showLoading({ title: '删除中...' })
    
    // 更新头像数组
    avatars.value[index] = ''
    avatars.value = [...avatars.value]
    
    // 保存到用户信息
    const userInfo = uni.getStorageSync('userInfo') || {}
    userInfo.avatars = avatars.value.filter(Boolean)
    uni.setStorageSync('userInfo', userInfo)
    
    // 调用更新接口
    await updateUser({ avatars: userInfo.avatars })
    
    uni.hideLoading()
  } catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: '删除失败',
      icon: 'none'
    })
  }
}

// 跳转到单项编辑页面
const goToEditItem = (type, options, value, isMultiple = false, mode = 'select') => {
  const titles = {
    nickname: '修改昵称',
    bio: '修改个人介绍',
    region: '修改居住地',
    height: '修改身高',
    weight: '修改体重',
    birth: '修改生日',
    role: '修改角色',
    interests: '修改兴趣',
    industry: '修改行业',
    sports: '修改运动',
    relationship: '修改情感状态',
    mbti: '修改MBTI',
    purpose: '修改交友目的'
  }
  
  const params = {
    type,
    title: titles[type],
    mode,
    value: encodeURIComponent(JSON.stringify(value))
  }
  
  if (options) {
    params.list = encodeURIComponent(JSON.stringify(options))
  }
  
  if (isMultiple) {
    params.isMultiple = true
  }
  
  const url = `/pages/edit-item/edit-item?${Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&')}`
  uni.navigateTo({ url })
}

// 更新表单项
const updateFormItem = (value) => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const { type } = currentPage.$page.options
  
  formData.value[type] = value
  // 自动保存
  uni.setStorageSync('userInfo', formData.value)
}

// 基本信息配置
const infoItems = {
  height: {
    label: '身高',
    type: 'height',
    options: heightRange,
    mode: 'select',
    format: val => val ? `${val}cm` : ''
  },
  weight: {
    label: '体重',
    type: 'weight',
    options: weightRange,
    mode: 'select',
    format: val => val ? `${val}kg` : ''
  },
  birth: {
    label: '生日',
    type: 'birth',
    mode: 'date'
  },
  role: {
    label: '角色',
    type: 'role',
    options: roleOptions,
    mode: 'select'
  },
  interests: {
    label: '兴趣',
    type: 'interests',
    options: interestOptions,
    multiple: true,
    format: val => val?.join('、')
  },
  industry: {
    label: '行业',
    type: 'industry',
    options: industryOptions,
    mode: 'select'
  },
  sports: {
    label: '运动',
    type: 'sports',
    options: sportsOptions,
    multiple: true,
    format: val => val?.join('、')
  },
  relationship: {
    label: '情感状态',
    type: 'relationship',
    options: relationshipOptions,
    mode: 'select'
  },
  mbti: {
    label: 'MBTI',
    type: 'mbti',
    options: mbtiOptions,
    mode: 'select'
  },
  purpose: {
    label: '交友目的',
    type: 'purpose',
    options: purposeOptions,
    mode: 'select'
  }
}

// 格式化显示值
const formatValue = (type, value) => {
  const item = infoItems[type]
  return item?.format ? item.format(value) : value
}
</script>

<style lang="less" scoped>
.edit-container {
  padding: 30rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
  }
  
  .avatar-section {
    margin-bottom: 40rpx;
    
    .avatar-list {
      display: flex;
      flex-wrap: wrap;
      gap: 20rpx;
      
      .avatar-item {
        position: relative;
        width: 200rpx;
        height: 200rpx;
        background: #f8f8f8;
        border-radius: 20rpx;
        overflow: hidden;
        
        image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .upload-btn {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f8f8;
        }
        
        .delete-btn {
          position: absolute;
          top: 10rpx;
          right: 10rpx;
          width: 40rpx;
          height: 40rpx;
          background: rgba(0,0,0,0.5);
          border-radius: 20rpx;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    
    .tips {
      font-size: 24rpx;
      color: #999;
      margin-top: 10rpx;
    }
  }
  
  .info-section {
    margin-bottom: 40rpx;
    
    .info-list {
      background: #fff;
      border-radius: 20rpx;
      overflow: hidden;
      
      .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30rpx;
        border-bottom: 1rpx solid #eee;
        
        &:last-child {
          border-bottom: none;
        }
        
        .label {
          font-size: 28rpx;
          color: #333;
        }
        
        .value {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 10rpx;
          min-height: 40rpx; // 添加最小高度，保证空值时也有高度
          
          text {
            font-size: 28rpx;
            color: #666;
          }
        }
      }
    }
  }
}
</style> 