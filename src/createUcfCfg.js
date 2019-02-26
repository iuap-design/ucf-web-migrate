const string_format = require('string-format')
const path = require("path");
const fs_extra = require('fs-extra');
const beautify = require('js-beautify').js;
var template = require('template_js')


/**
 * 修改原uba.config.js 和 package.json 创建 ucf.config.js 和 对应新的 package.json
 * 使用 template 目录下的模板文件实现js和json文件的生成
 * @param {string} dir  * 
 * @author  Wanxiaogang(wangxgk@yonyou.com)
 * @date   2019-02-26 01:18
 */
function createUcfConfig(dir) {

    return new Promise((resolve, reject) => {
        //直接在项目下读取 uba.config.js 返回的结果
        try {
            let ubaConfig = require(path.join(dir, '/uba.config.js')); 
            let {
                proxyConfig,
                devConfig,
                externals
            } = ubaConfig;
        


            let modules = fs_extra.readdirSync(path.join(dir, '/src/modules'));

            //排除非文件夹目录
            let bootList = modules.filter(item => {
                let status = fs_extra.statSync(path.join(dir, '/src/modules', item));
                return status.isDirectory()
            });

            //读取别名配置项并和项目根目录取相对路基，后将目录转换未 POSIX 形式路径
            Object.keys(devConfig.resolve.alias).forEach(key => {
                let relativeDir = path.relative(dir, devConfig.resolve.alias[key]);
                devConfig.resolve.alias[key] = relativeDir.split(path.sep).join('/');
            });


            //读取 ucf.config.tpl 模板文件
            let ucfConfigTpl = fs_extra.readFileSync(path.join(__dirname, 'template/ucf.config.tpl'), 'utf8');

            //生成配置代码
            let ucfConfigJSONFileString = template(ucfConfigTpl, {
                bootList: bootList,
                proxy: JSON.stringify(proxyConfig),
                alias: devConfig.resolve.alias,
                global_env: devConfig.plugins[2].definitions,
                externals: JSON.stringify(externals)
            });
            //创建 ucf.config.js 文件写入生成的js代码，同时格式化文件
            fs_extra.outputFileSync(path.join(dir, '/ucf.config.js'),
                beautify(ucfConfigJSONFileString, {
                    indent_size: 4,
                    space_in_empty_paren: true
                }));
            
           
            //选取的默认 dependencies 配置
            let dependencies = {
                "@babel/polyfill": "^7.2.5",
                "@babel/runtime": "^7.3.1",
                "classnames": "^2.2.6",
                "mirrorx": "^0.2.12",
                "prop-types": "^15.7.1",
                "react": "^16.8.2",
                "react-dom": "^16.8.2",
                "ucf-fe": "^0.1.0",
                "ucf-request": "^1.0.0"
            };
            //读取项目原本的 package.json
            let packageJSON = fs_extra.readJSONSync(path.join(dir, '/package.json'));
            //将项目中的 dependencies 配置和上面的ucf默认的 dependencies 配置合并
            packageJSON.dependencies = Object.assign(packageJSON.dependencies, dependencies);

            //读取 package.tpl 模板文件
            let packageTpl = fs_extra.readFileSync(path.join(__dirname, 'template/package.tpl'), 'utf8');

            //生成新的 package 配置
            let packageJSONFileString = template(packageTpl, packageJSON);

            //生成新的 package.json 文件，写入刚生成的 package 配置，同时格式化文本
            fs_extra.outputFileSync(path.join(dir, './package.json'), beautify(packageJSONFileString, {
                indent_size: 4,
                space_in_empty_paren: true
            }));
            resolve(true);
        } catch (error) {
            reject(error)  
        }
    
    })

}

module.exports = createUcfConfig;