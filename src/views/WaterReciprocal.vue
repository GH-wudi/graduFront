<template>
    <div class="waterReciprocal"  >
        <div class="waterReciprocalContainer" ref="reciprocal-container"></div>

        <waterReciprocalLeftBar @addRiverLayer="addRiverLayer" @setNormalMapZoom="setNormalMapZoom" @removeRiverLayer="removeRiverLayer" :currentImgInf="currentImgInf" @removeEutrophicationLayer="removeEutrophicationLayer" @addEutrophicationLayer="addEutrophicationLayer" @removeCODLayer="removeCODLayer" @addCODLayer="addCODLayer" @getDangerPoint="getDangerPoint" @removePOILayers="removePOILayers" @removeClassAll="removeClassAll" @removeChAImgLayer="removeChAImgLayer" @addChAImgLayer="addChAImgLayer" @addChALayer="addChALayer"  @removeWaterResultLayer="removeWaterResultLayer" @addWaterResultLayer="addWaterResultLayer" @addWaterImgLayer="addWaterImgLayer" @removeWaterImgLayer="removeWaterImgLayer" ></waterReciprocalLeftBar>
        <waterReciprocalRightBar></waterReciprocalRightBar>
        <div v-show="isCOD"  class="reciprocalLegend" style="width: 410px;height: 400px;position: absolute;left: 92%"></div>
        <inversionLegend v-show="isChA"  @addSingleChALayer="addSingleChALayer($event)" @removeChALayer="removeChALayer($event)"></inversionLegend>
    </div>
</template>

