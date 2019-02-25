require('@babel/polyfill');
/**
 * UCF配置文件 更多说明文档请看 https://github.com/iuap-design/ucf-web/blob/master/packages/ucf-scripts/README.md
 */
module.exports = (env, argv) => {
    return {
        // 启动所有模块，默认这个配置，速度慢的时候使用另外的配置
        // bootList: true,
        // 启动这两个模块，启动调试、构建
        bootList: [
            "contract",
            "examples",
        ], // 代理的配置
        proxy: [{
            "enable": false,
            "headers": {
                "Referer": "http://192.168.137.39:8080/"
            },
            "router": ["/iuap-saas-billcode-service/billcodeobj/", "/iuap-saas-billcode-service/pub_bcr_me_ref/"],
            "url": "http://192.168.137.39:8080/"
        }, {
            "enable": true,
            "headers": {
                "Referer": "http://192.168.137.138:8080/"
            },
            "router": ["/wbalone", "/iuap_pap_quickstart", "/iuap-example", "/eiap-plus/", "/newref/"],
            "url": "http://192.168.137.138:8080"
        }, {
            "enable": false,
            "headers": {
                "Referer": "http://10.10.24.84:8080/"
            },
            "router": ["/dist/", "/wbalone", "/iuap_pap_quickstart", "/iuap-example", "/eiap-plus/", "/newref/", "/iuap-saas-billcode-service/", "/iuap-saas-message-center/"],
            "url": "http://10.10.24.84:8080"
        }, {
            "enable": false,
            "headers": {
                "Referer": "http://159.138.20.189:8080"
            },
            "router": ["/wbalone", "/newref"],
            "url": "http://159.138.20.189:8080"
        }, {
            "enable": false,
            "headers": {
                "Referer": "http://159.138.20.189:8180"
            },
            "router": ["/iuap_pap_quickstart"],
            "url": "http://159.138.20.189:8180"
        }],
        // 构建资源的时候产出sourceMap，调试服务不会生效
        open_source_map: false,
        // CSS loader 控制选项
        css: {
            modules: false
        },
        // 全局环境变量
        global_env: {
            GROBAL_HTTP_CTX: path.resolve(__dirname, "/iuap_pap_quickstart"),
            GSP_CONTRACT: path.resolve(__dirname, "/gsp-contract"),
            GSP_ORDERS: path.resolve(__dirname, "/gsp-orders"),
            GSP_SUPPLIER: path.resolve(__dirname, "/gsp-supplier"),
            EIAP_PLUS: path.resolve(__dirname, "/eiap-plus"),
        },
        // 别名配置
        //'ucf-apps': path.resolve(__dirname, 'ucf-apps/')
        alias: {
            components: path.resolve(__dirname, "src/components"),
            modules: path.resolve(__dirname, "src/modules"),
            routes: path.resolve(__dirname, "src/routes"),
            layout: path.resolve(__dirname, "src/layout"),
            utils: path.resolve(__dirname, "src/utils"),
            static: path.resolve(__dirname, "src/static"),
        },
        // 构建排除指定包
        externals: {},
        // 加载器Loader
        loader: [],
        // 调试服务需要运行的插件
        devPlugins: [],
        // 构建服务需要运行的插件
        buildPlugins: []
    }
}