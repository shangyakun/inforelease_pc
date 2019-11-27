<template>
	<div class="scroll" :style='{"height":oHeight+"px"}'>
		<div class="container" :style='{"minHeight":oHeight-120+"px"}'>
			<h2 class="header">
				<span>{{title}}</span>
			</h2>
			<div class="form clear" >
				<el-date-picker
			      v-model="date"
			      type="daterange"
			      class='fl daterange'
			      size='mini'
			      range-separator="至"
			      start-placeholder="开始日期"
			      end-placeholder="结束日期">
			    </el-date-picker>
			    <el-select v-model="msgType" class='fl select' placeholder="请选择分类">
				    <el-option value='' label="全部"></el-option>
				    <el-option value='1' label="普通文档"></el-option>
	                <el-option value='2' label="图文消息"></el-option>
	                <el-option value='3' label="H5页面"></el-option>
				</el-select>
				<el-input
					class='fl'
					style='width: 240px;margin-left: 20px;'
				  	placeholder="请输入关键字"
				  	v-model="keyWords"
				  	@keyup.enter.native='query'
				  	clearable>
				</el-input>
				<a href='javascript:;' class="fl button" @click='query'>查询</a>
			</div>
			<div class="main">
				<ul class="list" v-if='list.length'>
					<li class="item clear" :style='index+1==list.length?"border:none":""' v-for='item,index of list' :key='index' @click='toDetail(item.uuid)'>
						<div class="doc_type fl">
							<img v-if='item.msgType!=3' class="doc" src="../../assets/img/ordinary_doc.png" alt="">
							<img v-else class="doc" src="../../assets/img/h5.png" alt="">
						</div>
						<div class="infos fl">
							<div class="title">
								<span class="top" v-if='item.goTop==1'>置顶</span><span class="name" v-html='item.title'></span><img v-if='item.attachmentCount' src="../../assets/img/annex_default.png" alt="">
							</div>
							<div class="other">
								<span class="manage">{{item.creater}}</span>
								<span>&nbsp;·&nbsp;</span>
								<span class="time">发布于{{item.updateDate}}</span>
							</div>
						</div>
						<div class="likes fr">
							<span class="action">
								<img src="../../assets/img/eye.png" alt=""><span class="count">{{item.seeCount?item.seeCount:0}}</span>
							</span>
							<span class="action">
								<img src="../../assets/img/comment.png" alt=""><span class="count">{{item.commentCount?item.commentCount:0}}</span>
							</span>
						</div>
					</li>
				</ul>
				<div class="" style='text-align: center;' v-if='!list.length'>暂无数据</div>
			</div> 
			<el-pagination
			  background
			  class='page'
	  		  @current-change="handleCurrentChange"
			  layout="prev, pager, next"
			  :current-page="pageNum+1"
			  v-if='totalCount'
			  :total="totalCount">
			</el-pagination>
			<div class="footer">
		        <p>Copyright © 2016 - 2019 YUNJI. All Rights Reserved. 云集 版权所有</p>
		    </div>
		</div>
	</div>

</template>
<script>
	import api from '../../api/api'
	import utils from '../../utils/utils'
	export default {
		name:'',
		data(){
			return {
				totalCount:0,//总数量
				list:[],
				msgType:'',//文档类型
				date:[],//开始结束日期
		        keyWords:'',//关键词
		        title:'',
		        category:'',//分类id
		        pageNum:0,
		        pageSize:10,
		        oHeight:'',
			}
		},
		watch:{
			$route(to,from){
				// this.title = '';
				// this.workcodeOrName = '';
				// this.status = '';
				// this.startTime = '';
				// this.endTime = '';
				// this.pageSize = 10;
				// this.pageNum = 1;
			}
		},
		beforeRouteUpdate(to,from,next){
			this.keyWords = '';
			this.msgType = '';
			this.title = '';
			this.pageSize = 10;
			this.date = [];
			this.pageNum = 0;
			if(to.query.category==0||to.query.category){
				this.category = to.query.category;
				this.title = decodeURIComponent(to.query.categoryname);
				this.getArticleList();
			};
			next();
		},
		methods:{
			query(){
				this.pageNum = 0;
				this.getArticleList();
			},
			toDetail(id){
				// this.$router.push({
				// 	path:'/detail',
				// 	query:{
				// 		uuid:id
				// 	}
				// })
				let routeUrl = this.$router.resolve({
			          	path:'/detail',
						query:{
							uuid:id
						}
			     	});
			    window.open(routeUrl .href, '_blank');
			},
			handleCurrentChange(val){
				this.pageNum = val-1;
				this.getArticleList();
			},
			getArticleList(){
				let date1 = '';
				let date2 = '';
				if(this.date&&this.date.length>0){
					date1 = new Date(this.date[0]).getTime();
					date2 = new Date(this.date[1]).getTime()+24*60*60*1000;
				};
				api('/pc/list','GET',{
					category:this.category==0?'':this.category,
					query:this.keyWords,
					pageNum:this.pageNum,
					pageSize:this.pageSize,
					from:date1,
					to:date2,
					msgType:this.msgType,
					workCode:utils.getCookie('username')
				})
				.then(res=>{
					if(res.data.success&&res.data.data){
						this.totalCount = res.data.data.slice(0,1)[0].total;
						res.data.data.splice(0,1);
						if(this.keyWords&&this.totalCount>0){
							let data = res.data.data;
							for(let i=0;i<res.data.data.length;i++){
								if(Array.isArray(data[i].title)){
									data[i].title = data[i].title[0];
								}else{
									data[i].title = data[i].title
								}
							};
							this.list = data;
							return;
						};
						this.list = res.data.data;

					}
				})
			},
		},
		mounted(){
			this.oHeight = document.body.clientHeight-70||document.documentElement.clientHeight-70;
			if(this.$route.query.category){
				this.category = this.$route.query.category;
				this.getArticleList();
				this.title = decodeURIComponent(this.$route.query.categoryname);
			};
		}
	}
