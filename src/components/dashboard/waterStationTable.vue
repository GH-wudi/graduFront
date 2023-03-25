<template>
    <div style="width: 100%;height: 100%" class="waterStationItems">
        <span class="waterStationTitle">实时数据</span>
        <br>
        <thead style="width: 100%;height: 10%;display: flex">
            <th colspan="1" rowspan="1" style="width: 18%;height: 100%">
                <div>城市</div>
            </th>
            <th colspan="1" rowspan="1" style="width: 32%;height: 100%">
                <div>河流名称</div>
            </th>
            <th colspan="1" rowspan="1" style="width: 32%;height: 100%">
                <div>检测时间</div>
            </th>
            <th colspan="1" rowspan="1" style="width: 18%;height: 100%">
                <div>水质等级</div>
            </th>
        </thead>
        <vue-seamless-scroll :data="listData" class="warp" :class-option="classOption">
            <ul class="item" style="width: 100%;height: 100%">
                <li v-for="(item, index) in listData" :key="index" style="width: 100%;height: 100%;text-align: center;margin-top: 5px">
                    <span class="title" v-text="item.city" style="width: 18%;height: 100%"></span>
                    <span v-text="item.riverName" style="width: 32%;height: 100%"></span>
                    <span v-text="item.sectionTime" style="width: 32%;height: 100%"></span>
                    <div  style="width: 18%;height: 100%;text-align: center">
                        <div :class="item.className">
                            <span v-text="item.waterLevel" >
                            </span>
                        </div>



                    </div>

                </li>
            </ul>
        </vue-seamless-scroll>
        <tbody class="item">

        </tbody>

    </div>

</template>



<script>
    import request from "../../utils/request";

    export default {
        name: "waterStationTable",
        components: {

        },
        data () {
            return {
                listData: [{
                    'title': '廊坊市11',
                    'sectionName':'三河站点11',
                    'sectionTime': '2017-12-16',
                    'waterLevel':'Ⅰ',
                    'className':'firstWaterBody-row'
                }, {
                    'city': '廊坊市',
                    'sectionName':'三河站点',
                    'sectionTime': '2017-12-16',
                    'waterLevel':'Ⅰ'
                },{
                    'title': '廊坊市',
                    'sectionName':'三河站点',
                    'sectionTime': '2017-12-16',
                    'waterLevel':'Ⅰ'
                },{
                    'title': '廊坊市',
                    'sectionName':'三河站点',
                    'sectionTime': '2017-12-16',
                    'waterLevel':'Ⅰ'
                },{
                    'title': '廊坊市',
                    'sectionName':'三河站点',
                    'sectionTime': '2017-12-16',
                    'waterLevel':'Ⅰ'
                },{
                    'title': '廊坊市',
                    'sectionName':'三河站点',
                    'sectionTime': '2017-12-16',
                    'waterLevel':'Ⅰ'
                },{
                    'title': '廊坊市',
                    'sectionName':'三河站点',
                    'sectionTime': '2017-12-16',
                    'waterLevel':'Ⅰ'
                },{
                    'title': '廊坊市',
                    'sectionName':'三河站点',
                    'sectionTime': '2017-12-16',
                    'waterLevel':'Ⅰ'
                },],
                classOption: {
                    step: 0.5
                //    滚动速度
                }
            }
        },
        mounted() {
            this.getSectionData()
        },
        methods:{
            setWaterCss(waterLevel){
                if (waterLevel === 'Ⅰ')  //=>这里可以改成 rowIndex%2=== 1，后面直接else即可达到隔行变色效果。
                {
                    return 'firstWaterBody-row';
                } else if (waterLevel === 'Ⅱ') {
                    return 'secondWaterBody-row';
                } else if (waterLevel === 'Ⅲ') {
                    return 'thirdWaterBody-row';
                }else if (waterLevel === 'Ⅳ') {
                    return 'forthWaterBody-row';
                }else if (waterLevel === 'Ⅴ') {
                    return 'fifthWaterBody-row';
                }else if (waterLevel === '劣Ⅴ') {
                    return 'badWaterBody-row';
                }
            },
            getSectionData(){
                request.get('waterenv-monitor/auto/data/getRear').then(res=>{
                    console.log(res.data.waterData)
                    this.listData = []
                    let resData = res.data.waterData
                    for(let i in resData){
                        let item={}
                        item.city = resData[i].city
                        item.riverName = resData[i].riverName
                        let sectionDay =resData[i].monitorDate.split(' ')[0].split('-')[1]+'-'+resData[i].monitorDate.split(' ')[0].split('-')[2]
                        let sectionTime = resData[i].monitorDate.split(' ')[1].split(':')[0]+':'+resData[i].monitorDate.split(' ')[1].split(':')[1]
                        item.sectionTime =sectionDay+' '+sectionTime
                        item.waterLevel = resData[i].waterQuality
                        item.className = this.setWaterCss(item.waterLevel)
                        this.listData.push(item)
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
<style lang="scss" scoped>
    .waterStationItems{
        color: white;
        .waterStationTitle{
            font-size: 18px;
            font-weight: bold;
            margin-left: 3%;
            line-height: 35px;

        }
    }
    .warp {

        height: 65%;
        width: 100%;
        margin: 0 auto;
        overflow: hidden;
        ul {
            list-style: none;
            padding: 0;
            margin: 0 auto;
            li,
            a {
                display: block;
                height: 30px;
                line-height: 30px;
                display: flex;
                justify-content: space-between;
                font-size: 15px;
            }
        }
        .firstWaterBody-row {
            background: lightblue !important;
            border-radius: 10px;

            margin-right: 10px;
        }
        .secondWaterBody-row {
            background: dodgerblue !important;
            border-radius: 10px;

            margin-right: 10px;
        }
        .thirdWaterBody-row {
            background: lightgreen !important;
            border-radius: 10px;

            margin-right: 10px;
        }
        .forthWaterBody-row {
            background: #FFD700 !important;
            border-radius: 10px;

            margin-right: 10px;
        }
        .fifthWaterBody-row {
            background: lightsalmon !important;
            border-radius: 10px;

            margin-right: 10px;
        }
        .badWaterBody-row {
            background: red !important;
            border-radius: 10px;

            margin-right: 10px;
        }
    }
    .waterLevelBlock{

    }
</style>