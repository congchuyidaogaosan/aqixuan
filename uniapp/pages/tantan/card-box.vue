<template>
	<view class="cardBox">
		<view class="top">
			<swiper 
				class="avatar-swiper" 
				circular 
				:current="current"
				:indicator-dots="false"
				:autoplay="false"
				:duration="300"
			>
				<swiper-item v-for="(url, index) in item.img" :key="index">
					<image :src="url" mode="aspectFill" class="swiper-image"></image>
				</swiper-item>
			</swiper>
			
			<!-- 自定义指示器 -->
			<view class="custom-indicators">
				<view 
					v-for="(url, index) in item.img" 
					:key="index"
					class="indicator-line"
					:class="{active: current === index }"
				></view>
			</view>

			<!-- 左右切换按钮区域 -->
			<view class="image-nav">
				<view class="nav-area left" @click.stop="previous"></view>
				<view class="nav-area right" @click.stop="next"></view>
			</view>

			<view class="love" :animation="loveAnimation[0]">
				<view class="iconfont icon-xinaixin" :style="{ fontSize: '60rpx' }"></view>
			</view>
			<view class="loathe" :animation="loatheAnimation[0]">
				<view class="iconfont icon-chacha1" :style="{ fontSize: '60rpx' }"></view>
			</view>
		</view>

		<view class="bottom"
			style="position: absolute;bottom: 10%;left: 0;width: 94%;"
			@click="goToUserProfile">
			<view class="username">
				<view class="">{{ item.name }}</view>
				<!-- <view class="img-right">
					<view class="iconfont icon-v"></view>
				</view> -->
			</view>
			<view class="labelBox">
					{{ item.old }}岁 · {{ item.height }}cm/{{ item.weight }}kg · {{ item.constellation }}
				
			</view>
			<view class="address">{{ item.introduction }}</view>
		</view>
		<view class="bottom-shadow"></view>
	</view>
</template>

<script>
import { getRecommendUserList, followUser } from '@/api/user'
export default {
	props: {
		item: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			loveAnimation: { 0: {} },
			loatheAnimation: { 0: {} },
			loveAni: null,
			loatheAni: null,
			current: 0
		}
	},
	mounted() {
		//touch移动喜欢动画
		this.loveAni = uni.createAnimation({
			duration: 0
		});
		//touch移动不喜欢动画
		this.loatheAni = uni.createAnimation({
			duration: 0
		});
		console.log(this.item)
	},
	methods: {
		previous() {
			if (this.current == 0) {
				uni.showToast({
					title: '已经是第一张照片了',
					icon: 'none'
				})
				return
			} else {
				this.current = this.current - 1;
			}
		},
		next() {
			if (this.current == this.item.img.length - 1) {
				uni.showToast({
					title: '已经是最后一张照片了',
					icon: 'none'
				})
				return
			} else {
				this.current = this.current + 1;
			}
		},
		clearAnimation() {
			this.loveAnimation[0] = this.loveAni.export()
			this.loatheAnimation[0] = this.loatheAni.export()
		},
		_back() {
			//touch移动喜欢动画
			this.loveAni = uni.createAnimation({
				duration: 200
			});
			//touch移动不喜欢动画
			this.loatheAni = uni.createAnimation({
				duration: 200
			});
			this.loveAni.opacity(0).step()
			this.loveAnimation[0] = this.loveAni.export()
			this.loatheAni.opacity(0).step()
			this.loatheAnimation[0] = this.loatheAni.export()
		},
		moveRight(ratio) {
			this.loveAni.opacity(0.3 + 0.7 * ratio).step()
			this.loveAnimation[0] = this.loveAni.export()
			this.loatheAni.opacity(0).step()
			this.loatheAnimation[0] = this.loatheAni.export()
			
		},
		moveLeft(ratio) {
			this.loveAni.opacity(0).step()
			this.loveAnimation[0] = this.loveAni.export()
			this.loatheAni.opacity(0.3 + 0.7 * ratio).step()
			this.loatheAnimation[0] = this.loatheAni.export()
		},
		moveCenter() {
			this.loveAni.opacity(0.3).step()
			this.loveAnimation[0] = this.loveAni.export()
			this.loatheAni.opacity(0.3).step()
			this.loatheAnimation[0] = this.loatheAni.export()
		},
		goToUserProfile() {
			uni.navigateTo({
				url: `/pages/profile/profile?userId=${this.item.userId}&nickname=${encodeURIComponent(this.item.name)}&avatarUrl=${encodeURIComponent(this.item.img[0])}`
			})
		}
	}
}
</script>

<style lang="scss" scoped>
@font-face {
	font-family: "iconfont";
	src: url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2');
}

.iconfont {
	font-family: "iconfont" !important;
	font-size: 12px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}


.icon-v:before {
	content: "\e670";
}

.icon-male:before {
	content: "\e600";
}

