<template>
   <div class="">
    <div class="container">
      <el-tabs v-model="message">
        <el-tab-pane :label="'交易日志'" name="first">
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
              label="订单号"
              width="125"
              align="center"
            ></el-table-column>
            <el-table-column label="类目" align="center">
              <template slot-scope="scope">{{ scope.row.item }}</template>
            </el-table-column>
            <el-table-column label="数量" align="center">
              <template slot-scope="scope">{{ scope.row.num }}</template>
            </el-table-column>

            <el-table-column label="流向" align="center">
              <template slot-scope="scope">
                <el-tag
                  :type="
                    scope.row.inout === '收入'
                      ? 'success'
                      : scope.row.inout === '支出'
                      ? 'danger'
                      : ''
                  "
                  >{{ scope.row.inout }}</el-tag
                >
              </template>
            </el-table-column>

            <el-table-column label="总金额" align="center">
              <template slot-scope="scope">{{ scope.row.money }}</template>
            </el-table-column>
            <el-table-column label="交易时间" align="center">
              <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column label="买家地点" align="center">
              <template slot-scope="scope">{{ scope.row.position ? scope.row.position : '-' }}</template>
            </el-table-column>
          </el-table>
        </el-tab-pane>




        <el-tab-pane :label="`月度账单`" name="second">
          <el-table
            :data="monthlyReportData"
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
              prop="date"
              label="月份"
              width="375"
              align="center"
            ></el-table-column>
            <el-table-column label="卖猪收入" align="center">
              <template slot-scope="scope">¥{{ scope.row.sellPigMoney }}元</template>
            </el-table-column>
            <el-table-column label="进货支出" align="center">
              <template slot-scope="scope">¥{{ scope.row.buyStockMoney }}元</template>
            </el-table-column>

          </el-table>

          <!-- <template v-if="message === 'second'">
          </template> -->
        </el-tab-pane>


        <el-tab-pane :label="`地域分布`" name="third">
          <div id="app">
            <div id="main" style="width: 800px;height:600px;"></div>
          </div>
        </el-tab-pane>

        <!-- <el-tab-pane :label="`图表统计2`" name="fourth">
          <template v-if="message === 'fourth'">
            <el-table :data="read" :show-header="false" style="width: 100%;">
              <el-table-column>
                <template slot-scope="scope">
                  <span class="message-title">{{ scope.row.title }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="date" width="150"></el-table-column>
            </el-table>
          </template>
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { httpGET } from '../../api/fetch'
export default {
  name: 'tabs',
  data() {
    return {
      message: 'first',
      showHeader: false,
      tableData: [],
      monthlyReportData: [],
      options: {
        title : {
          text: '国内种猪销量地域分布',
          left: 'center'
        },
        tooltip : {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data:['iphone3']
        },
        visualMap: {
          min: 0,
          max: 2500,
          left: 'right',
          top: 'middle',    
          calculable : true
        },
        toolbox: {
          show: true,
          orient : 'vertical',
          left: 'right',
          top: 'center',
          // feature : {
          //   mark : {show: true},
          //   dataView : {show: true, readOnly: false},
          //   restore : {show: true},
          //   saveAsImage : {show: true}
          // }
        },
        series : [
          {
            name: '销量',
            type: 'map',
            mapType: 'china',
            label: {
              normal: {
                  show: false
              },
              emphasis: {
                  show: true
              }
            },
            data:[{name: '新疆', value: 100}]
          }
        ]
      }
    }
  },

  mounted() {
    this.getData()
  },

  methods: {
    getData() {
      httpGET('/orders')
        .then((res) => {
          let infos = res.data.list
          infos.forEach(element => {
            element.date = this.timestampToTime(element.date)
            element.item = (element.item === 'bran' 
            ? '麸皮' : element.item === 'corn' 
            ? '玉米' : element.item === 'bean'
            ? '豆粕' : element.item === 'offmildew'
            ? '脱霉剂' : element.item === 'premix'
            ? '预混料' : element.item === 'pig'
            ? '猪(卖出)' : null
            )
          });
          console.log("get order:", infos)
          this.tableData = infos
        })
        .catch((err) => {
          console.log("err:",err)
        })

      httpGET('/orders/position')
        .then((res) => {
          let positionInfo = res.data
          console.log("地域信息:", positionInfo)
          positionInfo.forEach((element) => {
            this.options.series[0].data.push({
              name: element.position,
              value: element.num
            })
          })
          this.drawChart()
          
        }) 
        .catch((err) => {
          console.log("position err:", err)
        })

      httpGET('/orders/monthMoney')
        .then((res) => {
          let monthlyInfo = res.data
          this.monthlyReportData = monthlyInfo
          console.log("monthMoney res:", monthlyInfo)
        })
        .catch((err) => {
          console.log("monthMOney err:", err)
        })
    },

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

    drawChart() {
      let myChart = this.$echarts.init(document.getElementById("main"))     
      myChart.setOption(this.options)
    },

  },
  computed: {
    unreadNum() {
      return this.unread.length
    },
  },
}
</script>

<style>
.message-title {
  cursor: pointer;
}
.handle-row {
  margin-top: 30px;
}
</style>
