<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline" label-width="120px">
        <el-form-item label="Audit Status">
          <el-select v-model="listQuery.auditStatus" placeholder="audit status" clearable style="width: 150px" class="filter-item bottom-space">
            <el-option v-for="item in auditStatusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="User Account">
          <el-input v-model="listQuery.pin" placeholder="pin" style="width: 150px" class="filter-item bottom-space" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="SKU">
          <el-input v-model="listQuery.sku" placeholder="commodity number" style="width: 150px" class="filter-item bottom-space" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="Order ID">
          <el-input v-model="listQuery.orderId" placeholder="order number" style="width: 150px" class="filter-item bottom-space" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <br>
        <el-form-item label="Top Status">
          <el-select v-model="listQuery.topStatus" placeholder="top status" clearable style="width: 150px" class="filter-item bottom-space">
            <el-option v-for="item in topStatusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Share Status">
          <el-select v-model="listQuery.shareStatus" placeholder="share status" clearable style="width: 150px" class="filter-item bottom-space">
            <el-option v-for="item in shareStatusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Grade">
          <el-select v-model="listQuery.grade" placeholder="grade" clearable style="width: 150px" class="filter-item bottom-space">
            <el-option v-for="item in gradeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Nick Name">
          <el-input v-model="listQuery.orderId" placeholder="nick name" style="width: 150px" class="filter-item bottom-space" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <br>

        <el-form-item label="Keyword">
          <el-input v-model="listQuery.keyword" placeholder="keyword" style="width: 435px" class="filter-item bottom-space" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="Category">
          <category @cate-change="listQuery.category=$event" />
        </el-form-item>
        <br>
        <el-form-item label="Comment Time">
          <date-time-picker @time-change="listQuery.timeRange=$event" />
        </el-form-item>
        <el-button v-waves class="filter-item bottom-space" type="primary" icon="el-icon-search" @click="handleFilter">
          Search
        </el-button>
        <el-button v-waves class="filter-item bottom-space" type="danger" icon="el-icon-delete" @click="resetSearch">
          Clear
        </el-button>
      </el-form>
    </div>
    <el-divider />

    <div class="well">
      <el-row>
        <el-col :span="22">
          <el-row>
            <el-col :span="5">
              <div class="grid-content">
                <span>审核状态：</span>
                <el-tag v-for="item in items" :key="item.label" :type="item.type" effect="dark">{{ item.label }}</el-tag>
              </div>
            </el-col>
            <el-col :span="5"><div class="grid-content"><span>用户账号：</span>1234567890</div></el-col>
            <el-col :span="5"><div class="grid-content"><span>用户昵称：</span>1223213213</div></el-col>
            <el-col :span="5"><div class="grid-content"><span>评价时间：</span>2019-06-06 13:12:12</div></el-col>
            <el-col :span="4"><div class="grid-content"><span>IP地址：</span>12.120.102.102</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="5"><span>订单号：</span>1234567890</el-col>
            <el-col :span="5">
                <el-row>
                  <el-col :span="5"><span>评分：</span></el-col>
                  <el-col :span="19">
                      <el-rate v-model="score" disabled show-score text-color="#ff9900"></el-rate>
                  </el-col>
                </el-row>
            </el-col>
            <el-col :span="5"><span>商品号：</span>1234567890</el-col>
            <el-col :span="9">
              <span>商品名称：</span><el-link type="primary" href='http://item.jd.com/18164614013.html' target="_blank">电子琴儿童音乐玩具</el-link>
            </el-col>
          </el-row>
          <el-row>
            <div class="grid-content"><span>原文评价：</span>1234567890</div>
          </el-row>
          <el-row>
              <span>展示评价：</span>1234**7890
              <el-button type="text" size="medium" round @click="changeCommentDialogVisible = true">修改</el-button>
              <el-dialog title="修改评价展示内容" :visible.sync="changeCommentDialogVisible">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea"></el-input>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="changeCommentDialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="changeCommentDialogVisible = false">确 定</el-button>
                </div>
              </el-dialog>
              <el-link type="primary" href='http://item.jd.com/18164614013.html' target="_blank">查看回复</el-link>
          </el-row>
          <!-- <el-row >
            <el-col :span="2" v-for ="item in urls" :key="item">
              <img :src="item" style="width: 100px; height: 100px" title="点击放大" @click="bigImgDialog = true">
              <i class="el-icon-error" title="点击删除" style="position: relative; bottom:98px; right:10px; width: 10px; height: 10px; color:red" @click="imgDelete()"></i>
            </el-col>
            <el-dialog title="图片放大效果图" :visible.sync="bigImgDialog">
              <template>
                <el-carousel :interval="5000" :arrow="always" :autoplay="false" :initial-index="2"  type="card">
                  <el-carousel-item v-for="item in urls" :key="item">
                    <img title="点击删除" :src="item" class="carousel_image_type"/>
                  </el-carousel-item>
                </el-carousel>
              </template>
              <span slot="footer" class="dialog-footer">
                <el-button @click="bigImgDialog = false">取 消</el-button>
                <el-button type="primary" @click="bigImgDialog = false">确 定</el-button>
              </span>
            </el-dialog>
          </el-row> -->

            <el-row >
              <el-col :span="2" v-for ="item in urls" :key="item">
                <el-popover
                  placement="top-start"
                  trigger="hover">
                  <img :src="item">
                  <img :src="item" style="width: 100px; height: 100px" slot="reference">
                </el-popover>
                <i class="el-icon-error" title="点击删除" style="position: relative; bottom:98px; right:10px; width: 10px; height: 10px; color:red" @click="imgDelete()"></i>
              </el-col>
            </el-row>
        </el-col>
        <el-col :span="2">
          <template>
            <div style="margin-top: 20px">
              <el-radio class="center-horizontal" v-model="radio2" label="1" border size="medium">通过&nbsp&nbsp&nbsp&nbsp</el-radio>
            </div>
            <div style="margin-top: 20px">
              <el-radio class="center-horizontal" v-model="radio2" label="2" border size="medium">不通过</el-radio>
            </div>
            <div style="margin-top: 20px">
              <el-radio class="center-horizontal" v-model="radio2" label="3" border size="medium">不处理</el-radio>
            </div>
          </template>
        </el-col>
      </el-row>
    </div>


    
    
    <pagination v-show="total>=10" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" style="padding: 20px 0 5px" @pagination="getList" />
    
    <el-form ref="form" :model="items" label-width="80px">
      
      <div v-for ="item in items" :key="item">
        <el-form-item label="活动名称">
          {{item.type}}
           <el-input v-model="item.type" ></el-input>
        </el-form-item>
      </div>

      <el-form-item>
        <el-button type="primary" @click="submitForm(items)">提交</el-button>
        <el-button @click="resetForm(items)">重置</el-button>
      </el-form-item>
    </el-form>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" style="padding: 20px 0 5px" @pagination="getList" />
  </div>
