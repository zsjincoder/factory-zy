<template>
	<view class="content">
		<view class="header_box">
			<view class="head_img">
				<image :src="imgSrc"></image>
				<view v-if="!isLogin" class="button-box">
					<button class="button" open-type="getUserInfo" @getuserinfo="login">登录</button>
				</view>
			</view>
			<view class="head_info">
				<view class="name">{{name}}</view>
				<!-- <view v-if="!isBindPhone || !isLogin" class="phone_num">未绑定手机号码</view>
				<view v-else class="phone_num">{{phoneNum}}</view> -->
			</view>
		</view>
		<view class="divider"></view>
		<view class="list-box">
			<!-- 钱包 -->
			<!-- <view class="item" @click="toWallet">
				<view class="item-left">
					<view class="item-img">
						<image src="../../static/img/mine/wallet.png"></image>
					</view>
					<view class="item-name">我的钱包</view>
				</view>
				<view class="item-right">
					<image src="../../static/img/mine/arrow-right.png"></image>
				</view>
			</view> -->
			<view class="item" @click="toIncome">
				<view class="item-left">
					<view class="item-img">
						<image src="../../static/img/mine/income.png"></image>
					</view>
					<view class="item-name">我的收益</view>
				</view>
				<view class="item-right">
					<image src="../../static/img/mine/arrow-right.png"></image>
				</view>
			</view>
			<view class="item" @click="toAddress">
				<view class="item-left">
					<view class="item-img">
						<image src="../../static/img/mine/address.png"></image>
					</view>
					<view class="item-name">收货地址</view>
				</view>
				<view class="item-right">
					<image src="../../static/img/mine/arrow-right.png"></image>
				</view>
			</view>
			<!-- 手机号 -->
			<!-- <view class="item" @click="toPhone">
				<view class="item-left">
					<view class="item-img">
						<image src="../../static/img/mine/phone.png"></image>
					</view>
					<view v-if="!isBindPhone" class="item-name">绑定手机号</view>
					<view v-else class="item-name">{{phoneNum}}</view>
				</view>
				<view class="item-right">
					<image src="../../static/img/mine/arrow-right.png"></image>
				</view>
			</view> -->
			<view class="item" @click="toShop">
				<view class="item-left">
					<view class="item-img">
						<image src="../../static/img/mine/business_firm.png"></image>
					</view>
					<view v-if="!isDirector" class="item-name">我要开店</view>
					<view v-else class="item-name">切换为商家</view>
				</view>
				<view class="item-right">
					<image src="../../static/img/mine/arrow-right.png"></image>
				</view>
			</view>
			<view class="item" @click="toUserManual">
				<view class="item-left">
					<view class="item-img">
						<image src="../../static/img/mine/manual.png"></image>
					</view>
					<view class="item-name">使用手册</view>
				</view>
				<view class="item-right">
					<image src="../../static/img/mine/arrow-right.png"></image>
				</view>
			</view>
			<view class="item" @click="contactUs">
				<view class="item-left">
					<view class="item-img">
						<image src="../../static/img/mine/contact.png"></image>
					</view>
					<view class="item-name">联系我们</view>
				</view>
				<view class="item-right">
					<image src="../../static/img/mine/arrow-right.png"></image>
				</view>
			</view>
			<view class="item" v-if="isLogin" @click="LoginOut">
				<view class="item-left">
					<view class="item-img">
						<image src="../../static/img/mine/login_out.png"></image>
					</view>
					<view class="item-name">退出登录</view>
				</view>
				<view class="item-right">
					<image src="../../static/img/mine/arrow-right.png"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isLogin: false,
				imgSrc: '../../static/img/mine/default-img.png',
				name: '点击头像登录',
				phoneNum: '',
				isDirector: false,
				isBindPhone: false,
				customerService: '11234567231',
				userInfo: [],
				shareStr: '' // 分享码
			}
		},
		onLoad() {
			// 获得分享码
			this.shareStr = uni.getStorageSync('shareStr')
			console.log(this.shareStr)
		// 	this.userInfo = uni.getStorageSync('user_info');
		// 	console.log(this.userInfo)
		// 	if(this.userInfo.token){
		// 		this.imgSrc = this.userInfo.user_img
		// 		this.name = this.userInfo.user_name
		// 		this.isLogin = true
		// 	}else{
		// 		this.imgSrc = '../../static/img/mine/default-img.png'
		// 		this.name = '点击头像登录'
		// 		this.isLogin = false
		// 	}
		},
		onShow() {
			this.userInfo = uni.getStorageSync('user_info');
			console.log(this.userInfo)
			if (this.userInfo.token) {
				this.imgSrc = this.userInfo.user_img
				this.name = this.userInfo.user_name
				this.isLogin = true
			} else {
				this.imgSrc = '../../static/img/mine/default-img.png'
				this.name = '点击头像登录'
				this.isLogin = false
			}
		},
		methods: {
			login(e) {
				if (e.detail.errMsg === 'getUserInfo:ok') {
					// console.log(e)
					// 用户同意授权
					uni.login({
						provider: 'weixin',
						scopes: 'auth_user',
						success: (loginRes) => {
							// console.log(loginRes);
							// 获取用户信息(获取用户信息要在login登录成功后，不然session_key会出现信息不对称以致后端解密失败导致前端需要登录两次)
							uni.getUserInfo({
								success: (userRes) => {
									console.log(userRes)
									if (userRes.errMsg === 'getUserInfo:ok') {
										// 获取openid和session_key
										this.$api.auth({
											code: loginRes.code,
										}).then((res) => {
											// console.log(res)
											if (res.data.errno === 0) {
												// 获取token
												this.$api.create({
													sessionKey: res.data.data.session_key,
													encryptedData: userRes.encryptedData,
													iv: userRes.iv,
													code: this.shareStr
												}).then((res) => {
													console.log(res)
													if (res.data.errno === 0) {
														// 设置微信缓存user_info信息
														try {
															uni.setStorageSync('user_info', {
																token: res.data.data.token,
																user_id: res.data.data.user_id,
																user_img: e.detail.userInfo.avatarUrl,
																user_name: e.detail.userInfo.nickName,
																code: loginRes.code
															});
															uni.showToast({
																title: '登录成功',
																duration: 1000,
																icon: 'none'
															})
															setTimeout(() => {
																this.imgSrc = e.detail.userInfo.avatarUrl
																this.name = e.detail.userInfo.nickName
																this.isLogin = true
															}, 1000)

														} catch (e) {
															//TODO handle the exception
															console.log(e)
														}
													} else {
														// console.log(res.data.msg)
														uni.showToast({
															title: '登录失败,请重新登录',
															duration: 1000,
															icon: 'none'
														})
													}
												})
											} else {
												console.log(res.data.msg)
											}
										})
									}
								},
								fail: (err) => {
									console.log(err);
								}
							})
						}
					})
				} else {
					console.log('请授权');
				}
			},
			// 我的钱包
			toWallet() {
				if (this.isLogin) {
					uni.navigateTo({
						url: '/pages/mine/wallet/wallet'
					})
				} else {
					uni.showToast({
						title: '还未登录，请先登录',
						duration: 1000,
						icon: 'none'
					})
				}
			},
			// 我的收益
			toIncome() {
				if (this.isLogin) {
					uni.navigateTo({
						url: '/pages/mine/income/income'
					})
				} else {
					uni.showToast({
						title: '还未登录，请先登录',
						duration: 1000,
						icon: 'none'
					})
				}
			},
			// 收货地址
			toAddress() {
				if (this.isLogin) {
					uni.navigateTo({
						url: '/pages/mine/address/address'
					})
				} else {
					uni.showToast({
						title: '还未登录，请先登录',
						duration: 1000,
						icon: 'none'
					})
				}

			},
			// 手机号
			toPhone() {
				if (this.isLogin) {
					if (this.isBindPhone) {
						// 已绑定手机号
						uni.navigateTo({
							url: '/pages/mine/chengPhone/changePhone'
						})
					} else {
						uni.navigateTo({
							url: '/pages/mine/bindPhone/bindPhone'
						})
					}
				} else {
					uni.showToast({
						title: '还未登录，请先登录',
						duration: 1000,
						icon: 'none'
					})
				}
			},
			// 开店
			toShop() {
				if (this.isLogin) {
					if (this.isDirector) {

					} else {
						uni.navigateTo({
							url: '/pages/mine/openShop/openShop'
						})
					}
				} else {
					uni.showToast({
						title: '还未登录，请先登录',
						duration: 1000,
						icon: 'none'
					})
				}
			},
			// 使用手册
			toUserManual(){
				uni.navigateTo({
					url: '/pages/mine/userManual/userManual'
				})
			},
			// 联系我们
			contactUs() {
				this.$api.personalContact().then(res => {
					console.log(res)
					if(res.data.errno === 0){
						uni.makePhoneCall({
							phoneNumber: res.data.data
						})
					}
				})
			},
			// 退出登录
			LoginOut() {
				if (this.isLogin) {
					uni.setStorageSync('user_info', {
						token: '',
						user_id: '',
						user_img: '../../static/img/mine/default-img.png',
						user_name: '点击头像登录'
					});

					this.imgSrc = '../../static/img/mine/default-img.png'
					this.name = '点击头像登录'
					this.isLogin = false
					console.log(this.isLogin)
					// uni.showToast({
					// 	title: '成功退出登录',
					// 	duration: 1000,
					// 	icon: 'none'
					// })
					console.log('退出登录')
				} else {
					uni.showToast({
						title: '还未登录，请先登录',
						duration: 1000,
						icon: 'none'
					})
					console.log(this.isLogin)
				}
			}
		}
	}
