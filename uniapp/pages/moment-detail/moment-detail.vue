<template>
  <view class="moment-detail">
    <!-- 头部导航 -->
    <view class="nav-header">
      <view class="left" @click="goBack">
        <image src="/static/images/back.png" mode="aspectFit" class="back-icon"></image>
      </view>
      <view class="title">动态详情</view>
      <view class="right"></view>
    </view>
    
    <!-- 动态内容 -->
    <scroll-view 
      class="content" 
      scroll-y
      :refresher-enabled="true"
      :refresher-triggered="refreshing"
      @refresherrefresh="refresh"
    >
      <view class="moment-content" v-if="momentDetail">
        <!-- 用户信息 -->
        <view class="user-info">
          <image :src="momentDetail.userAvatarUrl" mode="aspectFill" class="avatar"></image>
          <view class="user-meta">
            <text class="nickname">{{momentDetail.userNickname}}</text>
            <text class="time">{{formatTime(momentDetail.createdAt)}}</text>
          </view>
        </view>
        
        <!-- 动态内容 -->
        <view class="text-content" v-if="momentDetail.content">
          <text>{{momentDetail.content}}</text>
        </view>
        
        <!-- 媒体内容 -->
        <swiper 
          v-if="momentDetail.list && momentDetail.list.length > 0"
          class="media-swiper" 
          :indicator-dots="momentDetail.list.length > 1"
          :autoplay="false"
          :duration="500"
          :circular="true"
        >
          <swiper-item v-for="media in momentDetail.list" :key="media.id">
            <video
              v-if="media.mediaType === '2'"
              :src="media.mediaUrl"
              class="media-item"
              :controls="true"
              :show-center-play-btn="true"
              object-fit="cover"
            ></video>
            <image 
              v-else
              :src="media.mediaUrl"
              mode="aspectFill"
              class="media-item"
              @click="previewImage(momentDetail.list.filter(item => item.mediaType === '1').map(item => item.mediaUrl), media.mediaUrl)"
            ></image>
          </swiper-item>
        </swiper>
        
        <!-- 互动数据 -->
        <view class="interaction">
          <view class="stats">
            <view class="item" @click="handleLike">
              <image 
                :src="momentDetail.isLiked ? '/static/images/liked.png' : '/static/images/like.png'" 
                mode="aspectFit" 
                class="like-icon"
              ></image>
              <text class="count">{{momentDetail.likesCount || 0}}</text>
              <text class="label">点赞</text>
            </view>
            <view class="item" @click="showCommentBox()">
              <image src="/static/images/pinglun.png" mode="aspectFit" class="comment-icon"></image>
              <text class="count">{{momentDetail.commentsCount || 0}}</text>
              <text class="label">评论</text>
            </view>
          </view>
          <view class="location" v-if="momentDetail.location">
            <text>{{momentDetail.location}}</text>
          </view>
        </view>
      </view>

      <!-- 评论列表 -->
      <view class="comments">
        <view class="comment-header">
          <text class="title">评论 {{momentDetail?.commentsCount || 0}}</text>
        </view>
        <view 
          class="comment-item"
          v-for="comment in momentDetail?.comments"
          :key="comment.id"
          :style="{ marginLeft: comment.parentId ? '40rpx' : '0' }"
        >
          <view class="comment-user">
            <image :src="comment.userAvatarUrl" mode="aspectFill" class="comment-avatar"></image>
            <view class="comment-info">
              <view class="comment-nickname">{{comment.userNickname}}</view>
              <view class="comment-content">
                <text v-if="comment.replyToNickname" class="reply-to">回复 {{comment.replyToNickname}}：</text>
                {{comment.content}}
              </view>
              <view class="comment-footer">
                <text class="comment-time">{{formatTime(comment.createdAt)}}</text>
                <text class="reply-btn" @click="showCommentBox(comment)">回复</text>
                <text 
                  v-if="comment.userId === userInfo.id" 
                  class="delete-btn" 
                  @click="handleDeleteComment(comment)"
                >删除</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 评论输入框 -->
    <view class="comment-input" v-if="showCommentInput">
      <view class="input-mask" @click="hideCommentBox"></view>
      <view class="input-box">
        <input 
          type="text" 
          v-model="commentContent" 
          :placeholder="replyTo ? `回复 ${replyTo.userNickname}` : '说点什么...'" 
          @confirm="submitComment"
          auto-focus
        />
        <button class="submit-btn" @click="submitComment">发送</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { formatTime } from '@/utils/date.js'
import { 
  getMomentDetail,
  likeMoment, 
  unlikeMoment,
  addComment,
  deleteComment,
  getUserInfoById
} from '@/api/user.js'

const momentDetail = ref(null)
const refreshing = ref(false)
const showCommentInput = ref(false)
const replyTo = ref(null)
const commentContent = ref('')
const userInfo = ref(uni.getStorageSync('userInfo') || {})

