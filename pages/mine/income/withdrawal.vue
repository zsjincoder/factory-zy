<template>
	<view class="content">
		<view class="withdrawal-box">
			<view class="withdrawal_box">
				<view class="withdrawal-header">
					<view class="header-title">到账账户</view>
					<view class="header-info">
						<view class="icon-box">
							<image src="../../../static/img/mine/income-icon.png" mode=""></image>
						</view>
						<view class="info">{{user_info.user_name}}</view>
					</view>
				</view>
				<view class="withdrawal-content">
					<view class="content-title">提现的金额</view>
					<view class="conten-box">
						<view class="money-unit">￥</view>
						<view class="input-box">
							<input type="text" :value="value" @input="getValue" />
						</view>
					</view>
				</view>
				<view class="remarks">可提现金额{{money}}元，<text class="tips" @click="toSetmoney">全部提现</text></view>
				<view>
					<button :disabled="!withdrawalFlag" :class="['btn-box', withdrawalFlag ? 'active' : '']" @click="withDrawal">提现</button>
				</view>
				
			</view>
		</view>
		<view class="bottom-box">
			<view class="item item-left"> <text @click="toHelpCenter">相关问题</text></view>
			<view class="item item-right"><text @click="toWithdrawalRecord">提现记录</text></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user_info: [],
				value: '',
				money: '',
				withdrawalFlag: false
			};
		},
		onShow() {
			// this.money = uni.getStorageInfoSync('moneys')
			// console.log(this.money)
		},
		onLoad(options) {
			this.user_info = uni.getStorageSync('user_info')
			this.money = options.money
		},
		methods: {
			getValue(e) {
				this.value = e.detail.value;
				this.judge()
			},
			toHelpCenter() {
				uni.navigateTo({
					url: '/pages/mine/income/helpCenter'
				})
			},
			// 判断输入框是否有内容
			judge() {
				if (this.value) {
					this.withdrawalFlag = true
				}else{
					this.withdrawalFlag = false
				}
			},
			// 点击全部提现
			toSetmoney() {
				this.value = this.money
				this.judge()
			},
			toWithdrawalRecord() {
				uni.navigateTo({
					url: '/pages/mine/income/withdrawalRecord'
				})
			},
			// 提现
			withDrawal() {
				console.log(this.value)
				console.log(parseFloat(this.value).toFixed(2))
				if (parseFloat(this.value).toFixed(2) < 1.00) {
					uni.showToast({
						title: '提现金额必须大于1',
						duration: 1000,
						icon: 'none'
					})
				} else if (parseFloat(this.value).toFixed(2) > this.money) {
					uni.showToast({
						title: '余额不足，重新输入',
						duration: 1000,
						icon: 'none'
					})
				} else {
					this.$api.commissionWithdrawal({money: this.value}).then(res => {
						console.log(res)
						if(res.data.errno === 0){
							uni.showToast({
								title: '提现成功',
								duration: 1000,
								icon: 'none'
							})
							
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								})
							},1000)
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.content {
		.withdrawal-box {
			background: #FFFFFF;

			.withdrawal_box {
				margin: 0 32rpx;
				padding-bottom: 48rpx;

				.withdrawal-header {
					border-bottom: 2rpx solid #EEEEEE;
					box-sizing: border-box;
					padding: 46rpx 0;
					display: flex;
					justify-content: space-between;

					.header-title {
						color: $font-color;
						font-size: 28rpx;
						line-height: 48rpx;
					}

					.header-info {
						display: flex;

						.icon-box {
							width: 48rpx;
							height: 48rpx;
							margin-right: 8rpx;

							image {
								width: 100%;
								height: 100%;
							}
						}

						.info {
							line-height: 48rpx;
							font-size: 28rpx;
						}
					}
				}
			}

			.withdrawal-content {
				border-bottom: 2rpx solid #EEEEEE;
				box-sizing: border-box;

				.content-title {
					margin-top: 46rpx;
					font-size: 28rpx;
				}

				.conten-box {
					margin: 40rpx 0 8rpx;
					display: flex;
					height: 56rpx;

					.money-unit {
						line-height: 56rpx;
						font-size: 40rpx;
					}

					.input-box {
						flex: 1;
						height: 100%;

						input {
							height: 100%;
							border: none;
							outline: none;
							font-size: 28rpx;
						}
					}
				}


			}

			.remarks {
				margin-top: 46rpx;
				font-size: 28rpx;

				.tips {
					color: #ED494C;
				}
			}

			.btn-box {
				margin-top: 48rpx;
				width: 100%;
				height: 90rpx;
				background: #CECECE;
				border-radius: 45rpx;
				text-align: center;
				line-height: 90rpx;
				color: #FFFFFF;
				font-size: 32rpx;
			}

			.active {
				background: #ED494C;
			}

		}



		.bottom-box {
			display: flex;
			margin-top: 32rpx;

			.item {
				width: 50%;
				font-size: 28rpx;
				color: #ED494C;
			}

			.item-left {
				border-right: 2rpx solid #DDDDDD;
				box-sizing: border-box;
				padding-right: 32rpx;
				text-align: right;
			}

			.item-right {
				padding-left: 32rpx;
			}
		}

	}
</style>
