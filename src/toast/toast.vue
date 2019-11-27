<template>
	<div :class="[showToast?'fadein':'fadeout','toast']">
		<div class="content">
			<img src="./success.png" v-if='type=="success"' alt="">
			<img src="./warning.png" v-if='type=="warning"' alt="">	
			<img src="./error.png" v-if='type=="error"' alt="">	
			<span>{{text}}</span>	
		</div>
	</div>
</template>
<script>
	export default {
		name:'toast',
		data(){
			return {
			}
		}
	}
</script>
<style scoped>
.toast{
    position: fixed;
    left: 50%;
    /* top:80px; */
    z-index: 9999;
    background: #FFFFFF;
	box-shadow: 0 0 12px 0 rgba(0,0,0,0.08);
	border-radius: 25px;
    padding: 15px 40px;
    transform: translate(-50%,-50%);
    color: #3A404C;
    white-space: nowrap;
}
.content{
	display: flex;
	align-items: center;
	font-size: 12px;
}
.content img{
	width: 20px;
	height: 20px;
	margin-right: 8px;
}
.fadein {
    animation: fadein 1s;
      top: 80px;
  }
.fadeout {
    animation: fadeout 3s linear 2s;
    opacity: 0;
}
@keyframes fadein {
    0% {
      top: -200px;
    }
    100%{
      top: 80px;
    }
}
@keyframes fadeout {
    0% {
      opacity: 1;
    }
    100%{
      opacity: 0;
    }
}
</style>







