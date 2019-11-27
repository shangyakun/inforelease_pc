<template>
	<div class="container" :style='{minHeight:oHeight+"px"}' @click='init'>
    	<syk-header></syk-header>
		<div class="main" v-show='!wxNative'>
			<h2 class="title">{{detail.title}}</h2>
			<div class="article_info">
				<div class="avator">
					<img :src="detail.avatar" alt="">
				</div>
				<div class="infos">
					<div class="name">{{detail.creater}}</div>
					<div class="otherinfos">
						<span class="time">发布于&nbsp;&nbsp;{{detail.updateDate}}</span>
						<span class="count fr">
							<img src="../../assets/img/awesome.png" alt="">{{likeCount}}
						</span>
						<span class="count fr" style='border-right: 1px solid #A1A7B3;'>
							<img src="../../assets/img/comment.png" alt="">{{commentList.length}}
						</span>
						<span class="count fr" style='border-right: 1px solid #A1A7B3;'>
							<img src="../../assets/img/eye.png" alt="">{{detail.seeCount}}
						</span>
					</div>
				</div>
			</div>
			<div class="article">
				<div class="htmls" v-html='detail.content'></div>
			</div>
			<div class="annex" v-if='attachment.length'>
				<div v-for='item,index of attachment' :key='index'>
					<img src="../../assets/img/annex_blue.png" alt="">
					<a href="javascript:;" @click.stop='download(index,$event)'>{{item.attachment_name}}</a>
				</div>
				<div class="download" :style='positionObj'>
					<a href="javascript:;" class="downloadbtn" @click='downloadAnnex'>
						<img src="../../assets/img/download.png" alt="">
						<span>下载</span>
					</a>
				</div>
			</div>
			<div class="btn_wrap" v-if='detail.likeLimit==1'>
				<a href="javascript:;" :class="detail.likeFlag==0?'btn active':'btn'" @click='sendPraise'>
					<div style='height:32px;margin-bottom:4px;'>
						<img src="../../assets/img/awesome_pc.png" alt="">
					</div>
					<div>{{likeCount}}</div>
				</a>
			</div>
			<div class="commentlist">
				<div v-if='commentList.length'>
					<h2 class="subtitle">{{commentList.length}}条评论</h2>
					<ul class="list">
						<li class="item" v-for='item,index of commentList' :key='index'>
							<div class="commentator">
								<img :src="item.userAvatar" alt="">
							</div>
							<div class="commentinfo" :style='index==commentList.length-1?"border:none":""'>
								<div class="name">
									<span>{{item.creater}}</span>
									<span style="font-size: 12px;color: #A1A7B3;margin-left: 10px;">
										{{item.createTime}}
									</span>
								</div>
								<div class="words">{{item.content}}</div>
								<div class="cancle" v-if='item.workCode==workCode'>
									<a href="javascript:;" @click.stop='cancelComment(index)'>删除</a>
									<div class="dialog" v-if='item.showDialog' @click.stop=''>
										<h3>确认删除评论</h3>
										<span class="arrow"></span>
										<div class="confirm_btn clear">
											<a href="javascript:;" class="no fl" @click='cancle'>取消</a>
											<a href="javascript:;" class="confirm fr" @click='comfirmDeleteComment'>删除</a>
										</div>	
									</div>
								</div>
							</div>
						</li>
					</ul>
				</div>
				<div v-if='!commentList.length&&detail.commentLimit==1' class="nocomment">
					<img src="../../assets/img/nocomment.png" alt="">
					<p>成为第一个评论的人</p>	
				</div>
			</div>
			<div v-if='detail.commentLimit==1' style='padding-top: 20px;'>
				<div class="form">
					<div class="commentator">
						<img :src="avator" alt="">
					</div>
					<div class="textarea">
						<textarea class="text" :style='content.length?"border-color:#FA655A;backgroun:#fff;":""' placeholder="说些什么吧..." v-model='content'></textarea>
					</div>
				</div>
				<div class="send">
					<a href="javascript:;" :class="content.length?'active':'sendbtn'" @click='addComment'>评论</a>
				</div>
			</div>
		</div>
		<div class="wrap" v-show='wxNative'>
			<div class="erweima">
				<div class="code">
					<div id='qrcode'></div>
				</div>
				<div class="">
					<p class="tip">H5内容暂不支持PC查看</p>
					<p class="subtip">手机扫描二维码查看</p>
				</div>
			</div>
		</div>	
		<div class="footer">
	        <p>Copyright © 2016 - 2019 SYK . All Rights Reserved.  syk版权所有</p>
	    </div>
	</div>