<script>

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
    import {FeatureService, Logo, SuperMap, TileSuperMapRest} from '@supermap/iclient-ol';
    import OverviewMap from 'ol/control/OverviewMap'
    import {Vector as VectorLayer}  from 'ol/layer'
    import VectorSource from 'ol/source/Vector';
    import { fromLonLat, transform, toLonLat } from "ol/proj";
    import GeoJSON from "ol/format/GeoJSON";
    import {createRegularPolygon,createBox} from 'ol/interaction/Draw'
    import Draw from 'ol/interaction/Draw';
    import Polygon from 'ol/geom/Polygon'
    import Feature from 'ol/Feature'
    import {tile,bbox} from 'ol/loadingstrategy';
    import {Style,Stroke,Fill,Text,Icon,Circle} from 'ol/style';

    //引入组件
    import waterReciprocalLeftBar from '../components/waterReciprocal/waterReciprocal-leftBar'
    import waterReciprocalRightBar from "../components/waterReciprocal/waterReciprocal-rightBar";
    import highChAPoint from "../assets/json/high_4326";
    import inversionLegend from "../components/waterSpaceTime/inversionLegend";
    import * as echarts from "echarts";

    export default {
        name: "WaterReciprocal",
        data(){
            return{
                currentImgLayer:null,
                currentResultLayer:null,
                currentImgInf:{

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
                riverLayer:null,
                isCOD:false,
                isChA:false,
                isEutrophication:false,
                currentIndex:null,
                dangerousPointList:[],
                isCreatedEU:false
            }
        },
        mounted() {
            this.mapRenderer()
            console.log('进入反演界面')
            this.getEutrophicationData()
            this.initReciprocalLegend()
            /*if(this.isChA){
                this.addChAImgLayer()
                this.addChALayer()
                this.getDangerPoint()

                this.getEutrophicationData()
            }*/



        },
        components:{
            waterReciprocalLeftBar,
            waterReciprocalRightBar,
            inversionLegend
        },
        computed:{
            getShowCODState(){
                return this.$store.state.spaceTimeFlag.isCOD
            },
            getShowChAState(){
                return this.$store.state.spaceTimeFlag.isChA
            },
            getShowWaterState(){
                return this.$store.state.spaceTimeFlag.isWater
            },
        },

        methods:{
            initReciprocalLegend(){
                let barChart = echarts.init(document.querySelector('.reciprocalLegend'))

                const option = {
                    xAxis: { name: '' ,axisLine:{show:false} },
                    yAxis: { type: '',axisLine:{show:false} },
                    visualMap: {
                        min: 10,
                        max: 100,
                        text: ['高浓度', '低浓度'],
                        inRange: {
                            color: ['#65B581', '#FFCE34', '#FD665F']
                        },
                        textStyle: {
                            color: '#ffffff',

                        },
                    },
                };
                barChart.setOption(option)
            },
            //恢复到正常zoom
            setNormalMapZoom(){
                // 获取当前view对象
                this.map.getView().animate({ // 只设置需要的属性即可
                    zoom: 12,
                    center: transform([115.928563,38.892554],'EPSG:4326','EPSG:3857'),
                    //center: [116.5,39.5],
                    //projection: 'EPSG:4326',
                    constrainResolution: true //确保OSM缩放到正确的级别
                })

            },
            setWaterMapZoom(){
                // 获取当前view对象
                this.map.getView().animate({ // 只设置需要的属性即可
                    center: transform([115.988563,38.912554],'EPSG:4326','EPSG:3857'), // 中心点
                    zoom: 14, // 缩放级别

                    duration: 1000 // 缩放持续时间，默认不需要设置
                })

            },
            mapRenderer(){
                this.map = new Map({
                    // controls: defaults({attribution: false, zoom: false, rotate: false }).extend([scaleControl()]),
                    //地图通过map-root的ref属性 进行绑定 也可以使用ID属性
                    controls: defaults({attribution: false, zoom: false, rotate: false }).extend(new Logo()),
                    target: this.$refs["reciprocal-container"],
                    layers: [
                        new TileLayer({
                            source:new TileArcGISRest({
                                url:'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
                            })
                        })
                    ],
                    view: new View({
                        zoom: 12,
                        center: transform([115.928563,38.892554],'EPSG:4326','EPSG:3857'),
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
            },
            addRiverLayer(){
                this.riverLayer =new TileLayer({
                    source: new TileSuperMapRest({
                        url:'http://121.4.131.9:8090/iserver/services/map-predict_smwu/rest/maps/inRiver'+'?prjCoordSys=%7B%22epsgCode%22:3857%7D',
                        transparent: true
                    }),
                    projection: 'EPSG:3857',
                    zIndex: 99,
                });
                this.map.addLayer(this.riverLayer)
                /*this.riverLayer = new VectorLayer({
                    source: new VectorSource({
                        wrapX:false,
                        useSpatialIndex: false,
                        updateWhileAnimating: true,
                        updateWhileInteracting:true

                    }),
                });
                let features = (new GeoJSON()).readFeatures(require('@/assets/json/入淀河流.json'))

                let _this = this

                features.forEach(function(element) {
                    let jsonName = element.get('name')
                    let geom = element.getGeometry().transform('EPSG:4326','EPSG:3857')
                    // let geom = element.getGeometry()
                    element.setGeometry(geom)
                    const style = new Style({

                        stroke: new Stroke({
                            color: '#0099FF',
                            width: 1,
                            opacity: 0.3
                        }),

                    })

                    element.setStyle(style)

                    _this.riverLayer.getSource().addFeature(element)
                })
                this.riverLayer.getSource().on('featuresloadend',evt=>{
                    _this.riverLayer.getSource().getFeatures().forEach(item=>{
                        setInterval(()=>{
                            let style  =  item.getStyle();
                            if(style == undefined){
                                item.setStyle(
                                    [new Style({
                                        stroke: new Stroke({
                                            color: "rgba(30,144,255, 0.7)",
                                            width: 2,
                                        })
                                    }),
                                        new Style({
                                            stroke:new Stroke({
                                                color: [255, 250, 250, 1],
                                                width: 2,
                                                lineDash: [20, 27],
                                                lineDashOffset:0
                                            })
                                        })]
                                )
                            }else {
                                let lineDashOffset = item.getStyle()[1].getStroke().getLineDashOffset();
                                item.setStyle(
                                    [new Style({
                                        stroke: new Stroke({
                                            color: "rgba(30,144,255, 0.7)",
                                            width: 2,
                                        })
                                    }),
                                        new Style({
                                            stroke:new Stroke({
                                                color: [255, 250, 250, 1],
                                                width: 2,
                                                lineDash: [2, 7],
                                                lineDashOffset:lineDashOffset==8 ?0:lineDashOffset+1
                                            })
                                        })]
                                )
                            }
                        },100)
                    })
                })
                this.map.addLayer(this.riverLayer)*/
            },
            removeRiverLayer(){
                this.map.removeLayer(this.riverLayer)

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
                this.setWaterMapZoom()
                this.isEutrophication=true
                console.log('eutrophicationLayer')
            },
            removeEutrophicationLayer(){
                this.setNormalMapZoom()
                this.isEutrophication=false
                this.map.removeLayer(this.eutrophicationLayer)

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
            //添加COD反演结果至当前图层
            addCODLayer(){
                this.isCOD=true
                this.CODLayer =new TileLayer({
                    source: new TileSuperMapRest({
                        url:'http://121.4.131.9:8090/iserver/services/map-predict_smwu/rest/maps/cod_chazhi_pingyi'+'?prjCoordSys=%7B%22epsgCode%22:3857%7D',
                        transparent: true
                    }),
                    projection: 'EPSG:3857',
                    zIndex: 99,
                });
                this.map.addLayer(this.CODLayer)

                console.log('cod')
            },
            removeCODLayer(){
                this.isCOD=false

                this.map.removeLayer(this.CODLayer)

            },
            removePOILayers(){
                this.map.removeLayer(this.ChALayers.POI)
                this.map.removeLayer(this.ChALayers.POIWarning)
            },
            addHighPOICha(){
                this.ChALayers.POI =new TileLayer({
                    source: new TileSuperMapRest({
                        url:'http://121.4.131.9:8090/iserver/services/map-predict_smwu/rest/maps/high_point'+'?prjCoordSys=%7B%22epsgCode%22:3857%7D',
                        transparent: true
                    }),
                    projection: 'EPSG:3857',
                    zIndex: 100,
                });
                this.map.addLayer(this.ChALayers.POI)
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
                this.isChA =true
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
                this.isChA =false
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




        }
    }
</script>

<style lang="scss" scoped>
    .waterReciprocal {
        height: 100%;
        position: relative;
        overflow: hidden;
        display: flex;
        justify-content: space-around;
        align-items: flex-end;
        .waterReciprocalContainer{
            height: 101%;
            width: 100%;
            position: absolute;
        }


    }
</style>