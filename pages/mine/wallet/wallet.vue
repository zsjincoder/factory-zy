<template>
	<view class="content">
		<view class="header-box">
			<view class="header-title">账户余额（元）</view>
			<view class="my-wallet">15489.25</view>
		</view>
		<view class="divider"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
	.content {
		background: #FFFFFF;
		height: 100%;
		
		.header-box {
			
			.header-title {
				padding-top: 48rpx;
				line-height: 40rpx;
				font-size: 28rpx;
				color: $font-color;
				text-align: center;
			}
			
			.my-wallet {
				margin: 32rpx 0 48rpx;
				line-height: 84rpx;
				font-size: 60rpx;
				color: $font-color;
				text-align: center;
			}
		}
		
		.divider {
			width: 100%;
			height: 16rpx;
			background: #F8F8F8;
		}
	}
</style>
