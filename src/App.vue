<template>
  <!-- <div id="nav">
    <router-link to="/Home">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div> -->
  <div style="height: 100%;">
    <router-view/>
    <loading></loading>
  </div>
  
</template>
<script>
  // import router from "./router/index";
  // import generateRoutes from "./router/parser";
  import Loading from "./components/Loading/Loading.vue"
  export default {
    name: "app",
    components: {
      Loading
    }
    // 在SPA初始化时，立刻从本地存储中拿到原始数据，解析后注入到路由实例中【吐血】
    // created() {
    //   if (localStorage.menu) {
    //     const menu = JSON.parse(localStorage.menu);
    //     const _routes = generateRoutes(menu);
    //     router.addRoutes(_routes);
    //   }
    // }
  };
</script>
<style lang="scss">
html,
body {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0px;
    margin: 0px;
    background-color: rgb(238, 238, 238);
}
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    widows: 100%;
    height: 100%;
}
</style>
