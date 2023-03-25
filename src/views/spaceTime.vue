<template>
    <div class="spaceTime"  >
        <div class="spaceContainer" ref="space-container"></div>
        <waterSpaceLeftBar :currentImgInf="currentImgInf" @removeResultLayer="removeResultLayer" @extractWater="extractWater" @setHeBeiProvince="setHeBeiProvince" @removeImageFromLayer="removeImageFromLayer" @handleCheckedChange="handleCheckedChange" @handleCurrentChange="handleCurrentChange" @removeFrameLayer="removeFrameLayer" @handleMouseEnter="handleMouseEnter" @handleMouseOut="handleMouseOut" @searchImageData="searchImageData" @selectedSiteContent="selectedSiteContent" @addEutrophicationRiverLayer="addEutrophicationRiverLayer"  @removeEutrophicationRiverLayer="removeEutrophicationRiverLayer" @removeEutrophicationLayer="removeEutrophicationLayer" @addYyhLayer="addYyhLayer" @addEutrophicationLayer="addEutrophicationLayer" @removeCODLayer="removeCODLayer" @addCODLayer="addCODLayer" @getDangerPoint="getDangerPoint" @removePOILayers="removePOILayers" @removeClassAll="removeClassAll" @removeChAImgLayer="removeChAImgLayer" @addChAImgLayer="addChAImgLayer" @addChALayer="addChALayer" @autoPlayCarousel="autoPlayCarousel" @pausePlayCarousel="pausePlayCarousel" @removeWaterResultLayer="removeWaterResultLayer" @addWaterResultLayer="addWaterResultLayer" @addWaterImgLayer="addWaterImgLayer" @removeWaterImgLayer="removeWaterImgLayer" ref="spaceLeftBar" :currentIndex ='currentIndex'></waterSpaceLeftBar>

<!--        <div id="units" ></div>-->
        <div style="width: 8%"></div>
        <timeCarousel v-show="isArea"    @addWaterLayer="addWaterLayer" @removeWaterResultYear="removeWaterResultYear" @getCurrentIndex="getCurrentIndex" ref="timeCarousel"></timeCarousel>

        <div style="width: 5%;z-index: 200">
<!--            <button @click="addEutrophicationLayer">g</button>-->
        </div>
        <switchMap :map="map" style="position: absolute;left: 25%"></switchMap>
        <mapTool :map="map" ></mapTool>
<!--        <inversionLegend v-show="isChA"  @addSingleChALayer="addSingleChALayer($event)" @removeChALayer="removeChALayer($event)"></inversionLegend>-->

        <waterSpaceRightBar></waterSpaceRightBar>

    </div>
</template>

