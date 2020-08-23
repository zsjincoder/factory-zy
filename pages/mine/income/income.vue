<template>
	<view class="content">
		<view class="header-box">
			<view class="header-title">
				<view class="title">可提现金额（元）</view>
				<view class="title-img" @click="open">
					<image src="../../../static/img/mine/info.png"></image>
				</view>
			</view>
			<view class="income-box">
				<view class="income">{{moneys}}</view>
				<view class="withdraw" @click="toWithdrawal">提现</view>
			</view>
		</view>
		<view class="divider"></view>
		<view class="content-box">
			<view class="item" v-for="(item,index) in incomeList" :key="item.id">
				<view class="item-info">
					<view class="item-title">{{item.title}}</view>
					<view :class="['info',item.type === 1 ? '' : 'green']">
						<text v-if="item.type === 1">+</text>
						<text v-else>-</text>
						{{item.moeny}}
					</view>
				</view>
				<view class="item-info info-sec">
					<view class="item-scripts">{{item.desc}}</view>
					<view class="item-time">{{item.create_at}}</view>
				</view>
			</view>
			<uni-load-more :status="loadingType"></uni-load-more>
		</view>
		<!-- 点击问号显示提现规则 -->
		<uni-popup ref="rules" :maskClick="maskFlag" type="center">
			<view class="rules-box">
				<view class="rules">
					<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scroll="scroll">
						<view class="rules-content">
							{{rules}}
						</view>
					</scroll-view>
				</view>
				<view class="close-box" @click="close">
					<image src="../../../static/img/mine/close.png" mode=""></image>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	export default {
		data() {
			return {
				maskFlag: false,
				rules: '提现规则提现规则提现规则提现规则提现规则提现规则提现规则提现规则提现规则提现规则提现规则提现规则提现规则',
				incomeList: [],
				moneys: '', // 余额
				loadingType: 'more', // 加载状态
				pageIndex: 1
			};
		},
		onShow() {
			// this.moneys = uni.getStorageSync('balance')
			this.getCommissionBalance()
		},
		onLoad() {
			this.getCommissionBalance()
			this.getCommissionList()
		},
		components: {
			uniPopup,
			uniLoadMore
		},
		onReachBottom() {
			if (this.loadingType === 'noMore') {
				return
			} else {
				this.getCommissionList()
			}
		},
		methods: {
			open() {
				this.$refs['rules'].open()
			},
			close() {
				this.$refs['rules'].close()
			},
			scroll(e) {
				console.log(e)
				this.old.scrollTop = e.detail.scrollTop
			},
			toWithdrawal() {
				uni.navigateTo({
					url: '/pages/mine/income/withdrawal?money=' + this.moneys
				})
			},
			// 获取收益余额
			getCommissionBalance() {
				this.$api.commissionBalance().then(res => {
					// console.log(res)
					if (res.data.errno === 0) {
						this.moneys = res.data.data.balance
						// uni.setStorageSync('moneys',this.moneys)
						// this.$forceUpdate()
						console.log(this.moneys)
					}else if(res.data.errno === 400 || res.data.errno === 4008 || res.data.errno === 4009){
						uni.showToast({
							title: '登录过时，请重新登录',
							duration: 1000,
							icon: 'none'
						})
						
						uni.setStorageSync('user_info', {
							token: '',
							user_id: '',
							user_img: '../../static/img/mine/default-img.png',
							user_name: '点击头像登录'
						});
						
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/mine/mine'
							})
						},1000)
					}
				})
			},
			// 获取收益列表
			getCommissionList() {
				if (this.loadingType === 'loading') {
					return
				}

				this.loadingType = 'loading'

				setTimeout(() => {
					this.$api.commissionList({
						page: this.pageIndex,
						limit: 10
					}).then(res => {
						console.log(res)
						if(res.data.errno === 0){
							
							this.incomeList = res.data.data.list
							
							// 判断是否有下一页
							if(res.data.data.next_page === 0){
								this.loadingType = 'noMore'
							}else{
								this.loadingType = 'more'
								this.pageIndex = res.data.data.next_page
							}
						}
					})
				}, 800)
			}
		}
	}
</script>

<style lang="scss">
	.content {
		background: #FFFFFF;
		height: 100%;

		.header-box {
			padding: 48rpx 34rpx;

			.header-title {
				display: flex;

				.title {
					font-size: 28rpx;
					color: $font-color;
				}

				.title-img {
					width: 32rpx;
					height: 32rpx;
					margin-top: 2rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}

			.income-box {
				display: flex;
				justify-content: space-between;
				margin-top: 32rpx;

				.income {
					line-height: 66rpx;
					font-size: 48rpx;
					font-weight: 500;
					color: $font-color;
				}

				.withdraw {
					width: 140rpx;
					height: 48rpx;
					border: 2rpx solid #ED494C;
					border-radius: 28rpx;
					font-size: 22rpx;
					color: #ED494C;
					line-height: 48rpx;
					text-align: center;
					margin-top: 8rpx;
				}
			}
		}

		.divider {
			width: 100%;
			height: 16rpx;
			background: #F8F8F8;
		}

		.content-box {
			margin: 0 32rpx;

			.item {
				padding: 34rpx 0;
				border-bottom: 2rpx solid #EEEEEE;
				box-sizing: border-box;

				.item-info {
					display: flex;
					justify-content: space-between;

					.item-title,
					.info {
						font-size: 28rpx;
					}

					.green {
						color: #4CBF00;
					}

					.item-scripts {
						font-size: 24rpx;
						color: #9E9E9E;
						max-width: 50%;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.item-time {
						font-size: 24rpx;
						color: #9E9E9E;
					}
				}

				.info-sec {
					margin-top: 10rpx;
				}
			}
		}

		.rules-box {
			width: 568rpx;
			height: 756rpx;

			.rules {
				background: #FFFFFF;
				width: 100%;
				height: 660rpx;
				padding: 46rpx;

				.scroll-Y {
					width: 100%;
					height: 100%;

				}
			}

			.close-box {
				margin: 48rpx auto 0;
				width: 48rpx;
				height: 48rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>
