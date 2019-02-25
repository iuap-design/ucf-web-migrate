const path = require("path");
const fs_extra = require('fs-extra');


function createNewDir(dir){
    let delList = [
        "mock",
        "babelrc",
        "postcss.config.js",
        "uba.mock.js",
        // "node_modules"
     ]
    fs_extra.remove(path.join(dir, ))
}

module.exports = createNewDir;