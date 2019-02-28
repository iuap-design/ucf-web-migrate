
const fs_extra = require('fs-extra');
const rimraf = require('rimraf')
const glob = require("glob");
const path = require("path");
const template = require('template_js');

const beautify = require('js-beautify');

const { html: beautify_html, js: beautify_js } = beautify;

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

const fixPages = (dir) => {
    //读取 index.html.tpl 模板文件备用
    let indexHtmlTpl = fs_extra.readFileSync(path.join(__dirname, 'template/index.html.tpl'), 'utf8'),
        appJSTpl = fs_extra.readFileSync(path.join(__dirname, 'template/app.js.tpl'), 'utf8');
    let bcakCodePath = path.join(dir, '_back','src', 'pages'),
        newCodePath = path.join(dir, 'ucf-apps');
    let pagesList = fs_extra.readdirSync(bcakCodePath);
    pagesList.forEach(item =>{
        let status = fs_extra.statSync(path.join(bcakCodePath, item));
        //只复制 pages 下的文件夹
        if(status.isDirectory()){
            //复制pages下的文件夹到 ucf-apps 下
            fs_extra.copySync(path.join(bcakCodePath, item), path.join(newCodePath, item, 'src'));

            //读取原来的 index.html 
            let oldHtml = fs_extra.readFileSync(path.join(newCodePath, item, 'src/index.html'), 'utf8').split('>');
            //提取title标签
            let titleHtml  = oldHtml.filter(item => {
                return /[\s\S]*?<\/title/i.test(item)
            })
            let { 0:title = ""} = titleHtml; 
            //生成新的html文件内容并替换title
            let newIndexHtml = template(indexHtmlTpl, {
                title: title.replace('</title', '')
            });
            //创建 html 文件写入生成的html代码，同时格式化文件
            fs_extra.outputFileSync(path.join(newCodePath, item, 'src/index.html'),
                beautify_html(newIndexHtml, {
                    indent_size: 4,
                    space_in_empty_paren: true
                }));
                
            //创建 app.js 文件写入生成的 js 代码，同时格式化文件
            fs_extra.outputFileSync(path.join(newCodePath, item, 'src/app.js'), 
            template(appJSTpl, {
                router: './routes'
            }));
        }
    });

}
const fixMudoles = (dir) => {
    //读取 index.html.tpl 模板文件备用
    let indexHtmlTpl = fs_extra.readFileSync(path.join(__dirname, 'template/index.html.tpl'), 'utf8'),
        appJSTpl = fs_extra.readFileSync(path.join(__dirname, 'template/app.js.tpl'), 'utf8');

    let bcakCodePath = path.join(dir, '_back','src', 'modules'),
        newCodePath = path.join(dir, 'ucf-apps');
    let modulesList = fs_extra.readdirSync(bcakCodePath);
    modulesList.forEach(item =>{
        fs_extra.copySync(path.join(bcakCodePath, item), path.join(newCodePath, item, 'src'));

        let status = fs_extra.statSync(path.join(bcakCodePath, item));
        //只复制 modules 下的文件夹
        if(status.isDirectory()){
            //复制 modules 下的文件夹到 ucf-apps 下
            fs_extra.copySync(path.join(bcakCodePath, item), path.join(newCodePath,item, 'src'));


            let newIndexHtml = template(indexHtmlTpl, {
                title: ''
            });

            //创建 html 文件写入生成的 html 代码，同时格式化文件
            fs_extra.outputFileSync(path.join(newCodePath, item, 'src/index.html'),
                beautify_html(newIndexHtml, {
                    indent_size: 4,
                    space_in_empty_paren: true
                }));

            //创建 app.js 文件写入生成的 js 代码，同时格式化文件
            fs_extra.outputFileSync(path.join(newCodePath, item, 'src/app.js'), 
            template(appJSTpl, {
                router: './router'
            }));
        }
    });
}
function createNewDir (dir) {

    delOldFile(dir);

    //检查并创建 ucf-common 目录。
    createDir(path.join(dir, 'ucf-common'));
    //复制目录下除过 modules 和 pages 外的所有文件
    copyFiles(path.join(dir, '_back','src'), path.join(dir, 'ucf-common/src'))

    //检查并创建 ucf-apps 目录。
    createDir(path.join(dir, 'ucf-apps'));

    let isSingle = fs_extra.existsSync(path.join(dir, '_back','src', 'mudoles'));
    if(isSingle){
        //单页面处理 
        fixMudoles(dir);
    }else{
        //多页处理
        fixPages(dir);
    }


}

module.exports = createNewDir;