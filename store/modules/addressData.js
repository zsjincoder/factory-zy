/***
*收货地址信息
*/
export default {
	state:{
		addressData:{},
		addressState:0
	},
	getters:{
		// 实时计算收货地址信息
		getAddressData(state){
			return state.addressData
		},
		// 实时计算收货地址状态
		getAddressState(state){
			return state.addressState
		},
	},
	mutations:{
		// 设置收货地址信息
		setAddressData(state,data){
			state.addressData = data;
		},
		// 设置收货地址状态
		setAddressState(state,data){
			state.addressState = data;
		}
	}
}