const string_format = require('string-format')
const path = require("path");
const fs_extra = require('fs-extra');
const beautify = require('js-beautify').js;
var template = require('template_js')


/**
 * 修改原uba.config.js 和 package.json 创建 ucf.config.js 和 对应新的 package.json
 * @param {string} dir  * 
 * @author  Wanxiaogang(wangxgk@yonyou.com)
 * @date   2019-02-26 01:18
 */
function createUcfConfig(dir) {
    var ubaConfig = require(path.join(dir, '/uba.config.js'));
    let {
        proxyConfig,
        devConfig,
        externals
    } = ubaConfig;
    let modules = fs_extra.readdirSync(path.join(dir, '/src/modules'));


    let moduleList = modules.filter(item => {
        let status = fs_extra.statSync(path.join(dir, '/src/modules', item));
        return status.isDirectory()
    })
    Object.keys(devConfig.resolve.alias).forEach(key => {
        let relativeDir = path.relative(dir, devConfig.resolve.alias[key]);
        devConfig.resolve.alias[key] = relativeDir.split(path.sep).join('/');
    })



    fs_extra.readFile(path.join(__dirname, 'template/ucf.config.tpl'), 'utf8', (err, result) => {
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
        fs_extra.outputFile(path.join(__dirname, '../test/ucf.config.js'),
            beautify(ucfConfig, {
                indent_size: 4,
                space_in_empty_paren: true
            }), err => {
                console.log(err) // => null
            })
    });
    fs_extra.readFile(path.join(__dirname, 'template/package.tpl'), 'utf8', (err, result) => {
        fs_extra.readJSON(path.join(dir, '/package.json'), (err, package) => {
            if (err) console.error(err)
            let dependencies = {
                "@babel/polyfill": "^7.2.5",
                "@babel/runtime": "^7.3.1",
                "bee-complex-grid": "^1.0.13",
                "bee-form": "^2.0.7",
                "bee-table": "^1.6.40",
                "classnames": "^2.2.6",
                "mirrorx": "^0.2.12",
                "prop-types": "^15.7.1",
                "react": "^16.8.2",
                "react-dom": "^16.8.2",
                "tinper-bee": "^1.6.9",
                "ucf-fe": "^0.1.0",
                "ucf-request": "^1.0.0"
            };
            package.dependencies = Object.assign(package.dependencies, dependencies)
            let packageObj = template(result,package);

            
            fs_extra.outputFile(path.join(__dirname, '../test/package.json'), beautify(packageObj, {
                indent_size: 4,
                space_in_empty_paren: true
            }), err => {
                console.log(err) // => null
            })
            console.log(packageObj.version) // => 0.1.3
        })
    })
    return true;
}

module.exports = createUcfConfig;