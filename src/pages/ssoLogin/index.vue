<template>
  <div class="jumbotron">
    <el-button type="primary" class="login-btn" @click="ssoLogin">Login with CAS</el-button>
  </div>
</template>

<script>
import userApi from "@/api/user.js";
import store from "@/store";
import qs from "qs";
import { mapGetters, mapActions } from "vuex";
export default {
  methods: {
    ssoLogin() {
      userApi.ssoLogin().then(res => {
        debugger;
        console.log(res);
      });
    }
  }
};
</script>

<style>
</style>
