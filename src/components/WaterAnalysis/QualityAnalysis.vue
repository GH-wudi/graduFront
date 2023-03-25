<template>
    <div class="quality-analysis2" style="width: 100%;height: 100%;">
        <div id="quality-analysis">
            <div class="top">
                <div style="background: rgba(0,0,0,0.7); padding: 12px 10px;">
                    <img src="../../assets/icon/typeAnalysis.svg" alt="" style="vertical-align: sub;margin-right: 10px;">
                    <span style="display: inline-block;font-weight: 600;">水质类别分析</span>
                </div>
                <div style="background-color: rgba(2,35,70);padding: 5px 10px;font-size: 14px;text-align: center;">数据日期选择</div>
                <div style="padding: 25px 10px;background-color: rgba(0,0,0);text-align: center;">
                    <select class="select" v-model="params.year"  @change="changeData">
                        <option style="text-align: center; border-radius: 5px;" v-for="item in years" :label="item.label" :value ="item.value" :key="item.value"></option>
                    </select>
                    <select class="select" v-model="params.month"  @change="changeData">
                        <option style="text-align: center; border-radius: 5px;" v-for="item in months" :label="item.label" :value ="item.value" :key="item.value"></option>
                    </select>
                </div>
                <!-- <div style="background-color: rgba(2,35,70);padding: 5px 10px;font-size: 14px;text-align: center;">数据市区选择</div>
                <div style="padding: 25px 10px;background-color: rgba(0,0,0);text-align: center;">
                    <select class="select" style="width: 200px;" v-model="params.city" @change="changeData">
                        <option style="text-align: center; border-radius: 5px;" v-for="item in cities" :label="item.label" :value ="item.value" :key="item.value"></option>
                    </select>
                </div> -->
                <div style="background-color: rgba(2,35,70);padding: 5px 10px;font-size: 14px;text-align: center;">数据显示方式</div>
                <div style="padding: 25px 10px;background-color: rgba(0,0,0);">
                    <span style="font-size: 13px;font-weight: 600;margin: 0 25px 0 20px;">分级符号</span>
                    <el-switch v-model="params.classicFlag" active-color="#0fe7ff" inactive-color="rgb(180,180,180)" @click="removerMointorLayer"></el-switch>
                    <span style="font-size: 13px;font-weight: 600;margin: 0 25px 0 90px;">泰森多边形</span>
                    <el-switch v-model="params.tysonFlag" active-color="#0fe7ff" inactive-color="rgb(180,180,180)" @click="removeTaiSenLayer"></el-switch>
                </div>
                <div>
                    <span class="interpolation-btn" @click="clearQualityAnalysisData">清除</span>
                    <span class="interpolation-btn" @click="getDataMonitorData">类别分析</span>
                </div>
            </div>
            <!-- <div style="padding: 50px 10px 0;" >
                <span style="font-size: 15px;font-weight: 600;display: inline-block;width: 275px;">某某市各断面对比</span> 
            </div>
             -->
             <div>
                
             </div>
        </div>
         <div style="text-align: center;position: absolute; left: 400px;top: 12px;">
            <select class="chart-select"  v-model="params.city" @change="changeData">
                <option style="text-align: center; border-radius: 5px;" v-for="item in cities" :label="item.label" :value ="item.value" :key="item.value"></option>
            </select>
            <select class="chart-select"  v-model="params.classic" @change="changeData" v-show="this.params.city === '全省'">
                <option style="text-align: center; border-radius: 5px;" v-for="item in classics" :label="item.label" :value ="item.value" :key="item.value"></option>
            </select>
        </div>
        <!-- <div class="right-chart">
            <div style="padding: 25px 10px;background-color: rgba(0,0,0);text-align: center;">
                <select class="select" style="width: 200px;" v-model="params.city" @change="changeData">
                    <option style="text-align: center; border-radius: 5px;" v-for="item in cities" :label="item.label" :value ="item.value" :key="item.value"></option>
                </select>
            </div>
            <div class="chart-change-one" v-show="this.classic.show" ></div>
            <div class="chart-change-two" v-show="this.classic.show"></div>
        </div> -->
        <div class="chart-change-one" v-show="this.classic.show && this.params.city !== '全省'" ></div>
        <div class="chart-change-two" v-show="this.classic.show && this.params.city !== '全省'"></div>
        <div class="legend-analysis" v-show="this.classic.show">
            <div style="margin: 5px 0;">
                <span class="color-ex" style="background: rgb(56,150,253);"></span>
                <span style="color: #fff;">Ⅰ类水</span>
            </div>
            <div style="margin: 5px 0;">
                <span class="color-ex" style="background: rgb(79,198,77);"></span>
                <span style="color: #fff;">Ⅱ类水</span>
            </div>
            <div style="margin: 5px 0;">
                <span class="color-ex" style="background: rgb(255,204,0);"></span>
                <span style="color: #fff;">Ⅲ类水</span>
            </div>
            <div style="margin: 5px 0;">
                <span class="color-ex" style="background: rgb(255,136,0);"></span>
                <span style="color: #fff;">Ⅳ类水</span>
            </div>
            <div style="margin: 5px 0;">
                <span class="color-ex" style="background: rgb(255,0,0);"></span>
                <span style="color: #fff;">Ⅴ类水</span>
            </div>
            <div style="margin: 5px 0;">
                <span class="color-ex" style="background: rgb(160,37,0);"></span>
                <span style="color: #fff;">劣Ⅴ类水</span>
            </div>
        </div>
    </div>
