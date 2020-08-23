<template>
	<view class="content">
		<view class="content-box">
			<view class="item" v-for="(item,index) in infoList" :key="index">
				<view class="record-info">
					<view class="title">{{item.title}}</view>
					<view class="money">-{{item.moeny}}</view>
				</view>
				<view class="record-box">
					<view class="item-script">{{item.desc}}</view>
					<view class="item-time">{{item.create_at}}</view>
				</view>
			</view>
			<!-- 加载更多 -->
			<uni-load-more :status="loadingType"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uLi-load-more/uLi-load-more.vue';
	export default {
		data() {
			return {
				infoList: [],
				pageIndex: 1,
				loadingType: 'more'
			};
		},
		components: {
			uniLoadMore
		},
		onLoad() {
			this.getList()
		},
		onReachBottom() {
			if (this.loadingType === 'noMore') {
				return
			} else {
				this.getList()
			}
		},
		methods: {
			getList() {
				if (this.loadingType === 'loading') {
					//防止重复加载
					return;
				}

				this.loadingType = 'loading'

				setTimeout(() => {
					this.$api.commissionWithdrawalList({
						page: this.pageIndex,
						limit: 10
					}).then(res => {
						console.log(res)
						if (res.data.errno === 0) {
							this.infoList = res.data.data.list
							if (res.data.data.next_page === 0) {
								this.loadingType = 'noMore'
							} else {
								this.loadingType = 'more'
								this.pageIndex = res.data.data.next_page
							}
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
				}, 800)

			}
		}
	}
</script>

<style lang="scss">
	.content {
		background: #FFFFFF;
		height: 100%;

		.content-box {
			margin: 0 32rpx;

			.item {
				border-bottom: 2rpx solid #EBECEE;
				box-sizing: border-box;
				padding-bottom: 32rpx;

				.record-info {
					display: flex;
					justify-content: space-between;
					padding-top: 48rpx;
					color: #444444;

					.money {
						color: #4CBF00;
					}

				}

				.record-box {
					display: flex;
					justify-content: space-between;

					.item-script,
					.item-time {
						color: #9E9E9E;
						font-size: 24rpx;
						margin-top: 10rpx;
					}
				}
			}
		}
	}
</style>
