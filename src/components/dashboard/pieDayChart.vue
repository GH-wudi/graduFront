<template>
    <div class="pieChart"></div>
</template>

<script>
    import * as echarts from 'echarts'
    import request from "../../utils/request";
    export default {
        name: "pieDayChart",
        data(){
            return{
                pieDayChartData:null
            }
        },
        mounted() {

            this.getPieChartDay()
        },
        methods:{
            getPieChartDay(){
                request.get('waterenv-monitor/auto/data/area/stat',{
                    params:{
                        province:'河北省'
                    }
                }).then(res=>{


                    console.log(res.data.stat)
                    this.pieDayChartData = res.data.stat
                    this.createPieChart()
                })
            },
            createPieChart(){
                let pieChart = echarts.init(document.querySelector('.pieChart'))
                const option = {
                    tooltip: {
                        trigger: 'item'
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        },
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    color:['lightblue', 'dodgerblue', 'lightgreen','#FFD700','lightsalmon','red'],
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        align:'left',
                        y:'bottom',
                        textStyle: {
                            color: '#ffffff'
                        },
                        itemWidth:20,

                    },
                    title: {

                        text: '水质等级统计日表',
                        textStyle: {
                            color: '#ffffff'
                        }
                    },
                    series: [
                        {
                            formatter: function (params) {
                                if (params.value > 0) {
                                    return params.value;
                                } else {
                                    return 0;
                                }
                            },
                            name: '水质等级断面数',
                            type: 'pie',
                            radius: ['40%', '70%'],
                            center: ["58%", "58%"],

                            itemStyle: {
                                borderRadius: 3,
                                borderColor: '#fff',
                                borderWidth: 1
                            },
                            label: {

                                normal:{
                                    formatter:function(e){
                                        let data=e.data;
                                        if(data.value==0){
                                            return ''
                                        }else{
                                            console.log('data',data)
                                            return  `${data.name}\n\r( ${e.percent}% )`
                                        }
                                    },
                                    show: true,
                                    textStyle: {
                                        color: '#ffffff',
                                        fontSize:'10px'
                                    }
                                } ,
                                position:'center',

                            },
                            emphasis: {
                                labelLine: {
                                    show: true,
                                },
                            },
                            labelLine: {
                                normal: {

                                    length: 30, //第一条线
                                    length: 10, //第二条线

                                },


                            },
                            data: [
                                { value: this.pieDayChartData['Ⅰ类']==0?null: this.pieDayChartData['Ⅰ类'] , name: 'Ⅰ级水体' },
                                { value: this.pieDayChartData['Ⅱ类']==0?null: this.pieDayChartData['Ⅱ类'] , name: 'Ⅱ级水体' },
                                { value: this.pieDayChartData['Ⅲ类']==0?null: this.pieDayChartData['Ⅲ类'] , name: 'Ⅲ级水体' },
                                { value: this.pieDayChartData['Ⅳ类']==0?null: this.pieDayChartData['Ⅳ类'] , name: 'Ⅳ级水体' },
                                { value: this.pieDayChartData['Ⅴ类']==0?null: this.pieDayChartData['Ⅴ类'] , name: 'Ⅴ级水体' },
                                { value: this.pieDayChartData['劣Ⅴ类']==0?null:this.pieDayChartData['劣Ⅴ类'] , name: '劣Ⅴ级水体' },


                            ]
                        }
                    ]
                };
                pieChart.setOption(option)
            }
        },
    }
</script>

<style scoped>
    .pieChart{
        width:  97%;
        height: 95%;

    }
</style>