</script>
<style scoped>
	.scroll{
		overflow-y: scroll;
		padding: 20px 20px 0 20px;
		box-sizing: border-box;
	}
	.scroll::-webkit-scrollbar{
    	width: 0;
    	height: 0;
	}
	.container{
		width: 100%;
		padding-bottom: 100px;
		position: relative;
	}
	.header{
		line-height: 60px;
		height: 60px;
		font-family: PingFangSC-Medium;
		font-size: 16px;
		color: #3A404C;
		border-bottom:1px solid #EDEEF0;
	}
	.header span{
		border-bottom: 1px solid #333;
		line-height: 59px;
		letter-spacing: -0.38px;
		display: inline-block
	}
	.form{
		padding: 16px 18px;
		background: #fff;
		margin-top: 16px;
		border-radius: 4px;
		border: 1px solid #EDEEF0;
	}
	.select{
		margin-left: 20px;
	}
	.button{
		text-align: center;
		height: 32px;
		color: #fff;
		width: 80px;
		margin-left: 20px;
		line-height: 32px;
		background: #F10D3B;
		font-size: 14px;
		box-shadow: 0 1px 0 0 #EDEEF0;
		border-radius: 3px;
		cursor: pointer;
	}
	.main{
		background: #fff;
		padding: 20px 24px;
		margin-top: 10px;
		border-radius: 4px;
		border: 1px solid #EDEEF0;
	}
	
	.item{
		margin-top:4px;
		cursor: pointer;
		border-bottom: 1px solid #f5f6f8;
		padding: 12px 0 11px;
	}
	.list li:nth-child(1) {
		margin-top:0px;
	}
	.doc_type{
		height: 46px;
		line-height: 46px;
	}
	.doc_type .doc{
		width: 20px;
		height: 20px;
		vertical-align: middle;
	}
	.infos{
		margin-left: 20px;
		width: 50%;
	}
	.title{
		line-height: 24px;
		height: 24px;
		width: 100%;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.title img{
		width: 24px;
		height: 24px;
		vertical-align: middle;
	}
	.title .top{
		background: rgba(250,101,90,0.16);
		border-radius: 2px;
		font-size: 12px;
		color: #FA655A;
		/* padding:0 4px; */
		text-align: center;
		width: 32px;
		height: 18px;
		line-height: 18px;
		margin-right: 10px;
		display: inline-block;
		vertical-align: middle;
	}
	.title .name{
		display: inline-block;
		vertical-align: middle;

		font-family: PingFangSC-Medium;
		font-size: 15px;
		color: #3A404C;
		letter-spacing: -0.36px;
		line-height: 24px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.title .name em{
		color: #FA655A;
		font-style: normal;
	}
	.other{
		margin-top: 4px;
		font-family: PingFangSC-Regular;
		font-size: 12px;
		color: #757980;
		letter-spacing: -0.29px;
		line-height: 18px;
	}
	.other .manage,.other .time{
		line-height: 18px;
	}
	.likes{
		display:flex;
		height: 46px;
		align-items: center;
	}
	.action{
		/* display:flex;
		align-items: center; */
	}
	.action img{
		height: 14px;
		vertical-align: bottom;
		margin-right: 2px;
	}
	.action span{
		display: inline-block;
		vertical-align: top;
		margin-top: -2px;
		width: 50px;
		color: #979797;
	}
	.page{
		text-align: right;
		margin-top: 24px;
	}
	.footer{
	    position: absolute;
	    z-index: 999;
	    width: 100%;
	    bottom: 0;
	    left: 0;
	    text-align: center;
	    background: rgba(255,255,255,0.00);
	    height: 59px;
	    line-height: 59px;
	    /* background: #fff; */
	    border-top:1px solid #EDEEF0;
	}
	.footer p{
	    font-size: 12px;
	    color: #C4C7CC;
	}
</style>



























