<template>
	<view>
		<!-- 剩余支付时间 -->
		<view class="waitPayment" v-if="getOrederState == 1">
			<view>
				<view v-if="orderState">
					<view class="w-desc">{{getOrderData.countdown}}</view>
					<view class="w-time">还剩{{day}}天{{hour}}小时{{minute}}分{{second}}秒自动关闭</view>
				</view>
				<view v-else class="w-desc" style="color: red;">订单已关闭</view>
			</view>
		</view>
		<!-- 剩余发货时间 -->
		<view class="waitPayment" v-if="getOrederState == 3">
			<view>
				<view class="w-desc">{{getOrderData.countdown}}</view>
				<view class="w-time">还剩{{day}}天{{hour}}小时{{minute}}分{{second}}秒自动确认收货</view>
			</view>
		</view>
		<!-- 地址 -->
		<view @click="toAddress" class="address-section">
			<view class="order-content">
				<view style="display: flex;align-items: center;">
					<image style="margin-right: 30rpx;" src="/static/img/comfirmOrder/address.png"></image>
					<view v-if="JSON.stringify(getAddressData) !== '{}'" class="cen">
						<view class="top">
							<text class="name">{{getAddressData.name}}</text>
							<text class="mobile">{{getAddressData.phone}}</text>
						</view>
						<text class="address">{{getOrederState == 0 ?getAddressData.address+getAddressData.house:getAddressData.address}}</text>
					</view>
					<view v-else class="cen">请选择</view>
					<image v-if="getOrederState === 0" src="/static/img/mine/arrow-right.png"></image>
				</view>
			</view>

			<image class="a-bg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAAAFCAYAAAAaAWmiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Rjk3RjkzMjM2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Rjk3RjkzMjQ2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGOTdGOTMyMTY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGOTdGOTMyMjY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrEOZlQAAAiuSURBVHjazJp7bFvV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"></image>
		</view>

		<view class="goods-section" v-for="(item,index) in getOrderData.factory" :key="index">
			<view class="g-header b-b" @click="toStoreHome">
				<view style="display: flex;align-items: center;">
					<view class="g-img">
						<image class="logo" :src="item.factory_image"></image>
						<text class="name">{{item.factory_title}}</text>
					</view>
					<image style="margin-left: 20rpx;" class="g-slec" src="/static/img/mine/arrow-right.png"></image>
				</view>
				<view style="color: red;">{{getOrderData.status_name}}</view>
			</view>
			<!-- 商品列表 -->
			<view class="g-item" v-for="(val,key) in item.goods" :key="key">
				<image :src="val.cover_img"></image>
				<view class="right">
					<text class="title clamp">{{val.goods_name}}</text>
					<view><text class="spec">{{val.standard_desc}}</text></view>
					<view class="price-box">
						<text class="price">￥{{val.unit_price}}</text>
						<text class="number">x {{val.num}}</text>
					</view>
				</view>
			</view>
			<!-- 运费和优惠合计 -->
			<view class="total-freight" v-if="getOrederState == 0">
				<!-- 优惠 -->
				<view class="t-freight">
					<view>优惠</view>
					<view>-￥{{item.discount_price}}</view>
				</view>
				<!-- 运费 -->
				<view class="t-freight">
					<view>运费</view>
					<view>+￥{{item.freight_price}}</view>
				</view>
			</view>
		</view>

		<!-- 优惠明细 -->
		<!-- 		<view class="yt-list">
			<view class="yt-list-cell b-b" @click="toggleMask('show')">
				<view class="cell-icon">
					券
				</view>
				<text class="cell-tit clamp">优惠券</text>
				<text class="cell-tip active">
					选择优惠券
				</text>
				<text class="cell-more wanjia wanjia-gengduo-d"></text>
			</view>
			<view class="yt-list-cell b-b">
				<view class="cell-icon hb">
					减
				</view>
				<text class="cell-tit clamp">商家促销</text>
				<text class="cell-tip disabled">暂无可用优惠</text>
			</view>
		</view>
		 -->

		<!-- 金额明细 -->
		<view class="yt-list" v-if="getOrederState != 0">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">商品总价</text>
				<text class="cell-tip">￥{{getOrderData.goods_price}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">商品优惠</text>
				<text class="cell-tip red">-￥{{getOrderData.discount_price}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">商品运费</text>
				<text class="cell-tip">￥{{getOrderData.freight_price}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">实际付款（含运费）</text>
				<text class="cell-tip">￥{{getOrderData.pay_money}}</text>
				<!-- <input class="desc" type="text" v-model="desc" placeholder="请填写备注信息" placeholder-class="placeholder" /> -->
			</view>
		</view>
		<!-- 订单信息 -->
		<view class="oreder-info" v-if="getOrederState != 0">
			<view class="i-title i-pubpadding">订单信息</view>
			<view class="i-item i-pubpadding" v-if="getOrderData.status != 1">
				<view class="i-title">支付方式</view>
				<view class="i-desc">微信支付</view>
			</view>
			<view class="i-item i-pubpadding">
				<view class="i-title">订单编号</view>
				<view class="i-desc">{{getOrderData.order_number}}</view>
			</view>
			<view class="i-item i-pubpadding" v-if="getOrderData.status === 3">
				<view class="i-title">快递单号</view>
				<view style="display: flex;align-items: center;">
					<view class="i-desc">{{getOrderData.express_number}}</view>
					<view class="i-title" style="margin-left: 32rpx;" @click="copye(getOrderData.express_number)">复制</view>
				</view>
			</view>
			<view class="i-item i-pubpadding">
				<view class="i-title">下单时间</view>
				<view class="i-desc">{{getOrderData.create_at}}</view>
			</view>
			<view class="i-item i-pubpadding" v-if="getOrderData.status != 1">
				<view class="i-title">付款时间</view>
				<view class="i-desc">{{getOrderData.pay_at}}</view>
			</view>
			<view class="i-item i-pubpadding" v-if="getOrderData.status === 3">
				<view class="i-title">发货时间</view>
				<view class="i-desc">{{getOrderData.deliver_at}}</view>
			</view>
			<view class="i-item i-pubpadding" v-if="getOrderData.status === 4">
				<view class="i-title">收货时间</view>
				<view class="i-desc">{{getOrderData.confirm_at}}</view>
			</view>
			<view class="i-item i-pubpadding" v-if="getOrderData.status === 7 || getOrderData.status === 5">
				<view class="i-title">退款时间</view>
				<view class="i-desc">{{getOrderData.refund_at}}</view>
			</view>
			<view class="i-item i-pubpadding" v-if="(getOrderData.status === 7 || getOrderData.status === 5) && getOrderData.refund_express_number != '' ">
				<view class="i-title">退货快递编号</view>
				<view class="i-desc">{{getOrderData.refund_express_number}}</view>
				<view class="i-title" style="margin-left: 32rpx;" @click="copye(getOrderData.refund_express_number)">复制</view>
			</view>
		</view>
		<!-- 底部 -->
		<view class="footer" v-if="getOrederState === 0">
			<view class="price-content">
				<text>共</text>
				<text class="price">{{getOrderData.total_num}}</text>
				<text>件</text>

			</view>
			<view class="price-content">
				<text>实付款</text>
				<text class="price-tip">￥</text>
				<text class="price">{{getOrderData.total_price}}</text>
			</view>
			<text class="submit" @click="submit">提交订单</text>
		</view>
		<view v-else-if="orderState === true && getOrderData.status != 7 && getOrderData.status != 5" class="footer" style="justify-content: flex-end;">
			<button class="action-btn" v-if="getOrderData.status === 1 || getOrderData.status === 2 ||getOrderData.status === 3" @click="concat">联系商家</button>
			<button class="action-btn" v-if="getOrderData.status === 1" @click="isCancel">取消</button>
			<button class="action-btn" v-if="getOrderData.status === 2" @click="toRefund">退款</button>
			<button class="action-btn" v-if="getOrderData.status === 3" @click="toRefund">退款退货</button>
			<button class="action-btn" v-if="getOrderData.status === 3 && getOrderData.is_extend === 1" @click="extendedReceipt">延长收货</button>
			<button class="action-btn" style="color: #FFFFFF;background: #ED494C;border-color: #ED494C;" v-if="getOrderData.status === 1"
			 @click="payOrder">付款</button>
			<button class="action-btn" style="color: #FFFFFF;background: #ED494C;border-color: #ED494C;" v-if="getOrderData.status === 3" @click="confirmReceipt">确认收货</button>
		</view>
		<!-- 优惠券面板 -->
		<!-- 		<view class="mask" :class="maskState===0 ? 'none' : maskState===1 ? 'show' : ''" @click="toggleMask">
			<view class="mask-content" @click.stop.prevent="stopPrevent">
				
				<view class="coupon-item" v-for="(item,index) in couponList" :key="index">
					<view class="con">
						<view class="left">
							<text class="title">{{item.title}}</text>
							<text class="time">有效期至2019-06-30</text>
						</view>
						<view class="right">
							<text class="price">{{item.price}}</text>
							<text>满30可用</text>
						</view>

						<view class="circle l"></view>
						<view class="circle r"></view>
					</view>
					<text class="tips">限新用户使用</text>
				</view>
			</view>
		</view> -->
		<!-- 取消订单提示弹窗 -->
		<uni-popup ref="remaks" :maskClick="maskFlag" type="center">
			<view class="remaks-box">
				<view class="title">是否确定取消订单</view>
				<view class="btn-group">
					<view class="cancel-btn" @click="close('remaks')">取消</view>
					<view class="define-btn" @click="cancelOrder()">确定</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import {
		mapGetters,
		mapMutations
	} from "vuex"
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				maskState: 0, //优惠券面板显示状态
				desc: '', //备注
				maskFlag: false,
				payType: 1, //1微信 2支付宝
				timer: null,
				hour: 0,
				minute: 0,
				second: 0,
				day:0,
				orderState: true, //订单状态
				// couponList: [{
				// 		title: '新用户专享优惠券',
				// 		price: 5,
				// 	},
				// 	{
				// 		title: '庆五一发一波优惠券',
				// 		price: 10,
				// 	},
				// 	{
				// 		title: '优惠券优惠券优惠券优惠券',
				// 		price: 15,
				// 	}
				// ],
			}
		},
		computed: {
			...mapGetters({
				getOrderData: 'getOrderData',
				getAddressData: 'getAddressData',
				getOrederState: 'getOrederState',
			})
		},
		onLoad(option) {
			//商品数据
			//let data = JSON.parse(option.data);
			//console.log(data);
			// 获取订单信息
			this.getDefaultAddress();
			if (this.getOrderData.status == 1 || this.getOrderData.status == 3) {
				this.countDown(this.getOrderData.countdown_at);
			}
		},
		onUnload() {
			console.log("卸载页面");
			clearInterval(this.timer);
		},
		methods: {
			...mapMutations({
				setAddressState: 'setAddressState',
				setAddressData: 'setAddressData',
				setReturnOrder: 'setReturnOrder',
				setOrderData:'setOrderData',
				setOrderState:'setOrderState'
			}),
            //联系商家
            concat(){
                uni.makePhoneCall({
                    phoneNumber: this.getOrderData.factory[0].factory_phone //仅为示例
                });
			},
            // 粘贴板
            copye(data) {
                uni.setClipboardData({
                    data: data,
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
			// 确认收货
			confirmReceipt(){
				this.$api.orderFinish({
					order_id:this.getOrderData.order_id
				}).then(res=>{
					console.log(res);
					uni.showToast({
						title: res.data.msg,
						duration: 1000,
						icon: "none"
					});
					if(res.data.errno == 0){
						this.toOrderDetail({
							order_id:this.getOrderData.order_id
						})
					}
				})
			},
			
			toOrderDetail(item){
				this.$api.orderDetail({order_id:item.order_id}).then(res=>{
					if(res.data.errno == 0){
						console.log(res);
						let data = res.data.data;
						// 设置vuex的收货地址信息
						this.setAddressData({
							address:data.address,
							address_id:"",
							name:data.name,
							phone:data.phone
						})
						this.setOrderData(data);//vuex设置订单信息
						this.setOrderState(data.status);//vuex设置订单状态
					}else{
						
					}
				})
			},
			
			// 倒计时
			countDown(time) {
				let startTime = time * 1000; //后端给的时间
				let nowTime = new Date().getTime(); //现在的时间
				let spareTime = (startTime - nowTime) / 1000;
				this.timer = null; //定时器
				if (startTime <= nowTime) {
					this.orderState = false;
					return
				}
				this.startTimer(spareTime);
			},
			startTimer(spareTime) {
				if (this.timer != null) this.timer = null;
				this.timer = setInterval(() => {
					spareTime--
					if (spareTime <= 0) {
						clearInterval(this.timer);
					}
					this.formatTime(spareTime)
				}, 1000)
			},
			formatTime(num) {
				let d = parseInt(num / (3600*24));
				let s = num - 3600*24*d;
				let h = parseInt(s/3600);
				s = s - 3600*h;
				let m = parseInt(s/60);
				s = s - 60*m;
				this.day = d ;
				this.hour = h ;
				this.minute = m;
				this.second = parseInt(s);
				if (this.hour == 0 && this.minute == 0&& this.day == 0 &&this.second == 0) {
					this.orderState = false;
				}
			},
			// 延长收货
			extendedReceipt() {
				this.$api.orderExtend({
					order_id:this.getOrderData.order_id
				}).then(res=>{
					uni.showToast({
						title: res.data.msg,
						duration: 1000,
						icon: "none"
					});
					if(res.data.errno == 0){
						this.getOrderData.is_extend = 2;
						clearInterval(this.timer);
						this.countDown(res.data.data.countdown_at);
						console.log(res)
					}
				})
			},
			// 去退款页面
			toRefund() {
				this.setReturnOrder({
					order_id: this.getOrderData.order_id,
					goods: this.getOrderData.factory[0].goods
				})
				uni.navigateTo({
					url: "/pages/order/refundReturn"
				})
			},
			// 打开是否确认取消订单弹窗
			isCancel() {
				this.$refs["remaks"].open(); //
			},
			// 关闭弹窗
			close(name) {
				this.$refs[name].close();
			},
			// 取消订单
			cancelOrder() {
				this.$refs['remaks'].close();
				uni.showLoading({
					title: '请稍后'
				})
				this.$api.orderCancel({
					order_id: this.getOrderData.order_id
				}).then(res => {
					if (res.data.errno == 0) {
						uni.hideLoading();
						uni.showToast({
							title: '订单取消成功',
							duration: 1000,
							icon: "none"
						});
						setTimeout(res => {
							uni.switchTab({
								url: "/pages/order/order"
							})
						}, 1000)
					}
				})

			},
			// 获取默认收货地址
			getDefaultAddress() {
				// 判断是否是立即下单页面 0 标识立即下单页面，需要去调用默认收货地址接口获取数据
				if (this.getOrederState != 0) {
					return
				}
				this.$api.addressConfirm().then(res => {
					if (res.data.errno == 0) {
					    console.log(res);
						this.setAddressData(res.data.data)
					}else {
                        this.setAddressData({})
					}
				})
			},
			//显示优惠券面板
			// toggleMask(type) {
			// 	let timer = type === 'show' ? 10 : 300;
			// 	let state = type === 'show' ? 1 : 0;
			// 	this.maskState = 2;
			// 	setTimeout(() => {
			// 		this.maskState = state;
			// 	}, timer)
			// },
			numberChange(data) {
				this.number = data.number;
			},
			changePayType(type) {
				this.payType = type;
			},
			// 生成订单
			createOrder() {
				console.log(this.getOrderData);
				let data = this.getOrderData;
				let data1 = [];
				data.factory.map((item, index) => {
					item.goods.map((v, i) => {
						data1.push({
							goods_id: v.goods_id,
							num: v.num,
							standard_id: v.standard_id
						})
					})
				})
				this.$api.orderCreate({
					address_id: this.getAddressData.address_id,
					commodity: data1
				}).then(res => {
					if (res.data.errno == 0) {
						console.log(res)
						let data = res.data.data
						this.payOrder(data);
					}
				})
			},
			// 订单支付
			payOrder(item) {
				let code = "";
				let data = {};
				// 判断是pay_number 还是order_id
				if (this.getOrederState == 0) {
					data = {
						pay_number: item.pay_number,
						js_code: "",
					}
				} else {
					data = {
						order_id: this.getOrderData.order_id,
						js_code: "",
					}
				}
				uni.login({
					provider: 'weixin',
					success: (loginRes) => {
						console.log(loginRes);
						if (loginRes.errMsg == "login:ok") {
							data.js_code = loginRes.code;
							this.$api.orderPay(data).then(res => {
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
			submit() {
				this.createOrder();
				// uni.redirectTo({
				// 	url: '/pages/index/paySuccess/paySuccess'
				// })
			},
			stopPrevent() {},
			// 跳转店铺主页
			toStoreHome() {
				console.log(this.getOrderData);
				uni.setStorageSync('factory_id', this.getOrderData.factory[0].factory_id)
				uni.navigateTo({
					url: "/pages/index/storeHome/storeHome"
				})
			},
			// 跳转地址选择列表
			toAddress() {
				if (this.getOrederState != 0) {
					return
				}
				this.setAddressState(1);
				uni.navigateTo({
					url: "/pages/mine/address/address"
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 100upx;
	}

	.waitPayment {
		width: 100%;
		height: 164rpx;
		display: flex;
		align-items: center;
		background: #FFFFFF;
		padding: 0 44rpx;
		margin-top: 16rpx;

		.w-desc {
			font-size: 32rpx;
			color: rgba(34, 34, 34, 1);
		}

		.w-time {
			font-size: 28rpx;
			color: rgba(34, 34, 34, 1);
			margin-top: 16rpx;
		}
	}

	.address-section {
		padding: 30upx 0;
		background: #fff;
		position: relative;
		margin-top: 16rpx;

		.order-content {
			display: flex;
			align-items: center;
			padding: 0 32rpx;
			justify-content: space-between;

			image {
				width: 32rpx;
				height: 32rpx;
			}
		}

		.icon-shouhuodizhi {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90upx;
			color: #888;
			font-size: 44upx;
		}

		.cen {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 28upx;
			color: $font-color-dark;
		}

		.name {
			font-size: 34upx;
			margin-right: 24upx;
		}

		.address {
			margin-top: 16upx;
			margin-right: 20upx;
			color: $font-color-light;
			width: 520rpx;
		}

		.icon-you {
			font-size: 32upx;
			color: $font-color-light;
			margin-right: 30upx;
		}

		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 5upx;
		}
	}

	.goods-section {
		margin-top: 16upx;
		background: #fff;
		padding-bottom: 1px;

		.g-header {
			display: flex;
			align-items: center;
			height: 84upx;
			padding: 0 30upx;
			position: relative;
			justify-content: space-between;

			.g-img {
				display: flex;
				align-items: center;
				.logo {
					display: block;
					width: 50upx;
					height: 50upx;
					border-radius: 100px;
				}

				.name {
					font-size: 30upx;
					color: $font-color-base;
					margin-left: 24upx;
				}
			}

			.g-slec {
				width: 32rpx;
				height: 32rpx;
			}

			&.g-header:after {
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

		.g-item {
			display: flex;
			margin: 20upx 30upx;

			image {
				flex-shrink: 0;
				display: block;
				width: 140upx;
				height: 140upx;
				border-radius: 4upx;
			}

			.right {
				flex: 1;
				padding-left: 24upx;
				overflow: hidden;
			}

			.title {
				font-size: 30upx;
				color: $font-color-dark;
			}

			.spec {
				font-size: 26upx;
				color: $font-color-light;
			}

			.price-box {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 32upx;
				color: $font-color-dark;
				padding-top: 10upx;

				.price {
					margin-bottom: 4upx;
				}

				.number {
					font-size: 26upx;
					color: $font-color-base;
					margin-left: 20upx;
				}
			}

			.step-box {
				position: relative;
			}
		}

		.total-freight {
			width: 100%;
			padding: 0 30rpx;

			.t-freight {
				display: flex;
				justify-content: space-between;
				position: relative;
				padding: 20rpx 0;

				&.t-freight:after {
					position: absolute;
					z-index: 3;
					left: 0;
					right: 0;
					height: 0;
					content: '';
					-webkit-transform: scaleY(0.5);
					transform: scaleY(0.5);
					border-bottom: 1px solid #E4E7ED;
					top: 0;
				}
			}
		}
	}

	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}

	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 40upx;
		line-height: 70upx;
		position: relative;

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		.cell-icon {
			height: 32upx;
			width: 32upx;
			font-size: 22upx;
			color: #fff;
			text-align: center;
			line-height: 32upx;
			background: #f85e52;
			border-radius: 4upx;
			margin-right: 12upx;

			&.hb {
				background: #ffaa0e;
			}

			&.lpk {
				background: #3ab54a;
			}

		}

		.cell-more {
			align-self: center;
			font-size: 24upx;
			color: $font-color-light;
			margin-left: 8upx;
			margin-right: -10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: 26upx;
			color: $font-color-light;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: 26upx;
			color: $font-color-dark;

			&.disabled {
				color: $font-color-light;
			}

			&.active {
				color: $base-color;
			}

			&.red {
				color: $base-color;
			}
		}

		&.desc-cell {
			.cell-tit {
				max-width: 90upx;
			}
		}

		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
		}
	}

	/* 支付列表 */
	.pay-list {
		padding-left: 40upx;
		margin-top: 16upx;
		background: #fff;

		.pay-item {
			display: flex;
			align-items: center;
			padding-right: 20upx;
			line-height: 1;
			height: 110upx;
			position: relative;
		}

		.icon-weixinzhifu {
			width: 80upx;
			font-size: 40upx;
			color: #6BCC03;
		}

		.icon-alipay {
			width: 80upx;
			font-size: 40upx;
			color: #06B4FD;
		}

		.icon-xuanzhong2 {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 60upx;
			height: 60upx;
			font-size: 40upx;
			color: $base-color;
		}

		.tit {
			font-size: 32upx;
			color: $font-color-dark;
			flex: 1;
		}
	}

	.oreder-info {
		width: 100%;
		background: #FFFFFF;
		margin-top: 16rpx;
		padding: 1rpx 32rpx 32rpx 32rpx;
		margin-bottom: 110rpx;

		.i-pubpadding {
			margin-top: 32rpx;
		}

		.i-item {
			display: flex;
			justify-content: space-between;
			font-size: 28rpx;

			.i-title {
				color: rgba(34, 34, 34, 1);
			}

			.i-desc {
				color: #999999;
			}
		}

		.i-title {
			font-size: 30rpx;
			color: rgba(34, 34, 34, 1);
		}

	}

	.footer {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		display: flex;
		align-items: center;
		width: 100%;
		height: 90upx;
		justify-content: space-between;
		font-size: 30upx;
		background-color: #fff;
		z-index: 998;
		color: $font-color-base;
		box-shadow: 0 -1px 5px rgba(0, 0, 0, .1);

		.price-content {
			padding-left: 30upx;
		}

		.price-tip {
			color: $base-color;
			margin-left: 8upx;
		}

		.price {
			font-size: 36upx;
			color: $base-color;
		}

		.submit {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 280upx;
			height: 100%;
			color: #fff;
			font-size: 32upx;
			background-color: $base-color;
		}
	}

	/* 优惠券面板 */
	.mask {
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 9995;
		transition: .3s;

		.mask-content {
			width: 100%;
			min-height: 30vh;
			max-height: 70vh;
			background: #f3f3f3;
			transform: translateY(100%);
			transition: .3s;
			overflow-y: scroll;
		}

		&.none {
			display: none;
		}

		&.show {
			background: rgba(0, 0, 0, .4);

			.mask-content {
				transform: translateY(0);
			}
		}
	}

	/* 优惠券列表 */
	.coupon-item {
		display: flex;
		flex-direction: column;
		margin: 20upx 24upx;
		background: #fff;

		.con {
			display: flex;
			align-items: center;
			position: relative;
			height: 120upx;
			padding: 0 30upx;

			&:after {
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 0;
				border-bottom: 1px dashed #f3f3f3;
				transform: scaleY(50%);
			}
		}

		.left {
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			overflow: hidden;
			height: 100upx;
		}

		.title {
			font-size: 32upx;
			color: $font-color-dark;
			margin-bottom: 10upx;
		}

		.time {
			font-size: 24upx;
			color: $font-color-light;
		}

		.right {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: $font-color-base;
			height: 100upx;
		}

		.price {
			font-size: 44upx;
			color: $base-color;

			&:before {
				content: '￥';
				font-size: 34upx;
			}
		}

		.tips {
			font-size: 24upx;
			color: $font-color-light;
			line-height: 60upx;
			padding-left: 30upx;
		}

		.circle {
			position: absolute;
			left: -6upx;
			bottom: -10upx;
			z-index: 10;
			width: 20upx;
			height: 20upx;
			background: #f3f3f3;
			border-radius: 100px;

			&.r {
				left: auto;
				right: -6upx;
			}
		}
	}

	// 底部按钮
	.action-btn {
		width: 160upx;
		height: 60upx;
		margin: 0;
		margin-right: 24upx;
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
</style>
