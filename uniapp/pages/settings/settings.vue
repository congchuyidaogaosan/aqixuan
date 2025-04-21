<template>
	<view class="settings-container">
		<!-- 设置列表 -->
		<view class="settings-list">
			<!-- 账号与安全 -->
			<view class="settings-item" @click="goToAccountSecurity">
				<view class="item-left">
					<text class="item-title">账号与安全</text>
				</view>
				<view class="item-right">
					<uni-icons type="right" size="16" color="#999"></uni-icons>
				</view>
			</view>
			
			<!-- 黑名单 -->
			<view class="settings-item" @click="goToBlacklist">
				<view class="item-left">
					<text class="item-title">黑名单</text>
				</view>
				<view class="item-right">
					<uni-icons type="right" size="16" color="#999"></uni-icons>
				</view>
			</view>
		</view>
		
		<!-- 退出登录按钮 -->
		<view class="logout-section">
			<button class="logout-btn" @click="handleLogout">退出登录</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'

// 跳转到账号与安全页面
const goToAccountSecurity = () => {
	uni.navigateTo({
		url: '/pages/account-security/account-security'
	})
}

// 跳转到黑名单页面
const goToBlacklist = () => {
	uni.navigateTo({
		url: '/pages/blacklist/blacklist'
	})
}

// 处理退出登录
const handleLogout = () => {
	uni.showModal({
		title: '提示',
		content: '确定要退出登录吗？',
		success: (res) => {
			if (res.confirm) {
				// 清除登录状态和用户信息
				uni.removeStorageSync('token')
				uni.removeStorageSync('userInfo')
				
				// 跳转到登录页面
				uni.reLaunch({
					url: '/pages/login/login'
				})
			}
		}
	})
}
</script>

<style lang="scss" scoped>
.settings-container {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-top: 20rpx;
}

.settings-list {
	background-color: #fff;
	margin-bottom: 20rpx;
	
	.settings-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1rpx solid #eee;
		
		&:last-child {
			border-bottom: none;
		}
		
		.item-left {
			display: flex;
			align-items: center;
			
			.item-title {
				font-size: 28rpx;
				color: #333;
			}
		}
		
		.item-right {
			display: flex;
			align-items: center;
		}
	}
}

.logout-section {
	padding: 40rpx 30rpx;
	
	.logout-btn {
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		background-color: #fff;
		color: #ff5151;
		font-size: 32rpx;
		border-radius: 45rpx;
		border: none;
		
		&:active {
			opacity: 0.8;
		}
	}
}
</style> 