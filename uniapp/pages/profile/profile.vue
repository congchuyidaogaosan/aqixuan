<template>
	<view class="profile-container">
		<!-- 顶部渐变遮罩 -->
		<view class="top-gradient">
			<!-- 返回按钮 -->
			<view class="back-btn" @click="goBack">
				<image src="/static/images/fanhui.png" mode="aspectFit" class="icon"></image>
			</view>
			
			<!-- 右上角菜单按钮 - 仅在查看他人主页时显示 -->
			<view class="menu-btn" @click="showPopup" v-if="!currentIsMyProfile">
				<image src="/static/images/more.png" mode="aspectFit" class="icon"></image>
			</view>
		</view>

		<!-- 头像轮播和基本信息区域 -->
		<view class="header">
			<!-- 添加数据检查，确保avatars存在且长度大于0 -->
			<template v-if="userData && userData.avatars && userData.avatars.length > 0">
				<swiper class="avatar-swiper" 
					circular 
					:indicator-dots="true" 
					:indicator-color="'rgba(255, 255, 255, 0.4)'"
					:indicator-active-color="'#ffffff'" 
					:style="{ height: swiperHeight + 'px' }" 
					@change="handleChange">
					<swiper-item v-for="(item, index) in userData.avatars" :key="item.id || index">
						<image :src="item.avatarUrl" mode="aspectFill" class="swiper-image"></image>
					</swiper-item>
				</swiper>

				<!-- 自定义指示器 -->
				<view class="custom-indicators">
					<view v-for="(item, index) in userData.avatars" :key="item.id || index" class="indicator-line"
						:class="{active: currentIndex === index }"></view>
				</view>
			</template>
			
			<!-- 当没有头像时显示默认头像 -->
			<template v-else>
				<view class="default-avatar" :style="{ height: swiperHeight + 'px' }">
					<image src="/static/images/default-avatar.png" mode="aspectFill" class="swiper-image"></image>
				</view>
			</template>

			<!-- 基本信息覆盖层 -->
			<view class="info-overlay">
				<view class="basic-info">
					<view class="left">
						<text class="nickname">{{userData.nickname || '未设置昵称'}}</text>
						<view class="stats">
							<text class="stat">{{calculateAge(userData.birthday) || '--'}}岁</text>
							<text class="dot">·</text>
							<text class="stat">{{userData.height || '--'}}cm</text>
							<text class="dot">/</text>
							<text class="stat">{{userData.weight || '--'}}kg</text>
							<text class="dot">·</text>
							<text class="stat">{{distance || '--'}}米</text>
						</view>
						<view class="popularity">
							{{fansCount || 0}}人气
						</view>
					</view>
					<view class="right">
						<view class="ip">IP属地：{{ipLocation || '未知'}}</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 用户基本信息 -->
		<view class="user-info">
			<view class="introduction">
				<text>{{userData.introduction || '这个人很懒，什么都没写~'}}</text>
			</view>

			<!-- 标签信息 -->
			<view class="tags">
				<view class="tag-item" v-if="userData.interests?.length">
					<image src="/static/images/xingqu.png" mode="aspectFill" class="icon"></image>
					<text class="label">兴趣是</text>
					<text class="value">{{userData.interests.join('、')}}</text>
				</view>
				<view class="tag-item" v-if="userData.industry">
					<image src="/static/images/hangye.png" mode="aspectFill" class="icon"></image>
					<text class="label">从事的行业是</text>
					<text class="value">{{userData.industry}}</text>
				</view>
				<view class="tag-item" v-if="userData.location">
					<image src="/static/images/juzhudi.png" mode="aspectFill" class="icon"></image>
					<text class="label">居住地址</text>
					<text class="value">{{userData.location}}</text>
				</view>
				<view class="tag-item" v-if="userData.emotionStatus">
					<image src="/static/images/ganqing.png" mode="aspectFill" class="icon"></image>
					<!-- <text class="label">感情状况</text> -->
					<text class="value">{{userData.emotionStatus}}</text>
				</view>
				<view class="tag-item" v-if="userData.datingPurpose">
					<image src="/static/images/mudi.png" mode="aspectFill" class="icon"></image>
					<text class="label"></text>
					<text class="value">{{userData.datingPurpose}}</text>
				</view>
			</view>
		</view>

		<!-- 星座和MBTI -->
		<view class="constellation-mbti">
			<view class="constellation" v-if="userData.constellation">
				<image :src="`/static/images/${constellations[userData.constellation]}.png`" mode="aspectFill"
					class="icon"></image>
				<text class="value">{{userData.constellation}}</text>
			</view>

			<view class="mbti">
				<image src="/static/images/mbti.png" mode="aspectFill" class="icon"></image>
				<text class="value">{{userData.mbti}}</text>
			</view>
		</view>

		<!-- 动态列表 -->
		<scroll-view class="moment-list" scroll-y @scrolltolower="loadMore" :refresher-enabled="true"
			:refresher-triggered="refreshing" @refresherrefresh="refresh">
			<!-- 空状态 -->
			<view class="empty-state" v-if="!loading && momentList.length === 0">
				<image src="/static/images/empty-moment.png" mode="aspectFit" class="empty-image"></image>
				<text class="empty-text">还没有发布任何动态哦~</text>
			</view>

			<!-- 动态列表 -->
			<template v-else>
				<!-- 媒体网格 -->
				<view class="media-grid">
					<template v-for="moment in momentList" :key="moment.id">
						<template v-if="moment.list && moment.list.length">
							<template v-for="(media, index) in moment.list" :key="media.id">
								<video v-if="media.mediaType === '2'" :src="media.mediaUrl" class="media-item"
									:controls="true" :show-center-play-btn="true" object-fit="cover"
									@click="goToMomentList(moment.id)"></video>
								<image v-else :src="media.mediaUrl" mode="aspectFill" class="media-item"
									@click="goToMomentList(moment.id)"></image>
							</template>
						</template>
					</template>
				</view>

				<!-- 加载更多 -->
				<uni-load-more :status="loadingStatus" :content-text="loadMoreText"></uni-load-more>
			</template>
		</scroll-view>

		<!-- 底部按钮 -->
		<view class="bottom-btns">
			<view v-show="currentIsMyProfile">
				<button class="action-btn" @click="publishMoment">
					<image src="/static/images/xiangji.png" mode="aspectFill" class="icon"></image>
				</button>
			</view>
			<view v-show="!currentIsMyProfile && !isInBlacklist && !isInTargetBlacklist" class="other-profile-btns">
				<!-- 关注 -->
				<button class="action-btn" :class="{ followed: isFollowed }" @click="handleFollow">
					<image :src="isFollowed ? '/static/images/yiguanzhu.png' : '/static/images/weiguanzhu.png'"
						mode="aspectFill" class="icon"></image>
				</button>
				<!-- 私信 -->
				<button class="action-btn" @click="sendMessage">
					<image src="/static/images/dazhaohu.png" mode="aspectFill" class="icon"></image>
				</button>
			</view>
			
			<!-- 黑名单状态提示 -->
			<view v-if="!currentIsMyProfile && (isInBlacklist || isInTargetBlacklist)" class="blacklist-status">
				<text v-if="isInBlacklist" class="blacklist-text">已将该用户拉黑</text>
				<text v-else-if="isInTargetBlacklist" class="blacklist-text">您已被该用户拉黑</text>
			</view>
			
			<!-- 调试信息 -->
			<!-- <view class="debug-info" @click="forceUpdate">
				<text>当前状态: {{currentIsMyProfile ? '我的资料' : '他人资料'}}</text>
			</view> -->
		</view>
		
		<!-- 操作弹窗 -->
		<uni-popup ref="popup" type="bottom" background-color="#f5f5f5">
			<view class="popup-content">
				<view class="popup-title">选择操作</view>
				
				<view class="popup-options">
					<view class="option-item" @click="addUserToBlacklist">
						<view class="option-btn blacklist-btn">
							<image :src="isInBlacklist ? '/static/images/unblacklist.png' : '/static/images/blacklist.png'" mode="aspectFill" class="option-icon"></image>
						</view>
						<text class="option-text">{{isInBlacklist ? '移出黑名单' : '拉黑用户'}}</text>
					</view>
					
					<!-- 
					<view class="option-item" @click="reportUser">
						<view class="option-btn report-btn">
							<image src="/static/images/report.png" mode="aspectFill" class="option-icon"></image>
						</view>
						<text class="option-text">举报</text>
					</view>
					
					<view class="option-item" @click="shareUser">
						<view class="option-btn share-btn">
							<image src="/static/images/share.png" mode="aspectFill" class="option-icon"></image>
						</view>
						<text class="option-text">分享</text>
					</view>
					-->
				</view>
        <!-- 取消按钮 -->
					<view class="cancel-btn" @click="closePopup">取消</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		watch,
		nextTick
	} from 'vue'
	import {
		onShow,
		onLoad,
		onUnload
	} from '@dcloudio/uni-app'

	import {
		getUserInfo as fetchUserInfo,
		getUserAvatars,
		getMyAvatarList,
		getIpLocation,
		followUser,
		unfollowUser,
		checkFollow,
		getMomentList,
		getMomentListByUserId,
		addToBlacklist,
		checkInBlacklist,
		removeFromBlacklist
	} from '@/api/user.js'
	import {
		calculateDistance,
		formatDistance,
		parseLocation
	} from '@/utils/distance.js'
	// import { formatTime } from '@/utils/date.js'

	// 初始化系统宽度，避免getBoundingClientRect错误
	const initSystemWidth = () => {
		try {
			const systemInfo = uni.getSystemInfoSync()
			return systemInfo?.windowWidth || 375
		} catch (error) {
			console.error('获取系统信息失败，使用默认值：', error)
			return 375
		}
	}

	// 页面参数，使用ref以便在响应式系统中跟踪变化
	const paramsUserId = ref(null)
	const storageUserInfoId = uni.getStorageSync('userInfo')?.id

	// 用户原始数据 - 使用ref直接保存整个对象，而不是使用computed，确保直接赋值能触发响应式更新
	const userData = ref({
		avatars: [],
		nickname: '',
		introduction: '',
		age: '',
		height: '',
		weight: '',
		interests: [],
		industry: '',
		datingPurpose: '',
		constellation: '',
		mbti: '',
		id: '',
		birthday: '',
		ipAddress: '',
		ip: ''
	})

	// 统计数据
	const fansCount = ref(0)
	const distance = ref('') // 距离
	const ipLocation = ref('') // IP地址
	const momentList = ref([])
	
	// 使用简单ref变量并设置watch来触发视图更新
	const currentIsMyProfile = ref(false)
	
	// 设置watch监听paramsUserId变化，更新currentIsMyProfile
	watch(paramsUserId, (newValue) => {
		console.log("paramsUserId changed:", newValue)
		updateIsMyProfile()
	}, { immediate: true })
	
	// 更新isMyProfile的函数
	const updateIsMyProfile = () => {
		// 获取最新的存储用户ID，避免使用过时的闭包值
		const currentUser = uni.getStorageSync('userInfo')
		const currentUserId = currentUser?.id
		
		// 确保转换为字符串进行比较
		const currentUserIdStr = String(currentUserId || '')
		const paramsUserIdStr = String(paramsUserId.value || '')
		
		// 判断逻辑：空参数或参数等于当前用户ID
		const result = !paramsUserId.value || paramsUserIdStr === currentUserIdStr
		
		console.log('计算isMyProfile:', {
			pageUserId: paramsUserIdStr,
			currentUserId: currentUserIdStr,
			result,
			oldValue: currentIsMyProfile.value
		})
		
		// 只有当值真正变化时才更新
		if (result !== currentIsMyProfile.value) {
			currentIsMyProfile.value = result
			console.log('currentIsMyProfile已更新为:', result)
		}
		
		// 使用nextTick确保DOM更新
		nextTick(() => {
			console.log('DOM已更新，currentIsMyProfile:', currentIsMyProfile.value)
		})
	}

	// 设备宽度 - 初始化为固定值，避免getBoundingClientRect错误
	const swiperHeight = ref(initSystemWidth())

	// 当前轮播图索引
	const currentIndex = ref(0)

	// 星座映射表（使用拼音作为图片名称）
	const constellations = {
		'白羊座': 'muyangzuo',
		'金牛座': 'jinniuzuo',
		'双子座': 'shuangzizuo',
		'巨蟹座': 'juxiezuo',
		'狮子座': 'shizi',
		'处女座': 'chunvzuo',
		'天秤座': 'tianpingzuo',
		'天蝎座': 'tianxiezuo',
		'射手座': 'sheshouzuo',
		'摩羯座': 'mojiezuo',
		'水瓶座': 'shuipingzuo',
		'双鱼座': 'shuangyuzuo'
	}

	// 关注状态
	const isFollowed = ref(false)
	const followed = ref({})

	// 黑名单状态
	const isInBlacklist = ref(false)
	const isInTargetBlacklist = ref(false)

	// 动态列表数据
	const loadingStatus = ref('more')
	const refreshing = ref(false)
	const loading = ref(false)

	const loadMoreText = {
		contentdown: '上拉加载更多',
		contentrefresh: '加载中...',
		contentnomore: '没有更多了'
	}

	// 监听轮播图变化，添加空值检查
	const handleChange = (e) => {
		if (e && e.detail && typeof e.detail.current === 'number') {
			currentIndex.value = e.detail.current
		}
	}

	// 计算年龄
	const calculateAge = (birthday) => {
		if (!birthday) return null

		const birthDate = new Date(birthday)
		const today = new Date()

		let age = today.getFullYear() - birthDate.getFullYear()
		const monthDiff = today.getMonth() - birthDate.getMonth()

		// 如果还没到生日月份，或者到了生日月份但还没到具体日期，年龄减1
		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
			age--
		}

		return age
	}

	// 计算星座
	const calculateConstellation = (birthday) => {
		if (!birthday) return null

		const date = new Date(birthday)
		const month = date.getMonth() + 1
		const day = date.getDate()

		const constellationDates = {
			'白羊座': [3, 21, 4, 19],
			'金牛座': [4, 20, 5, 20],
			'双子座': [5, 21, 6, 21],
			'巨蟹座': [6, 22, 7, 22],
			'狮子座': [7, 23, 8, 22],
			'处女座': [8, 23, 9, 22],
			'天秤座': [9, 23, 10, 23],
			'天蝎座': [10, 24, 11, 22],
			'射手座': [11, 23, 12, 21],
			'摩羯座': [12, 22, 1, 19],
			'水瓶座': [1, 20, 2, 18],
			'双鱼座': [2, 19, 3, 20]
		}

		for (const [constellation, [startMonth, startDay, endMonth, endDay]] of Object.entries(constellationDates)) {
			if (
				(month === startMonth && day >= startDay) ||
				(month === endMonth && day <= endDay) ||
				// 特殊处理摩羯座跨年的情况
				(constellation === '摩羯座' && ((month === 12 && day >= 22) || (month === 1 && day <= 19)))
			) {
				return constellation
			}
		}

		return null
	}

	// 获取IP地址信息
	const getLocationByIp = async (ip) => {
		try {
			const res = await getIpLocation(ip)
			if (res) {
				ipLocation.value = res.location || '未知'
			}
		} catch (error) {
			console.log('获取IP地址信息失败：', error)
			ipLocation.value = '未知'
		}
	}

	// 获取用户信息
	const loadUserInfo = async (userId) => {
		try {
			if (userId) {
				console.log(userId);
				const [userRes] = await Promise.all([
					fetchUserInfo(userId),
				])
				console.log(userRes);
				
					const info = userRes.data
					// 创建新对象然后整体替换
					const newUserData = {
						...info,
						avatars: userRes.data.avatars || [],
						interests: typeof info.interests === 'string' ? info.interests.split('、') : info.interests || [],
						constellation: calculateConstellation(info.birthday) || '',
						nickname: info.nickname || '',
						introduction: info.introduction || '',
						age: info.age || '',
						height: info.height || '',
						weight: info.weight || '',
						industry: info.industry || '',
						datingPurpose: info.datingPurpose || '',
						mbti: info.mbti || ''
					}
					
					// 整体替换对象以触发响应式更新
					userData.value = newUserData
					console.log("用户信息更新完");
					
					// 在数据更新后再次检查状态
					updateIsMyProfile()
					
					// 计算距离
					const myInfo = uni.getStorageSync('userInfo')
					if (myInfo?.ipAddress && info.ipAddress) {
						const myLocation = parseLocation(myInfo.ipAddress)
						const targetLocation = parseLocation(info.ipAddress)
						if (myLocation && targetLocation) {
							const dist = calculateDistance(myLocation, targetLocation)
							distance.value = formatDistance(dist)
						}
					}

					// 获取IP地址信息
					if (info.ip) {
						await getLocationByIp(info.ip)
					}
					
					// 数据加载完成后再次确认状态
					await nextTick()
					updateIsMyProfile()
				
			} else {
				// 获取当前登录用户信息
				const info = uni.getStorageSync('userInfo')
				if (info) {
					try {
						const avatarRes = await getMyAvatarList()
						// 创建新对象然后整体替换
						const newUserData = {
							...info,
							avatars: avatarRes.data || [],
							interests: typeof info.interests === 'string' ? info.interests.split('、') : info.interests || [],
							constellation: calculateConstellation(info.birthday) || '',
							nickname: info.nickname || '',
							introduction: info.introduction || '',
							age: info.age || '',
							height: info.height || '',
							weight: info.weight || '',
							industry: info.industry || '',
							datingPurpose: info.datingPurpose || '',
							mbti: info.mbti || ''
						}
						
						// 整体替换对象以触发响应式更新
						userData.value = newUserData
						
						// 在数据更新后再次检查状态
						updateIsMyProfile()
						await nextTick()
					} catch (error) {
						// 创建新对象然后整体替换
						const newUserData = {
							...info,
							avatars: [],
							interests: typeof info.interests === 'string' ? info.interests.split('、') : info.interests || [],
							constellation: calculateConstellation(info.birthday) || '',
							nickname: info.nickname || '',
							introduction: info.introduction || '',
							age: info.age || '',
							height: info.height || '',
							weight: info.weight || '',
							industry: info.industry || '',
							datingPurpose: info.datingPurpose || '',
							mbti: info.mbti || ''
						}
						
						// 整体替换对象以触发响应式更新
						userData.value = newUserData
						
						// 在数据更新后再次检查状态
						updateIsMyProfile()
						await nextTick()
					}
				}
				// 获取IP地址信息
				if (info?.ip) {
					await getLocationByIp(info.ip)
				}
				
				// 数据加载完成后再次确认状态
				await nextTick()
				updateIsMyProfile()
			}
		} catch (error) {
			console.error('获取用户信息失败：', error)
			uni.showToast({
				title: '获取用户信息失败',
				icon: 'none'
			})
		}
	}

	// 获取动态列表
	const loadMoments = async (userId, isRefresh = false) => {
		if (loadingStatus.value === 'loading') return

		if (isRefresh) {
			loading.value = true
		} else {
			loadingStatus.value = 'loading'
		}

		try {
			let res = []
			if (userId) {
				res = await getMomentListByUserId(userId)
			} else {
				res = await getMomentList()
			}
			const list = res || []
			if (isRefresh) {
				momentList.value = list
			} else {
				momentList.value.push(...list)
			}

			// 由于返回的是完整列表，所以加载完就没有更多了
			loadingStatus.value = 'noMore'
		} catch (error) {
			console.log('获取动态列表失败：', error)
			uni.showToast({
				title: '加载失败',
				icon: 'none'
			})
			loadingStatus.value = 'more'
		} finally {
			loading.value = false
			if (isRefresh) {
				refreshing.value = false
				uni.stopPullDownRefresh()
			}
		}
	}

	// 跳转到动态列表
	const goToMomentList = (momentId) => {
		// 获取当前用户ID
		const pages = getCurrentPages()
		const currentPage = pages[pages.length - 1]
		const currentUserId = currentPage.options?.userId || uni.getStorageSync('userInfo')?.id

		// 构建跳转参数
		const params = {
			userId: currentUserId,
			nickname: userData.value.nickname,
			avatarUrl: userData.value.avatars[0]?.avatarUrl,
			momentId: momentId // 添加momentId参数
		}

		console.log(userData.value)

		// 将参数转换为查询字符串
		const query = Object.entries(params)
			.filter(([_, value]) => value !== undefined)
			.map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
			.join('&')

		uni.navigateTo({
			url: `/pages/moment-list/moment-list?${query}`
		})
	}

	// 发布动态
	const publishMoment = () => {
		uni.navigateTo({
			url: '/pages/publish-moment/publish-moment'
		})
	}

	// 发送私信
	const sendMessage = () => {
		uni.navigateTo({
			url: `/pages/chat/chat?userId=${userData.value.id}&nickname=${encodeURIComponent(userData.value.nickname)}&avatar=${encodeURIComponent(userData.value.avatars[0]?.avatarUrl || '')}`
		})
	}

	// 返回上一页
	const goBack = () => {
		uni.navigateBack(1);
	}

	// 检查关注状态
	const checkFollowStatus = async (userId) => {
		if (!userId) return
		try {
			const res = await checkFollow(userId)
			if (res) {
				followed.value = res
				isFollowed.value = true
			} else {
				isFollowed.value = false
			}
		} catch (error) {
			console.error('检查关注状态失败：', error)
		}
	}

	// 检查黑名单状态
	const checkBlacklistStatus = async (targetUserId) => {
		if (!targetUserId) return
		
		try {
			const res = await checkInBlacklist(targetUserId)
			console.log('黑名单检查结果：', res)
			
			// 用户是否将对方拉黑
			isInBlacklist.value = res.isInUserBlacklist || false
			// 用户是否被对方拉黑
			isInTargetBlacklist.value = res.isInTargetBlacklist || false
			
			// 如果被对方拉黑，显示提示
			if (isInTargetBlacklist.value) {
				uni.showToast({
					title: '您已被该用户拉黑',
					icon: 'none',
					duration: 2000
				})
			}
			
			// 如果已拉黑对方，显示状态并禁用相关按钮
			if (isInBlacklist.value) {
				uni.showToast({
					title: '您已将该用户拉黑',
					icon: 'none',
					duration: 2000
				})
			}
		} catch (error) {
			console.error('检查黑名单状态失败：', error)
		}
	}

	// 处理关注/取消关注
	const handleFollow = async () => {
		if (!userData.value.id) return

		try {
			const success = isFollowed.value ?
				await unfollowUser(followed.value.id) :
				await followUser(userData.value.id)

			if (success) {
				isFollowed.value = !isFollowed.value
				followed.value = {}
				checkFollowStatus(userData.value.id)
				uni.showToast({
					title: isFollowed.value ? '关注成功' : '已取消关注',
					icon: 'none'
				})
			}
		} catch (error) {
			uni.showToast({
				title: '操作失败',
				icon: 'none'
			})
		}
	}

	// 加载更多
	const loadMore = () => {
		loadMoments()
	}

	// 刷新
	const refresh = async () => {
		refreshing.value = true
		await loadMoments(true)
	}

	// 清空所有数据的方法
	const clearAllData = () => {
		// 清空用户信息
		userData.value = {
			avatars: [],
			nickname: '',
			introduction: '',
			age: '',
			height: '',
			weight: '',
			interests: [],
			industry: '',
			datingPurpose: '',
			constellation: '',
			mbti: '',
			id: '',
			birthday: '',
			ipAddress: '',
			ip: ''
		}
		
		// 清空其他数据
		fansCount.value = 0
		distance.value = ''
		ipLocation.value = ''
		momentList.value = []
		isFollowed.value = false
		followed.value = {}
		currentIndex.value = 0
		loadingStatus.value = 'more'
		refreshing.value = false
		loading.value = false
		paramsUserId.value = null
		currentIsMyProfile.value = false
	}

	// 添加一个强制更新函数
	const forceUpdate = () => {
		updateIsMyProfile()
		uni.showToast({
			title: `当前状态: ${currentIsMyProfile.value ? '我的资料' : '他人资料'}`,
			icon: 'none'
		})
	}

	// 显示操作菜单
	const showPopup = () => {
		if (!userData.value || !userData.value.id) return;
		proxy.$refs.popup.open('bottom');
	}

	// 关闭弹窗
	const closePopup = () => {
		proxy.$refs.popup.close();
	}

	// 拉黑用户方法
	const addUserToBlacklist = async () => {
		if (!userData.value || !userData.value.id) return;
		closePopup(); // 先关闭弹窗
		
		// 根据当前黑名单状态决定执行添加还是移除操作
		if (isInBlacklist.value) {
			// 移除黑名单操作
			uni.showModal({
				title: '确认移除',
				content: `确定将"${userData.value.nickname || '该用户'}"从黑名单中移除吗？`,
				confirmText: '确定移除',
				confirmColor: '#007AFF',
				success: async function (res) {
					if (res.confirm) {
						try {
							// 获取当前登录用户信息
							const userInfo = uni.getStorageSync('userInfo');
							if (!userInfo || !userInfo.id) {
								uni.showToast({
									title: '请先登录',
									icon: 'none'
								});
								return;
							}
							
							// 调用API从黑名单中移除
							const result = await removeFromBlacklist(userData.value.id);
							
							if (result) {
								// 更新黑名单状态
								isInBlacklist.value = false;
								
								uni.showToast({
									title: '已从黑名单中移除',
									icon: 'success'
								});
							} else {
								throw new Error('从黑名单中移除失败');
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
		} else {
			// 添加黑名单操作
			uni.showModal({
				title: '确认拉黑',
				content: `确定将"${userData.value.nickname || '该用户'}"加入黑名单吗？加入黑名单后，TA将无法查看您的资料，也无法向您发送消息。`,
				confirmText: '确定拉黑',
				confirmColor: '#FF3B30',
				success: async function (res) {
					if (res.confirm) {
						try {
							// 获取当前登录用户信息
							const userInfo = uni.getStorageSync('userInfo');
							if (!userInfo || !userInfo.id) {
								uni.showToast({
									title: '请先登录',
									icon: 'none'
								});
								return;
							}
							
							// 创建黑名单对象
							const blacklistData = {
								blockedUserId: userData.value.id
							};
							
							// 调用API添加黑名单
							const result = await addToBlacklist(blacklistData);
							
							if (result) {
								// 更新黑名单状态
								isInBlacklist.value = true;
								
								uni.showToast({
									title: '已加入黑名单',
									icon: 'success'
								});
								// 返回上一页
								setTimeout(() => {
									uni.navigateBack();
								}, 1500);
							} else {
								throw new Error('添加黑名单失败');
							}
						} catch (error) {
							console.error('拉黑用户失败:', error);
							uni.showToast({
								title: '操作失败，请稍后重试',
								icon: 'none'
							});
						}
					}
				}
			});
		}
	}

	// 获取Vue实例的代理对象，用于访问ref
	import { getCurrentInstance } from 'vue';
	const { proxy } = getCurrentInstance();

	onLoad(async (options) => {
		// 获取页面参数
		const optionsUserId = options?.userId
		
		// 设置用户ID参数
		paramsUserId.value = optionsUserId
		
		// 更新isMyProfile状态
		updateIsMyProfile()
		
		// 强制刷新状态
		await nextTick()

		const userId = paramsUserId.value ? paramsUserId.value : uni.getStorageSync('userInfo')?.id

		console.log('onLoad userId:', userId)
		// 获取用户信息
		await loadUserInfo(userId)
		
		// 获取动态列表
		await loadMoments(userId)

		// 如果不是自己的主页，检查关注状态和黑名单状态
		if (!currentIsMyProfile.value && userId) {
			await checkFollowStatus(userId)
			await checkBlacklistStatus(userId)
		}
		
		// 再次确保状态更新
		updateIsMyProfile()
		await nextTick()
	})
	
	// 页面每次显示时更新黑名单状态
	onShow(async () => {
		// 如果是查看他人的资料页，则重新检查黑名单状态
		if (!currentIsMyProfile.value && paramsUserId.value) {
			await checkBlacklistStatus(paramsUserId.value)
		}
	})

	// 当页面卸载时清空所有数据
	onUnload(() => {
		console.log('页面卸载，清空所有数据')
		clearAllData()
	})
</script>

<style lang="less" scoped>
	.profile-container {
		position: relative; // 添加相对定位

		// 顶部渐变遮罩
		.top-gradient {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			height: 200rpx;
			z-index: 10;
			pointer-events: none; // 允许点击穿透
			background: linear-gradient(to bottom,
					rgba(0, 0, 0, 0.1) 20%,
					rgba(0, 0, 0, 0) 100%);

			// 返回按钮
			.back-btn {
				position: absolute;
				left: 20rpx; // 改为20rpx以与其他元素对齐
				top: calc(var(--status-bar-height) + 30rpx); // 状态栏高度 + 20rpx的间距
				width: 37rpx; // 改为27rpx以与其他图标一致
				height: 37rpx; // 改为27rpx以与其他图标一致
				display: flex;
				align-items: center;
				justify-content: center;
				pointer-events: auto;

				.icon {
					width: 100%; // 使用100%以填充容器
					height: 100%;
				}
			}

			// 右上角菜单按钮 - 仅在查看他人主页时显示
			.menu-btn {
				position: absolute;
				top: calc(var(--status-bar-height) + 30rpx);
				right: 20rpx;
				width: 37rpx;
				height: 37rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				pointer-events: auto;

				.icon {
					width: 100%;
					height: 100%;
				}
			}
		}

		.header {
			position: relative;

			.avatar-swiper {
				width: 100%;

				.swiper-image {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}

				// 隐藏原有指示点
				:deep(.uni-swiper-dots) {
					display: none;
				}
			}

			// 自定义指示器样式
			.custom-indicators {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				z-index: 10;
				display: flex;
				padding: 12rpx;
				gap: 8rpx;

				.indicator-line {
					flex: 1;
					height: 4rpx;
					background: rgba(255, 255, 255, 0.4);
					transition: all 0.3s;

					&.active {
						background: #ffffff;
					}
				}
			}

			.info-overlay {
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				padding: 40rpx 30rpx 30rpx;
				background: linear-gradient(to top,
						rgba(0, 0, 0, 0.2) 30%,
						rgba(0, 0, 0, 0) 100%);
				height: 240rpx;
				display: flex;
				align-items: flex-end;
				z-index: 9;

				.basic-info {
					width: 100%;
					display: flex;
					justify-content: space-between;

					.left {
						.nickname {
							font-size: 36rpx;
							font-weight: bold;
							color: #fff;
							margin-bottom: 10rpx;
							display: block;
						}

						.stats {
							display: flex;
							align-items: center;
							color: rgba(255, 255, 255, 0.9);
							font-size: 26rpx;

							.dot {
								margin: 0 10rpx;
							}
						}

						.follow-stats {
							display: flex;
							align-items: center;
							color: rgba(255, 255, 255, 0.9);
							font-size: 24rpx;
							margin-top: 8rpx;

							.dot {
								margin: 0 10rpx;
							}

							.stat {
								color: rgba(255, 255, 255, 0.9);
							}
						}

						.popularity {
							display: inline-flex;
							align-items: center;
							background: rgba(255, 255, 255, 0.3);
							padding: 4rpx 12rpx;
							border-radius: 24rpx;
							font-size: 24rpx;
							color: rgba(255, 255, 255, 0.9);
						}
					}

					.right {
						text-align: right;
						display: flex;
						flex-direction: column-reverse;

						.ip {
							font-size: 24rpx;
							color: rgba(255, 255, 255, 0.9);
						}
					}
				}
			}
		}

		.user-info {
			padding: 20rpx;
			background: #fff;
			// margin-bottom: 20rpx;

			.introduction {
				font-size: 28rpx;
				color: #333;
				line-height: 1.5;
				margin-bottom: 20rpx;
			}

			.tags {
				.tag-item {
					display: flex;
					align-items: center;
					margin-bottom: 10rpx;
					font-size: 22rpx;
					color: #999;

					.icon {
						width: 27rpx;
						height: 27rpx;
						margin-right: 10rpx;
					}
				}
			}
		}

		// 将constellation-mbti移到这里，作为独立区域
		.constellation-mbti {
			padding: 20rpx;
			background: #fff;
			margin-bottom: 20rpx;
			display: flex;
			gap: 20rpx;

			.constellation,
			.mbti {
				display: flex;
				align-items: center;

				.icon {
					width: 70rpx;
					height: 70rpx;
					margin-right: 8rpx;
					background: #8F8BFA; // 添加背景色
					border-radius: 50%; // 圆形
					padding: 16rpx; // 添加内边距使图标居中
					box-sizing: border-box; // 确保padding不会增加总宽高
				}

				.value {
					font-size: 24rpx;
					color: #333;
				}
			}

			// MBTI图标不需要背景色和圆形
			.mbti .icon {
				background: transparent;
				border-radius: 0;
				padding: 0;
			}
		}

		.moment-list {

			.empty-state {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding-top: 200rpx;

				.empty-image {
					width: 240rpx;
					height: 240rpx;
					margin-bottom: 20rpx;
				}

				.empty-text {
					font-size: 28rpx;
					color: #999;
				}
			}

			.media-grid {
				display: flex;
				flex-wrap: wrap;
				gap: 10rpx;

				.media-item {
					width: calc((100% - 20rpx) / 3); // 三列布局，减去间距
					height: 220rpx;
					border-radius: 8rpx;

					// 添加点击效果
					&:active {
						opacity: 0.8;
					}
				}
			}
		}

		.bottom-btns {
			position: fixed;
			bottom: 40rpx;
			left: 50%;
			transform: translateX(-50%);
			display: flex; // 添加flex布局
			gap: 20rpx; // 按钮之间的间距

			.action-btn {
				width: 100rpx;
				height: 100rpx;
				padding: 0;
				margin: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 50%;
				background: linear-gradient(135deg, #8F8BFA, #7B78F9); // 修改为紫色渐变
				box-shadow: 0 4rpx 16rpx rgba(143, 139, 250, 0.3); // 添加带颜色的阴影
				transition: all 0.3s ease; // 添加过渡效果


  				&:active {
					transform: scale(0.95); // 点击时缩小效果
				}

				&::after {
					border: none;
				}

				.icon {
					width: 48rpx;
					height: 48rpx;
				}

				// 已关注状态的样式
				&.followed {
					background: linear-gradient(135deg, #F0F0F0, #E0E0E0); // 灰色渐变
					box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
				}
			}

      .other-profile-btns{
        display: flex;
        gap: 20rpx;


  				&:active {
					transform: scale(0.95); // 点击时缩小效果
				}

				&::after {
					border: none;
				}

				.icon {
					width: 48rpx;
					height: 48rpx;
				}

				// 已关注状态的样式
				&.followed {
					background: linear-gradient(135deg, #F0F0F0, #E0E0E0); // 灰色渐变
					box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
				}
      }
		}

		// 弹窗样式
		:deep(.uni-popup) {
			z-index: 999;
			
			.popup-content {
				padding: 30rpx;
				
				.popup-title {
					font-size: 28rpx;
					color: #999;
					text-align: center;
					margin-bottom: 30rpx;
				}
				
				.popup-options {
					display: flex;
					justify-content: flex-start;
					margin-bottom: 40rpx;
					padding: 0 30rpx;
					
					.option-item {
						display: flex;
						flex-direction: column;
						align-items: center;
						margin-right: 60rpx;
						
						.option-btn {
							width: 100rpx;
							height: 100rpx;
							border-radius: 50%;
							background-color: #f5f5f5;
							display: flex;
							align-items: center;
							justify-content: center;
							margin-bottom: 20rpx;
							
							&.blacklist-btn {
								background-color: #ffffff;
							}
							
							&.report-btn {
								// background-color: #FF9500;
							}
							
							&.share-btn {
								// background-color: #34C759;
							}
							
							.option-icon {
								width: 48rpx;
								height: 48rpx;
							}
						}
						
						.option-text {
							font-size: 26rpx;
							color: #333;
						}
					}
				}
				
				.cancel-btn {
					height: 90rpx;
					line-height: 90rpx;
					text-align: center;
					font-size: 32rpx;
					color: #333;
					background-color: #ffffff;
					border-radius: 45rpx;
					box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
					
					&:active {
						opacity: 0.8;
					}
				}
			}
		}
	}
</style>