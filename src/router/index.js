import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  	routes: [{
	    path: '/',
	    name: 'Layout',
        redirect:'/system',
	    component: ()=>import ('@/views/layout/index'),
	    children:[
            {
                path: '/system',
                name:'system',
                component:()=>import ('@/views/main/system')
            },
	    ]
	},{
        path:'/detail',
        name:'name',
        component: ()=>import ('@/views/main/detail'),
    }]
})


		
