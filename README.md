# komento-vue

本项目基于 [vue-element-admin](https://panjiachen.gitee.io/vue-element-admin-site/zh/)，更多信息请参考其 [使用文档](https://panjiachen.github.io/vue-element-admin-site/zh/)

如果你之前没有接触过 vue，最好先大概浏览一下以下一些文档
- [vue](https://cn.vuejs.org/index.html)
- [vuex](https://vuex.vuejs.org/zh-cn/)
- [vue-router](https://router.vuejs.org/zh-cn/)
- [vue-cli](https://github.com/vuejs/vue-cli)
- [axios](https://github.com/axios/axios)
- [element-ui](https://github.com/ElemeFE/element)

## Build Setup

```bash
# 克隆项目
git clone https://github.com/PanJiaChen/vue-admin-template.git

# 进入项目目录
cd vue-admin-template

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 [http://localhost:9528](http://localhost:9528)

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

## todo

- [x] 单页工程搭建
- [x] mock
- [ ] 评价页面demo，crud，搜索框优化
- [ ] 工程结构优化
- [ ] 统一异常处理
- [ ] 登陆拦截




