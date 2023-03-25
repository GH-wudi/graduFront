<template>

  <el-container class="index-con">
    <el-container class="main-con">
      <el-header class="index-header">
        <navcon></navcon>
      </el-header>
      <el-main clss="index-main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
// 导入组件
import navcon from '../../components/navcon.vue'
export default {
  name: 'index',
  data() {
    return {
    }
  },
  // 注册组件
  components: {
    navcon
  },
  methods: {},
  created() {

  },
  beforeUpdate() {},
  // 挂载前状态(里面是操作)
  beforeMount() {
    // 弹出登录成功
    /* this.$message({
      message: '登录成功',
      type: 'success'
    })*/
  }
}
</script>
<style scoped>
.index-con {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

.aside {
  width: 64px !important;
  height: 100%;
  background-color: #334157;
  margin: 0px;
}
.asideshow {
  width: 240px !important;
  height: 100%;
  background-color: #334157;
  margin: 0px;
}
.index-header,
.index-main {
  height: 45px !important;
  padding: 0px !important;
  border-left: 0px solid #333;
}
.el-main {
  padding: 0px;
}
</style>
