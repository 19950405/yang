import originAxios from "axios";
import store from "../store/index.js"
import NProgress from "nprogress";


export default function axios(option) {
    return new Promise((resolve, reject) => {
        // 1.创建axios的实例
        const instance = originAxios.create({
            // pathPublic: "http://api.shenzhou888.com.cn",
            // baseURL: "/api",
            timeout: 5000,
            //可统一配置其它属性
            // responseType: "json",
            // withCredentials: true, // 是否允许带cookie这些
            // headers: {
            //     "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            // },
        });

        // 配置请求和响应拦截
        instance.interceptors.request.use(
            config => {
                // 展示进度条
                NProgress.start()
                    // 在发送请求之前做某件事-若是有做鉴权token , 就给头部带上token
                if (sessionStorage.getItem('userToken')) {
                    config.headers['Authorization'] = sessionStorage.getItem('userToken');
                }
                // console.log('发送中', config);
                return config;
            },
            err => {

                console.log('发送失败');
                return err;
            }
        );


        //对响应数据做些事
        instance.interceptors.response.use(
            response => {
                console.log('响应成功');
                // 隐藏进度条
                NProgress.done()
                return response.data;
            },
            err => {
                if (err && err.response) {
                    switch (err.response.status) {
                        case 400:
                            err.message = "请求错误";
                            break;
                        case 401:
                            err.message = "未授权的访问";
                            break;
                    }
                }
                console.log('响应失败');
                return err;
            }
        );

        // 2.传入对象进行网络请求
        instance(option)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
    });
}