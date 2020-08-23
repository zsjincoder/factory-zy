<template>
	<view class="content">
		<!-- 搜索框 -->
		<view class="pub-padding s-positioning" @click="toSearch()">
			<view class="search">
				<view class="search-icon">
					<image src="/static/img/index/search-icon.png"></image>
				</view>
				<view class="search-icon">
					<view class="search-box">搜索商品</view>
				</view>
			</view>
		</view>
		<!-- 轮播图 -->
		<view class="">
			<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
				<swiper-item v-for="(item,key) in indexData.banners" :key="key">
					<image :src="item.image"></image>
				</swiper-item>
			</swiper>
		</view>
		<!-- 菜单 -->
		<view class="menu">
			<view class="m-item" v-for="(item,index) in 10" :key="index">
				<image src="/static/img/index/c1.png"></image>
				<view class="m-text">分类1</view>
			</view>
		</view>
		<!-- 餐饮入口 -->
		<view class="ad-1">
			<!-- <image src="/static/img/index/ad1.jpg"></image> -->
			<image :src="indexData.advert.image"></image>
		</view>
		<!-- 秒杀 -->
		<!-- 秒杀楼层 -->
<!-- 				<view class="seckill-section m-t">
			<view class="s-header">
				<image class="s-img" src="/static/temp/secskill-img.jpg" mode="widthFix"></image>
				<text class="tip">8点场</text>
				<text class="hour timer">07</text>
				<text class="minute timer">13</text>
				<text class="second timer">55</text>
				<text class="yticon icon-you"></text>
			</view>
			<scroll-view class="floor-list" scroll-x>
				<view class="scoll-wrapper">
					<view 
						v-for="(item, index) in goodsList" :key="index"
						class="floor-item"
						@click="navToDetailPage(item)"
					>
						<image :src="item.image" mode="aspectFill"></image>
						<text class="title clamp">{{item.title}}</text>
						<text class="price">￥{{item.price}}</text>
					</view>
				</view>
			</scroll-view>
		</view>
 -->
		<!-- 热销商品-->
		<view class="got-products pub-padding">
			<view>
				<view class="g-title">热销商品</view>
				<view class="g-underline"></view>
			</view>
		</view>
		<!-- 销售商品列表 -->
		<view class="got-list pub-padding">
			<view class="g-item"  v-for="(item,index) in indexData.list.goods" :key="index" @click="toDetail(item)">
				<image :src="item.cover_img"></image>
				<view class="g-desc">
					<view class="g-word">{{item.name}}</view>
					<view class="g-price">¥{{item.price}} <text>(销量：20515)</text></view>
				</view>
			</view>
			<!-- 加载中动画组件 -->
			<view style="margin-top: 30rpx;">
				<uLi-load-more :status="loadState"></uLi-load-more>
			</view>
		</view>
	</view>
</template>

<script>
	import uLiLoadMore from "@/components/uLi-load-more/uLi-load-more.vue"
	import {
		mapGetters,
		mapMutations
	} from "vuex"
	export default {
		components:{
			uLiLoadMore
		},
		data() {
			return {
				loadState: "more",//显示更多
				indicatorDots: true, //轮播指示面板
				autoplay: true, //轮播图是否自动切换
				interval: 5000, //轮播图切换时间
				duration: 500, //轮播滑动
				page:{
					limit:10,//每页显示数量
					page:1//页数
				},
				indexData:{},//首页数据
			}
		},
		onLoad() {
			this.getIndexData();
			
		},
		onShow() {
			// 获取购物车数据
			this.getCartData();
		},
		onReachBottom(){
				if(this.indexData.list.next_page!=0){
					this.page.page++;
					this.getIndexData();
				}
		},
		methods: {
			...mapMutations({
				setShopNum:'setShopNum'
			}),
			// 获取购物车数据
			getCartData(){
				this.$api.carList().then(res=>{
					console.log(res)
					if(res.data.errno == 0){
						this.setShopNum(Number(res.data.data.count))
					}else if (res.data.errno === 400 || res.data.errno === 4008 || 4009) {
						// uni.showToast({
						// 	title: '登录过时，请重新登录',
						// 	duration: 1000,
						// 	icon: 'none'
						// })
						uni.setStorageSync('user_info', {
							token: '',
							user_id: '',
							user_img: '../../static/img/mine/default-img.png',
							user_name: '点击头像登录'
						})
						// setTimeout(() => {
						// 	uni.switchTab({
						// 		url: '/pages/mine/mine'
						// 	})
						// }, 1000)
					}
				})
			},
			// 获取首页数据
			getIndexData(){
				console.log(123)
				if(this.page.page >1){
					this.loadState = "loading";
				}
				this.$api.index(this.page).then((res)=>{
					console.log(res);
					if(res.data.errno == 0){
						if(this.page.page>1){
							this.indexData.list.next_page = res.data.data.list.next_page;
							this.indexData.list.page_count = res.data.data.list.page_count;
							this.indexData.list.total_count = res.data.data.list.total_count;
							if (this.indexData.list.next_page == 0) {
								this.loadState = "noMore";
							} else {
								this.loadState = "more";
							}
							this.indexData.list.goods = [...this.indexData.list.goods,...res.data.data.list.goods]
						}else{
							this.indexData  =  res.data.data;
						}
					}else{
						console.log("失败")
					}
				})
			},
			// 商品详情页
			toDetail(e){
				console.log(e)
				uni.navigateTo({
					url:"/pages/index/shopDetail/shopDetail?id="+e.goods_id
				})
			},
			// 搜索页面
			toSearch(){
				uni.navigateTo({
					url:"/pages/index/search"
				})
			}
		}
	}
