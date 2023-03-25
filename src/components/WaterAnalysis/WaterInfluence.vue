<template>
    <div id="water-influence">
        <div id="water-influence2">
            <div style="background: rgba(0,0,0,0.7); padding: 12px 10px;">
                <img src="../../assets/icon/waterInfluence(1).svg" alt="" style="vertical-align: middle;margin-right: 10px;">
                <span style="display: inline-block;font-weight: 600;">相关性分析</span>
            </div>
            <div style="background-color: rgba(2,35,70);padding: 5px 10px;font-size: 14px;text-align: center;">水质参数选择</div>
            <div style="padding: 25px 10px;background-color: rgb(0, 0, 0);text-align: center;">
                <select class="select" style="width: 150px;height: 30px;" v-model="influence.param1" >
                    <option style="text-align: center; border-radius: 5px;" v-for="item in params" :label="item.label" :value ="item.value" :key="item.value"></option>
                </select>
                <select class="select" style="width: 150px;height: 30px;" v-model="influence.param2" >
                    <option style="text-align: center; border-radius: 5px;" v-for="item in params" :label="item.label" :value ="item.value" :key="item.value"></option>
                </select>
            </div>
            <div style="background-color: rgba(2,35,70);padding: 5px 10px;font-size: 14px;text-align: center;">数据日期选择</div>
            <div style="padding: 25px 10px;background-color: rgba(0,0,0);text-align: center;">
                <!-- <select class="select" v-model="params.year"  @change="changeData">
                    <option style="text-align: center; border-radius: 5px;" v-for="item in years" :label="item.label" :value ="item.value" :key="item.value"></option>
                </select>
                <select class="select" v-model="params.month"  @change="changeData">
                    <option style="text-align: center; border-radius: 5px;" v-for="item in months" :label="item.label" :value ="item.value" :key="item.value"></option>
                </select> -->
                <el-date-picker
                    v-model="influence.time"
                    type="month"
                    placeholder="选择月份"
                    value-format="YYYY-MM"
                    />
            </div>
            <div>
                <span class="interpolation-btn" @click="clearWaterInfluence">清除</span>
                <span class="interpolation-btn" @click="paramInfluence">相关性分析</span>
            </div>
            <div class="correlation" style="padding: 20px 5px;margin-top: 35px;text-align: center;" v-show="influence.chartFlag">
                <span style="font-weight: 800;">相关性系数为：<span style="color: rgb(15,231,255);">{{influence.correlation}}</span></span>
            </div>
            <div class="influence-chart" v-show="influence.chartFlag" ></div>
            
        </div>
        <div style="text-align: center;position: absolute; left: 400px;top: 12px;">
            <select class="chart-select"  v-model="influence.city" @change="createBaseLayer">
                <option style="text-align: center; border-radius: 5px;" v-for="item in cities" :label="item.label" :value ="item.value" :key="item.value"></option>
            </select>
        </div>
    </div>
</template>

<script>

import water from '../../assets/icon/water.svg'
import closeW from "../../assets/icon/closeW.svg"


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
import qs from 'qs'
import ecStat from 'echarts-stat'

