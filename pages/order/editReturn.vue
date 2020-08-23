<template>
	<view class="content">
		<view class="divider"></view>
		<view class="product-box" v-for="(item,index) in getReturnOrder.goods" :key="index">
			<view class="img-box">
				<image :src="item.cover_img"></image>
			</view>
			<view class="info-box">
				<view class="product-title" style="display: flex;justify-content: space-between;">
					<view>{{item.goods_name}}</view>
					<view>￥{{item.unit_price}}</view>
				</view>
				<view class="product-Specifications" style="display: flex;justify-content: space-between;">
					<view>{{item.standard_desc}}</view>
					<view>x{{item.num}}</view>
				</view>
			</view>
		</view>
		<view class="divider"></view>
		<view class="order-info">
			<view class="title">订单编号</view>
			<view class="info-box">
				<view class="order-id">{{getReturnOrder.order_number}}</view>
				<view class="oper" @click="copye">复制</view>
			</view>
		</view>
		<view class="divider"></view>
		<view class="my-logistics">
			<view class="title">快递单号</view>
			<view class="logistics-box">
				<input class="logistics-input" :value="logistics" @input="getLogistics" type="text" placeholder="请输入退货商品的物流单号"
				 placeholder-style="font-size: 28rpx; color: #E5E5E5" />
			</view>
		</view>
		<view class="divider"></view>
		<view class="button-box">
			<button :disabled="disabled" :class="['button',disabled ? '' : 'active']" @click="Return()">提交</button>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from "vuex"
	export default {
		data() {
			return {
				logistics: '',
				disabled: true
			};
		},
		computed: {
			...mapGetters({
				getReturnOrder: 'getReturnOrder'
			})
		},
		onLoad() {
			console.log(this.getReturnOrder);
		},
		methods: {
			// 退货
			Return(){
				console.log(this.disabled)
				if(this.disabled == true){
					return
				}
				let data ={
					order_id:this.getReturnOrder.order_id,
					type:2,
					express_number:this.logistics
				}
				this.$api.orderRefund(data).then(res=>{
						if(res.data.errno == 0){
							uni.showToast({
								title: '退款申请提交成功',
								duration: 1000,
								icon: "none"
							});
							setTimeout(res => {
								uni.switchTab({
									url: '/pages/order/order'
								})
							}, 1000)
						}else{
							this.close('refund');
							uni.showToast({
								title: '退款申请提交失败',
								duration: 1000,
								icon: "none"
							});
						}
				})
			},
			// 粘贴板
			copye() {
				uni.setClipboardData({
					data: this.getReturnOrder.order_number,
					success: function() {
						console.log('success');
						uni.showToast({
							title: '复制成功',
							duration: 1000,
							icon: "none"
						});
					}
				});
			},
			getLogistics(e) {
				this.logistics = e.detail.value
				if (this.logistics !== '') {
					this.disabled = false
				} else {
					this.disabled = true
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #FFFFFF;
	}

	.content {
		background: #FFFFFF;
		height: 100%;

		.divider {
			width: 100%;
			height: 16rpx;
			background: #F8F8F8;
		}

		.product-box {
			margin: 32rpx;
			display: flex;

			.img-box {
				width: 160rpx;
				height: 160rpx;
				border-radius: 8rpx;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.info-box {
				margin-left: 32rpx;
				flex: 1;

				.product-title {
					font-size: 28rpx;
					color: $font-color;
					line-height: 40rpx;
					display: -webkit-box;
					/*将对象转为弹性盒模型展示*/
					-webkit-box-orient: vertical;
					/*设置弹性盒模型子元素的排列方式*/
					-webkit-line-clamp: 2;
					/*限制文本行数*/
					overflow: hidden;
					/*超出隐藏*/
				}

				.product-Specifications {
					font-size: 28rpx;
					color: #999999;
					margin-top: 16rpx;
				}
			}
		}

		.order-info,
		.my-logistics {
			margin: 32rpx;
			display: flex;
			justify-content: space-between;

			.title {
				font-size: 28rpx;
				color: $font-color;
				font-weight: 500;
				line-height: 40rpx;
			}

			.info-box {
				display: flex;

				.order-id {
					color: #999999;
					font-size: 28rpx;
					line-height: 40rpx;
					margin-right: 32rpx;
				}
			}

			.logistics-box {
				width: 70%;
				.logistics-input {
					line-height: 40rpx;
					font-size: 28rpx;
					color: $font-color;
				}
			}
		}

		.button-box {
			position: fixed;
			width: 100%;
			height: 88rpx;
			bottom: 0;
			left: 0;

			.button {
				width: 100%;
				height: 100%;
				line-height: 88rpx;
				text-align: center;
				color: #FFFFFF;
				background: #CECECE;
				font-size: 32rpx;
				padding: 0;
				margin: 0;
				border-radius: 0;
			}

			.button::after {
				border: none;
			}

			.active {
				background: #ED494C;
			}
		}
	}
</style>
