<template>
	<view class="activity-detail">
		<!-- 头部导航 -->
		<view class="nav-header">
			<view class="left" @click="goBack">
				<image src="/static/images/back.png" mode="aspectFit" class="back-icon"></image>
			</view>
			<view class="title">活动详情</view>
			<view class="right"></view>
		</view>

		<!-- 活动内容 -->
		<scroll-view class="content" scroll-y>
			<!-- 活动图片 -->
			<view class="activity-image">
				<image :src="activityInfo.handImg" mode="aspectFill"></image>
			</view>

			<view class="detail-section">
				<!-- 活动标题和类型 -->
				<view class="title-row">
					<text class="title">{{activityInfo.title}}</text>
					<text class="type-tag">{{getActivityTypeName(activityInfo.activityType)}}</text>
				</view>

				<!-- 发起人信息 -->
				<view class="organizer-info">
					<image :src="activityInfo.userInfo.handImg" mode="aspectFill" class="avatar"></image>
					<text class="nickname">{{activityInfo.userInfo.nickname}}</text>
				</view>

				<!-- 活动状态信息 -->
				<view class="status-info">
					<view class="status-item">
						<text class="label">活动人数</text>
						<text class="value">{{activityInfo.currentNumber}}/{{activityInfo.totalNumber}}人</text>
					</view>
					<view class="status-item">
						<text class="label">活动时间</text>
						<view class="time-range">
							<text>{{activityInfo.startTime}}</text>
							<text>至</text>
							<text>{{activityInfo.endTime}}</text>
						</view>
					</view>
					<view class="status-item">
						<text class="label">活动地点</text>
						<text class="value location" @click="openLocation">{{activityInfo.location}}</text>
					</view>
				</view>

				<!-- 费用信息 -->
				<view class="cost-info">
					<view class="cost-item">
						<text class="label">费用类型</text>
						<text class="value">{{getCostTypeName(activityInfo.costType)}}</text>
					</view>
					<view class="cost-item" v-if="activityInfo.costType !== 0">
						<text class="label">活动费用</text>
						<text
							class="value">{{activityInfo.costType === 1 ? '每人' + (activityInfo.cost / activityInfo.totalNumber).toFixed(2) : activityInfo.cost}}元</text>
					</view>
					<view class="cost-item" v-if="activityInfo.penaltyCost > 0">
						<text class="label">鸽子费</text>
						<text class="value">{{activityInfo.penaltyCost}}元</text>
						<text class="tip">（报名后不参加将扣除该费用）</text>
					</view>
				</view>

				<!-- 活动介绍 -->
				<view class="description">
					<view class="section-title">活动介绍</view>
					<text class="desc-content">{{activityInfo.description}}</text>
				</view>

				<!-- 报名列表 -->
				<view class="participants">
					<view class="section-title">
						<text>报名列表</text>
						<text class="count">({{activityInfo.currentNumber}}/{{activityInfo.totalNumber}})</text>
					</view>
					<view class="participant-list">
						<view class="participant-item" v-for="(participant, index) in participants" :key="index">
							<image :src="participant.avatar" mode="aspectFill" class="avatar"></image>
							<text class="nickname">{{participant.nickname}}</text>
							<text class="join-time">{{participant.joinTime}}</text>
							<!-- 活动发起人显示操作按钮 -->
							<template v-if="activityInfo.userId === getCurrentUserId()">
								<!-- 待确认状态显示操作按钮 -->
								<view class="action-btns" v-if="participant.status === 1">
									<button class="action-btn agree" @click.stop="handleAgree(participant)">同意</button>
									<button class="action-btn refuse"
										@click.stop="handleRefuse(participant)">拒绝</button>
								</view>
								<!-- 其他状态显示状态文本 -->
								<text v-else class="status-text" :class="{
                    'agreed': participant.status === 2,
                    'refused': participant.status === 3
                  }">
									{{participant.status === 2 ? '已确认' : '已拒绝'}}
								</text>
							</template>
							<!-- 非发起人显示状态文本 -->
							<text v-else class="status-text" :class="{
                  'pending': participant.status === 1,
                  'agreed': participant.status === 2,
                  'refused': participant.status === 3
                }">
								{{participant.status === 1 ? '待处理' : participant.status === 2 ? '已同意' : '已拒绝'}}
							</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 底部报名按钮 -->
		<view class="bottom-btn">
			<button class="join-btn" :class="{
          'disabled': isActivityFull || hasJoined || isExpired,
          'joined': hasJoined,
          'organizer': activityInfo.userId === getCurrentUserId()
        }" @click="handleJoin">
				{{getButtonText}}
			</button>
		</view>
	</view>