export default {
    name: 'water-influence',
    props: ['map'],
    data() {
        return {
            closeW,
            influence: {
                monitors: null,
                monitors2: [],
                monitorLayer: null,
                water,
                overLay: null,
                param1: 'waterTemp',
                param2: 'tn',
                time: '2021-07',
                chartFlag: false,
                city:'廊坊市',
                baseLayer: null,
                correlation: '',
                div: null
            },
            params: [
                {
                    label: '总磷',
                    value: 'tp'
                },{
                    label: '总氮',
                    value: 'tn'
                },{
                    label: '藻密度',
                    value: 'acd'
                },{
                    label: '叶绿素a',
                    value: 'chla'
                },{
                    label: '高锰酸盐指数',
                    value: 'codmii'
                },{
                    label: '电导率',
                    value: 'doc'
                },{
                    label: '氨氮',
                    value: 'nh4'
                },{
                    label: '温度',
                    value: 'waterTemp'
                }
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
                }
            ],
        }
    },
    created() {
        console.log(ecStat)
    },
    mounted() {
        this.$store.state.waterInfluence.clear = this.clearWaterInfluence
        this.closeOverlayText()
    },
    methods: {
        //获取相关性指数
        correlationIndex() {
            let x = [],y = []
            let param1 = this.influence.param1
            let param2 = this.influence.param2
            for(let i in this.influence.monitors) {
                if(this.influence.monitors[i][param1] < 0 || this.influence.monitors[i][param2] < 0) continue
                x.push(this.influence.monitors[i][param1])
                y.push(this.influence.monitors[i][param2])
                
            }
            console.log(x.length,y.length)
           console.log(JSON.stringify({x:x,y:y}))
            request.get('waterenv-alg-manage/alg/realTime/exe/pearson',{
                params: {
                    // args: `{"x"+${qs.stringify({x}, {indices: false})}+"y"+${qs.stringify({y}, {indices: false})}}`
                    // args: qs.stringify({x,y}, { arrayFormat: 'indices' })
                    /* args: {
                        "x": qs.stringify(x, { arrayFormat: 'indices', allowDots: true }),
                        "y": qs.stringify(y, { arrayFormat: 'indices', allowDots: true })
                    } */
                    /* args: {
                        "x": x,
                        "y": y
                    } */
                    //args: `{"x":${x},"y":${y}}`
                    args: JSON.stringify({x:x,y:y})
                  /*   args: {
                        x:JSON.stringify(x),
                        y:JSON.stringify(y)
                    } */
                },
                paramsSerializer: (params) => {
                    return qs.stringify(params)  
                }
                // qs.stringify({args:{x,y}})
                
            }).then(res => {
                console.log(res)
               this.influence.correlation = res.data
            })
        },
        //创建掩膜图层
        createBaseLayer() {
            if(this.influence.baseLayer !== null) this.map.removeLayer(this.influence.baseLayer)
            this.influence.baseLayer =  new VectorLayer({
                source: new VectorSource({
                  wrapX:false
                }),
            });
            let features = (new GeoJSON()).readFeatures(require('@/assets/json/河北省.json'))
            let _this = this
            
            features.forEach(function(element) {
                let jsonName = element.get('name')
                // console.log(element)
                if(_this.influence.city === jsonName) {
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
                    _this.influence.baseLayer.getSource().addFeature(element)
                    _this.map.getView().setCenter(transform(element.values_.center,"EPSG:4326","EPSG:3857"))
                    _this.map.getView().setZoom(8)
                }
                
            })
            this.map.addLayer(this.influence.baseLayer);
            this.map.removeLayer(this.influence.monitorLayer)
            this.map.addLayer(this.influence.monitorLayer)
        },
        //事件：关闭overlay
        closeOverlayText() {
            const that = this
            this.map.on('click',function (e) {
                //再点击时获取像素区域
                const pixel = that.map.getEventPixel(e.originalEvent)
                that.map.forEachFeatureAtPixel(pixel,function (feature) {
                   
                    //coodinate存放了点击时的坐标信息
                    if(typeof feature.getId() == 'undefined') return

                     //清除上一次弹出的窗口
                    if(document.querySelector('.overlay'+feature.getId()) !== null) {
                        document.querySelector('.overlay'+feature.getId()).style.display = "none"
                        // delete that.overlayText[feature.getId()]
                    }


                    const coordinate = e.coordinate
                    let monitor = null
                    console.log(coordinate,feature );
                    console.log(feature.getId())
                    for(let i in that.influence.monitors2) {
                        if(that.influence.monitors2[i].sectionCode == feature.getId()) {
                            console.log(that.influence.monitors2[i].sectionCode,feature.getId() );
                            monitor = that.influence.monitors2[i]
                            console.log('monitor')
                        }
                        
                    }
                    console.log(monitor)
                    //设置弹出框内容，可以html自定义/* 
                    // that.overlayText[feature.getId()] = feature.getId()
                    const div = document.createElement('div')
                    div.className = `overlay-container overlay`+feature.getId()
                    div.innerHTML = `
                    <div style="padding-bottom: 3px; margin-bottom: 7px;border-bottom: 1px dashed #fff;">
                        <p style="display: inline-block;width: 200px;margin: 0;">各水质参数含量</p>
                        <img id="text-${feature.getId()}" style="cursor: pointer;width: 16px;height: 16px;vertical-align: middle;" src="${that.closeW}"/>
                    </div>
                    <span class="monitor-span">总磷：${monitor.tp}</span>
                    <span class="monitor-span">总氮：${monitor.tn}</span>
                    <span class="monitor-span">氨氮：${monitor.nh4}</span>
                    <span class="monitor-span">藻密度：${monitor.acd}</span>
                    <span class="monitor-span">叶绿素a：${monitor.chla}</span>
                    <span class="monitor-span">电导率：${monitor.doc}</span>
                    <span class="monitor-span" style="width: 95%;">高猛酸盐指数：${monitor.codmii}</span>
                    `
                    //设置overlay的显示位置
                    that.overlay = new Overlay({
                        element: div,
                        autoPan: true,
                        autoPanMargin:20,
                        offset: [-120,-240],
                        className: 'overlay-text'
                    })
                    that.overlay.setPosition(coordinate)
                    // this.influence.div = div
                    //显示overlay
                    that.map.addOverlay(that.overlay)
                    console.log(document.getElementById("text-"+feature.getId()));
                    document.getElementById("text-"+feature.getId()).onclick = function () {
                        document.querySelector('.overlay'+feature.getId()).style.display = "none"
                    }                    
                })
            })

        },
        /* domColor(dataIndex) {
            const newAry = [];
            for (let k=0; k<20; k++) {
                const r = Math.floor(Math.random() * 256)
                const g = Math.floor(Math.random() * 256)
                const b = Math.floor(Math.random() * 256)
                newAry.push(`rgb(${r},${g},${b})`)
            }
            return newAry[dataIndex]
        }, */
        paramInfluence() {
            this.$store.commit('showLoading')
            // console.log(this.influence.time)
            // console.log(parseInt(this.influence.time.substring(5))+1)
            this.influence.chartFlag = true
            this.getDataMonitorData()
            const that = this
            let time = window.setTimeout(function (){
                that.$store.commit('hideLoading')
            },1000);
            // 


        },
        influenceChartRenderer() {
            /* let regressionDemo = ecStat.regression(regType, chartData, regOrder);
            regressionDemo.points.sort(function(a, b) {
                return a[0] - b[0];
            }); */
            let param1 = this.influence.param1
            let param2 = this.influence.param2
            console.log(param1,param2)
            let data = []
            for(let i in this.influence.monitors) {
                if(this.influence.monitors[i][param1] < 0 || this.influence.monitors[i][param2] < 0) continue
                data.push([this.influence.monitors[i][param1],this.influence.monitors[i][param2]])
            }
            // console.log(data)
            let chart = this.$echarts.init(document.querySelector('.influence-chart'),'dark',{width:'400%',height:'350%'})
            this.$echarts.registerTransform(ecStat.transform.regression)
            const that = this
            chart.setOption({
                backgroundColor: 'rgba(0,0,0,0)',
                dataset: [
                    {
                    source: data
                    },
                    {
                    transform: {
                        type: 'ecStat:regression'
                        // 'linear' by default.
                        // config: { method: 'linear', formulaOn: 'end'}
                    }
                    }
                ],
                title: {
                    text: '相关性分析',
                    // subtext: 'By ecStat.regression',
                    sublink: 'https://github.com/ecomfe/echarts-stat',
                    left: 'left'
                },
                legend: {
                    top: 5,
                    right: 30
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                    type: 'cross'
                    }
                },
                xAxis: {
                    name: that.influence.param1,
                    splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                    }
                },
                yAxis: {
                    name: that.influence.param2,
                    splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                    }
                },
                /* visualMap: {
					type: 'piecewise',//设置此属性
					min: 0,
					max: 0.5,
					splitNumber: 3,
					calculable: false,
					// orient: 'horizontal',
					left: 'center',
					bottom: '-25%',
					inRange: {
						color: ['rgb(40,78,203)', 'rgba(28,177,211)', 'rgba(148,192,102)','rgb(255,0,0)']//分三段颜色显示
					},
					textStyle: {
						color: '#f00'
					}
				}, */
                series: [
                    {
                        name: '散点',
                        type: 'scatter',

                    },
                    {
                        name: '回归线',
                        type: 'line',
                        datasetIndex: 1,
                        symbolSize: 0.1,
                        symbol: 'circle',
                        label: { show: true, fontSize: 16 },
                        labelLayout: { dx: -20 },
                        encode: { label: 2, tooltip: 1 },
                        
                    }
                ]
            })
            


        },
       //清除设置所有图层
        clearWaterInfluence() {
            if(this.influence.monitorLayer !== null) {
                this.map.removeLayer(this.influence.monitorLayer)
                const divs = document.querySelectorAll('.css_animation')
                for(let i=0;i<divs.length;i++) {
                    console.log(divs[i],i)
                    divs[i].style.display = "none"
                }
            }
            if(this.influence.baseLayer !== null) {
                this.map.removeLayer(this.influence.baseLayer)
            }
            this.influence.chartFlag = false
        },
       //设置扩散点效果
        setPlashPoint(data) {
            let classColor = "",classColor2 = ''
            if(data.waterQuality === 'Ⅴ') {
                classColor = 'five'
                classColor2 = 'fiveDot'
            }else if(data.waterQuality === '劣Ⅴ') {
                classColor = 'six'
                classColor2 = 'sixDot'
            }else if(data.waterQuality === 'Ⅳ') {
                classColor = 'four'
                classColor2 = 'fourDot'
            }else {
                return
            }
            /* if(this.classic.ele !== null) {
                this.classic.ele.parentNode.removeChild(this.classic.ele)
            } */
            const ele = document.createElement('div')
            ele.style.display = "block"
            ele.innerHTML = `
                <div class="dot ${classColor2}"></div>
                <div class="pulse ${classColor}"></div>
            `
            ele.className = "css_animation"
            this.influence.overLay = new Overlay({
                element: ele,
                positioning: 'center-center'
            })
            this.map.addOverlay(this.influence.overLay)
            this.influence.overLay.setPosition(transform(data.extent,'EPSG:4326','EPSG:3857'))
            // this.params.ele = ele	 
        },
        createMontiorLayer() {
            if(this.influence.monitorLayer !== null) this.map.removeLayer(this.influence.monitorLayer)
            this.influence.monitorLayer = new VectorLayer({
                source: new VectorSource()
            })
            for(let i in this.influence.monitors2) {
                let siteStyle = new Style({
                    image: new Icon({
                        src:this.influence.water,
                        /* anchor: [0.5, 20],
                        scale: 1,
                        anchorXUnits: 'pixels',
                        anchorYUnits: 'pixels' */
                    })
                })
                const siteSource = this.influence.monitorLayer.getSource()
                let feature = new Feature({
                    geometry: new Point(transform([this.influence.monitors2[i].longitude,this.influence.monitors2[i].latitude],"EPSG:4326","EPSG:3857")),
                })
                
                feature.setStyle(siteStyle)
                console.log(this.influence.monitors2[i].sectionCode)
                feature.setId(this.influence.monitors2[i].sectionCode)
                siteSource.addFeature(feature) 
                console.log(feature)
                // this.setPlashPoint(this.influence.monitors2[i]) 
            }
            this.map.addLayer(this.influence.monitorLayer)
        },
        //获取所有水质监测站的数据
        getDataMonitorData() {
            // console.log(this.params.year+"-"+this.params.month,this.params.year+"-"+(parseInt(this.params.month)+1))
            let beginTime = this.influence.time,endTime = ''
            let month = parseInt(this.influence.time.substring(5))
            if(month === 12) {
                endTime = (parseInt(this.influence.time.substring(0,4))+1)+'-01'
            }else {
                if(month < 9) {
                    endTime = this.influence.time.substring(0,6)+(month+1)
                }else{
                    endTime = this.influence.time.substring(0,5)+(month+1)
                }
            }
            console.log(beginTime,endTime)
            request.get('waterenv-monitor/auto/data/getHistory',{
                params: {
                    /* beginTime: this.params.year+"-"+this.params.month,
                    endTime: this.params.year+"-"+(parseInt(this.params.month)+1), */
                    beginTime: beginTime,
                    endTime: endTime,
                   /*  beginTime: "2021-08",
                    endTime: '2021-09', */
                }
            }).then(res => {
                console.log(res)
                this.influence.monitors = res.rows 
                this.influenceChartRenderer()
                this.correlationIndex()
                let data = this.influence.monitors
                this.influence.monitors2 = []
                for(let i in data) {
                    if(data[i].city === null) continue
                    /* this.influence.monitors2.push({city: data[i].city,monitorDate: data[i].monitorDate,province: data[i].province,
                    riverName: data[i].riverName,sectionName: data[i].sectionName,sectionCode: data[i].sectionCode,waterQuality: data[i].waterQuality,
                    extent:[data[i].longitude,data[i].latitude]}) */
                    this.influence.monitors2.push(data[i])
                }
                console.log(this.influence.monitors2)
                this.createMontiorLayer()
                this.createBaseLayer()

            })

        },

    }
}
</script>

