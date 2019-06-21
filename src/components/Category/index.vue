<template>
  <el-cascader
    placeholder="category"
    :props="cate"
    :show-all-levels="false"
    clearable
    style="width: 435px"
    size="medium"
    @change="handleChange"
  />
</template>

<script>
import { fetchList } from '@/api/common'
const id = 0

export default {
  name: 'Category',
  data() {
    return {
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
    },
    handleChange(val) {
      // console.log('val = ' + val) // like 1,3,6 or 1,2
      // console.log(typeof  val) // like 1,3,6 or 1,2
      // console.log(JSON.stringify(val)) // like 1,3,6 or 1,2
      console.log(Array.from(val).join(',')) // like 1,3,6 or 1,2
      // if (val) {
      //   console.log(new Array(val))
      // }
      this.$emit('cate-change', Array.from(val).join(','))
    //   this.multipleSelection = val
    }
  }
}
</script>
