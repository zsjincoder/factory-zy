<template>
	<view class="content">
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex === index}"
			 @click="tabClick(index)">
				{{item.title}}
			</view>
		</view>

		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadMore(tabCurrentIndex)">
					<!-- 空白页 -->
					<empty v-if="tabItem.orderList.length === 0"></empty>

					<!-- 订单列表 -->
					<view v-for="(item,index) in tabItem.orderList" :key="index" class="order-item" @click="toOrderDetail(item)">
						<!-- 店铺 -->
						<view class="store pub-padding" style="justify-content:space-between;">
							<view style="display: flex;align-items: center;" @tap.stop="toStoreHome(item)">
								<view class="store-name">{{item.factory_title}}</view>
								<image class="s-image" src="/static/img/mine/arrow-right.png"></image>
							</view>
							<view>
								<text class="state" style="color:red ">{{item.status_name}}</text>
							</view>
						</view>
						<!-- 商品列表 -->
						<view class="pub-padding">
							<view class="product" v-for="(item,index) in item.goods" :key="index">
								<image class="p-img" :src="item.cover_img"></image>
								<view class="p-desc">
									<view class="p-line" style="margin-bottom: 16rpx;">
										<view class="p-name" style="width: 350rpx;">{{item.goods_name}}</view>
										<view class="p-name">￥{{item.unit_price}}</view>
									</view>
									<view class="p-line">
										<view class="specification">{{item.standard_desc}}</view>
										<view class="p-name">x{{item.num}}</view>
									</view>
								</view>
							</view>
						</view>
						<view class="price-box">
							共
							<text class="num">{{item.goods_num}}</text>
							件商品 总金额：
							<text class="price">{{item.pay_money}}</text>
						</view>
						<view class="action-box b-t">
							<button v-if="item.status == 1" class="action-btn" @tap.stop="isCancelOrder(item)">取消订单</button>
							<button v-if="item.status == 2 || item.status == 3" class="action-btn" @tap.stop="requestRefund(item)">申请退款</button>
							<button v-if="item.status == 3" class="action-btn recom" @tap.stop="confirmReceipt(item)">确认收货</button>
							<button v-if="item.status == 1" class="action-btn recom" @tap.stop="payOrder(item)">立即支付</button>
						</view>
					</view>
					<uni-load-more :status="tabItem.loadingType"></uni-load-more>

				</scroll-view>
			</swiper-item>
		</swiper>
		<!-- 取消订单提示弹窗 -->
		<uni-popup ref="remaks" :maskClick="maskFlag" type="center">
			<view class="remaks-box">
				<view class="title">是否确定取消订单</view>
				<view class="btn-group">
					<view class="cancel-btn" @click="close">取消</view>
					<view class="define-btn" @click="cancelOrder()">确定</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import empty from "@/components/empty";
	// import Json from '@/Json';
	import {
		mapGetters,
		mapMutations
	} from "vuex"
	export default {
		components: {
			empty,
			uniLoadMore,
			uniPopup
		},
		data() {
			return {
				tabCurrentIndex: 0,
				navList: [],
				maskFlag: false, //弹窗控制变量
				pageData: {
					page: 1,
					limit: 3,
					status: 0 //全部
				}, // 分页信息
				selectedOrder: {}, //选中订单
			};
		},

		onLoad(options) {
			// this.loadData();
			// this.getOrderMenu(); //获取订单菜单列表			
		},
		onShow() {
			this.isLogin(); //判断是否登录
			this.close();
			this.pageData = {
				page: 1,
				limit: 3,
				status: 0 //全部
			};
		},
		methods: {
			...mapMutations({
				setReturnOrder: 'setReturnOrder',
				setAddressData: 'setAddressData',
				setOrderData: 'setOrderData',
				setOrderState: 'setOrderState'
			}),
			// 店铺首页
			toStoreHome(e) {
				console.log(e);
				uni.setStorageSync('factory_id', e.factory_id);
				uni.navigateTo({
					url: "/pages/index/storeHome/storeHome"
				})
			},
			// 订单详情页
			toOrderDetail(item) {
				this.$api.orderDetail({
					order_id: item.order_id
				}).then(res => {
					if (res.data.errno == 0) {
						console.log(res);
						let data = res.data.data;
						// 设置vuex的收货地址信息
						this.setAddressData({
							address: data.address,
							address_id: "",
							name: data.name,
							phone: data.phone
						})
						this.setOrderData(data); //vuex设置订单信息
						this.setOrderState(data.status); //vuex设置订单状态
						uni.navigateTo({
							url: "/pages/index/confirmOrder/confirmOrder"
						})
					} else {

					}
				})
			},
			// 确认收货
			confirmReceipt(item) {
				this.$api.orderFinish({
					order_id: item.order_id
				}).then(res => {
					uni.showToast({
						title: res.data.msg,
						duration: 1000,
						icon: "none"
					});
					if (res.data.errno == 0) {
						this.navList[this.tabCurrentIndex].orderList = [];
						this.getOrderList(this.tabCurrentIndex);
					}
					console.log(res);
				})
			},
			// 判断是否登录
			isLogin() {
				this.userInfo = uni.getStorageSync('user_info')
				if (this.userInfo.token) {
					this.getOrderMenu();
				} else {
					uni.showToast({
						title: '还未登录，请先登录',
						duration: 1000,
						icon: 'none'
					})
					setTimeout(res => {
						uni.switchTab({
							url: '/pages/mine/mine'
						})
					}, 1000)
				}
			},
			//获取订单菜单列表
			getOrderMenu() {
				this.$api.orderMenu().then(res => {
					if (res.data.errno == 0) {
						this.navList = res.data.data;
						this.tabCurrentIndex = this.navList[0].status;
						this.navList.map((item, index) => {
							item.loadingType = 'more';
							item.orderList = [];
						})
						this.getOrderList(this.tabCurrentIndex); //获取订单列表数据
					} else if (res.data.errno === 400 || res.data.errno === 4008 || res.data.errno === 4009) {
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
						}, 1000)
					}
				})
			},
			// 获取订单列表
			getOrderList(index) {
				this.pageData.status = index
				this.navList[index].loadingType = "loading";
				this.$api.orderList(this.pageData).then(res => {
					if (res.data.errno == 0) {
						console.log(res);
						if (res.data.data.next_page == 0) {
							this.navList[index].loadingType = "noMore";
						} else {
							this.pageData.page = res.data.data.next_page;
							this.navList[index].loadingType = "more";
						}
						this.$set(this.navList[index], 'orderList', [...this.navList[index].orderList, ...res.data.data.list]);
						this.$forceUpdate();
					}
				})
			},
			// 加载更多
			loadMore(index) {
				if (this.navList[index].loadingType == "noMore") {
					console.log("没有更多了")
					return
				}
				this.getOrderList(index);
			},
			//swiper 切换
			changeTab(e) {
				console.log(e);
				this.tabCurrentIndex = e.target.current;
				this.navList[this.tabCurrentIndex].orderList = [];
				this.pageData = {
						page: 1,
						limit: 3,
						status: 0 //全部
					},
					this.getOrderList(this.tabCurrentIndex);
			},
			//顶部tab点击
			tabClick(index) {
				this.navList[index].orderList = [];
				this.tabCurrentIndex = index;
			},
			//删除订单
			deleteOrder(index) {
				uni.showLoading({
					title: '请稍后'
				})
				setTimeout(() => {
					this.navList[this.tabCurrentIndex].orderList.splice(index, 1);
					uni.hideLoading();
				}, 600)
			},
			isCancelOrder(item) {
				this.selectedOrder = item;
				this.$refs['remaks'].open();
			},
			// 取消按钮
			close() {
				this.$refs['remaks'].close();
			},
			// 申请退款
			requestRefund(item) {
				console.log(item);
				this.setReturnOrder(item);
				uni.navigateTo({
					url: "/pages/order/refundReturn"
				})
			},
			//取消订单
			cancelOrder() {
				this.$refs['remaks'].close();
				uni.showLoading({
					title: '请稍后'
				})
				this.$api.orderCancel({
					order_id: this.selectedOrder.order_id
				}).then(res => {
					if (res.data.errno == 0) {
						uni.hideLoading();
						uni.showToast({
							title: '订单取消成功',
							duration: 1000,
							icon: "none"
						});
						this.navList[this.tabCurrentIndex].orderList = [];
						this.getOrderList(this.tabCurrentIndex);
					}
				})

			},
			// 订单支付
			payOrder(item) {
				let code = "";
				uni.login({
					provider: 'weixin',
					success: (loginRes) => {
						console.log(loginRes);
						if (loginRes.errMsg == "login:ok") {
							code = loginRes.code;
							this.$api.orderPay({
								order_id: item.order_id,
								js_code: code
							}).then(res => {
								if (res.data.errno == 0) {
									console.log(res);
									let data = res.data.data;
									uni.requestPayment({
										provider: 'wxpay',
										timeStamp: data.timeStamp,
										nonceStr: data.nonceStr,
										package: data.package,
										signType: data.signType,
										paySign: data.paySign,
										success: function(res) {
											console.log('success:' + JSON.stringify(res));
											uni.showToast({
												title: '支付成功',
												duration: 1500,
												icon: "none"
											});
											uni.navigateTo({
												url: "/pages/index/paySuccess/paySuccess"
											})
										},
										fail: function(err) {
											console.log('fail:' + JSON.stringify(err));
											uni.showToast({
												title: '支付失败',
												duration: 1500,
												icon: "none"
											});
											uni.navigateTo({
												url: "/pages/index/payFail/payFail"
											})
										}
									});
								}
							})


						}
					}
				});

			},
			//订单状态文字和颜色
			orderStateExp(state) {
				let stateTip = '',
					stateTipColor = '#fa436a';
				switch (+state) {
					case 1:
						stateTip = '待付款';
						break;
					case 2:
						stateTip = '待发货';
						break;
					case 9:
						stateTip = '订单已关闭';
						stateTipColor = '#909399';
						break;

						//更多自定义
				}
				return {
					stateTip,
					stateTipColor
				};
			}
		},
	}
