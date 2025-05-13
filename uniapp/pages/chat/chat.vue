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
      @scrolltoupper="loadMore" :upper-threshold="50" :refresher-enabled="false" 
      :enhanced="true" :bounces="true" :show-scrollbar="false">
      <!-- 消息列表 -->
      <view class="message-list">
        <!-- 加载更多 -->
        <uni-load-more v-if="hasMore" :contentText="{contentdown: '下拉加载更多', contentrefresh: '加载中', contentnomore: '没有更多了'}" :status="loadingStatus"></uni-load-more>

        <view v-for="(message, index) in messageList" :key="message.id" :id="`msg-${message.id}`" class="message-item"
          :class="{ 'self': message.senderId === userInfo.id }">
          <!-- 时间 -->
          <view class="time" v-if="showTime(index)">
            {{ formatTime(message.createdAt) }}
          </view>

          <!-- 消息内容 -->
          <view class="message-content">
            <!-- 接收者头像 -->
            <image v-if="message.senderId !== userInfo.id" :src="message.avatar || '/static/default-avatar.png'"
              mode="aspectFill" class="avatar" @click="goToProfile(message.senderId)"></image>

            <view class="content" :class="getMessageTypeClass(message.messageType)">
              <!-- 文本消息 -->
              <text v-if="message.messageType === 1 || message.messageType == '1'">{{ message.content }}</text>

              <!-- 图片消息 -->
              <image v-else-if="message.messageType === 2 || message.messageType == '2'" :src="message.content" mode="widthFix"
                class="image-content" @click="previewImage(message.content)"></image>

              <!-- 语音消息 -->
              <view v-else-if="message.messageType === 3 || message.messageType == '3'" class="voice-content" @click="playVoice(message)">
                <image src="/static/images/voice.png" mode="aspectFit" class="voice-icon"></image>
                <text class="duration">{{ message.duration }}''</text>
              </view>
            </view>

            <!-- 发送者头像 -->
            <image v-if="message.senderId === userInfo.id" :src="userInfo.avatarUrl || '/static/default-avatar.png'"
              mode="aspectFill" class="avatar"></image>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部输入区域 -->
    <view class="input-area" :class="{ 'keyboard-show': inputFocus, 'more-show': showMorePanel }">
      <!-- 语音按钮 -->
      <view class="voice-btn" @click="toggleVoiceInput">
        <image :src="isVoiceInput ? '/static/images/jianpan.png' : '/static/images/yuyin.png'" mode="aspectFit"
          class="icon"></image>
      </view>

      <!-- 文本输入框 -->
      <input v-if="!isVoiceInput" type="text" v-model="inputContent" class="input" placeholder="说点什么..."
        :focus="inputFocus" @focus="inputFocus = true" @blur="inputFocus = false" @confirm="sendTextMessage" />

      <!-- 语音输入按钮 -->
      <view v-else class="voice-input-btn" 
        @touchstart.prevent="startRecording" 
        @touchend.prevent="stopRecording"
        @touchcancel.prevent="cancelRecording"
        :class="{ 'recording': isRecording }">
        {{ isRecording ? '松开发送' : '按住说话' }}
      </view>

      <!-- 更多功能按钮 -->
      <view class="more-btn" @click="showMore" v-if="!inputContent">
        <image src="/static/images/gengduo.png" mode="aspectFit" class="icon"></image>
      </view>
      <!-- 发送按钮 -->
      <view class="send-btn" @click="sendTextMessage" v-else>
        发送
      </view>
    </view>

    <!-- 更多功能面板 -->
    <view class="more-panel" v-if="showMorePanel" :class="{ show: showMorePanel }">
      <view class="panel-item" @click="chooseImage">
        <image src="/static/images/tupian.png" mode="aspectFit" class="icon"></image>
        <text>图片</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { onShow, onLoad } from '@dcloudio/uni-app'

import { getChatMessages, sendMessage } from '@/api/user'
import { formatTime } from '@/utils/date'
import webSocketManager from '@/utils/websocket'
import uploadFile from '@/api/upload'

// 用户信息
const userInfo = ref(uni.getStorageSync('userInfo') || {})

// 页面参数
const userId = ref('')
const nickname = ref('')
const avatar = ref('')



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

