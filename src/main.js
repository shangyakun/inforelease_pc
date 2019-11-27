// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index.js'
import ELementUI from 'element-ui'
import promise from 'es6-promise'
import store from './store'
// import 'element-ui/lib/theme-chalk/index.css'
import './assets/style/reset.css'
import './assets/style/element-variables.scss'
import api from './api/api'
import toast from './toast/index'
import AMap from 'vue-amap';
import utils from './utils/utils';
router.beforeEach((to, from, next) => {
	if(utils.getCookie('JESSIONID')){
		if(store.state.isAdmin){
			next();
		}else{
			api('/userInfo/token/'+utils.getCookie('JESSIONID'),'GET')
			.then(res=>{
				if(res.data.code==1){
					store.commit('SET_USER');
					next();
				}else{
					window.location = ''
				}
			})
			.catch(error=>{
				window.location = ''
			})
		};
	}else{
		window.location = ''
	}
});
Vue.use(toast)
Vue.use(AMap);
AMap.initAMapApiLoader({
  	// 高德key
  	key: '7a4bdea2e93950704f1200e29502ac8c',
  	// 插件集合 （插件按需引入）
  	plugin: ['AMap.Geolocation','OverView','PlaceSearch']
});
promise.polyfill();
Vue.use(ELementUI);
Vue.config.productionTip = false
new Vue({
  	el: '#app',
  	router,
  	store,
  	components: { App },
  	template: '<App/>'
})

