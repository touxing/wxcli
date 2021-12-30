# MINIAPP CLI
一款封装了微信开发者工具 `开发辅助-命令行调用` 的cli工具。
主要是方便使用了 `webpack` 打包小程序的使用场景。

## Install

```sh
npm i -g wxcli
```

把微信开发者工具的安装目录配置到 `系统环境变量` `path` 中

> 参考：https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html

![20211229092010](https://piclive.oss-cn-shenzhen.aliyuncs.com/blog/pictures/20211229092010.png)

把此路径配置到 `系统环境变量` `path` 中

## 使用

```sh
wxcli
```

![20211229092030](https://piclive.oss-cn-shenzhen.aliyuncs.com/blog/pictures/20211229092030.png)

交互式创建小程序模板
```sh
wxcli create
```
![20211230140312](https://piclive.oss-cn-shenzhen.aliyuncs.com/blog/pictures/20211230140312.png)
可在目录中找到 `template` 修改模板文件

交互式打开，预览，上传小程序
```sh
wxcli run
```
![20211230140233](https://piclive.oss-cn-shenzhen.aliyuncs.com/blog/pictures/20211230140233.png)
默认打包目录是根目录下的 `dist`
- `dist/dev` 开发环境打包目录
- `dist/test` 测试环境打包目录
- `dist/prod` 生产环境打包目录

- todo: 可选打包路径
