<template>
  <el-cascader
    v-model="showValue"
    placeholder="category"
    :props="cate"
    :show-all-levels="false"
    clearable
    style="width: 435px"
    size="medium"
    @change="$emit('cat-change', $event)"
  />
</template>

<script>
import { fetchList } from '@/api/common'
// const id = 0

export default {
  name: 'Category',
  model: {
    prop: 'categories',
    event: 'cat-change'
  },
  props: {
    categories: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showValue: [],
      cate: {
        checkStrictly: true,
        lazy: true,
        lazyLoad(node, resolve) {
          const { level, value } = node
          const fid = value
          const params = { level, fid }
          console.log(node)
          console.log(params)
          fetchList(params).then(response => {
            const items = response.result
            const nodes = items
              .map(item => ({
                value: item.productSortId,
                label: item.name,
                leaf: level >= 2
              }))
            console.log(nodes)
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(nodes)
          })

          // setTimeout(() => {
          //   const nodes = Array.from({ length: level + 1 })
          //     .map(item => ({
          //       value: ++id,
          //       label: `cate${id}`,
          //       leaf: level >= 2
          //     }))
          //   console.log(nodes)
          //   // 通过调用resolve将子节点数据返回，通知组件数据加载完成
          //   resolve(nodes)
          // }, 1000)
        }
      }
    }
  },
  watch: {
    categories() {
      this.showValue = this.categories
    }
  }
}
</script>
