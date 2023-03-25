<template>
    <div id="box">
        <div id="map"></div>
    </div>
</template>
<script>
    import Map from "ol/Map";
    import View from "ol/View";
    import { Stroke, Style } from "ol/style";
    import { LineString } from "ol/geom";
    import { OSM, Vector as VectorSource } from "ol/source";
    import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
    import Feature from 'ol/Feature';
    import GeoJSON from "ol/format/GeoJSON";
    export default {
        mounted() {
            var map = new Map({
                target: "map",
                layers: [
                    new TileLayer({
                        source: new OSM()
                    })
                ],
                view: new View({
                    center: [125.346473,43.89179],
                    zoom: 1,
                    projection:'EPSG:4326'
                })
            });
            var style=new Style({
                stroke:new Stroke({
                    color:'#EAE911',
                    width:20
                })
            });

            const riverLayer = new VectorLayer({
                source: new VectorSource({
                    wrapX:false,
                    useSpatialIndex: false,
                    updateWhileAnimating: true,
                    updateWhileInteracting:true

                }),
            });
            let features = (new GeoJSON()).readFeatures(require('@/assets/json/河北省.json'))


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

                riverLayer.getSource().addFeature(element)
            })

            //第二个直线数据，手动添加的位置数据
            var line=new LineString([[125.346473,43.89179],[116.617835,39.981154],[124.368689,40.115714]])
            var source=new VectorSource({
                wrapX:false
            })
            var outlineStroke=new Style({
                stroke:new Stroke({
                    color:[25,25,255,1],
                    width:5
                })
            })
            function getAnimationStrokeStyle(){
                return new Style({
                    stroke:new Stroke({
                        color:[204,204,255,1],
                        widht:50,
                        lineDash:[2,7],//一组线段和间距交互的数组，可以控制虚线的长度
                        lineDashOffset:feature.get('dashOffset')//偏移量，控制虚线的速度和方向
                    })
                })
            }
            //手动添加数据的矢量数据
            var feature = new Feature({
                geometry: line,
                finished: false,
                dashOffset:-8
            });
            function getStyle(){
                return[outlineStroke,getAnimationStrokeStyle()]
            }
            var array=[]
            feature.setStyle(getStyle())
            source.addFeature(feature)
            var flightsLayer=new VectorLayer({
                source:source,
                style:style
            });
            map.addLayer(flightsLayer)
            map.addLayer(riverLayer)
            setInterval(() => {
                let offset1=feature.get('dashOffset')
                offset1=(offset1==0?-8:offset1+1)

                feature.set('dashOffset',offset1)
                feature.setStyle(getStyle())
            }, 100);
            riverLayer.getSource().on('addfeature',function(event){
                array.push(event.feature)
                for(let i=0;i<array.length;i++){
                    array[i].setStyle(getStyle())
                    array[i].set('dashOffset',0)
                    setInterval(() => {
                        let offset=array[i].get('dashOffset')
                        offset=(offset==8?0:offset+1)

                        array[i].set('dashOffset',offset)
                        array[i].setStyle(getStyle())
                    }, 100);
                }
            })
        }
    };
</script>
<style scoped>
    #box{
        width: 100%;
        margin: 0 auto;
        height: calc(100% - 40px);

    }
    #map{
        width: 99%;
        height: calc(100% - 40px);
        position: absolute ;}
</style>
