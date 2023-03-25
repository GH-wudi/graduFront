/**
* 头部菜单
*/ 
<template>

  <el-menu
    :default-active="$route.path"
    class="el-menu-demo"
    mode="horizontal"
    :router="true"
    background-color="rgb(0,0,0)"
    text-color="#fff"
    active-text-color="#fff"
  >
    <el-menu-item index="1">
      <div class="logobox">
        <img class="logoimg" src="../assets/img/logo.png" alt="">
        <span class="logotext">叶绿素a浓度反演</span>
      </div>
    </el-menu-item>
    <el-menu-item index="/home"></el-menu-item>
    <el-menu-item index="/spaceTime" ></el-menu-item>
    <!-- <el-menu-item index="/reciprocal" ></el-menu-item> -->
    <el-menu-item index="/intelligence" ></el-menu-item>
    <el-menu-item index="/analysis" ></el-menu-item>
    <el-menu-item index="/1" @click="openConsole" ></el-menu-item>
    <el-menu-item index="" style="margin-left: auto;padding: 3px;">
      <el-icon @click="exit"><switch-button /></el-icon>
    </el-menu-item>
  </el-menu>
  <!-- <el-menu :default-active="$route.path" :router="true" class="el-menu-demo" mode="horizontal" background-color="rgb(0,0,0)" text-color="#fff" active-text-color="#fff">
  <div class="logobox">
    <img class="logoimg" src="../assets/img/logo.png" alt="">
    <span class="logotext">空地一体化智能水环境监测分析系统</span>
  </div>
  <el-menu-item index="">首页</el-menu-item>
  <el-menu-item index="">数据分析</el-menu-item>
  <span class="el-icon-switch-button" @click="exit"></span>
  </el-menu> -->
</template>
<script>
import {SwitchButton} from '@element-plus/icons-vue'
export default {
  name: 'navcon',
  data() {
    return {
      collapsed: true,
      user: {}
    }
  },
  components: {
    SwitchButton
  },
  // 创建完毕状态(里面是操作)
  created() {
    // this.user = JSON.parse(localStorage.getItem('userdata'))
  },
  methods: {
    openConsole(){
      const a =document.createElement('a')
      a.href='http://yzy1217.online/'
      a.click()
    },
    // 退出登录
    exit() {
      this.$confirm('退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setTimeout(() => {
            this.$router.push({ path: '/login' })
            this.$message({
              type: 'success',
              message: '已退出登录!'
            })
          }, 1000)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 切换显示
    toggle(showtype) {
      this.collapsed = !showtype
      this.$root.Bus.$emit('toggle', this.collapsed)
    }
  }
}
</script>
<style>
.el-menu--horizontal>.el-submenu .el-submenu__title {
  height: 45px !important;
  line-height: 45px !important;
}
</style>

<style >
.logobox {
  display: inline-block;
  float: left;
  padding: 5px 0px;
  height: 40px;
  line-height: 40px;
}
.logobox .logoimg {
  width: 35px;
  height: 35px; 
  vertical-align: middle;
}


.logobox .logotext {
  padding: 0 5px;
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
}
.el-menu-item, .el-submenu__title {
  height: 45px !important;
  line-height: 45px !important;
}

.el-menu--horizontal>.el-menu-item {
  height: 45px;
  line-height: 45px;
}
.el-menu.el-menu--horizontal {
  height: 46px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
}
.submenu {
  height: 45px;
  line-height: 45px;
}
.buttonimg {
  height: 60px;
  background-color: transparent;
  border: none;
}
.showimg {
  width: 26px;
  height: 26px;
  position: absolute;
  top: 17px;
  left: 17px;
}
.showimg:active {
  border: none;
}


</style>