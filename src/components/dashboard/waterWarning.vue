<template>
    <div class="waterWarning">
        <dv-border-box-8 style="background-color: rgba(255,255,255,.25);;display: flex">
            <div style="display: inline-block">
                <img :src="alarm" class="waterAlarm">
            </div>
            <marqueeLeft :sendVal='newItems' style="width: 290px;float: right;margin-right: 10px"></marqueeLeft >
        </dv-border-box-8>
    </div>
</template>

<script>
    import alarm from '../../assets/img/alarmWarning.svg'
    import marqueeLeft from './waterAlarming'
    import request from "../../utils/request.js"

    export default {
        name: "waterWarning",
        data(){
            return {
                tableHeight:0,
                map:null,
                alarm:alarm,
                animate: false,
                newItems:[
                    {name: '张三', detail: '本月水位站统计次数：3241次'},
                    {name: '张三', detail: '超标断面个数:512个'},
                    {name: '张三', detail: '注意保定市拒马河区域附近污染可能超标！'}
                ],
            }
        },
        components:{
            marqueeLeft
        },
        mounted(){

        },
        created:function () {
             request.get('waterenv-monitor/auto/data/inform',{
                
            }).then( res => {
                console.log(res);
                console.log(this.newItems)
                this.newItems[0].detail = '本月水位站统计次数：'+(res.data.total)+'次'
                this.newItems[1].detail = '超标断面个数:'+res.data.overNumber+'个'
                this.newItems[2].detail = '注意'+res.data.willOverPlace+'区域附近污染可能超标！'
                setInterval(this.showMarquee, 2000)

            })
        },
        methods: {
            showMarquee: function () {
                this.animate = true;
                setTimeout(()=>{
                    // this.marqueeList.push(this.marqueeList[0]);
                    // this.marqueeList.shift();
                    this.animate = false;
                },500)},


        },


    }
</script>

<style lang="scss">
    .waterWarning{
        width: 350px;
        height: 40px;
        position: absolute;
        z-index: 99;
        margin: 0 auto;
        left: 38.5%;
        display: inline-block;
        .waterAlarm{
            height: 25px;
            margin-top: 10px;
            margin-left: 18px;
        }

    }
</style>