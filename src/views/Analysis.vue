<template>
    <div id="dataAnalysis" class="dataAnalysis" style="height: 100%;position: relative;">
        <div id="analysis-map" ref="analysis-map">
            
        </div>
        <div class="right-bar">
            <div class="analysis-type" @mouseover="btnColor.timeSpatial.flag = false"  @mouseout="btnColor.timeSpatial.flag = true" @click="rightBtnChange('timeSpatial')">
                <img class="img-analysis" :src="(btnColor.timeSpatial.flag && btnColor.timeSpatial.clickFlag)? btnColor.timeSpatial.timeSpatial : btnColor.timeSpatial.lightTimeSpatial" alt="">
                <span style="font-size: 8px;" :class="[(btnColor.timeSpatial.flag && btnColor.timeSpatial.clickFlag) ? 'span-color-hide': 'span-color-show']">水质时空变化</span>
            </div>
            <div class="analysis-type" @mouseover="btnColor.waterType.flag = false"  @mouseout="btnColor.waterType.flag = true" @click="rightBtnChange('waterType')">
                <img class="img-analysis" :src="(btnColor.waterType.flag && btnColor.waterType.clickFlag)? btnColor.waterType.waterType : btnColor.waterType.lightWaterType" alt="">
                <span style="font-size: 8px;" :class="[(btnColor.waterType.flag && btnColor.waterType.clickFlag) ? 'span-color-hide': 'span-color-show']">类别分析</span>
            </div>
            <div class="analysis-type" @mouseover="btnColor.waterInfluence.flag = false"  @mouseout="btnColor.waterInfluence.flag = true" @click="rightBtnChange('waterInfluence')">
                <img class="img-analysis" :src="(btnColor.waterInfluence.flag && btnColor.waterInfluence.clickFlag)? btnColor.waterInfluence.waterInfluence : btnColor.waterInfluence.lightWaterInfluence" alt="">
                <span style="font-size: 8px;" :class="[(btnColor.waterInfluence.flag && btnColor.waterInfluence.clickFlag) ? 'span-color-hide': 'span-color-show']">影响因素</span>
            </div>
        </div>
        <interpolation-time-spatial v-if="!btnColor.timeSpatial.clickFlag" :map="map" :krigingPolygon="krigingPolygon" :show="show"></interpolation-time-spatial>
        <quality-analysis :map="map" v-if="!btnColor.waterType.clickFlag"></quality-analysis>
        <water-influence-ele :map="map" v-if="!btnColor.waterInfluence.clickFlag"></water-influence-ele>
        <time-line v-if="show.flag && !btnColor.timeSpatial.clickFlag"></time-line>
    </div>
</template>

<script>
import timeSpatial from "../assets/icon/timeSpatial.svg"
import lightTimeSpatial from "../assets/icon/lightTimeSpatial.svg"
import waterType from "../assets/icon/waterType.svg"
import lightWaterType from "../assets/icon/lightWaterType.svg"
import waterInfluence from "../assets/icon/waterInfluence.svg"
import lightWaterInfluence from "../assets/icon/lightWaterInfluence.svg"
import InterpolationTimeSpatial from "../components/WaterAnalysis/InterpolationTimeSpatial"
import QualityAnalysis from "../components/WaterAnalysis/QualityAnalysis"
import WaterInfluenceEle from "../components/WaterAnalysis/WaterInfluence"
import TimeLine from "../components/Time/TimeLine"

import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import {defaults,FullScreen,ScaleLine,ZoomSlider,MousePosition} from 'ol/control'
import {transform,transformExtent} from 'ol/proj'
import ImageStatic from 'ol/source/ImageStatic';
import ImageLayer from 'ol/layer/Image'
import {OSM, ImageArcGISRest,TileWMS,ImageWMS,TileArcGISRest} from 'ol/source';
import XYZ from 'ol/source/XYZ'
import 'ol/ol.css'
import {Logo, TileSuperMapRest} from '@supermap/iclient-ol';
import OverviewMap from 'ol/control/OverviewMap'
import {Vector as VectorLayer}  from 'ol/layer'
import VectorSource from 'ol/source/Vector';
import {Style,Stroke,Fill,Text} from 'ol/style';
import GeoJSON from "ol/format/GeoJSON";
import {createRegularPolygon,createBox} from 'ol/interaction/Draw'
import Draw from 'ol/interaction/Draw';
import Polygon from 'ol/geom/Polygon'
import Feature from 'ol/Feature'
import {tile,bbox} from 'ol/loadingstrategy';

export default {
    name: 'dataAnalysis',
    data() {
        return {
            map: null,
            btnColor: {
                timeSpatial: {
                    timeSpatial,
                    lightTimeSpatial,
                    flag: true,
                    clickFlag: false
                },
                waterType: {
                    waterType,
                    lightWaterType,
                    flag: true,
                    clickFlag: true
                },
                waterInfluence: {
                    waterInfluence,
                    lightWaterInfluence,
                    flag: true,
                    clickFlag: true
                }
            },
            baseLayer: null,
            krigingPolygon: null,
            show:{
                flag: false
            }
        }
    },
    components: {
        InterpolationTimeSpatial,
        QualityAnalysis,
        WaterInfluenceEle,
        TimeLine
    },
    mounted() {
        this.mapRenderer()
    },
    created() {
    },
    methods: {
        //点击按钮改变颜色
        rightBtnChange(name) {
            if(!this.btnColor['timeSpatial'].clickFlag)
            this.$store.state.interpolation.clearInterpolationData()
            if(!this.btnColor['waterType'].clickFlag)
            this.$store.state.qualityClassify.clear()
            if(!this.btnColor['waterInfluence'].clickFlag)
            this.$store.state.waterInfluence.clear()
            for(let key in this.btnColor) {
                this.btnColor[key].clickFlag = true
            }
            this.btnColor[name].clickFlag = false
            this.map.getView().setCenter(transform([114.1,39.35],'EPSG:4326','EPSG:3857'))
            this.map.getView().setZoom(7)
        },
        mapRenderer(){
            
            this.map = new Map({
                //地图通过map-root的ref属性 进行绑定 也可以使用ID属性
                target: this.$refs["analysis-map"],
                layers: [
                    new TileLayer({
                        source:new TileArcGISRest({
                            url:'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
                        })
                    })
                ],
                view: new View({
                zoom: 7,
                center: transform([114.1,39.35],'EPSG:4326','EPSG:3857'),
                //center: [116.5,39.5],
                //projection: 'EPSG:4326',
                constrainResolution: true //确保OSM缩放到正确的级别
                }),
                controls: defaults({attribution: false, zoom: false, rotate: false }).extend(new Logo())
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
                console.log(element.getGeometry().getCoordinates())
                _this.krigingPolygon = element.getGeometry().getCoordinates()
            })
            this.map.addLayer(converLayer);

            // this.observer()
        }
    }
}
</script>

<style lang="scss" scoped>
.dataAnalysis {
    #analysis-map {
        width: 100%;
        height: 100%;
        position: absolute;
    }
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
            padding: 60% 0;
            text-align: center;
        }
        .img-analysis {
            padding: 0 2px;
            width: 90%;
            height: 40%;
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

