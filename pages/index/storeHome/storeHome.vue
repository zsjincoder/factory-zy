<template>
	<view>
		<!-- 头部 -->
		<view class="s-head">
			<!-- 遮罩层 -->
			<view class="s-head-cover"></view>
			<!-- 店铺信息 -->
			<view class="s-info">
				<image :src="factoryInfo.factory_cover_img"></image>
				<view class="s-text">
					<view class="s-text1">{{factoryInfo.factory_nickname}}</view>
					<view class="s-text2">总销量：{{factoryInfo.factory_sales_volume}}万</view>
				</view>
				<view class="s-select">
					<image src="/static/img/strore/right.png"></image>
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

			<!-- <view class="share-button">
				<image class="s-img" src="/static/img/strore/share.png"></image>
				<view class="s-name">分享</view>
			</view> -->
			<!-- 背景图 -->
			<image :src="factoryInfo.factory_back_img"></image>
			<!-- 搜索框 -->
			<view class="s-search" @click="toStoreSearch">
				<view class="search-box">
					<view class="search-icon">
						<image src="/static/img/index/search-icon.png"></image>
					</view>
					<view class="search-input">搜索商品</view>
					<!-- <input class="search-input" type="text" :value="searchWords" placeholder="搜索商品" placeholder-style="font-size: 28rpx; color: #BBBBBB;" /> -->
				</view>
			</view>
		</view>
		<!-- tab菜单 -->
		<view>
			<scroll-view id="tab" :style="{position:isFixd?'fixed':'',top:0,zIndex:isFixd?9999:''}" scroll-x class="bg-white nav"
			 scroll-with-animation :scroll-left="scrollLeft">
				<view class="cu-item" :class="TabCur==index?'current':''" v-for="(item,index) in factoryInfo.type_data" :key="index"
				 @tap="tabSelect($event,item.type_id)" :data-id="index">
					<view class="tab-text" :style="TabCur==index?'color: #ED494CFF;':''">{{item.name}}</view>
					<view class="tab-bottom-line-box">
						<view class="tab-bottom-line" :style="'background-color: '+themeColor+';'"></view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 排序栏 -->
		<view style="margin-top: 20rpx;">
			<scroll-view id="tab" scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft">
				<view class="cu-item" style="height: 104rpx;line-height: 104rpx;" v-for="(item,index) in list1" :key="index"
				 :data-id="index">
					<view class="tab-text1" @click="toChange(index)">
						<view :style="{color:cur == index?'#000':'#999'}">{{item.name}}</view>
						<view v-if="item.isShow" :class="['t-short', cur === index && item.isTop ? 'top' : '', cur === index && item.isBottom ? 'bottom' : '']"></view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 商品列表 -->
		<view class="list-box">
			<view class="s-list">
				<view class="s-list-itme" v-for="(item,index) in goodsListData" :key="index" @click="toDetail(item.goods_id)">
					<image :src="item.goods_cover_img"></image>
					<view class="s-desc">{{item.goods_name}}</view>
					<view class="s-data">
						<view class="s-price">¥{{item.goods_coverprice}}</view>
						<view class="s-sales">已售{{item.goods_sales_volume}}{{item.goods_unit}}</view>
					</view>
				</view>
			</view>
			<!-- 加载更多 -->
			<uni-load-more :status="loadingType"></uni-load-more>
		</view>

		<!-- 购物车 -->
		<view class="shop-car" @click="toCar()">
			<image src="/static/img/strore/shop-car.png"></image>
			<view v-if="shopCarCount !== '' && getshopNum > 0" class="shop-num">{{getshopNum>99?'N':getshopNum}}</view>
		</view>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uLi-load-more/uLi-load-more.vue';
	import {
		mapGetters,
		mapMutations
	} from "vuex"
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				list: [],
				list1: [{
					name: "综合",
					isTop: true,
					isBottom: false,
					isShow: false
				}, {
					name: "新品",
					isTop: false,
					isBottom: true,
					isShow: false
				}, {
					name: "销量",
					isTop: false,
					isBottom: true,
					isShow: true
				}, {
					name: "价格",
					isTop: false,
					isBottom: true,
					isShow: true
				}],
				scrollLeft: 0,
				sortScrollLeft: 0,
				TabCur: 0,
				isFixd: false,
				themeColor: '#ED494CFF',
				cur: 0,
				factory_id: '',
				factoryInfo: [],
				sort_num: 1, // 排序编号
				type_id: '', // type_id
				pageIndex: 1, // 页码
				loadingType: 'more',
				goodsList: [], // 商品列表
				next_page: '',
				// shopCarCount:'',
				userInfo: []
			}
		},
		computed: {
			goodsListData() {
				return this.goodsList
			},
			...mapGetters({
				getshopNum: 'getshopNum'
			})
		},
		onLoad(options) {
			this.factory_id = uni.getStorageSync('factory_id')
			// console.log(this.factory_id)
			console.log(options)
			if (options.s) {
				uni.setStorageSync('shareStr', options.s)
			} else {
				uni.setStorageSync('shareStr', '')
			}
			if (options.factory_id) {
				this.factory_id = options.factory_id
			}
			this.getFactoryInfo()

			this.userInfo = uni.getStorageSync('user_info')
			this.getShopNum()
		},
		onReachBottom() {
			if (this.loadingType === 'noMore') {
				return
			} else {
				this.getGoods()
			}
		},
		methods: {
			...mapMutations({
				setShopNum: 'setShopNum',
			}),
			toStoreSearch() {
				uni.navigateTo({
					url: '/pages/index/storeHome/storeSearch'
				})
			},
			getFactoryInfo() {
				this.$api.factoryInfo({
					factory_id: this.factory_id
				}).then(res => {
					console.log(res)
					if (res.data.errno === 0) {
						this.factoryInfo = res.data.data
						this.type_id = res.data.data.type_data[0].type_id
						console.log(this.type_id)
						uni.setNavigationBarTitle({
							title: this.factoryInfo.factory_nickname
						})

						this.getGoods()
					}
				})
			},
			// 获取type_id
			tabSelect(e, type_id) {
				console.log(e);
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;

				// 重新获取对应的数据，且默认为综合
				this.type_id = type_id
				this.sort_num = 1
				this.pageIndex = 1
				this.getGoods()
			},
			// 获得排序编号
			toChange(index) {
				// console.log(index)
				this.cur = index
				this.list1[index].isTop = !this.list1[index].isTop
				this.list1[index].isBottom = !this.list1[index].isBottom;
				switch (index) {
					case 0:
						this.sort_num = 1
						break
					case 1:
						this.sort_num = 2
						break
					case 2:
						if (this.list1[2].isTop) {
							this.sort_num = 4
						} else {
							this.sort_num = 3
						}
						break
					case 3:
						if (this.list1[3].isTop) {
							this.sort_num = 6
						} else {
							this.sort_num = 5
						}
						break
				}
				console.log(this.sort_num)
				this.getGoods()
			},
			toCar() {
				if (this.userInfo.token) {
					uni.switchTab({
						url: '/pages/shopCart/shopCart'
					})
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
					},1000)
				}

			},
			getGoods() {
				if (this.loadingType === 'loading') {
					//防止重复加载
					return;
				}

				this.loadingType = 'loading'

				setTimeout(() => {
					this.$api.factoryGoods({
						factory_id: this.factory_id,
						type_id: this.type_id,
						limit: 10,
						page: this.pageIndex,
						sort_num: this.sort_num,
					}).then(res => {
						console.log(res)
						this.goodsList = res.data.data.list
						// 判断是否有下一页
						if (res.data.data.next_page === 0) {
							this.loadingType = 'noMore'
						} else {
							this.loadingType = 'more'
							this.pageIndex = res.data.data.next_page
						}
					})
				}, 800)
			},
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
						this.shareStr = res.data
					}
				})
			},
			// 跳转到详情页
			toDetail(id) {
				uni.navigateTo({
					url: '/pages/index/shopDetail/shopDetail?id=' + id
				})
			},
			// 获得购物车数量
			getShopNum() {
				if (this.userInfo.token) {
					this.$api.carList().then(res => {
						console.log(res)
						if (res.data.errno == 0) {
							console.log(res.data.data.count)
							this.setShopNum(Number(res.data.data.count))
						} else if (res.data.errno === 400 || res.data.errno === 4008 || res.data.errno === 4009) {
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
							}, 1000)
						}
					})
				} else {
					this.shopCarCount = ''
				}
			}
		},
		onShareAppMessage(options) {
			let that = this;
			let shareObj = {
				title: that.factoryInfo.factory_nickname,
				path: '/pages/index/storeHome/storeHome?s=' + that.shareStr + '&factory_id=' + this.factory_id,
			}

			if (options.from == 'button') {
				shareObj.path = '/pages/index/storeHome/storeHome?s=' + that.shareStr + '&factory_id=' + this.factory_id;
			}
			return shareObj;

		},
	}
