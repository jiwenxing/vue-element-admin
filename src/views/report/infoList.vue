<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
        <el-select v-model="listQuery.auditStatus" placeholder="audit status" clearable style="width: 120px"
                   class="filter-item bottom-space">
          <el-option v-for="item in auditStatusOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
        </el-select>
        <el-input v-model="listQuery.pin" placeholder="pin" style="width: 150px" class="filter-item bottom-space"
                  @keyup.enter.native="handleFilter"/>
        <el-input v-model="listQuery.sku" placeholder="commodity number" style="width: 150px"
                  class="filter-item bottom-space" @keyup.enter.native="handleFilter"/>
        <el-input v-model="listQuery.orderId" placeholder="order number" style="width: 150px"
                  class="filter-item bottom-space" @keyup.enter.native="handleFilter"/>
        <el-select v-model="listQuery.grade" placeholder="grade" clearable style="width: 120px"
                   class="filter-item bottom-space">
          <el-option v-for="item in gradeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
        </el-select>
        <el-select v-model="listQuery.topStatus" placeholder="top status" clearable style="width: 120px"
                   class="filter-item bottom-space">
          <el-option v-for="item in topStatusOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
        </el-select>
        <el-select v-model="listQuery.shareStatus" placeholder="share status" clearable style="width: 130px"
                   class="filter-item bottom-space">
          <el-option v-for="item in shareStatusOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
        </el-select>
        <el-input v-model="listQuery.keyword" placeholder="keyword" style="width: 200px"
                  class="filter-item bottom-space" @keyup.enter.native="handleFilter"/>

        <category @cate-change="listQuery.category=$event"/>
        <date-time-picker @time-change="listQuery.timeRange=$event"/>

        <el-button v-waves class="filter-item bottom-space" type="primary" icon="el-icon-search" @click="handleFilter">
          Search
        </el-button>
        <el-button v-waves class="filter-item bottom-space" type="danger" icon="el-icon-delete" @click="resetSearch">
          Clear
        </el-button>
      </div>
    </div>
    <el-divider/>

    <pagination v-show="total>=10" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding: 20px 0 5px" @pagination="getList"/>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="Comment ID">
              <span>{{row.id}}</span>
            </el-form-item>
            <el-form-item label="Reviewer">
              <span>{{row.reviewer}}</span>
            </el-form-item>
            <el-form-item label="Shop Name">
              <span>{{row.title}}</span>
            </el-form-item>
            <el-form-item label="Price">
              <span>{{row.forecast}}</span>
            </el-form-item>
            <el-form-item label="Category">
              <span>{{row.category}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" align="center"/>
      <el-table-column label="商品" align="center" min-width="100">
        <template slot-scope="{row}">
          <span v-if="row.sku">{{row.sku}}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" min-width="200px">
        <template slot-scope="{row}">
          <el-link icon="el-icon-link" :underline="false" type="info" :href="'https://item.jd.com/' + row.sku + '.html'"
                   target="_blank">{{row.title}}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="评价人" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{row.pin}}</span>
        </template>
      </el-table-column>
      <el-table-column label="举报次数" min-width="100px" align="center">
        <template slot-scope="scope">
          <template>
            <el-button type="text" @click="open">{{scope.row.importance}}</el-button>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="评价内容" min-width="200px">
        <template slot-scope="{row}">
          <span>{{row.content}}</span>
          <el-button size="mini" icon="el-icon-edit" @click="handleUpdate(row)"/>
        </template>
      </el-table-column>
      <el-table-column label="评分" width="95px">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon"/>
        </template>
      </el-table-column>
      <el-table-column label="Audit Status" class-name="status-col" min-width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{row.status | statusShowFilter}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="沉底置顶状态" class-name="status-col" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.topStatus | statusFilter" effect="plain">
            <i :class="row.topStatus | topStatusIconFilter"/>
            {{row.topStatus | topStatusShowFilter}}
          </el-tag>
          <!-- <i :class="row.topStatus | topStatusIconFilter" />
          {{row.topStatus | topStatusShowFilter}} -->
        </template>
      </el-table-column>
      <el-table-column label="评价时间" width="180px" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{scope.row.display_time}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="430" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.status==1" size="mini" type="danger" @click="handleModifyStatus(row, -1)">
            Delete
          </el-button>
          <el-button v-if="row.status==-1" size="mini" type="success" @click="handleModifyStatus(row, 1)">
            Pass
          </el-button>
          <el-button v-if="row.status==0" size="mini" type="success" @click="handleModifyStatus(row, 1)">
            Passed
          </el-button>
          <el-button v-if="row.status==0" size="mini" type="danger" @click="handleModifyStatus(row, -1)">
            Delete
          </el-button>
          <el-button v-if="(row.topStatus==0 || row.topStatus==-1) && row.status==1" size="mini" type="success"
                     @click="handleModifyTopStatus(row, 1)">
            Top
          </el-button>
          <el-button v-if="(row.topStatus==0 || row.topStatus==1) && row.status==1" size="mini" type="danger"
                     @click="handleModifyTopStatus(row, -1)">
            Sink
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding: 20px 0 5px" @pagination="getList"/>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px"
               style="width: 500px; margin-left:50px;">
        <!-- <el-form-item label="Begin Time" prop="type">
          <el-select v-model="temp.type" class="filter-item bottom-space" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="End Time" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item> -->
        <el-form-item label="Content" label-width="90px" prop="content"
                      :rules="[{ required: true, message: 'Content cannot be empty!'}]">
          <el-input v-model="temp.content" type="textarea" :rows="3"/>
        </el-form-item>
        <!-- <el-form-item :label="$t('table.status')">
          <el-select v-model="temp.status" class="filter-item bottom-space" placeholder="Please select">
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
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchPv, createArticle} from '@/api/article'
  import {fetchList, updateContent} from '@/api/comment'
  import waves from '@/directive/waves' // waves directive
  import {getToken} from '@/utils/auth' // get token from cookie
  // import { parseTime } from '@/utils/index'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import Category from '@/components/Category'
  import DateTimePicker from '@/components/DateTimePicker'

  const auditStatusOptions = [
    {key: 1, display_name: 'Passed'},
    {key: -1, display_name: 'Deleted'},
    {key: 0, display_name: 'Auditing'}
  ]

  const gradeOptions = [
    {key: '1', display_name: 'Good'},
    {key: '2', display_name: 'General'},
    {key: '3', display_name: 'Bad'}
  ]
  const topStatusOptions = [
    {key: '1', display_name: 'Topped'},
    {key: '-1', display_name: 'Sinked'}
  ]
  const shareStatusOptions = [
    {key: '0', display_name: 'Yes'},
    {key: '1', display_name: 'No'}
  ]

  export default {
    name: 'ComplexTable',
    components: {Pagination, Category, DateTimePicker},
    directives: {waves},
    filters: {
      statusFilter(status) {
        const statusMap = {
          '1': 'success',
          '0': 'info',
          '-1': 'danger'
        }
        return statusMap[status]
      },
      statusShowFilter(status) {
        const statusMap = {
          '1': 'Passed',
          '0': 'Auditing',
          '-1': 'Deleted'
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
        showAll: false,
        multipleSelection: [],
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          auditStatus: 0,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
        importanceOptions: [1, 2, 3],
        auditStatusOptions,
        gradeOptions,
        topStatusOptions,
        shareStatusOptions,
        statusOptions: ['passed', 'auditing', 'deleted'],
        showReviewer: false,
        temp: {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          type: '',
          status: 'published'
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          type: [{required: true, message: 'type is required', trigger: 'change'}],
          timestamp: [{type: 'date', required: true, message: 'timestamp is required', trigger: 'change'}],
          title: [{required: true, message: 'content is required', trigger: 'blur'}]
        },
        downloadLoading: false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          const items = response.data.items
          this.total = response.data.total
          this.list = items.map(v => {
            this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
            v.originalContent = v.Content //  will be used when user click the cancel botton
            return v
          })

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      resetSearch() {
        this.listQuery.auditStatus = ''
        this.listQuery.pin = ''
        this.listQuery.sku = ''
        this.listQuery.orderId = ''
        this.listQuery.grade = ''
        this.listQuery.topStatus = ''
        this.listQuery.keyword = ''
        this.getList()
      },
      cancelEdit(row) {
        row.content = row.originalContent
        row.edit = false
        this.$message({
          message: 'The title has been restored to the original value',
          type: 'warning'
        })
      },
      confirmEdit(row) {
        row.edit = false
        row.originalContent = row.content
        this.$message({
          message: 'The title has been edited',
          type: 'success'
        })
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
      },
      handleModifyTopStatus(row, status) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.topStatus = status
      },
      sortChange(data) {
        const {prop, order} = data
        if (prop === 'id') {
          this.sortByID(order)
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      sortByID(order) {
        if (order === 'ascending') {
          this.listQuery.sort = '+id'
        } else {
          this.listQuery.sort = '-id'
        }
        this.handleFilter()
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          status: 'published',
          type: ''
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
            this.temp.author = 'vue-element-admin'
            createArticle(this.temp).then(() => {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
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
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            updateContent(tempData).then(() => {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleDelete(row) {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      },
      handleFetchPv(pv) {
        fetchPv(pv).then(response => {
          this.pvData = response.data.pvData
          this.dialogPvVisible = true
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

  /* .demo-block-control{box-sizing:border-box;background-color:#fff;border-bottom-left-radius:4px;border-bottom-right-radius:4px;text-align:center;margin-top:-1px;color:#d3dce6;cursor:pointer;position:relative}
  .demo-block-control:hover{color:#409eff;background-color:#f9fafc} */

</style>
