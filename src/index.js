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
    testDir
    path

    // createCodBack(testDir)
    // createNewDir(demo)
    createUcfCfg(testDir);
}