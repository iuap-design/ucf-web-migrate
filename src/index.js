const path = require("path");

const createCodBack = require('./createCodBack.js');
const createUcfCfg = require('./createUcfCfg.js');
const createNewDir = require('./createNewDir.js');
// 
let testDir = path.join('D:\\cli-test\\demo1');

let demoDir = 'D:/Develop/web/iuap_pap_react'

let demo = path.join(__dirname, '../test/demo');
module.exports = (options) => {
    // console.log(options)

    createCodBack(demo).then(()=>{
        return createUcfCfg(demo)
    }).then(()=>{
        return createNewDir(demo)
    }).catch(err=>{
        console.log(err.stack);
    })
    // createNewDir(demo)
    // createUcfCfg(testDir).then((status)=>{
    //     debugger
    // }).catch(err=>{
    //     debugger
    // });
}