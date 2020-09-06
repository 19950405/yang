import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'
import Users from '../views/users/Users.vue'
import Rights from '../views/rights/rights.vue'
import Roles from '../views/rights/roles.vue'
import Cate from '../views/goods/categories.vue'
import Params from '../views/goods/params.vue'
import GoodsList from '../views/goods/goods.vue'
import Order from '../views/orders/orders.vue'
import Report from '../views/reports/reports.vue'
import Add from '../views/goods/add.vue'

Vue.use(VueRouter)

const router = new VueRouter({
	routes: [{
			path: '/',
			redirect: '/login'
		},
		{
			path: '/login',
			component: Login
		},
		{
			path: "/Home",
			name: "Home",
			component: Home,
			redirect: '/welcome',
			children: [
			  { path: '/welcome', component: Welcome },
			  { path: '/users', component: Users },
			  { path: '/rights', component: Rights },
			  { path: '/roles', component: Roles },
			  { path: '/categories', component: Cate },
			  { path: '/params', component: Params },
			  { path: '/goods', component: GoodsList },
			  { path: '/goods/add', component: Add },
			  { path: '/orders', component: Order },
			  { path: '/reports', component: Report }
			]
		},
	]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {

	if (to.path === '/login') return next()
	// 获取token
	const tokenStr = window.sessionStorage.getItem('userToken')
	if (!tokenStr) return next('/login')
	next()
})

export default router














// export default new VueRouter({
// 	routes: [
// 		{
// 			path: "/Login",
// 			name: "Login", 
// 			component: Login
// 		},
// 		{
// 			path: "/Home",
// 			name: "Home", 
// 			component: Home
// 		},
// 		{
// 			path: "/",
// 			redirect: '/Login',
// 		},
// 		{
// 			path: "*",
// 			redirect: '/Login'
// 		},
// 	],
// 	   linkActiveClass: 'active',

// });