</script>

<style lang="scss">
	page,
	.content {
		background: $page-color-base;
		height: 100%;
	}

	.swiper-box {
		height: calc(100% - 40px);
	}

	.list-scroll-content {
		height: 100%;
	}

	.navbar {
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0, 0, 0, .06);
		position: relative;
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;

			&.current {
				color: $base-color;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}

	.uni-swiper-item {
		height: auto;
	}

	// 确定取消弹窗
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


	.order-item {
		display: flex;
		flex-direction: column;
		// padding-left: 30upx;
		background: #fff;
		margin-top: 16upx;

		.store {
			width: 100%;
			display: flex;
			align-items: center;
			height: 112rpx;
			position: relative;

			.s-image {
				width: 32rpx;
				height: 32rpx;
				margin-left: 20rpx;
			}

			.store-name {
				font-size: 30rpx;
				color: rgba(34, 34, 34, 1);
			}

			&.store:after {
				position: absolute;
				z-index: 3;
				left: 0;
				right: 0;
				height: 0;
				content: '';
				-webkit-transform: scaleY(0.5);
				transform: scaleY(0.5);
				border-bottom: 1px solid #E4E7ED;
				bottom: 0;
			}
		}

		.i-top {
			display: flex;
			align-items: center;
			height: 80upx;
			// padding-right:30upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;

			.time {
				flex: 1;
			}

			.state {
				color: $base-color;
			}

			.del-btn {
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;

				&:after {
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}

		// 商品列表
		.product {
			width: 100%;
			display: flex;
			height: 220rpx;
			align-items: center;

			.p-img {
				width: 160rpx;
				height: 160rpx;
			}

			position: relative;

			&.product:after {
				position: absolute;
				z-index: 3;
				left: 0;
				right: 0;
				height: 0;
				content: '';
				-webkit-transform: scaleY(0.5);
				transform: scaleY(0.5);
				border-bottom: 1px solid #E4E7ED;
				bottom: 0;
			}

			.p-desc {
				width: 496rpx;
				height: 160rpx;
				margin-left: 32rpx;

				.p-line {
					display: flex;
					justify-content: space-between;
					width: 100%;

					.p-name {
						font-size: 28rpx;
						overflow: hidden;
						word-break: break-all;
						/* break-all(允许在单词内换行。) */
						text-overflow: ellipsis;
						/* 超出部分省略号 */
						display: -webkit-box;
						/** 对象作为伸缩盒子模型显示 **/
						-webkit-box-orient: vertical;
						/** 设置或检索伸缩盒对象的子元素的排列方式 **/
						-webkit-line-clamp: 2;
						/** 显示的行数 **/
					}

					.specification {
						font-size: 28rpx;
						color: rgba(153, 153, 153, 1);
					}
				}
			}
		}

		.price-box {
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20upx 30upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.num {
				margin: 0 8upx;
				color: $font-color-dark;
			}

			.price {
				font-size: $font-lg;
				color: $font-color-dark;

				&:before {
					content: '￥';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}

		.action-box {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
			padding-right: 30upx;
		}

		.action-btn {
			width: 160upx;
			height: 60upx;
			margin: 0;
			margin-left: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;

			&:after {
				border-radius: 100px;
			}

			&.recom {
				background: #fff9f9;
				color: $base-color;

				&:after {
					border-color: #f7bcc8;
				}
			}
		}
	}


	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center
	}

	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}

	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}

	.uni-load-more__img>view {
		position: absolute
	}

	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}

	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}

	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}

	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}

	.load2 {
		transform: rotate(30deg)
	}

	.load3 {
		transform: rotate(60deg)
	}

	.load1 view:nth-child(1) {
		animation-delay: 0s
	}

	.load2 view:nth-child(1) {
		animation-delay: .13s
	}

	.load3 view:nth-child(1) {
		animation-delay: .26s
	}

	.load1 view:nth-child(2) {
		animation-delay: .39s
	}

	.load2 view:nth-child(2) {
		animation-delay: .52s
	}

	.load3 view:nth-child(2) {
		animation-delay: .65s
	}

	.load1 view:nth-child(3) {
		animation-delay: .78s
	}

	.load2 view:nth-child(3) {
		animation-delay: .91s
	}

	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}

	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}

	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}

	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}

	@-webkit-keyframes load {
		0% {
			opacity: 1
		}

		100% {
			opacity: .2
		}
	}
</style>
