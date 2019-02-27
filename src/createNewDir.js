
const fs_extra = require('fs-extra');
const rimraf = require('rimraf')
const glob = require("glob");
const path = require("path");
const template = require('template_js');

const beautify_html = require('js-beautify').html;

//
const rimrafSync = (filePath) => {
    return new Promise((resolve, reject) => {
        rimraf(path.join(filePath), {}, function (er) {
            if (er) {
                reject({err, filePath}) ;
            }else{
                resolve({status: true, filePath})
            }
        });
    });
}



function delOldFile(dir){

    let fileList = fs_extra.readdirSync(path.join(dir));
    // if(!fileList)  reject(fileList) ;
    let unDelList = [
        "_back",
        "LICENSE",
        "README.md",
        "docs",
        "node_modules",
        "ucf.config.js",
        "package.json"
    ];
    fileList.forEach(item => {
        if(!~unDelList.indexOf(item)){
            rimrafSync(path.join(dir,item)).then((data)=>{
                console.log('delete：' + data.filePath)
            }).catch((err) => {
                console.log(err)
            });
        }
    }); 
}
const createDir = (dir) =>{
    let status = fs_extra.pathExistsSync(path.join(dir)); 
    if(!status){
        //不存在则创建 ucf-apps 目录
        fs_extra.mkdir( path.join(dir)); 
    }
}
//复制目录下除过 modules 和 pages 外的所有文件
const copyFiles = (dir, toDir) =>{
    let fileList = fs_extra.readdirSync(path.join(dir));
    fileList.forEach(item => {
        if(item !== "modules" || item !== "pages"){
            fs_extra.copySync(path.join(dir, item), path.join(toDir, item));
        }
    });
}
//创建 ucf-apps 目录 并复制相关代码目录
const createUcfAppDir = (dir) => {
    //检查并创建 ucf-common 目录。
    createDir(path.join(dir, 'ucf-common'));
    //复制目录下除过 modules 和 pages 外的所有文件
    copyFiles(path.join(dir, '_back','src'), path.join(dir, 'ucf-common/src'))

    //检查并创建 ucf-apps 目录是。
    createDir(path.join(dir, 'ucf-apps'));
    
    //检索备份中 src 目录下的 modules 或 pages 目录
    let hasModulesDir = fs_extra.pathExistsSync(path.join(dir, '_back', 'src', 'modules')),
        hasPagesDir = fs_extra.pathExistsSync(path.join(dir, '_back', 'src', 'pages')); 
    
    //读取 index.html.tpl 模板文件
    let indexHtmlTpl = fs_extra.readFileSync(path.join(__dirname, 'template/index.html.tpl'), 'utf8'),
        titleR = /<title>[\s\S]*?<\/title>/i;
    if(hasModulesDir && hasPagesDir){}//两个目录同时存在待定
    if(hasModulesDir){
        let modulesList = fs_extra.readdirSync(path.join(dir, '_back','src', 'modules'));
        modulesList.forEach(item =>{
            fs_extra.copySync(path.join(dir, '_back','src', 'modules', item), path.join(dir, 'ucf-apps', item, 'src'));
        })
        
    }else if(hasPagesDir){
        let pagesList = fs_extra.readdirSync(path.join(dir, '_back','src', 'pages'));
        pagesList.forEach(item =>{
            let status = fs_extra.statSync(path.join(dir, '_back','src', 'pages', item));
            if(status.isDirectory()){
                fs_extra.copySync(path.join(dir, '_back','src', 'pages', item), path.join(dir, 'ucf-apps', item, 'src'));
                let oldHtml = fs_extra.readFileSync(path.join(dir, 'ucf-apps', item, 'src/index.html'), 'utf8').split('>');
                let titleHtml  = oldHtml.filter(item => {
                    return /[\s\S]*?<\/title/i.test(item)
                })
                let { 0:title = ""} = titleHtml; 
                // let title = oldHtml.replace(titleR, '');
                //生成配置代码
                let newIndexHtml = template(indexHtmlTpl, {
                    title:title.replace('</title', '')
                });
                //创建 html 文件写入生成的html代码，同时格式化文件
                fs_extra.outputFileSync(path.join(dir, 'ucf-apps', item, 'src/index.html'),
                    beautify_html(newIndexHtml, {
                        indent_size: 4,
                        space_in_empty_paren: true
                    }));
            }
        })

    }
}

function createNewDir (dir) {
    delOldFile(dir);
    createUcfAppDir(dir);

    // delOldFile(dir).then((status) => {
    //     console.log(status);
    // }).catch((err) => {
    //     console.log(new Error(err))
    // })
}

module.exports = createNewDir;