<template>
  <view class="publish-container">
    <!-- 图片/视频上传区 -->
    <view class="media-list">
      <view 
        class="media-item" 
        v-for="(item, index) in mediaList" 
        :key="index"
      >
        <!-- 视频预览 -->
        <video 
          v-if="isVideo(item.url)"
          :src="item.url" 
          class="video"
          :controls="false"
          :loop="true"
          :muted="true"
        ></video>
        <!-- 图片预览 -->
        <image 
          v-else 
          :src="item.url" 
          mode="aspectFill"
        ></image>
        <view class="delete-btn" @click="deleteMedia(index)">
          <uni-icons type="close" size="20" color="#fff"></uni-icons>
        </view>
      </view>
      
      <!-- 添加媒体按钮 -->
      <view 
        class="add-media" 
        @click="chooseMedia"
        v-if="mediaList.length < 6"
      >
        <uni-icons type="plusempty" size="40" color="#999"></uni-icons>
        <text class="tip">{{mediaList.length ? '继续添加' : '添加图片或视频'}}</text>
        <text class="count">{{mediaList.length}}/6</text>
      </view>
    </view>
    
    <!-- 文本输入区 -->
    <view class="content-box">
      <textarea
        v-model="content"
        placeholder="分享新鲜事..."
        placeholder-class="placeholder"
        maxlength="500"
        :auto-height="true"
      />
      <text class="word-count">{{content.length}}/500</text>
    </view>
    
    <!-- 位置信息 -->
    <view class="location-box" @click="chooseLocation">
      <view class="location-info">
        <uni-icons type="location" size="16" color="#666"></uni-icons>
        <text>{{location || '所在位置'}}</text>
      </view>
      <uni-icons type="right" size="16" color="#999"></uni-icons>
    </view>
    
    <!-- 发布按钮 -->
    <button 
      class="publish-btn" 
      :disabled="mediaList.length === 0"
      @click="handlePublish"
    >
      发布
    </button>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { uploadFile, publishMoment } from '@/api/user.js'

// 媒体列表
const mediaList = ref([])
// 文本内容
const content = ref('')
// 位置信息
const location = ref('')

// 判断是否为视频文件
const isVideo = (url) => {
  const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.m4v', '.3gp']
  const extension = url.toLowerCase().substring(url.lastIndexOf('.'))
  return videoExtensions.includes(extension)
}

// 选择媒体
const chooseMedia = async () => {
  try {
    const res = await uni.chooseImage({
      count: 6 - mediaList.value.length, // 最多可选数量
      sizeType: ['compressed'],
      sourceType: ['album', 'camera']
    })
    
    uni.showLoading({ title: '上传中...' })
    
    try {
      // 上传所有选中的文件
      for (const file of res.tempFiles) {
        const blob = new Blob([file], { type: file.type || 'image/jpeg' })
        const fileToUpload = new File([blob], file.name || 'image.jpg', {
          type: file.type || 'image/jpeg'
        })
        
        const uploadRes = await uploadFile(fileToUpload)
        mediaList.value.push({
          url: uploadRes.data.url
        })
      }
    } catch (error) {
      console.log('上传失败：', error)
      uni.showToast({
        title: '上传失败',
        icon: 'none'
      })
    } finally {
      uni.hideLoading()
    }
  } catch (error) {
    console.log('选择媒体失败：', error)
  }
}

// 删除媒体
const deleteMedia = (index) => {
  mediaList.value.splice(index, 1)
}

// 选择位置
const chooseLocation = async () => {
  try {
    const res = await uni.chooseLocation()
    location.value = res.name
  } catch (error) {
    console.log('选择位置失败：', error)
  }
}

// 发布动态
const handlePublish = async () => {
  if (mediaList.value.length === 0) {
    return
  }
  
  try {
    uni.showLoading({
      title: '发布中...'
    })
    
    // 构建动态数据
    const momentData = {
      content: content.value,
      location: location.value,
      list: mediaList.value.map(item => ({
        mediaUrl: item.url,
        mediaType: isVideo(item.url) ? '2' : '1'
      }))
    }
    
    // 调用发布接口
    const success = await publishMoment(momentData)
    
    if (success) {
      uni.showToast({
        title: '发布成功',
        icon: 'success'
      })
      
      // 返回上一页并刷新列表
      setTimeout(() => {
        uni.$emit('refreshMoments') // 触发刷新事件
        history.back();
      }, 1500)
    } else {
      uni.showToast({
        title: '发布失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.log('发布失败：', error)
    uni.showToast({
      title: '发布失败',
      icon: 'none'
    })
  } finally {
    uni.hideLoading()
  }
}

// 页面加载时自动打开媒体选择器
onMounted(() => {
  chooseMedia()
})
</script>

<style lang="less" scoped>
.publish-container {
  min-height: 100vh;
  background: #f8f8f8;
  padding: 20rpx;
  
  .media-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    margin-bottom: 20rpx;
    
    .media-item {
      width: 220rpx;
      height: 220rpx;
      position: relative;
      
      image, .video {
        width: 100%;
        height: 100%;
        border-radius: 12rpx;
      }
      
      .delete-btn {
        position: absolute;
        top: -20rpx;
        right: -20rpx;
        width: 40rpx;
        height: 40rpx;
        background: rgba(0,0,0,0.5);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    
    .add-media {
      width: 220rpx;
      height: 220rpx;
      background: #fff;
      border-radius: 12rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 2rpx dashed #ddd;
      
      .tip {
        font-size: 28rpx;
        color: #999;
        margin-top: 20rpx;
      }
      
      .count {
        font-size: 24rpx;
        color: #999;
        margin-top: 8rpx;
      }
    }
  }
  
  .content-box {
    background: #fff;
    border-radius: 12rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
    position: relative;
    
    textarea {
      width: 100%;
      min-height: 200rpx;
      font-size: 28rpx;
      line-height: 1.5;
    }
    
    .placeholder {
      color: #999;
      font-size: 28rpx;
    }
    
    .word-count {
      position: absolute;
      right: 20rpx;
      bottom: 20rpx;
      font-size: 24rpx;
      color: #999;
    }
  }
  
  .location-box {
    background: #fff;
    border-radius: 12rpx;
    padding: 30rpx 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40rpx;
    
    .location-info {
      display: flex;
      align-items: center;
      gap: 10rpx;
      font-size: 28rpx;
      color: #666;
    }
  }
  
  .publish-btn {
    width: 100%;
    height: 90rpx;
    line-height: 90rpx;
    background: linear-gradient(135deg, #8F8BFA, #7B78F9);
    color: #fff;
    border-radius: 45rpx;
    font-size: 32rpx;
    
    &[disabled] {
      background: #ccc;
      color: #fff;
    }
  }
}
</style> 