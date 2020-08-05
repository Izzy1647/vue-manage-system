<template>
  <div>
    <div class="container">
      <div>
        <el-row :gutter="20">
          <el-col :span="22">
            <el-row :gutter="20" class="mgb20">
              <el-col :span="4">
                <el-card shadow="hover" :body-style="{ padding: '0px' }" style="width: 120px">
                  <div class="grid-content grid-con-1">
                    <!-- <i class="el-icon-lx-people grid-con-icon"></i> -->
                    <div class="grid-cont-right">
                      <div class="grid-num">{{this.ingredients.corn}}</div>
                      <div>玉米</div>
                    </div>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="4">
                <el-card shadow="hover" :body-style="{ padding: '0px' }" style="width: 120px">
                  <div class="grid-content grid-con-2">
                    <!-- <i class="el-icon-lx-notice grid-con-icon"></i> -->
                    <div class="grid-cont-right">
                      <div class="grid-num">{{this.ingredients.bean}}</div>
                      <div>豆粕</div>
                    </div>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="4">
                <el-card shadow="hover" :body-style="{ padding: '0px' }" style="width: 120px">
                  <div class="grid-content grid-con-2">
                    <!-- <i class="el-icon-lx-notice grid-con-icon"></i> -->
                    <div class="grid-cont-right">
                      <div class="grid-num">{{this.ingredients.bran}}</div>
                      <div>麸皮</div>
                    </div>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="4">
                <el-card shadow="hover" :body-style="{ padding: '0px' }" style="width: 120px">
                  <div class="grid-content grid-con-3">
                    <!-- <i class="el-icon-lx-goods grid-con-icon"></i> -->
                    <div class="grid-cont-right">
                      <div class="grid-num">{{this.ingredients.premix}}</div>
                      <div>预混料</div>
                    </div>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="4">
                <el-card shadow="hover" :body-style="{ padding: '0px' }" style="width: 120px">
                  <div class="grid-content grid-con-3">
                    <!-- <i class="el-icon-lx-goods grid-con-icon"></i> -->
                    <div class="grid-cont-right">
                      <div class="grid-num">{{this.ingredients.offmildew}}</div>
                      <div>脱霉剂</div>
                    </div>
                  </div>
                </el-card>
              </el-col>
              
            </el-row>
          </el-col>
        </el-row>
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="类别"
          width="225"
          align="center"
        ></el-table-column>
        <!-- <el-table-column prop="name" label="用户名"></el-table-column> -->
        <el-table-column label="重量" align="center">
          <template slot-scope="scope">{{ scope.row.num  }}kg</template>
        </el-table-column>
        <!-- <el-table-column label="头像(查看大图)" align="center">
          <template slot-scope="scope">
            <el-image
              class="table-td-thumb"
              :src="scope.row.thumb"
              :preview-src-list="[scope.row.thumb]"
            ></el-image>
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="address" label="地址"></el-table-column> -->
        <el-table-column label="流向" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="
                scope.row.direction === 'in'
                  ? 'success'
                  : scope.row.direction === 'out'
                  ? 'danger'
                  : ''
              "
              >{{ scope.row.direction === 'in' ? '买入' : '消耗' }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column prop="date" label="时间" align="center">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.pageIndex"
          :page-size="query.pageSize"

          @current-change="handlePageChange"
        ></el-pagination>
      </div>
      <!-- :total="pageTotal" -->
    </div>

    <!-- 弹出框2  添加母猪信息 -->
    <el-dialog title="添加母猪信息" :visible.sync="addVisible" width="30%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="耳牌号">
          <input name="id" v-model="form.id">
          <!-- <el-input placeholder="输入耳牌号" @input="onInputChange"></el-input> -->
        </el-form-item>
        <el-form-item label="重量">
          <input name="weight" v-model="form.weight">
          <!-- <el-input placeholder="单位:kg" @input="onInputChange"></el-input> -->
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option key="dpz" label="待配种" value="待配种"></el-option>
            <el-option key="ypz" label="已配种" value="已配种"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onAddSubmit">提交</el-button>
          <el-button @click="addVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { fetchData } from '../../api/index'
import { httpGET, httpPOST} from '../../api/fetch'

export default {
  name: 'basetable',
  data() {
    return {
      query: {
        address: '',
        name: '',
        pageIndex: 1,
        pageSize: 10,
      },
      tableData: [],
      multipleSelection: [],
      delList: [],
      editVisible: false,
      addVisible: false,
      pageTotal: 0,
      form: {},
      idx: -1,
      id: -1,
      ingredients: {}
    }
  },
  created() {
    this.getData()
  },

  mounted() {
    console.log("mounted")
    this.getTest()
  },



  methods: {
    getTest() {
      // 进出日志
      httpGET('/stocks')
        .then((res) => {
          let infos = res.data.list
          console.log("stocks log GET", infos)
          infos.forEach(element => {   // 时间戳转换为时间
            element.date = this.timestampToTime(element.date)
            element.direction = element.num > 0 ? 'in' : 'out'
            element.num = Math.abs(element.num)
            element.name = (element.name === 'bran' 
            ? '麸皮' : element.name === 'corn' 
            ? '玉米' : element.name === 'bean'
            ? '豆粕' : element.name === 'offmildew'
            ? '脱霉剂' : element.name === 'premix'
            ? '预混料' : null )
          })
          
          this.tableData = infos
        })
        .catch((err) => {
          console.log("stocksGET err:", err)
        })
      
      // 各种原料的总数
      httpGET('/stocks/count')
        .then((res) => {
          console.log("stocks/count res:", res)
          this.ingredients = res.data
        })
        .catch((err) => {
          console.log("stocks count err:", err)
        })
    },

    // 时间戳转日期字符串
    timestampToTime(timestamp) {
      let date = new Date(timestamp)
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
      let D = (date.getDate()+1 < 10 ? '0'+(date.getDate()+1) : date.getDate()+1) + ' ' 
      let h = (date.getHours()+1 < 10 ? '0'+(date.getHours()+1) : date.getHours()+1) + ':'
      let m = (date.getMinutes()+1 < 10 ? '0'+(date.getMinutes()+1) : date.getMinutes()+1) + ':'
      let s = (date.getSeconds()+1 < 10 ? '0'+(date.getSeconds()+1) : date.getSeconds()+1)
      return Y+M+D+h+m+s;
    },

    // 获取 easy-mock 的模拟数据
    getData() {
      fetchData(this.query).then(res => {
        console.log("getDATA res:",res)
        // this.tableData = res.list
        this.pageTotal = res.pageTotal || 50
      })
    },

    // 触发搜索按钮
    handleSearch() {
      this.$set(this.query, 'pageIndex', 1)
      this.getData()
    },

    // 删除操作
    handleDelete(index, row) {
      // 二次确认删除
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning',
      })
        .then(() => {
          this.$message.success('删除成功')
          this.tableData.splice(index, 1)
        })
        .catch(() => {})
    },

    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    delAllSelection() {
      const length = this.multipleSelection.length
      let str = ''
      this.delList = this.delList.concat(this.multipleSelection)
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + ' '
      }
      this.$message.error(`删除了${str}`)
      this.multipleSelection = []
    },

    // 编辑操作
    handleEdit(index, row) {
      this.idx = index
      this.form = row
      this.editVisible = true
    },

    // 发送添加母猪信息的请求
    onAddSubmit() {
      let params = this.form
      params.factoryTime = Date.parse(new Date())
      httpPOST('/sows',params)
        .then((res) => {
          console.log("successfully add new sow info")
          location.reload()  // 刷新页面 但是因为后端api响应太慢了 体验不好
        })
        .catch((err) => {
          console.log("add sow err:",err)
          alert("Error, try again.")
        })
      
    },


    handleAdd() {
      this.addVisible = true

    },

    // 保存编辑
    saveEdit() {
      this.editVisible = false
      this.$message.success(`成功修改母猪信息`)
      this.$set(this.tableData, this.idx, this.form)

    },

    // 分页导航
    handlePageChange(val) {
      this.$set(this.query, 'pageIndex', val)
      this.getData()
    },

    onInputChange() {
      this.$forceUpdate()
    },
  },
}
</script>

<style scoped>

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
