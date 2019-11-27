<template>
	<!-- <el-aside width="200px" style="height:85vh;background-color: #fff">
    	<el-menu
    		:default-active='defaultActive'
	      	class="sider-menu"
	      	unique-opened
	      	active-text-color="#409EFF">
	      	<el-submenu :index="String(index)" v-for='item,index of menu' :key='index'>
		        <template slot="title">
		          	<span>{{item.category}}</span>
		        </template>
		        <el-submenu :index="String(submenu.id)" v-for='submenu,i of item.childCategory' :key='i'>
		          	<template slot="title">{{submenu.category}}</template>
		          	<el-menu-item :index='String(endmenu.id)' v-for='endmenu,endindex of submenu.childCategory' :key='endindex' @click='handleclick(endmenu.id)'>{{endmenu.category}}</el-menu-item>
		        </el-submenu>
		    </el-submenu>
		    <el-menu-item index="1-1" @click='$router.push({path:"/classify"})'>
	        	<span slot="title">分类管理</span>
	      	</el-menu-item>
		    <el-menu-item index="1-2" @click='$router.push({path:"/release"})'>
	        	<span slot="title">信息发布</span>
	      	</el-menu-item>
    	</el-menu>
  	</el-aside> -->
  	<div class="slider">
  		<ul class="menu paddingleft">
  			<li class="menuitem">
	  			<div class="title" :style='$route.query.category==0?"color:#F10D3B;":""' @click.stop='allInfo'>
					<span class="category_name">全部</span>
				</div>
	  		</li>
  			<li class="menuitem" v-for='item,index of menu' :key='index' >
  				<div class="title" @click.stop='openLevelOneMenu(index)'>
  					<img src="../../assets/img/open.png" :class="item.open?'active open_arrow':'open_arrow'" alt="">	
  					<span class="category_name" :style='$route.query.category==item.id?"color:#F10D3B;":""'>{{item.category}}</span>
  				</div>
  				<ul class="menu" :style='item.open?"height:auto;":"height:0;"'>
	  				<li v-for='submenu,i of item.childrenCategories' :key='i'>	
	  					<div class="second_title" @click.stop='openLevelTwoMenu(index,i)'>
	  						<span class="category_name" :style='$route.query.category==submenu.id?"color:#F10D3B;":""'>{{submenu.category}}</span>
	  					</div>
	  					<!--  @click='openLevelTwoMenu(index,i)' -->
						<ul class="third_menu menu" v-if='submenu.open'>
		  					<li v-for='endmenu,endindex of submenu.childrenCategories' :key='endindex'>
								<div :class="endindex+1==submenu.childrenCategories.length?'third_title third_title_img':'third_title'" :style='$route.query.category==endmenu.id?"color:#F10D3B;":""' @click.stop='openLevelThreeMenu(index,i,endindex)'>
			  						<span class="category_name">{{endmenu.category}}</span>
			  					</div>
		  					</li>
		  				</ul>
  					</li>
  					<!-- <li v-for='submenu,i of item.childrenCategories' v-if='!submenu.childrenCategories.length' :key='i'>	
	  					<div class="second_title" :style='$route.query.category==submenu.id?"color:#F10D3B;":""' @click.stop='openLevelTwoMenu(index,i)'>
	  						<span class="category_name">{{submenu.category}}</span>
	  					</div>
  					</li> -->
  				</ul>
  			</li>
  			<!-- <li  v-if='!item.childrenCategories.length' class="menuitem" v-for='item,index of menu' :key='index'>
	  			<div class="title" :style='$route.query.category==item.id?"color:#F10D3B;":""' @click.stop='openLevelOneMenu(index)'>
					<span class="category_name">{{item.category}}</span>
				</div>
	  		</li> -->
  		</ul>
  	</div>
