<template>
  <div>
    <div class="container">
      <div>
        <el-row :gutter="20">
          <el-col :span="22">
            <el-row :gutter="29" class="mgb20">
              <el-col :span="4">
                <el-card shadow="hover" :body-style="{ padding: '0px' }" style="width: 160px">
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
                <el-card shadow="hover" :body-style="{ padding: '0px' }" style="width: 160px">
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
                <el-card shadow="hover" :body-style="{ padding: '0px' }" style="width: 160px">
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
                <el-card shadow="hover" :body-style="{ padding: '0px' }" style="width: 160px">
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
                <el-card shadow="hover" :body-style="{ padding: '0px' }" style="width: 160px">
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

      <div class="handle-box">
        <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd"
          >添加原料进货信息</el-button
        >
      </div>


      <el-tabs v-model="message">
        <el-tab-pane :label="'原料日志'" name="first">
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
        </el-tab-pane>

        <el-tab-pane :label="'饲料信息'" name="second">
          <el-table
            :data="siliaoData"
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
              label="饲料名称"
              width="225"
              align="center"
            ></el-table-column>
            <!-- <el-table-column prop="name" label="用户名"></el-table-column> -->
            <el-table-column label="数量" align="center">
              <template slot-scope="scope">{{ scope.row.num  }}kg</template>
            </el-table-column>

            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  icon="el-icon-edit"
                  @click="handleMake(scope.$index, scope.row)"
                  >制作</el-button
                >
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  class="red"
                  @click="handleUse(scope.$index, scope.row)"
                  >使用</el-button
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

        <el-tab-pane :label="'饲料日志'" name="third">
          <el-table
            :data="siliaoLogData"
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
              label="日志流水号"
              align="center"
            ></el-table-column>
            <!-- <el-table-column prop="name" label="用户名"></el-table-column> -->
            <el-table-column label="饲料种类" align="center">
              <template slot-scope="scope">{{ scope.row.name  }}</template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-tag
                  :type="
                    scope.row.num > 0 ? 'success' : 'danger'
                  "
                  >{{ scope.row.num > 0 ? '制作新增' : '消耗' }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="数量" align="center">
              <template slot-scope="scope">{{ scope.row.num  }}kg</template>
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

        <el-tab-pane :label="'饲料配方'" name="fourth">
          <el-table
            :data="peifangData"
            border
            class="table"
            ref="multipleTable"
            header-cell-class-name="table-header"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              prop="name"
              label="饲料种类(1000kg)"
              align="center"
            ></el-table-column>
            <el-table-column label="玉米数量" align="center">
              <template slot-scope="scope">{{ scope.row.corn  }}kg</template>
            </el-table-column>
            <el-table-column label="豆粕数量" align="center">
              <template slot-scope="scope">{{ scope.row.bean  }}kg</template>
            </el-table-column>
            <el-table-column label="麸皮数量" align="center">
              <template slot-scope="scope">{{ scope.row.bran  }}kg</template>
            </el-table-column>
            <el-table-column label="预混料数量" align="center">
              <template slot-scope="scope">{{ scope.row.premix  }}kg</template>
            </el-table-column>
            <el-table-column label="脱霉剂数量" align="center">
              <template slot-scope="scope">{{ scope.row.offmildew  }}kg</template>
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
      </el-tabs>





    </div>

    <!-- 弹出框1  添加进货信息 -->
    <el-dialog title="添加进货信息" :visible.sync="addVisible" width="30%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="种类">
          <el-select v-model="form.name" placeholder="请选择">
            <el-option key="ym" label="玉米" value="corn"></el-option>
            <el-option key="dp" label="豆粕" value="bean"></el-option>
            <el-option key="fp" label="麸皮" value="bran"></el-option>
            <el-option key="yhl" label="预混料" value="premix"></el-option>
            <el-option key="tmj" label="脱霉剂" value="offmildew"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量">
          <el-input placeholder="单位:kg" @input="onInputChange" v-model.number="form.num"></el-input>
        </el-form-item>

        <el-form-item label="单价">
          <el-input placeholder="输入单价" @input="onInputChange" v-model.number="form.perMoney"></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="onAddSubmit">提交</el-button>
          <el-button @click="addVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


    <!-- 弹出框2  制作饲料信息 -->
    <el-dialog title="制作饲料" :visible.sync="makeVisible" width="30%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="数量">
          <el-input placeholder="单位:kg" @input="onInputChange" v-model.number="makeForm.num"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onMakeSubmit">制作</el-button>
          <el-button @click="makeVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 弹出框3  feed饲料信息 -->
    <el-dialog title="使用饲料" :visible.sync="useVisible" width="30%">
      <el-form ref="form" :model="useForm" label-width="70px">
        <el-form-item label="数量">
          <el-input placeholder="单位:kg" @input="onInputChange" v-model.number="useForm.num"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onUseSubmit">使用</el-button>
          <el-button @click="useVisible = false">取消</el-button>
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
      siliaoData: [],
      siliaoLogData:[],  // 饲料日志
      multipleSelection: [],
      peifangData: [],   // 饲料配方信息
      delList: [],
      editVisible: false,
      makeVisible: false,
      addVisible: false,
      useVisible: false,
      pageTotal: 0,
      form: {},
      makeForm:{},
      useForm:{},
      idx: -1,
      id: -1,
      ingredients: {},
      message: 'first'
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
      httpGET('/stocks?pageSize=30')
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
          for(let i in res.data){
            res.data[i] = res.data[i].toFixed(2)
          }
          this.ingredients = res.data
          console.log("ing:",this.ingredients)
        })
        .catch((err) => {
          console.log("stocks count err:", err)
        })
      
      // 饲料数量信息
      httpGET('/fodderstores/count')
        .then((res) => {
          console.log("fodderstores/count res:", res)
          this.siliaoData = res.data
        })
        .catch((err) => {
          console.log("stocks count err:", err)
        })

      // 饲料日志信息
      httpGET('/fodderstores?pageSize=30')
        .then((res) => {
          // console.log("fodderstores res:", res)
          this.siliaoLogData = res.data.list
        })
        .catch((err) => {
          console.log("stocks  err:", err)
        })
    },

    getData() {
      httpGET('/fodderforms')
        .then((res) => {
          // console.log("fodderstores res:", res)
          this.peifangData = res.data.list
        })
        .catch((err) => {
          console.log("stocks  err:", err)
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

    // 制作操作
    handleMake(index, row) {
      console.log("make row:",row)
      this.makeForm.name = row.name
      this.makeVisible = true
    },

    // 使用饲料操作
    handleUse(index, row) {
      console.log("use row:",row)
      this.useForm.name = row.name
      this.useVisible = true

    },

    // 发送添加原料信息的请求
    onAddSubmit() {
      let params = this.form
      params.date = Date.parse(new Date())
      httpPOST('/stocks',params)
        .then((res) => {
          console.log("successfully add new stock info")
          location.reload()  // 刷新页面 但是因为后端api响应太慢了 体验不好
        })
        .catch((err) => {
          console.log("add stock err:",err)
          alert("Error, try again.")
        })
      
    },

    onMakeSubmit() {
      let params = this.makeForm
      console.log("make params:",params)
      httpPOST('/fodderstores',params)
        .then((res) => {
          console.log("fodderstore post success", res)
          location.reload()
        })
        .catch((err) => {
          console.log("err",err)
        })
    },


    onUseSubmit() {
      let params = this.useForm
      console.log("use params:",params)
      httpPOST('/fodderstores/feed',params)
        .then((res) => {
          console.log("fodderstore feed success", res)
          location.reload()
        })
        .catch((err) => {
          console.log("feed err",err)
          location.reload()
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