</script>

<style lang="scss">
	.content {
		height: 100%;
		background: #FFFFFF;
		padding-bottom: 48rpx;

		.header_box {

			display: flex;
			padding: 32rpx 32rpx 48rpx;

			.head_img {
				width: 128rpx;
				height: 128rpx;
				position: relative;

				image {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}

				.button-box {
					width: 128rpx;
					height: 128rpx;
					position: absolute;
					top: 0;
					left: 0;

					.button {
						width: 100%;
						height: 100%;
						line-height: 128rpx;
						text-align: center;
						opacity: 0;
					}

					.button::after {
						border: none;
					}
				}
			}

			.head_info {
				margin: 16rpx 0 16rpx 32rpx;

				.name {
					line-height: 96rpx;
					// line-height: 48rpx;
					font-weight: 500;
					font-size: 34rpx;
					color: $font-color;
				}

				.phone_num {
					line-height: 40rpx;
					font-size: 28rpx;
					color: #999999;
				}
			}
		}

		.divider {
			width: 100%;
			height: 16rpx;
			background: #F8F8F8;
		}

		.list-box {
			background: #FFFFFF;
			padding: 0 32rpx;

			.item {
				display: flex;
				justify-content: space-between;
				height: 112rpx;
				border-bottom: 2rpx solid #EEEEEE;
				box-sizing: border-box;

				.item-left {
					display: flex;

					.item-img {
						width: 48rpx;
						height: 48rpx;
						margin-top: 32rpx;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.item-name {
						font-size: 28rpx;
						color: $font-color;
						line-height: 112rpx;
						margin-left: 16rpx;
					}
				}

				.item-right {
					image {
						width: 32rpx;
						height: 32rpx;
						margin-top: 40rpx;
					}
				}
			}
		}
	}
</style>
