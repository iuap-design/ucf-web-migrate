
const chalk = require('chalk');
var log = require('single-line-log').stdout;
const strformat = require('string-format');

//增加断行方法
log.break = () => {
    console.log('')
}


exports.log = log;
exports.infoText = (text) => {
    return chalk.green.bold(`[提示] : ${text}`)
}
exports.errorText = (text) => {
    return chalk.red.bold(`[错误] : ${text}`)
}
exports.warningText = (text) => {
    return chalk.yellow.bold(`[警告] : ${text}`)
}
exports.logInfo = ( text ) => {
    this.log(this.infoText(text));
    return this.log;
}
exports.logError = ( text ) => {
    this.log(this.errorText(text));
    return this.log;
}
exports.logWarning = ( text ) => {
    this.log(this.warningText(text));
    return this.log;
}



/**
 * 复制 UCF-WEB 中的进度条工具
 * 封装一个进度条工具。
 * @author by Kvkens(yueming@yonyou.com)
 * @date    
 */

function ProgressBar(description = 'PROGRESS', bar_length = 28) {
    this.description = description || "PROGRESS";
    this.length = bar_length.length || 28;

    // 刷新进度条图案，文字的方法
    this.render = function (opts) {
        var percentage = (opts.completed / opts.total).toFixed(4);
        var cell_num = Math.floor(percentage * this.length);
        // 拼接黑色条
        var cell = '';
        for (var i = 0; i < cell_num; i++) {
            cell += '█';
        }
        // 拼接灰色条
        var empty = '';
        for (var i = 0; i < this.length - cell_num; i++) {
            empty += '░';
        }

        var percent = (100 * percentage).toFixed(2);
        /**
         * 使用cli-color进行包装美化。
         */
        this.description = chalk.blue.bold(this.description);

        if( percent < 33 ){
            cell = chalk.red.bgBlack.bold(cell);
        }else if( percent < 66 ){
            cell = chalk.yellow.bgBlack.bold(cell);
        }else{
            cell = chalk.green.bgBlack.bold(cell);
        }
        cell = chalk.green.bgBlack.bold(cell);
        opts.completed = chalk.yellow.bold(opts.completed);
        opts.total = chalk.blue.bold(opts.total);
        opts.status = percent == 100.00 ? chalk.green.bold(opts.status) : chalk.red.bold(opts.status);


        // 拼接最终文本
        var cmdtext = strformat("<{0}:{1}%> {2}{3}  [completed: {4} totle:{5} `{6}`]", this.description, percent,
            cell, empty, opts.completed, opts.total, opts.status);
        log(cmdtext);
    };
}
exports.ProgressBar = ProgressBar;


module.exports = exports;