// 获取动态详情
const loadMomentDetail = async () => {
  try {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const momentId = currentPage.options?.momentId
    
    if (!momentId) {
      uni.showToast({
        title: '参数错误',
        icon: 'none'
      })
      return
    }

    const res = await getMomentDetail(momentId)
    if (res && res.length > 0) {
      // 获取用户信息
      const userRes = await getUserInfoById(res[0].userId)
      console.log(userRes)


      momentDetail.value = {
        ...res[0],
        userNickname: userRes.data[0].nickname,
        userAvatarUrl: userRes.data[0].handImg,
        isLiked: false, // TODO: 需要后端返回是否已点赞
      }
    }
  } catch (error) {
    console.log('获取动态详情失败：', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    refreshing.value = false
  }
}

// 处理点赞
const handleLike = async () => {
  try {
    if (momentDetail.value.isLiked) {
      await unlikeMoment(momentDetail.value.id)
      momentDetail.value.isLiked = false
      momentDetail.value.likesCount = (momentDetail.value.likesCount || 1) - 1
    } else {
      await likeMoment(momentDetail.value.id)
      momentDetail.value.isLiked = true
      momentDetail.value.likesCount = (momentDetail.value.likesCount || 0) + 1
    }
  } catch (error) {
    uni.showToast({
      title: error.message || '操作失败',
      icon: 'none'
    })
  }
}

// 显示评论框
const showCommentBox = (comment = null) => {
  replyTo.value = comment
  showCommentInput.value = true
}

// 隐藏评论框
const hideCommentBox = () => {
  showCommentInput.value = false
  replyTo.value = null
  commentContent.value = ''
}

// 提交评论
const submitComment = async () => {
  if (!commentContent.value.trim()) {
    uni.showToast({
      title: '请输入评论内容',
      icon: 'none'
    })
    return
  }

  try {
    const data = {
      momentId: momentDetail.value.id,
      content: commentContent.value,
      parentId: replyTo.value?.parentId || replyTo.value?.id || null,
    //   replyToUserId: replyTo.value?.userId || null
    }

    await addComment(data)
    hideCommentBox()
    
    // 刷新动态详情
    await loadMomentDetail()
    
    uni.showToast({
      title: '评论成功',
      icon: 'success'
    })
  } catch (error) {
    uni.showToast({
      title: error.message || '评论失败',
      icon: 'none'
    })
  }
}

// 删除评论
const handleDeleteComment = async (comment) => {
  try {
    await deleteComment(comment.id)
    
    // 刷新动态详情
    await loadMomentDetail()
    
    uni.showToast({
      title: '删除成功',
      icon: 'success'
    })
  } catch (error) {
    uni.showToast({
      title: error.message || '删除失败',
      icon: 'none'
    })
  }
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 下拉刷新
const refresh = () => {
  refreshing.value = true
  loadMomentDetail()
}

// 预览图片
const previewImage = (urls, current) => {
  uni.previewImage({
    urls,
    current
  })
}

onMounted(() => {
  loadMomentDetail()
})
</script>

<style lang="less" scoped>
.moment-detail {
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
    height: calc(100vh - 88rpx);
    
    .moment-content {
      background: #fff;
      margin-bottom: 20rpx;
      
      .user-info {
        display: flex;
        align-items: center;
        padding: 20rpx;
        
        .avatar {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
          margin-right: 20rpx;
        }
        
        .user-meta {
          display: flex;
          flex-direction: column;
          gap: 4rpx;
          
          .nickname {
            font-size: 28rpx;
            font-weight: 500;
            color: #333;
          }
          
          .time {
            font-size: 24rpx;
            color: #999;
          }
        }
      }
      
      .text-content {
        padding: 20rpx;
        font-size: 28rpx;
        color: #333;
        line-height: 1.5;
      }
      
      .media-swiper {
        width: 100%;
        height: 750rpx;
        
        .media-item {
          width: 100%;
          height: 100%;
        }
      }
      
      .interaction {
        padding: 20rpx;
        
        .stats {
          display: flex;
          gap: 30rpx;
          margin-bottom: 16rpx;
          
          .item {
            display: flex;
            align-items: center;
            gap: 8rpx;
            
            .like-icon, .comment-icon {
              width: 40rpx;
              height: 40rpx;
            }
            
            .count {
              font-size: 28rpx;
              color: #333;
              font-weight: 500;
            }
            
            .label {
              font-size: 24rpx;
              color: #999;
            }
          }
        }
        
        .location {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
    
    .comments {
      background: #fff;
      padding: 20rpx;
      
      .comment-header {
        margin-bottom: 20rpx;
        
        .title {
          font-size: 28rpx;
          font-weight: 500;
          color: #333;
        }
      }
      
      .comment-item {
        margin-bottom: 20rpx;
        
        .comment-user {
          display: flex;
          align-items: flex-start;
          
          .comment-avatar {
            width: 60rpx;
            height: 60rpx;
            border-radius: 50%;
            margin-right: 16rpx;
          }
          
          .comment-info {
            flex: 1;
            
            .comment-nickname {
              font-size: 26rpx;
              color: #666;
              margin-bottom: 8rpx;
            }
            
            .comment-content {
              font-size: 28rpx;
              color: #333;
              margin-bottom: 8rpx;
              
              .reply-to {
                color: #007AFF;
                margin-right: 8rpx;
              }
            }
            
            .comment-footer {
              display: flex;
              align-items: center;
              gap: 16rpx;
              
              .comment-time {
                font-size: 24rpx;
                color: #999;
              }
              
              .reply-btn, .delete-btn {
                font-size: 24rpx;
                color: #666;
                padding: 4rpx 8rpx;
              }
            }
          }
        }
      }
    }
  }
  
  .comment-input {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    
    .input-mask {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
    }
    
    .input-box {
      position: relative;
      display: flex;
      align-items: center;
      padding: 20rpx;
      background: #fff;
      border-top: 1rpx solid #eee;
      
      input {
        flex: 1;
        height: 72rpx;
        background: #f5f5f5;
        border-radius: 36rpx;
        padding: 0 30rpx;
        font-size: 28rpx;
        margin-right: 20rpx;
      }
      
      .submit-btn {
        width: 120rpx;
        height: 72rpx;
        line-height: 72rpx;
        text-align: center;
        background: #007AFF;
        color: #fff;
        border-radius: 36rpx;
        font-size: 28rpx;
      }
    }
  }
}
</style> 