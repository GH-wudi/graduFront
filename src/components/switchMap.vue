<template>
    <div :class="[mapFlag? 'switch-map-hide':'switch-map']">
        <img :src="mapFlag? close:open" alt="" style="margin: 0 10px 5px 10px;" class="img-layer" @click="mapFlag = !mapFlag">
        <img src="../assets/img/blackMap.png" alt="" @click="switchMapLayer(blackMapLayer,blackMapLayer2)" class="img-layer">
        <img src="../assets/img/supermap.png" alt="" style="margin: 0 10px 5px 10px;"  @click="switchMapLayer(SuperMap,SuperMap2)" class="img-layer">
        <img src="../assets/img/s1.png" alt=""  @click="switchMapLayer(OSMLayer,OSMLayer2)" class="img-layer">
        <img src="../assets/img/TDTIMGlayer.png" alt="" style="margin: 0 10px 5px 10px;" @click="switchMapLayer(XYZIMGLayer,XYZIMGLayer2)" class="img-layer">
        <img src="../assets/img/s2.png" alt="" @click="switchMapLayer(XYZTERLayer,XYZTERLayer2)" class="img-layer">
    </div>
</template>

<script>
    import TileLayer from 'ol/layer/Tile'
    import Map from 'ol/Map'
    import {defaults,FullScreen,ScaleLine,ZoomSlider,MousePosition} from 'ol/control'
    import View from 'ol/View'

    import XYZ from 'ol/source/XYZ'
    import {transform,transformExtent} from 'ol/proj'
    import {Logo, TileSuperMapRest} from '@supermap/iclient-ol';
    import OverviewMap from 'ol/control/OverviewMap'
    import {OSM, ImageArcGISRest,TileWMS,ImageWMS,TileArcGISRest} from 'ol/source';
    import close from "../assets/img/earthClose.svg"
    import open from "../assets/img/earthOpen.svg"
    export default {
        name: "switchMap",
        props: ["map"],
        data() {
            return {
                OSMLayer: null,
                XYZIMGLayer: null,
                XYZTERLayer: null,
                SuperMap: null,
                OSMLayer2: null,
                XYZIMGLayer2: null,
                XYZTERLayer2: null,
                SuperMap2: null,
                blackMapLayer:null,
                blackMapLayer2:null,
                mapFlag: false,
                close,
                open,
                overView: null
            }
        },
        mounted() {
            this.blackMapLayer = new TileLayer({
                source:new TileArcGISRest({
                    url:'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
                })
            })
            this.blackMapLayer2 = new TileLayer({
                source:new TileArcGISRest({
                    url:'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
                })
            })
            /* this.OSMLayer = new TileLayer({
                source: new OSM(),
                visible: true
            });
            this.OSMLayer2 = new TileLayer({
                source: new OSM(),
                visible: true
            }); */
            this.OSMLayer = new TileLayer({
                source: new TileSuperMapRest({
                        url: "https://www.supermapol.com/proxy/gqzvimgx/iserver/services/map_china-1-_331nhzuk/rest/maps/China_Light",
                        // url: "https://iserver.supermap.io/iserver/services/map-china400/rest/maps/China",
                        wrapX: true,

                }),
            });
            this.OSMLayer2 = new TileLayer({
                source: new TileSuperMapRest({
                        url: "https://www.supermapol.com/proxy/gqzvimgx/iserver/services/map_china-1-_331nhzuk/rest/maps/China_Light",
                        // url: "https://iserver.supermap.io/iserver/services/map-china400/rest/maps/China",
                        wrapX: true,

                }),
            });
            this.XYZIMGLayer = new TileLayer({
                visible:true,
                source: new XYZ({
                    url: 'http://t{0-7}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=16ed81f057bf73b6221d3d9b9e77db3a',
                    wrapX:true
                })

            })
            this.XYZIMGLayer2 = new TileLayer({
                visible:true,
                source: new XYZ({
                    url: 'http://t{0-7}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=16ed81f057bf73b6221d3d9b9e77db3a',
                    wrapX:true
                })

            })
            this.XYZTERLayer = new TileLayer({
                source: new TileSuperMapRest({
                    url: 'https://www.supermapol.com/proxy/jvv3k7t4/iserver/services/map_china-1-_331nhzuk/rest/maps/China_Dark',
                    wrapX:true
                })
            })
            this.XYZTERLayer2 = new TileLayer({
                source: new TileSuperMapRest({
                        url: "https://www.supermapol.com/proxy/jvv3k7t4/iserver/services/map_china-1-_331nhzuk/rest/maps/China_Dark",
                        // url: "https://iserver.supermap.io/iserver/services/map-china400/rest/maps/China",
                        wrapX: true,

                }),
            })
            this.SuperMap = new TileLayer({
                source: new TileSuperMapRest({
                        url: "https://iserver.supermap.io/iserver/services/map-china400/rest/maps/China",
                        // url: "https://iserver.supermap.io/iserver/services/map-china400/rest/maps/China",
                        wrapX: true,

                }),
                visible: true
            })
            this.SuperMap2 = new TileLayer({
                source: new TileSuperMapRest({
                    url: "https://iserver.supermap.io/iserver/services/map-china400/rest/maps/China",
                    wrapX: true
                }),
                visible: true
            })

        },
        methods: {
            switchMapLayer(layer,layer2) {

                this.map.removeLayer(this.map.getLayers().array_[0])
                this.map.getLayers().insertAt(0,layer)
                this.overView = new OverviewMap({
                    layers: [
                        layer2
                    ],
                    //collapseLabel: '开', // 鹰眼图展开时按钮标识
                    // label: '关', // 鹰眼图关闭时按钮标识
                    collapsed: false // 设置为false时，鹰眼图在地图初始化时展开
                });
                //切换加入鹰眼
                // this.map.addControl(this.overView)
                // this.$store.commit('getOverViewMap',this.overView)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .switch-map-hide {
        position: absolute;
        top: 10px;
        left: 10px;
        width: 55px;
        height: 45px;
        border-radius: 20px;
        z-index: 1;
        overflow: hidden;
        transition: 0.3s;
    }
    .switch-map {
        position: absolute;
        top: 10px;
        left: 10px;
        width: 310px;
        height: 50px;
        z-index: 1;
        border-radius: 50px;
        padding-top: 5px;
        transition: 0.3s;
        overflow: hidden;
        background-image: linear-gradient(to top,rgb(15,231,255),rgb(200,231,255));
        opacity: 0.8
    }
    .img-layer {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.8);
        margin-bottom: 5px;
    }
</style>