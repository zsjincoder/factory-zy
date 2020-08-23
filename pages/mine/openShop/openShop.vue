<template>
	<view class="content">
		<view class="divider"></view>
		<view class="open-shop-box">
			<view class="open-shop-title">请选择以下其中一种开店</view>
			<view class="shop-type">
				<radio-group @change="checkShopType">
					<label class="radio-group" v-for="(item, index) in shopList" :key="item.value">
						<view class="radio-box">
							<radio class="radio" :value="item.value" :checked="index === current" />
							<view class="img-box">
								<image :src="item.imgSrc"></image>
							</view>
						</view>
						<view class="radio-name">{{item.name}}</view>
					</label>
				</radio-group>
			</view>
			<view class="button-box">
				<button @click="nextStep" :disabled="disabled" :class="['button',disabled ? '' : 'active']">下一步</button>
			</view>
		</view>

		<!-- 进入另一个小程序的提示框 -->
		<uni-popup ref="remaks" :maskClick="maskFlag" type="center">
			<view class="remaks-box">
				<view class="title">即将进入易启联盟餐饮门店管理</view>
				<view class="btn-group">
					<view class="cancel-btn" @click="close">取消</view>
					<view class="define-btn" @click="toAnother">确定</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	export default {
		data() {
			return {
				shopList: [{
					name: '工厂',
					value: 0,
					imgSrc: '../../../static/img/mine/checked-false.png'
				}, {
					name: '商家',
					value: 1,
					imgSrc: '../../../static/img/mine/checked-false.png'
				}, {
					name: '餐饮',
					value: 2,
					imgSrc: '../../../static/img/mine/checked-false.png'
				}],
				current: -1,
				disabled: true,
				maskFlag: false
			};
		},
		components: {
			uniPopup
		},
		methods: {
			checkShopType(e) {
				this.current = e.detail.value
				for (let i = 0; i < this.shopList.length; i++) {
					if (this.current == i) {
						this.shopList[i].imgSrc = '../../../static/img/mine/checked-true.png'
					} else {
						this.shopList[i].imgSrc = '../../../static/img/mine/checked-false.png'
					}
				}
				this.disabled = false
			},
			close() {
				this.$refs['remaks'].close()
			},
			nextStep() {
				console.log('我点击了下一步')
				if (this.current == 0) {
					uni.navigateTo({
						url: '/pages/mine/openShop/factoryRule'
					})
				} else if (this.current == 1) {
					uni.navigateTo({
						url: '/pages/mine/openShop/shopRule'
					})
				} else if (this.current == 2) {
					console.log('我选择的是餐饮')
					this.$refs['remaks'].open()
				} else {

				}
			},
			toAnother() {
				this.$refs['remaks'].close()

				uni.showToast({
					title: '餐饮门店管理即将上线，敬请期待',
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
		min-height: 100%;

		.divider {
			width: 100%;
			height: 16rpx;
			background: #F8F8F8;
		}

		.open-shop-box {
			margin: 0 32rpx;

			.open-shop-title {
				margin: 48rpx 0 32rpx;
				font-size: 28rpx;
				color: $font-color;
				font-weight: 500;
			}

			.shop-type {
				.radio-group {
					display: flex;

					.radio-box {
						width: 40rpx;
						height: 40rpx;
						overflow: hidden;
						margin-top: 48rpx;

						.radio {
							display: none;
						}

						.img-box {
							width: 100%;
							height: 100%;

							image {
								width: 100%;
								height: 100%;
							}
						}
					}


					.radio-name {
						margin: 48rpx 0 0 16rpx;
						font-size: 28rpx;
						color: $font-color;
						height: 40rpx;
						line-height: 40rpx;
					}
				}
			}

			.button-box {
				margin-top: 80rpx;

				.button {
					height: 88rpx;
					line-height: 88rpx;
					font-size: 32rpx;
					color: #FFFFFF;
					border-radius: 8rpx;
					background: #CECECE;
				}

				.button::after {
					border: none;
				}

				.active {
					background: #ED494C;
				}
			}
		}

		.remaks-box {
			width: 568rpx;
			background: #FFFFFF;
			border-radius: 8rpx;

			.title {
				height: 168rpx;
				line-height: 168rpx;
				text-align: center;
				font-size: 28rpx;
				font-weight: 500;
				color: $font-color;
				border-bottom: 2rpx solid #EEEEEE;
				box-sizing: border-box;
			}

			.btn-group {
				display: flex;
				height: 106rpx;

				.cancel-btn,
				.define-btn {
					width: 50%;
					line-height: 106rpx;
					font-size: 28rpx;
					text-align: center;
				}

				.cancel-btn {
					color: #999999;
				}

				.define-btn {
					border-left: 2rpx solid #EEEEEE;
					box-sizing: border-box;
					color: #ED494C;
				}
			}
		}
	}
</style>
