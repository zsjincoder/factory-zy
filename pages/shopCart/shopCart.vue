<template>
    <view>
        <!-- 全选 -->
        <view class="s-fixed" v-if="sotreList.length != 0">
            <view class="select-all pub-padd">
                <view class="pub-flex">
                    <view @click="selectall()">
                        <image class="s-image"
                               :src="allSelect?'/static/img/shopCar/selected.png':'/static/img/shopCar/no-selected.png'"></image>
                    </view>
                    <text class="s-all">全选</text>
                </view>
                <view class="s-edeit" style="color: #ED494C;" @click="setState()">{{state?'完成':'编辑'}}</view>
                <!-- <view class="s-edeit" @click="setState()"></view> -->
            </view>
        </view>
        <!-- 空白页 -->
        <empty v-if="sotreList.length === 0"></empty>
        <!-- 店铺列表 -->
        <view style="margin-bottom: 124rpx;margin-top:107rpx ;">
            <view class="stroe-list" v-for="(item,index) in sotreList" :key="index">
                <view class="select-all pub-padd">
                    <view class="pub-flex">
                        <view @click="selectedStore(index)">
                            <image class="s-image"
                                   :src="item.selected?'/static/img/shopCar/selected.png':'/static/img/shopCar/no-selected.png'"></image>
                        </view>
                        <text class="s-all">{{item.factory_name}}</text>
                        <image class="s-select" src="/static/img/mine/arrow-right.png"></image>
                    </view>
                    <!-- 			<view class="s-edeit">编辑</view> -->
                </view>
                <view class="product-list">
                    <!-- 商品 -->
                    <view v-for="(val,key) in item.content" :key="key">
                        <view class="product pub-padd" :style="{background:val.isQualified == false?'#FFF4F5':'#fff'}">
                            <view class="pub-flex">
                                <view @click="selectedProduct(index,key)" style="height: 100%;">
                                    <image class="s-image"
                                           :src="val.selected?'/static/img/shopCar/selected.png':'/static/img/shopCar/no-selected.png'"></image>
                                </view>
                                <image :src="val.goods_cover_img" class="s-image1"></image>
                            </view>
                            <view class="s-desc">
                                <view>{{val.goods_name}}</view>
                                <view v-if="val.isQualified == false" style="color: red;margin-top: 20rpx;">
                                    起批数量为{{val.goods_start_quantity}}
                                </view>
                            </view>
                        </view>
                        <!-- 型号列表 -->
                        <view class="product pub-padd" style="padding-bottom: 10rpx;" v-for="(v,i) in val.content"
                              :key="i">
                            <view class="pub-flex">
                                <view @click="selectedOneProduct(index,key,i)">
                                    <image class="s-image"
                                           :src="v.selected?'/static/img/shopCar/selected.png':'/static/img/shopCar/no-selected.png'"></image>
                                </view>
                                <view class="model-box pub-flex">
                                    <view>
                                        <view class="m-desc">{{v.standard_name}}</view>
                                        <view class="m-price">
                                            <view :class="v.cart_number >= v.goods_wholesale_quantity?'m-through':''">
                                                <text :style="{color:v.cart_number >= v.goods_wholesale_quantity?'#ccc':'red'}">
                                                    ¥{{v.goods_retail_price}}
                                                </text>
                                                /{{val.goods_unit}}
                                            </view>
                                            <view style="margin-left: 20rpx;"
                                                  v-if="v.cart_number >= v.goods_wholesale_quantity">
                                                <text>¥{{v.goods_trade_price}}</text>
                                                /{{val.goods_unit}}
                                            </view>
                                        </view>
                                    </view>
                                    <uni-number-box :min="1" :value="v.cart_number" @change="change" :index1="index"
                                                    :index2="key" :index3="i"></uni-number-box>
                                </view>
                            </view>
                        </view>

                    </view>
                    <!-- 合计 -->
                    <view class="total">
                        <!-- <view class=""></view> -->
                        <view class="t-desc">共{{item.selectedNum}}件
                            <text>¥{{item.selectedPrice}}</text>
                        </view>
                    </view>
                </view>
            </view>

        </view>
        <!-- 结算按钮 -->
        <view v-if="state == false" class="settlement">
            <view style="margin-left: 32rpx;">
                <view class="s-desc">总计：
                    <text>¥{{allprice}}</text>
                </view>
                <view class="s-sum">共{{totalNumber}}件,不含运费</view>
            </view>
            <view class="s-button" :style="{background:selectNum>0?'#ED494C':'#CECECE'}" @click="settement">结算</view>
        </view>
        <!-- 删除按钮 -->
        <view v-else class="settlement">
            <view style="margin-left: 32rpx;">
                <view class="s-desc">已选择（{{selectNum}}）</view>
            </view>
            <view class="s-button"
                  :style="{background:selectNum>0?'#ED494C':'#CECECE'}"
                  @click="isDelete()">删除
            </view>
        </view>
        <!-- 删除提示弹窗 -->
        <uni-popup ref="remaks" :maskClick="maskFlag" type="center">
            <view class="remaks-box">
                <view class="title">确认是否删除商品</view>
                <view class="btn-group">
                    <view class="cancel-btn" @click="close">取消</view>
                    <view class="define-btn" @click="cartDelete()">确定</view>
                </view>
            </view>
        </uni-popup>
        <!-- 气泡提示弹窗 -->
        <mpopup ref="mpopup" :isdistance="true"></mpopup>
    </view>
