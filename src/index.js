const path = require("path");
const fs_extra = require('fs-extra');

const createCodBack = require('./createCodBack.js');
const createUcfCfg = require('./createUcfCfg.js');
const createNewDir = require('./createNewDir.js');
// 
let testDir = path.join('D:\\cli-test\\demo1');

let demoDir = 'D:/Develop/web/iuap_pap_react'

let demo = path.join(__dirname, '../test/demo_modules');
// let demo = path.join(__dirname, '../test/demo_pages');
module.exports = (options) => {
    // console.log(options)
    //创建备份目录
    createCodBack(demo).then(()=>{
        //生成ucf.config.js 和 package.json
        return createUcfCfg(demo)
    }).then(()=>{
        //整理并生成ucf项目结构。
        createNewDir(demo)
    }).then(() =>{
        console.log('all done')
    }).catch(err=>{
        console.log(err.stack);
    })
    // createUcfCfg(demo);


}