</template>

<script setup>
	import { onShow, onLoad } from '@dcloudio/uni-app'
	
	import {
		ref,
		computed,
		onMounted
	} from 'vue'
	import {
		getActivityDetail as getActivityDetailApi,
		getUserInfoById,
		joinActivity,
		agreeOrRefuse
	} from '@/api/user.js'

	// 活动信息
	const activityInfo = ref({
		title: '',
		activityType: 0,
		organizerAvatar: '',
		organizerName: '',
		currentNumber: 0,
		totalNumber: 0,
		startTime: '',
		endTime: '',
		location: '',
		costType: 0,
		cost: 0,
		penaltyCost: 0,
		description: '',
		latitude: 0,
		longitude: 0
	})

	const optionsActivityId = ref(0)

	// 参与者列表
	const participants = ref([])

	// 计算属性
	const isActivityFull = computed(() => {
		return activityInfo.value.currentNumber >= activityInfo.value.totalNumber
	})

	const hasJoined = ref(false)

	const isExpired = computed(() => {
		return new Date(activityInfo.value.endTime) < new Date()
	})

	const getButtonText = computed(() => {
		const currentUserId = getCurrentUserId()
		// 判断是否是活动发起人
		if (activityInfo.value.userId === currentUserId) {
			return '我是发起人'
		}
		if (hasJoined.value) {
			return '已报名'
		}
		if (isExpired.value) {
			return '活动已结束'
		}
		if (isActivityFull.value) {
			return '人数已满'
		}
		return '立即报名'
	})

	// 获取活动类型名称
	const getActivityTypeName = (type) => {
		const types = {
			0: '运动',
			1: '游戏',
			2: '旅行',
			3: '学习',
			4: '美食',
			5: '电影',
			6: '其他'
		}
		return types[type] || '其他'
	}

	// 获取费用类型名称
	const getCostTypeName = (type) => {
		const types = {
			0: '免费',
			1: 'AA',
			2: '其他'
		}
		return types[type] || '其他'
	}

	// 打开地图
	const openLocation = () => {
		uni.openLocation({
			latitude: activityInfo.value.latitude,
			longitude: activityInfo.value.longitude,
			name: activityInfo.value.location
		})
	}

	// 处理报名
	const handleJoin = () => {
		const currentUserId = getCurrentUserId()

		// 是活动发起人时不处理点击
		if (activityInfo.value.userId === currentUserId) {
			return
		}

		if (isActivityFull.value || hasJoined.value || isExpired.value) {
			return
		}

		// 检查是否登录
		if (!currentUserId) {
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			})
			return
		}

		// 显示确认弹窗
		uni.showModal({
			title: '确认报名',
			content: activityInfo.value.penaltyCost > 0 ?
				`报名后不参加将扣除鸽子费${activityInfo.value.penaltyCost}元，是否确认报名？` : '是否确认报名该活动？',
			success: (res) => {
				if (res.confirm) {
					submitJoin()
				}
			}
		})
	}

	// 提交报名
	const submitJoin = () => {
		uni.showLoading({
			title: '报名中...',
			mask: true
		})

		joinActivity({
			activityId: activityInfo.value.id,
		}).then(res => {
			uni.hideLoading()
			uni.showToast({
				title: '报名成功',
				icon: 'success'
			})
			hasJoined.value = true
			// 更新活动信息
			getActivityDetail(activityInfo.value.id)
		}).catch(err => {
			uni.hideLoading()
			uni.showToast({
				title: err.message || '报名失败',
				icon: 'none'
			})
		})
	}

	// 获取活动详情
	const getActivityDetail = (activityId) => {
		console.log("正在获取详情");
		uni.showLoading({
			title: '加载中...',
			mask: true
		})

		getActivityDetailApi(activityId)
			.then(res => {
				console.log("后端返回数据:", res);
				if (res) {
					// 1. 获取活动信息
					const activity = res.activity;
					
					// 2. 获取创建者信息
					const creator = res.creator || {};
					
					// 如果没有创建者信息，再请求一次
					if (!creator || !creator.id) {
						getUserInfoById(activity.userId).then(userInfo => {
							console.log("单独获取的创建者信息:", userInfo);
							
							// 更新活动信息对象
							updateActivityInfo(activity, userInfo.data);
						}).catch(err => {
							console.error("获取创建者信息失败:", err);
							
							// 创建默认的创建者信息对象
							const defaultCreator = {
								id: activity.userId,
								nickname: "未知用户",
								avatarUrl: "/static/images/default-avatar.png"
							};
							
							// 更新活动信息对象
							updateActivityInfo(activity, defaultCreator);
						});
					} else {
						// 直接更新活动信息对象
						updateActivityInfo(activity, creator);
					}
					
					// 3. 处理报名列表
					const participantsList = res.participants || [];
					console.log("报名列表:", participantsList);
					
					participants.value = participantsList.map(item => ({
						id: item.activitySignup.id,
						avatar: item.user?.avatarUrl || '/static/images/default-avatar.png',
						nickname: item.user?.nickname || '未知用户',
						joinTime: item.signupTime || item.activitySignup.createdAt, // 使用新的signupTime字段
						status: Number(item.activitySignup.status),
						userId: item.user.id
					}));
					
					// 4. 检查当前用户是否已报名
					const currentUserId = getCurrentUserId();
					hasJoined.value = participantsList.some(item => 
						item.user.id === currentUserId
					);
				}
			})
			.catch(err => {
				uni.showToast({
					title: err.message || '加载失败',
					icon: 'none'
				});
				console.error("获取活动详情失败:", err);
			})
			.finally(() => {
				uni.hideLoading();
			});
	}
	
	// 辅助函数：更新活动信息对象
	const updateActivityInfo = (activity, creator) => {
		activityInfo.value = {
			id: activity.id,
			userId: activity.userId,
			userInfo: {
				id: creator.id,
				nickname: creator.nickname || "未知用户",
				handImg: creator.avatarUrl || "/static/images/default-avatar.png"
			},
			activityType: Number(activity.activityType),
			title: activity.title,
			description: activity.description,
			location: activity.location,
			totalNumber: activity.totalNumber,
			currentNumber: activity.currentNumber,
			startTime: activity.startTime,
			endTime: activity.endTime,
			cost: activity.cost,
			costType: activity.costType,
			penaltyCost: activity.penaltyCost,
			status: activity.status,
			handImg: activity.handImg || "/static/images/default-activity.png"
		};
		console.log("更新后的活动信息:", activityInfo.value);
		
		// 处理经纬度
		if (activity.ip) {
			const [longitude, latitude] = activity.ip.split(',');
			activityInfo.value.latitude = Number(latitude);
			activityInfo.value.longitude = Number(longitude);
		}
	}

	// 返回上一页
	const goBack = () => {
		uni.navigateBack(1);
	}

	// 页面加载时获取活动详情
	// onMounted(() => {
	// 	const pages = getCurrentPages()
	// 	const currentPage = pages[pages.length - 1]
	// 	const activityId = currentPage.options.id
	// 	getActivityDetail(activityId)
	// })
	
	onShow(()=> {
		// 获取活动详情
		// const pages`` = getCurrentPages()
		// var activityId = options.id;
		// console.log(activityId)
		// const currentPage = pages[pages.length - 1]
		// const activityId = currentPage.options.id
		getActivityDetail(optionsActivityId.value)
	})
	
	onLoad((options)=>{
	    optionsActivityId.value = options.id;
		getActivityDetail(optionsActivityId.value)
		
	})

	// 获取当前用户ID
	const getCurrentUserId = () => {
		const userInfo = uni.getStorageSync('userInfo')
		return userInfo ? userInfo.id : null
	}

	// 处理同意报名
	const handleAgree = (participant) => {
		uni.showModal({
			title: '确认同意',
			content: `确定同意 ${participant.nickname} 的报名请求吗？`,
			success: async (res) => {
				if (res.confirm) {
					try {
						await agreeOrRefuse({
							id: participant.id,
							status: 2 // 2表示已确认
						})
						uni.showToast({
							title: '已同意',
							icon: 'success'
						})
						// 刷新活动详情
						getActivityDetail(activityInfo.value.id)
					} catch (err) {
						uni.showToast({
							title: err.message || '操作失败',
							icon: 'none'
						})
					}
				}
			}
		})
	}

	// 处理拒绝报名
	const handleRefuse = (participant) => {
		uni.showModal({
			title: '确认拒绝',
			content: `确定拒绝 ${participant.nickname} 的报名请求吗？`,
			success: async (res) => {
				if (res.confirm) {
					try {
						await agreeOrRefuse({
							id: participant.id,
							status: 3 // 3表示已拒绝
						})
						uni.showToast({
							title: '已拒绝',
							icon: 'success'
						})
						// 刷新活动详情
						getActivityDetail(activityInfo.value.id)
					} catch (err) {
						uni.showToast({
							title: err.message || '操作失败',
							icon: 'none'
						})
					}
				}
			}
		})
	}
