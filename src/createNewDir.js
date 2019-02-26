
const fs_extra = require('fs-extra');
const rimraf = require('rimraf')
const glob = require("glob");
const path = require("path");

function delOldFile(dir){

    return new Promise((resolve, reject) => {
            let delList = fs_extra.readdirSync(path.join(dir));
            if(!delList)  reject(delList) ;
            let unDelList = [
                "_back",
                "LICENSE",
                "README.md",
                "docs",
                "node_modules",
                "ufc.config.js",
                "package.json"
            ];
            delList.forEach(item => {
                if(!~unDelList.indexOf(item)){
                    rimraf(path.join(dir,item), {}, function (er) {
                        if (er) reject(er) ;
                    });
                }
            }); 
            resolve(true) 
        
    })
    
}

function createNewDir (dir) {

    return delOldFile(dir);

    // delOldFile(dir).then((status) => {
    //     console.log(status);
    // }).catch((err) => {
    //     console.log(new Error(err))
    // })
}

module.exports = createNewDir;