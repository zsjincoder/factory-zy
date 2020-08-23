import Vue from 'vue'
import App from './App'
// 挂载vuex
import store from './store'  
Vue.prototype.$store = store 

Vue.config.productionTip = false

import api from './api/api.js'
//定义全局变量
Vue.prototype.$api = api;

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
