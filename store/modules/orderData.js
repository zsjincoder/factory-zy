/***
*订单数据信息
*/
export default {
	state:{
		orderData:{},
		returnOrder:{},//退货信息
		orederState:0,//页面状态 0:订单未生成状态 1.订单已经生成未支付状态 2.订单生成已经支付商家未发货（待发货） 3.订单生成商家发货（待收货） 4.用户确认收货（已完成） 5.用户退款（申请退款中）6.退货中 7.退款成功 8.订单关闭
	},
	getters:{
		// 实时计算订单数据
		getOrderData(state){
			return state.orderData
		},
		// 实时计算订单页面状态
		getOrederState(state){
			return state.orederState
		},
		// 实时计算退货信息
		getReturnOrder(state){
			return state.returnOrder
		},
	},
	mutations:{
		// 设置订单信息
		setOrderData(state,data){
			console.log("我是订单信息")
			console.log(data)
			state.orderData = data;
		},
		// 设置订单页面状态
		setOrderState(state,data){
			state.orederState = data;
		},
		// 设置退货信息
		setReturnOrder(state,data){
			state.returnOrder = data;
		},
	}
}