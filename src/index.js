const path = require("path");

const createCodBack = require('./createCodBack.js');
const createUcfCfg = require('./createUcfCfg.js');
// 
let testDir = path.join('D:\\cli-test\\demo1');

let demoDir = 'D:/Develop/web/iuap_pap_react'

module.exports = (options) => {
    // console.log(options)
    testDir
    path

    // createCodBack(testDir)

    createUcfCfg(testDir);
}