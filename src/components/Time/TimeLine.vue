<template>
    <!--时间线-->
    <div id="timeLine" class="timeLine" style="overflow: hidden;">
        <div class="time-container">
                <div class="transmit" >
                    <img style="width: 22px;height: 22px;" :src="transmit? stop:start" alt="" @click="timerTransmit">
                </div>
                <div class="ul_box">
                    
                    <ul class="my_timeline" ref="mytimeline" >
                        <li class="my_timeline_item" v-for="(item,index) in timeLineList" :key="index">
                            <!--圈圈节点-->
                            <div class="my_timeline_node" :style = " {backgroundColor: item.bgcolor, width: item.size + 'px', height: item.size + 'px'}" @click="changeActive(index)" :class="{active: index == timeIndex}"></div>
                            <!--线-->
                            <div v-if="index !== mounthLength" class="my_timeline_item_line"></div>
                            <!--标注-->
                            <div class="my_timeline_item_content" :style="{color: item.color, fontSize: item.fontsize + 'px'}" :class="{activeText: index == timeIndex}">
                                {{item.timestamp}}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        
        <!-- <div class="my_timeline_next" @click="moveRight">
            <img src="../../../static/images/case_detail_right.png" class="my_timeline_node"/>
            <div class="my_timeline_item_content" style="color: rgba(0,0,0,0);">下</div>
        </div> -->
    </div>
</template>
<script>
import start from  '@/assets/icon/start.svg'
import stop from '@/assets/icon/stop.svg'
export default {
    name: 'timeLine',
    props: ['year'],
    data() {
        return {
            start,
            stop,
            timeIndex: 0,
            timeLineList: null,
            timeLineList2: [{
                    timestamp: '1月',
                    color: '#fff',
                    fontsize: 10,
                    size: '14',
                    bgcolor: '#fff'
                },{
                    timestamp: '2月',
                    color: '#fff',
                    fontsize: 10,
                    size: '14',
                    bgcolor: '#fff'
                },{
                    timestamp: '3月',
                    color: '#fff',
                    fontsize: 10,
                    size: '14',
                    bgcolor: '#fff'
                },{
                    timestamp: '4月',
                    color: '#fff',
                    fontsize: 10,
                    size: '14',
                    bgcolor: '#fff'
                },{
                    timestamp: '5月',
                    color: '#fff',
                    fontsize: 10,
                    size: '14',
                    bgcolor: '#fff'
                },{
                    timestamp: '6月',
                    color: '#fff',
                    fontsize: 10,
                    size: '14',
                    bgcolor: '#fff'
                },{
                    timestamp: '7月',
                    color: '#fff',
                    fontsize: 10,
                    size: '14',
                    bgcolor: '#fff'
                },{
                    timestamp: '8月',
                    color: '#fff',
                    fontsize: 10,
                    size: '14',
                    bgcolor: '#fff'
                },{
                    timestamp: '9月',
                    color: '#fff',
                    fontsize: 10,
                    size: '14',
                    bgcolor: '#fff'
                },{
                    timestamp: '10月',
                    color: '#fff',
                    fontsize: 10,
                    size: '14',
                    bgcolor: '#fff'
                },{
                    timestamp: '11月',
                    color: '#fff',
                    fontsize: 10,
                    size: '14',
                    bgcolor: '#fff'
                },{
                    timestamp: '12月',
                    color: '#fff',
                    fontsize: 10,
                    size: '14',
                    bgcolor: '#fff'
                }],
                interval: null,
                transmit: true,
               
                
        }
    },
    created() {
            let date = new Date()
            console.log(this.$store.state.year)
            if(this.$store.state.year == date.getFullYear()) {
                this.timeLineList = []
                for(let i=0;i<date.getMonth();i++) {
                    this.timeLineList.push({
                        timestamp: i+1+'月',
                        color: '#fff',
                        fontsize: 10,
                        size: '14',
                        bgcolor: '#fff'
                    })
                }
                this.mounthLength = date.getMonth() - 1
                if(!this.flag) {
                    this.timeIndex = 0
                    this.flag = true
                }
            }else {
                this.timeLineList = this.timeLineList2
                this.mounthLength = 11
                if(this.flag) {
                    this.timeIndex = 0
                    this.flag = false
                }
            }
        console.log('TimeLine')
		this.interval = setInterval(this.move,2000)
        this.$store.state.interval = this.interval
    },
    mounted() {

    },
    methods: {
        //事件，播放
        timerTransmit() {
            if(this.transmit) {
                clearInterval(this.interval)
            }else{
                this.interval = setInterval(this.move,2000)
            }
            this.transmit = !this.transmit
        },
        changeActive(index) {
            this.timeIndex = index;
            if(this.$store.state.classifyForMounthFun !== null)
            this.$store.commit('useInTimeLineCFMF',this.timeIndex)

        },
        move() {
 
            if(this.timeIndex == this.mounthLength){
                this.timeIndex = -1
            } 
            this.timeIndex++
            if(this.$store.state.classifyForMounthFun !== null)
            this.$store.commit('useInTimeLineWPFM',this.timeIndex)
        }
    },
    beforeDestroy() {
        clearInterval(this.interval)
    }
}
</script>
<style >


.activeText {
    color: rgb(29, 255, 254) !important;
}
.time-container {
    position: absolute;
    left: 366px;
    z-index: 10;
    bottom: 3px;
    margin: 0 auto;
    width: 74%;
    text-align: center;
    border-radius: 21px;
}
.transmit {
    position: absolute;
    top: 5px;
    width: 58px;
    height: 28px;
    line-height: 28px;
    display: inline-block;
    padding-left: 32px;
    padding-right: 3px;
    box-sizing: border-box;
    z-index: 4;
}

.transmit  img {
    width: 22px;
    height: 22px;
    vertical-align:middle;
}
.my_timeline {
    margin: 0px !important;
    padding: 0px !important;
    display: inline-block;
    text-align: left;
} 

.ul_box {
    height: 31px;
    display: inline-block;
    margin-top: 5px;
    overflow: hidden;
    padding-left: 10px;
    z-index: 4;
    margin-left: 58px;
}
.my_timeline_item {
    display: inline-block;
    width: 88px;
}
.my_timeline_item:nth-child(12) {
    width: 30px;
}
.my_timeline_node {
    box-sizing: border-box;
    border-radius: 50%;
    cursor: pointer;
}
.my_timeline_node.active {
    background-color: rgb(14, 12, 105) !important;
    border: 3px solid rgb(29, 255, 254);
    /* border: 3px solid rgb(255, 253, 253); */
   /*  background-color: rgb(29, 255, 254) !important;
    border: 3px solid rgb(0, 0, 0); */
}
.my_timeline_item_line {
    width: 53%;
    height: 7px;
    margin: -10px 0 0 28px;
    border-top: 2px solid #fff;
    border-left: none;
}
.my_timeline_item_content {
    margin: 2px 0 0 -2px;
}
</style>