</template>

<script>
    import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
    import empty from "@/components/empty";
    import uniPopup from '@/components/uni-popup/uni-popup.vue'
    import mpopup from '@/components/xuan-popup/xuan-popup.vue'
    import {
        mapGetters,
        mapMutations
    } from "vuex"

    export default {
        components: {
            uniNumberBox,
            uniPopup,
            mpopup,
            empty
        },
        data() {
            return {
                maskFlag: false, //删除弹窗控制变量
                allSelect: false, //全选
                selectNum: 0, //选中数
                totalNumber: 0, //计算总数
                allprice: 0, //计算总价
                state: false,
                sotreList: [],
                userInfo: []
            }
        },
        onShow() {
            this.allSelect = false,
                this.selectNum = 0, //选中数
                this.totalNumber = 0, //计算总数
                this.allprice = 0, //计算总价
                this.state = false,
                // this.getCartData();
                this.userInfo = uni.getStorageSync('user_info')
            if (this.userInfo.token) {
                this.getCartData();
            } else {
                uni.showToast({
                    title: '还未登录，请先登录',
                    duration: 1000,
                    icon: 'none'
                })
                setTimeout(res => {
                    uni.switchTab({
                        url: '/pages/mine/mine'
                    })
                }, 1000)
            }

        },
        methods: {
            ...mapMutations({
                setOrderData: 'setOrderData',
                setShopNum: 'setShopNum',
                setOrderState: 'setOrderState'
            }),
            // 批量删除
            cartDelete() {
                let cartData = [];
                this.sotreList.map((item, index) => {
                    item.content.map((val, key) => {
                        let data = val.content.filter(item => item.selected == true)
                        cartData = [...cartData, ...data];
                    })
                })
                let carts = [];
                cartData.map((item, index) => {
                    carts.push(item.cart_id)
                })
                this.$api.carDel({
                    carts: carts
                }).then(res => {
                    if (res.data.errno == 0) {
                        uni.showToast({
                            title: '删除成功',
                            duration: 1000,
                            icon: "none"
                        });
                        this.allSelect = false,
                            this.selectNum = 0, //选中数
                            this.$refs['remaks'].close();
                        this.getCartData();
                    }
                })
            },
            // 获取购物车数据
            getCartData() {
                this.$api.carList().then(res => {
                    console.log(res);
                    if (res.data.errno == 0) {
                        this.sotreList = res.data.data.list;
                        this.sotreList.map((item, index) => {
                            item.selected = false,
                                item.selectedNum = 0, //以店铺为单位计算选中数量
                                item.selectedPrice = 0, //已店铺为单位计算选中数量
                                item.content.map((val, key) => {
                                    val.selected = false,
                                        val.isQualified = true, //商品是否通过起批数量
                                        val.content.map((v, i) => {
                                            v.selected = false
                                        })
                                })
                        })
                    } else if (res.data.errno === 400 || res.data.errno === 4008 || 4009) {
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
                        })
                        setTimeout(() => {
                            uni.switchTab({
                                url: '/pages/mine/mine'
                            })
                        }, 1000)
                    }
                })
            },
            // 增减购买数量
            change(e) {
                console.log(e);
                let data = {
                    number: Number(e.num),
                    cart_id: this.sotreList[e.index1].content[e.index2].content[e.index3].cart_id
                }
                this.$api.carEdit(data).then(res => {
                    console.log(res);
                    if (res.data.errno == 0) {
                        this.$set(this.sotreList[e.index1].content[e.index2].content[e.index3], 'cart_number', Number(e.num));
                        this.calculatePrice();
                    }
                })
            },
            // 计算总价、总件数、以店铺为单位计算总价/总件数
            calculatePrice() {
                this.allprice = 0;
                this.totalNumber = 0;
                this.sotreList.map((item, index) => {
                    let sumPrice = 0;
                    let sum = 0;
                    item.content.map((val, key) => {
                        val.content.map((v, i) => {
                            if (v.selected == true) {
                                if (v.cart_number >= v.goods_wholesale_quantity) {
                                    this.allprice += v.goods_trade_price * v.cart_number //计算总价
                                    sumPrice += v.goods_trade_price * v.cart_number; //以店铺为单位计算总价
                                    console.log("我的id", i)
                                    console.log("我是单个型号商品价格", v.goods_trade_price * v.cart_number)
                                } else {
                                    this.allprice += v.goods_retail_price * v.cart_number //计算总价
                                    sumPrice += v.goods_retail_price * v.cart_number; //以店铺为单位计算总价
                                    console.log("我的id", i)
                                    console.log("我是单个型号商品价格", v.goods_trade_price * v.cart_number)
                                }
                                this.totalNumber += v.cart_number; //计算总件数
                                sum += v.cart_number; //以店铺为单位计算总件数
                            }
                        })
                    })
                    console.log("我是价格", sumPrice);
                    item.selectedPrice = sumPrice.toFixed(2);
                    item.selectedNum = sum;
                })
                this.allprice = this.allprice.toFixed(2);
            },
            // 编辑状态切换
            setState() {
                this.state = !this.state;
                this.allSelect = false;
                this.clearSelect(); //清空数组商品的选中状态
            },
            // 全选
            selectall() {
                this.allSelect = !this.allSelect;
                // 让所有商品处于选中状态
                this.sotreList.map((item, index) => {
                    item.selected = this.allSelect;
                    item.content.map((val, key) => {
                        val.selected = this.allSelect;
                        val.content.map((v, i) => {
                            v.selected = this.allSelect;
                        })
                    })
                })
                // 设置选中数量
                this.selectNum = this.getSelected();
                // 计算总价
                this.calculatePrice();
            },
            // 店铺全选
            selectedStore(index) {
                this.$set(this.sotreList[index], "selected", !this.sotreList[index].selected)
                // 让店铺下的所有商品处于选中状态
                this.sotreList[index].content.map((item, i) => {
                    item.selected = this.sotreList[index].selected;
                    item.content.map((val, key) => {
                        val.selected = this.sotreList[index].selected
                    })
                })
                if (this.sotreList[index].selected == false) {
                    this.allSelect = false;
                }
                this.setSelectAll();
                // 设置选中数量
                this.selectNum = this.getSelected();
                // 计算总价
                this.calculatePrice();
            },
            // 商品型号全选
            selectedProduct(index1, index2) {
                this.$set(this.sotreList[index1].content[index2], "selected", !this.sotreList[index1].content[index2].selected)
                if (this.sotreList[index1].content[index2].selected == false) {
                    // 子有一个没有选中让父处于为未选中状态
                    this.$set(this.sotreList[index1], "selected", false);
                    this.allSelect = false;
                }
                this.sotreList[index1].content[index2].content.map((item, index) => {
                    item.selected = this.sotreList[index1].content[index2].selected;
                })

                this.setSelectAll();
                // 设置选中数量
                this.selectNum = this.getSelected();
                // 计算总价
                this.calculatePrice();
            },
            // 选中单一一个
            selectedOneProduct(index1, index2, index3) {
                this.$set(this.sotreList[index1].content[index2].content[index3], "selected", !this.sotreList[index1].content[
                    index2].content[index3].selected);
                if (this.sotreList[index1].content[index2].content[index3].selected == false) {
                    this.$set(this.sotreList[index1], "selected", false);
                    this.$set(this.sotreList[index1].content[index2], "selected", false);
                    this.allSelect = false;
                }
                // 判断是父以及更上一层是否全选，是就将父/更上一层处于选中状态
                this.setSelectAll();
                // 设置选中数量
                this.selectNum = this.getSelected();
                // 计算总价
                this.calculatePrice();
            },
            // 获取处于选中状态的商品数量
            getSelected() {
                let s = 0;
                this.sotreList.map((item, index) => {
                    item.content.map((val, key) => {
                        let data = val.content.filter(value => value.selected == true);
                        s += data.length;
                    })
                })
                return s
            },
            // 判断是否全选
            setSelectAll() {
                this.sotreList.map((item, index) => {
                    item.content.map((val, key) => {
                        let data = val.content.filter(item => item.selected == false);
                        if (data.length == 0) {
                            val.selected = true
                        }
                    })
                    let data1 = item.content.filter(val => val.selected == false)
                    if (data1.length == 0) {
                        item.selected = true
                    }
                })
                let data2 = this.sotreList.filter(item => item.selected == false);
                if (data2.length == 0) {
                    this.allSelect = true
                }
            },
            // 结算
            settement() {
                let flag = false;
                let count = 0;
                this.sotreList.map((item, index) => {
                    item.content.map((val, key) => {
                        let sum = 0;
                        let data = val.content.filter(data => data.selected == true);
                        if (data.length != 0) {
                            data.map((v, i) => {
                                sum += v.cart_number;
                            })
                            if (sum < val.goods_start_quantity) {
                                // this.$nextTick(()=>{
                                console.log("不能结算")
                                this.$set(this.sotreList[index].content[key], "isQualified", false);
                                // console.log(this.sotreList[index].content[key].isQualified)
                                this.$forceUpdate();
                                count++;
                                flag = true
                                // })
                            } else {
                                this.$set(this.sotreList[index].content[key], "isQualified", true);
                                this.$forceUpdate();
                                val.isQualified = true;
                            }
                        } else {
                            val.isQualified = true;
                        }
                    })
                })
                if (flag) {
                    let str = '有' + count + '种商品不符合下单要求'
                    this.$refs.mpopup.open({
                        type: 'warn',
                        content: str,
                        timeout: 2000,
                        isClick: false
                    });
                } else {
                    // 符合结算条件，调用结算函数进行结算
                    this.settementCart();
                }
            },
            // 结算购物车接口
            settementCart() {
                console.log(this.sotreList);
                let data = [];
                this.sotreList.map((item, index) => {
                    item.content.map((val, key) => {
                        val.content.map((v, i) => {
                            if (v.selected == true) {
                                data.push({
                                    goods_id: val.goods_id,
                                    num: v.cart_number,
                                    standard_id: v.standard_id
                                })
                            }
                        })
                    })
                })
                this.$api.orederSettlement({
                    commodity: data
                }).then(res => {
                    if (res.data.errno == 0) {
                        console.log(res);
                        this.setOrderData(res.data.data); //将订单信息存入vuex中
                        this.setOrderState(0);//将订单页面状态设置为未生成订单状态
                        uni.navigateTo({
                            url: '/pages/index/confirmOrder/confirmOrder'
                        })
                    }
                })
            },
            // 清空数组选中状态
            clearSelect() {
                this.selectNum = 0, //选中数
                    this.totalNumber = 0, //计算总数
                    this.allprice = 0, //计算总价
                    this.sotreList.map((item, index) => {
                        item.selected = false;
                        item.selectedNum = 0, //以店铺为单位计算选中数量
                            item.selectedPrice = 0, //已店铺为单位计算选中数量
                            item.content.map((val, key) => {
                                val.selected = false;
                                val.isQualified = true;
                                val.content.map((v, i) => {
                                    v.selected = false
                                })
                            })
                    })
            },
            // 删除弹窗
            isDelete() {
                this.$refs['remaks'].open();
            },
            // 取消关闭弹窗
            close() {
                this.$refs['remaks'].close();
            },
        }
    }
