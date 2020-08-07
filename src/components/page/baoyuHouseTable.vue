<template>
  <div>
    <!-- <div class="crumbs">
    </div> -->
    <div class="container">
      <div class="handle-box">
        <el-input
          v-model="query.name"
          placeholder="保育舍编号"
          class="handle-input mr10"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch"
          >搜索</el-button
        >
        <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd"
          >添加信息</el-button
        >
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
          prop="id"
          label="操作号"
          width="205"
          align="center"
        ></el-table-column>
        <!-- <el-table-column prop="name" label="用户名"></el-table-column> -->
        <el-table-column label="保育舍编号" align="center">
          <template slot-scope="scope">{{ scope.row.roomId }}</template>
        </el-table-column>
        <el-table-column label="日期" align="center">
          <template slot-scope="scope">{{ timestampToTime(scope.row.date) }}</template>
        </el-table-column>

        <el-table-column label="操作方式" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="
                scope.row.operation === '转入'
                  ? 'success'
                  : scope.row.operation === '转出'
                  ? 'danger'
                  : ''
              "
              >{{ scope.row.operation }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column prop="date" label="数量" align="center">
          <template slot-scope="scope">{{ scope.row.operationNum }}</template>
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
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="耳牌号">
          {{form.id}}
        </el-form-item>
        <el-form-item label="体重">
          <el-input v-model="form.weight"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="form.status"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 弹出框2  添加保育舍转入转出信息 -->
    <el-dialog title="添加转入或转出信息" :visible.sync="addVisible" width="30%">
      <el-form ref="form" :model="addform" label-width="70px">
        <el-form-item label="流向">
          <el-select v-model="addform.operation" placeholder="请选择">
            <el-option key="zr" label="转入" value="转入"></el-option>
            <el-option key="zc" label="转出" value="转出"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="猪仔数量">
          <el-input placeholder="输入猪仔数量" @input="onInputChange" v-model.number="addform.operationNum"></el-input>
        </el-form-item>
        <el-form-item label="猪栏号">
          <!-- <input name="weight" v-model="form.weight"> -->
          <el-input placeholder="输入猪栏号" @input="onInputChange" v-model.number="addform.roomId"></el-input>
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
      addform: {},
      idx: -1,
      id: -1,
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
      httpGET('/pighouses')
        .then((res) => {
          let infos = res.data.list
          console.log("pighouseGET res.data.list:", infos)
          this.tableData = infos
        })
        .catch((err) => {
          console.log("pighouseGET err:", err)
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
      let searchIndex = Number(this.query.name)
      console.log("query:", searchIndex)
      if(searchIndex){
        httpGET(`/pighouses/${searchIndex}`)
        .then((res) => {
          this.tableData = res.data.list
        })
        .catch((err) => {
          console.log("get /pigohuses/{id} error:", err)
          alert("Error, check and try again.")
        })
      }else{
        this.getTest()
      }
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

    // 发送添加公猪信息的请求
    onAddSubmit() {
      let params = this.addform
      console.log("params:",params)
      params.date = Date.parse(new Date())
      httpPOST('/pighouses',params)
        .then((res) => {
          console.log("successfully add new baoyushe info")
          location.reload()  // 刷新页面刷新数据 但是因为后端api响应太慢了 体验不好
        })
        .catch((err) => {
          console.log("add baoyushe info err:",err)
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
