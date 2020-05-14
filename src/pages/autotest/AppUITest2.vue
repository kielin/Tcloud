<template>
  <div class="per-test">
    <el-card class="card-auto" shadow="nerver">
      <el-steps :active="activeNum" align-center>
        <el-step
          :title="item.title"
          :icon="item.icon"
          @click.native="stepClick(item.index)"
          v-for="item in stepData"
          :key="item.index"
        ></el-step>
      </el-steps>
      <div class="random-content">
        <Introduce v-show="activeNum===0"></Introduce>
        <UploadApk v-show="activeNum===1"></UploadApk>
        <ChooseModel v-show="activeNum===2" @selectModel="selectModel" :current="activeNum==2"></ChooseModel>
        <MoreConfig v-show="activeNum===3"></MoreConfig>
        <ChooseTestScript v-show="activeNum===4"></ChooseTestScript>
        <SubmitTest v-show="activeNum===5"></SubmitTest>
      </div>
      <el-button style="margin-top: 20px;" v-if="showBack" @click="lastStep">上一步</el-button>
      <el-button
        type="primary"
        style="margin-top: 20px;"
        @click="nextStep"
        :disabled="!canNextStep"
      >{{stepText}}</el-button>
    </el-card>
  </div>
</template>
<script>
import Introduce from "./percomponents/Introduce";
import UploadApk from "./percomponents/UploadApk";
import ChooseModel from "./percomponents/ChooseModel";
import MoreConfig from "./percomponents/MoreConfig";
import SubmitTest from "./percomponents/SubmitTest";
import ChooseTestScript from "./percomponents/ChooseTestScript";
import monkeyApi from "@/api/monkey.js";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      stepData: [
        { index: 0, title: "测试方案介绍", icon: "el-icon-edit" },
        { index: 1, title: "上传apk", icon: "el-icon-edit" },
        { index: 2, title: "选择测试机型", icon: "el-icon-edit" },
        { index: 3, title: "更多配置", icon: "el-icon-edit" },
        { index: 4, title: "选择测试脚本", icon: "el-icon-edit" },
        { index: 5, title: "提交测试", icon: "el-icon-edit" }
      ],
      activeNum: 0,
      stepText: "下一步",
      canNextStep: true,
      selectedList: [] // 选中的手机列表,
      // setpLength: this.stepData.length
    };
  },
  computed: {
    nickname() {
      return this.$store.state.login.nickname;
    },
    setpLength() {
      return this.stepData.length;
    },
    ...mapState("autotest", [
      "selectApk",
      "perRunTime",
      "selectPhoneList",
      "testType",
      "testConfig",
      "testcaseList"
    ]),
    ...mapGetters("autotest", ["getJumpLogin", "getIsInstallApp"]),
    showBack() {
      return this.activeNum !== 0;
    },

    userId() {
      return this.$store.state.login.userid;
    }
  },
  components: {
    Introduce,
    UploadApk,
    ChooseModel,
    MoreConfig,
    SubmitTest,
    ChooseTestScript
  },
  methods: {
    ...mapMutations("autotest", ["setSelectApk"]),

    stepClick(val) {
      var _that = this;
      _that.activeNum = val;
    },
    // 提交测试
    submitTest() {
      let mobileData = JSON.parse(JSON.stringify(this.selectPhoneList));
      let mobile_infos = mobileData.map(item => {
        return {
          mobile_id: item.serial,
          mobile_version: item.version,
          mobile_model: item.manufacturer + " " + item.model,
          mobile_resolution: `${item.display.height} x ${item.display.width}`
        };
      });
      let ids = [];
      if (this.testcaseList.length < 1) {
        this.$message.error("未选择测试用例");
        return;
      } else {
        this.testcaseList.forEach(item => {
          ids.push(item.id);
        });
      }
      let params = {
        user_id: this.userId,
        mobile_infos,
        system_device: 0,
        login_required: this.getJumpLogin,
        app_install_required: this.getIsInstallApp,
        login_username: "",
        login_password: "",
        type_id: this.testType / 1,
        run_time: this.perRunTime / 1,
        app_id: this.selectApk.id,
        test_config: this.testConfig,
        testcaseList: ids,
        executer: this.nickname
      };
      console.log(params);
      monkeyApi
        .submiTest(params, 3)
        .then(res => {
          // 跳转到列表页
          this.$message.success("提交成功");
          window.location.hash = "#/auto/appUIReport";
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // 下一步
    nextStep() {
      debugger;
      if (this.activeNum === 1) {
        // 判断有没有选中安装包
        if (JSON.stringify(this.selectApk) === "{}") {
          this.$message.warning("请选择安装包");
          return;
        }
      }
      if (this.activeNum < this.setpLength + 1) {
        this.activeNum++;
        this.stepStatus(this.activeNum);
        return;
      }
      this.activeNum++;
      if (this.activeNum === this.setpLength + 1) {
        // 调用提交接口
        this.submitTest();
      }
    },
    // 上一步
    lastStep() {
      if (this.activeNum > 1) {
        this.activeNum--;
        this.stepStatus(this.activeNum);
      }
    },
    // 确定按钮状态
    stepStatus(activeNum) {
      if (this.activeNum === 2) {
        if (this.selectedList.length === 0) {
          this.stepText = "下一步 [ 请先选择手机 ]";
          this.canNextStep = false;
        } else {
          this.canNextStep = true;
          this.stepText = `下一步 [您已选择${this.selectedList.length}台手机]`;
        }
      } else if (this.activeNum === this.setpLength + 1) {
        this.canNextStep = true;
        this.stepText = "提交";
      } else {
        this.canNextStep = true;
        this.stepText = "下一步";
      }
    },
    // 选中模型后的回调
    selectModel(selectedList) {
      this.selectedList = selectedList;
      console.log(this.selectedList);
      if (this.activeNum === 2) {
        if (selectedList.length > 0) {
          this.canNextStep = true;
          this.stepText = `下一步 [您已选择${this.selectedList.length}台手机]`;
        } else {
          this.canNextStep = false;
          this.stepText = "下一步 [ 请先选择手机 ]";
        }
      }
    }
  },
  beforeDestroy() {
    this.setSelectApk({});
  }
};
</script>

<style scoped lang="scss">
.random-test {
  font-size: 14px;
}
</style>
<style lang="scss">
</style>

