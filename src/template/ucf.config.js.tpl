require('@babel/polyfill');\n
const path = require('path');\n
/**\n
 * UCF配置文件 更多说明文档请看 https://github.com/iuap-design/ucf-web/blob/master/packages/ucf-scripts/README.md\n
 */\n

module.exports = (env, argv) => {\n
    return {\n
        <%:="// 启动所有模块，默认这个配置，速度慢的时候使用另外的配置"%>\n
        <%:="// bootList: true,"%>\n
        <%:="// 启动这两个模块，启动调试、构建"%>\n
        bootList: [\n
            <%for(var i= 0; i < bootList.length; i++) {%>
            "<%:=bootList[i]%>",\n
            <%}%>
        ],\n
        <%:="// 代理的配置"%>\n
        proxy:<%:=proxy%>,\n
        <%:="// 构建资源的时候产出sourceMap，调试服务不会生效"%>\n
        open_source_map: false,\n
        <%:="// CSS loader 控制选项"%>\n
        css: {\n
            modules: false\n
        },\n
        <%:="// 全局环境变量"%>\n
        global_env: {
            <%for(var key in global_env) {%>
            <%if(!global_env[key]) continue;%>
            <%:=key+': JSON.stringify('+ global_env[key] + '),'%>\n
            <%}%>
        },\n
        <%:="// 别名配置"%>\n
        <%:="//'ucf-apps': path.resolve(__dirname, 'ucf-apps/')"%>\n
        alias: {\n
            <%for(var key in alias) {%>
            <%:=key+':path.resolve(__dirname, "ucf-common/'+alias[key] + '"),'%>\n
            <%}%>
            "ucf-common": path.resolve(__dirname, "ucf-common/")
        },\n
        <%:="// 构建排除指定包"%>\n
        externals: {},\n
        <%:="// 加载器Loader"%>\n
        loader: [],\n
        <%:="// 调试服务需要运行的插件"%>\n
        devPlugins: [],\n
        <%:="// 构建服务需要运行的插件"%>\n
        buildPlugins: []\n
    }\n
}\n