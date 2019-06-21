<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline" label-width="120px">
        <el-form-item label="Audit Status">
          <el-select v-model="listQuery.auditStatus" placeholder="audit status" clearable style="width: 150px" class="filter-item">
            <el-option v-for="item in auditStatusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="User Account">
          <el-input v-model="listQuery.pin" placeholder="pin" style="width: 150px" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="SKU">
          <el-input v-model="listQuery.sku" placeholder="commodity number" style="width: 150px" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="Order ID">
          <el-input v-model="listQuery.orderId" placeholder="order number" style="width: 150px" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <br>
        <el-form-item label="Top Status">
          <el-select v-model="listQuery.topStatus" placeholder="top status" clearable style="width: 150px" class="filter-item">
            <el-option v-for="item in topStatusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Grade">
          <el-select v-model="listQuery.grade" placeholder="grade" clearable style="width: 150px" class="filter-item">
            <el-option v-for="item in gradeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Keyword">
          <el-input v-model="listQuery.keyword" placeholder="keyword" style="width: 435px" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <br>
        <el-form-item label="Comment Time">
          <date-time-picker @time-change="listQuery.timeRange=$event" />
        </el-form-item>
        <div v-if="showAll">
          <el-form-item label="Nick Name">
            <el-input v-model="listQuery.orderId" placeholder="nick name" style="width: 150px" class="filter-item" @keyup.enter.native="handleFilter" />
          </el-form-item>
          <el-form-item label="Share Status">
            <el-select v-model="listQuery.shareStatus" placeholder="share status" clearable style="width: 150px" class="filter-item">
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
        </div>
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
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    <div style="margin: 15px 0;"></div>

    <el-form ref="form" :model="items" label-width="80px">
      <div v-for ="item in list" :key="item">
        <div class="well">
          <el-row>
            <el-col :span="21">
              <el-row style="margin-bottom: 5px;">
                <el-col :span="5">
                  <div class="grid-content">
                    <el-checkbox-group v-model="checkedList" @change="handleCheckedChange">
                      <el-checkbox :label="item.id">
                        <el-tag size="small" :type="item.imageAuditStatus | statusFilter" effect="dark">
                          {{ item.imageAuditStatus | statusShowFilter }}
                        </el-tag>
                      </el-checkbox>
                    </el-checkbox-group>
                    <!-- <span>审核状态：</span>
                    <el-tag size="small" :type="item.imageAuditStatus | statusFilter" effect="dark">
                      {{ item.imageAuditStatus | statusShowFilter }}
                    </el-tag> -->
                  </div>
                </el-col>
                <el-col :span="5"><div class="grid-content"><span>用户账号：</span>{{item.userPin}}</div></el-col>
                <el-col :span="5"><div class="grid-content"><span>用户昵称：</span>{{item.userNickName}}</div></el-col>
                <el-col :span="5"><div class="grid-content"><span>评价时间：</span>{{item.display_time}}</div></el-col>
                <el-col :span="4"><div class="grid-content"><span>IP地址：</span>{{item.ip}}</div></el-col>
              </el-row>
              <el-row style="margin-bottom: 17px;">
                <el-col :span="5"><span>订单号：</span>{{item.orderId}}</el-col>
                <el-col :span="5">
                    <el-row>
                      <el-col :span="5"><span>评分：</span></el-col>
                      <el-col :span="19">
                          <el-rate v-model="item.score" disabled show-score text-color="#ff9900"></el-rate>
                      </el-col>
                    </el-row>
                </el-col>
                <el-col :span="5"><span>商品号：</span>{{item.sku}}</el-col>
                <el-col :span="9" class="hidden-text">
                  <span>商品名称：</span>
                  <el-link type="primary" :href="'http://item.jd.com/' + item.sku + '.html'" target="_blank">
                    <span>{{item.commodityName}}</span>
                  </el-link>
                </el-col>
              </el-row>
              <el-row class="hidden-text">
                <div class="grid-content"><span>原文评价：</span>{{item.content}}</div>
              </el-row>
              <el-row style="margin-bottom: 25px;">
                  <span>展示评价：</span>{{item.content}}
                  <el-button type="text" size="medium" round @click="readCommentContent(item.content),changeCommentDialogVisible = true">修改</el-button>
                  <el-dialog title="修改评价展示内容" :visible.sync="changeCommentDialogVisible">
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="comment_content"></el-input>
                    <div slot="footer" class="dialog-footer">
                      <el-button @click="changeCommentDialogVisible = false">取 消</el-button>
                      <el-button type="primary" @click="changeCommentDialogVisible = false">确 定</el-button>
                    </div>
                  </el-dialog>
                  <el-link type="primary" href='http://item.jd.com/18164614013.html' target="_blank">查看回复</el-link>
              </el-row>
              <el-row >
                <el-col :span="2" v-for ="item in urls" :key="item">
                  <el-popover
                    placement="top-start"
                    trigger="hover">
                    <el-image :src="item" :fit="contain" style="max-width: 300px; max-height: 300px" />
                    <el-image :src="item" :fit="contain" style="width: 100px; height: 100px"  slot="reference" />
                  </el-popover>
                  <i class="el-icon-error" title="点击删除" style="position: relative; bottom:98px; right:10px; width: 10px; height: 10px; color:red" @click="imgDelete()"></i>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="2">
              <template>
                <div style="margin-top: 20px">
                  <el-radio class="center-horizontal" v-model="item.imageAuditStatus" label=1 border size="medium">通过&nbsp&nbsp&nbsp</el-radio>
                </div>
                <div style="margin-top: 20px">
                  <el-radio class="center-horizontal" v-model="item.imageAuditStatus" label=-1 border size="medium">不通过</el-radio>
                </div>
                <div style="margin-top: 20px">
                  <el-radio class="center-horizontal" v-model="item.imageAuditStatus" label=0 border size="medium">不处理</el-radio>
                </div>
              </template>
            </el-col>
          </el-row>  
        </div>
        <div style="min-height: 10px"></div>
      </div>
      

      <el-form-item>
        <div style="float:right">
          <el-button type="primary" @click="submitForm()">审核</el-button>
          <el-button @click="resetForm(items)">重置</el-button>
        </div>
      </el-form-item>
    </el-form>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" style="padding: 20px 0 5px" @pagination="getList" />
    <el-tooltip placement="top" content="Back to Top">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="400" :back-position="50" transition-name="fade" />
    </el-tooltip>

    <!-- <el-backtop target=".page-component__scroll .el-scrollbar__wrap" :bottom="100">
      <div
        style="{
          height: 100%;
          width: 100%;
          background-color: #f2f5f6;
          box-shadow: 0 0 6px rgba(0,0,0, .12);
          text-align: center;
          line-height: 40px;
          color: #1989fa;
        }"
      >
        UP
      </div>
    </el-backtop> -->

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
  { key: 0, display_name: 'Auditing' }
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
        '0': '',
        '-1': 'danger'
      }
      return statusMap[status]
    },
    statusShowFilter(status) {
      const statusMap = {
        '1': '已通过',
        '0': '待审核',
        '-1': '未通过'
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
      imageAuditStatus:'1',
      changeCommentDialogVisible:false,
      bigImgDialog:false,
      score:4.7,
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
        auditStatus: 0,
        title: undefined,
        type: undefined,
        sort: '+id'
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
    },

    imgDelete() {
      alert('确定删除图片吗？')
    },

    submitForm(){
      console.log(this.checkedList)
    },
    readCommentContent(content){
      this.comment_content=content
    },
    closeDialog (content) {
      console.log(content)
    },
    handleCheckAllChange(val) {
      if(val){
        let allCheckedList = [];
        for(let i=0;i<this.list.length;i++){
          allCheckedList.push(this.list[i].id);
        }
        this.checkedList = allCheckedList;
      }else{
        this.checkedList = [];
      }
      this.isIndeterminate = false;
    },
    handleCheckedChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.list.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.list.length;
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
  .hidden-text{
    white-space: nowrap;
    text-overflow:ellipsis;
    overflow: hidden;
  }
</style>