</template>

<script>
import { fetchPv, createArticle } from '@/api/article'
import { fetchList, updateContent } from '@/api/comment'
import waves from '@/directive/waves' // waves directive
import { getToken } from '@/utils/auth' // get token from cookie
// import { parseTime } from '@/utils/index'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Category from '@/components/Category'
import DateTimePicker from '@/components/DateTimePicker'

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
  components: { Pagination, Category, DateTimePicker },
  directives: { waves },
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
      radio2:'1',
      changeCommentDialogVisible:false,
      bigImgDialog:false,
      textarea:'在此处修改展示评价',
      score:4.7,
      items: [
          { type: '', label: '待审核' },
          { type: 'success', label: '已通过' },
          { type: 'danger', label: '不通过' },
        ],
      urls: [
        'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
        'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
        'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
        'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
        'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
        'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
        ],
    
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
    tableRowClassName({ row, rowIndex }) {
      if (row.score === 1) {
        return 'danger-row'
      } else if (row.score < 4) {
        return 'warning-row'
      }
      return ''
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

    submitForm(items){
      console.log(items);
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
  /* .demo-block-control{box-sizing:border-box;background-color:#fff;border-bottom-left-radius:4px;border-bottom-right-radius:4px;text-align:center;margin-top:-1px;color:#d3dce6;cursor:pointer;position:relative}
  .demo-block-control:hover{color:#409eff;background-color:#f9fafc} */
  .el-row {
      margin-bottom: 5px;
    }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 30px;
    line-height: center;
  }
  .line-height-content{
    line-height: center;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .well{
    min-height: 20px;
    padding: 19px;
    margin-bottom: 2px;
    background-color: #f5f5f5;
    border: 1px solid #e3e3e3;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.05);
    box-shadow: inset 0 1px 1px rgba(0,0,0,.05);
  }
  .center-vertical{
    position: relative;
    top:50%;
    transform:translateY(-50%);
  }
  .center-horizontal{
    position: relative;
    left:50%;
    transform:translateX(-50%);
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  .bannerImg{
    width: 100%;
    height: inherit;
    min-height: 360px;
    min-width: 1400px;
  }
  .carousel_image_type{
      width: 100%;
      height: 100%;
  }

</style>
