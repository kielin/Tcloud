<template>
  <div>
    <!-- <div class="detail"> -->

    <H5 class="detail">
      基本信息：
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="8" :lg="4" :xl="4">ID: {{id}}</el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="5" :xl="5">TC Name: {{caseDetail.caseName}}</el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="5" :xl="5">Description: {{caseDetail.caseDesc}}</el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="5" :xl="5">Priority: {{caseDetail.priority}}</el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="5" :xl="5">App: {{caseDetail.targetAppLabel}}</el-col>
      </el-row>
    </H5>

    <H5 class="detail">
      详细步骤：
      <el-switch
        style="display: block;margin-bottom:10px"
        v-model="editGlobalEnabled"
        active-text="编辑"
        inactive-text="查看"
      ></el-switch>
      <el-table :data="steps">
        <el-table-column prop="operationIndex" label="Step" width="80"></el-table-column>
        <el-table-column label="Action" width="120">
          <template slot-scope="scope">{{scope.row.operationMethod.actionEnum}}</template>
        </el-table-column>
        <el-table-column label="Operation Node" width="180">
          <template
            slot-scope="scope"
            v-if="scope.row.operationNode!=null"
          >{{ scope.row.operationNode.hasOwnProperty("className")?scope.row.operationNode.className:''}}</template>
        </el-table-column>
        <el-table-column label="Node Type" width="180">
          <editable-cell
            slot-scope="{row}"
            :can-edit="editGlobalEnabled"
            v-model="row.operationNode.nodeType"
            v-if="row.operationNode!=null"
          >
            <span slot="content">{{row.operationNode.nodeType}}</span>
          </editable-cell>
        </el-table-column>
        <el-table-column label="Resource Id" width="220">
          <editable-cell
            slot-scope="{row}"
            :can-edit="editGlobalEnabled"
            v-model="row.operationNode.resourceId"
            v-if="row.operationNode!=null"
          >
            <span slot="content">{{row.operationNode.resourceId}}</span>
          </editable-cell>
        </el-table-column>
        <el-table-column label="text" width="200">
          <editable-cell
            slot-scope="{row}"
            :can-edit="editGlobalEnabled"
            v-model="row.operationNode.text"
            v-if="row.operationNode!=null"
          >
            <span slot="content">{{row.operationNode.text}}</span>
          </editable-cell>
        </el-table-column>
        <el-table-column label="xpath" :show-overflow-tooltip="true">
          <editable-cell
            slot-scope="{row}"
            :can-edit="editGlobalEnabled"
            v-model="row.operationNode.xpath"
            v-if="row.operationNode!=null"
          >
            <span slot="content">{{row.operationNode.xpath}}</span>
          </editable-cell>
        </el-table-column>
      </el-table>
      <div class="cancel-save">
        <el-button @click="goBack">返回</el-button>
        <el-button type="primary" @click="save">更新</el-button>
      </div>
    </H5>
  </div>
</template>

<script>
import tcApi from "@/api/testcase";
import EditableCell from "@/pages/autotest/components/EdittableCell.vue";
export default {
  components: { EditableCell },
  data() {
    return {
      editGlobalEnabled: false,
      id: 0,
      steps: [],
      caseDetail: {}
    };
  },
  mounted() {
    this.getTestcase();
  },
  created() {
    // console.log(this.$route.params);
    this.id = this.$route.params.id;
  },
  methods: {
    getTestcase() {
      let _this = this;
      let params = { id: _this.id };
      tcApi
        .queryTcById(params)
        .then(res => {
          if (res.data.code == 0 && res.data.data != null) {
            _this.caseDetail = res.data.data;
            _this.steps = _this.caseDetail.operationLog.steps;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    save() {
      let _this = this;
      let params = {
        id: _this.id,
        case_info: JSON.stringify(_this.caseDetail)
      };
      console.log(params);
      tcApi
        .updateTcById(params)
        .then(res => {
          if (res.data.code == 0) {
            editGlobalEnabled = false;
          }
        })
        .catch(err => {
          _this.editGlobalEnabled = false;
          _this.$message.error(err);
        });
    },
    goBack() {
      this.$router.push({ name: "testCase" });
    }
  }
};
</script>

<style scoped>
.detail {
  height: 22px;
  margin: 0px 20px 50px 20px;
  padding-left: 10px;
  line-height: 22px;
  border-left: 4px solid #2077ff;
}
.cancel-save {
  height: 100px;
  display: -webkit-flex;
  display: flex;
  -webkit-align-items: center;
  align-items: center;
  -webkit-justify-content: center;
  justify-content: center;
}
</style>
