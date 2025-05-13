<template>
	<view class="blacklist-container">
		<!-- 顶部导航栏 -->
		<view class="nav-bar">
			<view class="back-btn" @click="goBack">
				<image src="/static/images/back.png" mode="aspectFit" class="back-icon"></image>
			</view>
			<text class="title">黑名单</text>
		</view>
		
		<!-- 页面提示信息 -->
		<view class="tips-bar" v-if="blacklist.length > 0">
			<text class="tips-text">提示：点击用户头像或信息可查看用户资料</text>
		</view>
		
		<!-- 列表内容区域 -->
		<scroll-view class="content" scroll-y @refresherrefresh="onRefresh" refresher-enabled :refresher-triggered="refreshing">
			<template v-if="loading && !refreshing">
				<view class="loading">
					<uni-load-more status="loading" :content-text="loadMoreText"></uni-load-more>
				</view>
			</template>
			
			<template v-else-if="blacklist.length === 0">
				<view class="empty-state">
					<image src="/static/images/empty-state.png" mode="aspectFit" class="empty-image"></image>
					<text class="empty-text">您的黑名单列表是空的</text>
					<text class="empty-desc">您可以在用户资料页右上角菜单中添加黑名单</text>
				</view>
			</template>
			
			<template v-else>
				<view class="blacklist-items">
					<view class="blacklist-item" v-for="(item, index) in blacklist" :key="item.blacklist.id">
						<view class="item-content">
							<view class="avatar-container" @click="viewUserProfile(item.user.id)">
								<image class="avatar" :src="item.user.avatar || '/static/images/default-avatar.png'" mode="aspectFill"></image>
							</view>
							<view class="user-info" @click="viewUserProfile(item.user.id)">
								<text class="nickname">{{item.user.nickname || '未设置昵称'}}</text>
								<text class="block-time">拉黑时间：{{formatTime(item.blacklist.createdAt)}}</text>
							</view>
							<button class="remove-btn" @click="handleRemoveFromBlacklist(item)">移除</button>
						</view>
					</view>
				</view>
			</template>
		</scroll-view>
	</view>
</template>

<script setup>
	import { ref, onMounted } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { getUserBlacklist, removeFromBlacklist } from '@/api/user.js';
	
	// 加载更多文本
	const loadMoreText = {
		contentdown: '上拉加载更多',
		contentrefresh: '加载中...',
		contentnomore: '没有更多了'
	};
	
	// 黑名单列表
	const blacklist = ref([]);
	// 加载状态
	const loading = ref(true);
	// 刷新状态
	const refreshing = ref(false);
	
	// 格式化时间
	const formatTime = (timestamp) => {
		if (!timestamp) return '未知时间';
		const date = new Date(timestamp);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const hour = String(date.getHours()).padStart(2, '0');
		const minute = String(date.getMinutes()).padStart(2, '0');
		return `${year}-${month}-${day} ${hour}:${minute}`;
	};
	
	// 获取黑名单列表
	const getBlacklist = async () => {
		loading.value = true;
		try {
			const userInfo = uni.getStorageSync('userInfo');
			if (!userInfo || !userInfo.id) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				loading.value = false;
				return;
			}
			
			const result = await getUserBlacklist();
			blacklist.value = result || [];
		} catch (error) {
			console.error('获取黑名单失败:', error);
			uni.showToast({
				title: '获取黑名单失败，请稍后重试',
				icon: 'none'
			});
		} finally {
			loading.value = false;
		}
	};
	
	// 从黑名单中移除
	const handleRemoveFromBlacklist = async (item) => {
		uni.showModal({
			title: '确认移除',
			content: `确定将"${item.user.nickname || '该用户'}"从黑名单中移除吗？`,
			success: async function(res) {
				if (res.confirm) {
					try {
						const userInfo = uni.getStorageSync('userInfo');
						if (!userInfo || !userInfo.id) {
							uni.showToast({
								title: '请先登录',
								icon: 'none'
							});
							return;
						}
						
						const success = await removeFromBlacklist(item.user.id);
						
						if (success) {
							// 从列表中移除该项
							blacklist.value = blacklist.value.filter(bl => bl.blacklist.id !== item.blacklist.id);
							uni.showToast({
								title: '已从黑名单中移除',
								icon: 'success'
							});
						} else {
							throw new Error('移除黑名单失败');
						}
					} catch (error) {
						console.error('移除黑名单失败:', error);
						uni.showToast({
							title: '操作失败，请稍后重试',
							icon: 'none'
						});
					}
				}
			}
		});
	};
	
	// 查看用户资料
	const viewUserProfile = (userId) => {
		if (!userId) return;
		uni.navigateTo({
			url: `/pages/profile/profile?userId=${userId}`
		});
	};
	
	// 返回上一页
	const goBack = () => {
		uni.navigateBack();
	};
	
	// 页面加载
	onLoad(() => {
		getBlacklist();
	});
	
	// 每次页面显示时刷新列表
	onShow(() => {
		getBlacklist();
	});
	
	// 下拉刷新
	const onRefresh = async () => {
		refreshing.value = true;
		await getBlacklist();
		refreshing.value = false;
	};
