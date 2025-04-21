<template>
	<view class="account-security-container">
		<view class="settings-list">
			<!-- 手机号码 -->
			<view class="settings-item" @click="goToModifyPhone">
				<view class="item-left">
					<text class="item-title">手机号码</text>
				</view>
				<view class="item-right">
					<text class="item-value">{{maskPhone(phoneNumber)}}</text>
					<uni-icons type="right" size="16" color="#999"></uni-icons>
				</view>
			</view>
			
			<!-- 修改密码 -->
			<!-- <view class="settings-item" @click="goToModifyPassword">
				<view class="item-left">
					<text class="item-title">修改密码</text>
				</view>
				<view class="item-right">
					<uni-icons type="right" size="16" color="#999"></uni-icons>
				</view>
			</view> -->
			
			<!-- 实名认证 -->
			<view class="settings-item" @click="goToVerification">
				<view class="item-left">
					<text class="item-title">实名认证</text>
				</view>
				<view class="item-right">
					<text class="item-value" :class="{'verified': isVerified}">{{verificationStatus}}</text>
					<uni-icons type="right" size="16" color="#999"></uni-icons>
				</view>
			</view>
		</view>
		
		<!-- 注销账号 -->
		<view class="delete-account" @click="handleDeleteAccount">
			<text class="delete-text">注销账号</text>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 用户手机号码
const phoneNumber = ref('')
// 实名认证状态
const isVerified = ref(false)
const verificationStatus = ref('未认证')

// 获取用户信息
onMounted(async () => {
	const userInfo = uni.getStorageSync('userInfo')
	if (userInfo) {
		phoneNumber.value = userInfo.phone || ''
		isVerified.value = userInfo.isVerified || false
		verificationStatus.value = isVerified.value ? '已认证' : '未认证'
	}
})

// 手机号码脱敏处理
const maskPhone = (phone) => {
	if (!phone) return ''
	return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 跳转到修改手机号页面
const goToModifyPhone = () => {
	uni.navigateTo({
		url: '/pages/verify-code/verify-code?type=modify-phone'
	})
}

// 跳转到修改密码页面
// const goToModifyPassword = () => {
// 	uni.navigateTo({
// 		url: '/pages/verify-code/verify-code?type=modify-password'
// 	})
// }

// 跳转到实名认证页面
const goToVerification = () => {
	uni.navigateTo({
		url: '/pages/verify-code/verify-code?type=verification'
	})
}

// 处理注销账号
const handleDeleteAccount = () => {
	uni.navigateTo({
		url: '/pages/verify-code/verify-code?type=delete-account'
	})
}
</script>

<style lang="scss" scoped>
.account-security-container {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-top: 20rpx;
}

.settings-list {
	background-color: #fff;
	
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
			.item-title {
				font-size: 28rpx;
				color: #333;
			}
		}
		
		.item-right {
			display: flex;
			align-items: center;
			
			.item-value {
				font-size: 28rpx;
				color: #999;
				margin-right: 10rpx;
				
				&.verified {
					color: #07c160;
				}
			}
		}
	}
}

.delete-account {
	margin-top: 20rpx;
	background-color: #fff;
	padding: 30rpx;
	text-align: center;
	
	.delete-text {
		font-size: 28rpx;
		color: #ff5151;
	}
}
</style> 