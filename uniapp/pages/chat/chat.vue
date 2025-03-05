<template>
  <view class="chat-container">
    <!-- 顶部导航 -->
    <view class="nav-header">
      <view class="left" @click="goBack">
        <image src="/static/images/back.png" mode="aspectFit" class="back-icon"></image>
      </view>
      <view class="title">{{ nickname }}</view>
      <view class="right"></view>
    </view>

    <!-- 聊天内容区域 -->
    <scroll-view class="chat-content" scroll-y :scroll-into-view="scrollToId" :scroll-with-animation="true"
      @scrolltolower="loadMore" :refresher-enabled="true" :refresher-triggered="refreshing" @refresherrefresh="refresh">
      <!-- 加载更多 -->
      <uni-load-more v-if="hasMore" :status="loadingStatus"></uni-load-more>

      <!-- 消息列表 -->
      <view class="message-list">
        <view v-for="(message, index) in messageList" :key="message.id" :id="`msg-${message.id}`" class="message-item"
          :class="{ 'self': message.senderId === userInfo.id }">
          <!-- 时间 -->
          <view class="time" v-if="showTime(index)">
            {{ formatTime(message.createdAt) }}
          </view>

          <!-- 消息内容 -->
          <view class="message-content">
            <image v-if="message.senderId !== userInfo.id" :src="message.avatar || '/static/default-avatar.png'"
              mode="aspectFill" class="avatar" @click="goToProfile(message.senderId)"></image>

            <view class="content" :class="message.messageType">
              <!-- 文本消息 -->
              <text v-if="message.messageType === 'text'">{{ message.content }}</text>

              <!-- 图片消息 -->
              <image v-else-if="message.messageType === 'image'" :src="message.content" mode="widthFix"
                class="image-content" @click="previewImage(message.content)"></image>

              <!-- 语音消息 -->
              <view v-else-if="message.messageType === 'voice'" class="voice-content" @click="playVoice(message)">
                <image src="/static/images/voice.png" mode="aspectFit" class="voice-icon"></image>
                <text class="duration">{{ message.duration }}''</text>
              </view>
            </view>

            <image v-if="message.senderId === userInfo.id" :src="userInfo.avatarUrl || '/static/default-avatar.png'"
              mode="aspectFill" class="avatar"></image>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部输入区域 -->
    <view class="input-area">
      <!-- 语音按钮 -->
      <view class="voice-btn" @click="toggleVoiceInput">
        <image :src="isVoiceInput ? '/static/images/keyboard.png' : '/static/images/voice.png'" mode="aspectFit"
          class="icon"></image>
      </view>

      <!-- 文本输入框 -->
      <input v-if="!isVoiceInput" type="text" v-model="inputContent" class="input" placeholder="说点什么..."
        :focus="inputFocus" @confirm="sendTextMessage" />

      <!-- 语音输入按钮 -->
      <view v-else class="voice-input-btn" @touchstart="startRecording" @touchend="stopRecording"
        @touchcancel="cancelRecording">
        按住说话
      </view>

      <!-- 更多功能按钮 -->
      <view class="more-btn" @click="showMore">
        <image src="/static/images/more.png" mode="aspectFit" class="icon"></image>
      </view>
    </view>

    <!-- 更多功能面板 -->
    <view class="more-panel" v-if="showMorePanel">
      <view class="panel-item" @click="chooseImage">
        <image src="/static/images/image.png" mode="aspectFit" class="icon"></image>
        <text>图片</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { getChatMessages, sendMessage, uploadFile } from '@/api/user'
import { formatTime } from '@/utils/date'
import webSocketManager from '@/utils/websocket'

// 用户信息
const userInfo = ref(uni.getStorageSync('userInfo') || {})

// 页面参数
const pages = getCurrentPages()
const currentPage = pages[pages.length - 1]
const { userId, nickname, avatar } = currentPage.options

// 消息列表
const messageList = ref([])
const scrollToId = ref('')
const refreshing = ref(false)
const loadingStatus = ref('more')
const hasMore = ref(true)
const page = ref(1)
const pageSize = ref(20)

// 输入相关
const inputContent = ref('')
const inputFocus = ref(false)
const isVoiceInput = ref(false)
const showMorePanel = ref(false)

