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
		<view class="operate-box">
			<!-- <radio-group class="radio-group" @change="checkType"> -->
			<view class="radio-group">
				<view class="item-box" v-for="(item,index) in reasonReturn" :key="index" @click="checked(item,index)">
					<view class="item">
						<view class="item-left">
							<view class="item-title">{{item.title1}}</view>
							<view class="item-remask">{{item.title2}}</view>
						</view>
						<view class="item-right">
							<!-- <radio class="radio" value="0" :checked="cur == 0" /> -->
							<view class="img-box">
								<image :src="item.selected == true ? check : unCheck"></image>
							</view>
						</view>
					</view>

				</view>
			</view>
			<!-- </radio-group> -->
		</view>
		<view class="divider"></view>
		<view class="tips-box">* 为了能尽快处理退货换货，建议您先和商家协商。</view>

		<!-- 退款弹窗 -->
		<uni-popup ref="refund" :maskClick="maskFlag" type="center">
			<view class="refundRturn-box">
				<view class="title">我已确认和商家协商退款</view>
				<view class="btn-group">
					<view class="cancel-btn" @click="close('refund')">取消</view>
					<view class="define-btn" @click="Return">确定</view>
				</view>
			</view>
		</uni-popup>

		<!-- 退货弹窗 -->
		<uni-popup ref="return" :maskClick="maskFlag" type="center">
			<view class="refundRturn-box">
				<view class="title">商品已寄出，前去填写订单信息</view>
				<view class="btn-group">
					<view class="cancel-btn" @click="close('return')">取消</view>
					<view class="define-btn" @click="toEditReturn">确定</view>
				</view>
			</view>
		</uni-popup>
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
				cur: -1,
				unCheck: '../../static/img/mine/checked-false.png',
				check: '../../static/img/mine/checked-true.png',
				reasonReturn:[
					{
						title1:"我要退款",
						title2:"没收到货，或与卖家协商同意不用退货只退款",
						selected:false,
					},
					{
						title1:"我要退货退款",
						title2:"已收到货，需要退还收到的货物",
						selected:false,
					}
				],
				maskFlag: false
			};
		},
		computed:{
			...mapGetters({
				getReturnOrder:'getReturnOrder'
			})
		},
		onLoad() {
				console.log(this.getReturnOrder);
		},
		methods: {
			// 退款
			Return(){
				let data ={
					order_id:this.getReturnOrder.order_id,
					type:1,
					express_number:""
				}
				this.$api.orderRefund(data).then(res=>{
						if(res.data.errno == 0){
							this.close('refund');
							uni.showToast({
								title: '订单退款成功',
								duration: 1000,
								icon: "none"
							});
							setTimeout(res => {
								uni.switchTab({
									url: '/pages/order/order'
								})
							}, 1000)
							console.log(res);
						}else{
							this.close('refund');
							uni.showToast({
								title: '订单退款失败',
								duration: 1000,
								icon: "none"
							});
						}
				})
			},
			// 选中
			checked(item,i){
				console.log(item);
				this.reasonReturn.map((item,index)=>{
					if(index == i){
						item.selected = true
					}else{
						item.selected = false
					}
				})
				if(i == 0){
					this.$refs['refund'].open();
				}else{
					this.$refs['return'].open();
				}
			},
			close(name) {
				this.$refs[name].close()
			},
			toEditReturn() {
				uni.navigateTo({
					url: '/pages/order/editReturn'
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #FFFFFF;
	}

	.content {
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

		.operate-box {

			.radio-group {
				width: 100%;

				.item-box {
					border-bottom: 2rpx solid #EEEEEE;
					box-sizing: border-box;

					.item {
						margin: 0 32rpx;
						padding: 32rpx 0;
						display: flex;
						justify-content: space-between;

						.item-left {
							.item-title {
								font-size: 28rpx;
								color: $font-color;
								font-weight: 500;
							}

							.item-remask {
								margin-top: 16rpx;
								font-size: 24rpx;
								color: #999999;
							}
						}

						.item-right {
							width: 40rpx;
							height: 40rpx;
							margin-top: 26rpx;

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
					}
				}
			}
		}

		.tips-box {
			margin: 32rpx;
			font-size: 22rpx;
			color: #ED494C;
		}

		.refundRturn-box {
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
