
  <template>
  <!-- <div class="test-report"> -->
  <div class="content-page">
    <!-- Start content -->
    <div class="content">
      <div class="container-fluid">
        <el-row :gutter="10">
          <el-col :span="leftSpan">
            <div class="card mb-3">
              <div class="card-header">
                <h3>
                  <i class="fa fa-line-chart"></i> 概况
                </h3>
              </div>

              <div class="card-body">
                <el-table :data="resultData" border @row-click="getDetails">
                  <el-table-column
                    label="Task"
                    prop="taskId"
                    sortable
                    align="center"
                    min-width="80"
                  />
                  <el-table-column label="设备序列号" prop="mobileId" align="center" min-width="80"/>
                  <el-table-column
                    label="提交人"
                    prop="executor"
                    align="center"
                    show-overflow-tooltip
                  />
                  <el-table-column
                    label="开始时间"
                    prop="startedTime"
                    align="center"
                    width="150"
                    show-overflow-tooltip
                  />
                  <el-table-column
                    label="完成时间"
                    prop="endedTime"
                    align="center"
                    width="150"
                    show-overflow-tooltip
                  />
                  <el-table-column
                    label="通过"
                    prop="success"
                    align="center"
                    width="100"
                    show-overflow-tooltip
                  />
                  <el-table-column
                    label="失败"
                    prop="failed"
                    align="center"
                    width="100"
                    show-overflow-tooltip
                  />
                </el-table>

                <el-pagination
                  :current-page="pageIndex"
                  :page-sizes="pageOpts"
                  :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="dataCount"
                  @size-change="changePageSize"
                  @current-change="changepage"
                />
              </div>
              <div class="card-footer"></div>
            </div>
          </el-col>
          <el-col :span="8" v-show="showMobileInfo">
            <div class="card mb-3">
              <div class="card-header">
                <h3>
                  <i class="fa fa-bar-chart-o"></i> 手机信息
                </h3>
              </div>

              <div class="card-body">
                <table v-for="(item,key) in Object.keys(deviceInfo)" :key="key">
                  <tr>
                    <td style="width:110px;font-weight:bold">{{toUpper(item)}}:</td>
                    <td align="right">{{deviceInfo[item]}}</td>
                  </tr>
                </table>

                <!-- <tr>
                  <td>{{item}}:</td>
                  <td>{{deviceInfo[item]}}</td>
                </tr>-->
              </div>
              <div class="card-footer small text-muted"></div>
            </div>
            <!-- end card-->
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="leftSpan">
            <div class="card mb-3">
              <div class="card-header">
                <h3>
                  <i class="fa fa-line-chart"></i> 结果详情
                </h3>
              </div>

              <div class="card-body">
                <el-table
                  :data="itemDetails"
                  border
                  @row-click="getTCSteps"
                  @cell-click="showFailedImgDialog"
                >
                  <el-table-column label="ID" prop="id" sortable align="center" min-width="80"/>
                  <el-table-column
                    label="用例名"
                    prop="tcName"
                    sortable
                    align="center"
                    min-width="80"
                  />
                  <el-table-column
                    label="APP"
                    prop="targetApp"
                    sortable
                    align="center"
                    min-width="80"
                  />
                  <el-table-column
                    label="通过"
                    prop="isPass"
                    align="center"
                    min-width="100"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">
                      <el-button
                        v-if="scope.row.isPass != null"
                        :type="setType(scope.row.isPass)"
                        disabled
                      >{{ scope.row.isPass?'通过':'失败' }}</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="失败于步数"
                    prop="replayResult.error_step"
                    align="center"
                    min-width="100"
                    show-overflow-tooltip
                  >
                    <template
                      slot-scope="scope"
                    >{{scope.row.replayResult.error_step==0?'':scope.row.replayResult.error_step}}</template>
                  </el-table-column>
                  <el-table-column
                    label="失败原因"
                    prop="replayResult.error_reason"
                    align="center"
                    width="100"
                    show-overflow-tooltip
                  />
                  <el-table-column
                    label="失败截图"
                    prop="replayResult.screenshot"
                    align="center"
                    min-width="100"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope" v-if="scope.row.isPass == 0">
                      <img
                        :src="`${scope.row.replayResult.screenshot[0]}`"
                        height="60"
                        width="60"
                        alt="icon"
                      >
                    </template>
                  </el-table-column>

                  <el-table-column
                    label="开始时间"
                    prop="startedTime"
                    align="center"
                    width="150"
                    show-overflow-tooltip
                  />
                  <el-table-column
                    label="完成时间"
                    prop="endedTime"
                    align="center"
                    width="150"
                    show-overflow-tooltip
                  />

                  <el-dialog
                    :visible.sync="showImg"
                    title="失败截图"
                    :width="width"
                    :height="height"
                    append-to-body
                  >
                    <img :src="`${imgSrc}`" alt="icon" @load="onLoad">
                  </el-dialog>
                </el-table>
              </div>
              <div class="card-footer small text-muted"></div>
            </div>
            <!-- end card-->
          </el-col>

          <el-col :span="8" v-show="showStepsInfo">
            <div class="card mb-3">
              <div class="card-header">
                <h3>
                  <i class="fa fa-bar-chart-o"></i> 用例步骤
                </h3>
              </div>

              <div class="card-body">
                <el-steps direction="vertical" :active="failedStep">
                  <el-step
                    v-for="(item,index) in caseSteps"
                    :key="index"
                    :title="item"
                    :status="setStepStatus(failedStep,index)"
                  ></el-step>
                </el-steps>
              </div>
              <div class="card-footer small text-muted"></div>
            </div>
            <!-- end card-->
          </el-col>
        </el-row>
      </div>
      <!-- END container-fluid -->
    </div>
    <!-- END content -->
  </div>
  <!-- END content-page -->
