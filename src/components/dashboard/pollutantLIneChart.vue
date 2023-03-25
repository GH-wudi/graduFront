<template>
    <div class="pollutantLineChart"></div>
</template>

<script>
    import * as echarts from 'echarts'
    import request from "../../utils/request";

    export default {
        name: "pollutantLineChart",
        data(){
            return{
                seriesList:[],
                xAxisHead:[]
            }
        },
        methods:{
            getPollutantData(){
                request.get('waterenv-monitor/auto/data/area/interval',{
                    params:{
                        province: '河北省'
                    }
                }).then(res=>{
                    // console.log(res)
                    let historyData=[]
                    const waterParameters = [
                        'codmii',
                        'nh4',
                        'tn',
                        'tp',
                        'ph',

                    ];
                    this.xAxisHead = []
                    for(let key in res.data){
                        //裁剪时间轴
                        // console.log(res.data[key])
                        let currentData = res.data[key]

                        let time =currentData['time']
                        for(let parameter in res.data[0].waterData){
                            historyData[parameter] = []
                        }
                        this.xAxisHead.push(time)
                    }
                    // console.log(historyData)
                    for(let key in res.data){
                        for (let param in res.data[key].waterData){
                            // console.log(res.data[key].waterData[param])
                            historyData[param].push(res.data[key].waterData[param])
                        }
                    }
                    // console.log(historyData)
                    const seriesList = [];
                    echarts.util.each(waterParameters, function (waterParameter) {
                        var datasetId = 'dataset_' + waterParameter;
                        /*console.log(datasetId)
                        console.log(historyData[waterParameter])*/
                        seriesList.push({
                            type: 'line',
                            datasetId: datasetId,
                            smooth: true,
                            data:historyData[waterParameter],
                            showSymbol: false,
                            name: waterParameter,
                            endLabel: {
                                show: true,
                                formatter: function (params) {

                                    return waterParameter+ ': ' + params.value;
                                }
                            },
                            labelLayout: {
                                moveOverlap: 'shiftY'
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            encode: {
                                x: 'Year',
                                y: 'Income',
                                label: ['Country', 'Income'],
                                itemName: 'Year',
                                tooltip: ['Income']
                            }
                        });
                    });
                    this.seriesList = seriesList
                    this.createPollutantLineChart()
                })
            },
            createPollutantLineChart(){
                let pollutantLineChart = echarts.init(document.querySelector('.pollutantLineChart'))

                const option = {

                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        },

                    },
                    title: {
                        text: '其他主要污染物曲线',
                        textStyle: {
                            color: '#ffffff'
                        }
                    },

                    dataZoom: [
                        {
                            type: 'slider',
                            showDetail: false,
                            show: true,

                            height: '5%',
                            borderColor: '#8FDFFE',
                            backgroundColor: '#8fdffe99',
                            // 拖拽手柄样式 svg 路径
                            handleIcon: 'M512 512m-208 0a6.5 6.5 0 1 0 416 0 6.5 6.5 0 1 0-416 0Z M512 192C335.264 192 192 335.264 192 512c0 176.736 143.264 320 320 320s320-143.264 320-320C832 335.264 688.736 192 512 192zM512 800c-159.072 0-288-128.928-288-288 0-159.072 128.928-288 288-288s288 128.928 288 288C800 671.072 671.072 800 512 800z',
                            handleColor: '#8FDFFE',
                            handleSize: 15,
                            handleStyle: {
                                borderColor: '#8FDFFE',
                                shadowBlur: 5,
                                shadowOffsetX: 1,
                                shadowOffsetY: 1,
                                shadowColor: '#e5e5e5'
                            },
                            start: 0,
                            end: 100

                        }

                    ],


                    animationDuration: 10000,
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'category',
                        data : this.xAxisHead,
                        axisLabel: {
                            rotate: 20,
                            color: '#fff',
                        }

                    },
                    yAxis: {
                        name: '含量(mg/L)',
                        nameTextStyle:{
                            color:'#FFf'
                        },
                        axisLabel: {

                            color: '#fff',
                        }

                    },
                    grid:{
                        right:60,
                        bottom: '15%',

                    },
                    series: this.seriesList
                };
                pollutantLineChart.setOption(option)
            },
        },
        mounted() {
            this.getPollutantData()
        },
    }
</script>

<style scoped>
    .pollutantLineChart{
        height: 97%;
        width: 97%;

    }
</style>