</script>

<style lang="scss">
	.s-head {
		width: 100%;
		height: 314rpx;
		position: relative;

		.s-info {
			position: absolute;
			top: 48rpx;
			width: 100%;
			height: 80rpx;
			display: flex;
			z-index: 2;

			.s-text {
				margin-left: 16rpx;
				max-width: 320rpx;
				height: 100%;

				.s-text1 {
					width: 100%;
					font-size: 32rpx;
					color: $font-color-text;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
				}

				.s-text2 {
					width: 100%;
					font-size: 24rpx;
					color: $font-color-text;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
				}
			}

			image {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				margin-left: 24rpx;
			}

			.s-select {
				width: 24rpx;
				height: 24rpx;
				margin-top: 10rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}

		// .share-button {
		// 	position: absolute;
		// 	right: 0;
		// 	top: 60rpx;
		// 	width: 140rpx;
		// 	height: 60rpx;
		// 	background: rgba(255, 255, 255, 1);
		// 	border-radius: 36rpx 0rpx 0rpx 36rpx;
		// 	background: #FFFFFFFF;
		// 	display: flex;
		// 	align-items: center;
		// 	z-index: 2;

		// 	.s-img {
		// 		width: 32rpx;
		// 		height: 32rpx;
		// 		margin-left: 16rpx;
		// 	}

		// 	.s-name {
		// 		margin-left: 16rpx;
		// 		font-size: 24rpx;
		// 		color: rgba(34, 34, 34, 1);
		// 	}
		// }

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
			z-index: 100;

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

		.s-search {
			box-sizing: border-box;
			padding: 0 32rpx;
			width: 100%;
			height: 138rpx;
			border-radius: 24rpx 24rpx 0px 0px;
			position: absolute;
			bottom: 0;
			left: 0;
			background: #FFFFFF;
			z-index: 2;

			.search-box {
				margin-top: 48rpx;
				width: 100%;
				height: 78rpx;
				position: relative;
				border-radius: 36rpx;
				background: #F4F4F4;

				.search-icon {
					position: absolute;
					width: 32rpx;
					height: 32rpx;
					top: 20rpx;
					left: 20rpx;

					image {
						width: 100%;
						height: 100%
					}
				}

				.search-input {
					width: 100%;
					height: 100%;
					line-height: 78rpx;
					border: none;
					outline: none;
					margin-left: 62rpx;
					font-size: 28rpx;
					color: #BBBBBB;
				}
			}
		}

		.s-head-cover {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			background: rgba(0, 0, 0, 0.69);
			z-index: 1;
		}

		image {
			width: 100%;
			height: 100%;
		}
	}

	.nav {
		.cu-item {
			font-size: 32rpx;

			.tab-text {
				height: 86rpx;
			}

			.tab-text1 {
				height: 86rpx;
				display: flex;

				.t-short {
					width: 30rpx;
					height: 100%;
					position: relative;

					&.t-short:before {
						content: "";
						width: 0;
						height: 0;
						position: absolute;
						top: 42rpx;
						left: 8rpx;
						border-right: solid 8rpx transparent;
						border-left: solid 8rpx transparent;
						border-bottom: solid 8rpx #999999;
					}

					&.top::before {
						border-bottom: solid 8rpx #ED494C;
					}

					&.t-short:after {
						content: "";
						width: 0;
						height: 0;
						position: absolute;
						bottom: 26rpx;
						left: 8rpx;
						border-top: solid 8rpx #999999;
						border-right: solid 8rpx transparent;
						border-left: solid 8rpx transparent;
					}

					&.bottom::after {
						border-top: solid 8rpx #ED494C;
					}
				}

			}

			.tab-bottom-line {
				width: 0%;
				height: 4rpx;
				background-color: #0081FF;
				transition-duration: 0.3s;
			}

			.tab-bottom-line-box {
				display: flex;
				justify-content: center;
			}
		}

		.cu-item.current {
			.tab-bottom-line {
				width: 100%;
			}

			margin-bottom: 20rpx;
		}
	}

	.list-box {
		background: #FFFFFF;
		min-height: 640rpx;

		.s-list {
			margin-top: 4rpx;
			display: flex;
			flex-wrap: wrap;
			padding: 32rpx 32rpx 0 28rpx;
			padding-bottom: 48rpx;

			.s-list-itme {
				height: 516rpx;
				width: 334rpx;
				margin-left: 9rpx;
				// background: red;
				border-radius: 8rpx;
				border: 2rpx solid rgba(238, 238, 238, 1);
				margin-bottom: 16rpx;

				.s-desc {
					margin-top: 16rpx;
					width: 100%;
					padding: 0 16rpx;
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

				.s-data {
					width: 100%;
					display: flex;
					justify-content: space-between;
					padding: 0 16rpx;
					height: 54rpx;
					margin-top: 10rpx;

					.s-price {
						font-size: $uni-font-size-lg;
						font-weight: 400;
						color: $font-color-price;
						// margin-top: 16rpx;
						line-height: 54rpx;
					}

					.s-sales {
						font-size: 22rpx;
						color: rgba(153, 153, 153, 1);
						line-height: 54rpx;
					}
				}

				image {
					width: 334rpx;
					height: 334rpx;
					border-radius: 8rpx 8rpx 0rpx 0rpx;
				}

			}
		}

	}

	.shop-car {
		position: fixed;
		bottom: 40rpx;
		right: 16rpx;

		image {
			width: 135rpx;
			height: 135rpx;
		}

		.shop-num {
			position: absolute;
			top: 20rpx;
			right: 30rpx;
			color: #FFFFFF;
			background: red;
			height: 32rpx;
			width: 32rpx;
			font-size: 18rpx;
			border-radius: 50%;
			text-align: center;
			line-height: 32rpx;
		}
	}
</style>
