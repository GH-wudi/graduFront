<template>
    <div class="wordCloud">

    </div>
</template>

<script>
    import * as echarts from 'echarts'
    import "echarts-wordcloud/dist/echarts-wordcloud";
    import "echarts-wordcloud/dist/echarts-wordcloud.min"
    export default {
        name: "worldCloud",
        data(){
            return{
                //定义需要展示的词语和数值（数值越大，字体会越大）
                wordData: [{
                    "name": "水体",
                    "value": 1446
                    },
                    {
                        "name": "水体分级",
                        "value": 928
                    },
                    {
                        "name": "黑臭水体",
                        "value": 906
                    },
                    {
                        "name": "工业废水",
                        "value": 825
                    },
                    {
                        "name": "生活废水",
                        "value": 514
                    },
                    {
                        "name": "高锰酸盐指数",
                        "value": 486
                    },
                    {
                        "name": "总氮",
                        "value": 53
                    },
                    {
                        "name": "氨氮",
                        "value": 163
                    },
                    {
                        "name": "总磷",
                        "value": 86
                    },
                    {
                        "name": "PH",
                        "value": 17
                    },
                    {
                        "name": "白洋淀",
                        "value": 6
                    },
                    {
                        "name": "政府治理",
                        "value": 1
                    },
                    {
                        "name": "叶绿素浓度",
                        "value": 1437
                    },

                ],
                image:'data:image/png;base64,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'

            }
        },
        mounted() {
            this.initCharts()
        },
        methods:{
            //定义词云图并插入容器内
            initCharts(){
                let myChart2 = echarts.init(document.querySelector('.wordCloud'));
                let dou_live_word_result = this.wordData
                let maskImage = new Image(); //可以根据图片形状生成有形状的词云图
                maskImage.src= this.image
                var option = {
                    tooltip: {},
                    title: {
                        text: '水环境监测词云图',
                        textStyle: {
                            color: '#ffffff'
                        }
                    },
                    series: [ {
                        type: 'wordCloud',
                        gridSize: 2,
                        sizeRange: [12, 55],
                        rotationRange: [-90, 90],



                        textStyle: {
                            color:function () {
                                return 'rgb(' + [
                                    Math.round(Math.random() * 155+100),
                                    Math.round(Math.random() * 155+100),
                                    Math.round(Math.random() * 155+100)
                                ].join(',')+')'}

                        },
                        emphasis: {
                            textStyle: {
                                shadowBlur: 10,
                                shadowColor: '#333'
                            }
                        },
                        data: this.wordData
                    } ]
                };
                myChart2.setOption(option)
            }

        }
    }
</script>

<style scoped>
    .wordCloud{
        height: 100%;
        width: 100%;

    }
</style>