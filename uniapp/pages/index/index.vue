<template>
	<view class="container">
		<!-- 页面头部 -->
		<view class="page-head">
			<view class="search-btn" @click="goToSearch">
				<image src="/static/images/search.png" mode="aspectFit" class="icon"></image>
			</view>
		</view>
		
		<!-- 原有内容 -->
		<view class="content">
			<image class="logo" src="/static/logo.png"></image>
			<view class="text-area">
				<text class="title">{{title}}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('Hello')

// 跳转到搜索页面
const goToSearch = () => {
	uni.navigateTo({
		url: '/pages/search/search'
	})
}
</script>

<style lang="less" scoped>
.container {
	width: 100%;
	min-height: 100vh;
	background: #f5f5f5;
	
	// 页面头部
	.page-head {
		width: 100%;
		padding: 20rpx;
		display: flex;
		justify-content: flex-start;  // 改为左对齐
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		box-sizing: border-box;
		padding-top: calc(var(--status-bar-height) + 20rpx);
		background: transparent;  // 背景改为透明
		
		.search-btn {
			width: 37rpx;
			height: 37rpx;
			padding: 10rpx;
			margin-left: 10rpx;  // 添加左边距
			display: flex;
			align-items: center;
			justify-content: center;
			
			.icon {
				width: 100%;
				height: 100%;
			}
		}
	}
	
	// 原有样式
	.content {
		padding-top: calc(var(--status-bar-height) + 88rpx);  // 为固定头部留出空间
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		
		.logo {
			height: 200rpx;
			width: 200rpx;
			margin-top: 200rpx;
			margin-left: auto;
			margin-right: auto;
			margin-bottom: 50rpx;
		}
		
		.text-area {
			display: flex;
			justify-content: center;
			
			.title {
				font-size: 36rpx;
				color: #8f8f94;
			}
		}
	}
}
</style>
