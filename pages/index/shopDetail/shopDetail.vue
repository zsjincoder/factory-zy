<template>
	<view class="container">
		<view class="carousel">
			<swiper indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item" v-for="(item,index) in goodData.album" :key="index">
					<view class="image-wrapper">
						<image :src="item" class="loaded" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="introduce-section">
			<view class="i-padd">
				<view class="title">{{goodData.name}}</view>
				<view v-if="goodData.standards == 1" class="price-box">
					<view style="margin-right: 50rpx;">
						<view style="display: flex;">
							<text class="price">¥{{goodData.max_price}}</text>
						</view>
						<text>{{goodData.start_quantity+goodData.unit}}起购</text>
					</view>
					<view>
						<view style="display: flex;">
							<text class="price">¥{{goodData.price_data.trade_price}}</text>
						</view>
						<text>>={{goodData.price_data.wholesale_quantity+goodData.unit}}</text>
					</view>
				</view>
				<view v-else class="price-box">¥{{goodData.min_price}}~¥{{goodData.max_price}}</view>
				<view class="bot-row">
					<text>销量: {{goodData.sales_volume}}</text>
				</view>
			</view>
			<!-- 分享按钮 -->
			<button v-if="userInfo.token" class="p-share" open-type="share">
				<image class="p-s-img" src="/static/img/strore/share.png"></image>
				<view class="p-s-text">分享</view>
			</button>

			<button v-else class="p-share" @click="shareFn()">
				<image class="p-s-img" src="/static/img/strore/share.png"></image>
				<view class="p-s-text">分享</view>
			</button>
		</view>

		<!--  分享 -->
		<!-- 		<view class="share-section" @click="share">
			<view class="share-icon">
				<text class="yticon icon-xingxing"></text>
				返
			</view>
			<text class="tit">该商品分享可领49减10红包</text>
			<text class="yticon icon-bangzhu1"></text>
			<view class="share-btn">
				立即分享
				<text class="yticon icon-you"></text>
			</view>

		</view> -->

		<view class="c-list">
			<view class="c-row b-b" @click="toggleSpec">
				<text class="tit">购买类型</text>
				<view class="con">
					<view v-if="goodData.standards == 1">
						<text class="selected-text">默认规格</text>
						<!-- 						<text  class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
							{{sItem.name}}
						</text> -->
					</view>
					<view v-else>
						<text class="selected-text" v-if="sleectSpecList.length == 0">请选择规格</text>
						<text v-else class="selected-text" v-for="(sItem, sIndex) in sleectSpecList" :key="sIndex">
							{{sItem.model+'/'+sItem.name+';'}}
						</text>
					</view>

				</view>
				<image src="/static/img/product-details/moer-than.png"></image>
				<!-- <text class="yticon icon-you"></text> -->
			</view>
			<!-- 			<view class="c-row b-b">
				<text class="tit">优惠券</text>
				<text class="con t-r red">领取优惠券</text>
				<text class="yticon icon-you"></text>
			</view>
			<view class="c-row b-b">
				<text class="tit">促销活动</text>
				<view class="con-list">
					<text>新人首单送20元无门槛代金券</text>
					<text>订单满50减10</text>
					<text>订单满100减30</text>
					<text>单笔购买满两件免邮费</text>
				</view>
			</view>
			<view class="c-row b-b">
				<text class="tit">服务</text>
				<view class="bz-list con">
					<text>7天无理由退换货 ·</text>
					<text>假一赔十 ·</text>
				</view>
			</view> -->
		</view>
		<!-- 运费 -->
		<view class="freight">
			<view>运费</view>
			<view style="margin-left: 20upx;">¥{{goodData.freight_price}}(购满{{goodData.start_quantity}}件以上包邮)</view>
		</view>
		<!-- 店铺 -->
		<view class="stroe">
			<image :src="goodData.factory_cover_img"></image>
			<view class="stroe-name">{{goodData.factory_name}}</view>
			<view class="s-button" @click="toStoreHome">进入店铺</view>
		</view>
		<!-- 评价 -->
		<!-- 		<view class="eva-section">
			<view class="e-header">
				<text class="tit">评价</text>
				<text>(86)</text>
				<text class="tip">好评率 100%</text>
				<text class="yticon icon-you"></text>
			</view>
			<view class="eva-box">
				<image class="portrait" src="http://img3.imgtn.bdimg.com/it/u=1150341365,1327279810&fm=26&gp=0.jpg" mode="aspectFill"></image>
				<view class="right">
					<text class="name">Leo yo</text>
					<text class="con">商品收到了，79元两件，质量不错，试了一下有点瘦，但是加个外罩很漂亮，我很喜欢</text>
					<view class="bot">
						<text class="attr">购买类型：XL 红色</text>
						<text class="time">2019-04-01 19:21</text>
					</view>
				</view>
			</view>
		</view> -->

		<view class="detail-desc">
			<view class="d-header">
				<text>图文详情</text>
			</view>
			<view style="padding: 0 32rpx;">
				<rich-text :nodes="goodData.desc"></rich-text>
			</view>
		</view>

		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<image src="/static/img/product-details/p-index.png"></image>
				<text>首页</text>
			</navigator>
			<view class="p-b-btn add-postion" @click="toShopCar">
				<image src="/static/img/tabbar/shop-car.png"></image>
				<text>购物车</text>
				<view class="a-num" v-if="getshopNum > 0">{{getshopNum>99?'N':getshopNum}}</view>
			</view>
			<!-- 			<view class="p-b-btn" :class="{active: favorite}" @click="toFavorite">
				<text class="yticon icon-shoucang"></text>
				<text>收藏</text>url="/pages/shopCart/shopCart"open-type="switchTab"
			</view> -->

			<view class="action-btn-group">
				<button type="primary" class=" action-btn no-border buy-now-btn" @click="toConfirmOrder">立即购买</button>
				<button type="primary" class=" action-btn no-border add-cart-btn" @click="addCart">加入购物车</button>
			</view>
		</view>


		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @tap.stop="stopPrevent">
				<view class="a-t">
					<image :src="goodData.album[0]"></image>
					<view class="right">
						<text class="price">{{goodData.name}}</text>
						<text class="stock" style="margin-top: 26rpx;">¥{{goodData.min_price}}~¥{{goodData.max_price}}</text>
					</view>
				</view>
				<view v-if="goodData.standards == 2">
					<view style="width: 100%;height: 4rpx;background: #EEEEEE;margin-top: 48rpx;"></view>
					<!-- 批量购买tab -->
					<scroll-view class="scroll-view_H" :scroll-x="true" :scroll-left="scrollLeft" @touchmove.stop.prevent="stopPrevent">
						<view style="white-space:nowrap;display: flex;">
							<view v-for="(item,index) in specList" :key="index" class="attr-list" @click="clickTap(index)">
								<text :style="{color:selected == index ?'#ED494CFF':''}">{{item.title}}</text>
								<view :style="{display:selected == index?'block':'none'}" class="box-line"></view>
								<view v-if="item.buyNum != 0 " class="buy-num">{{item.buyNum > 99?'N':item.buyNum }}</view>
								<!-- 					<view class="item-list">
								<text v-for="(childItem, childIndex) in specChildList" v-if="childItem.pid === item.id" :key="childIndex" class="tit"
								 :class="{selected: childItem.selected}" @click="selectSpec(childIndex, childItem.pid)">
									{{childItem.name}}
								</text>
							</view> -->
							</view>
						</view>
					</scroll-view>
					<view style="width: 100%;height: 4rpx;background: #EEEEEE;"></view>
					<!-- 商品列表 -->
					<view>
						<swiper class="swiper" :duration="duration" :current="selected" @change="changeTab">
							<swiper-item v-for="(item,index) in specList" :key="index">
								<scroll-view scroll-y style="height:100%;">
									<view class="swiper-item" v-for="(val,i) in item.content" :key="i">
										<view class="s-item">
											<text style="line-height:70rpx;">{{val.name}}</text>
											<!-- <yp-number-box @change="change" :value="val.num" :index="i" /> -->
											<uni-number-box :max="val.number" :value="val.num" @change="change" :index1="index" :index2="i"></uni-number-box>
										</view>
										<view class="s-item s-style">
											<view><text :style="{textDecoration:val.num >= val.wholesale_quantity?'line-through':'none'}">¥{{val.retail_price}}</text><text
												 v-if="val.num>=val.wholesale_quantity" style="color: red;margin-left: 10rpx;">¥{{val.trade_price}}</text></view>
											<text>库存：{{val.number}}</text>
										</view>
									</view>
								</scroll-view>
							</swiper-item>
							<!-- 						<swiper-item>
								<view class="swiper-item uni-bg-green">B</view>
							</swiper-item>
							<swiper-item>
								<view class="swiper-item uni-bg-blue">C</view>
							</swiper-item> -->
						</swiper>
					</view>

				</view>
				<view v-else>
					<view class="swiper">
						<view class="swiper-item">
							<view class="s-item">
								<text style="line-height:70rpx;">{{singleSpecList.name}}</text>
								<!-- <yp-number-box @change="change" :value="val.num" :index="i" /> -->
								<uni-number-box :max="singleSpecList.number" :value="singleSpecList.num" @change="singleChange"></uni-number-box>
							</view>
							<view class="s-item s-style">
								<view><text :style="{textDecoration:singleSpecList.num >= singleSpecList.wholesale_quantity?'line-through':'none'}">¥{{singleSpecList.retail_price}}</text><text
									 v-if="singleSpecList.num>=singleSpecList.wholesale_quantity" style="color: red;margin-left: 10rpx;">¥{{singleSpecList.trade_price}}</text></view>
								<text>库存：{{singleSpecList.number}}</text>
							</view>
						</view>
					</view>
				</view>
				<!-- 合计价格 -->
				<view class="sum-price">共{{sum}}台，合计{{sumPrice}}</view>
				<button :style="{background:isDisabled?'#ED494C':'#CECECE'}" class="btn" @click="complete">完成</button>
			</view>
		</view>
		<!-- 分享 -->
		<!-- 		<share 
			ref="share" 
			:contentHeight="580"
			:shareList="shareList"
		></share> -->
	</view>
