<template>
	<view class="verification-container">
		<!-- 身份证照片上传 -->
		<view class="upload-section">
			<!-- 正面照片 -->
			<view class="upload-item">
				<text class="upload-label">身份证人像面</text>
				<view class="upload-box" @click="chooseImage('front')" v-if="!frontImage">
					<uni-icons type="camera-filled" size="24" color="#999"></uni-icons>
					<text class="upload-tip">点击上传</text>
					<text class="upload-desc">请上传清晰的人像面照片</text>
				</view>
				<view class="image-preview" v-else>
					<image :src="frontImage" mode="aspectFill"></image>
					<view class="delete-btn" @click.stop="deleteImage('front')">
						<uni-icons type="close" size="20" color="#fff"></uni-icons>
					</view>
				</view>
			</view>

			<!-- 反面照片 -->
			<view class="upload-item">
				<text class="upload-label">身份证国徽面</text>
				<view class="upload-box" @click="chooseImage('back')" v-if="!backImage">
					<uni-icons type="camera-filled" size="24" color="#999"></uni-icons>
					<text class="upload-tip">点击上传</text>
					<text class="upload-desc">请上传清晰的国徽面照片</text>
				</view>
				<view class="image-preview" v-else>
					<image :src="backImage" mode="aspectFill"></image>
					<view class="delete-btn" @click.stop="deleteImage('back')">
						<uni-icons type="close" size="20" color="#fff"></uni-icons>
					</view>
				</view>
			</view>
		</view>

		<!-- 提示信息 -->
		<view class="tips">
			<text class="tip-text">• 请确保身份证照片清晰完整，无遮挡、无反光</text>
			<text class="tip-text">• 信息将通过身份证照片自动识别</text>
			<text class="tip-text">• 实名认证通过后不可修改</text>
		</view>

		<!-- 提交按钮 -->
		<button class="submit-btn" :disabled="!isValid" :class="{ 'btn-active': isValid }" @click="handleSubmit">
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

const frontImage = ref('')
const backImage = ref('')

// 表单是否有效
const isValid = computed(() => {
	return frontImage.value && backImage.value
})

// 选择图片
const chooseImage = (type) => {
	uni.chooseImage({
		count: 1,
		sizeType: ['compressed'],
		sourceType: ['camera', 'album'],
		success: (res) => {
			const tempFilePath = res.tempFilePaths[0]
			if (type === 'front') {
				frontImage.value = tempFilePath
			} else {
				backImage.value = tempFilePath
			}
		}
	})
}

// 删除图片
const deleteImage = (type) => {
	if (type === 'front') {
		frontImage.value = ''
	} else {
		backImage.value = ''
	}
}

// 提交认证
const handleSubmit = async () => {
	if (!isValid.value) return

	uni.showLoading({ title: '提交中' })

	try {

		try {
			// 上传所有选中的文件
				const blob = new Blob([frontImage.value], { type: frontImage.value.type || 'image/jpeg' })
				const fileToUpload = new File([blob], frontImage.value.name || 'image.jpg', {
					type: frontImage.value.type || 'image/jpeg'
				})

				const uploadRes = await realNameAuth(fileToUpload)
				console.log(uploadRes)
			
		} catch (error) {
			console.log('上传失败：', error)
			uni.showToast({
				title: '上传失败',
				icon: 'none'
			})
		} finally {
			uni.hideLoading()
		}
		// uni.hideLoading()
		// uni.showToast({
		// 	title: '认证成功',
		// 	icon: 'success',
		// 	complete: () => {
		// 		setTimeout(() => {
		// 			// 返回账号与安全页面
		// 			uni.navigateBack({
		// 				delta: 2
		// 			})
		// 		}, 1500)
		// 	}
		// })
	} catch (e) {
		uni.hideLoading()
		uni.showToast({ title: '认证失败，请重试', icon: 'none' })
	}
}
</script>

<style lang="scss" scoped>
.verification-container {
	padding: 40rpx;

	.upload-section {
		background: #fff;
		border-radius: 12rpx;
		padding: 30rpx;
		margin-bottom: 40rpx;

		.upload-item {
			margin-bottom: 30rpx;

			&:last-child {
				margin-bottom: 0;
			}

			.upload-label {
				font-size: 28rpx;
				color: #333;
				margin-bottom: 20rpx;
				display: block;
			}

			.upload-box {
				width: 100%;
				height: 360rpx;
				background: #f5f5f5;
				border-radius: 12rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				.upload-tip {
					font-size: 28rpx;
					color: #999;
					margin-top: 20rpx;
				}

				.upload-desc {
					font-size: 24rpx;
					color: #999;
					margin-top: 10rpx;
				}
			}

			.image-preview {
				width: 100%;
				height: 360rpx;
				position: relative;
				border-radius: 12rpx;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}

				.delete-btn {
					position: absolute;
					top: 20rpx;
					right: 20rpx;
					width: 44rpx;
					height: 44rpx;
					background: rgba(0, 0, 0, 0.5);
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
		}
	}

	.tips {
		padding: 0 30rpx;
		margin-bottom: 60rpx;

		.tip-text {
			font-size: 24rpx;
			color: #666;
			line-height: 1.8;
			display: block;

			&:last-child {
				color: #ff5151;
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