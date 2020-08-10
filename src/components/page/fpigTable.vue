<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 基础表格
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button
          type="primary"
          icon="el-icon-delete"
          class="handle-del mr10"
          @click="delAllSelection"
          >批量删除</el-button
        >

        <el-input
          v-model="query.name"
          placeholder="母猪耳牌号"
          class="handle-input mr10"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch"
          >搜索</el-button
        >
        <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd"
          >添加母猪信息</el-button
        >
        <el-button type="primary" icon="el-icon-lx-add" @click="handleAddSowDetail"
          >添加母猪配种信息</el-button
        >

        <el-button type="primary" icon="el-icon-lx-add" @click="handleAddBirthDetail"
          >添加母猪分娩信息</el-button
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
          label="母🐷耳牌号"
          width="105"
          align="center"
        ></el-table-column>
        <el-table-column label="体重" align="center" >
          <template slot-scope="scope">{{ scope.row.weight }}kg</template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="
                scope.row.status === '已配种'
                  ? 'success'
                  : scope.row.status === '待配种'
                  ? 'danger'
                  : ''
              "
              >{{ scope.row.status }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column prop="date" label="进厂时间" align="center">
          <template slot-scope="scope">{{ timestampToTime(scope.row.factoryTime)  }}</template>
        </el-table-column>
        <el-table-column label="操作" width="280" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
            <el-button
              type="text"
              icon="el-icon-detail"
              @click="handleDetail(scope.$index, scope.row)"
              >查看详情</el-button
            >
          </template>
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
        <!-- :total="pageTotal" -->
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

    <!-- 弹出框2  添加母猪信息 -->
    <el-dialog title="添加母猪信息" :visible.sync="addVisible" width="30%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="耳牌号">
          <!-- <input name="id" v-model="form.id"> -->
          <el-input placeholder="输入耳牌号" v-model="newform.id" @input="onInputChange"></el-input>
        </el-form-item>
        <el-form-item label="重量">
          <!-- <input name="weight" v-model="form.weight"> -->
          <el-input placeholder="单位:kg" v-model="newform.weight" @input="onInputChange"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="newform.status" placeholder="请选择">
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

    <!-- 弹出框3  母猪详情信息 -->
    <el-dialog title="详细信息" :visible.sync="detailVisible" width="96%">
      <el-table
        :data="detailData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          prop="id"
          label="耳牌号"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column label="胎次" align="center" width="55">
          <template slot-scope="scope">{{ scope.row.parity }}</template>
        </el-table-column>
        <el-table-column label="X1" align="center">
          <template slot-scope="scope">{{ scope.row.x1 }}</template>
        </el-table-column>
        <el-table-column label="X2" align="center">
          <template slot-scope="scope">{{ scope.row.x2 }}</template>
        </el-table-column>
        <el-table-column label="X3" align="center">
          <template slot-scope="scope">{{ scope.row.x3 }}</template>
        </el-table-column>
        <el-table-column label="配种日期" align="center" width="110">
          <template slot-scope="scope">{{ timestampToTime(scope.row.matingTime) }}</template>
        </el-table-column>
        <el-table-column label="预产日期" align="center" width="108">
          <template slot-scope="scope">{{ timestampToTime(scope.row.preProductionDate) }}</template>
        </el-table-column>
        <el-table-column label="分娩日期" align="center" width="110">
          <template slot-scope="scope">{{ timestampToTime(scope.row.productionTime) }}</template>
        </el-table-column>
        <el-table-column label="栏号" align="center">
          <template slot-scope="scope">{{ scope.row.houseNum }}</template>
        </el-table-column>
        <el-table-column label="健仔" align="center">
          <template slot-scope="scope">{{ scope.row.healthBaby }}</template>
        </el-table-column>
        <el-table-column label="弱体" align="center">
          <template slot-scope="scope">{{ scope.row.weakBaby }}</template>
        </el-table-column>
        <el-table-column label="畸形" align="center">
          <template slot-scope="scope">{{ scope.row.malformation }}</template>
        </el-table-column>
        <el-table-column label="死胎" align="center">
          <template slot-scope="scope">{{ scope.row.dead }}</template>
        </el-table-column>
        <el-table-column label="木乃伊" align="center">
          <template slot-scope="scope">{{ scope.row.mummy }}</template>
        </el-table-column>
        <el-table-column label="总数" align="center">
          <template slot-scope="scope">{{ scope.row.totalNum }}</template>
        </el-table-column>
      </el-table> 
    </el-dialog>

    <!-- 弹出框4  添加母猪配种详细信息 -->
    <el-dialog title="添加母猪配种信息" :visible.sync="addSowDetailVisible" width="30%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="耳牌号">
          <!-- <input name="id" v-model="form.id"> -->
          <el-input v-model="newDetailForm.id" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="胎次">
          <el-input  v-model.number="newDetailForm.parity" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="公猪x1">
          <el-input  v-model="newDetailForm.x1" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="公猪x2">
          <el-input v-model="newDetailForm.x2" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="公猪x3">
          <el-input v-model="newDetailForm.x3" style="width: 180px"></el-input>
        </el-form-item>

        <!-- <el-form-item label="配种日期">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="timeForm.matingDate"
            value-format="yyyy-MM-dd"
            style="width: 220px; padding-bottom: 4px"
          ></el-date-picker>
          <el-time-picker
            placeholder="选择时间"
            v-model="timeForm.matingTime"
            style="width: 220px;"
          ></el-time-picker>
        </el-form-item>
        <el-form-item label="预产日期">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="timeForm.preProductionDate"
            value-format="yyyy-MM-dd"
            style="width: 220px; padding-bottom: 4px"
          ></el-date-picker>
          <el-time-picker
            placeholder="选择时间"
            v-model="timeForm.preProductionTime"
            style="width: 220px;"
          ></el-time-picker>
        </el-form-item>
        <el-form-item label="分娩日期">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="timeForm.productionDate"
            value-format="yyyy-MM-dd"
            style="width: 220px; padding-bottom: 4px"
          ></el-date-picker>
          <el-time-picker
            placeholder="选择时间"
            v-model="timeForm.productionTime"
            style="width: 220px;"
          ></el-time-picker>
        </el-form-item> -->

        <!-- <el-form-item label="栏号">
          <el-input v-model="newDetailForm.houseNum" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="产仔总数">
          <el-input v-model.number="newDetailForm.totalNum" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="健仔">
          <el-input v-model.number="newDetailForm.healthBaby" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="弱体">
          <el-input v-model.number="newDetailForm.weakBaby" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="畸形">
          <el-input v-model.number="newDetailForm.malformation" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="死胎">
          <el-input v-model.number="newDetailForm.dead" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="木乃伊">
          <el-input v-model.number="newDetailForm.mummy" style="width: 180px"></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="onAddDetailSubmit">提交</el-button>
          <el-button @click="addSowDetailVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 弹出框5  添加母猪分娩详细信息 -->
    <el-dialog title="添加母猪分娩信息" :visible.sync="addBirthDetailVisible" width="30%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="耳牌号">
          <!-- <input name="id" v-model="form.id"> -->
          <el-input v-model="newBirthForm.id" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="胎次">
          <el-input  v-model.number="newBirthForm.parity" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="栏号">
          <el-input v-model="newBirthForm.houseNum" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="产仔总数">
          <el-input v-model.number="newBirthForm.totalNum" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="健仔">
          <el-input v-model.number="newBirthForm.healthBaby" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="弱体">
          <el-input v-model.number="newBirthForm.weakBaby" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="畸形">
          <el-input v-model.number="newBirthForm.malformation" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="死胎">
          <el-input v-model.number="newBirthForm.dead" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="木乃伊">
          <el-input v-model.number="newBirthForm.mummy" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onAddBirthSubmit">提交</el-button>
          <el-button @click="addBirthDetailVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>



  </div>
</template>

<script>
import { fetchData } from '../../api/index'
import { httpGET, httpPOST, httpPUT, httpDELETE} from '../../api/fetch'
import { addAll } from '../../api/calculate'

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
      detailData:[],
      delList: [],
      editVisible: false,
      addVisible: false,
      addSowDetailVisible: false,
      detailVisible: false,
      addBirthDetailVisible: false,
      pageTotal: 0,
      form: {},
      newform: {},
      newDetailForm: {},
      timeForm: {},  // 专门用来放各个时间
      deleteform: {},
      newBirthForm: {},
      idx: -1,
      id: -1,
    }
  },
  created() {

  },

  mounted() {
    console.log("mounted")
    this.getTest()
  },



  methods: {
    getTest() {
      httpGET('/sows?pageSize=100')
        .then((res) => {
          let infos = res.data.list
          console.log("fpigsGET res.data.list:", infos)
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

 
    handleSearch() {
      this.$set(this.query, 'pageIndex', 1)
      let searchIndex = this.query.name
      console.log("query:", searchIndex)
      if(searchIndex){
        httpGET(`/sows/${searchIndex}`)
        .then((res) => {
          console.log("get sows/{id} res:", res)
          this.tableData = [res.data]
        })
        .catch((err) => {
          console.log("get /sows/{id} error:", err)
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
          this.deleteform = row
          console.log("delete form:", this.deleteform)
          httpDELETE(`/sows/${this.deleteform.id}`)
            .then((res) => {
              console.log("success delete sows")
              this.$message.success('删除成功')
              this.tableData.splice(index, 1)
            })
            .catch((err) => {
              console.log("err delete sows")
              alert("err,try again")
            })
          
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

    handleDetail(index, row) {
      this.detailVisible = true
      console.log("detail row", row)
      httpGET(`/sowdetails/${row.id}`)
        .then((res) => {
          let detailInfos = res.data.list
          console.log("get sowdetail:",detailInfos)
          this.detailData = detailInfos
        })

    },

    // 发送添加母猪信息的请求
    onAddSubmit() {
      let params = this.newform
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

    onAddBirthSubmit() {
      console.log("birth:", this.newBirthForm)
      let birthInfos = this.newBirthForm
      if(birthInfos.totalNum === addAll(
        birthInfos.dead,
        birthInfos.healthBaby,
        birthInfos.malformation,
        birthInfos.mummy,
        birthInfos.weakBaby)){
          httpPUT('/sowdetails',birthInfos)
            .then((res) => {
              console.log("put sow detail res:", res)
              this.addBirthDetailVisible = false
            })
            .catch((err) => {
              console.log("put sowdetail err:", err)
            })
      }else{
        alert("检查幼仔总数是否正确填写")
      }
    },

    onAddDetailSubmit() {
      let params = this.newDetailForm      
      console.log("detail:", params)
      httpPOST('/sowdetails',params)
        .then((res) => {
          console.log("post sow detail res:", res)
          this.detailVisible = false
          location.reload()
        })
        .catch((err) => {
          console.log("post sow detail error:", err)
        })

    },


    handleAdd() {
      this.addVisible = true
    },

    handleAddSowDetail() {
      this.addSowDetailVisible = true
    },

    handleAddBirthDetail() {
      this.addBirthDetailVisible = true
    },

    formatTime() {
      let times = this.timeForm
      console.log("timeForm:", this.timeForm)
      if(times.productionTime && times.preProductionTime && times.matingTime){
        let productionTime = times.productionTime.toLocaleTimeString('en-GB')
        let productionTimeString = `${times.productionDate} ${productionTime}`
        let preProductionTime = times.preProductionTime.toLocaleTimeString('en-GB')
        let preProductionTimeString = `${times.preProductionDate} ${preProductionTime}`
        let matingTime = times.matingTime.toLocaleTimeString('en-GB')
        let matingTimeString = `${times.matingDate} ${matingTime}`

        params.productionTime = new Date(productionTimeString)
        params.preProductionTime = new Date(preProductionTimeString)
        params.matingTime = new Date(matingTimeString)
      }
    },

    // 保存编辑
    saveEdit() {
      this.editVisible = false
      this.$message.success(`成功修改母猪信息`)
      console.log("form:",this.form)
      httpPUT('/sows',this.form)
        .then((res) => {
          console.log("put sows success")
          this.$set(this.tableData, this.idx, this.form)
        })
        .catch((err) => {
          console.log("put sows err")
          alert("error, try again")
        })
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
