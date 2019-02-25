var path = require("path");
const fs_extra = require('fs-extra');

/**
 * 创建代码备份
 * @param {string} dir  * 
 * @author  Wanxiaogang(wangxgk@yonyou.com)
 * @date   2019-02-26 01:18
 */
function createCodeBack(dir){

    let directorys = fs_extra.readdirSync(dir);
    fs_extra.pathExists(path.join(dir, '_back'), (err, exists) => {
        if(err) return;
        if(exists){
            fs_extra.remove(path.join(dir, '_back')).then(() => {
                fs_extra.mkdir( path.join(dir, '_back'));
                directorys.forEach(element => {
                    if(element === 'node_modules' || element === '_back') return;
                    fs_extra.copy(path.join(dir, element), path.join(dir, '_back', element), (err) => {
                        if (err) throw err;
                        console.log(element)
                    });
                });
            })
        }else{
            fs_extra.mkdir( path.join(dir, '_back'));
            directorys.forEach(element => {
                if(element === 'node_modules') return;
                fs_extra.copy(path.join(dir, element), path.join(dir, '_back', element), (err) => {
                    if (err) throw err;
                    console.log(element)
                });
            });
        }
        
    })
    
}

module.exports = createCodeBack;