<script>
    //引入依赖
    import Map from 'ol/Map'
    import View from 'ol/View'
    import TileLayer from 'ol/layer/Tile'
    import {defaults,FullScreen,ScaleLine,ZoomSlider,MousePosition} from 'ol/control'

    import ImageStatic from 'ol/source/ImageStatic';
    import ImageLayer from 'ol/layer/Image'
    import {OSM, ImageArcGISRest,TileWMS,ImageWMS,TileArcGISRest} from 'ol/source';
    import XYZ from 'ol/source/XYZ'
    import Point from 'ol/geom/Point'
    import 'ol/ol.css'
    import { getVectorContext } from "ol/render";
    import {Logo, TileSuperMapRest} from '@supermap/iclient-ol';
    import OverviewMap from 'ol/control/OverviewMap'
    import {Vector as VectorLayer}  from 'ol/layer'
    import VectorSource from 'ol/source/Vector';
    import { fromLonLat, transform, toLonLat ,transformExtent} from "ol/proj";
    import GeoJSON from "ol/format/GeoJSON";
    import {createRegularPolygon,createBox} from 'ol/interaction/Draw'
    import Draw from 'ol/interaction/Draw';
    import Polygon from 'ol/geom/Polygon'
    import Feature from 'ol/Feature'
    import {tile,bbox} from 'ol/loadingstrategy';
    import {Style,Stroke,Fill,Text,Icon,Circle} from 'ol/style';
    import { SuperMap, FeatureService } from '@supermap/iclient-ol';
    //引入组件
    import waterSpaceLeftBar from '../components/waterSpaceTime/waterSpace-leftBar'
    import timeCarousel from "../components/waterSpaceTime/timeCarousel";
    import waterSpaceRightBar from '../components/waterSpaceTime/waterSpace-rightBar'
    import inversionLegend from "../components/waterSpaceTime/inversionLegend";
    import request from "../utils/request";
    import switchMap from "../components/switchMap";
    import mapTool from "../components/mapTool";
    //引入点集
    import highChAPoint from "../assets/json/high_4326"




    export default {
        name: "spaceTime",
        data(){
            return{
                map:null,
                currentImgLayer:null,
                currentResultLayer:null,
                currentImgInf:{

                },
                //水体提取返回数据
                extractResult:{
                    waterBodyNum:0,
                    unWaterBodyNum:0,
                    shapeUrl:''
                },
                ChALayers:{
                    orginal:null,
                    classify_1:null,
                    classify_2:null,
                    classify_3:null,
                    classify_4:null,
                    classify_5:null,
                    POI:null,
                    POIWarning:null,
                },
                CODLayer:null,
                eutrophicationLayer:null,
                eutrophicationRiverLayer:null,
                imageDrawLayer:null,
                imageDraw:null,
                yyhLayer:null,
                isArea:false,
                isExtract:true,
                isChA:false,
                currentIndex:null,
                dangerousPointList:[],
                listData: [],
                temListData: null,
                searchFrameLayer: null,
                curListData: [],
                paginationData: {
                    total: 0,
                    currentPage: 1,
                    pageSize: 3
                },
                imageLayer:null,
                searchFrameLayer:null,
                showFlag:false,
                waterType:'湖库水体',
                resultLayer:null,
                time: '',
                geometry: null,
                searchBtnText: '数据检索',
                imageFrameFea: {},
                algForm:{
                    thumb:true,
                    filename:null,
                    publishSer:true,
                    lakeAlgChoice: "2",
                    espg: "32650",
                    index: '1',
                    satelliteId: "GF2",
                    satelliteIdMini: '珠海一号',
                    threshold: -0.15,
                    classes: 10
                },

            }

        },
        mounted() {
            this.mapRenderer()

            // this.getEutrophicationData()
            this.getRsImageData()
        },
        components:{
            waterSpaceLeftBar,
            timeCarousel,
            waterSpaceRightBar,
            inversionLegend,
            switchMap,
            mapTool,
        },
        computed:{
            getShowAreaState(){
                return this.$store.state.spaceTimeFlag.isArea
            },
            getShowWaterState(){
                return this.$store.state.spaceTimeFlag.isWater
            },
            getShowExtractState(){
                return this.$store.state.spaceTimeFlag.isExtract
            },
            getWaterType(){
                return this.$store.state.waterType
            },
        },
        watch:{
            getShowAreaState(newV,oldV){
                console.log(newV)
                if(newV){
                    this.setMapZoom()
                    this.isArea=newV

                }else{

                }

            },
            getShowWaterState(newV,oldV){
                console.log(newV)
                if(newV){
                    this.setWaterMapZoom()

                }

            },
            getShowExtractState(newV,oldV){
                console.log(newV)
                if(newV){
                    this.setHeBeiProvince()
                    this.isArea = false
                }
                this.isExtract = newV

            },
            getWaterType(newV,oldV){
                // console.log(newV)
                if(newV){
                    this.reSetExtractParam()
                }
            },
            listData(){
                console.log('hhz')
                this.$store.state.listData = this.listData
            },
            curListData(){
                // console.log('gg')
                this.$store.state.curListData = this.curListData

            }

        },
        methods:{
            //提取水体函数
            async extractWater() {
                this.$store.commit('showLoading')
                this.algForm.fileName = this.currentImgCode
                if(this.algForm.fileName !== null) {
                    request.post('waterenv-alg/extract',{
                        "filename": this.currentImgCode,
                        "publish": true,
                        "satelliteId": this.algForm.satelliteIdMini,
                        "thumb": true
                    }).then(res => {
                        console.log(res)
                        this.$store.commit('hideLoading')
                        if(res.code === 200) {
                            this.$message({
                                message: '水体提取成功,请耐心等待加载',
                                type: 'success'
                            })
                            this.algorithmImage = true
                            const centerLongitude = (res.data.tiffInfo.left+res.data.tiffInfo.right)/2
                            const centerLatitude = (res.data.tiffInfo.bottom+res.data.tiffInfo.top)/2
                            const extent = [res.data.tiffInfo.left,res.data.tiffInfo.bottom,res.data.tiffInfo.right,res.data.tiffInfo.top]
                            this.resultLayer = new ImageLayer({
                                source: new ImageStatic({
                                    url: res.data.thumbUrl,
                                    projection: 'EPSG:3857',
                                    imageExtent: transformExtent(extent,'EPSG:4326','EPSG:3857')
                                })
                            })
                            this.map.addLayer(this.resultLayer)
                            this.superMapServiceResultLayerVis = true


                            this.extractResult.waterBodyNum = Math.floor(Math.random() * 10) + 20
                            this.extractResult.unWaterBodyNum = 100 - (Math.floor(Math.random() * 5) + 15)
                            // this.createResultPieChart()
                            this.map.getView().setCenter(transform([centerLongitude,centerLatitude],'EPSG:4326','EPSG:3857'))
                        }else {
                            this.$message.error('提取算法执行失败')
                        }

                    })
                }

            },
            removeResultLayer(){
                this.map.removeLayer(this.resultLayer)
            },
            //分页插件函数
            handleCurrentChange(num) {
                this.paginationData.currentPage = num;
                this.removeImageFromLayer()
                for(let i in this.listData) {
                    if(this.listData[i].flag) this.listData[i].flag = false
                }
                // this.getRsImageData(this.paginationData);
                this.curListData = this.listData.slice((this.paginationData.currentPage-1)*this.paginationData.pageSize,this.paginationData.currentPage*this.paginationData.pageSize)
            },
            //鼠标移入行
            handleMouseEnter(image,row) {
                // console.log(image)
                let feature = new Feature(
                    new Polygon([[
                            transform([image.bottomLeftLongitude,image.bottomLeftLatitude],'EPSG:4326','EPSG:3857'),
                            transform([image.topRightLongitude,image.bottomLeftLatitude],'EPSG:4326','EPSG:3857'),
                            transform([image.topRightLongitude,image.topRightLatitude],'EPSG:4326','EPSG:3857'),
                            transform([image.bottomLeftLongitude,image.topRightLatitude],'EPSG:4326','EPSG:3857'),
                            transform([image.bottomLeftLongitude,image.bottomLeftLatitude],'EPSG:4326','EPSG:3857'),
                            transform([image.topRightLongitude,image.topRightLatitude],'EPSG:4326','EPSG:3857'),
                            transform([image.bottomLeftLongitude,image.topRightLatitude],'EPSG:4326','EPSG:3857'),
                            transform([image.topRightLongitude,image.bottomLeftLatitude],'EPSG:4326','EPSG:3857'),
                        ]]
                    )

                )
                feature.setStyle(new Style({
                    stroke: new Stroke({
                        color:"#56F512",
                        width:3.5
                    }),
                }))
                this.imageFrameFea[image.saveFilename] = feature
                this.searchFrameLayer.getSource().addFeature(feature)

            },
            //从图层中移除影像
            removeImageFromLayer() {
                if(this.imageLayer === null) return
                this.map.removeLayer(this.imageLayer)
                this.imageLayer = null
            },
            //事件：复选框状态改变
            handleCheckedChange(index,row,page) {
                //this.$store.commit('removeImageFromLayer')
                this.removeImageFromLayer()
                console.log('jll')
                console.log(this.$store.state.listData[index].flag);
                for(let i = 0;i <this.$store.state.listData.length;i++){
                    if(i === index||i === index-(page-1)*3){

                        continue
                    }else {
                        this.$store.state.listData[i].flag = false
                    }
                }

                if(!this.listData[index].flag){
                    return
                }

                const btmLtLongitude = Number(row.bottomLeftLongitude)
                const btmLtLatitude = Number(row.bottomLeftLatitude)
                const topRtLongitude = Number(row.topRightLongitude)
                const topRtLatitude = Number(row.topRightLatitude)

                const centerLongitude = (btmLtLongitude + topRtLongitude)/2
                const centerLatitude = (btmLtLatitude + topRtLatitude)/2

                const extent = [btmLtLongitude,btmLtLatitude,topRtLongitude,topRtLatitude]
                // console.log(extent);
                this.currentImgExtent = extent
                console.log(row)
                const imageSuffix = row.uploadFilename.split('.').slice(-1)
                this.currentImgCode =row.saveFilename+'.'+imageSuffix
                this.algForm.satelliteIdMini = row.satelliteId
                console.log(row.imageUrl)
                this.imageLayer = new ImageLayer({
                    source: new ImageStatic({
                        crossOrigin:"anonymous",
                        url: row.imageUrl,
                        projection: 'EPSG:3857',
                        imageExtent: transformExtent(extent,'EPSG:4326','EPSG:3857')
                    })
                })
                //this.$store.commit('addImageToLayer',{imageLayer,centerLongitude,centerLatitude})
                this.addImageToLayer({centerLongitude,centerLatitude})
                //按钮disabled属性
                if(this.algForm.lakeAlgChoice!=null || this.algForm.algChoice!=null){
                    this.extractBtnState = false
                }else{
                    this.extractBtnState = true
                }


            },
            //鼠标移出行
            handleMouseOut(image,row) {
                // console.log(image)
                this.searchFrameLayer.getSource().removeFeature(this.imageFrameFea[image.saveFilename])
            },
            removeFrameLayer(){
                this.map.removeLayer(this.searchFrameLayer)
            },
            //添加影像到图层
            addImageToLayer({centerLongitude,centerLatitude}) {
                console.log('gggg?')//最接近范围
                this.map.getView().fit(transformExtent([this.currentImgExtent[0],this.currentImgExtent[1],this.currentImgExtent[2],this.currentImgExtent[3]], 'EPSG:4326', 'EPSG:3857'),{duration: 1000},{nearest:true,constrainResolution: false,});
                console.log(transform([centerLongitude,centerLatitude],'EPSG:4326','EPSG:3857'));
                this.map.addLayer(this.imageLayer)
            },
            //选择区域之后如果在对应区域，显示出边框
            addSearchImageFrame() {
                this.searchFrameLayer = new VectorLayer({
                    source: new VectorSource(),
                    style: [
                        new Style({
                            stroke: new Stroke({
                                color: 'rgb(255,0,0)',
                                width: 5
                            }),
                            fill: new Fill({
                                color: 'rgba(255,0,0,0)'
                            })
                        })
                    ],
                })
                this.map.addLayer(this.searchFrameLayer)
            },
            returnSearch(){

                this.map.removeLayer(this.resultLayer)
                this.map.removeLayer(this.imageLayer)
                this.map.getView().animate({ // 只设置需要的属性即可
                    zoom: 7,
                    center: transform([117.5,39.35],'EPSG:4326','EPSG:3857'),
                    //center: [116.5,39.5],
                    //projection: 'EPSG:4326',
                    constrainResolution: true ,//确保OSM缩放到正确的级别
                    duration: 1000 // 缩放持续时间，默认不需要设置
                })

            },
            //清除查询区域的边框
            clearSearchImageFrame() {
                this.map.removeLayer(this.searchFrameLayer)
                this.searchFrameLayer = null
            },
            //不同路由同一组件切换，重置参数
            reSetExtractParam() {
                for(let i in this.listData) {
                    if(this.listData[i].flag) this.listData[i].flag = false
                }
                if(this.imageLayer!=null){
                    this.returnSearch()
                }

                this.showFlag = true
                this.clearImageDrawLayer()
                if(this.areaLayer !== null) {
                    this.map.removeLayer(this.areaLayer)
                    this.areaLayer = null
                    this.area = ''
                }

                this.clearSearchImageFrame()
                this.searchBtnText = '数据检索'
                this.geometry = null

                this.paginationData.total = this.listData.length
                this.$store.state.paginationData.total=  this.listData.length
                //console.log(this.listData.splice((this.paginationData.currentPage-1)*this.paginationData.pageSize,this.paginationData.currentPage*this.paginationData.pageSize));
                this.curListData = this.listData.slice((this.paginationData.currentPage-1)*this.paginationData.pageSize,this.paginationData.currentPage*this.paginationData.pageSize)
                console.log(this.curListData);
            },
            //判断影像店是否在多边形内
            booleanContain(geom,image) {
                console.log([image.bottomLeftLongitude,image.bottomLeftLatitude]);
                if(geom.intersectsCoordinate(transform([image.bottomLeftLongitude,image.bottomLeftLatitude],"EPSG:4326","EPSG:3857")) ||
                    geom.intersectsCoordinate(transform([image.bottomRightLongitude,image.bottomRightLatitude],"EPSG:4326","EPSG:3857")) ||
                    geom.intersectsCoordinate(transform([image.topLeftLongitude,image.topLeftLatitude],"EPSG:4326","EPSG:3857")) ||
                    geom.intersectsCoordinate(transform([image.topRightLongitude,image.topRightLatitude],"EPSG:4326","EPSG:3857"))) {
                    return true
                }else {
                    return false
                }
            },
            //数据检索
            searchImageData() {
                console.log(this.time);
                this.paginationData.currentPage = 1
                if(this.searchBtnText === '数据检索'){
                    this.clearImageDrawLayer()
                    if(this.geometry === null) {
                        this.$message('您还没有选择区域或输入值不正确')
                        return
                    }
                    /* if(this.searchValue === '地图选择') { */
                    this.addSearchImageFrame()
                    let image = this.temListData
                    console.log(this.temListData)
                    // console.log(this.time[0].slice(0,4),this.time[0].slice(5,7),this.time[0].slice(8,10));
                    for(let i in image){
                        if(this.booleanContain(this.geometry,image[i])){
                            if(this.year !== ''){
                                if(this.waterType === image[i].waterType) {
                                    this.listData.push(image[i] )
                                    console.log(this.waterType,image[i].waterType)
                                    //添加边框
                                    let feature = new Feature(
                                        new Polygon([[
                                                transform([image[i].bottomLeftLongitude,image[i].bottomLeftLatitude],'EPSG:4326','EPSG:3857'),
                                                transform([image[i].topRightLongitude,image[i].bottomLeftLatitude],'EPSG:4326','EPSG:3857'),
                                                transform([image[i].topRightLongitude,image[i].topRightLatitude],'EPSG:4326','EPSG:3857'),
                                                transform([image[i].bottomLeftLongitude,image[i].topRightLatitude],'EPSG:4326','EPSG:3857'),
                                                transform([image[i].bottomLeftLongitude,image[i].bottomLeftLatitude],'EPSG:4326','EPSG:3857'),
                                                transform([image[i].topRightLongitude,image[i].topRightLatitude],'EPSG:4326','EPSG:3857'),
                                                transform([image[i].bottomLeftLongitude,image[i].topRightLatitude],'EPSG:4326','EPSG:3857'),
                                                transform([image[i].topRightLongitude,image[i].bottomLeftLatitude],'EPSG:4326','EPSG:3857'),
                                            ]]
                                        )

                                    )
                                    let style = new Style({
                                        stroke: new Stroke({
                                            color:"rgba(4,185,235)",
                                            width:1
                                        }),
                                    })
                                    feature.setStyle(style)
                                    this.searchFrameLayer.getSource().addFeature(feature)
                                }
                            }else{
                                if(image[i].waterType === this.waterType) {
                                    this.listData.push(image[i])
                                    //添加边框
                                    let feature = new Feature(
                                        new Polygon([[
                                                transform([image[i].bottomLeftLongitude,image[i].bottomLeftLatitude],'EPSG:4326','EPSG:3857'),
                                                transform([image[i].topRightLongitude,image[i].bottomLeftLatitude],'EPSG:4326','EPSG:3857'),
                                                transform([image[i].topRightLongitude,image[i].topRightLatitude],'EPSG:4326','EPSG:3857'),
                                                transform([image[i].bottomLeftLongitude,image[i].topRightLatitude],'EPSG:4326','EPSG:3857'),
                                                transform([image[i].bottomLeftLongitude,image[i].bottomLeftLatitude],'EPSG:4326','EPSG:3857'),
                                                transform([image[i].topRightLongitude,image[i].topRightLatitude],'EPSG:4326','EPSG:3857'),
                                                transform([image[i].bottomLeftLongitude,image[i].topRightLatitude],'EPSG:4326','EPSG:3857'),
                                                transform([image[i].topRightLongitude,image[i].bottomLeftLatitude],'EPSG:4326','EPSG:3857'),
                                            ]]
                                        )

                                    )
                                    let style = new Style({
                                        stroke: new Stroke({
                                            color:"rgba(255,0,0)",
                                            width:1
                                        }),
                                    })
                                    feature.setStyle(style)
                                    this.searchFrameLayer.getSource().addFeature(feature)
                                }

                            }
                            this.$store.state.listData = this.listData
                        }
                    }
                    this.$store.state.listData = this.listData
                    this.time = ''
                    /* }else if(this.searchValue === '行政区划') {

                    } */

                    this.showFlag = false
                }else if(this.searchBtnText === '数据重置') {
                    console.log(1111)
                    if(this.imageLayer!=null){
                        this.returnSearch()
                    }

                    this.showFlag = true
                    this.clearImageDrawLayer()
                    if(this.areaLayer !== null) {
                        this.map.removeLayer(this.areaLayer)
                        this.areaLayer = null
                        this.area = ''
                    }

                    this.clearSearchImageFrame()
                    this.searchBtnText = '数据检索'
                    this.geometry = null
                }
                this.paginationData.total = this.listData.length
                this.$store.state.paginationData.total=  this.listData.length
                //console.log(this.listData.splice((this.paginationData.currentPage-1)*this.paginationData.pageSize,this.paginationData.currentPage*this.paginationData.pageSize));
                this.curListData = this.listData.slice((this.paginationData.currentPage-1)*this.paginationData.pageSize,this.paginationData.currentPage*this.paginationData.pageSize)
                console.log(this.curListData);
            },
            //获取影像数据
            getRsImageData(form) {
                request.get('waterenv-system/rsImage',{
                    params:{
                        beginTimeUpload: null,
                        endTimeUpload: null,
                        isAsc: null,
                        orderByColumn: null,
                        /* pageNum: form.currentPage,
                        pageSize: form.pageSize, */
                        pageNum: null,
                        pageSize: null,
                    }
                }).then( res => {
                    console.log(res);
                    // this.listData = this.addFlagForRsImage(res.rows)
                    this.temListData = this.addFlagForRsImage(res.rows)
                    this.$store.state.listData = this.temListData
                })
            },
            //为每一条影像数据添加flag,作为是否添加到图层的标志
            addFlagForRsImage(imageDatas) {
                for(let i = 0;i < imageDatas.length;i++){
                    imageDatas[i].flag = false
                }
                return imageDatas
            },
            //设置绘制图层
            createImageDrawLayer() {
                this.imageDrawSource = new VectorSource({
                    wrapX: false,
                    useSpatialIndex: false,
                    updateWhileAnimating:true,
                    updateWhileInteracting:true
                })
                this.imageDrawLayer = new VectorLayer({
                    className: '1111',
                    source: this.imageDrawSource,
                    style: [
                        new Style({
                            stroke: new Stroke({
                                color: 'rgb(255,0,0)',
                                width: 2
                            }),
                            fill: new Fill({
                                color: 'rgba(0,0,0,0.2)'
                            })
                        })
                    ],

                })
                this.map.addLayer(this.imageDrawLayer)
            },
            //移除绘制图层
            clearImageDrawLayer() {
                this.map.removeLayer(this.imageDrawLayer)
                this.imageDrawLayer = null
            },
            //绘制筛选区域
            //框选区域设置绘制形状和区域
            selectedSiteContent(shape) {
                if(this.imageDraw !== null) {
                    this.map.removeInteraction(this.imageDraw)
                    this.imageDraw = null
                }
                if(this.imageDrawLayer !== null) {
                    this.clearImageDrawLayer()
                }
                this.shape = shape
                this.listData.splice(0)
                this.createImageDrawLayer()
                let value = ''
                let geometryFunction;
                if(shape === "正方形"){
                    value = 'Circle'
                    geometryFunction = createRegularPolygon(4)
                }else if(shape === '矩形'){
                    value = 'Circle'
                    geometryFunction = createBox()
                }else if(shape === '多边形'){
                    value = 'Polygon'
                }else if(shape === '圆形'){
                    value = 'Circle'
                }
                this.imageDraw = new Draw({
                    source: this.imageDrawSource,
                    type: value,
                    geometryFunction: geometryFunction,
                })
                this.map.addInteraction(this.imageDraw)
                const _this = this
                this.imageDraw.on("drawend", function(evt) {
                    _this.geometry = evt.feature.getGeometry()
                    _this.map.removeInteraction(_this.imageDraw)
                    console.log(this.time)
                })
            },
            //获取富营养化柱状图数据
            getEutrophicationData(){
                // 查询
                var sqlParam = new SuperMap.GetFeaturesBySQLParameters({
                    queryParameter: {
                        name: "data-predict_smwu",
                    },
                    datasetNames: ["data2_udbx:sampling_points_3857"],
                    toIndex: 120
                });
                var dataUrl = "http://121.4.131.9:8090/iserver/services/data-predict_smwu/rest/data";
                const _that = this
                new FeatureService(dataUrl).getFeaturesBySQL(sqlParam, function (serviceResult) {
                    // console.log((new GeoJSON()).readFeatures(serviceResult.result.features))
                    console.log(serviceResult.result.features.features)
                    const arr = []
                    const washArr=[['score', '营养指数','序号']]
                    serviceResult.result.features.features.forEach((element,index) => {
                        arr.push(element.properties)
                        let eleItem =[]
                        console.log('id',element.id)
                        console.log('eut',element.properties.EUTRO)

                        eleItem.push(Number(element.properties.EUTRO))
                        eleItem.push(Number(element.properties.EUTRO))
                        eleItem.push(String(element.id))

                        washArr.push(eleItem)
                    });

                    console.log(washArr)

                    _that.$store.state.eutrophicationData={
                        source: washArr
                    }
                });

            },
            setHeBeiProvince(){
                this.map.getView().animate({ // 只设置需要的属性即可
                    zoom: 7,
                    center: transform([116.5,39.35],'EPSG:4326','EPSG:3857'),
                    //center: [116.5,39.5],
                    //projection: 'EPSG:4326',
                    constrainResolution: true //确保OSM缩放到正确的级别
                })
            },
            setWaterMapZoom(num){
                // 获取当前view对象
                this.map.getView().animate({ // 只设置需要的属性即可
                    center: transform([115.988563,38.912554],'EPSG:4326','EPSG:3857'), // 中心点
                    zoom: 14, // 缩放级别
                    rotation: undefined, // 缩放完成view视图旋转弧度
                    duration: 1000 // 缩放持续时间，默认不需要设置
                })

            },
            setMapZoom(num){
                // 获取当前view对象
                this.map.getView().animate({ // 只设置需要的属性即可
                    center: transform([115.928563,38.892554],'EPSG:4326','EPSG:3857'), // 中心点
                    zoom: 12, // 缩放级别
                    rotation: undefined, // 缩放完成view视图旋转弧度
                    duration: 1000 // 缩放持续时间，默认不需要设置
                })

            },
            //河流图层
            addEutrophicationRiverLayer(){
                this.eutrophicationRiverLayer =new TileLayer({
                    source: new TileSuperMapRest({
                        url:'http://121.4.131.9:8090/iserver/services/map-predict_smwu/rest/maps/%E5%88%86%E5%8C%BA_3857@data2_udbx?prjCoordSys=%7B%22epsgCode%22:3857%7D',
                        transparent: true
                    }),
                    projection: 'EPSG:3857',
                    zIndex: 99,
                });
                this.map.addLayer(this.eutrophicationRiverLayer)
            },
            removeEutrophicationRiverLayer(){
                this.map.removeLayer(this.eutrophicationRiverLayer)
            },
            //反演结果图层
            addEutrophicationLayer(){
                this.eutrophicationLayer =new TileLayer({
                    source: new TileSuperMapRest({
                        url:'http://121.4.131.9:8090/iserver/services/map-predict_smwu/rest/maps/sampling_points_3857?prjCoordSys=%7B%22epsgCode%22:3857%7D',
                        transparent: true
                    }),
                    projection: 'EPSG:3857',
                    zIndex: 99,
                });
                this.map.addLayer(this.eutrophicationLayer)

                console.log('eutrophicationLayer')
            },
            removeEutrophicationLayer(){

                this.map.removeLayer(this.eutrophicationLayer)

            },

            //添加动态点
            addDynamicPoints(coordinates) {
                // 设置图层
                this.ChALayers.POIWarning = new VectorLayer({ source: new VectorSource(), zIndex: 109, });
                // 添加图层
                this.map.addLayer(this.ChALayers.POIWarning);
                // 循环添加feature
                let pointFeature = [];
                for (let i = 0; i < coordinates.length; i++) {
                    // 创建feature，一个feature就是一个点坐标信息
                    const feature = new Feature({
                        geometry: new Point(
                            fromLonLat([coordinates[i].geometry.coordinates[0],coordinates[i].geometry.coordinates[1]])
                        )
                    });
                    feature.setId(coordinates[i].type)
                    pointFeature.push(feature);
                }
                //把要素集合添加到图层
                this.ChALayers.POIWarning.getSource().addFeatures(pointFeature);
                // 关键的地方在此：监听postrender事件，在里面重新设置circle的样式
                let radius = 0;
                this.ChALayers.POIWarning.on("postrender", (evt) => {
                    if (radius >= 20) radius = 0;
                    var opacity = (20 - radius) * (1 / 20); //不透明度
                    var pointStyle = new Style({
                        image: new Circle({
                            radius: radius*1.25,
                            stroke: new Stroke({
                                color: "rgba(255,0,0" + opacity + ")",
                                width: 3 - radius / 10, //设置宽度
                            }),
                        }),
                    });
                    // 获取矢量要素上下文
                    let vectorContext = getVectorContext(evt);
                    vectorContext.setStyle(pointStyle);
                    pointFeature.forEach((feature) => {
                        vectorContext.drawGeometry(feature.getGeometry());
                    });
                    radius = radius + 0.3; //调整闪烁速度
                    //请求地图渲染（在下一个动画帧处）
                    this.map.render();
                })
            },
            //获取危险区点信息
            getDangerPoint(){

                let coordinates = highChAPoint.features

                for(let i=0;i<coordinates.length;i++){
                    console.log(coordinates[i].geometry.coordinates)
                }
                this.addHighPOICha()
                this.addDynamicPoints(coordinates)

            },
            //添加影响图层
            addChAImgLayer(url1,url2,index){
                this.ChALayers.orginal = new TileLayer({
                    source: new TileSuperMapRest({
                        url:'http://121.4.131.9:8090/iserver/services/map-predict_smwu/rest/maps/original'+'?prjCoordSys=%7B%22epsgCode%22:3857%7D',
                        transparent: true
                    }),
                    projection: 'EPSG:3857',

                });

                this.map.addLayer(this.ChALayers.orginal)
                console.log('添加mlp')

            },
            //添加反演结果至当前图层
            addChALayer(){
                for(let i=1;i<6;i++){
                    this.ChALayers['classify_'+i] =new TileLayer({
                        source: new TileSuperMapRest({
                            url:'http://121.4.131.9:8090/iserver/services/map-predict_smwu/rest/maps/clasify_'+i+'?prjCoordSys=%7B%22epsgCode%22:3857%7D',
                            transparent: true
                        }),
                        projection: 'EPSG:3857',
                        zIndex: 99,
                    });
                    this.map.addLayer(this.ChALayers['classify_'+i])
                }

            },
            //移除反演分类影像
            removeChALayer(index){
                console.log(index)
                let num =1+index
                this.map.removeLayer(this.ChALayers['classify_'+num])
                console.log('移除mlp')
            },
            //移除CHA原始影像
            removeChAImgLayer(){
                console.log()
                this.map.removeLayer(this.ChALayers.orginal)
            },
            removeClassAll(){
                for(let i=1;i<6;i++){
                    this.map.removeLayer(this.ChALayers['classify_'+i])
                    console.log(i)
                }
                this.removeChAImgLayer()
            },
            //添加单个分类结果
            addSingleChALayer(index){
                console.log(index)
                let num =1+index
                this.map.addLayer(this.ChALayers['classify_'+num])

            },
            //获取当前走马灯序号
            getCurrentIndex(num){
                this.currentIndex = num
                console.log('父亲',this.currentIndex)
            },
            autoPlayCarousel(){

                this.$refs.timeCarousel.setAutoPlay()
            },
            pausePlayCarousel(){

                this.$refs.timeCarousel.beforeDestroy()
            },
            addWaterLayer(url1,url2,index){


                this.currentImgInf = index
                this.currentResultLayer = new TileLayer({
                    source: new TileSuperMapRest({
                        url:url2 +'?prjCoordSys=%7B%22epsgCode%22:3857%7D',
                        transparent: true
                    }),
                    projection: 'EPSG:3857',
                    zIndex: 99,
                });
                this.currentImgLayer = new TileLayer({
                    source: new TileSuperMapRest({
                        url:url1 +'?prjCoordSys=%7B%22epsgCode%22:3857%7D',
                        transparent: true
                    }),
                    projection: 'EPSG:3857'
                });
                this.map.addLayer( this.currentImgLayer)
                this.map.addLayer( this.currentResultLayer)
                console.log('添加')

            },
            addWaterResultLayer(){
                if(this.currentResultLayer!=null){
                    this.map.addLayer(this.currentResultLayer)
                }

            },
            removeWaterResultLayer(){
                if(this.currentResultLayer!=null){
                    this.map.removeLayer( this.currentResultLayer)
                }else
                    return
            },
            addWaterImgLayer(){
                if(this.currentImgLayer!=null){
                    this.map.addLayer(this.currentImgLayer)
                }

            },

            //移除水体影像
            removeWaterImgLayer(){
                if(this.currentImgLayer!=null){
                    this.map.removeLayer( this.currentImgLayer)
                }else
                    return
            },
            //time时间轴移除结果显示
            removeWaterResultYear(){
                if(this.currentImgLayer!=null&&this.currentResultLayer!=null){
                    this.map.removeLayer( this.currentImgLayer)
                    this.map.removeLayer( this.currentResultLayer)
                    this.currentImgInf = null
                    console.log('移除')
                    // this.$refs.spaceLeftBar.initInformation()
                }else
                    return

            },
            mapRenderer(){

                this.map = new Map({
                    // controls: defaults({attribution: false, zoom: false, rotate: false }).extend([scaleControl()]),
                    //地图通过map-root的ref属性 进行绑定 也可以使用ID属性
                    controls: defaults({attribution: false, zoom: false, rotate: false }).extend(new Logo()),
                    target: this.$refs["space-container"],
                    layers: [
                        new TileLayer({
                            source:new TileArcGISRest({
                                url:'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
                            })
                        })
                    ],

                    view: new View({
                        zoom: 7,
                        center: transform([116.5,39.35],'EPSG:4326','EPSG:3857'),
                        //center: [116.5,39.5],
                        //projection: 'EPSG:4326',
                        constrainResolution: true //确保OSM缩放到正确的级别
                    }),

                })
                const converLayer = new VectorLayer({
                    source: new VectorSource({
                        wrapX:false,
                    }),
                });
                let features = (new GeoJSON()).readFeatures(require('@/assets/json/河北省2.json'))
                let _this = this

                features.forEach(function(element) {
                    let jsonName = element.get('name')
                    let geom = element.getGeometry().transform('EPSG:4326','EPSG:3857')
                    // let geom = element.getGeometry()
                    element.setGeometry(geom)
                    const style = new Style({
                        fill: new Fill({
                            color: 'rgba(255,255,255,0)' //高亮区域填充色，可以是使用rgba
                            //color: 'rgba(29,254,210)'
                        }),
                        stroke: new Stroke({
                            color:"rgba(4,185,235)",
                            width:2.5
                        })
                    })
                    // _this.citis[i].style = style
                    element.setStyle(style)
                    // console.log(jsonName);
                    // if(jsonName === "河北省" )
                    converLayer.getSource().addFeature(element)

                })
                this.map.addLayer(converLayer);

                // this.observer()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .spaceTime {
        height: 100%;
        position: relative;
        overflow: hidden;
        display: flex;
        justify-content: space-around;
        align-items: flex-end;
        .spaceContainer{
            height: 101%;
            width: 100%;
            position: absolute;
        }


    }
</style>