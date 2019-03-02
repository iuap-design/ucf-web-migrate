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
    // console.log(__dirname)
    // console.log(process.cwd())
    let filePath = process.cwd();
    // console.log(options, filePath);
    // return;
    //创建备份目录
    createCodBack(filePath).then(()=>{
        console.log('备份文件创建完成')
        //生成ucf.config.js 和 package.json
        return createUcfCfg(filePath)
    }).then(()=>{
        console.log('配置文件创建完成')
        console.log('正在生成新的项目结构')
        //整理并生成ucf项目结构。
        createNewDir(filePath);
    }).then(() =>{
        console.log('目录创建完成')
    }).catch(err=>{
        console.log(err.stack);
    })
    // createUcfCfg(demo);


}