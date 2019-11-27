<template>
<div id="app">
    <!-- <syk-header></syk-header> -->
    <router-view/>
</div>
</template>

<script>
// import sykHeader from './views/layout/header.vue'
export default {
    name: 'App',
    components:{
        // sykHeader
    },
    created(){
    }
}
</script>

<style lang="scss">
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    background: #F5F6F8;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: cale(100%-70);
    position: relative;
}
#app .el-input{
    height: 32px;
    line-height: 32px;
    width: 200px;
}
#app .el-select{
    height: 32px;
    line-height: 32px;
    width: 200px;
}
.form .el-input--suffix{
    height: 32px;
    line-height: 32px;
} 

.form .el-input__inner{
    height: 32px;
    font-size: 14px;
    line-height: 32px;
    color: #3A404C;
}
#app {
    .form {
        .el-range-input{
            font-size: 14px;
        }
        .el-select-dropdown__item{
            color: #3A404C;
        }
        .el-input__icon{
            line-height: 28px;
        }
        .el-range-input{
            line-height: 24px;
        }
        .el-range-separator{
            line-height:28px;
            font-size: 14px;
        }
        .daterange{
            width: 340px;
            height: 32px;
            line-height: 32px;
        }
    }
    .ql-align-center{
        text-align: center;
    }
}
.el-picker-panel .el-picker-panel__body .available:hover{
    color: #F10D3B;
}
.el-picker-panel .el-picker-panel__body .available.today span,
.el-picker-panel .el-picker-panel__body .available.start-date span,
.el-picker-panel .el-picker-panel__body .available.end-date span{
    background-color: #F10D3B;
    color: #fff;
}
.el-scrollbar{
    .el-select-dropdown__item.selected span{
        color: #F10D3B;
    } 
}
#app .el-pagination .btn-next,
#app .el-pagination .btn-prev,
#app .el-pagination .el-pager li {
    margin: 0 5px;
    width: 32px;
    height: 32px;
    line-height: 32px;
    color: #000;
    font-weight: 400;
    background: #FFFFFF;
    border: 1px solid #EDEEF0;
    border-radius: 5px;

}
#app .el-pagination .el-pager .number.active{
    background: #F10D3B;
    color: #fff;
    border-radius: 5px;
}
#app .el-pagination.is-background .el-pager .number:hover {
    color: #606266;
}
#app .el-pagination.is-background .el-pager .active:hover {
    color: #fff;
}
/* .el-pager .number{
    width: 32px;
    height: 32px;
    line-height: 32px;
} */
.title .name em{
    color: #F10D3B;
    font-style: normal;
}

.htmls iframe{
    width: 100%;
    margin-top:40px;
    height: 300px;
}
.htmls p{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #3A404C;
    line-height: 26px;
}
.htmls p img{
    // width: 100%;
    max-width: 100%;
    margin-top:40px;
    border-radius: 10px;
}

</style>
