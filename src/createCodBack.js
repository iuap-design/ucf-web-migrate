const path = require("path");
const fs_extra = require('fs-extra');
const glob = require("glob")

/**
 * 创建代码备份
 * @param {string} dir  * 
 * @author  Wanxiaogang(wangxgk@yonyou.com)
 * @date   2019-02-26 01:18
 */
function createCodeBack(dir){
    
    return new Promise((resolve, reject) => {
        try {
            //检查代码备份目录是否存在。
            let status = fs_extra.pathExistsSync(path.join(dir, '_back')); 
    
            if(!status){
                // fs_extra.removeSync(path.join(dir, '_back')); 
                //不存在则创建 备份目录
                fs_extra.mkdir( path.join(dir, '_back')); 
            }
            //遍历项目目录复制所有文件到备份目录
            let directorys = fs_extra.readdirSync(path.join(dir));  
            directorys.forEach(element => {
                if(element === 'node_modules' || element === '_back') return;
                fs_extra.copySync(path.join(dir, element), path.join(dir, '_back', element));

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