<style >
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
.monitor-span {
    display: inline-block;
    padding: 5px 2px;
    width: 49%;
    box-sizing: border-box;
    color: rgb(15,231,255);
}
.overlay-container {
    width: 230px;
    background-color: rgba(0,0,0,0.7);
    border-radius: 8px 8px;
    padding: 10px;
    border: 1px solid rgba(52,220,200,0.8);
    color: #fff;
    overflow: hidden;
}
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

.dot {
width: 7px;
height: 7px;
-webkit-border-radius: 50%;
-moz-border-radius: 50%;
border-radius: 50%; /* 实心圆 ，如果没有这个就是一个小圆圈 */
z-index: 2;
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

.el-input--prefix .el-input__inner {
    padding-left: calc(5px + 14px + 12px);
    text-align: center;
    font-weight: 700;
}
	
.four {
	border: 2px solid rgba(255,136,0);
	box-shadow: 1px 1px 30px rgba(255,136,0); /* 阴影效果 */
}
.five {
    border: 2px solid rgba(255,0,0);
	box-shadow: 1px 1px 30px rgba(255,0,0); /* 阴影效果 */
}
.six {
    border: 2px solid rgba(160,37,0);
	box-shadow: 1px 1px 30px rgba(160,37,0); /* 阴影效果 */
}

.fourDot {
    border: 1px solid rgba(255,136,0);
    background-color:rgba(255,136,0);
}

.fiveDot {
    border: 1px solid rgba(255,0,0);
    background-color:rgba(255,0,0); 
}

.sixDot {
    border: 1px solid rgba(160,37,0);
    background-color:rgba(160,37,0);
}
</style>


<style lang="scss" scoped>
#water-influence {
    width: 300px;
    height: 600px;
    background: red;
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
    #water-influence2 {
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
        .select {
            width: 153px;
            height: 28px;
            border-radius: 5px;
            outline: none;
            margin: 0 18px;
        }
    }
}
</style>