// 加载消息记录
const loadMessages = async (isRefresh = false) => {
  try {
    if (isRefresh) {
      page.value = 1
      messageList.value = []
    }

    loadingStatus.value = 'loading'
    const params = {
      chatId: userId,
      page: page.value,
      pageSize: pageSize.value
    }

    const res = await getChatMessages(params)
    if (res && res.data) {
      const { messages, total } = res.data

      if (isRefresh) {
        messageList.value = messages
      } else {
        messageList.value = [...messages, ...messageList.value]
      }

      // 更新加载状态
      hasMore.value = messageList.value.length < total
      loadingStatus.value = hasMore.value ? 'more' : 'noMore'

      if (hasMore.value) {
        page.value++
      }

      // 滚动到最新消息
      if (isRefresh) {
        scrollToBottom()
      }
    }
  } catch (error) {
    console.error('获取消息记录失败：', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
    loadingStatus.value = 'more'
  } finally {
    refreshing.value = false
  }
}

// 发送文本消息
const sendTextMessage = async () => {
  if (!inputContent.value.trim()) return

  try {
    const message = {
      type: 'chat',
      data: {
        receiverId: userId,
        content: inputContent.value,
        messageType: 'text'
      }
    }

    // 添加到消息列表
    messageList.value.push({
      id: Date.now().toString(), // 临时ID
      senderId: userInfo.value.id,
      content: inputContent.value,
      messageType: 'text',
      createdAt: new Date().toISOString(),
      status: 'sending'
    })

    // 清空输入框并滚动到底部
    inputContent.value = ''
    scrollToBottom()

    console.log(message)
    // 通过WebSocket发送消息
    if (webSocketManager.isConnected) {
      webSocketManager.socket.send({
        data: JSON.stringify(message),
        success() {
          console.log('消息发送成功')
        },
        fail(err) {
          console.error('消息发送失败：', err)
          uni.showToast({
            title: '发送失败',
            icon: 'none'
          })
        }
      })
    } else {
      uni.showToast({
        title: '网络连接已断开',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('发送消息失败：', error)
    uni.showToast({
      title: '发送失败',
      icon: 'none'
    })
  }
}

// 发送图片消息
const chooseImage = async () => {
  try {
    const res = await uni.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera']
    })

    const tempFilePath = res.tempFilePaths[0]

    // 上传图片
    const uploadRes = await uploadFile(tempFilePath)
    if (uploadRes.code === 200) {
      // 发送图片消息
      const data = {
        receiverId: userId,
        content: uploadRes.data.url,
        messageType: 'image'
      }

      const sendRes = await sendMessage(data)
      if (sendRes.code === 200) {
        // 添加到消息列表
        messageList.value.push({
          id: sendRes.data.id,
          senderId: userInfo.value.id,
          content: uploadRes.data.url,
          messageType: 'image',
          createdAt: new Date().toISOString(),
          status: 'sent'
        })

        scrollToBottom()
      }
    }
  } catch (error) {
    console.error('发送图片失败：', error)
    uni.showToast({
      title: '发送失败',
      icon: 'none'
    })
  }
}

// 录音相关
const startRecording = () => {
  uni.startRecord({
    success: () => {
      uni.showToast({
        title: '开始录音',
        icon: 'none'
      })
    }
  })
}

const stopRecording = () => {
  uni.stopRecord({
    success: async (res) => {
      const tempFilePath = res.tempFilePath

      // 上传语音文件
      const uploadRes = await uploadChatImage(tempFilePath)
      if (uploadRes.code === 200) {
        // 发送语音消息
        const data = {
          receiverId: userId,
          content: uploadRes.data.url,
          messageType: 'voice',
          duration: res.duration
        }

        const sendRes = await sendMessage(data)
        if (sendRes.code === 200) {
          // 添加到消息列表
          messageList.value.push({
            id: sendRes.data.id,
            senderId: userInfo.value.id,
            content: uploadRes.data.url,
            messageType: 'voice',
            duration: res.duration,
            createdAt: new Date().toISOString(),
            status: 'sent'
          })

          scrollToBottom()
        }
      }
    }
  })
}

const cancelRecording = () => {
  uni.stopRecord()
}

// 播放语音
const playVoice = (message) => {
  uni.playVoice({
    filePath: message.content
  })
}

// 预览图片
const previewImage = (url) => {
  uni.previewImage({
    urls: [url]
  })
}

// 切换语音输入
const toggleVoiceInput = () => {
  isVoiceInput.value = !isVoiceInput.value
  showMorePanel.value = false
}

// 显示更多功能面板
const showMore = () => {
  showMorePanel.value = !showMorePanel.value
}

// 滚动到底部
const scrollToBottom = () => {
  const lastMessage = messageList.value[messageList.value.length - 1]
  if (lastMessage) {
    scrollToId.value = `msg-${lastMessage.id}`
  }
}

// 判断是否显示时间
const showTime = (index) => {
  if (index === 0) return true

  const currentMessage = messageList.value[index]
  const prevMessage = messageList.value[index - 1]

  // 如果两条消息间隔超过5分钟，显示时间
  return new Date(currentMessage.createdAt) - new Date(prevMessage.createdAt) > 5 * 60 * 1000
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 跳转到用户主页
const goToProfile = (userId) => {
  uni.navigateTo({
    url: `/pages/profile/profile?userId=${userId}`
  })
}

// 加载更多
const loadMore = () => {
  if (loadingStatus.value === 'loading' || !hasMore.value) return
  loadMessages()
}

// 下拉刷新
const refresh = async () => {
  refreshing.value = true
  await loadMessages(true)
}

// 页面加载
onMounted(() => {
  loadMessages(true)
  
  // 注册消息接收处理器
  uni.$on('onChatMessage', handleChatMessage)
})

// 页面卸载时清理
onUnmounted(() => {
  // 移除消息接收处理器
  uni.$off('onChatMessage', handleChatMessage)
})

// 处理接收到的聊天消息
const handleChatMessage = (data) => {
  // 只处理当前聊天对象的消息
  if (data.senderId === userId || data.receiverId === userId) {
    messageList.value.push({
      id: data.id || Date.now().toString(),
      senderId: data.senderId,
      content: data.content,
      messageType: data.messageType,
      createdAt: data.createdAt || new Date().toISOString(),
      status: 'received',
      avatar: data.avatar,
      nickname: data.nickname
    })
    
    // 滚动到底部
    scrollToBottom()
  }
}
</script>

<style lang="less" scoped>
.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
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

  .chat-content {
    flex: 1;
    padding: 20rpx;

    .message-list {
      .message-item {
        margin-bottom: 30rpx;

        .time {
          text-align: center;
          font-size: 24rpx;
          color: #999;
          margin-bottom: 20rpx;
        }

        .message-content {
          display: flex;
          align-items: flex-start;

          .avatar {
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
            margin: 0 20rpx;
          }

          .content {
            max-width: 60%;
            padding: 20rpx;
            border-radius: 10rpx;
            font-size: 28rpx;
            word-break: break-all;

            &.text {
              background: #fff;
            }

            &.image {
              padding: 0;
              background: none;

              .image-content {
                max-width: 100%;
                border-radius: 10rpx;
              }
            }

            &.voice {
              background: #fff;
              display: flex;
              align-items: center;
              min-width: 100rpx;

              .voice-icon {
                width: 40rpx;
                height: 40rpx;
                margin-right: 10rpx;
              }

              .duration {
                color: #999;
                font-size: 24rpx;
              }
            }
          }
        }

        &.self {
          .message-content {
            flex-direction: row-reverse;

            .content {
              &.text {
                background: #007AFF;
                color: #fff;
              }
            }
          }
        }
      }
    }
  }

  .input-area {
    padding: 20rpx;
    background: #fff;
    border-top: 1rpx solid #eee;
    display: flex;
    align-items: center;

    .voice-btn,
    .more-btn {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .icon {
        width: 40rpx;
        height: 40rpx;
      }
    }

    .input {
      flex: 1;
      height: 72rpx;
      background: #f5f5f5;
      border-radius: 36rpx;
      padding: 0 30rpx;
      font-size: 28rpx;
      margin: 0 20rpx;
    }

    .voice-input-btn {
      flex: 1;
      height: 72rpx;
      line-height: 72rpx;
      text-align: center;
      background: #f5f5f5;
      border-radius: 36rpx;
      margin: 0 20rpx;
      font-size: 28rpx;
      color: #666;
    }
  }

  .more-panel {
    padding: 30rpx;
    background: #fff;
    display: flex;
    flex-wrap: wrap;

    .panel-item {
      width: 160rpx;
      height: 160rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .icon {
        width: 80rpx;
        height: 80rpx;
        margin-bottom: 10rpx;
      }

      text {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}
</style>