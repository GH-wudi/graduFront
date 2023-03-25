import { createStore } from 'vuex'

export default createStore({
  state: {
    interpolation: {
      getWaterParamsForMonth: null,
      createKrigingInterpolation: null
    },
    loading:false,
    spaceTimeFlag:{
      // isChA:true,
      isArea:false,
      isCOD:false,
      isWater:false,
      isExtract:true
    },
    waterType:null,
    qualityClassify: {
      clear: null
    },
    //提取表格分页插件
    paginationData: {
      total: 0,
      currentPage: 1,
      pageSize: 3
    },
    waterInfluence: {
      clear: null
    },
    curListData:null,
    listData:null,
    mounth: '',
    year: '2021',
    interval: null,
    eutrophicationData:{},
    loading:false
  },
  mutations: {
      //loading加载
      showLoading(state) {
        state.loading = true
        console.log("loading 显示");
      },
      //loading隐藏
      hideLoading(state) {
        state.loading = false
        console.log("loading 隐藏");
        
      },
    //使用获取每月数据函数
    useInTimeLineWPFM(state,time) {
      state.mounth = time
      state.interpolation.getWaterParamsForMonth(state.mounth)
      state.interpolation.createKrigingInterpolation(state.year,state.mounth)
    },
    //获取获取每月数据函数
    setGetWaterParamsForMonth(state,interFun) {
      state.interpolation.getWaterParamsForMonth = interFun.fun1
      state.interpolation.createKrigingInterpolation = interFun.fun2
    },
    //loading加载
    showLoading(state) {
      state.loading = true
      console.log("loading 显示");
    },
    //loading隐藏
    hideLoading(state) {
      state.loading = false
      console.log("loading 隐藏");

    },
  },
  actions: {
  },
  modules: {
  }
})
