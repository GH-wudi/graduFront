<template>
    <div class="right-bar" >

        <div class="analysis-type" @mouseover="btnColor.waterChA.flag = false"  @mouseout="btnColor.waterChA.flag = true" @click="rightBtnChange('waterChA')">
            <img :src="(btnColor.waterChA.flag && btnColor.waterChA.clickFlag)? btnColor.waterChA.waterChA : btnColor.waterChA.lightWaterChA" alt="">
            <span style="font-size: 8px;" :class="[(btnColor.waterChA.flag && btnColor.waterChA.clickFlag) ? 'span-color-hide': 'span-color-show']">叶绿素a浓度反演</span>
        </div>
        <!-- <div class="analysis-type" @mouseover="btnColor.waterCOD.flag = false"  @mouseout="btnColor.waterCOD.flag = true" @click="rightBtnChange('waterCOD')">
            <img :src="(btnColor.waterCOD.flag && btnColor.waterCOD.clickFlag)? btnColor.waterCOD.waterCODicon : btnColor.waterCOD.lightWaterCOD" alt="">
            <span style="font-size: 8px;" :class="[(btnColor.waterCOD.flag && btnColor.waterCOD.clickFlag) ? 'span-color-hide': 'span-color-show']">COD浓度反演</span>
        </div> -->
        <!-- <div class="analysis-type" @mouseover="btnColor.waterEutrophication.flag = false"  @mouseout="btnColor.waterEutrophication.flag = true" @click="rightBtnChange('waterEutrophication')">
            <img :src="(btnColor.waterEutrophication.flag && btnColor.waterEutrophication.clickFlag)? btnColor.waterEutrophication.waterEutrophicationicon : btnColor.waterEutrophication.lightWaterEutrophicationicon" alt="">
            <span style="font-size: 8px;" :class="[(btnColor.waterEutrophication.flag && btnColor.waterEutrophication.clickFlag) ? 'span-color-hide': 'span-color-show']">水体富营养化</span> -->
        <!-- </div> -->

    </div>
</template>

<script>
    import waterArea from "../../assets/icon/waterArea.svg";
    import lightWaterArea from "../../assets/icon/lightWaterArea.svg";
    import waterChA from "../../assets/icon/waterChA.svg";
    import lightWaterChA from "../../assets/icon/lightWaterChA.svg";
    import waterCODicon from "../../assets/icon/COD.svg";
    import lightWaterCOD from "../../assets/icon/lightCOD.svg";
    import waterEutrophicationicon from "../../assets/icon/waterEutrophication.svg";
    import lightWaterEutrophicationicon from "../../assets/icon/lightWaterEutrophication.svg";

    export default {
        name: "waterReciprocal-rightBar",
        data(){
            return{
                btnColor: {

                    waterChA: {
                        waterChA,
                        lightWaterChA,
                        flag: true,
                        clickFlag: false
                    },
                    waterCOD: {
                        waterCODicon,
                        lightWaterCOD,
                        flag: true,
                        clickFlag: true
                    },
                    waterEutrophication: {
                        waterEutrophicationicon,
                        lightWaterEutrophicationicon,
                        flag: true,
                        clickFlag: true
                    },
                },
            }
        },
        methods:{
            //点击当前面积按钮
            clickedArea(){

            },
            //点击按钮改变颜色
            rightBtnChange(name) {
                const _that = this
                if(name == 'waterChA'){

                    this.$store.state.spaceTimeFlag.isCOD = false
                    this.$store.state.spaceTimeFlag.isWater = false
                    this.$store.state.spaceTimeFlag.isChA=true
                }else if(name == 'waterCOD'){

                    this.$store.state.spaceTimeFlag.isCOD = true
                    this.$store.state.spaceTimeFlag.isWater = false
                    this.$store.state.spaceTimeFlag.isChA=false

                }else if(name == 'waterEutrophication'){
                    this.$store.state.spaceTimeFlag.isCOD = false
                    this.$store.state.spaceTimeFlag.isWater = true
                    this.$store.state.spaceTimeFlag.isChA=false
                }
                for(let key in this.btnColor) {
                    this.btnColor[key].clickFlag = true
                }
                this.btnColor[name].clickFlag = false
            },
        }
    }
</script>

<style lang="scss">
    .right-bar {
        position: absolute;
        right: 0px;
        height: 100%;
        width: 40px;
        background-color: #000;
        cursor: pointer;
        .analysis-type {
            width: 100%;
            height: 18%;
            box-sizing: border-box;
            padding: 90% 0;
            text-align: center;
        }
        img {
            padding: 0 2px;
            width: 100%;
            height: 100%;
        }
        span {
            font-size: 12px;
            padding: 0 8px;
            display: inline-block;
        }
        .span-color-show {
            color: #0fe7ff;
        }
        .span-color-hide {
            color: #fff;
        }
    }
</style>