<template>
    <div id="interpolation-time-spatail-container" style="width:400px;height: 100%;">
        <div class="interpolation-time-spatial" v-show="isDisplay.isArea">
            <div class="top">
                <div style="background: rgba(0,0,0,0.7); padding: 12px 10px;">
                    <img src="../../assets/icon/interpolation.svg" alt="" style="vertical-align: sub;margin-right: 10px;">
                    <span style="display: inline-block;font-weight: 600;">水域面积时空变化</span>
                </div>
                <div style="background-color: rgb(2,35,70);padding: 5px 10px;font-size: 14px;text-align: center;">水域参数</div>
                <div class="waterPro" style="padding: 15px 10px;background-color: rgb(0,0,0);">
                    <span>监测日期:{{currentInf.currentData.receiveTime}}</span><br>
                    <span>所处时期:{{currentInf.currentPeriod}}</span><br>
                    <span>卫星类型:{{currentInf.currentData.satelliteId}}</span><br>
                    <span>载荷类型:{{currentInf.currentData.sensorId}}</span><br>
                    <span>白洋淀水域面积:{{currentInf.currentData.area}}</span><br>
                </div>
                <div style="background-color: rgb(2,35,70);padding: 5px 10px;font-size: 14px;text-align: center;">影像服务显示</div>
                <div style="padding: 15px 10px;background-color: rgba(0,0,0,0);display: flex;justify-content: space-around">
                    <div >
                        <span>遥感影像:</span>
                        <el-switch
                                v-model="currentInf.isCloseImg"
                                @click="handleImgShow"
                        >
                        </el-switch>
                    </div>
                    <div>
                        <span>提取结果:</span>
                        <el-switch
                                v-model="currentInf.isCloseResult"
                                @click="handleResultShow"
                        >
                        </el-switch>
                    </div>
                </div>
                <div style="background-color: rgb(2,35,70);padding: 5px 5px;font-size: 14px;text-align: center;">水域时空播放</div>
                <div style="background-color: rgba(0,0,0,0);">
                    <div style="display: flex;align-items: center;padding-top: 15px;padding-bottom: 10px;justify-content:center">
                        <span >时空数据播放:</span>
                        <div style="width: 15%"></div>
                        <img class="autoPlayBtn" @mouseover="btnColor.timeSpatial.flag = false"  @mouseout="btnColor.timeSpatial.flag = true" :src="(btnColor.timeSpatial.flag )? btnColor.timeSpatial.autoPlay : btnColor.timeSpatial.lightAutoPlay" v-show="!isPlay" @click="autoCarousel" alt="">
                        <img class="autoPlayBtn" @mouseover="btnColor.pauseSpatial.flag = false"  @mouseout="btnColor.pauseSpatial.flag = true" :src="(btnColor.pauseSpatial.flag )? btnColor.pauseSpatial.pausePlay : btnColor.pauseSpatial.lightPausePlay" v-show="isPlay"  @click="pauseCarousel" alt="">
                    </div>

                </div>
                <div class="waterAreaBarChart" style="width: 380px;height: 300px">

                </div>

            </div>


        </div>
        <div class="interpolation-time-spatial" v-show="isDisplay.isChA">
            <div class="top">
                <div style="background: rgba(0,0,0,0.7); padding: 12px 10px;">
                    <img src="../../assets/icon/interpolation.svg" alt="" style="vertical-align: sub;margin-right: 10px;">
                    <span style="display: inline-block;font-weight: 600;">叶绿素A浓度时空反演</span>
                </div>
                <div style="background-color: rgb(2,35,70);padding: 5px 10px;font-size: 14px;text-align: center;">反演数据展示</div>
                <div class="waterPro" style="padding: 15px 10px;background-color: rgb(0,0,0);">
                    <span>监测日期:2021.09.22</span><br>
                    <span>所处时期:丰水期</span><br>
                    <span>卫星类型:{{currentInf.currentData.satelliteId}}</span><br>
                    <span>载荷类型:{{currentInf.currentData.sensorId}}</span><br>

                </div>
                <div style="background-color: rgb(2,35,70);padding: 5px 10px;font-size: 14px;text-align: center;">影像服务显示</div>
                <div style="padding: 15px 10px;background-color: rgba(0,0,0,0);display: flex;justify-content: space-around">
                    <div >
                        <span>遥感影像:</span>
                        <el-switch
                                v-model="chAInf.isCloseImg"
                                @click="handleChAImgShow"
                        >
                        </el-switch>
                    </div>
                    <div>
                        <span>高危区域:</span>
                        <el-switch
                                v-model="chAInf.isClosePOI"
                                @click="handleChAPOIShow"
                        >
                        </el-switch>
                    </div>
                </div>
                <div style="background-color: rgb(2,35,70);padding: 5px 5px;font-size: 14px;text-align: center;">叶绿素A反演统计分析</div>
                <div style="background-color: rgba(0,0,0,0);">


                </div>
                <div class="waterAreaBarChart" style="width: 380px;height: 300px">

                </div>

            </div>


        </div>
        <div class="interpolation-time-spatial" v-show="isDisplay.isCOD">
            <div class="top">
                <div style="background: rgba(0,0,0,0.7); padding: 12px 10px;">
                    <img src="../../assets/icon/interpolation.svg" alt="" style="vertical-align: sub;margin-right: 10px;">
                    <span style="display: inline-block;font-weight: 600;">COD浓度时空反演</span>
                </div>
                <div style="background-color: rgb(2,35,70);padding: 5px 10px;font-size: 14px;text-align: center;">反演数据展示</div>
                <div class="waterPro" style="padding: 15px 10px;background-color: rgb(0,0,0);">
                    <span>监测日期:2022.01.22</span><br>
                    <span>所处时期:枯水期</span><br>
                    <span>卫星类型:{{currentInf.currentData.satelliteId}}</span><br>
                    <span>载荷类型:{{currentInf.currentData.sensorId}}</span><br>

                </div>
                <div style="background-color: rgb(2,35,70);padding: 5px 10px;font-size: 14px;text-align: center;">影像服务显示</div>
                <div style="padding: 15px 10px;background-color: rgba(0,0,0,0);display: flex;justify-content: space-around">
                    <div >
                        <span>遥感影像:</span>
                        <el-switch
                                v-model="CODInf.isCloseImg"
                                @click="handleCODImgShow"
                        >
                        </el-switch>
                    </div>
                    <div>
                        <span>高危区域:</span>
                        <el-switch
                                v-model="CODInf.isClosePOI"
                                @click="handleChAPOIShow"
                        >
                        </el-switch>
                    </div>
                </div>
                <div style="background-color: rgb(2,35,70);padding: 5px 5px;font-size: 14px;text-align: center;">COD反演统计分析</div>
                <div style="background-color: rgba(0,0,0,0);">


                </div>
                <div class="waterAreaBarChart" style="width: 380px;height: 300px">

                </div>

            </div>


        </div>
        <div class="interpolation-time-spatial" v-show="isDisplay.isWater">
            <div class="top">
                <div style="background: rgba(0,0,0,0.7); padding: 12px 10px;">
                    <img src="../../assets/icon/interpolation.svg" alt="" style="vertical-align: sub;margin-right: 10px;">
                    <span style="display: inline-block;font-weight: 600;">水体富营养化分析</span>
                </div>
                <div style="background-color: rgb(2,35,70);padding: 5px 10px;font-size: 14px;text-align: center;">反演数据展示</div>
                <div class="waterPro" style="padding: 15px 10px;background-color: rgb(0,0,0);">
                    <span>监测日期:2021.09.22</span><br>
                    <span>所处时期:丰水期</span><br>
                    <span>卫星类型:{{currentInf.currentData.satelliteId}}</span><br>
                    <span>载荷类型:{{currentInf.currentData.sensorId}}</span><br>

                </div>
                <div style="background-color: rgb(2,35,70);padding: 5px 10px;font-size: 14px;text-align: center;">影像服务显示</div>
                <div style="padding: 15px 10px;background-color: rgba(0,0,0,0);display: flex;justify-content: space-around">
                    <div >
                        <span>遥感影像:</span>
                        <el-switch
                                v-model="chAInf.isCloseImg"
                                @click="handleChAImgShow"
                        >
                        </el-switch>
                    </div>
                    <div>

                    </div>
                </div>
                <div style="background-color: rgb(2,35,70);padding: 5px 5px;font-size: 14px;text-align: center;">富营养化统计分析</div>
                <div style="background-color: rgba(0,0,0,0);">


                </div>
                <div class="waterEutrophicationBarChart" style="width: 410px;height: 400px">

                </div>

            </div>


        </div>
        <div class="interpolation-time-spatial" v-show="isDisplay.isExtract">
            <div class="top">
                <div style="background: rgba(0,0,0,0.7); padding: 12px 10px;">
                    <img src="../../assets/icon/interpolation.svg" alt="" style="vertical-align: sub;margin-right: 10px;">
                    <span style="display: inline-block;font-weight: 600;">水域面积提取</span>
                </div>
                <div style="background-color: rgb(2,35,70);padding: 5px 10px;font-size: 14px;text-align: center;">影像数据空间查询</div>
                <div style="padding: 8px 10px;background-color: rgba(0,0,0,0);display: flex;justify-content: space-around">
                    <div class="show-methods" >
                        <span  class="location-text"> <img src="../../assets/img/searchSpatial.svg" style="width: 25px;vertical-align: sub;margin-right: 10px;"/>空间范围:</span>
                        <el-radio-group v-model="waterType" style="display: inline-block;margin-bottom: 10px" @change="handleWaterType">

                            <el-radio label="湖库水体"  style="color:white">湖库水体</el-radio>
                            <el-radio label="微小水体"  style="color:white">微小水体</el-radio>
                        </el-radio-group>
                        <span class="select-shape" style="margin: 0 16px 0 0px;" @click="selectedSiteContent('圆形')">
                            <img src="../../assets/img/circle.svg" alt="">
                            <span :class="[shape === '圆形'? 'shape-text-color': '']">圆形</span>
                        </span>
                        <span class="select-shape" @click="selectedSiteContent('正方形')">
                            <img src="../../assets/img/square.svg" alt="">
                            <span :class="[shape === '正方形'? 'shape-text-color': '']">正方形</span>
                        </span>
                        <span class="select-shape" @click="selectedSiteContent('矩形')">
                            <img src="../../assets/img/rectangle.svg" alt="">
                            <span :class="[shape === '矩形'? 'shape-text-color': '']">矩形</span>
                        </span>
                        <span class="select-shape" style="margin-right: 0px;" @click="selectedSiteContent('多边形')">
                            <img src="../../assets/img/polygon.svg" alt="">
                            <span :class="[shape === '多边形'? 'shape-text-color': '']">多边形</span>
                        </span>
                        <div style="width: 100%;display: inline-block;text-align: center;margin-top: 10px">
                            <span class="search-image-btn" @click="searchImageData">数据检索</span>
                            <span class="search-image-btn" style="margin-left: 5px;" @click="resetImgData">数据重置</span>
                        </div>
                    </div>

                </div>
                <div style="background-color: rgb(2,35,70);padding: 10px;font-size: 14px;text-align: center;">影像数据检索结果</div>
                <div class="waterPro" style="padding: 10px 5px">
                    <el-table  max-height="310"
                               size="small" :data="curListData"
                               highlight-current-row
                               :header-cell-style="{color: 'white', fontSize: '15px', }"
                               element-loading-text="拼命加载中"
                               style="width: 100%;"
                               @cell-mouse-enter="handleMouseEnter"
                               @cell-mouse-leave="handleMouseOut"  >
                        <el-table-column align="center" label="序号" type="index" min-width="20%" width="50">
                        </el-table-column>
                        <el-table-column align="center" prop="uploadFilename" min-width="15%" label="文件名"  show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column align="center" prop="uploadTime" min-width="18%" label="上传时间"  show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                                label="影像预览"
                                align="center"
                                min-width="18%" >
                            <template template v-slot="scope">
                                <el-image
                                        v-if="scope.row.imageUrl!==null"
                                        style="width: 40px; height: 40px"
                                        :src="scope.row.imageUrl"
                                        :preview-src-list="[scope.row.imageUrl]">
                                </el-image>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" min-width="10%">
                            <template  template v-slot="scope">
                                <el-checkbox v-model='listData[scope.$index].flag' @change="handleCheckedChange(scope.$index,scope.row)"></el-checkbox>
                            </template>
                        </el-table-column>
                    </el-table>
