<template>
	<view class="content">
		<view class="content-box">
			<view class="item" v-for="(item,index) in infoList" :key="index">
				<view class="item-header">
					<view class="header-icon">
						<image src="../../../static/img/mine/help-center.png" mode=""></image>
					</view>
					<view class="title">{{item.title}}</view>
				</view>
				<view class="item-content">{{item.body}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				infoList: [],
				
			};
		},
		onLoad() {
			this.getList()
		},
		methods: {
			getList(){
				this.$api.personalSupport().then(res => {
					console.log(res)
					if(res.data.errno === 0){
						this.infoList = res.data.data
					}
				})
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
				
				.item-header {
					display: flex;
					padding-top: 48rpx;
					
					.header-icon {
						width: 48rpx;
						height: 48rpx;
						margin-right: 16rpx;
						
						image {
							width: 100%;
							height: 100%;
						}
					}
					
					.title {
						font-size: 32rpx;
					}
				}
				
				.item-content {
					color: #999999;
					line-height: 40rpx;
					padding-left: 64rpx;
					margin-top: 34rpx;
				}
			}
		}
	}
</style>
