<template>
    <div id="rubbish" ref="rubbish-map" style="width: 100%;height: 100%;background: rgba(0,0,0,0.9);color: #fff;position: absolute;">
    </div>
</template>

<script>
import request from "../../utils/request.js"

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
import {Style,Stroke,Fill,Text,Icon,Circle} from 'ol/style';
import GeoJSON from "ol/format/GeoJSON";
import {createRegularPolygon,createBox} from 'ol/interaction/Draw'
import Draw from 'ol/interaction/Draw';
import Polygon from 'ol/geom/Polygon'
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature'
import {tile,bbox} from 'ol/loadingstrategy';
import Overlay from 'ol/Overlay.js'

export default {
    name: 'rubbish',
    data() {
        return {
            map: null
        }
    },
    created() {

    },
    mounted() {
        this.mapRenderer()
    },
    methods: {
       mapRenderer(){
            this.map = new Map({
                //地图通过map-root的ref属性 进行绑定 也可以使用ID属性
                target: this.$refs["rubbish-map"],
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
        },
    }
}
</script>

<style lang="scss" scoped>

</style>

