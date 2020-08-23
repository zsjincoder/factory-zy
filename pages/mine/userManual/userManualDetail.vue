<template>
	<view class="content">
		<view class="divider"></view>
		<view class="content-box">
			<rich-text :nodes="manual"></rich-text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				key: '',
				title: '',
				manual:'<p style="color: red">测试数据</p>'
			};
		},
		onLoad(options) {
			this.key = options.key
			this.title = options.title
			uni.setNavigationBarTitle({
			　　title: this.title
			})
			// this.getManual()
		},
		methods: {
			getManual(){
				this.$api.personalContact({key: this.key}).then(res => {
					console.log(res)
					if(res.data.errno === 0){
						this.manual = res.data.data
					}
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
		
		.content-box {
			padding: 48rpx 32rpx;
		}
	}
</style>
