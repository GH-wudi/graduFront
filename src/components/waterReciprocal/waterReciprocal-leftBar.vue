<template>
    <div id="interpolation-time-spatail-container" style="width:400px;height: 100%;">

        <div class="interpolation-time-spatial" v-show="isDisplay.isChA">
            <div class="top">
                <div style="background: rgba(0,0,0,0.7); padding: 12px 10px;">
                    <img src="../../assets/icon/interpolation.svg" alt="" style="vertical-align: sub;margin-right: 10px;">
                    <span style="display: inline-block;font-weight: 600;">叶绿素a浓度时空反演</span>
                </div>
                <div style="background-color: rgb(2,35,70);padding: 5px 5px;font-size: 14px;text-align: center;">反演数据展示</div>
                <div class="waterPro" style="padding: 10px 10px;background-color: rgb(0,0,0);">
                    <span>监测日期:2021.09.22</span><br>
                    <span>所处时期:丰水期</span><br>
                    <span>卫星类型:{{currentInf.currentData.satelliteId}}</span><br>
                    <span>载荷类型:{{currentInf.currentData.sensorId}}</span><br>
                    <div>
                        <span class="interpolation-btn" @click="clearCha">清除</span>
                        <span class="interpolation-btn" @click="calCha">指数反演</span>
                    </div>

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
                <div style="background-color: rgb(2,35,70);padding: 5px 5px;font-size: 14px;text-align: center;">叶绿素a反演统计分析</div>
                <div class="ChAPieChart"  style="width: 420px;height: 400px"></div>

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
                    <div>
                        <span class="interpolation-btn" @click="clearHistory">清除</span>
                        <span class="interpolation-btn" @click="calCOD">指数反演</span>
                    </div>
                </div>
                <div style="background-color: rgb(2,35,70);padding: 5px 10px;font-size: 14px;text-align: center;">影像服务显示</div>
                <div style="padding: 15px 10px;background-color: rgba(0,0,0,0);display: flex;justify-content: space-around">
                    <div >
                        <span>反演结果:</span>
                        <el-switch
                                v-model="CODInf.isCloseImg"
                                @click="handleCODImgShow"
                        >
                        </el-switch>
                    </div>
                    <div>
                        <span>污染源头:</span>
                        <el-switch
                                v-model="CODInf.isClosePOI"
                                @click="clickPolluteReason"
                        >
                        </el-switch>
                    </div>
                </div>
                <div style="background-color: rgb(2,35,70);padding: 5px 5px;font-size: 14px;text-align: center;">COD反演统计分析</div>
                <div style="background-color: rgba(0,0,0,0);margin: 15px" v-show="CODresult">
                    <span>研究报表：明显发现，白洋淀
                        <span class="waterRecEmp">北部</span>
                        富营养化水平高，
                        <span class="waterRecEmp">南部</span>
                        的富营养化水平低，
                        <span class="waterRecEmp">南距马河</span>和
                        <span class="waterRecEmp">白沟引河</span>
                        极有可能有违规排污口或内源性污染源。</span>
                    <span style="display:inline-block;margin-top: 20px">西部的<span class="waterRecEmp">府河</span>和<span class="waterRecEmp">南瀑河</span>也存在上述所提到的可能污染原因。</span>
                    <span style="display:inline-block;margin-top: 20px">白洋淀水体整体处于富营养化状态，其中<span class="waterRecEmp">37.7%的区域</span>处于重度和中度富营养化水平，主要分布在淀区北部的<span class="waterRecEmp">烧车淀区和王家寨区</span>，与历史研究对比发现，雄安新区成立后随着白洋淀外源污染整治工程的实施，水体富营养化程度有所改善。</span>
                </div>
                <div class="waterAreaBarChart" style="width: 500px;height: 300px">

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
                    <div>
                        <span class="interpolation-btn" @click="clearEutrophication">清除</span>
                        <span class="interpolation-btn" @click="calEutrophication">指数反演</span>
                    </div>
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
    </div>
</template>

