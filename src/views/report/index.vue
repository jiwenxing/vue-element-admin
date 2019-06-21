<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="param" class="demo-form-inline" label-width="120px">
        <el-form-item>
          <span class="el-input-group__append formLabel">举报状态</span>
          <el-select v-model="param.status" placeholder="举报状态" clearable style="width: 120px;" class="filter-item bottom-space">
            <el-option value="">请选择</el-option>
            <el-option v-for="(itemValue, itemKey) in reportStatus" :key="itemKey" :label="itemValue" :value="itemKey" />
          </el-select>
        </el-form-item>
        <el-input v-model="param.sku" placeholder="商品编号" style="width: 200px" class="filter-item bottom-space">
          <template slot="prepend">商品编号:</template>
        </el-input>
        <el-input v-model="param.pin" placeholder="举报人" style="width: 200px" class="filter-item bottom-space">
          <template slot="prepend">举报人:</template>
        </el-input>
        <el-input v-model="param.content" placeholder="举报内容" style="width: 300px" class="filter-item bottom-space">
          <template slot="prepend">举报内容:</template>
        </el-input>
        <el-form-item>
          <span class="el-input-group__append formLabel">举报时间</span>
          <date-time-picker :dateValue.sync="timeRange" />
        </el-form-item>
        <br />
        <el-button v-waves class="filter-item bottom-space" type="primary" icon="el-icon-search" @click="handleFilter">
          查询
        </el-button>
        <el-button v-waves class="filter-item bottom-space" type="danger" icon="el-icon-refresh" @click="resetSearch">
          重置
        </el-button>
      </el-form>
    </div>
    <el-divider />

    <pagination v-show="totalCount>=0" :total="totalCount" :page.sync="param.pageIndex" :limit.sync="param.pageSize" style="padding: 20px 0 5px" @pagination="getList" />

    <el-table :key="tableKey" v-loading="listLoading" :data="list" :row-class-name="tableRowClassName" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="商品" align="center" min-width="60px">
        <template slot-scope="{row}">
          <span v-if="row.sku">{{ row.sku }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" min-width="150px">
        <template slot-scope="{row}">
          <el-link icon="el-icon-link" :underline="false" type="info" :href="'https://item.jd.com/' + row.sku + '.html'" target="_blank">
            {{ row.skuName | contentFilter }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="评价人" min-width="85px" align="center">
        <template slot-scope="{row}">
          <span ref="reportInfoList" @click="reportInfoDialog = true">{{ row.pin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="举报次数" min-width="45px" align="center">
        <template slot-scope="{row}">
          <el-button type="text" @click="openReportInfoList(row)">{{ row.reportCount }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="评价内容" min-width="265px">
        <template slot-scope="{row}">
          <span>{{ row.content }}</span><br/>
          <span v-for="image in row.imageList">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="image"/>
              <img slot="reference" :src="image" style="width:96px; height:128px;margin-right: 5px">
            </el-popover>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="评分" width="92px">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.score" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" min-width="55px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="String(row.status)">
            {{ auditStatus[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="沉底置顶" class-name="status-col" min-width="50px">
        <template slot-scope="{row}">
          <el-tag :type="String(row.topStatus)" effect="plain">
            <i :class="row.topStatus | topStatusIconFilter" />
            {{ topStatus[row.topStatus] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="评价时间" min-width="100px" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="45px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="danger" @click="deleteComment(row, -1)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="totalCount>0" :total="totalCount" :page.sync="param.pageIndex" :limit.sync="param.pageSize" style="padding: 20px 0 5px" @pagination="getList" />

    <!-- 举报详情列表 -->
    <el-dialog title="举报详情列表" :visible.sync="reportInfoDialog" width="70%"> <!--:before-close="handleClose">-->
      <el-table :key="tableKey" v-loading="listLoading" :data="reportInfoList" border fit highlight-current-row style="width: 100%;">
        <el-table-column label="举报人" min-width="60px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.pin }}</span>
          </template>
        </el-table-column>
        <el-table-column label="原因" min-width="30px" align="center">
          <template slot-scope="{row}">
            <span>{{ reasonMap[row.reasonId] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="内容" min-width="200px">
          <template slot-scope="{row}">
            <span>{{ row.content }}</span><br/>
            <span v-for="image in row.pictureList">
            <el-popover
              placement="right"
              title=""
              trigger="hover">
              <img :src="image"/>
              <img slot="reference" :src="image" style="width:96px; height:128px;margin-right: 5px">
            </el-popover>
          </span>
          </template>
        </el-table-column>
        <el-table-column label="类型" min-width="30px" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.type">
              <span v-if="row.type == 0">用户</span>
              <span v-if="row.type == 1">商家</span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" class-name="status-col" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span > {{ reportStatus[row.status] }} </span>
          </template>
        </el-table-column>
        <el-table-column label="举报时间" width="180px" align="center">
          <template slot-scope="{row}">
            <i class="el-icon-time" />
            <span>{{ row.reportTime }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { fetchPv, createArticle } from '@/api/article'
import { queryReportList, queryReasonList, deleteComment } from '@/api/report'
import waves from '@/directive/waves' // waves directive
import { getToken } from '@/utils/auth' // get token from cookie
// import { parseTime } from '@/utils/index'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Category from '@/components/Category'
import DateTimePicker from '@/components/DateTimePicker'
import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";
import { parseTime } from '@/utils/index'

export default {
  name: 'ComplexTable',
  components: {
    ElFormItem,
    Pagination, Category, DateTimePicker },
  directives: { waves },
  filters: {
    contentFilter(content) {
      if (content.length > 20) {
        return content.substr(0, 20) + '...'
      } else {
        return content
      }
    },
    topStatusIconFilter(status) {
      const statusMap = {
        '1': 'el-icon-top',
        '0': 'el-icon-minus',
        '-1': 'el-icon-bottom'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      showAll: false,
      multipleSelection: [],
      tableKey: 0,
      list: null,
      reportInfoList: [],
      reasonMap: {},
      totalCount: 0,
      listLoading: true,
      timeRange: [parseTime(new Date() - 3600 * 1000 * 24, '{y}-{m}-{d} {h}:{i}:{s}'), parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')],
      param: {
        pageIndex: 1,
        pageSize: 20,
        status: '',
        sku: '',
        pin: '',
        content: '',
        reportTimeStart: '',
        reportTimeEnd: ''
      },
      scoreOptions: [1, 2, 3],
      auditStatus: { '1': '审核通过', '-1': '已删除', '0': '待审核' },
      topStatus: { '0': '其他', '1': '置顶', '-1': '沉底', '-2': '折叠' },
      reportStatus: { 1: '待审核', 2: '审核中', 3: '审核被拒绝', 4: '审核被驳回', 5: '审核已取消', 6: '审核已完成', 7: '审核未通过', 8: '审核已通过' },
      reportInfoDialog: false,
      pvData: [],
      downloadLoading: false
    }
  },
  created() {
    this.getReasonList()
    this.getList()
  },
  methods: {
    getReasonList() {
      queryReasonList().then(response => {
        if(response.code == 0) {
          this.reasonMap = response.reasonMap
        } else {
          this.$notify({
            title: '错误',
            message: '查询出错，错误码：' + response.code,
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    getList() {
      this.listLoading = true
      queryReportList(this.param).then(response => {
        if(response.code == 0) {
          this.list = response.reportCommentList
          this.totalCount = response.totalCount
        } else {
          this.$notify({
            title: '错误',
            message: '查询出错，错误码：' + response.code,
            type: 'error',
            duration: 2000
          })
        }
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      if (this.timeRange) {
        this.param.reportTimeStart = this.timeRange[0]
        this.param.reportTimeEnd = this.timeRange[1]
      } else {
        this.param.reportTimeStart = ''
        this.param.reportTimeEnd = ''
      }
      this.getList()
    },
    resetSearch() {
      this.param.status = ''
      this.param.pin = ''
      this.param.sku = ''
      this.param.content = ''
      this.param.reportTimeStart = parseTime(new Date() - 3600 * 1000 * 24, '{y}-{m}-{d} {h}:{i}:{s}')
      this.param.reportTimeEnd = parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
      this.timeRange = [parseTime(new Date() - 3600 * 1000 * 24, '{y}-{m}-{d} {h}:{i}:{s}'), parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')]
      this.getList()
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.score === 1) {
        return 'danger-row'
      } else if (row.score < 4) {
        return 'warning-row'
      }
      return ''
    },
    deleteComment(row, status) {
      const deleteParam = {id: id}
      deleteComment(deleteParam).then(response => {
        const code = response.reportCommentList
        this.totalCount = response.totalCount
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      row.status = status
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    openReportInfoList(data) {
      this.reportInfoDialog = true
      this.reportInfoList = data.reportInfoList
    }
  }
}

</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }

  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }

  .bottom-space {
    margin-bottom: 5px;
  }

  /* .demo-table-expand {
    font-size: 0;
  } */
  /* .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  } */
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    display: block;
  }

.warning-row {
  background-color: #fff1de;
}
.danger-row {
  background-color: #e2d2d5;
}
.text-hidden{
  overflow: hidden;
  -webkit-line-clamp: 1;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
.formLabel {
  border-bottom-left-radius: 5px;
  display: inline-block;
  width: 100px;
  /* box-sizing: border-box; */
  height: 40px;
  margin-top: -3px;
  border-top-left-radius: 5px;
  border-left: 1px solid #DCDFE6;
  margin-right: -8px;
  z-index: 9;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
  /* .demo-block-control{box-sizing:border-box;background-color:#fff;border-bottom-left-radius:4px;border-bottom-right-radius:4px;text-align:center;margin-top:-1px;color:#d3dce6;cursor:pointer;position:relative}
  .demo-block-control:hover{color:#409eff;background-color:#f9fafc} */

</style>
