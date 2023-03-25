<template>
    <div class="resultCarousel">
        <span class="waterCarouselTitle">叶绿素时空变化数据</span>
        <!-- 加上if判断没数据不显示就好了 -->

        <el-carousel :interval="4000"  type="card" :height="bannerHight+'px'" style="margin-left: 5%;margin-right: 5%" v-if="urlList && urlList[0]">
            <el-carousel-item v-for="item  in urlList" :key="item " :initial-index="initialIndex">

                <img :src="item" alt="" style="height: 100%;width: 100%">

            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
    import request from "../../utils/request";

    export default {
        name: "resultCarousel",
        data(){
            return{
                screenWidth :0,
                bannerHight:168,
                urlList:[],
                initialIndex:2
            }
        },
        mounted() {
            this.screenWidth =window.innerWidth
            window.onresize=() =>{
                this.screenWidth = window.innerWidth
                this.setSize()
            }
            this.getResultImgUrl()
        },
        methods:{
            getResultImgUrl(){
                request.get('http://121.4.131.9:9000/waterenv-system/other/chla').then(res=>{
                    this.urlList =res.data
                    this.urlList.pop()
                    this.urlList.pop()
                    this.urlList.pop()
                    console.log(this.urlList)
                })
            },
            setSize(){
                this.bannerHight = 210/1920*this.screenWidth
                console.log(this.bannerHight )
            },
        },
    }
</script>
<style>
    .resultCarousel{
        width: 100%;
        height: 100%;

        margin: 0;

    }
    .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
    }
</style>
<style lang="scss" scoped>
    .resultCarousel{
        color: white;
        padding-top: 2%;
        .waterCarouselTitle{
            font-size: 18px;
            font-weight: bold;

            margin-left: 3%;
            line-height: 30px;

        }
    }
</style>