<script>
    import autoPlay from "../../assets/img/lightAutoPlay.svg";
    import lightAutoPlay from "../../assets/img/autoPlay.svg";
    import lightPausePlay from "../../assets/img/lightPausePlay.svg";
    import pausePlay from "../../assets/img/pausePlay.svg";
    import request from "../../utils/request";
    import * as echarts from "echarts";

    export default {
        name: "waterReciprocal-leftBar",
        data() {
            return {
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
                CODresult:false,
                barCharts:null,
                barChart:null,
                isDisplay:{
                    isArea:false,
                    isChA:true,
                    isCOD:false,
                    isWater:false
                },
                chAInf:{
                    isCloseImg:false,
                    isCloseResult:false,
                    isClosePOI:false,
                },
                CODInf:{
                    isCloseImg:false,
                    isCloseResult:false,
                    isClosePOI:false,
                    codFlag:false
                },
                wrongClick:true,
                pieChart:null,
                EUflag:false
            }
        },
        mounted() {
            // this.createChaPieCharts()

        },
        methods: {
            calEutrophication(){
                if(this.wrongClick){
                    this.$store.commit('showLoading')
                    
                    const that = this
                    let time = window.setTimeout(function (){
                        that.$store.commit('hideLoading')
                    },1000);
                    document.getElementsByClassName('waterEutrophicationBarChart')[0].style.display='block'
                    this.$emit('addEutrophicationLayer')
                    this.chAInf.isCloseImg=true
                    this.createEutrophicationBarCharts()
                    this.$emit('addEutrophicationRiverLayer')
                    this.$emit('addChAImgLayer')
                }


            },
            clearEutrophication(){
                document.getElementsByClassName('waterEutrophicationBarChart')[0].style.display='none'
                this.clearHistory()
            },
            calCha(){
                if(this.wrongClick){
                    this.$store.commit('showLoading')
                    
                    const that = this
                    let time = window.setTimeout(function (){
                        that.$store.commit('hideLoading')
                    },1000);
                    this.addMLPChA()
                    this.createChaPieCharts()
                    document.getElementsByClassName('ChAPieChart')[0].style.display='block'
                    this.handleChAPOIShow()
                }


            },
            clearCha(){
                document.getElementsByClassName('ChAPieChart')[0].style.display='none'
                this.clearHistory()
            },
            calCOD(){
                this.$store.commit('showLoading')
                    
                const that = this
                let time = window.setTimeout(function (){
                    that.$store.commit('hideLoading')
                },1000);
                this.clearHistory()

                this.CODInf.isCloseImg=true
                this.CODInf.isClosePOI=true

                this.$emit('addCODLayer')
                this.$emit('addChAImgLayer')
                this.$emit('addRiverLayer')

                this.CODresult = true
                document.getElementsByClassName('ChAPieChart')[0].style.display='none'
            },
            clickPolluteReason(){
                if(this.CODInf.isClosePOI){
                    this.$emit('addRiverLayer')
                }else{
                    this.$emit('removeRiverLayer')
                }
            },
            createChaPieCharts(){
                this.pieChart = echarts.init(document.querySelector('.ChAPieChart'))
                const option = {
                    legend: {
                        textStyle: {
                            color: '#ffffff'
                        },
                        itemWidth:20,
                    },
                    tooltip: {
                        trigger: 'axis',
                        showContent: false,
                        textStyle: {
                            color: '#ffffff'
                        },
                    },
                    dataset: {
                        source: [
                            ['product',  '2018', '2019', '2020', '2021', '2022'],
                            ['低浓度', 40.6, 43.6, 45.1, 51.1, 53.4],
                            ['中低浓度', 20.4, 15.7, 21.1, 25.6, 24.3],
                            ['中浓度', 17.8,20.3 , 16.3, 14.9, 13.8],
                            ['中高浓度', 15.1, 13.2, 11.3, 8.27,6.2],
                            ['高浓度', 3.31, 4.12, 2.5, 0.15, 0.9]
                        ]
                    },
                    xAxis: { type: 'category' ,axisLabel: {
                            rotate: 20,
                            color: '#fff',
                        }},
                    yAxis: { gridIndex: 0 ,axisLabel: {

                            color: '#fff',
                        }},
                    grid: { top: '60%' ,bottom:'10%'},
                    series: [
                        {
                            type: 'line',
                            smooth: true,
                            seriesLayoutBy: 'row',
                            emphasis: { focus: 'series' }
                        },
                        {
                            type: 'line',
                            smooth: true,
                            seriesLayoutBy: 'row',
                            emphasis: { focus: 'series' }
                        },
                        {
                            type: 'line',
                            smooth: true,
                            seriesLayoutBy: 'row',
                            emphasis: { focus: 'series' }
                        },
                        {
                            type: 'line',
                            smooth: true,
                            seriesLayoutBy: 'row',
                            emphasis: { focus: 'series' }
                        },
                        {
                            type: 'line',
                            smooth: true,
                            seriesLayoutBy: 'row',
                            emphasis: { focus: 'series' }
                        },
                        {
                            type: 'pie',
                            id: 'pie',
                            radius: '40%',
                            center: ['47%', '35%'],
                            emphasis: {
                                focus: 'self'
                            },
                            label: {
                                formatter: '{b}:({d}%)',
                                textStyle: {
                                    color: '#ffffff',

                                }
                            },
                            encode: {
                                itemName: 'product',
                                value: '2018',
                                tooltip: '2018'
                            }
                        }
                    ]
                };
                let _this = this
                this.pieChart.on('updateAxisPointer', function (event) {
                    const xAxisInfo = event.axesInfo[0];
                    if (xAxisInfo) {
                        const dimension = xAxisInfo.value + 1;
                        _this.pieChart.setOption({
                            series: {
                                id: 'pie',
                                label: {
                                    formatter: '{b}:({d}%)'
                                },
                                encode: {
                                    value: dimension,
                                    tooltip: dimension
                                }
                            }
                        });
                    }
                });
                this.pieChart.setOption(option);


            },

            // cha
            addMLPChA(){

                if(this.wrongClick){
                    console.log('c')
                    this.chAInf.isCloseImg =true

                    this.currentInf.currentData.sensorId='CMOS2'
                    this.currentInf.currentData.satelliteId='ZHUHAI-1 OHS '
                    this.chAInf.isClosePOI = true
                    this.wrongClick = false
                    this.$emit('addChALayer')
                    this.$emit('addChAImgLayer')
                }

            },

            // 左侧切换时清除之前数据
            clearHistory(){
                //防连点
                this.wrongClick = true
                this.CODresult =false
                //初始化底图图层
                this.$emit('removeCODLayer')
                this.$emit('removeRiverLayer')
                this.$emit('removeWaterResultLayer')
                this.$emit('removeWaterImgLayer')
                this.$emit('removeClassAll')
                this.$emit('removePOILayers')
                this.$emit('removeEutrophicationLayer')
                this.$emit('removeEutrophicationRiverLayer')
                //switch
                this.chAInf.isClosePOI = false
                this.chAInf.isCloseImg = false
                this.currentInf.isCloseResult =false
                this.currentInf.isCloseImg = false
                this.chAInf.isClosePOI = false
                this.CODInf.isCloseImg=false
                this.CODInf.isClosePOI=false
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
            //渲染富营养化柱状图
            createEutrophicationBarCharts(){
                if(this.EUflag==false){
                    this.EUflag=true
                    console.log('jll')
                    this.barChart = echarts.init(document.querySelector('.waterEutrophicationBarChart'))

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
                            text: ['高度营养化', '低度营养化'],
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
                    this.barChart.setOption(option)
                }


            },
        },
        computed:{
            getShowChAState(){
                return this.$store.state.spaceTimeFlag.isChA
            },
            getShowCODState(){
                return this.$store.state.spaceTimeFlag.isCOD
            },
            getShowWaterState(){
                return this.$store.state.spaceTimeFlag.isWater
            },
        },
        watch:{
            getShowWaterState(newV,oldV){
                this.isDisplay.isWater = newV
                console.log( this.isDisplay.isChA=false)
                if(newV&&this.pieChart!=null){

                    document.getElementsByClassName('ChAPieChart')[0].style.display='none'
                }

                this.clearHistory()

            },
            getShowCODState(newV,oldV){
                document.getElementsByClassName('waterEutrophicationBarChart')[0].style.display='none'
                this.isDisplay.isCOD = newV
                this.isDisplay.isChA = !newV
                if(newV&&this.pieChart!=null){


                    document.getElementsByClassName('ChAPieChart')[0].style.display='none'
                }
                this.clearHistory()
            },
            getShowChAState(newV,oldV){
                console.log(newV)
                this.isDisplay.isChA = newV
                document.getElementsByClassName('waterEutrophicationBarChart')[0].style.display='none'
                if(!newV&&this.pieChart!=null){

                    document.getElementsByClassName('ChAPieChart')[0].style.display='none'
                }
                this.clearHistory()

            }
        }
    }
</script>

<style lang="scss" scoped>
    .interpolation-legend {
        position: absolute;
        right: 58px;
        bottom: 55px;
        border-radius: 6px;
        box-sizing: border-box;
        padding: 10px;

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
        .waterRecEmp{
            color: red;
            font-weight: bold;
        }

    }
</style>