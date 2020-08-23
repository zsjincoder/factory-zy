<template>
	<view class="content">
		<view class="divider"></view>
		<view class="change-box">
			<view class="img-box">
				<image src="../../../static/img/mine/change-phone.png"></image>
			</view>
			<view class="phone-box">为了您的账户安全</view>
			<view class="phone-box">需要验证{{showPhone}}手机号码</view>
			<view class="code-box">
				<view class="input-box">
					<input @input="getCode" type="text" :value="code" placeholder="输入验证码" placeholder-style="color: #E5E5E5; font-size: 28rpx;" />
				</view>
				<view class="button" @click="toGetCode">获取验证码</view>
			</view>
			<view class="button-box">
				<button @click="toChange" :disabled="disabled" :class="['next-step',disabled?'':'active']">下一步</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phoneNum: '17726259899',
				showPhone: '',
				code:'',
				disabled: true
			};
		},
		onLoad() {
			this.showPhone = this.phoneNum.replace(this.phoneNum.substring(3, 7), '****')
		},
		methods: {
			toGetCode(){
				
			},
			getCode(e){
				if(e.detail.value){
					this.code = e.detail.value
					this.disabled = false
				}
			},
			toChange(){
				uni.navigateTo({
					url: '/pages/mine/chengPhone/changePhone'
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

			.code-box {
				display: flex;
				justify-content: space-between;
				height: 104rpx;
				border-bottom: 2rpx solid #EEEEEE;
				box-sizing: border-box;
				
				.input-box {
					height: 100%;
					
					input {
						height: 100%;
						line-height: 104rpx;
						font-size: 28rpx;
					}
				}
				
				.button {
					font-size: 28rpx;
					color: #ED4A4C;
					line-height: 104rpx;
				}
			}
			
			.button-box {
				margin-top: 80rpx;
				
				.next-step {
					width: 100%;
					height: 88rpx;
					line-height: 88rpx;
					background: #CECECE;
					text-align: center;
					color: #FFFFFF;
				}
				
				.next-step::after{
					border: none;
				}
				
				.active {
					background: #ED4A4C;
				}
			}
		}
	}
</style>
