<template>
	<view class="content">
		<view class="divider"></view>
		<view class="phone-box">
			<view class="box-left">
				<view class="prefix-box">
					<view class="prefix">+86</view>
					<image src="../../../static/img/mine/arrow-right.png"></image>
				</view>
				<view class="phone">
					<input class="phone-input" type="text" @input="getPhoneNum" :value="phoneNum" placeholder="手机号码" placeholder-style="color: #E5E5E5; font-size: 28rpx" />
				</view>
			</view>
			<view class="box-right" @click="getCode">获取验证码</view>
		</view>
		<view class="identifying-box">
			<input class="identify-input" type="text" @input="getCodeInfo" :value="code" placeholder="短信验证码" placeholder-style="color: #E5E5E5; font-size: 28rpx" />
		</view>

		<view class="button-box">
			<button @click="complete" :disabled="disabled" :class="['button', disabled?'':'active']">完成</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				disabled: true,
				phoneNum: '',
				code: ''
			};
		},
		methods: {
			getCode() {
				if (this.phoneNum === '') {
					uni.showToast({
						title: '请先输入手机号',
						duration: 1000,
						icon: 'none'
					});
				}
			},
			getPhoneNum(e) {
				if (e.detail.value) {
					this.phoneNum = e.detail.value
				}
			},
			getCodeInfo(e) {
				if (e.detail.value) {
					this.code = e.detail.value
					if (this.phoneNum !== '') {
						this.disabled = false
					} else {
						this.disabled = true
					}
				}else{
					this.disabled = true
				}
			},
			complete() {
				console.log('点击了完成')
				uni.showToast({
					title: '验证码错误',
					duration: 1000,
					icon: 'none'
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

		.phone-box {
			margin: 0 32rpx;
			display: flex;
			justify-content: space-between;
			height: 104rpx;
			border-bottom: 2rpx solid #EEEEEE;
			box-sizing: border-box;

			.box-left {
				display: flex;

				.prefix-box {
					display: flex;

					.prefix {
						line-height: 104rpx;
						font-size: 28rpx;
					}


					image {
						width: 32rpx;
						height: 32rpx;
						margin: 36rpx 48rpx 0 16rpx;
					}
				}

				.phone {
					height: 100%;

					.phone-input {
						height: 100%;
						line-height: 104rpx;
						font-size: 28rpx;
					}
				}
			}

			.box-right {
				line-height: 104rpx;
				color: #ED4A4C;
				font-size: 28rpx;
			}
		}

		.identifying-box {
			margin: 0 32rpx;
			height: 104rpx;
			border-bottom: 2rpx solid #EEEEEE;
			box-sizing: border-box;

			.identify-input {
				width: 100%;
				height: 100%;
				line-height: 104rpx;
				font-size: 28rpx;
			}
		}

		.button-box {
			margin: 80rpx 32rpx 0;

			.button {
				width: 100%;
				height: 88rpx;
				line-height: 88rpx;
				text-align: center;
				background: #CECECE;
				color: #FFFFFF;
				font-size: 32rpx;
				border-radius: 8rpx;
				outline: none;
				border: none;
				box-sizing: border-box;
				padding: 0;
			}
			
			.button::after{
				border: none; 
			}

			.active {
				background: #ED494C;
			}
		}
	}
</style>