</template>

<script>

import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import {defaults,FullScreen,ScaleLine,ZoomSlider,MousePosition} from 'ol/control'
import {transform,transformExtent} from 'ol/proj'
import ImageStatic from 'ol/source/ImageStatic';
import ImageLayer from 'ol/layer/Image'
import {OSM, ImageArcGISRest,TileWMS,ImageWMS,TileArcGISRest,ImageCanvas} from 'ol/source';
import XYZ from 'ol/source/XYZ';
import {Style,Stroke,Fill,Text,Icon,Circle} from 'ol/style';
import 'ol/ol.css'
import {Logo, TileSuperMapRest} from '@supermap/iclient-ol';
import OverviewMap from 'ol/control/OverviewMap'
import {Vector as VectorLayer}  from 'ol/layer'
import VectorSource from 'ol/source/Vector';
import GeoJSON from "ol/format/GeoJSON";
import {createRegularPolygon,createBox} from 'ol/interaction/Draw'
import Draw from 'ol/interaction/Draw';
import Polygon from 'ol/geom/Polygon'
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature'
import {tile,bbox} from 'ol/loadingstrategy';
import Overlay from 'ol/Overlay.js'


import request from "../../utils/request.js"

import wclassify1 from "../../assets/icon/wclassify1.svg"
import wclassify2 from "../../assets/icon/wclassify2.svg"
import wclassify3 from "../../assets/icon/wclassify3.svg"
import wclassify4 from "../../assets/icon/wclassify4.svg"
import wclassify5 from "../../assets/icon/wclassify5.svg"
import wclassifyl5 from "../../assets/icon/wclassifyl5.svg"
import { closestSquaredDistanceXY } from 'ol/extent';



