<template>
	<view class="content">
		<view class="success-icon">
			<image src="../../../static/img/index/pay_success.png" mode=""></image>
		</view>
		<text class="tit">支付成功</text>
		
		<view class="btn-group">
			<navigator url="/pages/order/order" open-type="switchTab" class="mix-btn">查看订单</navigator>
			<navigator url="/pages/index/index" open-type="switchTab" class="mix-btn hollow">返回首页</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang='scss'>
	page{
		background: #FFFFFF;
	}
	.content{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: 0 32rpx;
	}
	.success-icon{
		width: 128rpx;
		height: 128rpx;
		font-size: 160upx;
		color: #fa436a;
		margin-top: 100upx;
		
		image {
			width: 100%;
			height: 100%;
		}
	}
	.tit{
		font-size: 38upx;
		color: #303133;
		margin-top: 40rpx;
	}
	.btn-group{
		padding-top: 100upx;
		width: 100%;
	}
	.mix-btn {
		margin-top: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		/* width: 600upx; */
		height: 80upx;
		font-size: $font-lg;
		color: #fff;
		background-color: #ED494C;
		border-radius: 8upx;
		
		&.hollow{
			background: #fff;
			color: #303133;
			border: 1px solid #ccc;
		}
	}
</style>
