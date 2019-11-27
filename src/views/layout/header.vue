<template>
<div class="headerWrap">
    <div class="topwraper">
	    <div class="topleft">
	        <img src="../../assets/img/logo_header.png" alt>
	    </div>
	    <div class="centerNav">
	        <a href="http://portal.yunjiglobal.com/it_portal/index.html#/index/commonuse" v-if='$route.path!="/detail"' class="itemLi">导航</a>
	        <a href="http://portal.yunjiglobal.com/it_portal/index.html#/container/it" v-if='$route.path!="/detail"' class="itemLi">门户</a>
	        <a href="javascript:;" v-if='$route.path!="/detail"' class="itemLi" @click='tips'>日程</a>
	        <a href="javascript:;" v-if='$route.path!="/detail"' class="itemLi active">知识</a>
	    </div>
	    <div class="rightCon">
	        <div class="weatherCon">
	          	<img :src="weatherImg" alt>
	          	<el-amap v-show='false' vid="amap" :plugin="plugin" class="amap-demo">
                </el-amap>
	          	<span class="decW">{{weather}}</span>
	          	<div class="dateCons">
	            	<span class="lines"></span>
	            	<span>{{date}}</span>
	            	<span>{{day}}</span>
	          	</div>
	          	<div class="account_C" @mouseenter='mouseEnter' @mouseleave='mouseLeave'>
	            	<div class="account">
	               		<img v-if="avator" :src="avator" alt>
	             		<img v-if="avator==''" src="../../assets/img/Group444.png" alt>
	            	</div>
	            	<img style="margin-left: 4px;width: 6px;height: 6px;" src="../../assets/img/transH.png" alt>
	          	</div>
	        </div>
	    </div>
      	<div class="confimLogin" v-if="Isconfirm" @mouseenter='clearTimer' @mouseleave='Isconfirm=false'>
	        <a class="itemsLogin margin_10" href="http://sso.yunjiglobal.com/#/editpsd">
	          	<img src="../../assets/img/changepsw.png" alt>
	          	<span>修改密码</span>
	        </a>
	        <a class="itemsLogin" href="http://sso.yunjiglobal.com/logout">
	          	<img src="../../assets/img/logout.png" alt>
	          	<span>退出登录</span>
	        </a>
      	</div>
    </div> 
</div>
</template>
<script>
import axios from "axios";
import utils from '../../utils/utils'
import fog from '../../assets/img/fog.png'
import rain from '../../assets/img/rain.png'
import snow from '../../assets/img/snow.png'
import sun from '../../assets/img/sun.png'
import thunder from '../../assets/img/thunder.png'
import wind from '../../assets/img/wind.png'
import cloudy from '../../assets/img/cloudy.png'
import night_cloud from '../../assets/img/night_cloud.png'
import qing_cloud from '../../assets/img/qing_cloud.png'
import rain_snow from '../../assets/img/rain_snow.png'
import night_sun from '../../assets/img/night_sun.png'
export default {
  	name: "Header",
  	data() {
  	let self = this;
        return {
            timer:null,
            weatherImg:'',
      		Isconfirm: false,
      		cityName: "杭州",
      		weather: "",
      		day:'',
      		date:'',
      		avator:'',
      		plugin: [{
              extensions:'all',
              pName: 'Geolocation',
              events: {
                init(o) {
                  o.getCurrentPosition((status, result) => {
                    if (result && result.position) {
                    	self.cityName = result.addressComponent.city;
        				self.getweather();
                    }
                  });
                }
              }
            }],
      		week:['星期日','星期一','星期二','星期三','星期四','星期五','星期六']
    	};
  	},
  	mounted() {
  		let _this = this;
  		let date = new Date();
  		let mouth = date.getMonth()+1;
  		let day = date.getDate();
  		let weekDay = date.getDay();
  		this.date = mouth+'月'+day+'日';
  		this.day = this.week[weekDay];
  		this.getAvator();
  },
  methods: {
    mouseEnter(){
        this.Isconfirm=true;
    },
    mouseLeave(){
        this.timer = setTimeout(()=>{
            this.Isconfirm=false;
        },500)
    },
    clearTimer(){
        clearTimeout(this.timer);
        this.timer = null;
    },
    tips(){
      // this.$message({
      //   type:'warning',
      //   message:'正在建设中，即将开发'
      // });
      alert('正在建设中，即将开发');
    },
    skip(a) {
      this.$router.push(a);
      this.Isconfirm = false;
    },
    getAvator(){
		axios.get('http://attendance.yunjiglobal.com/wx_auth/qw/getAvatar',{
			params:{workCodes:utils.getCookie('username')}
		})
		.then(res=>{
            if(res.data.data){
              this.avator = res.data.data[0].userAvatar
            }
		})
	},
    getweather() {
        let hours = new Date().getHours();
        axios.get(
          "https://restapi.amap.com/v3/weather/weatherInfo?key=95155afb9e3206ad29f9935d5545de6c&city=" +this.cityName
        )
        .then(res => {
          const data = res.data;
          if (data.infocode == 10000 && data.lives) {
            let weather = data.lives[0].weather;
            this.weather = weather;
            if(hours>19){
                if(weather.indexOf('晴')!=-1){
                    this.weatherImg = night_sun;
                }else if(weather.indexOf('云')!=-1){
                    this.weatherImg = night_cloud;
                }else if(weather.indexOf('风')!=-1){
                    this.weatherImg = wind;
                }else if(weather.indexOf('雾')!=-1){
                    this.weatherImg = fog;
                }else if(weather.indexOf('雨')!=-1){
                    if(weather.indexOf('阵雨')!=-1){
                        this.weatherImg = thunder;
                    }else{
                        this.weatherImg = rain;
                    }
                }else if(weather.indexOf('雪')!=-1){
                    if(weather.indexOf('雨')!=-1){
                        this.weatherImg = rain_snow;
                    }else{
                        this.weatherImg = snow;
                    }
                }else if(weather.indexOf('阴')!=-1){
                    this.weatherImg = cloudy;
                };
                return;
            }
            if(weather.indexOf('云')!=-1){
                this.weatherImg = qing_cloud;
            }else if(weather.indexOf('晴')!=-1){
                this.weatherImg = sun;
            }else if(weather.indexOf('风')!=-1){
                this.weatherImg = wind;
            }else if(weather.indexOf('雾')!=-1){
                this.weatherImg = fog;
            }else if(weather.indexOf('雨')!=-1){
                if(weather.indexOf('阵雨')!=-1){
                    this.weatherImg = thunder;
                }else{
                    this.weatherImg = rain;
                }
            }else if(weather.indexOf('雪')!=-1){
                if(weather.indexOf('雨')!=-1){
                    this.weatherImg = rain_snow;
                }else{
                    this.weatherImg = snow;
                }
            }else if(weather.indexOf('阴')!=-1){
                this.weatherImg = cloudy;
            }
          }
        });
    }
  }
};
</script>

