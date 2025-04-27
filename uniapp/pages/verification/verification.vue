<template>
	<view class="verification-container">
		<view class="form-group">
			<!-- 姓名输入 -->
			<view class="input-item">
				<text class="label">真实姓名</text>
				<input 
					type="text" 
					v-model="name"
					class="input" 
					placeholder="请输入真实姓名"
					maxlength="20"
				/>
			</view>
			
			<!-- 身份证号输入 -->
			<view class="input-item">
				<text class="label">身份证号</text>
				<input 
					type="idcard" 
					v-model="idCard"
					class="input" 
					placeholder="请输入身份证号"
					maxlength="18"
				/>
			</view>
		</view>
		
		<!-- 提示信息 -->
		<view class="tips">
			<text class="tip-text">请确保信息真实准确，实名认证通过后不可修改</text>
		</view>
		
		<!-- 提交按钮 -->
		<button 
			class="submit-btn" 
			:disabled="!isValid"
			:class="{'btn-active': isValid}"
			@click="handleSubmit"
		>
			提交认证
		</button>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { realNameAuth } from '@/api/user.js'
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

const name = ref('')
const idCard = ref('')

// 身份证号码校验
const isValidIdCard = computed(() => {
	const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
	return reg.test(idCard.value)
})

// 表单是否有效
const isValid = computed(() => {
	return name.value.length >= 2 && isValidIdCard.value
})

// 提交认证
const handleSubmit = async () => {
	if (!isValid.value) return
	
	uni.showLoading({ title: '提交中' })
	
	try {
		// TODO: 调用实名认证接口
		const res = await realNameAuth({
			name: name.value,
			Code: idCard.value
		})
		
		if(res.code === 200){
			uni.hideLoading()
		uni.showToast({ 
			title: '认证成功', 
			icon: 'success',
			complete: () => {
				setTimeout(() => {
					// 返回账号与安全页面
					uni.navigateBack({
						delta: 2
					})
				}, 100)
			}
		})
		}else{
			uni.hideLoading()
			uni.showToast({ title: '认证失败，请重试', icon: 'none' })
		}
		
	} catch (e) {
		uni.hideLoading()
		uni.showToast({ title: '认证失败，请重试', icon: 'none' })
	}
}
</script>

<style lang="scss" scoped>
.verification-container {
	padding: 40rpx;
	
	.form-group {
		background: #fff;
		border-radius: 12rpx;
		padding: 0 30rpx;
		margin-bottom: 40rpx;
		
		.input-item {
			padding: 30rpx 0;
			border-bottom: 1rpx solid #eee;
			
			&:last-child {
				border-bottom: none;
			}
			
			.label {
				font-size: 28rpx;
				color: #333;
				margin-bottom: 20rpx;
				display: block;
			}
			
			.input {
				height: 80rpx;
				font-size: 32rpx;
			}
		}
	}
	
	.tips {
		padding: 0 30rpx;
		margin-bottom: 60rpx;
		
		.tip-text {
			font-size: 24rpx;
			color: #ff5151;
			line-height: 1.5;
		}
	}
	
	.submit-btn {
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
			background: #007AFF;
		}
	}
}
</style> 