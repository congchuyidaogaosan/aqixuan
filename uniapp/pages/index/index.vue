<template>
	<view class="container">
		<!-- 页面头部 -->
		<view class="page-head">
			<view class="search-btn" @click="goToSearch">
				<image src="/static/images/search.png" mode="aspectFit" class="icon"></image>
			</view>
		</view>
		
		<!-- 原有内容 -->
		<view class="content">
			<image class="logo" src="/static/logo.png"></image>
			<view class="text-area">
				<text class="title">{{title}}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { updateUser } from '@/api/user.js'

const title = ref('Hello')
// 获取地理位置
const location = ref('')
const getLocation = async () => {
  // #ifdef H5
  const res = await uni.getLocation({
    type: 'wgs84', // H5环境使用wgs84
    success: (res) => {
      location.value = {
        latitude: res.latitude,
        longitude: res.longitude
      }
      console.log('位置信息：', location.value)
      updateUserLocation(location.value)
    },
    fail: (err) => {
      console.log('获取位置失败：', err)
    }
  })
  // #endif
  
  // #ifdef MP-WEIXIN
  const res = await uni.getLocation({
    type: 'gcj02', // 微信小程序使用gcj02
    success: (res) => {
      location.value = {
        longitude: res.longitude,
		latitude: res.latitude
      }
      console.log('位置信息：', location.value)
      updateUserLocation(location.value)
    },
    fail: (err) => {
      console.log('获取位置失败：', err)
    }
  })
  // #endif
}

// 更新用户位置信息
const updateUserLocation = async (location) => {
  try {
      await updateUser({
        ipAddress: location.longitude+","+location.latitude
      })
  } catch (error) {
    console.log('更新位置失败：', error)
  }
}

// 页面生命周期
// onLoad(() => {
//   console.log('页面加载')
//   getLocation()
// })

onShow(() => {
	console.log('页面显示')
	getLocation()
})

// 跳转到搜索页面
const goToSearch = () => {
	uni.navigateTo({
		url: '/pages/search/search'
	})
}
</script>

<style lang="less" scoped>
.container {
	width: 100%;
	min-height: 100vh;
	background: #f5f5f5;
	
	// 页面头部
	.page-head {
		width: 100%;
		padding: 20rpx;
		display: flex;
		justify-content: flex-start;  // 改为左对齐
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		box-sizing: border-box;
		padding-top: calc(var(--status-bar-height) + 20rpx);
		background: transparent;  // 背景改为透明
		
		.search-btn {
			width: 37rpx;
			height: 37rpx;
			padding: 10rpx;
			margin-left: 10rpx;  // 添加左边距
			display: flex;
			align-items: center;
			justify-content: center;
			
			.icon {
				width: 100%;
				height: 100%;
			}
		}
	}
	
	// 原有样式
	.content {
		padding-top: calc(var(--status-bar-height) + 88rpx);  // 为固定头部留出空间
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		
		.logo {
			height: 200rpx;
			width: 200rpx;
			margin-top: 200rpx;
			margin-left: auto;
			margin-right: auto;
			margin-bottom: 50rpx;
		}
		
		.text-area {
			display: flex;
			justify-content: center;
			
			.title {
				font-size: 36rpx;
				color: #8f8f94;
			}
		}
	}
}
</style>