export default {
    name: 'quality-analysis',
    props: ["map"],
    data() {
        return {
            years: [
                {
                    value: "2022",
                    label: "2022年",
                },{
                    value: "2021",
                    label: "2021年",
                },{
                    value: "2020",
                    label: "2020年",
                },{
                    value: "2019",
                    label: "2019年",
                },{
                    value: "2018",
                    label: "2018年",
                },{
                    value: "2017",
                    label: "2017年",
                },
            ],
            months: [
                {
                    value: '1',
                    label: '1月'
                },{
                    value: '2',
                    label: '2月'
                },{
                    value: '3',
                    label: '3月'
                },{
                    value: '4',
                    label: '4月'
                },{
                    value: '5',
                    label: '5月'
                },{
                    value: '6',
                    label: '6月'
                },{
                    value: '7',
                    label: '7月'
                },{
                    value: '8',
                    label: '8月'
                },{
                    value: '9',
                    label: '9月'
                },{
                    value: '10',
                    label: '10月'
                },{
                    value: '11',
                    label: '11月'
                },{
                    value: '12',
                    label: '12月'
                }
            ],
            cities: [
                {
                    value:  "全省",
                    label: "全省"
                },{
                    value:  "保定市",
                    label: "保定市"
                },{
                    value:  "廊坊市",
                    label: "廊坊市"
                },{
                    value:  "石家庄市",
                    label: "石家庄市"
                },{
                    value:  "唐山市",
                    label: "唐山市"
                },{
                    value:  "承德市",
                    label: "承德市"
                },{
                    value:  "秦皇岛市",
                    label: "秦皇岛市"
                },{
                    value:  "邯郸市",
                    label: "邯郸市"
                },{
                    value:  "邢台市",
                    label: "邢台市"
                },{
                    value:  "衡水市",
                    label: "衡水市"
                },{
                    value:  "沧州市",
                    label: "沧州市"
                },{
                    value:  "张家口市",
                    label: "张家口市"
                }
            ],
            classics: [
                {
                    value:  "Ⅰ",
                    label: "Ⅰ类"
                },{
                    value:  "Ⅱ",
                    label: "Ⅱ类"
                },{
                    value:  "Ⅲ",
                    label: "Ⅲ类"
                },{
                    value:  "Ⅳ",
                    label: "Ⅳ类"
                },{
                    value:  "Ⅴ",
                    label: "Ⅴ类"
                },{
                    value:  "劣Ⅴ",
                    label: "劣Ⅴ类"
                },{
                    value:  "全部",
                    label: "全部"
                }
            ],
            params: {
                year: '2021',
                month: '2',
                city: '全省',
                classicFlag: true,
                tysonFlag: true,
                classic: '全部'
            },
            classic: {
                ele: null,
                monitors: [],
                monitorLayer: null,
                baseLayer: null,
                taiSenLayer: null,
                overLay: null,
                classify: {
                    wclassify1,
                    wclassify2,
                    wclassify3,
                    wclassify4,
                    wclassify5,
                    wclassifyl5
                },
                show: false,
                numClassic: {
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 0,
                    "6": 0
                },
                oneChart: {
                    x:[],
                    y:[]
                }
            }
            
        }
    },
    created() {
    },
    mounted() {
        this.$store.state.qualityClassify.clear = this.clearQualityAnalysisData
        // this.chartChangeThreeRenderer()
    },
    methods: {
        //日期等数据切换
        changeData() {
            if(this.classic.show) {
                this.clearQualityAnalysisData()
                this.getDataMonitorData()
            }
        },
        //清除分类图层数据
        clearQualityAnalysisData() {
            this.map.removeLayer(this.classic.monitorLayer)
            this.map.removeLayer(this.classic.taiSenLayer)
            if(this.classic.baseLayer !== null) this.map.removeLayer(this.classic.baseLayer)
            this.map.removeOverlay(this.classic.overLay)
            const divs = document.querySelectorAll('.css_animation')
            for(let i=0;i<divs.length;i++) {
                divs[i].style.display = "none"
            }
            this.classic.show = false

        },
        //移除添加分级符号
        removerMointorLayer() {
            if(this.params.classicFlag) {
                this.map.addLayer(this.classic.monitorLayer)
                this.map.addOverlay(this.classic.overLay)
                const divs = document.querySelectorAll('.css_animation')
                for(let i=0;i<divs.length;i++) {
                    divs[i].style.display = "block"
                }
            }else {
                this.map.removeLayer(this.classic.monitorLayer)
                this.map.removeOverlay(this.classic.overLay)
                const divs = document.querySelectorAll('.css_animation')
                for(let i=0;i<divs.length;i++) {
                    console.log(divs[i],i)
                    divs[i].style.display = "none"
                }
            }
        },
        //移除添加泰森多边形图层
        removeTaiSenLayer() {
            if(this.params.tysonFlag) {
                this.map.addLayer(this.classic.taiSenLayer)
            }else {
                this.map.removeLayer(this.classic.taiSenLayer)
            }
        },
        //创建泰森多边形图层
        createTaiSenLayer(year,mounth) {
            let time = year+''
            if(mounth < 10) {
                time += '0'+mounth
            }else {
                time += ''+mounth
            }
            // console.log(time,'http://121.4.131.9:8090/iserver/services/map-monitor_smwu/rest/maps/R'+time+'_water_temp')
            this.classic.taiSenLayer = new TileLayer({
                declutter: true,
                source: new TileSuperMapRest({
                    url:'http://121.4.131.9:8090/iserver/services/map-monitor_smwu/rest/maps/R'+time+'_ts',
                    warpX: true
                }),
                // projection: '4326'
            })
            this.map.addLayer(this.classic.taiSenLayer)
        },
        //设置扩散点效果
        setPlashPoint(data) {
            let classColor = ""
            if(data.waterQuality === 'Ⅴ') {
                classColor = 'other'
            }else if(data.waterQuality === '劣Ⅴ') {
                classColor = 'other'
            }else if(data.waterQuality === 'Ⅳ') {
                classColor = 'other'
            }else if(data.waterQuality === 'Ⅰ'){
                classColor = 'other'
            }else if(data.waterQuality === 'Ⅱ'){
                classColor = 'other'
            }else if(data.waterQuality === 'Ⅲ'){
                classColor = 'other'
            }else {
                return
            }
            if(this.classic.ele !== null) {
                this.classic.ele.parentNode.removeChild(this.classic.ele)
            }
            const ele = document.createElement('div')
            ele.style.display = "block"
            ele.innerHTML = `
                <div class="pulse ${classColor}"></div>
            `
            ele.className = "css_animation"
            this.classic.overLay = new Overlay({
                element: ele,
                positioning: 'center-center'
            })
            this.map.addOverlay(this.classic.overLay)
            this.classic.overLay.setPosition(transform(data.extent,'EPSG:4326','EPSG:3857'))
            this.params.ele = ele	 
            console.log('全省')
        },
        //创建掩膜图层
        createBaseLayer() {
            if(this.classic.baseLayer !== null) this.map.removeLayer(this.classic.baseLayer)
            if(this.params.city === '全省') return
            this.classic.baseLayer =  new VectorLayer({
                source: new VectorSource({
                  wrapX:false
                }),
            });
            let features = (new GeoJSON()).readFeatures(require('@/assets/json/河北省.json'))
            let _this = this
            
            features.forEach(function(element) {
                let jsonName = element.get('name')
                // console.log(element)
                if(_this.params.city === jsonName) {
                    let geom = element.getGeometry().transform('EPSG:4326','EPSG:3857')
                    // let geom = element.getGeometry()
                    element.setGeometry(geom)
                    const style = new Style({
                        fill: new Fill({
                            color: 'rgba(15,231,255,0.2)' //高亮区域填充色，可以是使用rgba
                            //color: 'rgba(29,254,210)'
                        }),
                        stroke: new Stroke({
                            color:"rgba(255,0,0,1)",
                            width:4
                        })
                    })
                // _this.citis[i].style = style
                    element.setStyle(style)
                    // console.log(jsonName);
                    // if(jsonName === "河北省" )
                    _this.classic.baseLayer.getSource().addFeature(element)
                    _this.map.getView().setCenter(transform(element.values_.center,"EPSG:4326","EPSG:3857"))
                    _this.map.getView().setZoom(8)
                }
                
            })
            this.map.addLayer(this.classic.baseLayer);
        },
        //水质分类分析显示
        waterClassify() {
            // this.getDataMonitorData()
            this.classic.show = true
            this.createTaiSenLayer(this.params.year,this.params.month)
            this.createMoitorLayer()
            console.log(this.classic.monitors)
            if(this.params.city !== '全省') {
                for(let i in this.classic.monitors) {
                    let siteStyle = null
                    if(this.classic.monitors[i].city === this.params.city) {
                        this.setPlashPoint(this.classic.monitors[i])
                        // console.log(this.classic.monitors[i].extent)
                        
                        if(this.classic.monitors[i].waterQuality === 'Ⅰ') {
                            siteStyle = new Style({
                                image: new Icon({
                                    src:this.classic.classify.wclassify1
                                })
                            })
                        }else if(this.classic.monitors[i].waterQuality === 'Ⅱ') {
                            siteStyle = new Style({
                                image: new Icon({
                                    src:this.classic.classify.wclassify2
                                })
                            })
                        }else if(this.classic.monitors[i].waterQuality === 'Ⅲ') {
                            siteStyle = new Style({
                                image: new Icon({
                                    src:this.classic.classify.wclassify3
                                })
                            })
                        }else if(this.classic.monitors[i].waterQuality === 'Ⅳ') {
                            siteStyle = new Style({
                                image: new Icon({
                                    src:this.classic.classify.wclassify4
                                })
                            })
                        }else if(this.classic.monitors[i].waterQuality === 'Ⅴ') {
                            siteStyle = new Style({
                                image: new Icon({
                                    src:this.classic.classify.wclassify5
                                })
                            })
                        }else {
                            siteStyle = new Style({
                                image: new Icon({
                                    src:this.classic.classify.wclassifyl5
                                })
                            })
                        }
                        // console.log(classify,this.classify.wclassify2)
                    
                        const siteSource = this.classic.monitorLayer.getSource()
                        let feature = new Feature({
                            geometry: new Point(transform(this.classic.monitors[i].extent,"EPSG:4326","EPSG:3857")),
                        })
                        
                        feature.setStyle(siteStyle)
                        siteSource.addFeature(feature)
                        // if(this.params.city === this.classic.monitors[i].city) siteSource.addFeature(feature)
                    }          
                
                }
            }else {
                for(let i in this.classic.monitors) {
                    let siteStyle = null,feature = null   
                        // console.log(this.classic.monitors[i].extent)  
                        if(this.params.classic !== "全部") {
                            if(this.classic.monitors[i].waterQuality === 'Ⅰ' && this.params.classic === 'Ⅰ') {
                                siteStyle = new Style({
                                    image: new Icon({
                                        src:this.classic.classify.wclassify1
                                    })
                                })
                                const siteSource = this.classic.monitorLayer.getSource()
                                feature = new Feature({
                                    geometry: new Point(transform(this.classic.monitors[i].extent,"EPSG:4326","EPSG:3857")),
                                })
                                feature.setStyle(siteStyle)
                                siteSource.addFeature(feature)
                                this.setPlashPoint(this.classic.monitors[i])
                            }else if(this.classic.monitors[i].waterQuality === 'Ⅱ' && this.params.classic === 'Ⅱ') {
                                siteStyle = new Style({
                                    image: new Icon({
                                        src:this.classic.classify.wclassify2
                                    })
                                })
                                const siteSource = this.classic.monitorLayer.getSource()
                                feature = new Feature({
                                    geometry: new Point(transform(this.classic.monitors[i].extent,"EPSG:4326","EPSG:3857")),
                                })
                                feature.setStyle(siteStyle)
                                siteSource.addFeature(feature)
                                this.setPlashPoint(this.classic.monitors[i])
                            }else if(this.classic.monitors[i].waterQuality === 'Ⅲ' && this.params.classic === 'Ⅲ') {
                                siteStyle = new Style({
                                    image: new Icon({
                                        src:this.classic.classify.wclassify3
                                    })
                                })
                                const siteSource = this.classic.monitorLayer.getSource()
                                feature = new Feature({
                                    geometry: new Point(transform(this.classic.monitors[i].extent,"EPSG:4326","EPSG:3857")),
                                })
                                feature.setStyle(siteStyle)
                                siteSource.addFeature(feature)
                                this.setPlashPoint(this.classic.monitors[i])

                            }else if(this.classic.monitors[i].waterQuality === 'Ⅳ' && this.params.classic === 'Ⅳ') {
                                siteStyle = new Style({
                                    image: new Icon({
                                        src:this.classic.classify.wclassify4
                                    })
                                })
                                const siteSource = this.classic.monitorLayer.getSource()
                                feature = new Feature({
                                    geometry: new Point(transform(this.classic.monitors[i].extent,"EPSG:4326","EPSG:3857")),
                                })
                                feature.setStyle(siteStyle)
                                siteSource.addFeature(feature)
                                this.setPlashPoint(this.classic.monitors[i])

                            }else if(this.classic.monitors[i].waterQuality === 'Ⅴ' && this.params.classic === 'Ⅴ') {
                                siteStyle = new Style({
                                    image: new Icon({
                                        src:this.classic.classify.wclassify5
                                    })
                                })
                                const siteSource = this.classic.monitorLayer.getSource()
                                feature = new Feature({
                                    geometry: new Point(transform(this.classic.monitors[i].extent,"EPSG:4326","EPSG:3857")),
                                })
                                feature.setStyle(siteStyle)
                                siteSource.addFeature(feature)
                                this.setPlashPoint(this.classic.monitors[i])

                            }else if(this.classic.monitors[i].waterQuality === '劣Ⅴ' && this.params.classic === '劣Ⅴ'){
                                siteStyle = new Style({
                                    image: new Icon({
                                        src:this.classic.classify.wclassifyl5
                                    })
                                })
                                const siteSource = this.classic.monitorLayer.getSource()
                                feature = new Feature({
                                    geometry: new Point(transform(this.classic.monitors[i].extent,"EPSG:4326","EPSG:3857")),
                                })
                                feature.setStyle(siteStyle)
                                siteSource.addFeature(feature)
                                this.setPlashPoint(this.classic.monitors[i])

                            }
                        }else {
                            if(this.classic.monitors[i].waterQuality === 'Ⅰ') {
                                siteStyle = new Style({
                                    image: new Icon({
                                        src:this.classic.classify.wclassify1
                                    })
                                })
                            }else if(this.classic.monitors[i].waterQuality === 'Ⅱ') {
                                siteStyle = new Style({
                                    image: new Icon({
                                        src:this.classic.classify.wclassify2
                                    })
                                })
                            }else if(this.classic.monitors[i].waterQuality === 'Ⅲ') {
                                siteStyle = new Style({
                                    image: new Icon({
                                        src:this.classic.classify.wclassify3
                                    })
                                })
                            }else if(this.classic.monitors[i].waterQuality === 'Ⅳ') {
                                siteStyle = new Style({
                                    image: new Icon({
                                        src:this.classic.classify.wclassify4
                                    })
                                })
                            }else if(this.classic.monitors[i].waterQuality === 'Ⅴ') {
                                siteStyle = new Style({
                                    image: new Icon({
                                        src:this.classic.classify.wclassify5
                                    })
                                })
                            }else {
                                siteStyle = new Style({
                                    image: new Icon({
                                        src:this.classic.classify.wclassifyl5
                                    })
                                })
                            }
                            // console.log(classify,this.classify.wclassify2)
                        
                            const siteSource = this.classic.monitorLayer.getSource()
                            let feature = new Feature({
                                geometry: new Point(transform(this.classic.monitors[i].extent,"EPSG:4326","EPSG:3857")),
                            })
                        
                            feature.setStyle(siteStyle)
                            siteSource.addFeature(feature)
                            this.setPlashPoint(this.classic.monitors[i])

                        }
                        
                        // console.log(classify,this.classify.wclassify2)
                    
                        
                        
                        // if(this.params.city === this.classic.monitors[i].city) siteSource.addFeature(feature)
                             
                
                }
            }

            this.createBaseLayer()
        },
        //创建分类站点图层
        createMoitorLayer () {
            this.classic.monitorLayer = new VectorLayer({
                source: new VectorSource()
            })
            this.map.addLayer(this.classic.monitorLayer)
        },
        //获取所有水质监测站的数据
        getDataMonitorData() {
            this.clearQualityAnalysisData()
            this.$store.commit('showLoading')
            console.log(this.params.year+"-"+this.params.month,this.params.year+"-"+(parseInt(this.params.month)+1))
            request.get('waterenv-monitor/auto/data/getHistory',{
                params: {
                    beginTime: this.params.year+"-"+this.params.month,
                    endTime: this.params.year+"-"+(parseInt(this.params.month)+1),
                   /*  beginTime: "2021-08",
                    endTime: '2021-09', */
                }
            }).then(res => {
                console.log(res)
                /* for(let i in res.rows) {
                    res.rows[i].flag = false
                } */
                // this.classic.monitors = res.rows
                this.classic.monitors.splice(0)
                let data = res.rows
                this.classic.numClassic = {
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 0,
                    "6": 0
                }
                for(let i in data) {
                    if(data[i].city === null) continue
                    this.classic.monitors.push({city: data[i].city,monitorDate: data[i].monitorDate,province: data[i].province,
                    riverName: data[i].riverName,sectionName: data[i].sectionName,waterQuality: data[i].waterQuality,
                    extent:[data[i].longitude,data[i].latitude]})
                    console.log(data[i].waterQuality)
                    
                    if(data[i].city === this.params.city) {
                        if(data[i].waterQuality === 'Ⅰ') {
                            this.classic.numClassic["1"]++
                        }else if(data[i].waterQuality === 'Ⅱ') {
                            this.classic.numClassic["2"]++
                        }else if(data[i].waterQuality === 'Ⅲ') {
                            this.classic.numClassic["3"]++
                        }else if(data[i].waterQuality === 'Ⅳ') {
                            this.classic.numClassic["4"]++
                        }else if(data[i].waterQuality === 'Ⅴ') {
                            this.classic.numClassic["5"]++
                        }else{
                            this.classic.numClassic["6"]++
                        }
                    }
                }
                console.log(this.classic.monitors)
                this.chartChangeOneRenderer()
                this.chartChangeTwoRenderer()
                this.waterClassify()
                this.$store.commit('hideLoading')
            })

        },
        //创建图表3
        chartChangeThreeRenderer() {
            let chart = this.$echarts.init(document.querySelector('.chart-change-three'),'dark',{width:'350%',height:'260%'})
            chart.setOption({
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                    // Use axis to trigger tooltip
                    type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
                    }
                },
                legend: {},
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value'
                },
                yAxis: {
                    // type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                series: [
                    {
                    name: 'Direct',
                    type: 'bar',
                    stack: 'total',
                    label: {
                        show: true
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: [320, 302, 301, 334, 390, 330, 320]
                    },
                    {
                    name: 'Mail Ad',
                    type: 'bar',
                    stack: 'total',
                    label: {
                        show: true
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: [120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                    name: 'Affiliate Ad',
                    type: 'bar',
                    stack: 'total',
                    label: {
                        show: true
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: [220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                    name: 'Video Ad',
                    type: 'bar',
                    stack: 'total',
                    label: {
                        show: true
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: [150, 212, 201, 154, 190, 330, 410]
                    },
                    {
                    name: 'Search Engine',
                    type: 'bar',
                    stack: 'total',
                    label: {
                        show: true
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: [820, 832, 901, 934, 1290, 1330, 1320]
                    }
                ]
            })
        },
        //创建图表2
        chartChangeTwoRenderer() {
            let chart = this.$echarts.init(document.querySelector('.chart-change-two'),'dark',{width:'360%',height:'250%'})
            chart.setOption({
                backgroundColor: 'rgba(0,0,0,0)',
                tooltip: {
                    trigger: 'item'
                },
                title: {
                    text: this.params.city+'各类水质占比',
                    textStyle: {
                        fontSize: 16,
                    },
                    left: 'center'
                },
                /* grid: {
                    top: '60px',
                    left: '30px',
                    right: '10px',
                    bottom: '30px'
                }, */
                legend: {
                    top: '10%',
                    left: '3%',
                    orient: 'vertical'
                },
                series: [
                    {
                    name: '水质类别',
                    type: 'pie',
                    radius: ['40%', '75%'],
                    center: ['65%','56%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        normal: {
                            borderColor: 'rgba(0,0,0,0.2)',
                            borderWidth: 2,
                            borderRadius: 8
                        }
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                        show: true,
                        fontSize: '40',
                        fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        /* { value: 1048, name: 'Search Engine',itemStyle:{color: 'rgb(60,133,252)'} },
                        { value: 735, name: 'Direct',itemStyle:{color: 'rgb(219,78,117)'} },
                        { value: 580, name: 'Email',itemStyle:{color: 'rgb(161,41,244)'} },
                        { value: 484, name: 'Union Ads',itemStyle:{color: 'rgb(65,189,173)'} },
                        { value: 300, name: 'Video Ads',itemStyle:{color: 'rgb(236,173,68)'} } */
                        { value: this.classic.numClassic["1"], name: 'Ⅰ类('+Math.round(this.classic.numClassic["1"]/(this.classic.numClassic["2"]+this.classic.numClassic["3"]+this.classic.numClassic["4"]+this.classic.numClassic["1"]+this.classic.numClassic["5"]+this.classic.numClassic["6"])*100)+"%)",itemStyle:{color: 'rgb(56,150,253)'}},
                        { value: this.classic.numClassic["2"], name: 'Ⅱ类('+Math.round(this.classic.numClassic["2"]/(this.classic.numClassic["2"]+this.classic.numClassic["3"]+this.classic.numClassic["4"]+this.classic.numClassic["1"]+this.classic.numClassic["5"]+this.classic.numClassic["6"])*100)+"%)",itemStyle:{color: 'rgb(79,198,77)'}},
                        { value: this.classic.numClassic["3"], name: 'Ⅲ类('+Math.round(this.classic.numClassic["3"]/(this.classic.numClassic["2"]+this.classic.numClassic["3"]+this.classic.numClassic["4"]+this.classic.numClassic["1"]+this.classic.numClassic["5"]+this.classic.numClassic["6"])*100)+"%)",itemStyle:{color: 'rgb(255,204,0)'}},
                        { value: this.classic.numClassic["4"], name: 'Ⅳ类('+Math.round(this.classic.numClassic["4"]/(this.classic.numClassic["2"]+this.classic.numClassic["3"]+this.classic.numClassic["4"]+this.classic.numClassic["1"]+this.classic.numClassic["5"]+this.classic.numClassic["6"])*100)+"%)",itemStyle:{color: 'rgb(255,136,0)'}},
                        { value: this.classic.numClassic["5"], name: 'Ⅴ类('+Math.round(this.classic.numClassic["5"]/(this.classic.numClassic["2"]+this.classic.numClassic["3"]+this.classic.numClassic["4"]+this.classic.numClassic["1"]+this.classic.numClassic["5"]+this.classic.numClassic["6"])*100)+"%)",itemStyle:{color: 'rgb(255,0,0)'}},
                        { value: this.classic.numClassic["6"], name: '劣Ⅴ类('+Math.round(this.classic.numClassic["6"]/(this.classic.numClassic["2"]+this.classic.numClassic["3"]+this.classic.numClassic["4"]+this.classic.numClassic["1"]+this.classic.numClassic["5"]+this.classic.numClassic["6"])*100)+"%)",itemStyle:{color: 'rgb(160,37,0)'}},
                       /*  { value: 484, name: 'Union Ads'},
                        { value: 300, name: 'Video Ads'} */
                    ]
                    }
                ]
            })
        },
        //创建图表1
        chartChangeOneRenderer() {
            let chart = this.$echarts.init(document.querySelector('.chart-change-one'),'dark',{width:'390%',height:'250%'})
            let data = this.classic.monitors
            this.classic.oneChart.x.splice(0)
            this.classic.oneChart.y.splice(0)
            for(let i in data) {
                if(data[i].city === this.params.city) {
                    this.classic.oneChart.x.push(data[i].sectionName)
                    if(data[i].waterQuality === 'Ⅱ') {
                        this.classic.oneChart.y.push(2)
                    }else if(data[i].waterQuality === 'Ⅲ') {
                        this.classic.oneChart.y.push(3)
                    }else if(data[i].waterQuality === 'Ⅳ') {
                        this.classic.oneChart.y.push(4)
                    }else if(data[i].waterQuality === 'Ⅰ') {
                        this.classic.oneChart.y.push(1)
                    }else if(data[i].waterQuality === 'Ⅴ') {
                        this.classic.oneChart.y.push(5)
                    }else {
                        this.classic.oneChart.y.push(6)
                    }
                }
            }

            const _this = this
            chart.setOption({
                backgroundColor:'rgba(128, 128, 128, 0)',
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                    type: 'shadow'
                    }
                },
                title: {
                    text: _this.params.city+'各断面水质类别对比',
                    textStyle: {
                        fontSize: 16,
                    },
                    left: 'center'
                },
                grid: {
                    top: '50px',
                    left: '30px',
                    right: '10px',
                    bottom: '30px'
                },
                legend: {
                    data: ['line', 'bar'],
                    textStyle: {
                    color: '#ccc'
                    }
                },
                xAxis: {
                    data: this.classic.oneChart.x,
                    axisLine: {
                        lineStyle: {
                            color: '#ccc'
                        },
                        fontSize: 6
                    },
                    axisLabel: {
                        fontSize: 8,
                        interval:0,
                        rotate:25,
                        show: true,
                        color: '#fff'
                    },
                    splitLine: { show: false },
                },
                yAxis: {
                    name: '类别',
                    nameTextStyle: {
                        fontSize: 10
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#ccc'
                        },
                        fontSize: 10
                    },
                    type: "value",
                },
                series: [
                    {
                        //name: 'bar',
                        type: 'bar',
                        barWidth: 10,
                        /* itemStyle: {
                            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                 { offset: 0, color: "#52E5E7" },
                                { offset: 1, color: "#130CB7" }
                            ]),
                            barBorderRadius: 5
                        }, */
                        data: this.classic.oneChart.y,
                        center: ['50%','80%'],
                        itemStyle: {
                            normal: {
                                //每根柱子颜色设置
                                color: function (params) {
                                    console.log(params.value)
                                    let colorList = [
                                        new _this.$echarts.graphic.LinearGradient(
                                            1, 1, 1, 0,
                                            [
                                                { offset: 0, color: 'rgba(136,255,195,0)' },                   //柱图渐变色
                                                { offset: 1, color: 'rgba(56,150,253)' },                   //柱图渐变色
                                            ]
                                        ),
                                        new _this.$echarts.graphic.LinearGradient(
                                            1, 1, 1, 0,
                                            [
                                                { offset: 0, color: 'rgba(79,198,77,0.4)' },                   //柱图渐变色
                                                { offset: 1, color: 'rgb(79,198,77)' },                   //柱图渐变色
                                            ]
                                        ),
                                        new _this.$echarts.graphic.LinearGradient(
                                            1, 1, 1, 0,
                                            [
                                                { offset: 0, color: 'rgba(255,160,0,0.4)' },                   //柱图渐变色
                                                { offset: 1, color: 'rgb(255,160,0)' },                   //柱图渐变色
                                            ]
                                        ),
                                        new _this.$echarts.graphic.LinearGradient(
                                            1, 1, 1, 0,
                                            [
                                                { offset: 0, color: 'rgba(255,104,0,0.4)' },                   //柱图渐变色
                                                { offset: 1, color: 'rgba(255,104,0)' },                   //柱图渐变色
                                            ]
                                        ),
                                        new _this.$echarts.graphic.LinearGradient(
                                            1, 1, 1, 0,
                                            [
                                                { offset: 0, color: 'rgba(255,0,0,0.4)' },                   //柱图渐变色
                                                { offset: 1, color: 'rgb(255,0,0)' },                   //柱图渐变色
                                            ]
                                        ),
                                        new _this.$echarts.graphic.LinearGradient(
                                            1, 1, 1, 0,
                                            [
                                                { offset: 0, color: 'rgba(160,37,0,0.4)' },                   //柱图渐变色
                                                { offset: 1, color: 'rgb(160,37,0)' },                   //柱图渐变色
                                            ]
                                        )
                                    ];
                                    if(params.value === 2) {
                                        return colorList[1];
                                    }else if(params.value === 3) {
                                        return colorList[2]
                                    }else if(params.value === 4) {
                                        return colorList[3]
                                    }else if(params.value === 1) {
                                        return colorList[0]
                                    }else if(params.value === 5) {
                                        return colorList[4]
                                    }else {
                                        return colorList[5]
                                    }
                                },
                                barBorderRadius: 5
                            } 
                        }
                    },
                ]
            })
        }
    }
}
</script>
<style>
@keyframes warn {
0% {
transform: scale(0.3);
-webkit-transform: scale(0.3);
opacity: 0.0;
}

25% {
transform: scale(0.3);
-webkit-transform: scale(0.3);
opacity: 0.4;
}

50% {
transform: scale(0.5);
-webkit-transform: scale(0.5);
opacity: 0.7;
}

75% {
transform: scale(0.8);
-webkit-transform: scale(0.8);
opacity: 1;
}

100% {
transform: scale(1);
-webkit-transform: scale(1);
opacity: 0.0;
}
}



