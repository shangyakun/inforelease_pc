<template>
	<div id='wrap'>
    	<syk-header></syk-header>
		<el-container class="e-index">
			
					<syk-menu class='sykmenu' :style='{"height":oHeight+"px"}'></syk-menu>
					<el-container :style='{"height":oHeight+"px"}'>
						<router-view/>
					
					</el-container>
		</el-container>
	</div>
</template>
<script>
	import sykHeader from './header.vue'
	import sykMenu from './slider.vue'
	export default {
		name:'layout',
		data(){
			return {
				oHeight:'',
			}
		},
		components:{
			sykMenu,
			sykHeader
		},
		mounted(){
			this.oHeight = document.body.clientHeight-70||document.documentElement.clientHeight-70;
		}
	}
</script>
<style scoped>
	#wrap{
		overflow: hidden;
		height: 100%;
    	margin: 0 auto;
    	width: 1240px;
    	min-height: auto;
    	box-sizing: border-box;
		position: relative;
	}

	.e-index{
		position: relative;
		margin-top: 70px;
		height: 100%
	}
	.scrollbar{
    	height: 100%;
	}
	.sykmenu{
		overflow-y: scroll;
		box-sizing: border-box;
	    /* position: fixed;
	    top: 0;
	    bottom: 60px;
	    margin-top: 70px;
	    transition: padding-top .3s; */
	}
	.sykmenu::-webkit-scrollbar{
    	width: 0;
    	height: 0;
	}
	/* .footer{
	    position: absolute;
	    z-index: 999;
	    width: 100%;
	    bottom: 0;
	    text-align: center;
	    background: rgba(255,255,255,0.00);
	    height: 59px;
	    line-height: 59px;
	    border-top:1px solid #EDEEF0;
	}
	.footer p{
	    font-size: 12px;
	    color: #C4C7CC;
	} */
</style>

