</script>

<style lang="less" scoped>
	.activity-detail {
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
			height: calc(100vh - 88rpx - 120rpx);

			.activity-image {
				width: 100%;
				height: 400rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.detail-section {
				background: #fff;
				padding: 30rpx 20rpx;
				margin-bottom: 20rpx;

				.title-row {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 20rpx;

					.title {
						font-size: 32rpx;
						font-weight: 500;
						color: #333;
						flex: 1;
						margin-right: 20rpx;
					}

					.type-tag {
						padding: 4rpx 16rpx;
						font-size: 24rpx;
						color: #007AFF;
						background: rgba(0, 122, 255, 0.1);
						border-radius: 20rpx;
					}
				}

				.organizer-info {
					display: flex;
					align-items: center;
					gap: 12rpx;
					margin-bottom: 30rpx;

					.avatar {
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
					}

					.nickname {
						font-size: 28rpx;
						color: #333;
					}
				}

				.status-info {
					margin-bottom: 30rpx;

					.status-item {
						display: flex;
						align-items: flex-start;
						margin-bottom: 20rpx;

						.label {
							width: 140rpx;
							font-size: 28rpx;
							color: #666;
						}

						.value {
							flex: 1;
							font-size: 28rpx;
							color: #333;

							&.location {
								color: #007AFF;
								text-decoration: underline;
							}
						}

						.time-range {
							flex: 1;
							display: flex;
							gap: 12rpx;
							font-size: 28rpx;
							color: #333;
						}
					}
				}

				.cost-info {
					margin-bottom: 30rpx;
					padding: 20rpx;
					background: #f8f8f8;
					border-radius: 12rpx;

					.cost-item {
						display: flex;
						align-items: center;
						margin-bottom: 16rpx;

						&:last-child {
							margin-bottom: 0;
						}

						.label {
							width: 140rpx;
							font-size: 28rpx;
							color: #666;
						}

						.value {
							font-size: 28rpx;
							color: #333;
							margin-right: 12rpx;
						}

						.tip {
							font-size: 24rpx;
							color: #999;
						}
					}
				}

				.description {
					margin-bottom: 30rpx;

					.section-title {
						font-size: 30rpx;
						font-weight: 500;
						color: #333;
						margin-bottom: 20rpx;
					}

					.desc-content {
						font-size: 28rpx;
						color: #666;
						line-height: 1.6;
					}
				}

				.participants {
					.section-title {
						display: flex;
						align-items: center;
						margin-bottom: 20rpx;
						font-size: 32rpx;
						font-weight: 500;
						color: #333;

						.count {
							margin-left: 12rpx;
							font-size: 28rpx;
							color: #666;
							font-weight: normal;
						}
					}

					.participant-list {
						.participant-item {
							display: flex;
							align-items: center;
							padding: 20rpx 0;
							border-bottom: 1px solid #f0f0f0;

							&:last-child {
								border-bottom: none;
							}

							.avatar {
								width: 80rpx;
								height: 80rpx;
								border-radius: 50%;
								margin-right: 20rpx;
							}

							.nickname {
								flex: 1;
								font-size: 28rpx;
								color: #333;
							}

							.join-time {
								font-size: 24rpx;
								color: #999;
								margin-right: 20rpx;
							}

							.action-btns {
								display: flex;
								gap: 10rpx;

								.action-btn {
									margin: 0;
									padding: 0 20rpx;
									height: 48rpx;
									line-height: 48rpx;
									font-size: 24rpx;
									border-radius: 24rpx;

									&.agree {
										background: #67C23A;
										color: #fff;
									}

									&.refuse {
										background: #F56C6C;
										color: #fff;
									}
								}
							}

							.status-text {
								font-size: 24rpx;
								padding: 4rpx 12rpx;
								border-radius: 20rpx;

								&.pending {
									background: #E6A23C;
									color: #fff;
								}

								&.agreed {
									background: #67C23A;
									color: #fff;
								}

								&.refused {
									background: #F56C6C;
									color: #fff;
								}
							}
						}
					}
				}
			}
		}

		.bottom-btn {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			padding: 20rpx;
			background: #fff;

			.join-btn {
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				font-size: 30rpx;
				color: #fff;
				background: #007AFF;
				border-radius: 40rpx;

				&.disabled {
					background: #ccc;

					&.organizer {
						background: #FF9500;
					}
				}

				&.joined {
					background: #67C23A;
				}
			}
		}
	}
</style>