<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-row :gutter="15">
          <el-col :span="5">
            <el-form-item>
              <div class="el-input-group">
                <div class="el-input-group__prepend">Audit Status</div>
                <el-select v-model="listQuery.textStatus" placeholder="audit status" clearable class="filter-item my-select" size="medium">
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
              <date-time-picker style="width: 450px; height:36px" @time-change="listQuery.timeRange=$event"/>
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
                  <category style="width: 325px; height:36px" @cate-change="listQuery.category=$event" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
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
    <!-- <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox> -->
    <div style="margin: 15px 0;" />
    <!-- <el-form ref="form" :model="items" label-width="80px"> -->
      <div v-for="item in list" :key="item">
        <div class="well">
          <el-row>
            <el-col :span="22">
              <el-row style="margin-bottom: 5px;">
                <el-col :span="5">
                  <div class="grid-content">
                    <el-checkbox-group v-model="checkedList" @change="handleCheckedChange">
                      <el-checkbox :label="item.id">
                        <el-tag size="small" :type="item.textStatus | statusFilter" effect="dark">
                          {{ item.textStatus | statusShowFilter }}
                        </el-tag>
                        <el-tag v-if="item.textStatus==1 && item.topped!=0" :type="item.topped | statusFilter" effect="plain" size="small">
                          <i :class="item.topped | topStatusIconFilter" />
                        </el-tag>
                      </el-checkbox>
                    </el-checkbox-group>
                    <!-- <span>审核状态：</span> -->
                  </div>
                </el-col>
                <el-col :span="5"><div class="grid-content"><span>用户账号：</span>{{ item.userPin }}</div></el-col>
                <el-col :span="5"><div class="grid-content"><span>用户昵称：</span>{{ item.userNickName }}</div></el-col>
                <el-col :span="5"><div class="grid-content"><span>评价时间：</span>{{ item.creationTime }}</div></el-col>
                <el-col :span="4"><div class="grid-content"><span>IP地址：</span>{{ item.userIp }}</div></el-col>
              </el-row>
              <el-row style="margin-bottom: 17px;">
                <el-col :span="5"><span>订单号：</span>{{ item.objectId }}</el-col>
                <el-col :span="5">
                    <el-row>
                      <el-col :span="5"><span>评分：</span></el-col>
                      <el-col :span="19">
                          <el-rate v-model="item.score" disabled show-score text-color="#ff9900" />
                      </el-col>
                    </el-row>
                </el-col>
                <el-col :span="5"><span>商品号：</span>{{ item.referenceEventId }}</el-col>
                <el-col :span="7" class="hidden-text">
                  <span>商品名称：</span>
                  <el-link type="primary" :href="'http://item.jd.com/' + item.referenceEventId + '.html'" target="_blank">
                    <span>{{ item.commodityName }}</span>
                  </el-link>
                </el-col>
              </el-row>
              <el-row class="hidden-text">
                <div class="grid-content"><span>原文评价：</span>{{ item.content }}</div>
              </el-row>
              <el-row style="margin-bottom: 25px;">
                  <span>展示评价：</span>{{ item.content }}
                  <el-button type="text" size="medium" round @click="readCommentContent(item.content),changeCommentDialogVisible = true">修改</el-button>
                  <el-dialog title="修改评价展示内容" :visible.sync="changeCommentDialogVisible">
                    <el-input v-model="comment_content" type="textarea" :rows="2" placeholder="请输入内容" />
                    <div slot="footer" class="dialog-footer">
                      <el-button @click="changeCommentDialogVisible = false">取 消</el-button>
                      <el-button type="primary" @click="changeCommentDialogVisible = false">确 定</el-button>
                    </div>
                  </el-dialog>
                  <el-link type="primary" href='http://item.jd.com/18164614013.html' target="_blank">查看回复</el-link>
              </el-row>
              <el-row>
                <el-col v-for ="imgUrl in urls" :key="imgUrl" :span="2">
                  <el-popover
                    placement="top-start"
                    trigger="hover">
                    <el-image :src="imgUrl" :fit="contain" style="max-width: 300px; max-height: 300px" />
                    <el-image :src="imgUrl" :fit="contain" slot="reference" style="width: 100px; height: 100px"/>
                  </el-popover>
                  <i class="el-icon-error" title="点击删除" style="position: relative; bottom:98px; right:10px; width: 10px; height: 10px; color:red" @click="imgDelete()"></i>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="1">
              <div style="margin-top: 20px">
                <el-button v-if="item.textStatus===1" plain size="mini" type="danger" @click="handleModifyAuditStatus(item, -1)">
                  Delete
                </el-button>
              </div>
              <div style="margin-top: 20px">
                <el-button v-if="item.textStatus===-1" plain size="mini" type="success" @click="handleModifyAuditStatus(item, 1)">
                  Pass
                </el-button>
              </div>
              <div style="margin-top: 20px">
                <el-button v-if="item.textStatus===2" plain size="mini" type="success" @click="handleModifyAuditStatus(item, 1)">
                  Passed
                </el-button>
              </div>
              <div style="margin-top: 20px">
                <el-button v-if="item.textStatus===2" plain size="mini" type="danger" @click="handleModifyAuditStatus(item, -1)">
                  Delete
                </el-button>
              </div>
              <div style="margin-top: 20px">
                <el-button v-if="(item.topped===0 || item.topped===-1) && item.textStatus===1" plain size="mini" type="success" @click="handleModifyTopStatus(item, 1)">
                  Top
                </el-button>
              </div>
              <div style="margin-top: 20px">
                <el-button v-if="(item.topped===0 || item.topped===1) && item.textStatus===1" plain size="mini" type="danger" @click="handleModifyTopStatus(item, -1)">
                  Sink
                </el-button>
              </div>
              <div style="margin-top: 20px">
                <el-button v-if="(item.textStatus===1 && item.topped!=0) && item.textStatus===1" plain size="mini" type="info" @click="handleModifyTopStatus(item, 0)">
                  Nomal
                </el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <div style="min-height: 10px"></div>
      </div>
      <el-row>
        <el-col :span="2">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
        </el-col>
        <el-col :span="4" :offset="18">
          <el-button v-if="listQuery.textStatus===2" type="primary" @click="submitForm()">批量审核</el-button>
          <el-button v-if="listQuery.textStatus===1 || listQuery.textStatus===2 || listQuery.textStatus===0" type="danger" @click="resetForm(items)">批量删除</el-button>
        </el-col>
      </el-row>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" style="padding: 20px 0 5px" @pagination="getList" />
    <el-tooltip placement="top" content="Back to Top">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="400" :back-position="50" transition-name="fade" />
    </el-tooltip>
  </div>
