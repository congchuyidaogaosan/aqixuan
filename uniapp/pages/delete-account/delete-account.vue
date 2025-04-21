<template>
	<view class="delete-account-container">
		<!-- 警告信息 -->
		<view class="warning-section">
			<view class="warning-title">
				<uni-icons type="info-filled" size="20" color="#ff5151"></uni-icons>
				<text class="title-text">账号注销须知</text>
			</view>
			<view class="warning-content">
				<text class="warning-item">1. 账号注销后，所有数据将被清除且无法恢复</text>
				<text class="warning-item">2. 账号注销后，绑定的手机号将被释放</text>
				<text class="warning-item">3. 账号注销后，无法找回账号内的任何信息</text>
				<text class="warning-item">4. 请确保您已备份需要保存的重要信息</text>
			</view>
		</view>
		
		<!-- 确认选项 -->
		<view class="confirm-section">
			<checkbox-group @change="handleCheckboxChange">
				<label class="checkbox-label">
					<checkbox :checked="isChecked" color="#007AFF" />
					<text class="checkbox-text">我已阅读并同意注销账号</text>
				</label>
			</checkbox-group>
		</view>
		
		<!-- 注销按钮 -->
		<button 
			class="delete-btn" 
			:disabled="!isChecked"
			:class="{'btn-active': isChecked}"
			@click="handleDelete"
		>
			确认注销
		</button>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 校验是否已通过验证码验证
onMounted(() => {
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]
	const verified = currentPage.options.verified
	
	if (!verified) {
		uni.redirectTo({
			url: '/pages/account-security/account-security'
		})
	}
})

const isChecked = ref(false)

// 处理复选框变化
const handleCheckboxChange = (e) => {
	isChecked.value = e.detail.value.length > 0
}

// 处理注销
const handleDelete = async () => {
	if (!isChecked.value) return
	
	uni.showModal({
		title: '二次确认',
		content: '请再次确认是否注销账号？注销后将无法恢复！',
		confirmColor: '#ff5151',
		success: async (res) => {
			if (res.confirm) {
				uni.showLoading({ title: '处理中' })
				
				try {
					// TODO: 调用注销账号接口
					await new Promise(resolve => setTimeout(resolve, 1000))
					
					// 清除本地存储
					uni.clearStorageSync()
					
					uni.hideLoading()
					uni.showToast({ 
						title: '注销成功', 
						icon: 'success',
						complete: () => {
							setTimeout(() => {
								// 跳转到登录页
								uni.reLaunch({
									url: '/pages/login/login'
								})
							}, 1500)
						}
					})
				} catch (e) {
					uni.hideLoading()
					uni.showToast({ title: '注销失败，请重试', icon: 'none' })
				}
			}
		}
	})
}
</script>

<style lang="scss" scoped>
.delete-account-container {
	padding: 40rpx;
	
	.warning-section {
		background: #fff6f6;
		border-radius: 12rpx;
		padding: 30rpx;
		margin-bottom: 40rpx;
		
		.warning-title {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;
			
			.title-text {
				font-size: 32rpx;
				color: #ff5151;
				margin-left: 10rpx;
				font-weight: 500;
			}
		}
		
		.warning-content {
			.warning-item {
				font-size: 28rpx;
				color: #666;
				line-height: 1.8;
				display: block;
			}
		}
	}
	
	.confirm-section {
		background: #fff;
		border-radius: 12rpx;
		padding: 30rpx;
		margin-bottom: 60rpx;
		
		.checkbox-label {
			display: flex;
			align-items: center;
			
			.checkbox-text {
				font-size: 28rpx;
				color: #333;
				margin-left: 10rpx;
			}
		}
	}
	
	.delete-btn {
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		background: #e0e0e0;
		color: #fff;
		font-size: 32rpx;
		border-radius: 45rpx;
		border: none;
		
		&.btn-active {
			background: #ff5151;
		}
	}
}
</style> 