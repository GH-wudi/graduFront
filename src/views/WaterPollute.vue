<template>
    <div id="water-pollute" style="height: 100%;">
        <div class="water-pollute-container" ref='pollute-map' style="height: 100%;">

        </div>
        <right-bar :map="map" :polluteW="param.pollute"></right-bar>
    </div>
</template>
<script>

import RightBar from '../components/Waterpollute/RightBar'

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
import {Style,Stroke,Fill,Text,Circle} from 'ol/style';
import GeoJSON from "ol/format/GeoJSON";
import {createRegularPolygon,createBox} from 'ol/interaction/Draw'
import Draw from 'ol/interaction/Draw';
import Polygon from 'ol/geom/Polygon'
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature'
import {tile,bbox} from 'ol/loadingstrategy';
import Overlay from 'ol/Overlay.js'


export default {
    name: 'water-pollute',
    data() {
        return {
            map: null,
            param: {
                riverLayer: null,
                polluteLayer: null,
                overlay: null,
                pollute: {
                    flag: false,
                    clearPolluteLayer: null
                }
            }
        }
    },
    components: {
        RightBar
    },
    mounted() {
        this.mapRenderer()
        this.addPolluteRiverLayer()
        this.doubleClickMap()
    },
    created() {
        this.param.pollute.clearPolluteLayer = this.clearPolluteLayer
    },
    methods: {
        clearPolluteLayer() {
            this.map.removeLayer(this.param.polluteLayer)
            this.map.removeOverlay(this.param.overlay)
            console.log(document.querySelector('.pulse'))
            if( document.querySelector('.pulse') !== null)
                document.querySelector('.pulse').remove()
        },
        //点击位置突出显示
        createPolluteLayer(extent) {
            this.param.polluteLayer = new VectorLayer({
                source: new VectorSource()
            })
            this.map.addLayer(this.param.polluteLayer)
            const feature = new Feature({
                geometry: new Point(extent)
            }) 
            const style =new Style({
                     image: new Circle({
                        radius: 5,//半径
                        fill: new Fill({//填充样式
                            color: 'red',
                        }),
                     }),
                    stroke: new Stroke({//边界样式
                        color: '#555555',
                        width: 1
                    })
                })
            feature.setStyle(style)
            console.log(feature.getStyle())
            this.param.polluteLayer.getSource().addFeature(feature)
            const ele = document.createElement('div')
            ele.style.display = "block"
            ele.innerHTML = `
                <div class="pulse"></div>
            `
            ele.className = "css_animation"
            this.param.overLay = new Overlay({
                element: ele,
                positioning: 'center-center'
            })
            this.map.addOverlay(this.param.overLay)
            this.param.overLay.setPosition(extent)
            
        },
        //地图点击事件，获取坐标
        doubleClickMap() {
            this.map.on('singleclick' ,(evt)=>{
                console.log(evt.coordinate)
                if(this.param.pollute.flag) {
                    this.clearPolluteLayer()
                    this.createPolluteLayer(evt.coordinate)
                }
            })
        },
        //添加河流图层
        addPolluteRiverLayer() {
            this.param.riverLayer = new TileLayer({
                declutter: true,
                source: new TileSuperMapRest({
                    url:'http://121.4.131.9:8090/iserver/services/map-base_map/rest/maps/water_bazhou_3857@water_manual',
                    warpX: true
                }),
                // projection: '4326'
            })
            this.map.addLayer(this.param.riverLayer)
        },
        mapRenderer(){
            
            this.map = new Map({
                //地图通过map-root的ref属性 进行绑定 也可以使用ID属性
                target: this.$refs["pollute-map"],
                layers: [
                    new TileLayer({
                        source:new TileArcGISRest({
                            url:'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
                        })
                    })
                ],
                view: new View({
                zoom: 7,
                center: transform([116.1,39.35],'EPSG:4326','EPSG:3857'),
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
            })
            this.map.addLayer(converLayer);

            // this.observer()
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
border: 4px solid rgba(255,0,0);
box-shadow: 1px 1px 30px rgba(255,0,0); /* 阴影效果 */
}
</style>


<style lang="scss" scoped>

</style>

