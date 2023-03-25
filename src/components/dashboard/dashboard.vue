<template>
    <div class="WPIDashboard">

    </div>
</template>

<script>
    import * as echarts from 'echarts'
    import request from "../../utils/request";

    export default {
        name: "ggg",
        data(){
            return{
                dashboardNewData:{},
            }
        },
        mounted() {
            this.getNewestData()
        },
        methods:{
            getNewestData(){
                request.get('waterenv-monitor/auto/data/area/newest',{params:{
                    province:'河北省'
                    }}).then(res=>{
                    console.log(res.data)
                    this.dashboardNewData = res.data
                    console.log(this.dashboardNewData)
                    this.createWPIDashboard()
                })
            },
            createWPIDashboard(){

                console.log(this.dashboardNewData.WQI)
                let WPIDashboard = echarts.init(document.querySelector('.WPIDashboard'))
                const option = {
                    animationDuration: 10000,
                    series: [
                        {
                            type: 'gauge',
                            startAngle: 180,
                            endAngle: 0,
                            min: 0,
                            max: 10,
                            splitNumber: 8,
                            axisLine: {
                                formatter: function(v){
                                    return v.toFixed(0);
                                },
                                lineStyle: {
                                    width: 5,
                                    color: [
                                        [0.25, '#7CFFB2'],
                                        [0.5, '#58D9F9'],
                                        [0.75, '#FDDD60'],
                                        [1, '#FF6E76'],


                                    ],

                                },


                            },
                            pointer: {
                                icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                                length: '12%',
                                width: 10,
                                offsetCenter: [0, '-55%'],
                                itemStyle: {
                                    color: 'auto'
                                }
                            },
                            axisTick: {
                                length: 12,
                                lineStyle: {
                                    color: 'auto',
                                    width: 2
                                }
                            },
                            splitLine: {
                                length: 20,
                                lineStyle: {
                                    color: 'auto',
                                    width: 3
                                }
                            },
                            axisLabel: {
                                color: '#ffffff',
                                fontSize: 15,
                                distance: -60,
                                formatter: function (value) {
                                    if (value === 8.75) {
                                        return '严重';
                                    } else if (value === 6.25) {
                                        return '正常';
                                    } else if (value === 3.75) {
                                        return '良好';
                                    } else if (value === 1.25) {
                                        return '优秀';
                                    }
                                    return '';
                                }
                            },
                            title: {
                                offsetCenter: [0, '-10%'],
                                fontSize: 25,
                                color:'white'
                            },
                            detail: {
                                fontSize: 15,
                                offsetCenter: [0, '-40%'],
                                valueAnimation: true,
                                formatter: function (val) {
                                    //解决刻度的值为浮点数问题
                                    return val.toFixed(2);
                                },
                                color: 'auto'
                            },
                            data: [
                                {
                                    value: Number(this.dashboardNewData.WQI).toFixed(3),
                                    name: 'WQI指数'
                                }
                            ]
                        }
                    ]
                };
                WPIDashboard.setOption(option)
            },
        }
    }
</script>

<style scoped>
    .WPIDashboard{
        width: 65%;
        height: 120%;

    }
</style>