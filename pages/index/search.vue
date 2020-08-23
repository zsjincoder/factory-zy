<template>
	<view class="content">
		<view class="search_box">
			<view class="search-box">
				<view class="search-icon">
					<image src="../../static/img/index/search-icon.png"></image>
				</view>
				<input :focus="focusFlag" class="search-input" type="text" @input="inputText" :value="searchWords" placeholder="搜索商品"
				 placeholder-style="font-size: 28rpx; color: #BBBBBB;" />
				<view v-show="hasText" @click="deleteSearchWords()" class="cancel-icon">
					<image src="../../static/img/search/cancel.png"></image>
				</view>
			</view>
			<view class="search-title" @click="toSearchDetail">搜索</view>
		</view>

		<!-- 历史搜索记录 -->
		<view v-if="!hasText" class="history-box">
			<view class="history-header">
				<view class="history-title">历史记录</view>
				<view class="delete-icon" @click="deleteHistory">
					<image src="../../static/img/search/delete.png"></image>
				</view>
			</view>
			<view class="history-list">
				<view class="list-item" v-for="(item,index) in historyWordsList" :key="index" @click="getSearch(item)">
					{{item}}
				</view>
			</view>
		</view>

		<!-- 模糊搜索列表 -->
		<view v-else class="search-list">
			<view v-if="!hasSearchInfo" class="noMore">抱歉，没有相关宝贝~</view>
			<view v-else class="item-list" v-for="(item,index) in searchInfo" :key="index" @click="getWords(item)">
				<text class="item-key">{{searchWords}}</text>
				{{item}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				hasText: false,
				searchWords: '',
				focusFlag: false,
				hasSearchInfo: false,
				historyWordsList: [],
				searchList: [],
				searchInfo: []
			};
		},
		onLoad(options) {
			console.log(options)
			// 判断是否有搜索关键字
			let arr = Object.keys(options)
			console.log(arr.length)
			if (arr.length !== 0) {
				this.searchWords = options.keyWords;
				console.log(this.searchWords)
				this.focusFlag = true
				this.hasText = true;
				this.getSearchList()
			} else {
				this.hasText = false;
			}
			// 获取历史搜索记录
			this.historyWordsList = uni.getStorageSync('history_record') || []
			console.log(this.historyWordsList)
		},
		methods: {
			// 输入框获取关键词
			inputText(e) {
				console.log(e.detail);
				if (e.detail.value !== '') {
					this.hasText = true;
					this.searchWords = e.detail.value;
					this.getSearchList();
				} else {
					this.hasText = false;
				}
			},
			// 获得模糊搜索数据
			getSearchList() {
				console.log(this.searchList);
				this.$api.searchName({
					keywords: this.searchWords
				}).then((res) => {
					// console.log(res)
					if (res.data.errno === 0) {
						this.searchList = res.data.data
						this.searchInfo = []
						if (this.searchList.length === 0) {
							this.hasSearchInfo = false
						} else {
							this.hasSearchInfo = true
							this.searchList.map((item, index) => {
								item = item.replace(this.searchWords, '');
								this.searchInfo.push(item)
							})
						}
					}
				})
			},
			// 删除关键词
			deleteSearchWords() {
				console.log('点击了删除');
				this.hasText = false;
				this.searchWords = '';
				this.focusFlag = true
			},
			// 删除历史记录
			deleteHistory() {
				uni.setStorageSync('history_record', '')
				this.historyWordsList = []
			},
			// 从模糊搜索获取关键词
			getWords(words) {
				// console.log(words)
				this.searchWords = this.searchWords + words;
				this.getSearchList()
			},
			// 从历史激励获取关键词
			getSearch(words) {
				console.log(words)
				this.searchWords = words
				this.hasText = true
				this.focusFlag = true
				this.getSearchList()
			},
			// 点击搜索跳转到详情页
			toSearchDetail() {
				console.log(this.searchWords === '')
				if (this.searchWords !== '') {
					// 将当前搜索关键字存入缓存(如果有相同的则先删除已有的再插入到最前面)
					if (this.historyWordsList.length !== 0) {
						let index = this.historyWordsList.indexOf(this.searchWords);
						console.log(index)
						// 获得的index进行操作（如果index为-1，代表没有找到，否则返回的是找到的元素的下标）
						if (index > -1) {
							this.historyWordsList.splice(index, 1);
						}
					}

					this.historyWordsList.unshift(this.searchWords)
					uni.setStorageSync('history_record', this.historyWordsList)
					// 跳转
					uni.navigateTo({
						url: '/pages/index/searchDetail?searchKey=' + this.searchWords
					})
				} else {
					uni.showToast({
						title: '请输入关键字',
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
		padding: 0 32rpx;
		background: #FFFFFF;
		height: 100%;

		// 搜索框
		.search_box {
			width: 100%;
			display: flex;
			justify-content: space-between;
			padding-top: 20rpx;

			.search-box {
				width: 598rpx;
				height: 78rpx;
				position: relative;
				border-radius: 36rpx;
				background: #F4F4F4;

				.search-icon {
					position: absolute;
					width: 32rpx;
					height: 32rpx;
					top: 20rpx;
					left: 20rpx;

					image {
						width: 100%;
						height: 100%
					}
				}

				.search-input {
					width: 446rpx;
					height: 100%;
					line-height: 78rpx;
					border: none;
					outline: none;
					margin-left: 62rpx;
					font-size: 28rpx;
				}

				.cancel-icon {
					position: absolute;
					width: 78rpx;
					height: 100%;
					top: 0;
					right: 0;

					image {
						float: left;
						width: 24rpx;
						height: 24rpx;
						margin: 24rpx 34rpx 0 30rpx;
					}
				}
			}

			.search-title {
				line-height: 78rpx;
				font-size: 28rpx;
				color: $font-color;
			}
		}

		// 历史记录
		.history-box {
			margin-top: 48rpx;

			.history-header {
				height: 48rpx;
				display: flex;
				justify-content: space-between;

				.history-title {
					font-size: 28rpx;
					font-weight: 500;
					color: $font-color;
					line-height: 48rpx;
				}

				.delete-icon {
					width: 48rpx;
					height: 48rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}

			.history-list {

				.list-item {
					float: left;
					padding: 12rpx 36rpx;
					background: #F4F4F4;
					border-radius: 30rpx;
					margin: 32rpx 48rpx 0 0;
					font-size: 28rpx;
					color: $font-color;
					max-width: 240rpx;
					overflow: hidden;
					/*溢出隐藏*/
					white-space: nowrap;
					/*文字不换行*/
					text-overflow: ellipsis;
					/*溢出用省略号代替*/
				}
			}
		}

		// 模糊搜索列表
		.search-list {
			.noMore {
				padding: 200rpx 0;
				text-align: center;
				color: #666666;
			}

			.item-list {
				margin-top: 48rpx;
				font-size: 28rpx;
				color: $font-color;

				.item-key {
					color: #999999;
				}
			}
		}

	}
</style>
