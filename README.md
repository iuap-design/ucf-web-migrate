# ucf-web-migrate
一个 CLI 工具，旨在帮助uba开发者用户快速将其工程迁移升级为 ucf-web 微前端框架。
```
# 全局安装
$ npm i ucf-web-migrate  -g

# 进入到原基于uba的工程跟目录下执行 migrate 
$ cd xx && migrate init

# 迁移完成后安装新的 node_modules 依赖环境
npm i
```

## 说明

工具在迁移是依赖原项目的 node__modules 环境，所以要先安装原来的项目依赖，安装过程中会生成备份目录（_back）,并迁移所有的源代码，同时适配 原uba脚手架搭建的单页和多页项目。


其他资料参考[ucf-web开发说明](https://www.yuque.com/ucf-web/book)
