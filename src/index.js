const path = require("path");
const fs_extra = require('fs-extra');
const chalk = require('chalk')
const createCodBack = require('./createCodBack.js');
const createUcfCfg = require('./createUcfCfg.js');
const createNewDir = require('./createNewDir.js');


const {logError, logInfo, logWarning}= require('./utils.js');
// 
module.exports = (options) => {
    let filePath = process.cwd();
    // console.log(options);
    let cmd = options.cmd[0];
    
    console.log(chalk.cyan(`[提示] : 迁移过程依赖原项目的node_modules，请确保依赖环境存在。`));
    switch (cmd) {
        case 'init':
            //创建备份目录
            
            logInfo('创建备份')
            createCodBack(filePath).then(()=>{
                logInfo('备份创建完成').break();
                //生成ucf.config.js 和 package.json
                return createUcfCfg(filePath)
            }).then(()=>{
                logInfo('配置文件创建完成').break();
                //整理并生成ucf项目结构。
                createNewDir(filePath);
            }).then(() =>{
                logInfo('目录创建完成').break();
                console.log(chalk.cyan(`[提示] : npm install && npm start`));
            }).catch(err=>{
                logError(err.stack || err).break();;
            })
            break;
        case '-v':
        case 'version':
            let {version} = fs_extra.readJSONSync(path.join(__dirname, '../package.json'));
            console.log(version)
        break;

        default:
            break;
    }
    return;
    
    // createUcfCfg(demo);


}