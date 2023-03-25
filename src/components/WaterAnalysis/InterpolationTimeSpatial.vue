<template>
    <div id="interpolation-time-spatail-container" style="width: 100%;height: 100%;">
        <div id="interpolation-time-spatial">
            <div class="top">
                <div style="background: rgba(0,0,0,0.7); padding: 12px 10px;">
                    <img src="../../assets/icon/interpolation.svg" alt="" style="vertical-align: sub;margin-right: 10px;">
                    <span style="display: inline-block;font-weight: 600;">水质参数分析</span>
                </div>
                <div style="background-color: rgba(2,35,70);padding: 5px 10px;font-size: 14px;text-align: center;">水质参数选择</div>
                <div style="padding: 25px 10px;background-color: rgba(0,0,0);">
                    <div class="radio-container" style="">
                        <input v-model="params.inter"  type="radio" name="gender" value="温度" class="radio" @change="changeInterpolationParam" /><span style="font-size: 13px;">温度</span>
                    </div>
                    <div class="radio-container" >
                        <input v-model="params.inter" type="radio" name="gender" value="总磷" class="radio" @change="changeInterpolationParam" /><span style="font-size: 13px;">总磷</span>
                    </div>
                    <div class="radio-container" >
                        <input v-model="params.inter" type="radio" name="gender" value="ph值" class="radio" @change="changeInterpolationParam" /><span style="font-size: 13px;">ph值</span>
                    </div>
                </div>
                <div style="background-color: rgba(2,35,70);padding: 5px 10px;font-size: 14px;text-align: center;">数据日期选择</div>
                <div style="padding: 25px 10px;background-color: rgba(0,0,0);text-align: center;">
                    <select class="select" v-model="params.year" @change="changeInterpolationParam">
                        <option style="text-align: center; border-radius: 5px;" v-for="item in years" :label="item.label" :value ="item.value" :key="item.value"></option>
                    </select>
                </div>
                <div>
                    <span class="interpolation-btn" @click="clearInterpolationData">清除</span>
                    <span class="interpolation-btn" @click="createKrigingInterpolation(params.year,mounth)">插值分析</span>
                </div>
            </div>
            <div class="chart-change-two" v-show="show.flag"></div>
        </div>
        <div class="equal-legend" v-if="show.flag">
            <span style="font-weight: 600;color: #fff;">等值线</span>
            <div style="border-bottom: 2px solid rgba(15,231,255);padding-top: 10px;"></div>
        </div>
        <div class="interpolation-legend" v-if="show.flag">
            <span class="color"></span>
            <span class="text" >
                <span style="margin-right: 325px;">低</span>
                <span>高</span>
            </span>
        </div>
        
        <div class="chart-change-container" v-show="show.flag && params.city !== '河北省'">
            <div class="chart-change" ></div>
        </div>
        <div style="text-align: center;position: absolute; left: 400px;top: 12px;">
            <select class="chart-select"  v-model="params.city" @change="changeData">
                <option style="text-align: center; border-radius: 5px;" v-for="item in cities" :label="item.label" :value ="item.value" :key="item.value"></option>
            </select>
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
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature'
import {tile,bbox} from 'ol/loadingstrategy';

import request from "../../utils/request.js"

import kriging from '@sakitam-gis/kriging'
import _default from '@sakitam-gis/kriging';