// 录音相关
const isRecording = ref(false)


onLoad((options)=>{
	console.log(options);
	userId.value = options.userId;
    nickname.value = options.nickname;
    avatar.value = options.avatar;
})

// 加载消息记录
const loadMessages = async (isRefresh = false) => {
  try {
    if (isRefresh) {
      page.value = 1
      messageList.value = []
    }

    loadingStatus.value = 'loading'
    const params = {
      chatId: userId.value,
      page: page.value,
      pageSize: pageSize.value
    }

    const res = await getChatMessages(params)
	console.log('获取消息记录：', res);
    if (res && res.page) {
      const { records, total } = res.page

      // 转换消息格式
      const formattedMessages = records.map(msg => {
        const isSender = Number(msg.senderId) === Number(userInfo.value.id)
        return {
          id: msg.id.toString(),
          senderId: Number(msg.senderId),
          content: msg.content,
          messageType: msg.messageType,
          createdAt: msg.createdAt,
          status: 'received',
          avatar: isSender ? userInfo.value.avatarUrl : avatar,
          nickname: isSender ? userInfo.value.nickname : nickname
        }
      }).reverse()

      if (isRefresh) {
        messageList.value = formattedMessages
      } else {
        messageList.value = [...formattedMessages, ...messageList.value] // 将新消息添加到前面
      }

      // 更新加载状态
      hasMore.value = messageList.value.length < total
      loadingStatus.value = hasMore.value ? 'more' : 'noMore'

      // 在加载完成后增加页码 如果page小于等于res.page.pages则增加页码
      if (page.value <= res.page.pages) {
        page.value++
      }
    }
  } catch (error) {
    console.error('获取消息记录失败：', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
    loadingStatus.value = 'more'
  }
}

// 发送文本消息
const sendTextMessage = async () => {
  if (!inputContent.value.trim()) return

  try {
    const message = {
      data: {
        receiverId: userId.value,
        content: inputContent.value,
        messageType: 1
      }
    }

    // 添加到消息列表
    messageList.value.push({
      id: Date.now().toString(), // 临时ID
      senderId: userInfo.value.id,
      content: inputContent.value,
      messageType: 1,
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
      count: 1
    })

   
    // 上传图片
    const uploadRes = await uploadFile(res)
    if (uploadRes.result === "SUCCESS") {
    console.log('上传图片成功', uploadRes)
      // 发送图片消息
      const message = {
        data: {
          receiverId: userId.value,
          content: uploadRes.data,
          messageType: 2,

          // messageType: 'image'
        }
      }

      // 添加到消息列表
      messageList.value.push({
        id: Date.now().toString(), // 临时ID
        senderId: userInfo.value.id,
        content: uploadRes.data.url,
        messageType: 2,
        createdAt: new Date().toISOString(),
        status: 'sending'
      })

      // 滚动到底部
      scrollToBottom()

      // 通过WebSocket发送消息
      if (webSocketManager.isConnected) {
        webSocketManager.socket.send({
          data: JSON.stringify(message),
          success() {
            console.log('图片消息发送成功')
          },
          fail(err) {
            console.error('图片消息发送失败：', err)
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
    }
  } catch (error) {
    console.error('发送图片失败：', error)
    uni.showToast({
      title: '发送失败',
      icon: 'none'
    })
  }
}

// 开始录音
const startRecording = () => {
  isRecording.value = true
  uni.showToast({
    title: '开始录音',
    icon: 'none'
  })
  
  // 申请录音权限
  uni.authorize({
    scope: 'scope.record',
    success() {
      uni.startRecord({
        success: () => {
          console.log('开始录音')
        },
        fail: (err) => {
          console.error('录音失败:', err)
          uni.showToast({
            title: '录音失败',
            icon: 'none'
          })
        }
      })
    },
    fail() {
      uni.showModal({
        title: '提示',
        content: '需要录音权限才能发送语音消息',
        success: (res) => {
          if (res.confirm) {
            uni.openSetting()
          }
        }
      })
    }
  })
}

// 停止录音
const stopRecording = () => {
  if (!isRecording.value) return
  
  isRecording.value = false
  uni.stopRecord({
    success: async (res) => {
      console.log('录音成功:', res)
      const tempFilePath = res.tempFilePath
      
      try {
        // 上传语音文件
        const formData = new FormData()
        formData.append('file', tempFilePath)
        
        const uploadRes = await uploadFile(formData)
        if (uploadRes.code === 200) {
          // 发送语音消息
          const message = {
            data: {
              receiverId: userId.value,
              content: uploadRes.data.url,
              messageType: 3,
              duration: res.duration || 1
            }
          }

          // 添加到消息列表
          messageList.value.push({
            id: Date.now().toString(),
            senderId: userInfo.value.id,
            content: uploadRes.data.url,
            messageType: 3,
            duration: res.duration || 1,
            createdAt: new Date().toISOString(),
            status: 'sending',
            avatar: userInfo.value.avatarUrl
          })

          // 滚动到底部
          scrollToBottom()

          // 通过WebSocket发送消息
          if (webSocketManager.isConnected) {
            webSocketManager.socket.send({
              data: JSON.stringify(message),
              success() {
                console.log('语音消息发送成功')
              },
              fail(err) {
                console.error('语音消息发送失败：', err)
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
        }
      } catch (error) {
        console.error('发送语音消息失败：', error)
        uni.showToast({
          title: '发送失败',
          icon: 'none'
        })
      }
    },
    fail: (err) => {
      console.error('停止录音失败:', err)
      uni.showToast({
        title: '录音失败',
        icon: 'none'
      })
    }
  })
}

// 取消录音
const cancelRecording = () => {
  if (!isRecording.value) return
  
  isRecording.value = false
  uni.stopRecord()
  uni.showToast({
    title: '已取消',
    icon: 'none'
  })
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
  uni.navigateBack(1);
  
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

// 处理接收到的聊天消息 接收 websocket
const handleChatMessage = (data) => {
  console.log('handleChatMessage', data)
  
  const currentUserId = Number(userInfo.value.id)
  const otherUserId = Number(userId.value)
  const messageSenderId = Number(data.senderId)
  const messageReceiverId = Number(data.receiverId)

  // 判断消息是否属于当前聊天
  const isCurrentChat = (messageSenderId === currentUserId && messageReceiverId === otherUserId) || 
                       (messageSenderId === otherUserId && messageReceiverId === currentUserId)

  console.log('消息判断：', {
    currentUserId,
    otherUserId,
    messageSenderId,
    messageReceiverId,
    isCurrentChat
  })

  if (isCurrentChat) {
    const isSender = messageSenderId === currentUserId
    
    // 将新消息添加到列表末尾
    messageList.value.push({
      id: Date.now().toString(),
      senderId: messageSenderId,
      content: data.message,
      messageType: data.type,
      createdAt: new Date().toISOString(),
      status: 'received',
      avatar: isSender ? userInfo.value.avatarUrl : avatar,
      nickname: isSender ? userInfo.value.nickname : nickname
    })

    // 滚动到底部
    scrollToBottom()
  }
}

// 获取消息类型的类名
const getMessageTypeClass = (type) => {
  const typeMap = {
    '1': 'text',
    '2': 'image',
    '3': 'voice',
  }
  return typeMap[type] || 'text'
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
    height: calc(100vh - 88rpx - 120rpx); // 减去头部和底部的高度
    box-sizing: border-box;

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
          justify-content: flex-start;

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
            background: #fff;
            color: #333;

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
            justify-content: flex-end;

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
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    transition: all 0.3s ease;

    &.keyboard-show {
      position: fixed;
      bottom: var(--window-bottom);
    }

    &.more-show {
      transform: translateY(-220rpx); // 更多功能面板的高度
    }

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

    .send-btn {
      width: 120rpx;
      height: 72rpx;
      background: #07c160;
      color: #fff;
      border-radius: 36rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28rpx;
      margin-left: 20rpx;
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
      transition: all 0.3s;
      
      &.recording {
        background: #e0e0e0;
        color: #333;
      }
    }
  }

  .more-panel {
    padding: 30rpx;
    background: #fff;
    display: flex;
    flex-wrap: wrap;
    position: fixed;
    bottom: 0; // 修改为底部
    left: 0;
    right: 0;
    z-index: 99;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
    transform: translateY(100%);
    transition: transform 0.3s ease;

    &.show {
      transform: translateY(0);
    }

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