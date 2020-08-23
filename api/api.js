import http from '@/utils/http.js'
export default {
	// 登录模块注册
	//获取秘钥接口
	auth: (data) => {
		return http.request({
			url: '/terrace/login/auth',
			method: 'post',
			data
		})
	},
	// 首页
	index: (data) => {
		return http.request({
			url: '/terrace/index/index',
			method: 'post',
			data
		})
	},
	// 商品详情页
	goods: (data) => {
		return http.request({
			url: '/terrace/goods/index',
			method: 'post',
			data
		})
	},
	// 加入购物车
	cartAdd: (data) => {
		return http.request({
			url: '/terrace/cart/add',
			method: 'post',
			data
		})
	},
	// 获取购物车列表
	carList: (data) => {
		return http.request({
			url: '/terrace/cart/list',
			method: 'post',
			data
		})
	},
	// 增加/减少/编辑购物车数量
	carEdit: (data) => {
		return http.request({
			url: '/terrace/cart/edit',
			method: 'post',
			data
		})
	},
	// 购物车批量删除
	carDel: (data) => {
		return http.request({
			url: '/terrace/cart/del',
			method: 'post',
			data
		})
	},
	// 结算、立即购买
	orederSettlement: (data) => {
		return http.request({
			url: '/terrace/order/settlement',
			method: 'post',
			data
		})
	},
	// 获取默认收货地址
	addressConfirm: (data) => {
		return http.request({
			url: '/terrace/address/confirm',
			method: 'post',
			data
		})
	},
	// 生成订单
	orderCreate: (data) => {
		return http.request({
			url: '/terrace/order/create',
			method: 'post',
			data
		})
	},
	// 获取订单菜单列表
	orderMenu: (data) => {
		return http.request({
			url: '/terrace/order/menu',
			method: 'post',
			data
		})
	},
	// 获取订单列表
	orderList: (data) => {
		return http.request({
			url: '/terrace/order/list',
			method: 'post',
			data
		})
	},
	// 取消订单
	orderCancel: (data) => {
		return http.request({
			url: '/terrace/order/cancel',
			method: 'post',
			data
		})
	},
	// 订单支持接口
	orderPay: (data) => {
		return http.request({
			url: '/terrace/order/pay',
			method: 'post',
			data
		})
	},
	// 退款
	orderRefund: (data) => {
		return http.request({
			url: '/terrace/order/refund',
			method: 'post',
			data
		})
	},
	// 确认收货
	orderFinish: (data) => {
		return http.request({
			url: '/terrace/order/finish',
			method: 'post',
			data
		})
	},
	// 获取订单详情信息
	orderDetail: (data) => {
		return http.request({
			url: '/terrace/order/detail',
			method: 'post',
			data
		})
	},
	// 延长收货时间
	orderExtend: (data) => {
		return http.request({
			url: '/terrace/order/extend',
			method: 'post',
			data
		})
	},
	// 保存微信用户信息接口
	create: (data) => {
		return http.request({
			url: '/terrace/login/create',
			method: 'post',
			data
		})
	},
	
	// 搜索商品
	search: (data) => {
		return http.request({
			url: '/terrace/index/search',
			method: 'post',
			data
		})
	},
	
	// 模糊搜索
	searchName: (data) => {
		return http.request({
			url: '/terrace/index/search-name',
			method: 'post',
			data
		})
	},
	
	// 获取地址列表
	addressList: (data) => {
		return http.request({
			url: '/terrace/address/list',
			method: 'post',
			data
		})
	},
	
	// 添加收货地址
	addressAdd: (data) => {
		return http.request({
			url: '/terrace/address/add',
			method: 'post',
			data
		})
	},
	// 编辑收货地址
	addressEdit: (data) => {
		return http.request({
			url: '/terrace/address/edit',
			method: 'post',
			data
		})
	},
	// 删除收货地址
	addressDel: (data) => {
		return http.request({
			url: '/terrace/address/del',
			method: 'post',
			data
		})
	},
	// 获取厂家信息
	factoryInfo: (data) => {
		return http.request({
			url: '/terrace/factory/index',
			method: 'post',
			data
		})
	},
	// 获取商品信息
	factoryGoods: (data) => {
		return http.request({
			url: '/terrace/factory/goods',
			method: 'post',
			data
		})
	},
	// 获取分享码
	shareCode: (data) => {
		return http.request({
			url: '/terrace/personal/share',
			method: 'post',
			data
		})
	},
	// 获取收益余额
	commissionBalance: (data) => {
		return http.request({
			url: '/terrace/commission/balance',
			method: 'post',
			data
		})
	},
	// 获取收益列表
	commissionList: (data) => {
		return http.request({
			url:'/terrace/commission/list',
			method: 'post',
			data
		})
	},
	// 厂家内的模糊搜索
	factorySearchName: (data) => {
		return http.request({
			url:'/terrace/factory/search-name',
			method: 'post',
			data
		})
	},
	// 获取客服电话
	personalContact: (data) => {
		return http.request({
			url:'/terrace/personal/contact',
			method: 'post',
			data
		})
	},
	// 佣金提现
	commissionWithdrawal: (data) => {
		return http.request({
			url:'/terrace/commission/withdrawal',
			method: 'post',
			data
		})
	},
	// 佣金提现记录
	commissionWithdrawalList: (data) => {
		return http.request({
			url:'/terrace/commission/withdrawal-list',
			method: 'post',
			data
		})
	},
	// 获取手册列表
	personalManual: (data) => {
		return http.request({
			url:'/terrace/personal/manual',
			method: 'post',
			data
		})
	},
	// 获取手册详情
	personalContact: (data) => {
		return http.request({
			url:'/terrace/personal/contact',
			method: 'post',
			data
		})
	},
	// 帮助中心
	personalSupport: (data) => {
		return http.request({
			url:'/terrace/personal/support',
			method: 'post',
			data
		})
	},
}