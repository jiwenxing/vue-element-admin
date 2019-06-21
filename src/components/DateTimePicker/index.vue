<template>
  <el-date-picker
    v-model="value"
    type="datetimerange"
    :picker-options="pickerOptions"
    range-separator="-"
    start-placeholder="起始时间"
    end-placeholder="结束时间"
    align="right"
    style="width: 435px"
    value-format="yyyy-MM-dd HH:mm:ss"
    @change="handleChange"
  />
</template>

<script>
export default {
  props: ['dateValue'],
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '昨天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '近一月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '近三月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 3)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '近半年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 6)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '近一年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      value: [new Date(new Date() - 3600 * 1000 * 24), new Date()]
    }
  },
  watch: {
    value (newValue) {
      this.$emit('update:dateValue', newValue)
    },
    dateValue () {
      if(this.dateValue) {
        this.value = this.dateValue
      }
    }
  },
  methods: {
    handleChange(val) {
      this.$emit('time-change', val)
      console.log('time-change val = ' + val) // like 1,3,6 or 1,2
    //   this.multipleSelection = val
    }
  }
}
</script>
