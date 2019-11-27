import Vue from 'vue'
import Vuex from 'vuex'
import api from '../api/api'
import utils from '../utils/utils'
Vue.use(Vuex)
export default new Vuex.Store({
	state:{
		isAdmin:false,
	},
	getters:{
		changeAdmin: state => {
	      return state.isAdmin
	    }
	},
	actions:{
		CHECKE_USER({commit}){
			commit('SET_USER');
		},
	},
	mutations:{
		SET_USER(state){
			state.isAdmin = true;
		},
	}
})
 