<style scoped>
.headerWrap {
    height: 70px;
    margin: 0 auto;
    z-index: 99;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #fff;
    box-shadow: 0 0 6px 0 rgba(0,0,0,0.08);
}
.topwraper {
    width: 1240px;
    height: 70px;
    position: relative;
    margin: 0 auto;
    background: #fff;
}
 
.rightCon {
    margin-left: 278px;
    height: 100%;
    float: left;
}
.weatherCon {
    height: 70px;
    display: flex;
    align-items: center;
    display: flex;
    align-items: center;
}
.weatherCon .account_C {
    height: 24px;
    display: flex;
    align-items: center;
    margin-left: 30px;
    cursor: pointer;
}
.account_C .account {
	width: 24px;
	height: 24px;
	border-radius: 50%;
}
.account_C .account img{
    width:100%;
    height:100%;
    border-radius: 50%;
}
.account_C img {
  	width: 20px;
  	height: 20px;
}
.weatherCon img {
    width: 50px;
    height:50px;
}
.weatherCon .decW {
    font-size: 14px;
    color: #a1a7b3;
    letter-spacing: -0.34px;
    margin-left: 8px;
}
.dateCons {
    height: 15px;
    margin-left: 14px;
    display: flex;
    align-items: center;
}
.dateCons span {
    font-size: 14px;
    color: #a1a7b3;
    line-height: 20px;
    margin-right: 10px;
    letter-spacing: -0.34px;
}
.dateCons .lines {
  	display: block;
  	width: 1px;
  	height: 16px;
  	background: #a1a7b3;
}
.centerNav {
    margin-left: 88px;
    float: left;
    min-width: 400px;
    height: 100%;
}
.itemLi {
    display: block;
    width: 80px;
    height: 70px;
    float: left;
    text-align: center;
    line-height: 70px;
    font-size: 14px;
    color: #757980;
    letter-spacing: -0.34px;
    cursor: pointer;
}
.itemLi:hover {
    background: #f5f6f8 !important;
}
.topleft {
    height: 70px;
    width: 130px;
    display: flex;
    align-items: center;
    margin-left: 20px;
    float: left;
}
.topleft img {
    width: 120px;
    height: 36px;
}
.topleft .toptit {
    font-size: 18px;
    color: #3a414c;
    margin-left: 12px;
}
.confimLogin {
    width: 180px;
    height: 116px;
    background: #fff;
    position: absolute;
    top: 70px;
    right: 40px;
    z-index: 99;
    box-shadow: 0 0 20px 0 rgba(0,0,0,0.10);
    border-radius: 4px;
}
.itemsLogin {
    width: 180px;
    height: 48px;
    display: flex;
    align-items: center;
}
.itemsLogin img {
    width: 32px;
    height: 32px;
    display: block;
    border: 0;
    margin-left: 10px;
}
.itemsLogin span {
    font-size: 14px;
    color: #757980;
    width: 58px;
    height: 24px;
    line-height: 24px;
    margin-left: 6px;
}
.itemsLogin:hover {
    background: #f5f6f8 !important;
    color: #3a404c !important;
}
.active {
  	color: #f10d3b !important;
}
.margin_10 {
  	margin-top: 10px;
}
.active_login {
  	background: #f5f6f8 !important;
  	color: #3a404c !important;
}
</style>
