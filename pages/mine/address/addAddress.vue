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
					<input type="text" @input="getPhoneNum" :value="phoneNum" @blur="checkPhone" placeholder="收货人手机号码" placeholder-style="color: #E5E5E5; font-size: 28rpx" />
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
			<button :disabled="disabled" :class="['button',disabled ? '' : 'active']" @click="keep">保存并使用</button>
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
				disabled: true,
				checkPhoneNum: false
			};
		},
		methods: {
			// 获得收货人姓名
			getName(e) {
				console.log(e.detail.value)
				if (e.detail.value) {
					this.name = e.detail.value
				}
				this.judge()
			},
			// 获得电话号码
			getPhoneNum(e) {
				if (e.detail.value) {
					this.phoneNum = e.detail.value
				}
				this.judge()
			},
			// 校验手机号格式是否正确
			checkPhone(){
				let reg = /^1[3|4|5|7|8][0-9]{9}$/;
				if(reg.test(this.phoneNum)){
					this.checkPhoneNum = true
				}else{
					this.checkPhoneNum = false
					uni.showToast({
						title: '请输入正确的手机号',
						duration: 1000,
						icon: 'none'
					})
				}
			
				console.log(reg.test(this.phoneNum))
			},
			getDetailAddress(e) {
				if (e.detail.value) {
					this.detailAddress = e.detail.value
				}
				this.judge()
			},
			getAddress() {
				uni.chooseLocation({
					success: (res) => {
						console.log(res)
						this.address = res.address + ' ' + res.name
						this.hasAddress = true
					},
					fail: (error) => {
						console.log(error)
					}
				})
				this.judge()
			},
			judge(){
				if(this.name !== '' && this.phoneNum !== '' && this.address !== '' && this.detailAddress !== ''){
					this.disabled = false
				}else{
					this.disabled = true
				}
			},
			keep() {
				if (this.name !== '' && this.phoneNum !== '' && this.address !== '请填写收货地址' && this.detailAddress !== '') {
					if(this.checkPhoneNum){
						console.log('保存成功')
						this.$api.addressAdd({
							name: this.name,
							phone: this.phoneNum,
							address: this.address,
							house: this.detailAddress,
							is_confirm: 2
						}).then(res => {
							console.log(res)
							if(res.data.errno === 0){
								uni.showToast({
									title: '添加成功',
									duration: 1000,
									icon: 'none'
								})
								// 返回上一级
								uni.navigateBack({
								    delta: 1
								});
							}else{
								uni.showToast({
									title: '添加失败，请重试',
									duration: 1000,
									icon: 'none'
								})
							}
						})
					}else{
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
				background: #CECECE;
				font-size: 32rpx;
				color: #FFFFFF;
				text-align: center;
				line-height: 88rpx;
				border-radius: 8rpx;
				border-radius: 0;
				padding: 0;
			}

			.button::after {
				border: none;
			}

			.active {
				background: #ED494C;
			}

		}
	}
</style>
