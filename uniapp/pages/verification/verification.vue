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
			<text class="privacy-text">您的个人信息将受到严格保护，仅用于身份验证</text>
		</view>
		
		<!-- 提交按钮 -->
		<button 
			class="submit-btn" 
			:disabled="!isValid || loading"
			:class="{'btn-active': isValid && !loading}"
			@click="handleSubmit"
		>
			{{loading ? '认证中...' : '提交认证'}}
		</button>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { realNameAuth, updateUser } from '@/api/user.js'
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
const loading = ref(false)

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
	
	loading.value = true
	uni.showLoading({ title: '提交中' })
	
	try {
		// 调用实名认证接口
		const res = await realNameAuth({
			name: name.value,
			Code: idCard.value  // 首字母大写，与后端IdentityCardDTO的属性名一致
		})
		
		if(res.code === 200){
			console.log('认证成功，返回数据:', res.data)
			
			// 认证成功，获取返回的用户信息
			const returnedUser = res.data.user
			
			// 获取当前本地存储的用户信息
			const userInfo = uni.getStorageSync('userInfo')
			
			// 合并现有用户信息和返回的最新信息
			const updatedUserInfo = {
				...userInfo,
				// 更新所有从服务器返回的字段
				id: returnedUser.id || userInfo.id,
				phone: returnedUser.phone || userInfo.phone, 
				nickname: returnedUser.nickname || userInfo.nickname,
				introduction: returnedUser.introduction || userInfo.introduction,
				location: returnedUser.location || userInfo.location,
				height: returnedUser.height || userInfo.height,
				weight: returnedUser.weight || userInfo.weight,
				birthday: returnedUser.birthday || userInfo.birthday,
				roleType: returnedUser.roleType || userInfo.roleType,
				industry: returnedUser.industry || userInfo.industry,
				emotionStatus: returnedUser.emotionStatus || userInfo.emotionStatus, 
				mbti: returnedUser.mbti || userInfo.mbti,
				datingPurpose: returnedUser.datingPurpose || userInfo.datingPurpose,
				interests: returnedUser.interests || userInfo.interests,
				sports: returnedUser.sports || userInfo.sports,
				ipAddress: returnedUser.ipAddress || userInfo.ipAddress,
				isVerified: returnedUser.isVerified,
				// 保留头像信息
				avatars: userInfo.avatars
			}
			
			// 将更新后的信息保存到本地存储
			uni.setStorageSync('userInfo', updatedUserInfo)
			console.log('更新后的用户信息:', updatedUserInfo)
			
			uni.hideLoading()
			loading.value = false
			uni.showToast({ 
				title: '认证成功', 
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
		} else {
			uni.hideLoading()
			loading.value = false
			uni.showToast({ title: '认证失败，请重试', icon: 'none' })
		}
		
	} catch (e) {
		console.error('认证失败:', e)
		uni.hideLoading()
		loading.value = false
		uni.showToast({ title: '认证失败，请重试', icon: 'none' })
	}
}
</script>

<style lang="scss" scoped>
.verification-container {
	padding: 40rpx;
	
	.form-group {
		background: #fff;
		border-radius: 16rpx;
		padding: 0 30rpx;
		margin-bottom: 40rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
		
		.input-item {
			padding: 30rpx 0;
			border-bottom: 1rpx solid #eee;
			
			&:last-child {
				border-bottom: none;
			}
			
			.label {
				font-size: 28rpx;
				color: #333;
				font-weight: 500;
				margin-bottom: 20rpx;
				display: block;
			}
			
			.input {
				height: 80rpx;
				font-size: 32rpx;
				color: #333;
				
				&::placeholder {
					color: #bbb;
				}
			}
		}
	}
	
	.tips {
		padding: 10rpx 30rpx 30rpx;
		margin-bottom: 60rpx;
		
		.tip-text {
			font-size: 24rpx;
			color: #ff5151;
			line-height: 1.5;
			margin-bottom: 10rpx;
			display: block;
		}
		
		.privacy-text {
			font-size: 24rpx;
			color: #999;
			line-height: 1.5;
			display: block;
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
		position: relative;
		overflow: hidden;
		
		&.btn-active {
			background: linear-gradient(135deg, #007AFF, #0056b3);
			box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.2);
		}
		
		&:after {
			border: none;
		}
	}
}
</style> 