</template>
<script>
	import utils from '../../utils/utils'
	import api from '../../api/api'
	import sykHeader from '../layout/header.vue'
	import QRcode from 'qrcodejs2'
	import axios from 'axios'
	export default {
		name:'detail',
		data(){
			return {
				positionObj:{
					left:0,
					top:0,
					display:'none',
				},
				wxNative:false,
				avator:'',
				content:'',
				detail:{},
				commentList:[],
				workCode:'',
				oHeight:'',
				commentUuid:'',
				attachment:[],
				likeCount:'',
			}
		},
		components:{
			sykHeader
		},
		methods:{
			getLikeList(){
				api('/comment/likeList','GET',{
					pageSize:0,
					pageNum:1,
					uuid:this.$route.query.uuid,
				})
				.then(res=>{
					if(res.data.success){
						this.likeCount = res.data.data.length;
					}
				})
			},
			downloadAnnex(index){
				window.location.href = ''
			},
			init(){
				this.positionObj = {
					left:0,
					top:0,
					display:'none',
				};
			},
			download(index,$event){
				this.positionObj = {
					top:$event.offsetY+10+'px',
					left:$event.offsetX+'px',
					display:'block'
				};
				this.annexUuid = this.attachment[index].uuid;
			},
			qrcode(url) {  
		      let qrcode = new QRcode('qrcode', {  
		        width: 170,  
		        height: 170, // 高度  
		        text: url // 二维码内容  
		      })  
		    }, 
		    cancle(){
		    	for(let i=0;i<this.commentList.length;i++){
					this.commentList[i].showDialog = false;
				};
		    },
		    comfirmDeleteComment(){
		    	api('/comment/delete','POST',{
		    		commentUuid:this.commentUuid
		    	},{'Content-Type': 'application/x-www-form-urlencoded'})
		    	.then(res=>{
		    		if(res.data.success){
		    			this.$toast({
							type:'success',
							message:'删除评论成功'
						});
		    		}else{
		    			this.$toast({
							type:'error',
							message:'删除评论失败'
						});
		    		};
					this.getComment();
		    	})
		    },
			cancelComment(index){
				for(let i=0;i<this.commentList.length;i++){
					this.commentList[i].showDialog = false;
				};
				this.commentList[index].showDialog = true;
				this.commentUuid = this.commentList[index].commentUuid;
			},
			sendPraise(){
				api("/comment/add","POST",{
					content:'',
					workCode:utils.getCookie('username')||1489,
					uuid:this.$route.query.uuid
				},{'Content-Type': 'application/x-www-form-urlencoded'})
				.then(res=>{
					if(res.data.success){
						if(this.detail.likeFlag==0){
							// this.$toast({
							// 	type:'success',
							// 	message:'点赞成功'
							// });
							this.detail.likeFlag = 1;
						}else{
							// this.$toast({
							// 	type:'success',
							// 	message:'取消点赞成功'
							// });
							this.detail.likeFlag = 0;
						};
						this.getLikeList();
					};
				});
			},
			getDetail(){
				api('/qw/detail','GET',{
					uuid:this.$route.query.uuid,
					workCode:utils.getCookie('username')||1489,
				})
				.then(res=>{
					if(res.data.success){
						res.data.data.updateDate = utils.getDateFormat(res.data.data.updateDate);
						this.detail = res.data.data;
						if(res.data.data.h5url.length){
							this.wxNative = true;
							this.qrcode(res.data.data.h5url);
						};
						if(res.data.data.attachment.length){
							this.attachment = res.data.data.attachment;
						};
					}
				})
			},
			getComment(){//获取评论列表
				api('/comment/commentList','GET',{
					pageSize:0,
					pageNum:1,
					uuid:this.$route.query.uuid
				})
				.then(res=>{
					if(res.data.success){
						let list = res.data.data;
						if(list.length>0){
							for(let i=0;i<list.length;i++){
								list[i].showDialog = false;
							};
						};
						this.commentList = list;
					}
				})
			},
			getAvator(){
				axios.get('',{
					params:{workCodes:utils.getCookie('username')}
				})
				.then(res=>{
						this.avator = res.data.data[0].userAvatar
				})
			},
			addComment(){
				const content = this.content.replace(/\s+/g, "");
				if(!content.length){
					// this.$message({
					// 	type:'warning',
					// 	message:'请输入评论内容'
					// });
					return;
				};
				api("/comment/add","POST",{
					content:this.content,
					workCode:utils.getCookie('username'),
					uuid:this.$route.query.uuid
				},{'Content-Type': 'application/x-www-form-urlencoded'})
				.then(res=>{
					if(res.data.success){
						this.$toast({
							type:'success',
							message:'评论成功'
						});
						this.getComment();
						this.content = '';
					}else{
						this.$toast({
							type:'error',
							message:'评论失败'
						});
					}
				});
			},
		},
		mounted(){
			let _this = this;
			this.getDetail();
			this.getComment();
			this.getAvator();
			this.getLikeList();
			this.workCode = utils.getCookie('username');
			document.addEventListener('click',function(){
				for(let i=0;i<_this.commentList.length;i++){
					_this.commentList[i].showDialog = false;
				};
	        });
			this.oHeight = document.body.clientHeight-60||document.documentElement.clientHeight-60;
		}
	}
