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
serve -s dist
```

## icon
icon 使用请参考[此处](https://panjiachen.github.io/vue-element-admin-site/zh/guide/advanced/icon.html#%E7%94%9F%E6%88%90%E5%9B%BE%E6%A0%87%E5%BA%93%E4%BB%A3%E7%A0%81)
为保持风格一致，icon 下载请设置颜色为 #e6e6e6

## axios 请求参数处理
参考：https://www.jianshu.com/p/4489934af4fb

1. npm install --save qs
2. 在 request.js 的 axios 配置添加    
```js
import qs from 'qs'
const service = axios.create({
  // ...
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  transformRequest: [function(data) {
    return qs.stringify(data)
  }]
})
```