<!--                    分页插件-->
                    <div class="pagination-wrap" style="position: relative;left: 40%;margin-top: 5px">
                        <el-pagination
                                background
                                small

                                @current-change="handleCurrentChange"

                                :page-size="paginationData.pageSize"
                                layout="total,  prev, pager, next"
                                :total="paginationData.total"
                        ></el-pagination>
                    </div>
                    <button :class="'water-button'" @click="extractWater" :disabled="extractBtnState" >提取水体</button>
                </div>

                <div style="background-color: rgb(2,35,70);padding: 5px 5px;font-size: 14px;text-align: center;">影像详情</div>
                <div class="waterPro" style="padding: 5px 5px; display: flex;justify-content:  space-around">
                    <div>
                        <span class="imgInf">拍摄日期:{{currentRsImg.photoTime}}</span><br>
                        <span class="imgInf">所处时期:{{currentRsImg.period}}</span><br>

                        <span class="imgInf">所处位置:{{currentRsImg.position}}</span><br>
                        <span class="imgInf">光谱分辨率:{{currentRsImg.heightInPx}}</span><br>
                    </div>
                    <div>
                        <span class="imgInf">卫星类型:{{currentRsImg.satelliteId}}</span><br>
                        <span class="imgInf">载荷类型:{{currentRsImg.sensorId}}</span><br>
                    </div>





                </div>


            </div>


        </div>
    </div>