</template>

<script>
	// import share from '@/components/share';
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	import {
		mapGetters,
		mapMutations
	} from "vuex"
	export default {
		components: {
			uniNumberBox
		},
		data() {
			return {
				indicatorDots: false,
				isDisabled: false,
				sumPrice: 0, //合计价格
				sum: 0, //合计购买数量
				selected: 0, //选中项
				scrollLeft: 0, //swiper离左边距离
				goodData: {}, //商品详情数据
				specClass: 'none',
				carNum: 0, //加入购物车后的数量
				// specSelected: [],
				favorite: true, //收藏
				shareList: [],
				flagPage1: false, //完成按钮详情页面跳转
				falgPage: 0,
				specList: [], //多规格商品列表
				singleSpecList: {}, //单规格
				sleectSpecList: [], //选中的多规格列表
				userInfo: [], // 用户信息（包含token）
				shareStr: '', // 用户分享码
				id: '' // 商品id
			};
		},
		computed: {
			...mapGetters({
				getshopNum: 'getshopNum'
			})
		},
		onShow() {
			this.userInfo = uni.getStorageSync('user_info')

			// uni.showToast({
			// 	title: '还未登录，请先登录',
			// 	duration: 1000,
			// 	icon: 'none'
			// })
			// setTimeout(res => {
			// 	uni.switchTab({
			// 		url: '/pages/mine/mine'
			// 	})
			// }, 1000)
		},
		async onLoad(options) {
			//接收传值,id里面放的是标题，因为测试数据并没写id 
			this.id = options.id;

			if (this.id) {
				// console.log(id);
				this.getData(this.id);
			}
			// 获取购物车数据
			this.getCartData();

			// 如果是通过分享进入，获取参数并保存
			// console.log(options.s)
			if (options.s) {
				uni.setStorageSync('shareStr', options.s)
			} else {
				uni.setStorageSync('shareStr', '')
			}
			console.log(uni.getStorageSync('shareStr'))
			// this.carNum = this.getshopNum;
			// this.shareList = await this.$api.json('shareList');
		},
		methods: {
			...mapMutations({
				setShopNum: 'setShopNum',
				setOrderData:'setOrderData',
				setOrderState:'setOrderState'
			}),
			// 获取购物车数据
			getCartData() {
				this.$api.carList().then(res => {
					console.log(res)
					if (res.data.errno == 0) {
						console.log(res.data.data.count)
						this.setShopNum(Number(res.data.data.count))
					}else{
						this.setShopNum(0)
					}
				})
			},
			// 规格选择
			selectSpecifications() {
				this.flagPage1 = false;
				this.toggleSpec();
			},
			// 获取商品详情数据
			getData(id) {
				this.$api.goods({
					goods_id: id
				}).then(res => {
					console.log(res);
					if (res.data.errno == 0) {
						this.goodData = res.data.data;
						if (this.goodData.standards == 2) {
							this.specList = res.data.data.price_data;
							this.specList.map((item, index) => {
								item.buyNum = 0;
								item.content.map((val, kay) => {
									val.num = 0;
								})
							})
						} else {
							console.log(res.data.data.price_data);
							this.singleSpecList = res.data.data.price_data;
							this.singleSpecList.retail_price = Number(this.singleSpecList.retail_price);
							this.singleSpecList.trade_price = Number(this.singleSpecList.trade_price);
							this.singleSpecList.num = 0;
						}

					} else {
						console.log("获取失败")
					}
				})
			},
			clickTap(index) {
				this.selected = index;
				this.scrollLeft = (index - 1) * 100;
			},

			// 立即购买接口
			settementCart(data) {
				this.$api.orederSettlement({
					commodity: data
				}).then(res => {
					if (res.data.errno == 0) {
						console.log(res);
						this.setOrderState(0);//将页面订单状态设置为未生成订单
						this.setOrderData(res.data.data); //将订单信息存入vuex中
						uni.navigateTo({
							url: '/pages/index/confirmOrder/confirmOrder'
						})
					}
				})
			},

			// 加入购物车
			complete() {
				let userInfo = uni.getStorageSync('user_info');
				console.log(userInfo);
				if (userInfo.token) {
					if (this.isDisabled == false) {
						return
					}
					// 判断完成按钮是否跳转确认订单页面
					console.log(this.flagPage1);
					if (this.flagPage1 == true) {
						// 跳转立即下单页面
						// 判断是多规格还是单规格
						let data = [];
						if (this.goodData.standards == 1) {
							// 单规格数据
							data.push({
								goods_id: this.singleSpecList.goods_id,
								num: this.singleSpecList.num,
								standard_id: this.singleSpecList.id
							})
						} else {
							// 多规格数据
							this.sleectSpecList.map((item, index) => {
								data.push({
									goods_id: item.goods_id,
									num: item.num,
									standard_id: item.id
								})
							})
						}
						// 调用结算接口
						this.settementCart(data);
					} else {
						let data = {
							goods_id: this.goodData.goods_id,
							params: []
						}
						if (this.goodData.standards == 1) {
							data.params.push({
								standard_id: this.singleSpecList.id,
								number: this.singleSpecList.num
							})
						} else {
							this.sleectSpecList.map((item, index) => {
								data.params.push({
									standard_id: item.id,
									number: item.num
								})
							})
						}
						this.$api.cartAdd(data).then(res => {
							console.log(res);
							if (res.data.errno == 0) {
								this.isDisabled = false;
								uni.showToast({
									title: '已成功加入购物车',
									duration: 1000,
									icon: "none"
								});
								// 加入购物车后清空购物车
								// this.carNum += this.sum;
								// 更新vuex中购物车数量
								// this.setShopNum(this.carNum);
								this.getCartData()
								this.clearCart();
								if (this.falgPage != 1) {
									this.toggleSpec();
								}

							}else if(res.data.errno === 400 || res.data.errno === 4008 || res.data.errno === 4009){
								uni.showToast({
									title: '登录已过时,请重新登录',
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
					}
				}else{
					uni.showToast({
						title: '还未登录',
						duration: 1000,
						icon: 'none'
					})
					
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/mine/mine'
						})
					})
				}
			},
			// 清空购物车
			clearCart() {
				console.log(this.specList);
				this.specList.map((item, index) => {
					item.buyNum = 0;
					item.content.map((val, key) => {
						val.num = 0
					})
				})
				this.sumPrice = 0, //合计价格
					this.sum = 0, //合计购买数量
					this.sleectSpecList = [];
				this.singleSpecList.num = 0;
			},
			//多规格 
			change(e) {
				console.log(e);
				if (e.num == "") {
					e.num = 0
				}
				this.$set(this.specList[e.index1].content[e.index2], "num", Number(e.num));
				let sum = 0;
				this.specList[e.index1].content.map((val, i) => {
					sum += val.num
				})
				this.$set(this.specList[e.index1], "buyNum", sum);
				// 合计台数
				this.totalAmount();
				// 判断按钮状态
				if (this.sum >= this.goodData.start_quantity) {
					this.isDisabled = true;
				} else {
					this.isDisabled = false;
				}
				// 筛选加购的数据
				this.filterData();
			},
			filterData() {
				this.sleectSpecList = [];
				this.specList.map((item, index) => {
					item.content.map((val, key) => {
						if (val.num > 0) {
							let data = val;
							data.model = item.title;
							this.sleectSpecList.push(data);
						}
					})
				})
			},
			// 单规格
			singleChange(e) {
				console.log(e);
				this.singleSpecList.num = Number(e.num);
				console.log(typeof this.singleSpecList.num)
				this.sum = this.singleSpecList.num;
				this.sumPrice = 0;
				if (this.singleSpecList.num >= this.singleSpecList.wholesale_quantity) {
					console.log("我是批发价")
					this.sumPrice = Number(this.sumPrice) + this.singleSpecList.num * this.singleSpecList.trade_price.toFixed(2)
				} else {
					this.sumPrice = Number(this.sumPrice) + this.singleSpecList.num * this.singleSpecList.retail_price.toFixed(2)
				}
				this.sumPrice = this.sumPrice.toFixed(2);
				// 判断按钮状态
				if (this.sum >= this.goodData.start_quantity) {
					this.isDisabled = true;
				} else {
					this.isDisabled = false;
				}
			},
			toShopCart() {
				uni.switchTab({
					url: "/pages/shopCart/shopCart"
				})
			},
			// 加入购物车
			addCart() {
				if (this.userInfo.token) {
					this.flagPage1 = false;
					// if (this.sleectSpecList.length > 0) {
					if (this.isDisabled == false) {
						uni.showToast({
							title: '商品起购数量为' + this.goodData.start_quantity,
							duration: 1000,
							icon: "none"
						});
						this.toggleSpec();
					} else {
						this.falgPage = 1;
						this.complete()
					}
					// } else {
					// 	this.toggleSpec();
					// }
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
			// 跳转到购物车页面
			toShopCar() {
				// 判断是否登录，如果没有登录，去到个人中心让用户登录
				if (this.userInfo.token) {
					uni.switchTab({
						url: '/pages/shopCart/shopCart'
					})
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
			// 跳转店铺主页
			toStoreHome() {
				console.log(this.goodData)
				uni.setStorageSync('factory_id', this.goodData.factory_id)
				uni.navigateTo({
					url: "/pages/index/storeHome/storeHome"
				})
			},
			// 跳转确认订单页面
			toConfirmOrder() {
				// 判断是否登录
				if (this.userInfo.token) {
					// 判断
					// if (this.sleectSpecList.length > 0 || this.) {
					this.flagPage1 = true;
					// 判断数量是否大于或者等于起购数量
					if (this.sum >= this.goodData.start_quantity) {
						console.log("我是结算结算结算！！！！！")
						 // 判断是多规格还是单规格
						 let data = [];
						 if (this.goodData.standards == 1) {
						 	// 单规格数据
						 	data.push({
						 		goods_id: this.singleSpecList.goods_id,
						 		num: this.singleSpecList.num,
						 		standard_id: this.singleSpecList.id
						 	})
						 } else {
						 	// 多规格数据
						 	this.sleectSpecList.map((item, index) => {
						 		data.push({
						 			goods_id: item.goods_id,
						 			num: item.num,
						 			standard_id: item.id
						 		})
						 	})
						 }
						 // 调用结算接口
						this.settementCart(data);
					} else {
						uni.showToast({
							title: '商品起购数量为' + this.goodData.start_quantity,
							duration: 1000,
							icon: "none"
						});
						this.toggleSpec();
					}
					// } else {
					// 	this.toggleSpec();
					// 	// 标识完成按钮跳转立即购买页面
					// 	// this.falgPage = 1;
					// }
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
			// 合计数量和价格
			totalAmount() {
				this.sum = 0;
				this.sumPrice = 0;
				this.specList.map((item, inde) => {
					this.sum += item.buyNum;
					item.content.map((val, i) => {
						console.log(val.wholesale_quantity);
						if (val.num >= val.wholesale_quantity) {
							this.sumPrice += val.num * Number(val.trade_price).toFixed(2)
						} else {
							this.sumPrice += val.num * Number(val.retail_price).toFixed(2)
						}
					})
				})
				this.sumPrice = this.sumPrice.toFixed(2)
			},
			changeTab(e) {
				this.selected = e.detail.current;
				this.scrollLeft = (e.detail.current - 1) * 100;
			},
			//规格弹窗开关
			toggleSpec() {
				this.falgPage = 0;
				if (this.specClass === 'show') {
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				} else if (this.specClass === 'none') {
					this.specClass = 'show';
				}
			},
			//分享
			share() {
				this.$refs.share.toggleMask();
			},
			//收藏
			toFavorite() {
				this.favorite = !this.favorite;
			},
			stopPrevent() {},

			// 分享按钮点击
			shareFn() {
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
				return false;
			},
			// 获取分享码
			getShareCode() {
				this.$api.shareCode().then(res => {
					if (res.errno == 0) {
						this.shareStr = res.data.data
					}
				})
			}
		},
		onShareAppMessage(options) {
			let that = this;
			let shareObj = {
				title: that.goodData.name,
				path: '/pages/index/shopDetail/shopDetail?s=' + that.shareStr + '&id=' + this.id,
			}

			if (options.from == 'button') {
				shareObj.path = '/pages/index/shopDetail/shopDetail?s=' + that.shareStr + '&id=' + this.id;
			}
			return shareObj;

		},
	}
</script>

<style lang='scss'>
	page {
		background: $page-color-base;
		padding-bottom: 160upx;
	}

	/* 新增定位*/
	.add-postion {
		position: relative;

		.a-num {
			width: 32rpx;
			height: 32rpx;
			border-radius: 50%;
			background: #ED4A4C;
			position: absolute;
			top: -8rpx;
			right: 8rpx;
			color: #FFFFFF;
			font-size: 18rpx;
			text-align: center;
			line-height: 32rpx;
		}
	}

	.icon-you {
		font-size: $font-base + 2upx;
		color: #888;
	}

	.carousel {
		height: 722upx;
		position: relative;

		swiper {
			height: 100%;
		}

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

	}

	/* 标题简介 */
	.introduce-section {
		background: #fff;
		position: relative;

		.i-padd {
			padding: 20upx 30upx;
		}

		.title {
			font-size: 32upx;
			color: $font-color-dark;
			/* height: 50upx; */
			/* line-height: 50upx; */
			width: 544rpx;
		}

		.price-box {
			display: flex;
			align-items: baseline;
			/* 			height: 64upx; */
			padding: 10upx 0;
			font-size: 26upx;
			color: $uni-color-primary;
			/* 		position: relative; */
			margin-top: 40rpx;
		}

		.p-share {
			position: absolute;
			display: flex;
			align-items: center;
			top: 40rpx;
			right: 0;
			height: 60rpx;
			width: 140rpx;
			background: rgba(238, 238, 238, 1);
			border-radius: 36rpx 0px 0px 36rpx;
			padding: 0;

			.p-s-img {
				width: 32rpx;
				height: 32rpx;
				margin-left: 24rpx;
			}

			.p-s-text {
				font-size: 24rpx;
				color: rgba(153, 153, 153, 1);
				margin-left: 10rpx;
			}
		}

		.price {
			font-size: $font-lg + 2upx;
		}

		.m-price {
			margin: 0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}

		.coupon-tip {
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx);
		}

		.bot-row {
			display: flex;
			align-items: center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;

			text {
				flex: 1;
			}
		}
	}

	/* 分享 */
	.share-section {
		display: flex;
		align-items: center;
		color: $font-color-base;
		background: linear-gradient(left, #fdf5f6, #fbebf6);
		padding: 12upx 30upx;

		.share-icon {
			display: flex;
			align-items: center;
			width: 70upx;
			height: 30upx;
			line-height: 1;
			border: 1px solid $uni-color-primary;
			border-radius: 4upx;
			position: relative;
			overflow: hidden;
			font-size: 22upx;
			color: $uni-color-primary;

			&:after {
				content: '';
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
				left: -20upx;
				top: -12upx;
				position: absolute;
				background: $uni-color-primary;
			}
		}

		.icon-xingxing {
			position: relative;
			z-index: 1;
			font-size: 24upx;
			margin-left: 2upx;
			margin-right: 10upx;
			color: #fff;
			line-height: 1;
		}

		.tit {
			font-size: $font-base;
			margin-left: 10upx;
		}

		.icon-bangzhu1 {
			padding: 10upx;
			font-size: 30upx;
			line-height: 1;
		}

		.share-btn {
			flex: 1;
			text-align: right;
			font-size: $font-sm;
			color: $uni-color-primary;
		}

		.icon-you {
			font-size: $font-sm;
			margin-left: 4upx;
			color: $uni-color-primary;
		}
	}

	.c-list {
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;

		.c-row {
			display: flex;
			align-items: center;
			padding: 20upx 30upx;
			position: relative;

			image {
				width: 64upx;
				height: 64upx;
			}
		}

		.tit {
			width: 140upx;
		}

		.con {
			flex: 1;
			color: $font-color-dark;

			.selected-text {
				margin-right: 10upx;
			}
		}

		.bz-list {
			height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;

			text {
				display: inline-block;
				margin-right: 30upx;
			}
		}

		.con-list {
			flex: 1;
			display: flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}

		.red {
			color: $uni-color-primary;
		}
	}

	/* 评价 */
	.eva-section {
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;

		.e-header {
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.tit {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
			}

			.tip {
				flex: 1;
				text-align: right;
			}

			.icon-you {
				margin-left: 10upx;
			}
		}
	}

	.eva-box {
		display: flex;
		padding: 20upx 0;

		.portrait {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26upx;

			.con {
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}

			.bot {
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color: $font-color-light;
			}
		}
	}

	/*  详情 */
	.detail-desc {
		background: #fff;
		margin-top: 16upx;
		padding-bottom: 150rpx;

		.d-header {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;

			text {
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}

			&:after {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc;
			}
		}
	}

	/* 规格选择弹窗 */
	.attr-content {
		padding: 10upx 30upx;

		.a-t {
			display: flex;

			image {
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;
				;
			}

			.right {
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;

				.price {
					font-size: $font-lg;
					/* color: $uni-color-primary; */
					margin-bottom: 10upx;
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

				.stock {
					font-size: 32rpx;
					color: rgba(237, 73, 76, 1);
				}

				.selected-text {
					margin-right: 10upx;
				}
			}
		}

		.swiper {
			height: 548rpx;
			width: 100%;

			.swiper-item {
				height: 170rpx;
				display: flex;
				border-bottom: 2rpx #EEEEEE solid;
				flex-direction: column;
				justify-content: center;

				.s-style {
					margin-top: 16rpx;
					font-size: 22rpx;
					color: rgba(153, 153, 153, 1);
				}

				.s-item {
					display: flex;
					justify-content: space-between;
				}
			}
		}

		.scroll-view_H {
			width: 100%;
			margin-top: 4rpx;

			.attr-list {
				width: 100rpx;
				position: relative;
				font-size: $font-base + 2upx;
				color: $font-color-base;
				text-align: center;
				padding-top: 30upx;
				padding: 10upx;
				margin: 0 20rpx;

				.buy-num {
					width: 32rpx;
					height: 32rpx;
					border-radius: 50%;
					background: #ED4A4C;
					position: absolute;
					top: 0;
					right: -15rpx;
					color: #FFFFFF;
					font-size: 18rpx;
					text-align: center;
					line-height: 32rpx;
				}

				.box-line {
					width: 100%;
					margin-top: 30rpx;
					background: #ED4A4CFF;
					height: 4rpx;
					border-radius: 10rpx;
				}
			}
		}

		.item-list {
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;

			text {
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;
			}

			.selected {
				background: #fbebee;
				color: $uni-color-primary;
			}
		}
	}

	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;
			}
		}

		&.hide {
			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}

		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;
			padding-bottom: 48rpx;

			.sum-price {
				width: 100%;
				text-align: right;
			}

			.btn {
				height: 88rpx;
				line-height: 88rpx;
				/* border-radius: 100upx; */
				background: #ED494C;
				font-size: $uni-font-size-lg;
				color: #fff;
				margin: 30upx auto 20upx;
			}
		}

		@keyframes showPopup {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes hidePopup {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}

			100% {
				transform: translateY(0%);
			}
		}

		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}

			100% {
				transform: translateY(120%);
			}
		}
	}

	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		left: 30upx;
		bottom: 48rpx;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 690upx;
		height: 100upx;
		background: rgba(255, 255, 255, .9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);
		border-radius: 16upx;

		.p-b-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			width: 96upx;
			height: 80upx;

			image {
				width: 32upx;
				height: 32upx;
			}

			.yticon {
				font-size: 40upx;
				line-height: 48upx;
				color: $font-color-light;
			}

			&.active,
			&.active .yticon {
				color: $uni-color-primary;
			}

			.icon-fenxiang2 {
				font-size: 42upx;
				transform: translateY(-2upx);
			}

			.icon-shoucang {
				font-size: 46upx;
			}
		}

		.action-btn-group {
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30, #fa436a, #F56C6C);
			margin-left: 20upx;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255, 255, 255, .5);
			}

			.action-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: $font-base;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}

	.stroe {
		width: 100%;
		height: 144upx;
		background: #FFFFFF;
		margin-top: 16upx;
		display: flex;
		align-items: center;
		padding: 0 32upx;

		image {
			width: 80upx;
			height: 80upx;
			border-radius: 50%;
		}

		.stroe-name {
			font-size: 32upx;
			color: rgba(34, 34, 34, 1);
			margin-left: 16upx;
		}

		.s-button {
			width: 160upx;
			height: 64upx;
			background: rgba(237, 73, 76, 1);
			color: #FFFFFF;
			border-radius: 36upx;
			border: 2upx solid rgba(237, 73, 76, 1);
			font-size: 24upx;
			line-height: 64upx;
			text-align: center;
			margin-left: 140upx;
		}
	}

	.freight {
		width: 100%;
		height: 104upx;
		display: flex;
		align-items: center;
		margin-top: 16upx;
		padding: 0 32upx;
		background: #FFFFFF;
	}
</style>
