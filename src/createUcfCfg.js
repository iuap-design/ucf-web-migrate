const string_format = require('string-format')
const path = require("path");
const fs_extra = require('fs-extra');
const beautify = require('js-beautify').js;
var template = require('template_js')

let ucfConfigTpl = 
`require('@babel/polyfill');
/**
 * UCF配置文件 更多说明文档请看 https://github.com/iuap-design/ucf-web/blob/master/packages/ucf-scripts/README.md
 */

module.exports = (env, argv) => {
    return {
        // 启动所有模块，默认这个配置，速度慢的时候使用另外的配置
        // bootList: true,
        // 启动这两个模块，启动调试、构建
        bootList: {bootList},
        // 代理的配置
        proxy:{proxy},
        // 构建资源的时候产出sourceMap，调试服务不会生效
        open_source_map: false,
        // CSS loader 控制选项
        css: {
            modules: false
        },
        // 全局环境变量
        global_env: {global_env},
        // 别名配置
        
        //'ucf-apps': path.resolve(__dirname, 'ucf-apps/')
        alias: {alias},
            
        // 构建排除指定包
        externals: {externals},
        // 加载器Loader
        loader: [],
        // 调试服务需要运行的插件
        devPlugins: [],
        // 构建服务需要运行的插件
        buildPlugins: []
    }
}`

function createUcfConfig(dir){
    var ubaConfig = require(path.join(dir, '/uba.config.js'));
    let { proxyConfig, devConfig, externals} = ubaConfig;
    let modules = fs_extra.readdirSync(path.join(dir, '/src/modules'));

   
    let moduleList = modules.filter(item=> {
        let status = fs_extra.statSync(path.join(dir, '/src/modules', item));
        return status.isDirectory()
    })
    Object.keys(devConfig.resolve.alias).forEach(key => {
        let relativeDir = path.relative(dir, devConfig.resolve.alias[key]);
        devConfig.resolve.alias[key] = relativeDir.split(path.sep).join('/');
    })
    
    let ucfConfig = string_format(ucfConfigTpl,{
        bootList: JSON.stringify(moduleList),
        proxy: JSON.stringify(proxyConfig), 
        alias: JSON.stringify(devConfig.resolve.alias), 
        global_env: JSON.stringify(devConfig.plugins[2].definitions),
        externals: JSON.stringify(externals)
    });

    
    fs_extra.readFile(path.join(__dirname, 'ucf.config.tpl'),'utf8', (err, result) => {
        if (err) {
          throw new Error(err);
        }
        let ucfConfig = template(result, {
            bootList: moduleList,
            proxy: JSON.stringify(proxyConfig), 
            alias: devConfig.resolve.alias, 
            global_env: devConfig.plugins[2].definitions,
            externals: JSON.stringify(externals)
        });
        fs_extra.outputFile(path.join(__dirname, './test/ucf.config.js'), 
        beautify(a, { indent_size: 4, space_in_empty_paren: true }), err => {
            console.log(err) // => null
        })
      });
      
    // fs_extra.outputFile('./ucf.config.js', beautify(ucfConfig, { indent_size: 4, space_in_empty_paren: false }), err => {
    //     console.log(err) // => null
    // })
    return true;
}

module.exports = createUcfConfig;