</template>
<script>
	import api from '../../api/api'
	import utils from '../../utils/utils'
	export default{
		name:'',
		data(){
			return {
				menu:[],
				defaultActive:''
			}
		},
		methods:{
			allInfo(){
				let name = encodeURIComponent('全部');
				this.$router.push({path:"/system",query:{category:'0',categoryname:name}});
			},
			handleclick(id){
				this.$router.push({path:"/system",query:{category:id}})
			},
			getMenu(){
				api('/pc/getCategories','GET',{
					workCode:utils.getCookie('username')||'1489',
				})
				.then(res=>{
					if(res.data.success){
						let menu = res.data.data;
						this.traverseTree(menu);
						this.menu = menu;
						// const id = res.data.data[0].childCategory[0].childCategory[0].id;
						if(!this.$route.query.category){
							let name = encodeURIComponent('全部');
							this.$router.push({path:"/system",query:{category:'0',categoryname:name}});
						};
					}
				})
			},
			openLevelOneMenu(first){
				// let menu = this.menu;
				// this.traverseTree(menu);
				// menu[first].open = !this.menu[first].open;
				// this.menu = menu;
				if(!this.menu[first].childrenCategories.length){
					let menu = this.menu;
					this.traverseTree(menu);
					// menu[first].open = !menu[first].open;
					this.menu = menu;
					let name = encodeURIComponent(this.menu[first].category);
					this.$router.push({
					path:'/system',
						query:{
							category:this.menu[first].id,
							categoryname:name
						}
					});
					return;
				};
				if(!this.menu[first].open){
					// this.menu[first].open = !this.menu[first].open;
					let menu = this.menu;
					this.traverseTree(menu);
					menu[first].open = !menu[first].open;
					this.menu = menu;
				}else{
					let menu = this.menu;
					this.traverseTree(menu);
					this.menu = menu;
				};
			},
			openLevelTwoMenu(first,second){
				if(!this.menu[first].childrenCategories[second].childrenCategories.length){
					// this.menu[first].childrenCategories[second].open = true;
					let name = encodeURIComponent(this.menu[first].childrenCategories[second].category);
					this.$router.push({
						path:'/system',
						query:{
							category:this.menu[first].childrenCategories[second].id,
							categoryname:name
						}
					});
					return;
				}
				this.menu[first].childrenCategories[second].open = !this.menu[first].childrenCategories[second].open;
			},
			openLevelThreeMenu(first,second,third){
				let menu = this.menu;
				for(let i=0;i<menu.length;i++){
					for(let j=0;j<menu[i].childrenCategories.length;j++){
						for(let z=0;z<menu[i].childrenCategories[j].childrenCategories.length;z++){
							menu[i].childrenCategories[j].childrenCategories[z].open = false;
						}
					}
				};
				this.menu = menu;
				this.menu[first].childrenCategories[second].childrenCategories[third].open = true;
				let name = encodeURIComponent(this.menu[first].childrenCategories[second].childrenCategories[third].category);
				this.$router.push({
					path:'/system',
					query:{
						category:this.menu[first].childrenCategories[second].childrenCategories[third].id,
						categoryname:name

					}
				})
			},
			traverseTree(arr){
	            arr = arr;
	            let arr1 = [];
	            for(let i=0,iLen=arr.length;i<iLen;i++){
	            	arr[i].open = false;
	                if(arr[i].childrenCategories&&Array.isArray(arr[i].childrenCategories)){
	                	for(let j=0;j<arr[i].childrenCategories.length;j++){
	            			arr[i].childrenCategories[j].open = false;
	                	};
	                    arr1 = arr[i].childrenCategories;
	            		this.traverseTree(arr1);
	                }else{
	                    return;
	                }
	            };
	        },
	        mousewheel(ev){
	        }
		},
		mounted(){
			this.getMenu();
		}
	}
</script>
<style scoped>
	.slider{
		border: none;
		margin-left: 10px;
		/* background-color: rgb(238, 241, 246) */
	}
	.menu{
		user-select: none;
		height: 100%;
		overflow-x: hidden;
		/* overflow: hidden; */
	}
	.paddingleft{
		overflow-y: scroll;
		padding-top: 20px;
		/* padding-left: 10px; */
	}
	.paddingleft::-webkit-scrollbar{
    	width: 0;
    	height: 0;
	}
	.title{
		line-height: 40px;
		width: 220px;
		cursor: pointer;
		padding-left: 10px;
		height: 40px;
	}
	.title .category_name{
		font-size: 14px;
	}
	.title .open_arrow{
		width: 20px;
		height: 20px;
		vertical-align: middle;
		transform-origin: center center;
		transform: rotateZ(-90deg);
		transition: all linear 0.12s;
	}
	.title .open_arrow.active{
		transform-origin: center center;
		transform: rotateZ(0deg);
		transition: all linear 0.12s;
	}
	.title .category_name{
		display: inline-block;
		vertical-align: middle
	}
	.second_title{
		line-height: 36px;
		cursor: pointer;
		height: 36px;
		padding-left: 44px;
		cursor: pointer;
	}
	.second_title .category_name{
		font-size: 13px;
	}
	.third_menu{
		margin-top: 4px;
		margin-bottom: 10px;	
	}
	.third_title{
		line-height: 36px;
		cursor: pointer;
		height: 36px;
		width: 167px;
		padding-left: 12px;
		margin-left: 51px;
		cursor: pointer;
		background: url('../../assets/img/branch1.png') 0 0 no-repeat;
		background-size: 7px 100%;
	}
	.third_menu .third_title_img{
		background-image: url('../../assets/img/branch2.png');
	}
	.third_title:hover{
		background: #EDEEF0;
	}
	.third_title.active{
		color: #F10D3B;
		/* background: #EDEEF0; */
	}
</style>

























