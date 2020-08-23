<template>
	<view class="content">
		<view class="divider"></view>
		<view class="change-box">
			<view class="img-box">
				<image src="../../../static/img/mine/change-phone.png"></image>
			</view>
			<view class="phone-box">您当前的手机号{{showPhone}}</view>
			<view class="remaks-box">更换手机号后，个人其他信息保持不变</view>
			<view class="button-box" @click="toVerify">更换手机号码</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phoneNum: '17726259899',
				showPhone:''
			};
		},
		onLoad() {
			this.showPhone = this.phoneNum.replace(this.phoneNum.substring(3,7),'****')
		},
		methods: {
			toVerify(){
				uni.navigateTo({
					url: '/pages/mine/chengPhone/verifyPhone'
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		background: #FFFFFF;
		height: 100%;
		
		.divider {
			width: 100%;
			height: 16rpx;
			background: #F8F8F8;
		}
		
		.change-box {
			margin: 0 32rpx;
			
			.img-box {
				width: 96rpx;
				height: 96rpx;
				margin: 48rpx auto 32rpx;
				
				image {
					width: 100%;
					height: 100%;
				}
			}
			
			.phone-box {
				text-align: center;
				font-size: 32rpx;
				color: $font-color;
			}
			
			.remaks-box {
				text-align: center;
				font-size: 24rpx;
				color: #999999;
				margin-top: 16rpx;
			}
			
			.button-box {
				width: 100%;
				height: 88rpx;
				line-height: 88rpx;
				color: #FFFFFF;
				font-size: 32rpx;
				background: #ED4A4C;
				border-radius: 8rpx;
				text-align: center;
				margin-top: 80rpx;
			}
		}
	}
</style>
