import axios from '@/js_sdk/gangdiedao-uni-axios'
// import store from '@/store/index.js'
// import gettoken from '@/utils/getlogin.js'
import qs from 'qs'
import config from '@/config'

const baseURL = process.env.NODE_ENV === 'development' ? config.baseURL.dev : config.baseURL.pro;

/**
 * 请求接口日志记录
 */
function _reqlog(req) {
	if (process.env.NODE_ENV === 'development') {
		// console.log("请求地址：" + req.url, req.data || req.params)
	}
	//TODO 调接口异步写入日志数据库
}

/**
 * 响应接口日志记录
 */
function _reslog(res) {
	if (process.env.NODE_ENV === 'development') {
		// console.log(`${res.config.url}响应结果：`, res)
	}
}


// 创建自定义接口服务实例
const http = axios.create({
	// baseURL: [baseURL],
	timeout: 6000, // 不可超过 manifest.json 中配置 networkTimeout的超时时间
	// #ifdef H5
	withCredentials: true,
	// #endif
	baseURL,
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'AUTHORIZATION': '',
		'CREDENTIAL': ''
		// 'Content-Type': 'application/json',
		//'X-Requested-With': 'XMLHttpRequest',
	},
	transformRequest: [function(data) {
		data = qs.stringify(data);
		return data;
	}],
})

// 拦截器 在请求之前拦截
http.interceptors.request.use(config => {
	// code...
	// 戴上token信息
	 // let flag = store.state.loadingState.loadingStates;
	 // console.log(flag);
	// if(flag){
	// 		uni.showLoading({
	// 		    title: '加载中'
	// 		});
	// }
	let userInfo = uni.getStorageSync('user_info');
	console.log(userInfo)
	if (userInfo.token) {
		config.headers.AUTHORIZATION = 'terrace_'+userInfo.token;
		config.headers.CREDENTIAL = 'terrace_'+userInfo.user_id;
	}
	_reqlog(config)
	return config
})

// 拦截器 在请求之后拦截
http.interceptors.response.use(response => {
	_reslog(response)
	 // uni.hideLoading();//全局加载效果取消
	 console.log(response)
	// if (response.data.errno === 4008) {
	// 	uni.clearStorageSync('user_info');
	// 	uni.showToast({
	// 		title: '身份验证失效请重新登录',
	// 		duration: 1000,
	// 		icon: "none"
	// 	});
	// 	setTimeout(()=>{
	// 		uni.switchTab({
	// 			url: '/pages/mine/mine'
	// 		})
	// 	},1000)
	// }else if(response.data.errno === 4009){
	// 	uni.clearStorageSync('user_info');
	// 	uni.showToast({
	// 		title: '请先登录',
	// 		duration: 1000,
	// 		icon: "none"
	// 	});
	// 	setTimeout(()=>{
	// 		uni.switchTab({
	// 			url: '/pages/mine/mine'
	// 		})
	// 	},1000)
	// }
	// code...
	// 获取cookie
	//    let headerStr = JSON.stringify(response.headers)
	// console.log(headerStr);
	// let cookie = (/(?:Set-Cookie).+;/.exec(headerStr)[0]).replace(/Set-Cookie|:|"/g, "")
	// if (cookie) {
	// uni.setStorage({
	// key: 'cookie',
	// data: cookie.split(';')[0]
	// })
	// }
	return response
}, error => {
	uni.hideLoading();
	return Promise.reject(error.message)
})

export default http