export default {
    name: 'interpolation-time-spatial',
    props: ["map","krigingPolygon","show"],
    data() {
        return {
            radio: '',
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
            cities: [
                {
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
                },{
                    value:  "河北省",
                    label: "河北省"
                }
            ],
            kriging: {
                krigingLayer: null,
                canvasLayer: null,
                baseLayer: null,
                point: {
                    values: [],
                    lngs: [],
                    lats: []
                },
                polygon: null
            },
            params: {
                year: '2021',
                city: '河北省',
                inter: '温度',
                chart: {
                    x: [],
                    y: []
                },
                chartTwo: {
                    "保定市": {
                        sum: 0,
                        index: 0
                    },
                    "廊坊市": {
                        sum: 0,
                        index: 0
                    },
                    "承德市": {
                        sum: 0,
                        index: 0
                    },
                    "唐山市": {
                        sum: 0,
                        index: 0
                    },
                    "秦皇岛市": {
                        sum: 0,
                        index: 0
                    },
                    "张家口市": {
                        sum: 0,
                        index: 0
                    },
                    "衡水市": {
                        sum: 0,
                        index: 0
                    },
                    "沧州市": {
                        sum: 0,
                        index: 0
                    },
                    "邢台市": {
                        sum: 0,
                        index: 0
                    },
                    "邯郸市": {
                        sum: 0,
                        index: 0
                    },
                    "石家庄市": {
                        sum: 0,
                        index: 0
                    },
                    "辛集": {
                        sum: 0,
                        index: 0
                    },
                    "雄安新区": {
                        sum: 0,
                        index: 0
                    }
                }
            },
            mounth: '0',
            interFlag: false,
            alpha: 97
        }
    },
    created() {
    },
    mounted() {
        // this.getWaterParamsForMonth(this.mounth)
        this.$store.state.interpolation.clearInterpolationData = this.clearInterpolationData
        this.$store.commit('setGetWaterParamsForMonth',{fun1: this.getWaterParamsForMonth,fun2: this.createKrigingInterpolation})
    },
    methods: {
        //创建掩膜图层
        createBaseLayer() {
            if(this.kriging.baseLayer !== null) this.map.removeLayer(this.kriging.baseLayer)
            this.kriging.baseLayer =  new VectorLayer({
                source: new VectorSource({
                  wrapX:false
                }),
            });
            let features = (new GeoJSON()).readFeatures(require('@/assets/json/河北省.json'))
            let _this = this
            let features2 = (new GeoJSON()).readFeatures(require('@/assets/json/河北省2.json'))
            
            if(this.params.city == '河北省') {
                features2.forEach(function(element) {
                    let jsonName = element.get('name')
                    // console.log(element)
                    let geom = element.getGeometry().transform('EPSG:4326','EPSG:3857')
                    // let geom = element.getGeometry()
                    element.setGeometry(geom)
                    const style = new Style({
                        fill: new Fill({
                            color: 'rgba(15,231,255,0.2)' //高亮区域填充色，可以是使用rgba
                            //color: 'rgba(29,254,210)'
                        }),
                        stroke: new Stroke({
                            color:"rgba(10,231,255)",
                            width:2
                        })
                    })
                // _this.citis[i].style = style
                    element.setStyle(style)
                    // console.log(jsonName);
                    // if(jsonName === "河北省" )
                    _this.kriging.baseLayer.getSource().addFeature(element)
                    _this.map.getView().setCenter(transform([115.4,39.35],"EPSG:4326","EPSG:3857"))
                    _this.map.getView().setZoom(7)
                
                    
                })
            }else {
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
                        _this.kriging.baseLayer.getSource().addFeature(element)
                        _this.map.getView().setCenter(transform(element.values_.center,"EPSG:4326","EPSG:3857"))
                        _this.map.getView().setZoom(8)
                    }
                    
                })
            }
            
            
            this.map.addLayer(this.kriging.baseLayer);
        },
        //插值参数发生变化
        changeInterpolationParam() {
            this.$store.state.year = this.params.year
            if(this.show.flag) {
                this.clearInterpolationData()
                console.log("11111111")
                request.get('waterenv-monitor/auto/data/getHistory',{
                    params: {
                        beginTime: this.params.year+'-'+(this.mounth+1),
                        endTime: this.params.year+'-'+(this.mounth+2)
                    }
                }).then(res => {
                    console.log(res)
                   /*  if(this.kriging.krigingLayer !== null) this.map.removeLayer(this.kriging.krigingLayer)
                    this.kriging.krigingLayer = new VectorLayer({
                            source:new VectorSource(),
                    }); */
                    this.params.chart.x.splice(0)
                    this.params.chart.y.splice(0)
                    for(let i in res.rows) {
                        if(this.params.city === res.rows[i].city) {
                            this.params.chart.x.push(res.rows[i].sectionName)
                            if(this.params.inter === "总磷") {
                                if(res.rows[i].tp == -1) {
                                    this.params.chart.y.push(0)
                                }else {
                                    this.params.chart.y.push(res.rows[i].tp)
                                }
                            }else if(this.params.inter === "温度") {
                                this.params.chart.y.push(res.rows[i].waterTemp)
                            }else if(this.params.inter === 'ph值') {
                                this.params.chart.y.push(res.rows[i].ph)
                            }
                        }
                    }
                    if(this.params.inter === "总磷") {
                        this.alpha = 11
                    }else if(this.params.inter === "温度") {
                        this.alpha = 97
                    }else if(this.params.inter === 'ph值') {
                        this.alpha = 12
                    }
                    this.createKrigingInterpolation()
                })
                this.createBaseLayer()
            } 
        },
        //清除数据
        clearInterpolationData() {
            clearInterval(this.$store.state.interval)
            this.show.flag = false
            this.map.removeLayer(this.kriging.canvasLayer)
            this.map.removeLayer(this.kriging.krigingLayer)
            this.map.removeLayer(this.kriging.baseLayer)
            this.kriging.canvasLayer = null
            this.kriging.krigingLayer = null
            this.kriging.baseLayer = null


        },
        //获取每个月的站点数据
        async getWaterParamsForMonth(mounth) {
            /* let params = {
                    beginTime: this.params.year+'-3',
                    endTime: this.params.year+'-4'
                } */
            let params 
            if(mounth !== 11) {
                params = {
                    beginTime: this.params.year+'-'+(mounth+1),
                    endTime: this.params.year+'-'+(mounth+2)
                }
            }else {
                params = {
                    beginTime: this.params.year+'-'+(mounth+1),
                    endTime: (parseInt(this.params.year)+1)+'-'+1
                }
            }
            console.log(params)
            await request.get('waterenv-monitor/auto/data/getHistory',{
                params: params
            }).then(res => {
                console.log(res)
               /*  if(this.kriging.krigingLayer !== null) this.map.removeLayer(this.kriging.krigingLayer)
                this.kriging.krigingLayer = new VectorLayer({
                        source:new VectorSource(),
                }); */

                //清空上一次数据
                for(let key in this.params.chartTwo) {
                    this.params.chartTwo[key].sum = 0
                    this.params.chartTwo[key].index = 0
                }
                this.params.chart.x.splice(0)
                this.params.chart.y.splice(0)
                for(let i in res.rows) {
                    if(this.params.inter === "总磷") {
                        //获取各市数据
                        if(res.rows[i].tp == -1) {
                            this.params.chartTwo[res.rows[i].city].sum += 0
                        }else {
                            this.params.chartTwo[res.rows[i].city].sum += res.rows[i].tp
                        }
                        this.params.chartTwo[res.rows[i].city].index++
                    }else if(this.params.inter === "温度") {
                        //获取各市数据
                        console.log(res.rows[i].city)
                        this.params.chartTwo[res.rows[i].city].sum += res.rows[i].waterTemp
                        this.params.chartTwo[res.rows[i].city].index++
                    }else if(this.params.inter === 'ph值') {
                        //获取各市数据
                        this.params.chartTwo[res.rows[i].city].sum += res.rows[i].ph
                        this.params.chartTwo[res.rows[i].city].index++
                    }
                    if(this.params.city === res.rows[i].city) {
                        this.params.chart.x.push(res.rows[i].sectionName)
                        if(this.params.inter === "总磷") {
                            if(res.rows[i].tp == -1) {
                                this.params.chart.y.push(0)
                            }else {
                                this.params.chart.y.push(res.rows[i].tp)
                            }
                            //获取各市总值
                            this.params.chartTwo[res.rows[i].city].sum += res.rows[i].tp
                            this.params.chartTwo[res.rows[i].city].index++
                        }else if(this.params.inter === "温度") {
                            this.params.chart.y.push(res.rows[i].waterTemp)
                            //获取各市总值
                            this.params.chartTwo[res.rows[i].city].sum += res.rows[i].waterTemp
                            this.params.chartTwo[res.rows[i].city].index++
                        }else if(this.params.inter === 'ph值') {
                            this.params.chart.y.push(res.rows[i].ph)
                            //获取各市总值
                            this.params.chartTwo[res.rows[i].city].sum += res.rows[i].ph
                            this.params.chartTwo[res.rows[i].city].index++
                        }
                    }

                    
                }
                if(this.show.flag) {
                    this.chartChangeRenderer()
                    this.chartChangeTwoRenderer()
                }
            })
        },
        //建立克里金插值图层
        createKrigingLayer(year,mounth) {
            let time = year+''
            if(mounth < 10) {
                time += '0'+mounth
            }else {
                time += ''+mounth
            }

            let interE = 'water_temp'
            if(this.params.inter === '总磷') {
                interE = 'tp'
            }else if(this.params.inter === 'ph值') {
                interE = 'ph'
            }
            console.log(time,'http://121.4.131.9:8090/iserver/services/map-monitor_smwu/rest/maps/R'+time+'_'+interE)
            this.kriging.krigingLayer = new TileLayer({
                declutter: true,
                source: new TileSuperMapRest({
                    url:'http://121.4.131.9:8090/iserver/services/map-monitor_smwu/rest/maps/R'+time+'_'+interE,
                    warpX: true
                }),
                // projection: '4326'
            })
            this.map.addLayer(this.kriging.krigingLayer)
        },
        
        //建立克里金插值
        createKrigingInterpolation(year,mounth) {
            console.log(this.map)
            this.show.flag = true
            
            if(this.kriging.krigingLayer !== null) this.map.removeLayer(this.kriging.krigingLayer)
            this.getWaterParamsForMonth(this.mounth)
            this.createKrigingLayer(parseInt(year),parseInt(mounth+1))
            /*const extent = [transform([113.06,36.01],"EPSG:4326","EPSG:3857")[0],transform([113.06,36.01],"EPSG:4326","EPSG:3857")[1],transform([119.9,42.6],"EPSG:4326","EPSG:3857")[0],transform([119.9,42.6],"EPSG:4326","EPSG:3857")[1]]
            let selectedFeatures = []
            this.kriging.krigingLayer.getSource().forEachFeatureIntersectingExtent(extent, (feature)=> {
				selectedFeatures.push(feature);
			}); 
            console.log(extent)
            this.drawKriging(extent,selectedFeatures) */
            this.createBaseLayer()

        },
        /* drawKriging(extent,selectedFeatures) {
            this.kriging.point.values.splice(0)
            this.kriging.point.lngs.splice(0)
            this.kriging.point.lats.splice(0)
            selectedFeatures.forEach(feature=>{
                this.kriging.point.values.push(feature.values_.value)
                this.kriging.point.lngs.push(feature.values_.geometry.flatCoordinates[0])
                this.kriging.point.lats.push(feature.values_.geometry.flatCoordinates[1])
            });
            let params={
			    mapCenter:[117.5,39.35],
			    maxValue:100,
			    krigingModel:'spherical',//model还可选'gaussian','spherical' exponential
			    krigingSigma2: 0,
			    krigingAlpha: this.alpha,
			    canvasAlpha:0.95,//canvas图层透明度
			    colors: 
                     [ "rgb(0,15,255)", "rgb(0,65,255)", "rgb(0,129,255)", "rgb(0,191,254)", "rgb(0,240,255)", "#ffffbf",
			        "#fee08b", "#fdae61", "#f46d43", "#d73027", "#a50026"
                   ] ,
			};
            let values = this.kriging.point.values,lngs = this.kriging.point.lngs,lats = this.kriging.point.lats
            console.log(values,lngs,lats)
            let variogram=kriging.train(values,lngs,lats,
			            params.krigingModel,params.krigingSigma2,params.krigingAlpha);
            // let variogram=kriging.train(values.slice(0,40),lngs.slice(0,40),lats.slice(0,40),
			            // params.krigingModel,params.krigingSigma2,params.krigingAlpha);
            let polygons= [];
           

            for(let i in this.krigingPolygon[0][0]) {
                polygons.push([this.krigingPolygon[0][0][i][0],this.krigingPolygon[0][0][i][1]])
            }
            for(let i in this.krigingPolygon[1][0]) {
                polygons.push([this.krigingPolygon[1][0][i][0],this.krigingPolygon[1][0][i][1]])
            }
           
            console.log(polygons)

            console.log([polygons],variogram,(extent[2]-extent[0])/400)
            let grid = kriging.grid([polygons],variogram,(extent[2]-extent[0])/250);
            console.log(grid)
			
			let dragboxExtent=extent;
            //移除已有图层
            if (this.kriging.canvasLayer !== null){
                this.map.removeLayer(this.kriging.canvasLayer);
            }
            this.kriging.canvasLayer =  new ImageLayer({
                source: new ImageCanvas({
                    canvasFunction:(extent, resolution, pixelRatio, size, projection) =>{
                        let canvas = document.createElement('canvas');
                        canvas.width = size[0];
                        canvas.height = size[1];
                        canvas.style.display='block';
                        //设置canvas透明度
                        canvas.getContext('2d').globalAlpha=params.canvasAlpha;  
                        //使用分层设色渲染
                       
                        kriging.plot(canvas,grid,
                            [extent[0],extent[2]],[extent[1],extent[3]],params.colors);

                        return canvas;
                    }
                })
            })
            this.chartChangeRenderer()
            this.chartChangeTwoRenderer()
            //向map添加图层
            this.map.addLayer(this.kriging.canvasLayer);
        }, */
        //创建图表2
        chartChangeTwoRenderer() {
            let x = [],y = []
            for(let key in this.params.chartTwo) {
                x.push(key)
                if(this.params.chartTwo[key].index === 0) {
                    y.push(0)
                }else {
                    y.push((parseFloat(this.params.chartTwo[key].sum)/this.params.chartTwo[key].index).toFixed(1))
                }
            }
            console.log(x,y)
            let chart = this.$echarts.init(document.querySelector('.chart-change-two'),'dark',{width:'400%',height:'300%'})
            chart.setOption({
                title: {
                    text: '河北省各市'+this.params.inter+'平均值对比',
                    textStyle: {
                        fontSize: 16,
                    },
                    left: 'left'
                },
                grid: {
                    top: '12%',
                    left: '2%',
                    right: '2%',
                    bottom: '3%',
                    containLabel: true
                },
                backgroundColor:'rgba(128, 128, 128, 0)',
                xAxis:{
                    type:'category',
                    data: x,
                    axisLine: {
                        lineStyle: {
                            color: '#ccc'
                        },
                        fontSize: 6
                    },
                    axisLabel: {
                        fontSize: 8,
                        interval:0,
                        rotate:15,
                        show: true,
                        color: '#fff'
                    },
                },
                yAxis:{
                    type:'value'
                },
                series:[
                    {
                        type:'line',
                        data: y,
                        markPoint: {
                            data: [
                                {
                                    type: 'max', 
                                    name: '最大值'
                                },
                                {
                                    type: 'min', 
                                    name: '最小值'
                                },
                            ],
                            symbolSize: 40,
                            itemStyle: {
                                normal: {
                                    color: "rgb(15,231,255)",
                                    label: {
                                        show: true,
                                        color: '#fff'
                                    }
                                }
                            }
                        },
                        markLine: {
                            data: [
                                {
                                    type: 'average', 
                                    name: '平均值'
                                }
                            ],
                            lineStyle: {
                                color: "rgb(15,231,255)"
                            }
                        },
                        smooth:true,
                        lineStyle:{
                            color: 'rgb(15,231,255)',
                            //type: 'dashed'//可选值还有 dotted  solid
                        }
                    }
                ]
            })
        },
        //创建图表
        chartChangeRenderer() {
            // console.log(this.params.chartTwo)
            console.log(this.params.chart)
            let chart = this.$echarts.init(document.querySelector('.chart-change'),'dark',{width:'400%',height:'280%'})
            chart.setOption({
                backgroundColor:'rgba(128, 128, 128, 0)',
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                    type: 'shadow'
                    }
                },
                title:{
                    text: this.params.city+'各断面'+this.params.inter,
                    textStyle: {
                        fontSize: 16,
                    },
                    left: 'left'
                },
                grid: {
                    top: '40px',
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
                    data: this.params.chart.x,
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
                    name: this.params.inter,
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
                        itemStyle: {
                            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                /* { offset: 0, color: '#14c8d4' },
                                { offset: 1, color: '#43eec6' } */
                                 { offset: 0, color: "#52E5E7" },
                                { offset: 1, color: "#130CB7" }
                            ]),
                            //borderRadius: 5,
                            barBorderRadius: 5
                        },
                        data: this.params.chart.y,
                        center: ['50%','80%'],
                    },
                ]
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.chart-change-container {
    position: absolute;
    right: 48px;
    top: 0px;
    background: rgb(0,0,0,0.8);
    border-radius: 10px;
    color: #fff;
    padding: 10px 5px;
    border: 2px solid rgb(15,231,255);
}
.chart-change-two {
    background: rgba(0,0,0,0.6);
    border-radius: 10px;
    padding-top: 128px;
} 
.equal-legend {
    width: 121px;
    position: absolute;
    right: 58px;
    bottom: 130px;
    padding: 10px 20px;
    text-align: center;
}
.interpolation-legend {
    width: 380px;
    position: absolute;
    right: 58px;
    bottom: 55px;
    border-radius: 6px;
    box-sizing: border-box;
    padding: 10px;
    .color {
        display: inline-block;
        border-radius: 8px;
        width: 360px;
        height: 14px;
        background-image: linear-gradient(to left,#a50026,#d73027,#f46d43,#fdae61,#fee08b,#ffffbf,rgb(0,129,255), rgb(0,65,255),rgb(0,15,255) );
    }
    .text {
        display: inline-block;
        margin-left: 5px;
        font-weight: 600;
        font-size: 13px;
        span {
            color: #fff;
            width: 100%;
        }
    }
}
#interpolation-time-spatial {
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
        width: 200px;
        height: 28px;
        border-radius: 5px;
        outline: none;
    }
    .radio-container {
        margin: 0 34px;
        display: inline-block;
        .radio {
            width: 18px;
            height: 18px;
            vertical-align: sub;
        }
    }
    // 图表
    .chart-change {
        width: 100%;
        height: 310px;
    }
    
}
</style>

