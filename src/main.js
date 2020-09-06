import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import _ from 'lodash'
import axios from 'axios'; //请求数据
import echarts from "echarts";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
Vue.prototype.$echarts = echarts;
Vue.prototype._ = _;
Vue.prototype.$axios = axios;
Vue.config.productionTip = false
Vue.use(ElementUI);
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')