</template>

<script>
import { fetchList, updateContent, updateAuditStatus, updateTopStatus } from '@/api/comment'
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
  name: 'ComplexTable',
  components: { Pagination, Category, DateTimePicker, BackToTop },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': 'success',
        '2': '',
        '0': '',
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
      imageAuditStatus: '1',
      changeCommentDialogVisible: false,
      bigImgDialog: false,
      score: 4.7,
      urls: [
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1560635595940&di=88442870c2db5e4f352c72e8a073565c&imgtype=0&src=http%3A%2F%2Fimage.uc.cn%2Fo%2Fwemedia%2Fs%2Fupload%2F2019%2FxlCJf41d76bj3a5%2F6025017828e55d8441b27d8920f240b1.png%3B%2C3%2Cjpegx%3B3%2C310x',
        'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
        'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
        'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
        'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
        'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
        'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
        'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
      ],
      checkAll: false,
      isIndeterminate: true,
      checkedList: [],

      comment_content: '',
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
      },
      showAll: false,
      multipleSelection: [],
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
      showReviewer: false,
      temp: {
        id: undefined,
        score: 1,
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
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'content is required', trigger: 'blur' }]
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
    sortChange(data) {
      const { prop, order } = data
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
        score: 1,
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
    imgDelete() {
      alert('确定删除图片吗？')
    },

    submitForm() {
      console.log(this.checkedList)
    },
    readCommentContent(content) {
      this.comment_content = content
    },
    closeDialog(content) {
      console.log(content)
    },
    handleCheckAllChange(val) {
      if (val) {
        let allCheckedList = [];
        for (let i = 0;i < this.list.length;i++) {
          allCheckedList.push(this.list[i].id);
        }
        this.checkedList = allCheckedList;
      } else {
        this.checkedList = [];
      }
      this.isIndeterminate = false;
    },
    handleCheckedChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.list.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.list.length;
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
  /* .el-row {
    margin-bottom: 5px;
  } */
  .el-col {
    border-radius: 4px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 30px;
    line-height: center;
  }
  .well {
    min-height: 20px;
    padding: 19px;
    margin-bottom: 2px;
    background-color: #f5f5f5;
    border: 1px solid #e3e3e3;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.05);
    box-shadow: inset 0 1px 1px rgba(0,0,0,.05);
  }
  .center-horizontal {
    position: relative;
    left:50%;
    transform:translateX(-50%);
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
  .hidden-text {
    white-space: nowrap;
    text-overflow:ellipsis;
    overflow: hidden;
  }
  .demo-form-inline >>> .el-input-group__prepend { 
    width: 125px;
    text-align: center;
  }
  .my-select {
    width: 185px;
    text-align: center;
  }
</style>
