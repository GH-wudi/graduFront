<template>
    <div id="intelligenceDis" style="width: 100%;height: 100%;position: relative;">
        <quality v-if="!this.btnColor.quality.clickFlag"></quality>
        <rubbish v-if="!this.btnColor.rubbish.clickFlag"></rubbish>
        <semly v-if="!this.btnColor.black.clickFlag"></semly>
        <div class="right-barInt">
            <div class="analysis-type"  @mouseover="btnColor.quality.flag = false"  @mouseout="btnColor.quality.flag = true" @click="rightBtnChange('quality')">
                <img :src="(btnColor.quality.flag && btnColor.quality.clickFlag)? btnColor.quality.qualityInt : btnColor.quality.lightQualityInt" alt="">
                <span style="font-size: 8px;" :class="[(btnColor.quality.flag && btnColor.quality.clickFlag) ? 'span-color-hide': 'span-color-show']">水色识别</span>
            </div>
           <!--  <div class="analysis-type" @mouseover="btnColor.rubbish.flag = false"  @mouseout="btnColor.rubbish.flag = true" @click="rightBtnChange('rubbish')">
                 <img :src="(btnColor.rubbish.flag && btnColor.rubbish.clickFlag)? btnColor.rubbish.rubbishInt : btnColor.rubbish.lightRubbishInt" alt="">
                <span style="font-size: 8px;" :class="[(btnColor.rubbish.flag && btnColor.rubbish.clickFlag) ? 'span-color-hide': 'span-color-show']">垃圾识别</span>
            </div> -->
            <div class="analysis-type" @mouseover="btnColor.black.flag = false"  @mouseout="btnColor.black.flag = true" @click="rightBtnChange('black')">
                 <img :src="(btnColor.black.flag && btnColor.black.clickFlag)? btnColor.black.semlyInt : btnColor.black.lightSemlyInt" alt="">
                <span style="font-size: 8px;" :class="[(btnColor.black.flag && btnColor.black.clickFlag) ? 'span-color-hide': 'span-color-show']">黑臭水体提取</span>
            </div>
        </div>
        
    </div>
</template>

<script>
import qualityInt from "../assets/icon/qualityInt.svg"
import lightQualityInt from "../assets/icon/lightQualityInt.svg"
import rubbishInt from "../assets/icon/rubbishInt.svg"
import lightRubbishInt from "../assets/icon/lightRubbishInt.svg"
import semlyInt from "../assets/icon/semlyInt.svg"
import lightSemlyInt from "../assets/icon/lightSemlyInt.svg"
import Quality from "../components/IntelligenceDis/Quality"
import Rubbish from "../components/IntelligenceDis/Rubbish"
import Semly from "../components/IntelligenceDis/Semly"

export default {
    name: 'intelligenceDis',
    data() {
        return {
            btnColor: {
                quality: {
                    qualityInt,
                    lightQualityInt,
                    flag: true,
                    clickFlag: false
                },
                rubbish: {
                    rubbishInt,
                    lightRubbishInt,
                    flag: true,
                    clickFlag: true
                },
                black: {
                    semlyInt,
                    lightSemlyInt,
                    flag:true,
                    clickFlag:true
                }
            }
        }
    },
    components: {
        Quality,
        Rubbish,
        Semly
    },
    created() {

    },
    mounted() {

    },
    methods: {
        //点击按钮改变颜色
        rightBtnChange(name) {
            for(let key in this.btnColor) {
                this.btnColor[key].clickFlag = true
            }
            this.btnColor[name].clickFlag = false
        },
    }
}
</script>

<style lang="scss" scoped>
#intelligenceDis {
     .right-barInt {
        position: absolute;
        right: 0px;
        height: 100%;
        width: 40px;
        background-color: #000;
        cursor: pointer;
        .analysis-type {
            width: 100%;
            box-sizing: border-box;
            padding: 60% 0;
        }
        img {
            padding: 0 4px;
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
}
</style>