</template>

<script>

    import lightAutoPlay from '../../assets/img/autoPlay.svg'
    import autoPlay from '../../assets/img/lightAutoPlay.svg'
    import lightPausePlay from '../../assets/img/lightPausePlay.svg'
    import pausePlay from '../../assets/img/pausePlay.svg'

    import * as echarts from 'echarts'
    import request from "../../utils/request";
    export default {
        name: 'waterSpace-leftBar',
        props:{
            "currentImgInf":{ type: Object },
            "currentIndex":{type:Number}
        },
        data() {
            return {
                //分页插件
                paginationData: {
                    total: 0,
                    currentPage: 1,
                    pageSize: 3
                },
                shape:'',
                isPlay:false,
                barCharts:null,
                isDisplay:{
                    isArea:false,
                    isChA:false,
                    isCOD:false,
                    isWater:false,
                    isExtract:true,
                },
                chAInf:{
                    isCloseImg:true,
                    isCloseResult:false,
                    isClosePOI:false,
                },
                CODInf:{
                    isCloseImg:true,
                    isCloseResult:false,
                    isClosePOI:false,
                    codFlag:false
                },
                btnColor: {
                    timeSpatial: {
                        autoPlay,
                        lightAutoPlay,
                        flag: true,
                        clickFlag: false
                    },
                    pauseSpatial: {
                        lightPausePlay,
                        pausePlay,
                        flag: true,
                        clickFlag: false
                    },

                },
                barChartData:{
                    xAxis:{
                        categories :  ['2011-01','2012-01','2012-03','2014-03','2016-03'],

                        categories2 : [1,2,3,4,5],
                    },
                    yAxis:{

                    },
                    currentData:{},
                    totalData:{
                        data : [703126406,703126406,703126406,703126406,703126406],
                        data2 : [3.1,3.4,3.9,4,2.5],
                    }
                },
                currentInf:{
                    isCloseImg:false,
                    isCloseResult:false,
                    currentData:{
                        receiveTime:'暂无日期',
                        resultData:{
                            otherArg:{
                                area:'暂无面积'
                            }
                        },
                        sensorId:'暂无类型',
                        satelliteId:'暂无型号',
                        area:'暂无面积',
                    },
                    currentPeriod:'暂无'
                },
                imgList:null,
                waterType:'湖库水体',
                curListData:null,
                listData:[
                    {flag:false}
                ],
                currentRsImg:{
                    photoTime:'暂无',
                    period:'暂无',
                    position:'暂无',
                    satelliteId:'暂无',
                    sensorId:'暂无',
                    heightInPx:'暂无'
                }
            }
        },

        mounted() {
            this.initDataCharts()

        },
        methods: {
            // 提取水体
            extractWater(){
                this.$emit('extractWater')
            },
            //复选框状态选择函数
            handleCheckedChange(index,row){
                console.log(this.paginationData.currentPage)
                console.log(index,row)
                console.log(row.flag)
                let i = (this.paginationData.currentPage-1)*3+index
                if(this.listData[index].flag){
                    row.flag=true
                }
                if(row.flag){
                    this.$emit('handleCheckedChange',i,row,this.paginationData.currentPage)
                    //设置影像详情信息
                    this.currentRsImg.photoTime=row.receiveTime.split(' ')[0]
                    this.currentRsImg.position = row.province+row.city
                    this.currentRsImg.satelliteId = row.satelliteId
                    this.currentRsImg.sensorId = row.sensorId
                    this.currentRsImg.heightInPx = row.resolution+'㎡'
                    if(currentMonth>=5&&currentMonth<=9){
                        this.currentInf.currentPeriod = '丰水期'
                    }else if(currentMonth==1||currentMonth==2||currentMonth==12){
                        this.currentInf.currentPeriod = '枯水期'
                    }else{
                        this.currentInf.currentPeriod = '平水期'
                    }
                }else{
                    this.$emit('removeImageFromLayer')
                }

            },
            handleCurrentChange(num){
                this.paginationData.currentPage=num
                this.$emit('handleCurrentChange',num)
            },
            //重置检索信息
            resetImgData(){
                this.$store.state.curListData = null
                this.paginationData.total=0
                this.$emit('removeFrameLayer')
                this.$emit('setHeBeiProvince')
                this.$emit('removeImageFromLayer')
                this.$emit('removeResultLayer')
                this.currentRsImg.photoTime='暂无'
                this.currentRsImg.position = '暂无'
                this.currentRsImg.satelliteId = '暂无'
                this.currentRsImg.sensorId = '暂无'
                this.currentRsImg.heightInPx = '暂无'

            },
            handleMouseOut(image,row){
                // console.log(image)
                this.$emit('handleMouseOut',image,row)
            },
            handleMouseEnter(image,row){
                this.$emit('handleMouseEnter',image,row)
            },
            handleWaterType(){
                this.$store.state.waterType = this.waterType
            },
            searchImageData(){
                this.$emit('searchImageData')
            },
            //绘制筛选区域
            selectedSiteContent(shape){
                this.$emit('selectedSiteContent',shape)
            },
            //渲染富营养化柱状图
            createEutrophicationBarCharts(){
                let barChart = echarts.init(document.querySelector('.waterEutrophicationBarChart'))

                const option = {
                    dataset: this.$store.state.eutrophicationData,
                    grid: { containLabel: true ,left:5,right:80,top:30},
                    xAxis: { name: '营养指数',axisLabel: {

                            color: '#fff',
                        },nameTextStyle: {   // 坐标轴名称样式
                            color: 'white',
                            padding: [5, 0, 0, -5]
                        } },
                    yAxis: { type: 'category' ,axisLabel: {

                            color: '#fff',
                        }},
                    title:{
                      text:'各采样点的富营养化指数',
                      left: 'center',
                        textStyle: {
                            color: '#ffffff',

                        }
                    },
                    visualMap: {
                        orient: 'horizontal',
                        left: 'center',
                        min: 10,
                        max: 90,
                        text: ['High Score', 'Low Score'],
                        textStyle: {
                            color: '#ffffff',

                        },
                        // Map the score column to color
                        dimension: 0,
                        inRange: {
                            color: ['#65B581', '#FFCE34', '#FD665F']
                        },
                        bottom:40,
                    },
                    series: [
                        {
                            type: 'bar',
                            encode: {
                                // Map the "amount" column to X axis.
                                x: '营养指数',
                                // Map the "product" column to Y axis
                                y: '序号'
                            },
                            itemStyle: {
                                normal: {
                                    //这里设置柱形图圆角 [左上角，右上角，右下角，左下角]
                                    barBorderRadius:[0, 10, 10,0]
                                }
                            }

                        }
                    ]
                };
                barChart.setOption(option)

            },
            addMLPCOD(){
                this.CODInf.isCloseImg =true
                this.$emit('addCODLayer')

            },
            // cha
            addMLPChA(){
                this.chAInf.isCloseImg =true
                this.$emit('addChALayer')
                this.$emit('addChAImgLayer')
            },

            // 左侧切换时清除之前数据
            clearHistory(){
                //初始化图标
                {
                    this.barChartData.totalData.data=[]
                    this.barChartData.totalData.data2=[]
                    this.barChartData.xAxis.categories = []
                    this.barChartData.xAxis.categories2 =[]
                    if(this.barChart){
                        this.barChart.setOption({
                            xAxis: [
                                {
                                    data: this.barChartData.xAxis.categories,

                                },
                                {
                                    data: this.barChartData.xAxis.categories2,

                                }
                            ],
                            series: [
                                {
                                    data: this.barChartData.totalData.data,

                                },
                                {
                                    data: this.barChartData.totalData.data2,

                                }
                            ]
                        });

                    }

                }

                //初始化底图图层
                this.$emit('removeWaterResultLayer')
                this.$emit('removeWaterImgLayer')
                this.$emit('removeClassAll')
                this.$emit('removePOILayers')

                //switch
                this.currentInf.isCloseResult =false
                this.currentInf.isCloseImg = false
                this.chAInf.isClosePOI = false
            },
            initDataCharts(){
                request.get('waterenv-system/getWater/bai').then(res=>{
                    this.imgList =res.data
                    let xTime=[]
                    let xIndex=[]
                    let dataArea = []
                    let dataRate = []
                    this.barChartData.xAxis.categories = xTime
                    this.barChartData.xAxis.categories2 =xIndex
                    this.barChartData.totalData.data = dataArea
                    this.barChartData.totalData.data2 = dataRate
                    for(let i=0;i<this.imgList.length;i++){
                        this.imgList[i].resultData.otherArg.area = this.imgList[i].resultData.otherArg.area /1000000
                    }
                    this.createWaterBarCharts()
                })

            },
            //更新当前图标的数据
            updateCharts(){

                if(this.imgList[this.currentIndex]==null){
                    return
                }
                if(this.barChartData.totalData.data.length>5){
                    this.barChartData.totalData.data.shift()
                    this.barChartData.totalData.data2.shift()
                    this.barChartData.xAxis.categories.shift()
                    this.barChartData.xAxis.categories2.shift()
                }

                this.barChartData.totalData.data.push(this.imgList[this.currentIndex].resultData.otherArg.area);

                this.barChartData.totalData.data2.push(+(Math.random() * 10 + 5).toFixed(1));

                this.barChartData.xAxis.categories.push(this.imgList[this.currentIndex].receiveTime);

                this.barChartData.xAxis.categories2.push(this.currentIndex);
                this.barChart.setOption({
                    xAxis: [
                        {
                            data: this.barChartData.xAxis.categories,

                        },
                        {
                            data: this.barChartData.xAxis.categories2,

                        }
                    ],
                    series: [
                        {
                            data: this.barChartData.totalData.data,

                        },
                        {
                            data: this.barChartData.totalData.data2,

                        }
                    ]
                });
            },
            createWaterBarCharts(){

                this.barChart = this.$echarts.init(document.querySelector('.waterAreaBarChart'))
                const option = {
                    title: {
                        text: '白洋淀时空变化统计图',
                        left: 'center',
                        textStyle: {
                            color: '#eee'
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#283b56'
                            }
                        }
                    },
                    legend: {
                        bottom:13,
                        textStyle: {
                            color: '#fff',
                            fontSize: 14
                        },
                    },
                    dataZoom: {
                        show: false,
                        start: 0,
                        end: 100
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: true,
                            data: this.barChartData.xAxis.categories,
                            axisLine:{
                                lineStyle:{
                                    color:'#FFffff',
                                },

                            }
                        },
                        {
                            type: 'category',
                            boundaryGap: true,
                            data: this.barChartData.xAxis.categories2,
                            axisLine:{
                                lineStyle:{
                                    color:'#FFffff',
                                },

                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            scale: true,
                            name: '%',
                            max: 20,
                            min: 0,
                            boundaryGap: [0.2, 0.2],
                            axisLine:{
                                lineStyle:{
                                    color:'#FFffff',
                                }
                            }
                        },
                        {
                            type: 'value',
                            scale: true,
                            name: 'k㎡',

                            boundaryGap: [0.2, 0.2],
                            axisLine:{
                                lineStyle:{
                                    color:'#FFffff',
                                }
                            }
                        }
                    ],
                    series: [

                        {
                            name: '水域面积',
                            type: 'bar',
                            xAxisIndex: 1,
                            yAxisIndex: 1,
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#83bff6' },
                                    { offset: 0.5, color: '#188df0' },
                                    { offset: 1, color: '#188df0' }
                                ]),
                                borderRadius: 10,

                            },
                            emphasis: {
                                itemStyle: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        { offset: 0, color: '#2378f7' },
                                        { offset: 0.7, color: '#2378f7' },
                                        { offset: 1, color: '#83bff6' }
                                    ])
                                }
                            },
                            data: this.barChartData.totalData.data
                        },
                        {
                            name: '面积变化率',
                            type: 'line',
                            data: this.barChartData.totalData.data2
                        }
                    ]
                };
                this.barChart.setOption(option)
            },
            autoCarousel(){
                this.isPlay = !this.isPlay
                this.$emit('autoPlayCarousel')
            },
            pauseCarousel(){
                this.isPlay = !this.isPlay
                this.$emit('pausePlayCarousel')
            },

            handleResultShow(){

                if(this.currentInf.isCloseResult){
                    this.$emit('addWaterResultLayer')
                }else{
                    this.$emit('removeWaterResultLayer')
                }
            },
            handleChAPOIShow(){

                if(this.chAInf.isClosePOI){
                    this.$emit('getDangerPoint')

                }else{
                    this.$emit('removePOILayers')

                }
            },
            handleChAImgShow(){
                if(this.chAInf.isCloseImg){
                    this.$emit('addChAImgLayer')
                }else{

                    this.$emit('removeChAImgLayer')
                }
            },
            handleCODImgShow(){
                if(this.CODInf.isCloseImg){
                    this.$emit('addCODLayer')
                }else{

                    this.$emit('removeCODLayer')
                }
            },
            handleImgShow(){

                if(this.currentInf.isCloseImg){
                    this.$emit('addWaterImgLayer')
                }else{

                    this.$emit('removeWaterImgLayer')
                }
            },
        },
        computed:{
            getSearchImgData(){
                return this.$store.state.curListData
            },
            getListData(){
                return this.$store.state.listData
            },
            getShowAreaState(){
                return this.$store.state.spaceTimeFlag.isArea
            },
            getShowChAState(){
                return this.$store.state.spaceTimeFlag.isChA
            },
            getShowCODState(){
                return this.$store.state.spaceTimeFlag.isCOD
            },
            getShowWaterState(){
                return this.$store.state.spaceTimeFlag.isWater
            },
            getShowExtractState(){
                return this.$store.state.spaceTimeFlag.isExtract
            },
        },
        watch:{
            getListData(newV,oldV){
                console.log(newV)
                this.listData = newV

            },
            getSearchImgData(newV,oldV){
                this.paginationData.total = this.$store.state.paginationData.total
                this.curListData = newV

            },
            getShowExtractState(newV,oldV){
                this.isDisplay.isExtract = newV
                this.clearHistory()
            },
            getShowCODState(newV,oldV){
                this.isDisplay.isCOD = newV
                if(newV){

                    this.$emit('addCODLayer')
                    console.log('COD')
                }else {
                    this.$emit('removeCODLayer')
                }

            },
            getShowWaterState(newV,oldV){
                // console.log(newV)
                this.clearHistory()

                this.isDisplay.isWater = newV
                if(newV){
                    this.$emit('addEutrophicationLayer')
                    this.createEutrophicationBarCharts()
                    this.$emit('addEutrophicationRiverLayer')
                    this.$emit('addChAImgLayer')
                    // console.log('yyh')
                }else {
                    this.$emit('removeEutrophicationLayer')
                    this.$emit('removeEutrophicationRiverLayer')
                }
            },
            getShowAreaState(newV,oldV){
                // console.log(newV)
                this.clearHistory()
                this.isDisplay.isArea = newV
            },
            getShowChAState(newV,oldV){
                // console.log(newV)
                this.clearHistory()
                this.isDisplay.isChA = newV
                if(newV){
                    this.addMLPChA()
                }

            },
            currentIndex(){
                if(this.currentIndex<19){
                    this.updateCharts()
                }
                if(this.currentIndex==document.getElementsByClassName('swiper-slide').length-1){
                    this.pauseCarousel()
                }
            },
            'currentImgInf':{
                handler(newV,oldV){


                    if(newV==null){
                        console.log('yes')
                        this.currentInf.currentPeriod = '暂无时期'
                        this.currentInf.isCloseImg = false
                        this.currentInf.isCloseResult = false
                        this.currentInf.currentData={
                            receiveTime:'暂无日期',
                            resultData:{
                                otherArg:{

                                }
                            },
                            area:'暂无面积',
                            sensorId:'暂无类型',
                            satelliteId:'暂无型号'
                        }
                        return
                    }
                    this.currentInf.currentData = this.currentImgInf
                    this.currentInf.currentData.area = (this.currentImgInf.resultData.otherArg.area).toFixed(2)+'m²'
                    this.currentInf.currentData.sensorId='TM'
                    this.currentInf.isCloseResult = true
                    this.currentInf.isCloseImg = true

                    const currentMonth = parseInt(newV.receiveTime.split('-')[1])
                    if(currentMonth>=5&&currentMonth<=9){
                        this.currentInf.currentPeriod = '丰水期'
                    }else if(currentMonth==1||currentMonth==2||currentMonth==12){
                        this.currentInf.currentPeriod = '枯水期'
                    }else{
                        this.currentInf.currentPeriod = '平水期'
                    }
                    // console.log( this.currentInf)
                }


            },

        }
    }
