<template>
	<view class="page">
		<!-- #ifndef APP-PLUS -->
		<movable-area class="move-area">
			<movable-view id="move" class="move-view" v-for="(item, index) in dataList" :key="item._id"
				:style="{ zIndex: `${index === 0 ? 999 : 998 - index}` }" direction="all" :x="item.moveX"
				:y="item.moveY" out-of-bounds :disabled="index != 0" :animation="item.animation" @tap="tapCard(item)"
				@touchend="touchend" @touchmove="touchMove" @touchstart="touchStart">
				<view class="cardBox" :animation="animationData[index]"
					:style="{ transform: index < number ? `scale(${1 - (1 - scale.x) * index},${1 - (1 - scale.y) * index}) translate(${translate.x * index}px, ${translate.y * index}px)` : `scale(${1 - (1 - scale.x) * (number - 1)},${1 - (1 - scale.y) * (number - 1)}) translate(${translate.x * (number - 1)}px, ${translate.y * (number - 1)}px)`, opacity: index < number ? `${1 - (1 - opacity) * index}` : `${1 - (1 - opacity) * (number - 1)}` }">
					<card-box :item="item"
						ref="cardBox">
					</card-box>
				</view>
			</movable-view>
		</movable-area>
		<view class="bottom-area">
			<view class="loathe1">
				<image src="../../static/back.png" style="width: 54upx;height: 54upx;"></image>
			</view>
			<view class="loathe" @click="tapLoathe">
				<image src="../../static/images/chacha.png" style="width: 54upx;height: 54upx;"></image>
				<!-- <view class="iconfont icon-chacha1" :style="{ fontSize: '30rpx' }"></view> -->
			</view>
			<view class="love" @click="tapLove">
				<image src="../../static/images/xihuan.png" style="width: 54upx;height: 54upx;"></image>
				<!-- <view class="iconfont icon-xinaixin" :style="{ fontSize: '34rpx' }"></view> -->
			</view>
			<!-- <view class="star">
				<view class="iconfont icon-wujiaoxing1" :style="{ fontSize: '40rpx' }"></view>
			</view> -->
		</view>
		<!-- #endif -->
		<!-- #ifdef APP-PLUS -->
		<view class="move-view" :key="item._id" @touchend="touchend" @tap="tapCard(item)"
			v-for="(item, index) in dataList" @touchmove="touchMove" @touchstart="touchStart"
			:animation="animationData[index]"
			:style="{ transform: index < number ? `rotate(${rotate * index}deg) scale(${1 - (1 - scale.x) * index},${1 - (1 - scale.y) * index}) skew(${skew.x * index}deg, ${skew.y * index}deg) translate(${translate.x * index}px, ${translate.y * index}px)` : `rotate(${rotate * (number - 1)}deg) scale(${1 - (1 - scale.x) * (number - 1)},${1 - (1 - scale.y) * (number - 1)}) skew(${skew.x * (number - 1)}deg, ${skew.y * (number - 1)}deg) translate(${translate.x * (number - 1)}px, ${translate.y * (number - 1)}px)`, zIndex: `${99999 - item._id}`, opacity: index < number ? `${1 - (1 - opacity) * index}` : `${1 - (1 - opacity) * (number - 1)}` }">
			<view class="cardBox">
				<card-box :item="item"
					ref="cardBox">
				</card-box>
			</view>
			<view class="bottom-area">
			<view class="loathe1">
				<image src="../../static/back.png" style="width: 54upx;height: 54upx;"></image>
			</view>
			<view class="loathe" @click="tapLoathe">
				<image src="../../static/images/chacha.png" style="width: 54upx;height: 54upx;"></image>
				<!-- <view class="iconfont icon-chacha1" :style="{ fontSize: '30rpx' }"></view> -->
			</view>
			<view class="love" @click="tapLove">
				<image src="../../static/images/xihuan.png" style="width: 54upx;height: 54upx;"></image>
				<!-- <view class="iconfont icon-xinaixin" :style="{ fontSize: '34rpx' }"></view> -->
			</view>
			<!-- <view class="star">
				<view class="iconfont icon-wujiaoxing1" :style="{ fontSize: '40rpx' }"></view>
			</view> -->
		</view>

		</view>
		<!-- #endif -->
	</view>
