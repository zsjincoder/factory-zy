<template>
	<view class="content">
		<view class="search-box">
			<view class="search-icon">
				<image src="../../../static/img/index/search-icon.png"></image>
			</view>
			<input @click="toSearch" class="search-input" type="text" :value="searchKey" placeholder="搜索商品" placeholder-style="font-size: 28rpx; color: #BBBBBB;" />
		</view>
		<!-- 商品列表 -->
		<view class="product-list">
			<!-- 空白页 -->
			<empty v-if="!hasKey || !hasShops"></empty>
			<view v-else class="product-box">
				<view class="product-left">
					<view class="product-item" v-for="(item,index) in shopsList" v-if="(index+1) % 2 !== 0" :key="index" @click="toShopDetail(item.goods_id)">
						<view class="product-image">
							<image :src="item.cover_img" mode=""></image>
						</view>
						<view class="product-script-box">
							<view class="product-title">{{item.name}}</view>
							<view class="product-script">
								<view class="product-price">￥<text class="product_price">{{item.price}}</text></view>
								<view class="product-num">已售<text>{{item.sales_volume}}</text>件</view>
							</view>
						</view>
					</view>
				</view>
				<view class="product-right">
					<view class="product-item" v-for="(item,index) in shopsList" v-if="(index+1) % 2 === 0" :key="index" @click="toShopDetail(item.goods_id)">
						<view class="product-image">
							<image :src="item.cover_img" mode=""></image>
						</view>
						<view class="product-script-box">
							<view class="product-title">{{item.name}}</view>
							<view class="product-script">
								<view class="product-price">￥<text class="product_price">{{item.price}}</text></view>
								<view class="product-num">已售<text>{{item.sales_volume}}</text>件</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<uni-load-more :status="loadingType"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	export default {
		components: {
			empty,
			uniLoadMore
		},
		data() {
			return {
				shopsList: [],
				pageIndex: 1,
				limitNum: 15,
				searchKey: '',
				hasKey: false,
				hasShops: false,
				loadingType: 'more',
			};
		},
		onLoad(options) {
			// 判断是否有关键字
			if (Object.keys(options).length !== 0) {
				console.log('有搜索关键字')
				console.log(options)
				this.hasKey = true
				this.searchKey = options.searchKey
				this.getShops()
			} else {
				console.log('没有搜索关键字')
				this.hasKey = false
			}
			
		},
		onReachBottom() {
			if (this.loadingType === 'noMore') {
				return
			} else {
				this.getShops()
			}
		},
		methods: {
			// 去搜索页
			toSearch() {
				uni.navigateTo({
					url: '/pages/index/storeHome/storeSearch?keyWords=' + this.searchKey
				})
			},
			// 去商品详情页
			toShopDetail(goods_id) {
				uni.navigateTo({
					url: '/pages/index/shopDetail/shopDetail?id=' + goods_id
				})
			},
			// 搜索商品
			getShops() {
				if (this.loadingType === 'loading') {
					//防止重复加载
					return;
				}
				
				this.loadingType = 'loading';

				// 请求数据
				setTimeout(() => {
					this.$api.search({
						keywords: this.searchKey,
						limit: this.limitNum,
						page: this.pageIndex
					}).then((res) => {
						// console.log(res)
						if (res.data.errno === 0) {
							console.log(this.shopsList)
							if(res.data.data.goods.length !== 0){
								// console.log('有数据')
								this.hasShops = true
								res.data.data.goods.map(item => {
									console.log(item)
									this.shopsList.push(item)
								})
								//判断是否还有数据()通过判断是否还有下一页， 有改为 more， 没有改为noMore
								if(res.data.data.next_page === 0){
									this.loadingType = 'noMore'
								}else{
									this.loadingType = 'more'
									this.pageIndex = res.data.data.next_page
								}
							}else {
								// console.log('没有数据')
								this.hasShops = false
							}
						}else{
							console.log(res.data.msg)
						}
					})

				}, 600)

			}
		}
	}
</script>

<style lang="scss">
	.content {
		padding: 32rpx 32rpx;
		background: #FFFFFF;

		.search-box {
			// padding-top: 16rpx;
			width: 100%;
			height: 78rpx;
			position: relative;
			border-radius: 36rpx;
			background: #F4F4F4;
			z-index: 100;

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
			}
		}

		.product-list {
			margin-bottom: 20rpx;

			.product-box {
				display: flex;
				justify-content: space-between;

				.product-left,
				.product-right {
					width: 334rpx;

					.product-item {
						border-radius: 8rpx;
						border: 2rpx solid #EEEEEE;
						margin-top: 16rpx;
						background: #FFFFFF;
						overflow: hidden;

						.product-image {
							width: 334rpx;
							height: 334rpx;

							image {
								width: 100%;
								height: 100%;
							}
						}

						.product-script-box {
							margin: 16rpx;

							.product-title {
								font-size: 29rpx;
								line-height: 42rpx;
								color: $font-color;
								display: -webkit-box;
								/*将对象转为弹性盒模型展示*/
								-webkit-box-orient: vertical;
								/*设置弹性盒模型子元素的排列方式*/
								-webkit-line-clamp: 2;
								/*限制文本行数*/
								overflow: hidden;
								/*超出隐藏*/
							}

							.product-script {
								margin-top: 16rpx;
								display: flex;
								justify-content: space-between;
								height: 50rpx;

								.product-price {
									color: #ED494C;
									font-size: 24rpx;
									line-height: 50rpx;

									.product_price {
										font-size: 36rpx;
									}
								}

								.product-num {
									font-size: 22rpx;
									color: #999999;
									line-height: 50rpx;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
