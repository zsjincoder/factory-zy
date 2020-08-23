<template>
	<view class="content">
		<view class="divider"></view>
		<view class="list-box">
			<view class="item" v-for="(item,index) in list" :key="index" @click="toUserManualDetail(item)">
				<view class="item-title">{{item.title}}</view>
				<view class="img-box">
					<image src="../../../static/img/mine/arrow-right.png" mode=""></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[]
			};
		},
		onLoad() {
			this.getList()
		},
		methods: {
			getList(){
				this.$api.personalManual().then(res => {
					if(res.data.errno === 0){
						this.list = res.data.data
					}
				})
			},
			toUserManualDetail(item){
				uni.navigateTo({
					url: '/pages/mine/userManual/userManualDetail?key=' + item.key + '&title=' + item.title
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
		
		.list-box {
			margin: 0 32rpx;
			
			.item {
				display: flex;
				justify-content: space-between;
				padding: 36rpx 0;
				border-bottom: 2rpx solid #EEEEEE;
				
				.item-title {
					font-size: 28rpx;
				}
				
				.img-box {
					width: 32rpx;
					height: 32rpx;
					
					image {
						width: 100%;
						height: 100%;
					}
				}
			}
		}
	}
</style>