</script>
<style>
.el-table__body tr.current-row>td.el-table__cell {
    background-color: rgb(0,0,0,0.7);
}
.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf {
    border-bottom: var(--el-table-border);
    background: #000;
    color: #fff;
    /* border-bottom: 1px solid rgba(15,240,255); */
}
.el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell {
    background-color: var(--el-table-row-hover-bg-color);
    background-color: rgba(0,0,0,0.8);
    color: #fff;
}
.el-table__empty-block {
    background: #000;
}
.el-radio__input.is-checked .el-radio__inner {
    border-color: var(--el-color-primary);
    background: var(--el-color-primary);
    border-color: rgb(15,231,255);
    background: rgb(15,231,255);
}
.el-radio__input.is-checked+.el-radio__label {
    color: var(--el-color-primary);
    color: rgb(15,231,255);
}
</style>

<style scoped>
    /deep/ .el-pagination__total span{
        background-color: transparent !important;
        color: white;
    }
  /*  /deep/ .el-table, .el-table__expanded-cell {
        background-color: rgba(80,160,255,0.6);
    }
*/



</style>
<style lang="scss" scoped>
    .interpolation-legend {
        position: absolute;
        right: 58px;
        bottom: 55px;
        border-radius: 6px;
        box-sizing: border-box;
        padding: 10px;

    }
    /* .water-button:hover {
        background:#fff;
        color: #50A0FF;
        transform: scale(1.02);
    } */
    .water-button {
        border: none;
        width: 385px;
        height: 35px;
        margin-top: 8px;
        font-size: 18px;
        text-align: center;
        line-height: 35px;
        background: rgba(80,160,255,0);
        color: #ffffff;
        border-radius: 10px;
        cursor: pointer;
        transition-duration: 0.3s;
        border: 2px solid rgb(15,231,255);
    }
    .interpolation-time-spatial {
        position: absolute;
        left: 0;
        width: 400px;
        height: 99%;
        background: rgba(0, 0, 0, 0.7);
        font-size: 16px;
        color: #fff;
        font-weight: 500;
        border-radius: 5px;
        box-sizing: border-box;
        border: 1px solid rgb(0,190,255,0);
        .waterPro>span{
            line-height: 30px;
        }
        .location-text {
            font-size: 16px;
            font-weight: 600;
            margin-right: 20px;
            color: white;
        }
        .interpolation-btn {
            width: 50%;
            display: inline-block;
            box-sizing: border-box;
            padding: 5px;
            text-align: center;
            background-color: rgb(0,0,0);
            border: 0.002rem solid rgb(4,183,233);
            border-radius: 5px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
        }
        .autoPlayBtn{
            width: 40px;
            height: 40px;
            cursor: pointer;
        }
        .interpolation-btn:hover {
            box-shadow: 0px 0px 10px rgb(4 183 233);
        }
        .select {
            width: 200px;
            height: 28px;
            border-radius: 5px;
            outline: none;
        }

        .show-methods {
            padding-top: 8px;
            text-align: center;
            color: black;
            .longitude-latitude {
                .el-input {
                    width: 100px;
                    text-align: center;
                }
            }
            .select-element {
                margin: 0px;
            }
            /* .select-shape:hover {
                display: inline-block;
                background-color: #fff;
                transform: scale(1.1);
                // background-color: rgb(230,230,230);
                border-radius: 5px;
                color: #50A0FF;
            } */

            .select-shape {
                display: inline-block;
                margin: 0 10px;
                padding: 0 5px;
                height: 29px;
                color: white;
                border-radius: 5px;
                background-color: rgba(0,0,0,1);
                line-height: 27px;
                cursor: pointer;
                transition-duration: 0.3s;
                border: 2px solid rgb(15,231,255);
                box-sizing: border-box;
                img {
                    vertical-align: top;
                }
                span {
                    display: inline-block;
                    margin: 0px 0 0 5px;
                    height: 27px;
                    line-height: 27px;
                    font-size: 14px;
                }
            }
            .search-image-btn {
                display: inline-block;
                padding: 5px 58px;

                color: white;
                background: rgba(80,160,255,0);
                border-radius: 11px;
                font-weight: 600;
                cursor: pointer;
                font-size: 16px;
                transition-duration: 0.3s;
                border: 2px solid rgb(15,231,255); 
            }
            /* .search-image-btn:hover {
                display: inline-block;
                transform: scale(1.02);
                color: #50A0FF;

                background: rgb(255,255,255);
                border-radius: 11px;
                font-weight: 600;
                cursor: pointer;
                box-shadow: 0px 0px 5px rgb(0,0,0,0.8);
                font-size: 16px;
            } */

        }
        .radio-container {
            margin: 0 34px;
            display: inline-block;
            .radio {
                width: 18px;
                height: 18px;
                vertical-align: sub;
            }
        }
        // 图表
        .chart-change {
            width: 100%;
            height: 310px;
        }
        .imgInf{
            display: inline-block;
            line-height: 35px
        }

    }
</style>

