<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-row :gutter="15">
          <el-col :span="5">
            <el-form-item>
              <div class="el-input-group">
                <div class="el-input-group__prepend">Audit Status</div>
                <el-select v-model="listQuery.textStatus" placeholder="audit status" clearable class="filter-item my-select"  size="medium">
                  <el-option v-for="item in auditStatusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-input v-model="listQuery.pin" placeholder="pin" class="filter-item" size="medium">
                <template slot="prepend">User Account</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item>
              <el-input v-model="listQuery.associateName" placeholder="Product Name" style="width: 450px" class="filter-item" size="medium">
                <template slot="prepend">Product Name</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="5">
            <el-form-item>
              <el-input v-model="listQuery.objectId" placeholder="sku" class="filter-item" size="medium">
                <template slot="prepend">SKU</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-input v-model="listQuery.referenceEventId" placeholder="order number" class="filter-item" size="medium">
                <template slot="prepend">Order ID</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item>
              <el-input v-model="listQuery.content" placeholder="content" style="width: 450px" class="filter-item" size="medium">
                <template slot="prepend">Content</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="5">
            <el-form-item>
              <div class="el-input-group">
                <div class="el-input-group__prepend">Top Status</div>
                <el-select v-model="listQuery.topped" placeholder="top status" clearable class="filter-item my-select" size="medium">
                  <el-option v-for="item in topStatusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <div class="el-input-group">
                <div class="el-input-group__prepend">Grade</div>
                 <el-select v-model="listQuery.scoreLevel" placeholder="grade" clearable class="filter-item my-select" size="medium">
                   <el-option v-for="item in gradeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
                 </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item>
              <date-time-picker @time-change="listQuery.timeRange=$event" style="width: 450px; height:36px" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="5">
            <el-form-item>
              <el-input v-model="listQuery.nickName" placeholder="nick name" class="filter-item" size="medium">
                <template slot="prepend">Nick Name</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <div class="el-input-group">
                <div class="el-input-group__prepend">Share Status</div>
                 <el-select v-model="listQuery.shareOrderStatus" placeholder="share status" clearable class="filter-item my-select" size="medium">
                   <el-option v-for="item in shareStatusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
                 </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item>
              <div class="el-input-group">
                <div class="el-input-group__prepend">Category</div>
                  <category @cate-change="listQuery.category=$event" style="width: 325px; height:36px" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
          
        <!-- <div v-if="showAll">
          <el-form-item label="Nick Name">
            <el-input v-model="listQuery.nickName" placeholder="nick name" style="width: 150px" class="filter-item" />
          </el-form-item>
          <el-form-item label="Share Status">
            <el-select v-model="listQuery.shareOrderStatus" placeholder="share status" clearable style="width: 150px" class="filter-item">
              <el-option v-for="item in shareStatusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item label="Category">
            <category @cate-change="listQuery.category=$event" />
          </el-form-item>
        </div>
        <div class="demo-block-control" style="left: 0px;" @click="showAll = !showAll">
          <i :class="[showAll ? 'el-icon-caret-top' : 'el-icon-caret-bottom']" />
          <span v-if="showAll" class="tips">hide extra filter options</span>
          <span v-else class="tips">show more filter options</span>
        </div> -->
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          Search
        </el-button>
        <el-button v-waves class="filter-item" type="danger" icon="el-icon-delete" @click="resetSearch">
          Clear
        </el-button>
      </el-form>
    </div>
    <el-divider />

    <pagination v-show="total>=10" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" style="padding: 20px 0 5px" @pagination="getList" />
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      :row-class-name="tableRowClassName"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="Comment ID:">
              <span>{{ row.id }}</span>
            </el-form-item>
            <el-form-item label="Guid:">
              <span>{{ row.guid }}</span>
            </el-form-item>
            <el-form-item label="Order ID:">
              <span>{{ row.referenceEventId }}</span>
            </el-form-item>
            <el-form-item label="Top Status:">
              <span>{{ row.topped | topStatusShowFilter }}</span>
            </el-form-item>
            <el-form-item label="User Nick Name:">
              <span>{{ row.nickName }}</span>
            </el-form-item>
            <el-form-item label="Commodity Name:">
              <span>{{ row.commodityName }}</span>
            </el-form-item>
            <el-form-item label="IP:">
              <span>{{ row.userIp }}</span>
            </el-form-item>
            <el-form-item label="Client Type:">
              <span>{{ row.clientType }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" align="center" />
      <!-- <el-table-column label="Sku" align="center" min-width="100">
        <template slot-scope="{row}">
          <span v-if="row.sku">{{ row.sku }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="Commodity Name" min-width="200px" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <el-link icon="el-icon-link" :underline="false" type="info" :href="'https://item.jd.com/' + row.sku + '.html'" target="_blank">{{ row.title }}</el-link>
        </template>
      </el-table-column> -->
      <el-table-column label="Commodity" min-width="100px">
        <template slot-scope="{row}">
          <el-tooltip placement="top">
            <div slot="content">{{ row.commodityName }}</div>
            <el-link icon="el-icon-link" :underline="false" type="info" :href="'https://item.jd.com/' + row.objectId + '.html'" target="_blank">{{ row.objectId }}</el-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="Pin" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Content" min-width="300px">
        <template slot-scope="{row}">
          <span>{{ row.content }}</span>
          <el-button size="mini" icon="el-icon-edit" @click="handleUpdate(row)" />
        </template>
      </el-table-column>
      <el-table-column label="Score" width="95px">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.score" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="Audit Status" class-name="status-col" min-width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.textStatus | statusFilter">
            {{ row.textStatus | statusShowFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Top Status" class-name="status-col" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.topStatus | statusFilter" effect="plain">
            <i :class="row.topStatus | topStatusIconFilter" />
            {{ row.topStatus | topStatusShowFilter }}
          </el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="Status" class-name="status-col" width="140" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.textStatus | statusFilter">
            {{ row.textStatus | statusShowFilter }}
          </el-tag>
          <el-tag v-if="row.textStatus==1 && row.topped!=0" :type="row.topped | statusFilter" effect="plain">
            <i :class="row.topped | topStatusIconFilter" />
            <!-- {{ row.topStatus | topStatusShowFilter }} -->
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Comment Time" width="180px" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.creationTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.textStatus===1" plain size="mini" type="danger" @click="handleModifyAuditStatus(row, -1)">
            Delete
          </el-button>
          <el-button v-if="row.textStatus===-1" plain size="mini" type="success" @click="handleModifyAuditStatus(row, 1)">
            Pass
          </el-button>
          <el-button v-if="row.textStatus===2" plain size="mini" type="success" @click="handleModifyAuditStatus(row, 1)">
            Passed
          </el-button>
          <el-button v-if="row.textStatus===2" plain size="mini" type="danger" @click="handleModifyAuditStatus(row, -1)">
            Delete
          </el-button>
          <el-button v-if="(row.topped===0 || row.topped===-1) && row.textStatus===1" plain size="mini" type="success" @click="handleModifyTopStatus(row, 1)">
            Top
          </el-button>
          <el-button v-if="(row.topped===0 || row.topped===1) && row.textStatus===1" plain size="mini" type="danger" @click="handleModifyTopStatus(row, -1)">
            Sink
          </el-button>
          <el-button v-if="(row.textStatus===1 && row.topped!=0) && row.textStatus===1" plain size="mini" type="info" @click="handleModifyTopStatus(row, 0)">
            Nomal
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-footer>
      <el-button size="small" type="primary" @click="batchAuditSelected(1)">Pass Selected</el-button>
      <el-button size="small" type="danger" @click="batchAuditSelected(-1)">Delete Selected</el-button>
    </el-footer>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" style="padding: 20px 0 5px" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 500px; margin-left:50px;">
        <!-- <el-form-item label="Begin Time" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="End Time" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item> -->
        <el-form-item label="Content" label-width="80px" prop="content">
          <el-input v-model="temp.content" type="textarea" maxlength="500" show-word-limit :rows="5" style="width:500px;" />
        </el-form-item>
        <!-- <el-form-item :label="$t('table.status')">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.importance')">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item> -->
        <!-- <el-form-item :label="$t('table.remark')">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          cancel
        </el-button>
        <el-button type="primary" @click="updateData(row)">
          confirm
        </el-button>
      </div>
    </el-dialog>

    <!-- back to top -->
    <el-tooltip placement="top" content="Back to Top">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="400" :back-position="50" transition-name="fade" />
    </el-tooltip>
  </div>
</template>

<script>
import { fetchList, updateContent, batchAuditSelected, updateAuditStatus, updateTopStatus } from '@/api/comment'
import waves from '@/directive/waves' // waves directive
import { getToken } from '@/utils/auth' // get token from cookie
// import { parseTime } from '@/utils/index'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Category from '@/components/Category'
import DateTimePicker from '@/components/DateTimePicker'
import BackToTop from '@/components/BackToTop'

const auditStatusOptions = [
  { key: 1, display_name: 'Passed' },
  { key: -1, display_name: 'Deleted' },
  { key: 2, display_name: 'Auditing' },
  { key: 0, display_name: 'None' }
]

const gradeOptions = [
  { key: '1', display_name: 'Good' },
  { key: '2', display_name: 'General' },
  { key: '3', display_name: 'Bad' }
]
const topStatusOptions = [
  { key: '1', display_name: 'Topped' },
  { key: '-1', display_name: 'Sinked' }
]
const shareStatusOptions = [
  { key: '0', display_name: 'Yes' },
  { key: '1', display_name: 'No' }
]

export default {
  name: 'CommentTable',
  components: { Pagination, Category, DateTimePicker, BackToTop },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': 'success',
        '2': 'info',
        '0': 'info',
        '-1': 'danger'
      }
      return statusMap[status]
    },
    statusShowFilter(status) {
      const statusMap = {
        '1': 'Passed',
        '2': 'Auditing',
        '-1': 'Deleted',
        '0': 'None'
      }
      return statusMap[status]
    },
    topStatusIconFilter(status) {
      const statusMap = {
        '1': 'el-icon-top',
        '0': 'el-icon-minus',
        '-1': 'el-icon-bottom'
      }
      return statusMap[status]
    },
    topStatusShowFilter(status) {
      const statusMap = {
        '1': 'Topped',
        '0': 'Normal',
        '-1': 'Sinked'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      showAll: true,
      multipleSelection: {
        commentIds: [],
        textStatus: undefined,
        topped: undefined,
        token: '',
        clientCode: 'TH'
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        textStatus: 2,
        clientCode: 'TH'
      },
      scoreOptions: [1, 2, 3],
      auditStatusOptions,
      gradeOptions,
      topStatusOptions,
      shareStatusOptions,
      statusOptions: ['passed', 'auditing', 'deleted'],
      temp: {
        id: undefined,
        score: undefined,
        timestamp: new Date(),
        status: undefined,
        content: undefined,
        clientCode: 'TH'
      },
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        // type: [{ required: true, message: 'type is required', trigger: 'change' }],
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        content: [{ required: true, message: 'content is required', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        if (response.result) {
          const items = response.result.list
          this.total = response.result.total
          this.list = items.map(v => {
            this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
            v.originalContent = v.Content //  will be used when user click the cancel botton
            return v
          })
        } else {
          this.list = []
          this.total = 0
        }
        this.listLoading = false
        // Just to simulate the time of the request
        // setTimeout(() => {
        //   this.listLoading = false
        // }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetSearch() {
      this.listQuery.textStatus = undefined
      this.listQuery.pin = undefined
      this.listQuery.objectId = undefined
      this.listQuery.referenceEventId = undefined
      this.listQuery.scoreLevel = undefined
      this.listQuery.topped = undefined
      this.listQuery.content = undefined
      this.listQuery.nickName = undefined
      this.listQuery.shareOrderStatus = undefined
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
    handleModifyAuditStatus(row, status) {
      const param = Object.assign({}, this.temp)
      param.id = row.id
      param.textStatus = status
      let action = 'Pass'
      if (status === -1) {
        action = 'Delete'
      }
      updateAuditStatus(param).then(() => {
        row.textStatus = status
        this.$notify({
          title: 'Success',
          message: action + ' Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleModifyTopStatus(row, status) {
      const param = Object.assign({}, this.temp)
      param.id = row.id
      param.topped = status
      let action = 'Top'
      if (status === -1) {
        action = 'Sink'
      } else if (status === 0) {
        action = 'Reset'
      }
      updateTopStatus(param).then(() => {
        row.topped = status
        this.$notify({
          title: 'Success',
          message: action + ' Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection.commentIds = Array.from(val, x => x.id)
    },
    batchAuditSelected(status) {
      if (this.multipleSelection.commentIds.length === 0) {
        this.$message({
          message: 'nothing selected',
          type: 'warning'
        })
        return
      }
      this.listLoading = true
      const selectedIds = this.multipleSelection.commentIds
      this.multipleSelection.textStatus = status
      this.multipleSelection.token = getToken()
      batchAuditSelected(this.multipleSelection).then(() => {
        setTimeout(() => {
          this.getList()
        }, 1 * 1000)
      })
      this.listLoading = false
      this.$notify({
        title: 'Success',
        message: 'All Selected Comments Audited',
        type: 'success',
        duration: 2000
      })
      // setTimeout(() => {
      //   batchAuditSelected(this.multipleSelection).then(() => {
      //     this.list.forEach(function(item, index, arr) {
      //       const hit = selectedIds.findIndex(function(value, index, arr) {
      //         return value === item.id
      //       }) > -1
      //       if (hit) {
      //         item.textStatus = status
      //       }
      //     })
      //     this.getList()
      //   })
      //   this.listLoading = false
      //   this.$notify({
      //     title: 'Success',
      //     message: 'All Selected Comments Audited',
      //     type: 'success',
      //     duration: 2000
      //   })
      // }, 1 * 1000)
    },
    handleUpdate(row) {
      // this.temp = Object.assign({}, row) // copy obj
      this.temp.content = row.content
      this.temp.id = row.id
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.temp.token = getToken()
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateContent(this.temp).then(() => {
            // for (const v of this.list) {
            //   if (v.id === this.temp.id) {
            //     const index = this.list.indexOf(v)
            //     this.list.splice(index, 1, this.temp)
            //     break
            //   }
            // }
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
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
.el-footer {
  border: solid 2px #ebeef5;
  border-top: 0px;
  color: #333;
  text-align: left;
  line-height: 60px;
  border-radius: 2px;
}
.demo-block-control {
  box-sizing:border-box;
  background-color:#fff;
  border-bottom-left-radius:4px;
  border-bottom-right-radius:4px;
  text-align:center;
  margin-top:-1px;
  color:#d3dce6;
  cursor:pointer;
  position:relative
}
.demo-block-control:hover {
  color:#409eff;
  background-color:#f9fafc
}
/* https://panjiachen.gitee.io/vue-element-admin-site/zh/guide/essentials/style.html#%E7%88%B6%E7%BB%84%E4%BB%B6%E6%94%B9%E5%8F%98%E5%AD%90%E7%BB%84%E4%BB%B6%E6%A0%B7%E5%BC%8F-%E6%B7%B1%E5%BA%A6%E9%80%89%E6%8B%A9%E5%99%A8 */
.demo-form-inline >>> .el-input-group__prepend { 
  width: 125px;
  text-align: center;
}
.my-select {
  width: 185px;
  text-align: center;
}
</style>