</template>
<script>
import tcApi from "@/api/testcase.js";
import util from "@/utils/utilnew.js";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "uitestReport",
  created() {
    this.getRunResults();
  },
  data() {
    return {
      resultData: [],
      itemDetails: [],
      showImg: false,
      imgSrc: "",
      width: "",
      height: "",
      deviceInfo: {},
      caseSteps: [],
      failedStep: 1,
      showMobileInfo: false,
      showStepsInfo: false,
      leftSpan: 24,
      // 分页相关
      pageOpts: [10, 20, 50],
      pageSize: 10,
      dataCount: 0,
      pageIndex: 1,

      sliceStart: 0
    };
  },
  methods: {
    toUpper(item) {
      return util.convertFirstLettertoUpper(item);
    },
    changepage(index) {
      this.pageIndex = index;
      var _start = (index - 1) * this.pageSize;
      var _end = index * this.pageSize;
      // this.sliceStart = 0;
      this.resultData = [];
      this.getRunResults();
    },

    changePageSize(size) {
      // 缓存
      sessionStorage.setItem("pageSize", size);
      this.pageSize = size;
      this.resultData = [];
      this.changepage(1);
    },
    getRunResults() {
      let _this = this;
      let params = {};
      tcApi.getRunResults(params).then(res => {
        if (res.data.code == 0) {
          let rData = res.data.data;
          _this.dataCount = rData.length;
          // 分页
          let sd = rData;
          if (sd.length < _this.pageSize) {
            _this.resultData = sd;
          } else {
            _this.resultData = sd.slice(
              (_this.pageIndex - 1) * _this.pageSize,
              _this.pageSize * _this.pageIndex
            );
          }
          // console.log(_this.resultData);
        }
      });
    },
    getDetails(row, column, event) {
      let _this = this;
      let params = {
        taskId: row.taskId,
        mobileId: row.mobileId
      };
      tcApi.getDetailResult(params).then(res => {
        if (res.data.code == 0) {
          _this.itemDetails = res.data.data;
          _this.deviceInfo = _this.itemDetails[0].replayResult.deviceInfo;
          _this.showMobileInfo = true;
          _this.showStepsInfo = false;
          _this.leftSpan = 16;
        }
      });
    },

    getTCSteps(row, column, event) {
      let _this = this;
      let tc = _this.itemDetails.filter(item => item.id == row.id)[0];
      _this.caseSteps = tc.replayResult.case_steps;
      _this.failedStep = tc.replayResult.error_step - 1;
      _this.showStepsInfo = true;
      // console.log(tc);
    },
    setStepStatus(fStep, curStep) {
      if (curStep < fStep) {
        return "success";
      } else if (curStep == fStep) {
        return "error";
      } else {
        return "wait";
      }
    },
    showFailedImgDialog(row, column, cell, event) {
      if (column.property == "replayResult.screenshot" && !row.isPass) {
        this.showImg = true;
        this.imgSrc = row.replayResult.screenshot[0];
        event.preventDefault();
      }
    },
    hideFailedImgDialog(row, column, cell, event) {
      if (column.property != "replayResult.screenshot") {
        this.showImg = false;
        event.preventDefault();
      }
    },
    /**计算图片的宽度 */
    onLoad(e) {
      let _this = this;
      const img = e.target;
      let width = 0;
      let height = 0;
      if (img.fileSize > 0 || (img.width > 1 && img.height > 1)) {
        width = img.width + 40;
        height = img.height + 20;
      }
      _this.width = width + "px";
      _this.height = height = "px";
    },
    /**set Button type */
    setType(pass) {
      if (pass) {
        return "success";
      } else if (pass == false) {
        return "danger";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.test-report {
  position: relative;
  overflow: auto;

  padding-bottom: 20px;
  .box-card {
    height: 100%;
    overflow: auto;
    margin-top: 10px;
    margin-bottom: 10px;
  }
}
.el-dialog__body {
  overflow-y: auto;
}
</style>
