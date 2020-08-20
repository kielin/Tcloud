<template>
  <div class="per-test">
    <el-button
      type="success"
      icon="el-icon-plus"
      style="margin-bottom:10px"
      @click="handleAddBtnClick"
    >增加</el-button>
    <el-button
      type="primary"
      style="margin-bottom:10px"
      icon="el-icon-refresh"
      @click="getTaskList"
    >刷新</el-button>
    <el-input
      style="width:200px"
      suffix-icon="el-icon-search"
      clearable
      v-model="search"
      size="mini"
      placeholder="输入创建者过滤任务"
    >
      <!-- <i class="el-icon-edit el-input__icon" slot="suffix"></i> -->
    </el-input>
    <el-table
      border
      stripe
      :data="resultData.filter(data => data.creatorName.toLowerCase().includes(search.toLowerCase()))"
    >
      <el-table-column
        prop="taskId"
        label="任务ID"
        sortable
        min-width="120"
        show-overflow-tooltip="true"
      >
        <template scope="{row}">
          <el-button
            type="text"
            slot="append"
            v-clipboard:copy="row.taskId"
            v-clipboard:success="onCopy"
          >{{row.taskId}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="taskName" label="任务名称" sortable></el-table-column>
      <el-table-column prop="product" label="产品" sortable></el-table-column>
      <el-table-column prop="creatorName" label="创建者" sortable></el-table-column>
      <el-table-column prop="caseIds" label="用例" sortable></el-table-column>
      <el-table-column prop="status" label="状态" sortable>
        <template slot-scope="scope">
          <el-tag :type="scope.row.status==1?'success':'danger'">{{scope.row.status==1?'正常':'已暂停'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="hasMobiles" label="最新执行状态">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.hasMobiles ==1?'success':'danger'"
          >{{scope.row.hasMobiles==1?'有设备已执行':'缺设备'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="nextRunTime" label="下次执行" min-width="120" sortable></el-table-column>
      <el-table-column prop="cron" label="定时策略" sortable></el-table-column>
      <!-- <el-table-column prop="status" label="状态" sortable></el-table-column> -->
      <el-table-column>
        <!-- <template slot="header">
          <el-input clearable v-model="search" size="mini" placeholder="输入创建者搜索"/>
        </template>-->
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="executeOnce(scope.row.taskId)">执行一次</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.status == 1" @click.native="pauseTask(scope.row)">停止</el-dropdown-item>
              <el-dropdown-item
                v-else-if="scope.row.status == 0 "
                @click.native="resumeTask(scope.row)"
              >启动</el-dropdown-item>
              <el-dropdown-item @click.native="editTask(scope.row)">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="deleteTask(scope.row)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
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

    <el-dialog fullscreen :visible="showAdd" @close="showAdd=false">
      <el-col :span="20">
        <el-form ref="ddform" :model="task" label-width="150px">
          <el-form-item label="产品">
            <el-select
              @change="handleProductChange()"
              v-model="task.product"
              filterable
              clearable
              placeholder="请选择产品"
            >
              <el-option
                v-for="(item) in productList"
                :key="item.name"
                :value="item.name"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="任务号" v-if="isEdit " prop="ID">
            <el-input disabled v-model="task.taskId" class="form-input"/>
          </el-form-item>
          <el-form-item label="任务名" prop="taskName">
            <el-input v-model="task.taskName" placeholder="请输入任务名" class="form-input"/>
          </el-form-item>
          <!-- <el-form-item label="钉钉自定义机器人" prop="dingdingUrl">
            <el-input v-model.trim="task.dingdingUrl" placeholder="钉钉自定义机器人链接" class="form-input"/>
           
          </el-form-item>-->
          <el-form-item label="定时策略" prop="cron">
            <div class="cron">
              <el-input
                slot="reference"
                v-model="task.cron"
                placeholder="Linux Crontab格式，例如每天9点0分：0 9 * * *"
                class="form-input"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="选择用例">
            <testcase-list
              :showSelection="true"
              :showOperation="false"
              :product="task.product"
              v-if="showTable"
            ></testcase-list>
            <el-input v-else v-model="task.caseIds" class="form-input"></el-input>
            <el-button type="primary" v-if="isEdit &&　!showTable" @click="clearToChoose">重新选择用例</el-button>
          </el-form-item>
          <el-form-item style="margin-top:15px">
            <el-button type="primary" v-if="!isEdit" @click="addTask">添加</el-button>
            <el-button type="primary" v-else-if="isEdit" @click="updateTask">更新</el-button>
            <el-button type="danger" @click="showAdd=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-dialog>
  </div>
</template>

<script>
import util from "@/utils/utilnew.js";
import scheduleApi from "@/api/scheduletask/taskapi.js";
import TestcaseList from "@/pages/autotest/percomponents/listTc";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import clipboard from "@/directives/clipboard/index.js";
export default {
  // mixins: [TestcaseList],
  components: { TestcaseList },
  directives: { clipboard },
  data() {
    return {
      productList: util.PRODUCTLIST,
      product: "",
      isEdit: false,
      showAdd: false,
      cronPopover: false,
      selectedTCList: [],
      search: "",
      taskList: [],
      task: {
        id: -1,
        product: "",
        taskName: "",
        creatorId: [],
        creatorName: "",
        caseIds: [],
        cron: ""
      },
      project: "",
      // 分页相关
      pageOpts: [10, 20, 50],
      pageSize: 10,
      dataCount: 0,
      pageIndex: 1,
      resultData: [],
      showTable: true
    };
  },
  watch: {},
  computed: {
    ...mapState("autotest", ["testcaseList"]),
    userId() {
      return this.$store.state.login.userid;
    },
    nickname() {
      return this.$store.state.login.nickname;
    }
  },
  mounted() {
    this.getTaskList();
  },
  methods: {
    ...mapMutations("autotest", ["setTestcaseList"]),

    onCopy(e) {
      this.$notify.success(e.text + "复制成功");
    },
    executeOnce(schedulerId) {
      let params = { jobId: schedulerId };
      scheduleApi
        .executeSchedulerOnce(params)
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("执行成功。");
          }
        })
        .catch();
    },

    clearToChoose() {
      let _this = this;
      _this.task.caseIds = [];
      _this.showTable = true;
    },
    addTask() {
      let ids = [];
      this.testcaseList.forEach(item => {
        ids.push(item.id);
      });
      if (
        ids.length == 0 ||
        this.task.taskName == "" ||
        this.task.product == "" ||
        this.task.cron == ""
      ) {
        this.$message.error("请检查信息是否填写完整");
        return;
      }
      let params = {
        taskName: this.task.taskName,
        product: this.task.product,
        creatorId: this.userId,
        creatorName: this.nickname,
        caseIds: ids,
        cron: this.task.cron
      };
      console.log(params);
      scheduleApi
        .addTask(params)
        .then(res => {
          this.$message.success("定时任务添加成功:" + res.data.data.jobId);
          this.showAdd = false;
          this.getTaskList();
        })
        .catch();
      // console.log(this.testcaseList);
      // console.log(this.userId);
    },
    editTask(row) {
      let _this = this;
      _this.showAdd = true;
      _this.isEdit = true;
      _this.showTable = false;
      _this.task = row;
      // _this.tcIds = JSON.parse(row.caseIds);
    },
    updateTask() {
      let ids = [];
      try {
        ids = JSON.parse(this.task.caseIds);
      } catch (e) {
        this.testcaseList.forEach(item => {
          ids.push(item.id);
        });
      }
      if (
        ids.length == 0 ||
        this.task.taskName == "" ||
        this.task.product == "" ||
        this.task.cron == ""
      ) {
        this.$message.error("请检查信息是否填写完整");
        return;
      }
      let params = {
        taskId: this.task.taskId,
        taskName: this.task.taskName,
        product: this.task.product,
        creatorId: this.userId,
        creatorName: this.nickname,
        caseIds: ids,
        cron: this.task.cron
      };
      console.log(params);
      scheduleApi
        .modifyTask(params)
        .then(res => {
          this.$message.success("定时任务更新成功:" + res.data.data.jobId);
          this.showAdd = false;
          this.getTaskList();
        })
        .catch();
    },
    deleteTask(row) {
      let params = { jobId: row.taskId };
      scheduleApi
        .deleteTask(params)
        .then(res => {
          this.$message.success("任务已删除。");
          this.getTaskList();
        })
        .catch();
    },
    pauseTask(row) {
      let params = { jobId: row.taskId };
      scheduleApi
        .pauseTask(params)
        .then(res => {
          this.$message.success("任务已暂时。");
        })
        .catch();
    },
    resumeTask(row) {
      let params = { jobId: row.taskId };
      scheduleApi
        .resumeTask(params)
        .then(res => {
          this.$message.success("任务已继续。");
        })
        .catch();
    },
    handleProductChange() {},
    getTaskList() {
      let _this = this;
      let params = {};
      scheduleApi
        .getScheduleTask(params)
        .then(res => {
          _this.taskList = res.data.data;
          _this.dataCount = _this.taskList.length;
          // 分页
          let sd = _this.taskList;
          if (sd.length < _this.pageSize) {
            _this.resultData = sd;
          } else {
            _this.resultData = sd.slice(
              (_this.pageIndex - 1) * _this.pageSize,
              _this.pageSize * _this.pageIndex
            );
          }
        })
        .catch();
    },
    handleAddBtnClick() {
      let _this = this;
      _this.showAdd = true;
      _this.isEdit = false;
      //清除数据
      _this.task = {};
    },
    changepage(index) {
      this.pageIndex = index;
      var _start = (index - 1) * this.pageSize;
      var _end = index * this.pageSize;
      // this.sliceStart = 0;
      this.resultData = [];
      this.getTaskList();
    },
    changePageSize(size) {
      // 缓存
      sessionStorage.setItem("pageSize", size);
      this.pageSize = size;
      this.resultData = [];
      this.changepage(1);
    }
  }
};
</script>

<style>
</style>
