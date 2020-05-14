<template>
  <div class="choose-tc">
    <ArrowContainer head-text="选择测试用例">
      <div slot="content" class="choose-tc-list">
        <test-case-list :showOperation="false" :showSelection="true"></test-case-list>
      </div>
    </ArrowContainer>
    <!-- <ArrowContainer head-text="建议">
      <div slot="content">
        <p>
          每次测试，尽量选择更多的手机，可以有效避免因手机性能、电量、网络以及其他原因导致的无效运行
          <br>并且覆盖到多种手机厂商与android系统版本，分辨率等，可以让测试结果更有信服力。
          <br>目前OPPO,VIVO,小米手机在安装时失败概率较高，不建议使用。
          <br>注意：选择手机前，请先到远程真机页面，检查一下手机是否锁屏。如果锁屏，请先手动解锁，以免测试任务卡在锁屏页
        </p>
      </div>
    </ArrowContainer>-->
  </div>
</template>

<script>
import ArrowContainer from "../common/ArrowContainer";
import TestCaseList from "./listTc";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  components: { ArrowContainer, TestCaseList },
  name: "ChooseTestScript",

  data() {
    return {
      // testcaseList: [],
      // selectedList: []
    };
  },
  methods: {}
};
</script>

<style scoped lang="scss">
.choose-tc {
  .choose-tc-list {
    display: flex;
    justify-content: start;
    flex-wrap: wrap;
  }
}
</style>
