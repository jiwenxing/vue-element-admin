<template>
  <el-cascader
    placeholder="category"
    :props="cate"
    clearable
  />
</template>

<script>
let id = 0

export default {
  name: 'Category',
  data() {
    return {
      cate: {
        checkStrictly: true,
        lazy: true,
        lazyLoad (node, resolve) {
          const { level } = node;
          setTimeout(() => {
            const nodes = Array.from({ length: level + 1 })
            .map(item => ({
                value: ++id,
                label: `选项${id}`,
                leaf: level >= 2
            }));
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(nodes);
          }, 1000);
        }
      }
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', { page: this.currentPage, limit: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    }
  }
}
</script>