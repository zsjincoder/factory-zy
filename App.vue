<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="less">
	@import "colorui/main.css";
	@import "colorui/icon.css";
	@import "./colorui/animation.css";
	/*每个页面公共css */
	.pub-padding{
		padding: 0 32rpx;
		// background: #FFFFFF;
	}
	.pub-padding{
		padding: 0 32rpx;
	}
	page {
		height: 100%;
	}
</style>
