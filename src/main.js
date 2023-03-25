import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from "element-plus";
import locale from "element-plus/lib/locale/lang/zh-cn";
import "element-plus/dist/index.css"
import dataV from '@jiaminghi/data-view'
import scroll from 'vue-seamless-scroll/src'
import * as echarts from 'echarts'
// import Vue from 'vue'
// import VueVideoPlayer from 'vue-video-player'
// import 'video.js/dist/video-js.css'
import Swiper from 'swiper';
 
// Vue.use(VueVideoPlayer)
// import './style/element-variables.scss'



const app = createApp(App)
app.use(store).use(router).use(ElementUI,{locale}).use(dataV).use(scroll).use(echarts).mount('#app')

app.config.globalProperties.$echarts = echarts;
