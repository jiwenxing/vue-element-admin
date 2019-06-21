<template>
  <el-date-picker
    v-model="value"
    type="datetimerange"
    :picker-options="pickerOptions"
    range-separator="-"
    start-placeholder="Begin"
    end-placeholder="End"
    align="right"
    style="width: 435px"
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
          text: 'Last Day',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: 'Last Week',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: 'Last Month',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: 'Last 3 Months',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 3)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: 'Last 6 Months',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 6)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: 'Last 1 Year',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      value: [new Date() - 3600 * 1000 * 24 * 7, new Date()]
    }
  },
  watch: {
    value(newValue) {
      this.$emit('update:dateValue', newValue)
    },
    dateValue() {
      if (this.dateValue) {
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
