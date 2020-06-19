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
    <el-table
      ref="tcTable"
      :row-key="getRowKeys"
      :data="resultData"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" :reserve-selection="true" width="55" v-if="showSelection"></el-table-column>
      <el-table-column prop="id" label="ID" width="180"></el-table-column>
      <el-table-column prop="project" label="产品" width="180"></el-table-column>
      <el-table-column prop="case_name" label="名称" width="180"></el-table-column>
      <el-table-column label="操作" v-if="showOperation">
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
              @click="deleteTC(scope.row)"
              icon="el-icon-delete"
            >删除</el-button>
          </div>
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
  </div>
</template>
<script type="text/ecmascript-6">
import util from "@/utils/utilnew.js";
import CaseList from "@/pages/mine/CaseList";
import tcApi from "@/api/testcase.js";
import Pagination from "@/components/Pagination";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "testcaseList",
  components: { CaseList, Pagination },
  computed: {
    ...mapState("autotest", ["testcaseList"])
  },
  props: {
    showSelection: {
      type: Boolean,
      default: false
    },
    showOperation: {
      type: Boolean,
      default: true
    },
    product: String

    // selectedTCInParent: {
    //   type: Array,
    //   default: () => []
    // }
  },

  data() {
    return {
      tcId: "",
      tcName: "",
      project: "" | this.product,
      moduleName: "",
      platform: "",
      platformList: util.PLATFORMLIST,
      moduleList: [],
      productList: util.PRODUCTLIST,
      tcList: [],
      selectedTCList: [],
      resultData: [],
      idsInParent: [],
      // total: 0,
      // listLoading: true,
      // listQuery: {
      //   page: 1,
      //   limit: 10,
      //   importance: undefined,
      //   title: undefined,
      //   type: undefined,
      //   sort: "+id"
      // },
      // 分页相关
      pageOpts: [10, 20, 50],
      pageSize: 10,
      dataCount: 0,
      pageIndex: 1,

      sliceStart: 0
    };
  },
  created() {
    this.getTestcaseList();
  },
  watch: {
    $route(to, from) {
      this.$router.go(0);
    },

    product: {
      handler(newVal, oldVal) {
        this.project = newVal;
        this.getTestcaseList();
      },
      deep: true,
      immediate: true
    }

    // selectedTCInParent: {
    //   handler(newVal, oldVal) {
    //     this.idsInParent = newVal;
    //     this.getTestcaseList();
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  methods: {
    ...mapMutations("autotest", ["setTestcaseList"]),
    // handleTCInParent() {
    //   debugger;
    //   let _this = this;
    //   let ids = [];
    //   if (_this.selectedTCInParent.length != 0) {
    //     _this.tcList.forEach(item => {
    //       _this.idsInParent.forEach(s => {
    //         console.log("item id: " + item.id + " case id:" + s);
    //         if (s == item.id) {
    //           ids.push(item);
    //         }
    //       });
    //     });

    //     console.log("already selected:" + ids);
    //     ids.forEach(row => {
    //       _this.$refs.tcTable.toggleRowSelection(row, true);
    //     });
    //   }
    // },

    handleSelectionChange(val) {
      this.selectedTCList = val;
      this.setTestcaseList(this.selectedTCList);
      console.log(this.selectedTCList);
    },
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
            // this.handleTCInParent();
            _this.dataCount = _this.tcList.length;
            // 分页
            let sd = _this.tcList;
            if (sd.length < _this.pageSize) {
              _this.resultData = sd;
            } else {
              _this.resultData = sd.slice(
                (_this.pageIndex - 1) * _this.pageSize,
                _this.pageSize * _this.pageIndex
              );
            }
          }
        })
        .catch(code => {
          console.log(err);
        });
    },
    getModuleMapInfo() {},
    // deleteTC() {},
    deleteTC(row) {
      let _this = this;
      let params = { id: row.id };
      tcApi
        .deleteTc(params)
        .then(res => {
          if (res.status == 200 && res.data.code == 0) {
            _this.$message.success("已删除用例" + row.id);
            _this.getTestcaseList();
          }
        })
        .catch(err => {
          _this.$message.err("删除用例出错：" + err);
        });
    },
    getRowKeys(row) {
      return row.id;
    },
    changepage(index) {
      this.pageIndex = index;
      var _start = (index - 1) * this.pageSize;
      var _end = index * this.pageSize;
      // this.sliceStart = 0;
      this.resultData = [];
      this.getTestcaseList();
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
<style lang="scss" scoped>
.search-item-container {
  // margin-left: 30px;
  padding: 10px 10px 10px 0;
}
.case-list {
}
</style>