</script>
<style scoped>
	.container{
		background: #fff;
		position: relative;
		padding-bottom: 60px;
	}
	.main{
		width: 700px;
		margin: 0 auto;
		padding-top: 40px;
		z-index: 99;
		margin-bottom: 100px;
		margin-top: 70px;
	}
	.main .title{
		font-family: PingFangSC-Medium;
		font-size: 24px;
		color: #3A404C;
		letter-spacing: -0.58px;
		line-height: 36px;
	}
	.article_info{
		margin-top: 20px;
		display: flex;
		padding-bottom: 39px;
		border-bottom: 1px dashed #edeef0;
	}
	.avator{
		height: 50px;
		width: 50px;
	}
	.avator img{
		width: 100%;
		height: 100%;
		border-radius: 50%;
		vertical-align: middle;
	}
	.infos{
		flex: 1;
		margin-left: 16px;
	}
	.infos .name{
		font-family: PingFangSC-Regular;
		font-size: 14px;
		color: #3A404C;
		line-height: 18px;
		margin-top: 5px;
	}
	.otherinfos{
		font-family: PingFangSC-Regular;
		font-size: 12px;
		color: #757980;
		line-height: 16px;
		margin-top: 5px;
	}
	.count{
		width: 100px;
		line-height: 16px;
		display: flex;
		align-items: center;
		justify-content: center
	}
	.count img{
		width: 16px;
		height: 16px;
		margin-right: 10px;
	}
	.article{
		padding: 40px 0;
	}
	.htmls img{
		width: 100%;
	}	
	.htmls iframe{
		width: 100%;
		height: 300px;
	}
	.annex{
		padding:0 10px 10px;
		background: #FCFCFC;
		border: 1px solid #F5F6F8;
		border-radius: 3px;
		margin-bottom: 40px;
		position: relative;
	}
	.annex div{
		height: 24px;
		line-height: 24px;
		margin-top: 10px;
	}
	.annex a{
		display: inline-block;
		font-size: 14px;
		color: #5177B8;
		font-family: PingFangSC-Regular;
		vertical-align: middle;
	}
	.annex img{
		height: 24px;
		vertical-align: middle;
		width: 24px;
	}
	.download{
		display: none;
		position: absolute;
	}
	.download .downloadbtn{
		display: flex;
		height: 24px;
		line-height: 24px;
		padding:5px 14px;
		color: #757980;
		font-size: 13px;
		justify-content: center;
		align-items: center;
		border: 1px solid #F5F6F8;
		border-radius: 3px;
		background: #fff;
	}
	.downloadbtn img{
		height: 16px;
		width: 16px;
		margin-right: 8px;
	}
	.download .dowloadbtn span{
		font-family: PingFangSC-Regular;
		color: #757980;
	}
	.btn_wrap{
		padding: 10px 0;
		text-align: center;
	}
	.btn_wrap .btn{
		background: #E3E4E6;
		display: inline-block;
		border-radius: 36px;
		width: 120px;
		color: #fff;
		padding: 10px 0 6px;
		font-size: 14px;
		vertical-align: top;
	}
	.btn_wrap .btn.active{
		background: #FA655A;
	}
	.btn_wrap .btn img{
		width: 32px;
		height: 32px;
	}
	.commentlist{
		margin-top: 40px;
		border-top: 1px solid #EDEEF0;
		padding-top: 19px;
	}
	.commentlist .subtitle{
		font-family: PingFangSC-Medium;
		font-size: 18px;
		color: #3A404C;
		letter-spacing: -0.43px;
		line-height: 24px;
	}
	.commentlist .list{
		margin-top: 10px;
	}

	.list .item{
		display: flex;
		padding-top: 16px;
	}
	.nocomment{
		padding: 37px 0 26px;
		text-align: center;
	}
	.nocomment img{
		width: 240px;
		height: 120px;
		vertical-align: top;
	}
	.nocomment p{
		font-size: 13px;
		color: #C4C7CC;
		line-height: 22px;
		margin-top: 16px;
	}
	.commentator{
		height: 36px;
		width: 36px;
	}
	.commentator img{
		width: 100%;
		height: 100%;
		border-radius: 50%;
		vertical-align: top;
	}
	.commentinfo{
		flex: 1;
		margin-left: 16px;
		padding-bottom: 17px;
		border-bottom: 1px solid #F5F6F8;
	}
	.commentinfo .name{
		font-family: PingFangSC-Regular;
		font-size: 14px;
		color: #757980;
		line-height: 22px; 
		height: 22px;
	}
	.commentinfo .name span{
		line-height: 22px;
	}
	.commentinfo .words{
		margin-top: 4px;
		font-family: PingFangSC-Regular;
		font-size: 13px;
		color: #3A404C;
		line-height: 22px;
	}
	.commentinfo .cancle{
		font-family: PingFangSC-Regular;
		font-size: 12px;
		line-height: 22px;
		position: relative;
	}
	.cancle{
		line-height: 22px;	
		width: 24px;
	}
	.cancle a{
		font-size: 12px;
		color: #A1A7B3;
	}
	.dialog{
		position: absolute;
		padding: 16px 21px;
		background: #FFFFFF;
	    box-shadow: 1px 1px 3px #e6e7e9 ; 
		border-radius: 3px;
		left: 40px;
		top:0;
		margin-top:-34px;
		z-index: 999;
	}
	.dialog::after{
		content: '';
		position: absolute;
		background: #FFFFFF;
	    box-shadow: -1px -1px 10px #d9d9d9 ; 
		border-radius: 3px;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: -1;
	}
	.dialog h3{
		font-family: PingFangSC-Regular;
		font-size: 13px;
		color: #3A404C;
		line-height: 22px;
		width: 91px;
		margin: 0 auto;
		text-align: center;
	}
	.dialog .arrow{
		position: absolute;
	    width:0;
	    height:0;
	    border-width:6px 7px 6px 0;
	    border-style:solid;
	    border-color:transparent #fff transparent transparent;
	    position:absolute;
	    top:50%;
	    margin-top: -8px;
	    left:-6px;
	}
	.dialog .arrow::after{
		content: '';
		top: -7px;
	    border-width:8px 6px 7px 0;
	    border-style:solid;
	    border-color:transparent #e6e7e9 transparent transparent;
     	position: absolute;
     	filter: blur(1px);
     	z-index: -1;
	}
	.dialog .confirm_btn{
		margin-top: 16px;
		width: 136px;
		text-align: center;
	}
	.confirm_btn a{
		background: #F5F6F8;
		border: 1px solid transparent;
		border-radius: 3px;
		width: 62px;
		height: 24px;
		line-height: 24px;
	}
	.confirm_btn .confirm{
		background: #F10D3B;
		color: #fff;
	}
	.form{
		display: flex;
	}
	.form .textarea{
		flex: 1;
		margin-left: 16px;
	}
	.textarea .text{
		width: 100%;
		outline: none;
		min-height: 44px;
		padding: 10px;
		resize: none;
		background: #fdfdfd;
		border-radius: 3px;
		border: 1px solid #E3E4E6;
		line-height: 22px;
		box-sizing: border-box;
	}
	.send{
		margin-top: 20px;
		margin-left: 53px;
	}
	.send .sendbtn{
		background: #F5F6F8;
		border: 1px solid #E3E4E6;
		border-radius: 3px;
		display: inline-block;
		color: #c4c7cc;
		height: 30px;
		width: 78px;
		text-align: center;
		line-height: 30px;
	}
	.send .active{
		background: #F10D3B;
		border: 1px solid #E60C38;
		border-radius: 3px;
		display: inline-block;
		color: #fff;
		height: 30px;
		width: 78px;
		text-align: center;
		line-height: 30px;
	}
	
	.wrap{
		width: 700px;
		margin:0 auto;
		overflow: hidden;
		padding-top: 180px;
	}
	.erweima{
		width: 200px;
		margin: 0 auto;
		text-align: center;
	}
	#qrcode{
		width: 170px;
		height: 170px;
		overflow: hidden;
	}
	.code{
		padding: 15px;
		width: 170px;
		height: 170px;
	}
	.erweima .tip{
		font-family: PingFangSC-Regular;
		font-size: 16px;
		color: #3A404C;
		line-height: 24px;
		margin-top: 30px;
	}
	.erweima .subtip{
		background: #F5F6F8;
		border-radius: 15px;
		width: 180px;
		height: 30px;
		line-height: 30px;
		text-align: center;
		margin: 12px auto 0;
	}
	.footer{
	    position: absolute;
	    z-index: 999;
	    width: 100%;
	    bottom: 0;
	    left: 0;
	    text-align: center;
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














