<template>
  <div>
    
    <div class="container">
      <el-tabs v-model="message">
        <el-tab-pane :label="'信息总览'" name="first">

          <div class="handle-box">
            <el-button
              type="primary"
              icon="el-icon-delete"
              class="handle-del mr10"
              @click="delAllSelection"
              >批量删除</el-button
            >

            <!-- <el-select
              v-model="query.address"
              placeholder="地址"
              class="handle-select mr10"
            >
              <el-option key="1" label="广东省" value="广东省"></el-option>
              <el-option key="2" label="湖南省" value="湖南省"></el-option>
            </el-select> -->

            <el-input
              v-model="query.name"
              placeholder="公猪耳牌号"
              class="handle-input mr10"
            ></el-input>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch"
              >搜索</el-button
            >
            <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd"
              >添加</el-button
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
              label="公🐷耳牌号"
              width="205"
              align="center"
            ></el-table-column>
            <!-- <el-table-column prop="name" label="用户名"></el-table-column> -->
            <el-table-column label="体重" align="center">
              <template slot-scope="scope">{{ scope.row.weight }}kg</template>
            </el-table-column>
            <el-table-column prop="date" label="进厂时间" align="center">
              <template slot-scope="scope">{{  timestampToTime(scope.row.indate)  }}</template>
            </el-table-column>
            <el-table-column prop="date" label="采精次数" align="center">
              <template slot-scope="scope">{{ scope.row.semenTime }}</template>
            </el-table-column>
            <el-table-column prop="generation" label="种猪代次" align="center">
              <template slot-scope="scope">{{ scope.row.generation }}</template>
            </el-table-column>
            <el-table-column label="操作" width="180" align="center">
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
          </div>
        </el-tab-pane>

        <el-tab-pane :label="'单头详情'" name="second">
          <div class="handle-box">
            <el-input
              v-model="detailQuery.id"
              placeholder="输入公猪耳牌号查询单头公猪详情"
              class="handle-input mr10"
            ></el-input>
            <el-button type="primary" icon="el-icon-search" @click="handleDetailSearch"
              >搜索</el-button
            >
            <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd"
              >添加</el-button
            >
          </div>
          <el-table
            :data="detailTableData"
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
              label="公猪耳牌号"
              width="105"
              align="center"
            ></el-table-column>
            <el-table-column label="操作日期" align="center" width="180">
              <template slot-scope="scope">{{  timestampToTime(scope.row.date)  }}</template>
            </el-table-column>
            <el-table-column label="操作者工号" align="center" width="70">
              <template slot-scope="scope">{{ scope.row.workerId }}</template>
            </el-table-column>
            <el-table-column label="评分" align="center">
              <template slot-scope="scope">{{ scope.row.score }}</template>
            </el-table-column>

            <el-table-column label="体积(ml)" align="center">
              <template slot-scope="scope">{{ scope.row.volumn }}</template>
            </el-table-column>
            <el-table-column label="原精活力" align="center">
              <template slot-scope="scope">{{ scope.row.oriEnergy }}</template>
            </el-table-column>
            <el-table-column label="稀释后活力" align="center">
              <template slot-scope="scope">{{ scope.row.aftEnergy }}</template>
            </el-table-column>
            <el-table-column label="是否畸形" align="center">
              <template slot-scope="scope">{{ scope.row.malformation }}</template>
            </el-table-column>
            <el-table-column label="可稀释头份" align="center">
              <template slot-scope="scope">{{ scope.row.actualNum }}</template>
            </el-table-column>
            <el-table-column label="所需要头份" align="center">
              <template slot-scope="scope">{{ scope.row.requiredNum }}</template>
            </el-table-column>
            <el-table-column label="操作" width="120" align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  icon="el-icon-edit"
                  @click="handleEditDetail(scope.$index, scope.row)"
                  >编辑</el-button
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
          </div>
        </el-tab-pane>

        <el-tab-pane :label="'图表分析'" name="third">
          <div id="app">
            <div class="handle-box">
              <el-input
                v-model="detailQuery.boarId"
                placeholder="输入公猪耳牌号查询单头公猪详情"
                class="handle-input mr10"
              ></el-input>
              <el-button type="primary" icon="el-icon-search" @click="handleGraphShow"
                >展示</el-button
              >
            </div>
            <div id="main" style="width: 800px;height:600px;"></div>
          </div>
        </el-tab-pane>
 

      </el-tabs>
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
        <el-form-item label="采精次数">
          <el-input v-model="form.semenTime"></el-input>
        </el-form-item>
        <el-form-item label="种猪代次">
          <el-select v-model="form.generation" placeholder="请选择">
            <el-option key="zd" label="祖代" value="祖代"></el-option>
            <el-option key="fmd" label="父母代" value="父母代"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 弹出框2  添加公猪信息 -->
    <el-dialog title="添加公猪信息" :visible.sync="addVisible" width="30%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="耳牌号">
          <!-- <input name="id" v-model="form.id"> -->
          <el-input placeholder="输入耳牌号" @input="onInputChange" v-model="newform.id"></el-input>
        </el-form-item>
        <el-form-item label="重量">
          <!-- <input name="weight" v-model="form.weight"> -->
          <el-input placeholder="单位:kg" @input="onInputChange" v-model="newform.weight"></el-input>
        </el-form-item>
        <el-form-item label="采精次数">
          <!-- <input name="weight" v-model="form.weight"> -->
          <el-input placeholder="输入采精次数" @input="onInputChange" v-model="newform.semenTime"></el-input>
        </el-form-item>
        <el-form-item label="种猪代次">
          <el-select v-model="newform.generation" placeholder="请选择">
            <el-option key="zd" label="祖代" value="祖代"></el-option>
            <el-option key="fmd" label="父母代" value="父母代"></el-option>
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
import { httpGET, httpPOST, httpPUT} from '../../api/fetch'

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
      detailQuery:{},  // 查询单头公猪详情的对象
      tableData: [],
      detailTableData: [],
      multipleSelection: [],
      delList: [],
      editVisible: false,
      addVisible: false,
      pageTotal: 0,
      form: {},
      newform: {},
      idx: -1,
      id: -1,
      message: 'first',
      xAxisData:[],
      seriesData1:[],
      seriesData2:[],
    }
  },
  created() {
    // this.getData()
  },

  mounted() {
    console.log("mounted")
    this.getTest()
    // this.drawChart()
  },


  methods: {
    getTest() {
      httpGET('/boars?pageSize=100')
        .then((res) => {
          let infos = res.data.list
          console.log("mpigsGET res.data.list:", infos)
          this.tableData = infos
        })
        .catch((err) => {
          console.log("mpigGET err:", err)
        })

      // httpGET('/boardetails/count')
      //   .then((res) => {
      //     console.log("boardetails res:", res)
      //   })
      //   .catch((err) => {
      //     console.log("boardetailGET err:", err)
      //   })
    },

    drawChart() {
      let myChart = this.$echarts.init(document.getElementById("main"))     
      myChart.setOption({
        backgroundColor: "#fff",
        color: ["#37A2DA", "#67E0E3"],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['原精活力', '稀释后活力',]
        },
        grid: {
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xAxisData
        },
        yAxis: {
          x: 'center',
          type: 'value',
        },
        series: [{
          name: '原精活力',
          type: 'line',
          smooth: true,
          data: this.seriesData1
        }, {
          name: '稀释后活力',
          type: 'line',
          smooth: true,
          data: this.seriesData2
        }]
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

    // 通过公猪id查信息 图表展示
    handleGraphShow() {
      console.log("boar id:",this.detailQuery.boarId)
      httpGET(`/boardetails/count?id=${this.detailQuery.boarId}`)
        .then((res) => {
          console.log("boardeteil by id:", res)
          let infoArr = res.data
          this.seriesData2 = []
          this.xAxisData = []
          this.seriesData1 = []
          for(let i in infoArr){
            this.xAxisData.push(infoArr[i].date)
            this.seriesData1.push(Number(infoArr[i].oriEnergy))
            this.seriesData2.push(Number(infoArr[i].aftEnergy))
            console.log(this.xAxisData)
            console.log(this.seriesData1)
            console.log(this.seriesData2)
          }
          this.drawChart()
        })
    },

    // 触发通过公猪id搜索公猪详情
    handleDetailSearch() {
      console.log("boar id:", this.detailQuery.id)
      httpGET(`/boardetails/${this.detailQuery.id}`)
        .then((res) => {
          console.log("get boar id detail:", res)
          this.detailTableData = res.data.list
        })
        .catch((err) => {
          console.log("err")
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

    handleEditDetail(index, row) {
      console.log("detail row:",row)

    },

    // 发送添加公猪信息的请求
    onAddSubmit() {
      let params = this.newform
      console.log("params:",params)
      params.indate = Date.parse(new Date())
      httpPOST('/boars',params)
        .then((res) => {
          console.log("successfully add new sow info")
          location.reload()  // 刷新页面刷新数据 但是因为后端api响应太慢了 体验不好
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
      this.$message.success(`成功修改公猪信息`)
      
      httpPUT('/boars',this.form)
        .then((res) => {
          console.log("success put boars")
          this.$set(this.tableData, this.idx, this.form)
        })
        .catch((err) => {
          console.log("err put soar")
          alert("ERROR,try again")
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
