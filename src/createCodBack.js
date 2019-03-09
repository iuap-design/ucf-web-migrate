const path = require("path");
const fs_extra = require('fs-extra');
const glob = require("glob")
const {logError, logInfo, logWarning, ProgressBar}= require('./utils.js');

/**
 * 创建代码备份
 * @param {string} dir  * 
 * @author  Wanxiaogang(wangxgk@yonyou.com)
 * @date   2019-02-26 01:18
 */
function createCodeBack(dir){
    let progressBar = new ProgressBar('复制备份文件')
    return new Promise((resolve, reject) => {
        try {
            //检查代码备份目录是否存在。
            let status = fs_extra.pathExistsSync(path.join(dir, '_back')); 
            logInfo('创建_back目录').break()
            if(!status){
                // fs_extra.removeSync(path.join(dir, '_back')); 
                //不存在则创建 备份目录
                fs_extra.mkdirSync( path.join(dir, '_back')); 
            }else{
                logWarning('已存在_back目录').break()
            }
            //遍历项目目录复制所有文件到备份目录
            let directorys = fs_extra.readdirSync(path.join(dir));  
            let total = directorys.length;
            directorys.forEach((element, index) => {
                if(element === 'node_modules' || element === '_back') return;
                let filePath = path.join(dir, element);
                
                fs_extra.copySync(filePath, path.join(dir, '_back', element));
                progressBar.render({ completed: index, total: total,completed: index + 1, status: `\n 正在复制：${filePath}` });
                // , (src, dest) => {
                //     debugger
                //     // your logic here
                //     // it will be copied if return true
                // }
            });
            resolve(true);
        } catch (error) {
            reject(error)
        }
    });
}

module.exports = createCodeBack;