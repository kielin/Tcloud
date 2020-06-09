
  <template>
  <div class="test-report">
    <el-card class="box-card">
      <span slot="header" style="font-weight: 900">概况</span>
      <el-table :data="resultData" border @row-click="getDetails">
        <el-table-column label="Task" prop="taskId" sortable align="center" min-width="80"/>
        <el-table-column label="设备序列号" prop="mobileId" align="center" min-width="80"/>
        <el-table-column label="提交人" prop="executor" align="center" show-overflow-tooltip/>
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
        <el-table-column label="失败" prop="failed" align="center" width="100" show-overflow-tooltip/>
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
    </el-card>
    <el-card class="box-card">
      <span slot="header" style="font-weight: 900">详情</span>
      <el-table :data="itemDetails" border @cell-click="showFailedImgDialog">
        <!-- <el-table-column label="用例ID" prop="tcId" sortable align="center" min-width="80"/> -->
        <el-table-column label="用例名" prop="tcName" sortable align="center" min-width="80"/>
        <el-table-column label="APP" prop="targetApp" sortable align="center" min-width="80"/>
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
            <img :src="`${scope.row.replayResult.screenshot[0]}`" height="60" width="60" alt="icon">
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
    </el-card>
  </div>
</template>
<script>
import tcApi from "@/api/testcase.js";
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
      // 分页相关
      pageOpts: [10, 20, 50],
      pageSize: 10,
      dataCount: 0,
      pageIndex: 1,

      sliceStart: 0
    };
  },
  methods: {
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
          console.log(_this.resultData);
        }
      });
    },
    getDetails(row, column, event) {
      let params = {
        taskId: row.taskId,
        mobileId: row.mobileId
      };
      tcApi.getDetailResult(params).then(res => {
        if (res.data.code == 0) {
          this.itemDetails = res.data.data;
        }
      });
    },
    showFailedImgDialog(row, column, cell, event) {
      if (column.property == "replayResult.screenshot" && !row.isPass) {
        this.showImg = true;
        this.imgSrc = row.replayResult.screenshot[0];
      }
    },
    hideFailedImgDialog(row, column, cell, event) {
      if (column.property != "replayResult.screenshot") {
        this.showImg = false;
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