/* 产生动画（向外扩散变大）的圆圈 第一个圆 */
.pulse {
width: 35px;
height: 35px;
-webkit-border-radius: 50%;
-moz-border-radius: 50%;
border-radius: 50%;
z-index: 1;
opacity: 0;
-webkit-animation: warn 2s ease-out;
-moz-animation: warn 2s ease-out;
animation: warn 2s ease-out;
-webkit-animation-iteration-count: infinite;
-moz-animation-iteration-count: infinite;
animation-iteration-count: infinite;
}
/* 产生动画（向外扩散变大）的圆圈 第二个圆 */
.pulse1 {
width: 35px;
height: 35px;
-webkit-border-radius: 50%;
-moz-border-radius: 50%;
border-radius: 50%;
z-index: 1;
opacity: 0;
-webkit-animation: warn1 2s ease-out;
-moz-animation: warn1 2s ease-out;
animation: warn1 2s ease-out;
-webkit-animation-iteration-count: infinite;
-moz-animation-iteration-count: infinite;
animation-iteration-count: infinite;
}

	
.four {
	border: 4px solid rgba(255,136,0);
	box-shadow: 1px 1px 30px rgba(255,136,0); /* 阴影效果 */
}
.five {
    border: 4px solid rgba(255,0,0);
	box-shadow: 1px 1px 30px rgba(255,0,0); /* 阴影效果 */
}
.six {
    border: 4px solid rgba(160,37,0);
	box-shadow: 1px 1px 30px rgba(160,37,0); /* 阴影效果 */
}
.one {
	border: 4px solid rgba(56,151,253);
	box-shadow: 1px 1px 30px rgba(56,151,253); /* 阴影效果 */
}
.two {
    border: 4px solid rgba(43,201,253);
	box-shadow: 1px 1px 30px rgba(43,201,253); /* 阴影效果 */
}
.three {
    border: 4px solid rgba(255,205,0);
	box-shadow: 1px 1px 30px rgba(255,205,0); /* 阴影效果 */
}
.other {
    border: 4px solid rgba(13,231,253);
	box-shadow: 1px 1px 30px rgba(15,231,253);
}

