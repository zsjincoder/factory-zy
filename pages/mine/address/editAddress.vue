<template>
	<view class="content">
		<view class="divider"></view>

		<view class="item-box">
			<view class="item">
				<view class="item-title">收货人</view>
				<view class="input-box">
					<input type="text" @input="getName" :value="name" placeholder="收货人姓名" placeholder-style="color: #E5E5E5; font-size: 28rpx" />
				</view>
			</view>
			<view class="item">
				<view class="item-title">手机号码</view>
				<view class="input-box">
					<input type="text" @input="getPhoneNum" :value="phoneNum" @blur="checkPhone" placeholder="收货人手机号码"
					 placeholder-style="color: #E5E5E5; font-size: 28rpx" />
				</view>
			</view>
			<view class="item-address" @click="getAddress">
				<view class="item-left">
					<view class="item-title">收货地址</view>
					<view :class="['address-info', hasAddress?'active':'']">{{address}}</view>
				</view>
				<view class="item-right">
					<view class="img-box">
						<image src="../../../static/img/mine/address-1.png"></image>
					</view>
					<view class="item-text">定位</view>
				</view>
			</view>
			<view class="item">
				<view class="item-title">门牌号</view>
				<view class="input-box">
					<input type="text" @input="getDetailAddress" :value="detailAddress" placeholder="街道,门牌号" placeholder-style="color: #E5E5E5; font-size: 28rpx" />
				</view>
			</view>
		</view>

		<view class="button-box">
			<view class="button" @click="keep">保存并使用</view>
			<view class="deltet-button" @click="delAddress">删除收货地址</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				hasAddress: false,
				name: '',
				phoneNum: '',
				address: '请填写收货地址',
				detailAddress: '',
				address_id: '',
				checkPhoneNum: false
			};
		},
		onLoad() {
			let addressInfo = uni.getStorageSync('address')
			this.name = addressInfo.name
			this.phoneNum = addressInfo.phoneNum
			this.address = addressInfo.address
			this.detailAddress = addressInfo.detailAddress
			this.address_id = addressInfo.id
			if (addressInfo.address) {
				this.hasAddress = true
			} else {
				this.hasAddress = false
			}
		},
		methods: {
			getName(e) {
				console.log(e.detail.value)
				if (e.detail.value) {
					this.name = e.detail.value
				}
			},
			getPhoneNum(e) {
				if (e.detail.value) {
					this.phoneNum = e.detail.value
				}
			},
			// 校验手机号格式是否正确
			checkPhone() {
				let reg = /^1[3|4|5|7|8][0-9]{9}$/;
				if (reg.test(this.phoneNum)) {
					this.checkPhoneNum = true
				} else {
					this.checkPhoneNum = false
					uni.showToast({
						title: '请输入正确的手机号',
						duration: 1000,
						icon: 'none'
					})
				}
			},
			getDetailAddress(e) {
				if (e.detail.value) {
					this.detailAddress = e.detail.value
				}
			},
			getAddress() {
				uni.chooseLocation({
					success: (res) => {
						console.log(res)
						this.address = res.address + res.name
						this.hasAddress = true
					}
				})
			},
			// 保存
			keep() {
				if (this.name !== '' && this.phoneNum !== '' && this.address !== '请填写收货地址' && this.detailAddress !== '') {
					this.checkPhone()
					if (this.checkPhoneNum) {
						console.log('保存成功')
						this.$api.addressEdit({
							address_id: this.address_id,
							name: this.name,
							phone: this.phoneNum,
							address: this.address,
							house: this.detailAddress,
							is_confirm: 2
						}).then(res => {
							console.log(res)
							if (res.data.errno === 0) {
								uni.showToast({
									title: '保存成功',
									duration: 1000,
									icon: 'none'
								})
								// 返回上一个页面
								uni.navigateBack({
									delta: 1
								});
							} else {
								uni.showToast({
									title: '保存失败，请重试',
									duration: 1000,
									icon: 'none'
								})
							}
						})
					} else {
						uni.showToast({
							title: '请输入正确的手机号',
							duration: 1000,
							icon: 'none'
						})
					}
				} else {
					uni.showToast({
						title: '资料未填写完整',
						duration: 1000,
						icon: 'none'
					})
				}
			},
			// 删除收货地址
			delAddress() {
				this.$api.addressDel({
					address_id: this.address_id
				}).then(res => {
					console.log(res)
					if (res.data.errno === 0) {
						uni.showToast({
							title: '删除成功',
							duration: 1000,
							icon: 'none'
						})
						uni.navigateBack({
							delta: 1
						})
					} else {
						uni.showToast({
							title: '删除失败，请重试',
							duration: 1000,
							icon: 'none'
						})
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

		.divider {
			width: 100%;
			height: 16rpx;
			background: #F8F8F8;
		}

		.item-box {
			padding: 0 32rpx;

			.item {
				// height: 104rpx;
				border-bottom: 2rpx solid #EEEEEE;
				box-sizing: border-box;
				display: flex;

				.item-title {
					font-size: 28rpx;
					line-height: 104rpx;
					font-weight: 500;
					width: 116rpx;
					margin-right: 36rpx;
				}

				.input-box {
					height: 104rpx;

					input {
						height: 100%;
						line-height: 104rpx;
					}

				}
			}

			.item-address {
				display: flex;
				justify-content: space-between;
				// height: 104rpx;
				border-bottom: 2rpx solid #EEEEEE;
				box-sizing: border-box;

				.item-left {
					display: flex;

					.item-title {
						font-size: 28rpx;
						line-height: 104rpx;
						font-weight: 500;
						width: 116rpx;
						margin-right: 36rpx;
					}

					.address-info {
						width: 400rpx;
						font-size: 28rpx;
						line-height: 104rpx;
						color: #E5E5E5;
					}

					.active {
						color: $font-color;
						line-height: 40rpx;
						padding: 14rpx 0;
					}
				}

				.item-right {
					display: flex;

					.img-box {
						width: 32rpx;
						height: 32rpx;
						margin-top: 36rpx;

						image {
							width: 100%;
							height: 100%;

						}
					}

					.item-text {
						display: inline-block;
						height: 100%;
						font-size: 28rpx;
						color: #999999;
						line-height: 104rpx;
						margin-left: 4rpx;
					}
				}
			}
		}

		.button-box {
			margin: 80rpx 32rpx 0;

			.button {
				width: 100%;
				height: 88rpx;
				background: #ED494C;
				font-size: 32rpx;
				color: #FFFFFF;
				text-align: center;
				line-height: 88rpx;
				border-radius: 8rpx;
			}

			.deltet-button {
				width: 100%;
				height: 88rpx;
				margin-top: 48rpx;
				font-size: 32rpx;
				color: $font-color;
				text-align: center;
				line-height: 88rpx;
				border: 2rpx solid #E5E5E5;
				box-sizing: border-box;
				border-radius: 8rpx;
			}

		}
	}
</style>
