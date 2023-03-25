<template>
    <div class="inversionLegend">

        <transition name="el-fade-in" v-show="isChA">
            <div :class='[true? "lake-legend-container":"lake-legend-container-hide"]'>
                <div class="exLegendContain">
                    <span style="float: right;cursor: pointer;font-size: 30px;margin-right: 10px"  @click="isChA=!isChA">×</span>
                    <span style="font-size: 18px;line-height: 40px;font-weight: bold">叶绿素a浓度</span>

                    <div style="display: inline-block;" v-for="(item,index) in legendInf" class="legendItem" >
                        <div class="colorLegend" :style="{'background-color':item.color}" @click="waterLegendChange(item,index)">
                        </div>
                        <span>{{ item.type }}</span>
                    </div>
                </div>
            </div>
        </transition>

    </div>
</template>

<script>
    export default {
        name: "inversionLegend",
        data(){
            return{

                isChA:true,
                legendInf:[
                    {
                        isShow:true,
                        type:'0<Cha浓度<10',
                        color:'rgba(68,116,181,1)',
                        recolor:'rgba(68,116,181,1)',

                        layerFeature:[],
                        layer:null
                    },
                    {
                        isShow:true,
                        type:'10<=Cha浓度<13',
                        color:'rgba(255,255,191,1)',
                        recolor:'rgba(255,255,191,1)',
                        extend:{
                            min:0.00005,
                            max:0.001,
                            width: 2
                        },
                        layerFeature:[],
                        layer:null
                    },

                    {
                        isShow:true,
                        type:'13<=Cha浓度<15',
                        color:'rgba(255,225,145,1)',
                        recolor:'rgba(255,225,145,1)',
                        extend:{
                            min:0.00005,
                            max:0.001,
                            width: 2
                        },
                        layerFeature:[],
                        layer:null
                    },
                    {
                        isShow:true,
                        type:'15<=Cha浓度<18',
                        color:'rgba(253,141,88,1)',
                        recolor:'rgba(253,141,88,1)',
                        extend:{
                            min:0.00005,
                            max:0.001,
                            width: 2
                        },
                        layerFeature:[],
                        layer:null
                    },
                    {
                        isShow:true,
                        type:'Cha浓度>=18',
                        color:'rgba(215,48,38,1)',
                        recolor:'rgba(215,48,38,1)',

                        layerFeature:[],
                        layer:null
                    },
                ],
            }
        },
        methods:{
            //反演图例改变事件 对应修改图层可视性
            waterLegendChange(item,index){
                console.log(index)

                if(item.isShow){
                    item.color='rgba(105,105,105,0.8)'
                    item.isShow = false
                    this.$emit('removeChALayer',index)
                }else{
                    item.color=item.recolor
                    item.isShow = true
                    this.$emit('addSingleChALayer',index)
                }
            },
        },
        computed:{

            getShowChAState(){
                return this.$store.state.spaceTimeFlag.isChA
            },

        },
        watch:{

            getShowChAState(newV,oldV){
                console.log(newV)
                this.isChA = newV

            },
        },
    }
</script>

<style scoped>
    .inversionLegend{
        width: 200px;
        height: 200px;

        z-index: 9;
        position: relative;
        left: 11%;
    }
    .exLegendContain{
        padding: 0px;
        text-align: left;

        border-radius: 10px;
        padding-left: 10%;
        padding-bottom: 5%;
        background: rgba(255, 255, 255, 0.6);
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

    }
    .colorLegend{
        display: inline-block;
        border-radius: 5px;
        margin-right: 5px;
        width: 30px;
        height: 20px;
        cursor: pointer;
        transition-duration: 0.3s;
        border: #cccccc 3px ;
    }
    .colorLegend:hover{
        transform: scale(1.1);
    }
    .lake-legend-container {
        width: 100%;
        height: 100%;
        background-color: rgba(255,255,255,0);
        display: inline-block;
        transition: 0.5s;
        border-radius: 10px;
    }
    .lake-legend-container-hide {
        width: 0px;
        height: 100%;
        background-color: rgba(255,255,255,1);
        display: inline-block;
        transition: 0.5s;
        border-radius: 10px;
        overflow: hidden;
    }
</style>