</template>

<script>
import clCardDel from "@/components/cl-cardDel/cl-cardDel";
import cardBox from "./card-box";
import { getRecommendUserList, followUser } from '@/api/user'

export default {
	mixins: [clCardDel],
	components: { cardBox },
	data() {
		return {

		}
	},
	methods: {
		tapLove() {
			if (this.dataList.length == 0) return
			this.moveX = 10 //设置角度y为0水平
			this.moveY = 1
			this._del()
		},
		tapLoathe() {
			if (this.dataList.length == 0) return
			this.moveX = -10 //设置角度
			this.moveY = 1
			this._del()
		},
		//设置初始参数
		init() {
			this.number = 3 //card 3
			this.translate = { x: 0, y: 0 } // 移除y轴位移
			this.scale = { x: 0.92, y: 0.92 } // 设置缩放比例
			this.type = true
			this.delMoveD = uni.getSystemInfoSync().screenWidth * 2 // 设置删除移动距离
			this.touchMoveD = uni.getSystemInfoSync().screenWidth / 4 // 设置触摸移动距离

			this.moveRotate = { //设置位移图片旋转角度距离  card中心点 - 指向坐标
				x: 0,
				y: 0
			}
		},
		touchStart(e) {
			if (this.dataList.length === 0) return
			this.oldTouces = e.touches[0]
			this.dataList[0].animation = false
		},
		touchMove(e) {
			if (this.delFlag || this.dataList.length === 0) return

			let newTouces = e.touches[0]
			//平移
			this.moveX = newTouces.clientX - this.oldTouces.clientX
			this.moveY = newTouces.clientY - this.oldTouces.clientY

			this.dataList[0].moveX = this.moveX
			this.dataList[0].moveY = this.moveY

			// 根据移动方向计算角度
			let angle = (this.moveX / uni.getSystemInfoSync().screenWidth) * 20

			// 优化动画创建,只创建一次
			if (!this.touchAnimation) {
				this.touchAnimation = uni.createAnimation({
					duration: 0,
					timingFunction: 'linear',
					transformOrigin: '50% 50%'
				})
			}

			//移动card动画
			this.touchAnimation
				.translateX(this.moveX)
				.translateY(this.moveY)
				.rotate(angle)
				.step({ immediate: true })

			this.animationData[0] = this.touchAnimation.export()

			//其他card动画优化
			if (!this.moveAnimation) {
				this.moveAnimation = uni.createAnimation({
					duration: 0,
					timingFunction: 'linear'
				})
			}

			//计算其他卡片的缩放和位移
			let d = this.moveX * this.moveX + this.moveY * this.moveY
			let ratio = Math.sqrt(d) / this.touchMoveD
			ratio = ratio > 1 ? 1 : ratio

			// 只对第二张卡片应用动画
			if (this.dataList.length > 1) {
				this.moveAnimation
					.scale(1 - (1 - this.scale.x) * ratio, 1 - (1 - this.scale.y) * ratio)
					.translateX(this.translate.x * ratio)
					.translateY(this.translate.y * ratio)
					.step({ immediate: true })

				this.animationData[1] = this.moveAnimation.export()
			}

			this.moveJudge(this.moveX, this.moveY, ratio)
		},
		//触摸中判断
		moveJudge(x, y, ratio) {
			let el = this.$refs.cardBox[0]
			if (!el) return

			if (x > 20) {
				el.moveRight(ratio)
			} else if (x < -20) {
				el.moveLeft(ratio)
			} else {
				el.moveCenter()
			}
		},
		//触摸结束判断
		endJudge(x, y) {
			let el = this.$refs.cardBox[0]
			if (!el) return

			if (Math.abs(x) < 40) {
				this._back()
				el._back()
			} else {
				this._del()
				el.clearAnimation()
			}
		},
		//删除card时
		_del() {
			if (this.type) {
				//#ifdef APP-PLUS
				this.delFlag = true
				//#endif
			}

			let d = this.moveX * this.moveX + this.moveY * this.moveY
			let y = this.moveY * this.delMoveD / Math.sqrt(d)
			let x = this.moveX * this.delMoveD / Math.sqrt(d)

			// 计算最终旋转角度
			let angle = (x / uni.getSystemInfoSync().screenWidth) * 20

			// 创建删除动画
			if (!this.delanimation) {
				this.delanimation = uni.createAnimation({
					duration: this.delTime,
					timingFunction: 'ease-out'
				})
			}

			this.delanimation
				.translateX(x)
				.translateY(y)
				.rotate(angle)
				.step()

			this.animationData[0] = this.delanimation.export()

			setTimeout(() => {
				this.delCard(this.moveX, this.moveY)
				this.moveX = 0
				this.moveY = 0
				this.dataList[0].moveX = 0
				this.dataList[0].moveY = 0
				this.dataList.splice(0, 1)

				// 重置所有动画
				this.touchAnimation = null
				this.moveAnimation = null
				this.delanimation = null
				this.animationData = {}

				if (this.type) {
					//#ifdef APP-PLUS
					this.delFlag = false
					//#endif
				}
			}, this.delTime)
		},
		_back() {
			//移动card动画，回到原位时角度归零
			this.delanimation.translateX(0).translateY(0).rotate(0).step()
			this.animationData[0] = this.delanimation.export()

			this.moveX = 0
			this.moveY = 0
			this.dataList[0].moveX = 0
			this.dataList[0].moveY = 0
			this.dataList[0].animation = true
		},
		async delCard(x, y) {
			const currentUser = this.dataList[0]
			console.log('当前用户数据：', JSON.stringify(currentUser))
			if (x > 0) {
				console.log(currentUser, '喜欢')
				try {
					const res = await followUser(currentUser.userId)
					if (res) {
						// console.log(res)
					} else {
					    uni.showToast({
						title: '关注失败',
						icon: 'none'
					})
					}
				} catch (error) {
					uni.showToast({
						title: '关注失败',
						icon: 'none'
					})
				}
			} else {
				console.log(currentUser, '不喜欢')
			}
		},
		tapCard(item) {
			console.log(item, "点击")
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

.icon-xinaixin:before {
	content: "\e601";
}

.icon-chacha1:before {
	content: "\e646";
}

.page {
	width: 100%;
	height: 94%;
	position: absolute;
	bottom: 0;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #FDFDFD;
	border-radius: 20rpx;
	// padding: 0 20rpx;
	box-sizing: border-box;
}

.move-area {
	position: absolute;
	width: 100%;
	height: 100%;
}

.bottom-area {
	position: absolute;
	width: 100%;
	height: 10%;
	bottom: 0;
	z-index: 999999;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 40rpx;
	box-sizing: border-box;
}

.move-view {
	width: 100%;
	height: 100%;
	transform: translate(-50%, -50%);
	margin-left: 0;
	margin-top: 0;
	transition: none; // 移除默认过渡
	will-change: transform; // 提示浏览器这个元素会频繁变化
	backface-visibility: hidden; // 防止3D变换时的闪烁
	-webkit-backface-visibility: hidden;
	transform-style: preserve-3d;
	-webkit-transform-style: preserve-3d;
	-webkit-perspective: 1000;
	perspective: 1000;
}

.cardBox {
	position: relative;
	// width: 600rpx;
	// height: 900rpx;
	width: 100%;
	height: 100%;
}


.loathe1 {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background-color: #FFF;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #FFFFFF;
}

.loathe {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	background-color: #A09E9F;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #FFFFFF;
}

.star {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background-image: linear-gradient(to bottom left, #87DEFF, #1FAEFF);
	display: flex;
	justify-content: center;
	align-items: center;

	color: #FFFFFF;
}

.love {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	background-color: #EA2A36;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 999;
	color: #FFFFFF;
}

.icon-wujiaoxing1:before {
	content: "\e602";
}
</style>
