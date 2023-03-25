<template>
    <div class="right-bar" >


        <div class="analysis-type" @mouseover="btnColor.waterExtract.flag = false"  @mouseout="btnColor.waterExtract.flag = true" @click="rightBtnChange('waterExtract')">
            <img :src="(btnColor.waterExtract.flag && btnColor.waterExtract.clickFlag)? btnColor.waterExtract.waterExtracticon : btnColor.waterExtract.lightWaterExtracticon" alt="">
            <span style="font-size: 8px;" :class="[(btnColor.waterExtract.flag && btnColor.waterExtract.clickFlag) ? 'span-color-hide': 'span-color-show']">水体面积提取</span>
        </div>
        <div class="analysis-type" @mouseover="btnColor.waterArea.flag = false"  @mouseout="btnColor.waterArea.flag = true" @click="rightBtnChange('waterArea')">
            <img :src="(btnColor.waterArea.flag && btnColor.waterArea.clickFlag)? btnColor.waterArea.waterArea : btnColor.waterArea.lightWaterArea" alt="">
            <span style="font-size: 8px;" :class="[(btnColor.waterArea.flag && btnColor.waterArea.clickFlag) ? 'span-color-hide': 'span-color-show']" >水域动态演变</span>
        </div>
        <!--<div class="analysis-type" @mouseover="btnColor.waterEutrophication.flag = false"  @mouseout="btnColor.waterEutrophication.flag = true" @click="rightBtnChange('waterEutrophication')">
            <img :src="(btnColor.waterEutrophication.flag && btnColor.waterEutrophication.clickFlag)? btnColor.waterEutrophication.waterEutrophicationicon : btnColor.waterEutrophication.lightWaterEutrophicationicon" alt="">
            <span style="font-size: 8px;" :class="[(btnColor.waterEutrophication.flag && btnColor.waterEutrophication.clickFlag) ? 'span-color-hide': 'span-color-show']">水体富营养化</span>
        </div>-->
        <div class="analysis-type"></div>
        <div class="analysis-type"></div>
    </div>
</template>

<script>
    //引用图片
    import waterArea from "../../assets/icon/waterArea.svg"
    import lightWaterArea from "../../assets/icon/lightWaterArea.svg"
    import waterChA from "../../assets/icon/waterChA.svg"
    import lightWaterChA from "../../assets/icon/lightWaterChA.svg"
    import waterCODicon from "../../assets/icon/COD.svg";
    import lightWaterCOD from "../../assets/icon/lightCOD.svg";
    import waterEutrophicationicon from "../../assets/icon/waterEutrophication.svg"
    import lightWaterEutrophicationicon from "../../assets/icon/lightWaterEutrophication.svg"
    import waterExtracticon from "../../assets/icon/waterExtract.svg"
    import lightWaterExtracticon from "../../assets/icon/lightWaterExtract.svg"
    export default {
        name: "waterSpace-rightBar",
        data(){
            return{
                btnColor: {
                    waterArea: {
                        waterArea,
                        lightWaterArea,
                        flag: true,
                        clickFlag: true
                    },
                    waterChA: {
                        waterChA,
                        lightWaterChA,
                        flag: true,
                        clickFlag: true
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
                    waterExtract: {
                        waterExtracticon,
                        lightWaterExtracticon,
                        flag: true,
                        clickFlag: false
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
                if(name == 'waterArea'){
                    this.$store.state.spaceTimeFlag.isArea = true
                    this.$store.state.spaceTimeFlag.isCOD = false
                    this.$store.state.spaceTimeFlag.isWater = false
                    this.$store.state.spaceTimeFlag.isChA=false
                    this.$store.state.spaceTimeFlag.isExtract = false

                }else if(name == 'waterExtract'){
                    this.$store.state.spaceTimeFlag.isArea = false
                    this.$store.state.spaceTimeFlag.isCOD = false
                    this.$store.state.spaceTimeFlag.isExtract = true
                    this.$store.state.spaceTimeFlag.isChA=false
                    this.$store.state.spaceTimeFlag.isWater = false
                }
                else if(name == 'waterEutrophication'){
                    this.$store.state.spaceTimeFlag.isArea = false
                    this.$store.state.spaceTimeFlag.isWater = true
                    this.$store.state.spaceTimeFlag.isExtract = false
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
            height: 20%;
            width: 100%;
            box-sizing: border-box;
            padding: 78% 0;
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