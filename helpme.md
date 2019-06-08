## SPA 单页应用
本项目为带 sidebar 和 navbar 的单页应用，但是生产环境可能需要将不同页面集成到不同的菜单，在部署至生产环境时只需要在 layout 中将其隐藏即可。
vue-cli 也支持生成多页应用，后续参考[文档](https://cli.vuejs.org/zh/guide/html-and-static-assets.html#%E6%9E%84%E5%BB%BA%E4%B8%80%E4%B8%AA%E5%A4%9A%E9%A1%B5%E5%BA%94%E7%94%A8)进行改造

## vue ui
你可以通过 vue ui 命令使用 GUI 运行更多的特性脚本。
```bash
npm install -g @vue/cli
vue ui
```

## 本地预览
在本地预览生产环境构建最简单的方式就是使用一个 Node.js 静态文件服务器
```bash
npm install -g serve
# -s 参数的意思是将其架设在 Single-Page Application 模式下
# 这个模式会处理即将提到的路由问题
serve -s dist
```