</script>

<style lang="scss">
    .pub-padd {
        padding: 0 32 rpx;
        box-sizing: border-box;
    }

    page {
        background: #FFFFFF;
    }

    .pub-flex {
        display: flex;
        align-items: center;
    }

    .s-fixed {
        z-index: 3;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
    }

    .select-all {
        width: 100%;
        background: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 106 rpx;
        font-size: 30 rpx;
        position: relative;

        &.select-all:after {
            position: absolute;
            z-index: 1;
            left: 0;
            right: 0;
            height: 0;
            content: '';
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
            border-bottom: 1px solid #E4E7ED;
            bottom: 0;
        }

        .s-all {
            color: rgba(34, 34, 34, 1);
        }

        .s-edeit {
            color: rgba(237, 73, 76, 1);
        }

        .s-image {
            width: 40 rpx;
            height: 40 rpx;
            margin-right: 32 rpx;
        }

        .s-select {
            width: 32 rpx;
            height: 32 rpx;
            margin-left: 20 rpx;
        }
    }

    .stroe-list {
        width: 100%;
        margin-bottom: 16 rpx;
    }

    // 店铺列表
    .product-list {
        width: 100%;
        background: #FFFFFF;

        .product {
            width: 100%;
            display: flex;
            align-items: center;
            font-size: 30 rpx;
            position: relative;
            padding-top: 30 rpx;
            padding-bottom: 30 rpx;

            .s-desc {
                font-size: 28 rpx;
                margin-left: 32 rpx;
                color: rgba(34, 34, 34, 1);
            }

            .model-box {
                width: 614 rpx;
                height: 148 rpx;
                background: rgba(250, 250, 250, 1);
                padding: 0 32 rpx;
                font-size: 24 rpx;
                justify-content: space-between;

                .m-desc {
                    color: rgba(153, 153, 153, 1);
                }

                .m-price {
                    margin-top: 16 rpx;
                    display: flex;

                    .m-through {
                        text-decoration: line-through;
                        color: #CCCCCC;
                    }

                    text {
                        color: #ED494C;
                    }
                }
            }

            .s-image {
                width: 40 rpx;
                height: 40 rpx;
                margin-right: 32 rpx;
            }

            .s-image1 {
                width: 160 rpx;
                height: 160 rpx;
                border-radius: 8 rpx;
            }

            .s-select {
                width: 32 rpx;
                height: 32 rpx;
                margin-left: 20 rpx;
            }
        }

        .total {
            margin-top: 20 rpx;
            width: 100%;
            padding: 0 32 rpx;
            font-size: 24 rpx;
            color: rgba(34, 34, 34, 1);

            .t-desc {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                position: relative;
                padding: 32 rpx 0;

                text {
                    color: #ED494C;
                    margin-left: 20 rpx;
                }

                &.t-desc:after {
                    position: absolute;
                    z-index: 1;
                    left: 0;
                    right: 0;
                    height: 0;
                    content: '';
                    -webkit-transform: scaleY(0.5);
                    transform: scaleY(0.5);
                    border-bottom: 1px solid #E4E7ED;
                    top: 0;
                }
            }
        }
    }

    // 结算按钮
    .settlement {
        z-index: 3;
        width: 100%;
        height: 108 rpx;
        border-top: 2 rpx solid #E4E7ED;
        // border-bottom: 2rpx solid #E4E7ED;
        position: fixed;
        bottom: 0;
        left: 0;
        background: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .s-desc {
            font-size: 28 rpx;
            color: rgba(34, 34, 34, 1);

            text {
                // font-size:24rpx;
                color: rgba(237, 73, 76, 1);
            }
        }

        .s-sum {
            color: rgba(153, 153, 153, 1);
            font-size: 22 rpx;
        }

        .s-button {
            width: 214 rpx;
            height: 100%;
            background: #CECECE;
            color: #FFFFFF;
            font-size: 30 rpx;
            text-align: center;
            line-height: 105 rpx;
        }
    }

    // 删除弹窗
    .remaks-box {
        width: 568 rpx;
        background: #FFFFFF;
        border-radius: 8 rpx;

        .title {
            height: 168 rpx;
            line-height: 168 rpx;
            text-align: center;
            font-size: 28 rpx;
            font-weight: 500;
            color: $font-color;
            border-bottom: 2 rpx solid #EEEEEE;
            box-sizing: border-box;
        }

        .btn-group {
            display: flex;
            height: 106 rpx;

            .cancel-btn,
            .define-btn {
                width: 50%;
                line-height: 106 rpx;
                font-size: 28 rpx;
                text-align: center;
            }

            .cancel-btn {
                color: #999999;
            }

            .define-btn {
                border-left: 2 rpx solid #EEEEEE;
                box-sizing: border-box;
                color: #ED494C;
            }
        }
    }
</style>
