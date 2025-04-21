<template>
	<view class="modify-phone-container">
		<view class="form-group">
			<!-- 新手机号输入 -->
			<view class="input-item">
				<text class="label">新手机号</text>
				<input 
					type="number" 
					v-model="phone"
					class="input" 
					placeholder="请输入新手机号"
					maxlength="11"
				/>
			</view>
			
			<!-- 验证码输入 -->
			<view class="input-item">
				<text class="label">验证码</text>
				<view class="code-input-wrap">
					<input 
						type="number" 
						v-model="code"
						class="input" 
						placeholder="请输入验证码"
						maxlength="6"
					/>
					<text 
						class="send-code-btn" 
						:class="{'disabled': !canSendCode || countdown > 0}"
						@click="sendCode"
					>
						{{countdown > 0 ? `${countdown}s` : '获取验证码'}}
					</text>
				</view>
			</view>
		</view>
		
		<!-- 提交按钮 -->
		<button 
			class="submit-btn" 
			:disabled="!isValid"
			:class="{'btn-active': isValid}"
			@click="handleSubmit"
		>
			确认修改
		</button>
	</view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { sendSmsCode } from '@/api/user.js'

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

const phone = ref('')
const code = ref('')
const countdown = ref(0)
let timer = null

// 清理定时器
onUnmounted(() => {
	if (timer) {
		clearInterval(timer)
		timer = null
	}
})

// 是否可以发送验证码
const canSendCode = computed(() => {
	return /^1[3-9]\d{9}$/.test(phone.value)
})

// 表单是否有效
const isValid = computed(() => {
	return canSendCode.value && code.value.length === 6
})

// 发送验证码
const sendCode = async () => {
	if (!canSendCode.value || countdown.value > 0) return
	
	uni.showLoading({ title: '发送中' })
	
	try {
		const result = await sendSmsCode(phone.value)
		
		// 开始倒计时
		countdown.value = 60
		timer = setInterval(() => {
			if (countdown.value > 0) {
				countdown.value--
			} else {
				clearInterval(timer)
				timer = null
			}
		}, 1000)
		
		uni.hideLoading()
		uni.showToast({ title: '验证码已发送', icon: 'none' })
		
		if(result.code) {
			code.value = result.code
		}
	} catch (e) {
		uni.hideLoading()
		uni.showToast({ title: '发送失败，请重试', icon: 'none' })
	}
}

// 提交修改
const handleSubmit = async () => {
	if (!isValid.value) return
	
	uni.showLoading({ title: '提交中' })
	
	try {
		// TODO: 调用修改手机号接口
		await new Promise(resolve => setTimeout(resolve, 1000))
		
		uni.hideLoading()
		uni.showToast({ 
			title: '修改成功', 
			icon: 'success',
			complete: () => {
				setTimeout(() => {
					// 返回账号与安全页面
					uni.navigateBack({
						delta: 2
					})
				}, 1500)
			}
		})
	} catch (e) {
		uni.hideLoading()
		uni.showToast({ title: '修改失败，请重试', icon: 'none' })
	}
}
</script>

<style lang="scss" scoped>
.modify-phone-container {
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
			
			.code-input-wrap {
				display: flex;
				align-items: center;
				
				.input {
					flex: 1;
				}
				
				.send-code-btn {
					width: 200rpx;
					height: 80rpx;
					line-height: 80rpx;
					text-align: center;
					font-size: 28rpx;
					color: #007AFF;
					
					&.disabled {
						color: #999;
					}
				}
			}
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