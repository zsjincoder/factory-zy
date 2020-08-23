/***
*购物车数据
*/
export default {
	state:{
		shopNum:0,
	},
	getters:{
		// 实时计算购物车数量
		getshopNum(state){
			return state.shopNum
		},
	},
	mutations:{
		// 设置食材分类列表数据
		setShopNum(state,data){
			state.shopNum = data;
		},
	}
}