</script>

<style lang="less" scoped>
.blacklist-container {
	min-height: 100vh;
	background-color: #f8f8f8;
	display: flex;
	flex-direction: column;
	
	.nav-bar {
		position: relative;
		padding: 20rpx 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #ffffff;
		height: 44px;
		padding-top: calc(var(--status-bar-height) + 20rpx);
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
		
		.back-btn {
			position: absolute;
			left: 20rpx;
			top: calc(var(--status-bar-height) + 40rpx);
			
			.back-icon {
				width: 37rpx;
				height: 37rpx;
			}
		}
		
		.title {
			font-size: 36rpx;
			font-weight: bold;
			color: #333;
		}
	}
	
	.tips-bar {
		background-color: rgba(255, 236, 217, 0.7);
		padding: 16rpx 30rpx;
		border-bottom: 1rpx solid #FFE0B2;
		
		.tips-text {
			font-size: 26rpx;
			color: #E07900;
			display: flex;
			align-items: center;
			
			&:before {
				content: '';
				display: inline-block;
				width: 10rpx;
				height: 10rpx;
				background-color: #FF9500;
				border-radius: 50%;
				margin-right: 10rpx;
			}
		}
	}
	
	.content {
		flex: 1;
		padding: 30rpx;
		height: calc(100vh - 44px - var(--status-bar-height) - 70rpx);
		box-sizing: border-box;
		
		.loading {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 400rpx;
		}
		
		.empty-state {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding-top: 200rpx;
			
			.empty-image {
				width: 300rpx;
				height: 300rpx;
				margin-bottom: 40rpx;
				opacity: 0.8;
			}
			
			.empty-text {
				font-size: 32rpx;
				font-weight: 500;
				color: #333;
				margin-bottom: 20rpx;
			}
			
			.empty-desc {
				font-size: 28rpx;
				color: #999;
				text-align: center;
				line-height: 1.5;
				max-width: 80%;
			}
		}
		
		.blacklist-items {
			.blacklist-item {
				background-color: #ffffff;
				border-radius: 20rpx;
				overflow: hidden;
				box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
				transition: all 0.3s ease;
				margin-bottom: 30rpx;
				
				&:active {
					transform: scale(0.98);
					opacity: 0.9;
				}
				
				.item-content {
					display: flex;
					align-items: center;
					padding: 30rpx;
					
					.avatar-container {
						width: 110rpx;
						height: 110rpx;
						border-radius: 50%;
						overflow: hidden;
						margin-right: 30rpx;
						border: 4rpx solid rgba(143, 139, 250, 0.2);
						
						.avatar {
							width: 100%;
							height: 100%;
						}
					}
					
					.user-info {
						flex: 1;
						display: flex;
						flex-direction: column;
						margin-right: 25rpx;
						
						.nickname {
							font-size: 32rpx;
							font-weight: 500;
							color: #333;
							margin-bottom: 14rpx;
						}
						
						.block-time {
							font-size: 26rpx;
							color: #999;
							display: flex;
							align-items: center;
							
							&:before {
								content: '';
								display: inline-block;
								width: 12rpx;
								height: 12rpx;
								background-color: #FF3B30;
								opacity: 0.6;
								border-radius: 50%;
								margin-right: 10rpx;
							}
						}
					}
					
					.remove-btn {
						background: linear-gradient(135deg, #FF6B6B, #FF3B30);
						color: #fff;
						font-size: 24rpx;
						padding: 8rpx 24rpx;
						border-radius: 30rpx;
						margin: 0;
						box-shadow: 0 4rpx 12rpx rgba(255, 59, 48, 0.2);
						transition: all 0.3s ease;
						min-width: 48rpx;
						line-height: 1.4;
						height: auto;
						display: inline-flex;
						align-items: center;
						justify-content: center;
						white-space: nowrap;
						
						&:active {
							transform: scale(0.95);
							opacity: 0.9;
						}
						
						&::after {
							border: none;
						}
					}
				}
			}
		}
	}
}
</style> 