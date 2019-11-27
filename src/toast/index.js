import Vue from 'vue';
import ToastComponent from './toast.vue'
const Toast  = Vue.extend(ToastComponent);
function showToast(info,duration=2000) {
	const toastDom = new Toast({
		'el':document.createElement('div'),
		data(){
			return {
				text:info.message,
				type:info.type,
				showToast:true,
				shows:true,
			}
		}
	});
	document.body.appendChild(toastDom.$el);
	setTimeout(() => {toastDom.showToast = false} ,duration-500)
  	setTimeout(() => {toastDom.shows = false;document.body.removeChild(toastDom.$el);} ,duration)
};
function registryToast() {
  	Vue.prototype.$toast = showToast;
}
export default registryToast
