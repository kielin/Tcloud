<template>
  <div>
    <div class="search-item-container">
      <el-row :gutter="3">
        <el-col :xs="24" :sm="12" :md="8" :lg="2" :xl="2">
          <el-select v-model="project" filterable clearable placeholder="产品">
            <el-option
              v-for="(item) in productList"
              :key="item.name"
              :value="item.name"
              :label="item.name"
            />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="2" :xl="2">
          <el-select
            v-model="moduleName"
            filterable
            clearable
            placeholder="模块名称"
            @focus="getModuleMapInfo"
          >
            <el-option
              v-for="(item,index) in moduleList"
              :key="index"
              :value="item.moduleName"
            >{{ item.moduleName }}</el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="2" :xl="2">
          <el-select v-model="platform" filterable clearable placeholder="平台">
            <el-option
              v-for="(item,index) in platformList"
              :key="index"
              :value="item.key"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="3" :xl="3">
          <el-input placeholder="用例ID" v-model="tcId">
            <template slot="prepend">ID:</template>
          </el-input>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="3" :xl="3">
          <el-input placeholder="用例名称" v-model="tcName">
            <template slot="prepend">名称:</template>
          </el-input>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="2" :xl="2">
          <el-button type="primary" icon="el-icon-search" @click="getTestcaseList">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- <div class="case-list"> -->
    <el-table :data="tcList">
      <el-table-column prop="id" label="ID" width="180"></el-table-column>
      <el-table-column prop="project" label="产品" width="180"></el-table-column>
      <el-table-column prop="case_name" label="名称" width="180"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <!-- <router-link :to="'/testcase/' + scope.row.project + '/'+ scope.row.id"> -->
            <el-button
              size="small"
              target="_blank"
              type="primary"
              icon="el-icon-edit"
              @click="editTc(scope.row)"
            >编辑</el-button>
            <!-- </router-link> -->

            <el-button
              size="small"
              type="danger"
              @click="deleteTC(scope.row.id)"
              icon="el-icon-delete"
            >删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import util from "@/utils/utilnew.js";
import CaseList from "@/pages/mine/CaseList";
import tcApi from "@/api/testcase";

export default {
  name: "testcaseList",
  components: { CaseList },
  data() {
    return {
      // tableData: [
      //   {
      //     date: "2016-05-02",
      //     name: "王小虎",
      //     address: "上海市普陀区金沙江路 1518 弄"
      //   },
      //   {
      //     date: "2016-05-04",
      //     name: "王小虎",
      //     address: "上海市普陀区金沙江路 1517 弄"
      //   },
      //   {
      //     date: "2016-05-01",
      //     name: "王小虎",
      //     address: "上海市普陀区金沙江路 1519 弄"
      //   },
      //   {
      //     date: "2016-05-03",
      //     name: "王小虎",
      //     address: "上海市普陀区金沙江路 1516 弄"
      //   }
      // ],
      tcId: "",
      tcName: "",
      project: "",
      moduleName: "",
      platform: "",
      platformList: util.PLATFORMLIST,
      moduleList: [],
      productList: util.PRODUCTLIST,
      tcList: []
      // [
      //   { id: 72, project: "bixin", case_name: "adsaaaaa" },
      //   { id: 73, project: "bixin", case_name: "bbb" }
      // ] //{id,content,product,module}
    };
  },
  created() {
    this.getTestcaseList();
  },
  watch: {
    $route(to, from) {
      this.$router.go(0);
    }
  },
  methods: {
    editTc(row) {
      this.$router
        .push({
          name: "editTc",
          params: {
            project: row.project,
            id: row.id
          }
        })
        .catch(err => {});
    },
    getTestcaseList() {
      let _this = this;
      let params = { project: _this.project, platform: _this.platform };
      tcApi
        .queryTcByPorject(params)
        .then(res => {
          if (res.status == 200 && res.data.code == 0) {
            _this.tcList = res.data.data;
          }
        })
        .catch(code => {
          console.log(err);
        });
    },
    getModuleMapInfo() {},
    deleteTC() {}
  }
};
</script>
<style lang="scss" scoped>
.search-item-container {
  // margin-left: 30px;
  padding: 10px 10px 10px 0;
}
.case-list {
  // overflow: auto;
  // margin-left: 30px;
  // padding: 0px 10px 10px 0;
  // .case-header {
  //   display: flex;
  //   align-items: center;
  //   margin-bottom: 10px;
  //   img {
  //     height: 20px;
  //     margin-right: 10px;
  //   }
  //   .s-module {
  //     display: flex;
  //     height: 30px;
  //     align-items: center;
  //     width: 375px;
  //   }
  // }
}
</style>


