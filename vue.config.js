// vue.config.js 配置说明
// 参考文档 https://www.jianshu.com/p/b358a91bdf2d  官方文档 https://cli.vuejs.org/zh/config/

module.exports = {
   //baseUrl可配置生产环境下,在index.html中引入的js,css等打包输出路径
  // baseUrl: process.env.NODE_ENV === "production" ? "/online/" : "/",
   publicPath: process.env.NODE_ENV === "production" ? "./" : "/",

  // outputDir: 在npm run build时 生成文件的目录 type:string, default:'dist'

  // outputDir: 'dist',
   
  //可配置多页面模式
  // pages:{ type:Object,Default:undfind }
  
 // 构建多页面模式的应用程序.每个“页面”都应该有一个相应的JavaScript条目文件。该值应该是一个对象，其中键是条目的名称，而该值要么是指定其条目、模板和文件名的对象，要么是指定其条目的字符串，
  // 注意：请保证pages里配置的路径和文件名 在你的文档目录都存在 否则启动服务会报错的
    
/* pages: {
    index: {
      //入口
       entry: 'src/index/main.js',
      //  the source template
      template: 'public/index.html',
      // output as dist/index.html
       filename: 'index.html'
     }, 
     //可配置子页面
    subpage: 'src/subpage/main.js'
 }, */

  //   lintOnSave：{ type:Boolean default:true } 问你是否使用eslint
    lintOnSave: false,
  // productionSourceMap：{ type:Bollean,default:true } 生产源映射
  // 如果您不需要生产时的源映射，那么将此设置为false可以加速生产构建
  productionSourceMap: false,

  // devServer:{type:Object} 常用于开发环境的配置,比如端口号,跨域代理等
  devServer: {
    port: 8085, // 端口号
    host: "localhost",
    https: false, // https:{type:Boolean}
    open: true, //配置自动启动浏览器
     // 开发环境下，可在此配置跨域处理proxy
    proxy: {
      "/api": {
        target: "http://ustbhuangyi.com/",
        ws: true,
        changeOrigin: true,
        //将以 /api 开头的接口重写http://ustbhuangyi.com/
        pathRewrite: {
          "^/api": "/" 
        }

      }
    },
     //也可配置多个代理
    // proxy: {
    //   "/api": {
    //     target: "<url>",
    //     ws: true,
    //     changeOrigin: true
    //   },
    //   "/foo": {
    //     target: "<other_url>"
    //   }
    // }
  },
    // 判断为生产模式下忽略console，开发模式保存console
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer.map((arg) => {
        const option = arg.options.terserOptions.compress
        // 打开忽略console开关
        option.drop_console = true
        return arg
      })
    }
  },
};