.icon-wujiaoxing1:before {
	content: "\e602";
}

.icon-chacha1:before {
	content: "\e646";
}

.icon-genwozou:before {
	content: "\e61d";
}

.icon-xinaixin:before {
	content: "\e601";
}

.icon-tupian1:before {
	content: "\e718";
}

.icon-xingbie-nv:before {
	content: "\e677";
}

.username {
	display: flex;
	align-items: center;

	.img-right {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #54C7FC;
		color: #FFFFFF;
		margin-left: 20rpx;
	}
}

.left_previous {
	position: absolute;
	z-index: 10;
	left: 0;
	top: 0;
	width: 25%;
	height: 900rpx;
	opacity: 0;
}

.right_next {
	position: absolute;
	z-index: 10;
	right: 0;
	top: 0;
	width: 25%;
	height: 900rpx;
	opacity: 0;
}

.cardBox {
	position: relative;
	width: 100%;
	height: 95%;
	overflow: hidden;
	background-color: #fff;
	border-radius: 20rpx;
	// border: 2px solid #e9e7ef;

	.top {
		// width: 600rpx;
		// height: 900rpx;
		// height: 700rpx;
		width: 100%;
		height: 100%;

		.img-top {
			position: absolute;
			font-size: 12px;
			top: 40rpx;
			padding: 0 20rpx;
			display: flex;
			width: 560rpx;
			flex-direction: row;
			justify-content: space-between;
			z-index: 999;

			.img-left {
				display: flex;
				flex-direction: row;
				align-items: center;
				color: #fff;

				.img-number {
					display: flex;
					flex-direction: row;
					align-items: center;
					padding: 10rpx;
					background-color: rgba(0, 0, 0, 0.2);
					border-radius: 10rpx;
					margin-right: 20rpx;

					.tupian {
						margin-right: 5rpx;
					}
				}

				.img-zou {
					display: flex;
					flex-direction: row;
					align-items: center;
					padding: 10rpx;
					background-color: rgba(0, 0, 0, 0.4);
					border-radius: 10rpx;

					.genwozou {
						margin-right: 20rpx;
					}
				}
			}
		}

		.img {
			// width: 600rpx;
			// height: 900rpx;
			// height: 700rpx;
			width: 100%;
			height: 90%;
		}

		.love {
			position: absolute;
			width: 120rpx;
			height: 120rpx;
			top: 60rpx;
			left: 40rpx;
			border-radius: 50%;
			background-color: #EA2A36;
			display: flex;
			justify-content: center;
			align-items: center;
			z-index: 999;
			color: #FFFFFF;
			opacity: 0;
		}

		.loathe {
			position: absolute;
			width: 120rpx;
			height: 120rpx;
			top: 60rpx;
			right: 40rpx;
			border-radius: 50%;
			background-color: #A09E9F;
			display: flex;
			justify-content: center;
			align-items: center;
			z-index: 999;
			color: #FFFFFF;
			opacity: 0;
		}
	}

	.bottom {
		position: relative;
		display: flex;
		padding: 100rpx 20rpx;
		flex-direction: column;
		color: rgb(255, 255, 255);
		background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,3.95));
		.labelBox {
			margin-top: 10rpx;
			display: flex;
			flex-direction: row;

			.label {
				padding: 10rpx;
				font-size: 12px;
				color: #fff;
				display: flex;
				flex-direction: row;
				border-radius: 8rpx;
				margin-right: 15rpx;
			}

			.sex {
				margin-right: 5rpx;
			}
		}

		.address {
			margin-top: 10rpx;
			font-size: 12px;
			// color: #2c2c2c;
		}

		.star {
			position: absolute;
			width: 120rpx;
			height: 120rpx;
			top: -60rpx;
			right: 50rpx;
			border-radius: 50%;
			background-image: linear-gradient(to bottom left, #87DEFF, #1FAEFF);
			display: flex;
			justify-content: center;
			align-items: center;

			color: #FFFFFF;
		}
	}

	.bottom-shadow {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 11%;
		background-color: black;
		pointer-events: none;
	}

	.avatar-swiper {
		width: 100%;
		height: 90%;
		
		.swiper-image {
			width: 100%;
			height: 100%;
		}
	}

	.custom-indicators {
		position: absolute;
		top: 20rpx;
		left: 20rpx;
		right: 20rpx;
		display: flex;
		justify-content: space-between;
		z-index: 10;
		
		.indicator-line {
			flex: 1;
			height: 6rpx;
			background: rgba(255, 255, 255, 0.4);
			margin: 0 4rpx;
			border-radius: 3rpx;
			
			&.active {
				background: #ffffff;
			}
		}
	}

	.image-nav {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 70%;
		display: flex;
		justify-content: space-between;
		z-index: 10;

		.nav-area {
			width: 50%;
			height: 100%;
		}
	}
}
</style>
