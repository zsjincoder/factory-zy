
import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from "vuex-persistedstate"
import shopCart from "./modules/shopCart.js"
import orderData from "./modules/orderData.js"
import addressData from "./modules/addressData.js"
Vue.use(Vuex)
const store = new Vuex.Store({
	  // plugins: [createPersistedState({
	  //     storage: sessionStorage
	  // })],
	  modules:{
		shopCart,
		orderData,
		addressData
	  }
})  
export default store