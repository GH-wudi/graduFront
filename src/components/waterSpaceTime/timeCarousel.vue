<template>
    <dv-border-box-12 class="warpperSwiperBox" style="overflow: hidden">

        <div class="outSwiperBox">
            <swiper
                    ref="{swiperRef}"
                    :slidesPerView="5"
                    :centeredSlides="true"
                    :spaceBetween="30"
                    :initialSlide="2"
                    :navigation="true"
                    :modules="modules"
                    class="inSwiperBox"
                    @slideChange="onSlideChange"
                    @swiper="onSwiper"
                    @click="handleSwiper"
                    :zoom="false"
            >
                <swiper-slide v-for='(item,key) in imgList' ref="swiperRe">
                    <div style="height: 84%;width: 100%;overflow: hidden">
                        <img class="imgResult" :src='item.imgUrl' alt="" style="height: 150px;width: 100%;position:relative;top: 12px;overflow: hidden" >
                    </div>

                    <span class="imgResultTime">{{item.receiveTime}}</span>

                </swiper-slide>


            </swiper>
        </div>
    </dv-border-box-12>




</template>

<script>
    // Import Swiper Vue.js components
    import { Swiper, SwiperSlide } from "swiper/vue/swiper-vue";
    import { EffectFade } from 'swiper';
    // Import Swiper styles
    import "swiper/swiper.min.css";

    import "swiper/modules/navigation/navigation.min.css";
    import "swiper/modules/pagination/pagination.min.css";



    // import required modules
    import { Pagination, Navigation } from "swiper";
    import request from "../../utils/request";

    export default {
        name: "timeCarousel",
        components: {
            Swiper,
            SwiperSlide,
        },
        data() {
            return {
                imgList:[
                ],
                imgTimer:null,
                currentIndex:0,
            }
        },

        created() {
            this.getTimeImg()

        },
        mounted() {


        },
        watch:{
            currentIndex(){

                if(this.currentIndex>document.getElementsByClassName('swiper-slide').length){
                    this.beforeDestroy()
                }
                this.$emit('getCurrentIndex',this.currentIndex)
            },
            $route(to,from){
                //清除定时器

                this.beforeDestroy()
            }

        },
        methods:{
            beforeDestroy() {
                if (this.imgTimer) {
                    clearInterval(this.imgTimer);
                    this.imgTimer = null;
                }

            },
            setAutoPlay: function () {
                this.imgTimer = null
                this.nextImgShow();
                this.imgTimer = setInterval(() => {

                    this.nextImgShow();
                }, 2500); // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。


            },

            nextImgShow(){
                this.$nextTick(() => {
                    if(document.getElementsByClassName('swiper-slide').length>0){
                        //当前活跃状态的序号
                        if(this.currentIndex<document.getElementsByClassName('swiper-slide').length){
                            //消除所有活跃状态
                            for(let i=0;i<document.getElementsByClassName('swiper-slide').length;i++){

                                document.getElementsByClassName('swiper-slide')[i].classList.remove('slide-active')
                                document.getElementsByClassName('imgResultTime')[i].classList.remove('active')
                            }
                            this.$emit('removeWaterResultYear')
                            this.$emit('addWaterLayer',this.imgList[this.currentIndex].rsImage,this.imgList[this.currentIndex].resultData.iserverMap,this.imgList[this.currentIndex])
                            if(this.useSwiper.swiper.activeIndex==this.currentIndex-3){
                                this.useSwiper.swiper.slideNext()
                                document.getElementsByClassName('imgResultTime')[this.currentIndex].classList.add('active')
                                document.getElementsByClassName('swiper-slide')[this.currentIndex].classList.add('slide-active')
                            }
                            document.getElementsByClassName('imgResultTime')[this.currentIndex].classList.add('active')
                            document.getElementsByClassName('swiper-slide')[this.currentIndex].classList.add('slide-active')
                            this.currentIndex++
                        }
                    }



                })

            },
            getTimeImg(){
                request.get('waterenv-system/getWater/bai').then(res=>{
                    this.imgList =res.data

                    for(let i=0;i<this.imgList.length;i++){
                        //设置分辨率较高的缩略图
                        this.imgList[i].imgUrl = this.imgList[i].rsImageUrl+'?width=1000&height=800'

                    }
                })
            },
            handleSwiper(s){
                this.currentIndex = s.clickedIndex
                console.log(s.clickedIndex)
                console.log(s.activeIndex)
                this.$nextTick(() => {
                    //取消已活跃的状态
                    if(document.getElementsByClassName('swiper-slide')[this.currentIndex].classList.contains('slide-active')){
                        this.$emit('removeWaterResultYear')
                        document.getElementsByClassName('swiper-slide')[this.currentIndex].classList.remove('slide-active')
                        document.getElementsByClassName('imgResultTime')[this.currentIndex].classList.remove('active')
                        return
                    }
                    //当前未存在活跃状态
                    for(let i=0;i<document.getElementsByClassName('swiper-slide').length;i++){
                        document.getElementsByClassName('swiper-slide')[i].classList.remove('slide-active')
                        document.getElementsByClassName('imgResultTime')[i].classList.remove('active')
                    }
                    this.$emit('removeWaterResultYear')

                    //当前赋予活跃状态
                    document.getElementsByClassName('swiper-slide')[this.currentIndex].classList.add('slide-active')
                    document.getElementsByClassName('imgResultTime')[this.currentIndex].classList.add('active')
                    this.$emit('addWaterLayer',this.imgList[this.currentIndex].rsImage,this.imgList[this.currentIndex].resultData.iserverMap,this.imgList[this.currentIndex])
                })

            },
            onSlideChange (s){
                if(s.activeIndex<2)
                    s.slideTo(2)
                /*else if(s.activeIndex>this.imgList.length-1){
                    console.log('g')
                    s.slideTo(5)
                }*/

            }
        },
        setup() {
            const useSwiper = () => { };
            const onSwiper = (swiper) => {
                useSwiper.prototype.swiper = swiper
            };


            return {
                onSwiper,
                EffectFade,
                useSwiper: new useSwiper(),
                modules: [Navigation, Pagination],
            };
        },
    }
</script>

<style scoped>
    .warpperSwiperBox{


        height: 25%;
        width: 80%;

        overflow: hidden;
        border-radius: 10px;
        background-color: rgba(255,255,250,.2);
        margin-bottom: 10px;
    }
    .outSwiperBox{
        height: 85%;
        margin-top: 17px;
        margin-left: 30px;
        margin-right: 30px;

    }
    .inSwiperBox{
        width: 100%;
        height: 100%;
        bottom: 0;

    }
    .swiper-slide {
        height: 110%;
        border-radius: 10px;
        font-size: 30px;
        position: relative;
        bottom: 17%;
        text-align: center;
        background-color: transparent;
        overflow: hidden;
        cursor: pointer;
        transition: all 1s;

    }
    .swiper-slide.slide-active{
        transform: scale(1.2);
        z-index: 2;
        border: #d73027 1px ;
    }
    .swiper-slide .imgResultTime {
        width: 100%;
        font-size: 18px;
        color: white;
        position: relative;
        bottom:5%
    }
    .imgResultTime.active{
        color: #f46d43;
    }
    .imgResult{
        border-radius: 5px;
    }
</style>