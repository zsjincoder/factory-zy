<template>
	<view class="content">
		<view class="header_box" @click="getWechatAddress">
			<view class="header-left">
				<view class="title-img">
					<image src="../../../static/img/mine/WeChat.png"></image>
				</view>
				<view class="title">获取微信收货地址</view>
			</view>
			<view class="header-right">
				<image src="../../../static/img/mine/arrow-right.png"></image>
			</view>
		</view>
		<view class="divider"></view>

		<view class="item-box">
			<view class="item" v-for="item in addressList" :key="item.address_id" @click="selecteAddress(item)">
				<view class="info-box">
					<view class="info-left">
						<view class="info">
							<text class="addressee-name">{{item.name}}</text>
							<text class="addressee-phone">{{item.phone}}</text>
						</view>
						<view class="address">{{item.address}} {{item.house}}</view>
					</view>
					<view class="info-right" @tap.stop="toEditAddress(item)">
						<image src="../../../static/img/mine/edit.png"></image>
					</view>
				</view>
				<view class="divider"></view>
			</view>
		</view>

		<view class="button-box" @click="toAddAddress">新增收货地址</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from "vuex"
	export default {
		data() {
			return {
				addressList: [],
				addressScop: false
			};
		},
		computed:{
			...mapGetters({
				getAddressState:'getAddressState',
			})
		},
		onShow() {
			this.getAddress()
		},
		onLoad() {
			this.getAddress()
		// 	uni.getSetting({
		// 		success: (res) => {
		// 			console.log(res)
		// 			console.log(res.authSetting['scope.address'])
		// 			if(res.authSetting['scope.address']){
		// 				console.log('已打开授权')
		// 			}else{
		// 				uni.openSetting({
		// 					success: (res) => {
		// 						console.log(res)
		// 					}
		// 				})
		// 			}
		// 		}
		// 	})
		},
		methods: {
			// vuex设置收货地址
			...mapMutations({
				setAddressData:'setAddressData'
			}),
			// 选择收货地址并返回订单详情页面
			selecteAddress(data){
				if(this.getAddressState == 0){
					return
				}
				this.setAddressData(data);
				// 返回上一页
				uni.navigateBack({
					delta:1
				})
			},
			// 获取微信的收货地址
			getWechatAddress() {
				uni.chooseAddress({
					success: (res) => {
						console.log(res)
						this.addressScop = true
						this.$api.addressAdd({
							name: res.userName,
							phone: res.telNumber,
							address: res.provinceName + ' ' + res.cityName + ' ' + res.countyName,
							house: res.detailInfo,
							is_confirm: 2
						}).then(res => {
							if(res.data.errno === 0){
								console.log('我选择了微信里的收货地址')
								this.getAddress()
							}else{
								console.log('存储到数据库失败了')
							}
						})
					},
					fail: (err) => {
						console.log(err)
						// 打开一个提示弹窗
						if (this.addressScop === false) {
							uni.showModal({
								content: '检测到您没打开获取地址功能权限，是否去设置打开？',
								confirmText: "确认",
								cancelText: '取消',
								success: (cRes) => {
									console.log(cRes)
									if (cRes.confirm) {
										// 用户点击确定后打开微信原生设置页面
										uni.openSetting({
											success: (oRes) => {
												console.log(oRes);
												this.addressScop = oRes.authSetting['scope.address']
											}
										})
										this.addressScop = true
									} else {
										console.log('取消');
									}
								}
							})
						}
					}
				})
			},
			// 获取收货地址
			getAddress(){
				this.$api.addressList().then((res) => {
					console.log(res)
					if(res.data.errno === 0){
						this.addressList = res.data.data
						console.log(this.addressList)
					}else if(res.data.errno === 400 || res.data.errno === 4008 || res.data.errno === 4009){
						uni.showToast({
							title: '登录过时，请重新登录',
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
							uni.switchTab({
								url: '/pages/mine/mine'
							})
						},1000)
					}
				})
			},
			// 编辑收货地址
			toEditAddress(info) {
				// 将当前选择的地址信息存入缓存
				uni.setStorageSync('address',{
					id: info.address_id,
					name: info.name,
					phoneNum: info.phone,
					address: info.address,
					detailAddress: info.house
				})
				// 跳转到编辑页面
				uni.navigateTo({
					url: '/pages/mine/address/editAddress'
				})
			},
			// 新增收货地址
			toAddAddress() {
				uni.navigateTo({
					url: '/pages/mine/address/addAddress'
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		background: #FFFFFF;
		height: 100%;

		.header_box {
			padding: 0 32rpx;
			height: 112rpx;
			display: flex;
			justify-content: space-between;

			.header-left {
				display: flex;

				.title-img {
					width: 48rpx;
					height: 44rpx;
					margin-top: 36rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.title {
					line-height: 112rpx;
					font-size: 28rpx;
					color: $font-color;
					margin-left: 16rpx;
				}
			}

			.header-right {
				width: 32rpx;
				height: 32rpx;
				margin-top: 48rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}

		.divider {
			width: 100%;
			height: 16rpx;
			background: #F8F8F8;
		}

		.item-box {
			margin-bottom: 88rpx;

			.item {

				.info-box {
					background: #FFFFFF;
					padding: 32rpx;
					display: flex;
					justify-content: space-between;

					.info-left {
						.info {
							font-size: 28rpx;
							color: $font-color;

							.addressee-phone {
								color: #999999;
								margin-left: 48rpx;
							}
						}

						.address {
							margin-top: 16rpx;
							line-height: 40rpx;
							font-size: 28rpx;
							color: $font-color;

						}
					}

					.info-right {
						margin-left: 70rpx;

						image {
							width: 48rpx;
							height: 48rpx;
							margin-top: 80%;
						}
					}
				}
			}
		}

		.button-box {
			position: fixed;
			width: 100%;
			height: 88rpx;
			background: #ED494C;
			color: #FFFFFF;
			line-height: 88rpx;
			text-align: center;
			font-size: 32rpx;
			bottom: 0;
			left: 0;
		}
	}
</style>