</style>


<style lang="scss" scoped>
.quality-analysis2 {
    .chart-change-two {
        width: 360px;
        height: 250px;
        position: absolute;
        top: 26px;
        right: 55px;
        background: rgba(0,0,0,0.6);
        border-radius: 10px;
        padding-top: 10px;
        // box-shadow: 0px 0px 8px rgba(15,231,255)
        border: 2px solid rgb(15,231,255);
    }
    .legend-analysis {
        display: inline-block;
        padding: 20px 10px;
        background: rgba(0, 0, 0, 0.6);
        border: 1px solid rgb(15, 231, 255);
        position: absolute;
        right: 100px;
        bottom: 50px;
        border-radius: 10px;
        .color-ex {
            display: inline-block;
            width: 50px;
            height: 20px;
            border-radius: 4px;
            vertical-align: bottom;
            margin-right: 12px;
        }
    }
    .chart-change-one {
        width: 390px;
        height: 250px;
        position: absolute;
        bottom: 60px;
        left: 5px;
        background: rgba(0,0,0,0.7);
        border-radius: 10px;
        padding-top: 10px;
        // box-shadow: 0px 0px 8px rgb(15 231 255);
    }
    .chart-select {
        width: 160px;
        height: 28px;
        border-radius: 5px;
        outline: none;
        margin: 0 12px;
        background: rgba(0,0,0,0.7);
        color: rgb(15,231,255);
        font-weight: 600;
        border: 1px solid rgba(15,231,255);
    }
    .chart-change-two-container {
        width: 350px;
        height: 265px;
        position: absolute;
        top: 10px;
        right: 60px;
        
    }
    
    .chart-change-three-container {
        position: absolute;
        bottom: 10px;
        right: 60px;
        width: 350px;
        height: 380px;
       
    }
}
#quality-analysis {
    position: absolute;
    left: 0;
    width: 400px;
    height: 99%;
    background: rgba(0, 0, 0, 0.7);
    font-size: 16px;
    color: #fff;
    font-weight: 500;
    border-radius: 5px;
    box-sizing: border-box;
    border: 1px solid rgb(0,190,255,0);
    .interpolation-btn {
        width: 50%;
        display: inline-block;
        box-sizing: border-box;
        padding: 5px;
        text-align: center;
        background-color: rgb(0,0,0);
        border: 0.002rem solid rgb(4,183,233);
        border-radius: 5px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
    }
    .interpolation-btn:hover {
        box-shadow: 0px 0px 10px rgb(4 183 233);
    }
    .select {
        width: 160px;
        height: 28px;
        border-radius: 5px;
        outline: none;
        margin: 0 12px;
    }
}

</style>