</script>

<style lang="scss">
	// 搜索框样式
	.s-positioning {
		position: absolute;
		top: 30rpx;
		left: 0;
		z-index: 999;
		width: 100%;
		height: 72rpx;
	}

	.search {
		background: #F4F4F4;
		border-radius: 36rpx;
		display: flex;
		height: 100%;
	}

	.search-icon {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.search-icon image {
		width: 32rpx;
		height: 32rpx;
		margin-left: 20rpx;
	}

	.search-icon .search-box {
		margin-left: 10rpx;
		color: #BBBBBB;
		font-size: 28rpx;
	}

	// 轮播样式
	.swiper {
		width: 100%;
		height: 350rpx;
		image {
			height: 100%;
			width: 100%;
		}
		// 375*175
	}

	// 菜单样式
	.menu {
		width: 100%;
		position: relative;
		display: flex;
		flex-wrap: wrap;
		padding-bottom: 20rpx;
		background: #FFFFFF;
		.m-item {
			width: 150rpx;
			text-align: center;

			image {
				width: 90rpx;
				height: 90rpx;
				border-radius: 50%;
				opacity: .7;
				box-shadow: 4rpx 4rpx 20rpx rgba(250, 67, 106, 0.3);
				margin-top: 20rpx;
			}

			.m-text {
				font-size: $uni-font-size-sm;//24rpx
			}
		}
	}
	// 餐饮入口
	.ad-1 {
		width: 750rpx;
		height: 280rpx;
		padding: 30rpx 32rpx 30rpx 32rpx;
		background: #FFFFFF;
		image {
			height: 100%;
			width: 686rpx;
			border-radius:10rpx ;
		}
		// 尺寸343*125
	}
	// 热销商品
	.got-products {
		width: 100%;
		background: #FFFFFF;
		margin-top: 16rpx;
		padding-top: 64rpx;
		.g-title {
			font-size: 34rpx;
		}
		.g-underline {
			height: 4rpx;
			background:#ED494C;
			border-radius: 4rpx;
			width: 136rpx;
		}
	}

	// 销售商品列表
	.got-list {
		width: 100%;
		padding-top: 1rpx;
		background: #FFFFFF;
		padding-bottom: 48rpx;
		.g-item {
			margin-top: 60rpx;
			width: 100%;
			height: 210rpx;
			display: flex;
			image {
				width: 210rpx;
				height: 210rpx;
				border-radius: 10rpx;
			}
			.g-desc{
				margin-left: 32rpx;
				width: 448rpx;
				height: 210rpx;
				display: flex;
				flex-direction: column;
				justify-content:space-between;
				.g-word{
					height: 50%;
					color:rgba(34,34,34,1);
					font-size: $uni-font-size-sm;//24rpx
					width: 448rpx;
				}
			}
		}
	}
	// 价格
	.g-price{
		font-size: $uni-font-size-base;//28rpx
		color: red;
		text{
			color: $font-color-light;
			font-size:$uni-font-size-base;//25rpx
			margin-left: 30rpx;
		}
	}
	/* 秒杀专区 */
	.m-t {
		margin-top: 16rpx;
	}

	.seckill-section {
		padding: 4upx 30upx 24upx;
		background: #fff;

		.s-header {
			display: flex;
			align-items: center;
			height: 92upx;
			line-height: 1;

			.s-img {
				width: 140upx;
				height: 30upx;
			}

			.tip {
				font-size: $font-base;
				color: $font-color-light;
				margin: 0 20upx 0 40upx;
			}

			.timer {
				display: inline-block;
				width: 40upx;
				height: 36upx;
				text-align: center;
				line-height: 36upx;
				margin-right: 14upx;
				font-size: $font-sm+2upx;
				color: #fff;
				border-radius: 2px;
				background: rgba(0, 0, 0, .8);
			}

			.icon-you {
				font-size: $font-lg;
				color: $font-color-light;
				flex: 1;
				text-align: right;
			}
		}

		.floor-list {
			white-space: nowrap;
		}

		.scoll-wrapper {
			display: flex;
			align-items: flex-start;
		}

		.floor-item {
			width: 150upx;
			margin-right: 20upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;
			line-height: 1.8;

			image {
				width: 150upx;
				height: 150upx;
				border-radius: 6upx;
			}

			.clamp {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				display: block;
			}

			.price {
				color: $uni-color-primary;
			}
		}
	}
</style>
