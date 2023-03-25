<template>
    <div id="semly" ref="semly-map-root" style="width: 100%;height: 100%;background: rgba(0,0,0,0.9);color: #fff;position: absolute;">
        <div class="semly-left-bar">
            <div style="background: rgba(0,0,0,0.7); padding: 12px 10px;">
                <img src="../../assets/icon/semlyInt.svg" alt="" style="vertical-align: middle;margin-right: 10px;width: 24px;">
                <span style="display: inline-block;font-weight: 600;">黑臭水体分析</span>
            </div>
            <div style="background-color: rgba(2,35,70);padding: 5px 10px;font-size: 14px;text-align: center;">影像数据选择</div>
            <div class="top-switch" style="padding: 10px;text-align: center;">
                <el-switch
                    v-model="isWaterSystemMap"
                    active-text="关闭水系图"
                    inactive-text="开启水系图"
                    active-color="rgb(15,231,255)"
                    inactive-color="rgb(110,110,110)"
                    @change="WaterSystemMap">
                </el-switch>
                <!-- <el-switch
                    v-model="allImage.flag"
                    inactive-text="影像边框："
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="setAllImageFrame(allImage)
                    ">

                </el-switch> -->
            </div>
            <div  >
                <el-table  max-height="400"
                            size="small" :data="listData"
                            highlight-current-row
                            element-loading-text="拼命加载中"
                            :header-cell-style="{color: '#848484', fontSize: '15px', backgroundColor: '#qua'}"
                            style="width: 100%;"   >
                    <el-table-column align="center" label="序号" type="index" min-width="20%" width="60">
                    </el-table-column>
                    <el-table-column align="center" prop="uploadFilename" label="文件名"  show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column align="center" prop="uploadTime" label="上传时间"  show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column align="center" >
                    <template #default="scope">
                        <el-checkbox v-model='listData[scope.$index].flag' @change="handleCheckedChange(scope.$index,scope.row)"></el-checkbox>
                    </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-wrap" style="padding-top: 15px;">
                    <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="paginationData.total"
                        small
                        ></el-pagination>
                </div>
            </div>
            <div style="padding: 20px 0;">
                <span class="interpolation-btn" @click="removerResultImageLayer">清除数据</span>
                <span class="interpolation-btn" @click="extractWater">黑臭分析</span>
            </div>
            <div style="background-color: rgba(2,35,70);padding: 5px 10px;font-size: 14px;text-align: center;" v-show="image.faram">提取参数</div>
            <div style="width: 100%; padding: 10px;" v-show="image.faram">
                <span style="display: inline-block; width: 100%; padding: 5px 0;">城市：{{image.city}}</span>
                <span style="display: inline-block; width: 100%; padding: 5px 0;">卫星类型：{{image.satelliteId}}</span>
                <span style="display: inline-block; width: 100%; padding: 5px 0;">载荷类型：{{image.sensorId}}</span>
            </div>
        </div>
        <div class="waterLegend" v-show="semlyFlag">
            <!-- <div :class='[isShowLegend? "lake-legend-container":"lake-legend-container-hide"]'>
                <div class="exLegendContain">
                <h3>图例</h3>
                <div style="display: inline-block" v-for="(item,index) in legendInf" class="legendItem" >
                    <div class="colorLegend" :style="{'background-color':item.color}" @click="waterLegendChange(item)">
                    </div>
                    <span>{{ item.type }}</span>
                </div>
                </div>
            </div> -->
            <span style="display: inline-block;background: rgb(255,0,0);width: 40px;height: 25px; vertical-align: middle;border-radius: 5px;"> </span>
            <span style="color: #fff;font-weight: 600;margin-left: 10px;">黑臭水体</span>
        </div>
        <!--  <div style="position: absolute;right: 50px;bottom: 50px;border-radius: 10px; padding: 10px;background: rgba(0,0,0,0.5);"> 

        </div> -->
    </div>
</template>

<script>
import request from "../../utils/request.js"
import heBeiBigWaterJson from "../../assets/json/heBeiBigWater"


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
    name: 'semly',
    data() {
        return {
            semlyFlag: false,
            map: null,
            listData: null,
            //分页插件
            paginationData: {
                total: 0,
                currentPage: 1,
                pageSize: 10
            },        
            algParam: {
                fileName: '',
                satelliteId: ''
            },
            extractBtnState:true,
            originalImage: {
                layer: null,
                polygon: [],
                flag: true
            },
            currentImgExtent:null,
            uploadFileName: '',
            imageLayer: null,
            resultLayer: null,
            listResultData: [],
            reusltImage: {
                layer: null,
                polygon: [],
                flag: true
            },
            isWaterSystemMap:false,
            allImage: {
                layer: null,
                polygon: [],
                flag: false
            },
            isShowLegend:false,
            legendInf:[
                {
                isShow:false,
                type:'小型支流',
                color:'rgba(105,105,105,0.8)',
                recolor:'rgba(37,254,255,1)',
                extend:{
                    max:0.00005,
                    min:0,
                    width:1
                },
                layerFeature:[],
                layer:null
                },
                {
                isShow:true,
                type:'主要干流',
                color:'rgba(18,157,174,1)',
                recolor:'rgba(18,157,174,1)',
                extend:{
                    min:0.00005,
                    max:0.001,
                    width: 2
                },
                layerFeature:[],
                layer:null
                },
                {
                isShow:true,
                type:'湖泊湖库',
                color:'rgba(20,74,116,1)',
                recolor:'rgba(20,74,116,1)',
                extend: {
                    min:0.001,
                    max:999,
                    width: 3
                },
                layerFeature:[],
                layer:null,
                
                }
                
            ],
            image: {
                city: '',
                satelliteId: '',
                sensorId: '',
                faram:false
            }
        }
    },
    created() {
        this.getRsImageData(this.paginationData)
    },
    mounted() {
        this.mapRenderer()
    },
    methods: {
        refreshWaterSystem(){
            const reader = new GeoJSON({
                defaultDataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });
            const JsonFeatures = reader.readFeatures(heBeiBigWaterJson)
            JsonFeatures.forEach(item=> {
                for(let i in this.legendInf){
                if(item.values_.Shape_Area<=this.legendInf[i].extend.max&&item.values_.Shape_Area>this.legendInf[i].extend.min&&this.legendInf[i].isShow){
                    // console.log(i)
                    const waterStyle = new Style({
                    fill: new Fill({
                        color:this.legendInf[i].color,
                    }),
                    stroke: new Stroke({
                        color: this.legendInf[i].color,
                        width: this.legendInf[i].width,
                    }),
                    })
                    item.setStyle(waterStyle)
                    this.legendInf[i].layerFeature.push(item)
                    return
                }else{
                    item.setStyle(null)
                }
                }
            })
            console.log(this.legendInf)
            for(let i in this.legendInf){
                const vectorSource = new VectorSource({
                features: this.legendInf[i].layerFeature
                });
                const vectorLayer = new VectorLayer({
                source: vectorSource,
                });
                this.legendInf[i].layer = vectorLayer
            }


        },
            //水系图图例改变事件 对应修改图层可视性
        waterLegendChange(item){
            if(item.isShow){
                item.color='rgba(105,105,105,0.8)'
                item.isShow = false
                for(let i in this.legendInf){
                this.map.removeLayer(this.legendInf[i].layer)
                this.legendInf[i].layer=null
                }
                this.refreshWaterSystem()
                for(let i in this.legendInf){
                if(this.legendInf[i].isShow){
                    this.map.addLayer(this.legendInf[i].layer)
                }
                }
            }else{
                item.color=item.recolor
                item.isShow = true
                for(let i in this.legendInf){
                this.map.removeLayer(this.legendInf[i].layer)
                this.legendInf[i].layer=null
                }
                this.refreshWaterSystem()
                for(let i in this.legendInf){
                if(this.legendInf[i].isShow){
                    this.map.addLayer(this.legendInf[i].layer)
                }
                }
            }
        },
            //清除影像边框
        clearImageFram(image) {
            this.map.removeLayer(image.layer)
            image.layer = null
        },
            //添加所有边框
        setAllImageFrame(image) {
            // image.flag = !image.flag
            if(!image.flag) {
                this.clearImageFram(image)
                return
            }
            image.layer = new VectorLayer({
                source: new VectorSource({
                    features: image.polygon,
                    wrapX: false
                }),
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
                zIndex: 11
            })
                this.map.addLayer(image.layer)
        },
            // 水系图贴图
        WaterSystemMap(){
            //控制图例
            this.isShowLegend =this.isWaterSystemMap
                if(this.isWaterSystemMap){
                    this.refreshWaterSystem()
                    for(let i in this.legendInf){
                        if(this.legendInf[i].isShow){
                        this.map.addLayer(this.legendInf[i].layer)
                        }
                    }
                }else {
                    for(let i in this.legendInf){
                        this.map.removeLayer(this.legendInf[i].layer)
                        this.legendInf[i].layer=null
                    }
                }

        },
        //提取结果表贴图
        setResultImageLayer(index,row) {
            this.removerResultImageLayer()
            for(let i = 0;i < this.listResultData.length;i++){
            if(i === index){
                continue
            }else {
                this.listResultData[i].flag = false
            }
            }
            if(!this.listResultData[index].flag){
            //this.extractBtnState = true
            return
            }
            const centerLongitude = (row.tiffInfo.left+row.tiffInfo.right)/2
            const centerLatitude = (row.tiffInfo.bottom+row.tiffInfo.top)/2

            this.reusltImage.polygon.splice(0)
            this.reusltImage.polygon.push(
                transform([row.tiffInfo.left,row.tiffInfo.top],'EPSG:4326','EPSG:3857'),
                transform([row.tiffInfo.right,row.tiffInfo.top],'EPSG:4326','EPSG:3857'),
                transform([row.tiffInfo.right,row.tiffInfo.bottom],'EPSG:4326','EPSG:3857'),
                transform([row.tiffInfo.left,row.tiffInfo.bottom],'EPSG:4326','EPSG:3857'),
                transform([row.tiffInfo.left,row.tiffInfo.top],'EPSG:4326','EPSG:3857')
            )

            const extent = [row.tiffInfo.left,row.tiffInfo.bottom,row.tiffInfo.right,row.tiffInfo.top]
           /*  this.resultLayer= new ImageLayer({
                source: new ImageWMS({
                    ratio: 1,
                    url: 'http://121.4.131.9:8084/geoserver/waterenv/wms',
                    params: {'FORMAT': 'image/png',
                            'VERSION': '1.1.1',  
                        "STYLES": '',
                        "LAYERS": row.iserverMap,
                        "exceptions": 'application/vnd.ogc.se_inimage',
                    }
                })
                }); */
            console.log(row.thumbUrl,extent)
            this.resultLayer = new ImageLayer({
                source: new ImageStatic({
                url: row.thumbUrl,
                projection: 'EPSG:3857',
                imageExtent: transformExtent(extent,'EPSG:4326','EPSG:3857')
                })
            })
            this.map.addLayer(this.resultLayer)
            this.map.getView().setCenter(transform([centerLongitude,centerLatitude],'EPSG:4326','EPSG:3857'))
        },
        //打开一个新的通知
        openMessageTips(message){
            let _this = this;
            this.closeAllNotification();
            let notify = this.$notify.info({
                title: '图层影像信息',
                dangerouslyUseHTMLString: true,
                position:'left',
                customClass:'imgInf',
                message: this.$createElement('div', null,
                    [

                        this.$createElement('div', null,
                            [
                                /*this.$createElement(
                                    'span',
                                    {
                                        style: {
                                        textAlign: 'left',
                                        fontSize:'5px'
                                        },
                                    },
                                    "当前影像名称:"+message.uploadFilename
                                ),
                                this.$createElement(
                                    'br',
                                ),
                                this.$createElement(
                                    'span',
                                    {
                                        style: {
                                        textAlign: 'left'
                                        },
                                    },
                                    "上传时间:"+message.uploadTime
                                ),
                                this.$createElement(
                                    'br',
                                ),*/
                                this.$createElement(
                                    'span',
                                    {
                                        style: {
                                            textAlign: 'left'
                                        },
                                    },
                                    "卫星型号:"+message.satelliteId
                                ),
                                this.$createElement(
                                    'br',
                                ),
                                this.$createElement(
                                    'span',
                                    {
                                        style: {
                                            textAlign: 'left'
                                        },
                                    },
                                    "载荷型号:"+message.sensorId
                                ),
                                this.$createElement(
                                    'br',
                                ),
                                this.$createElement(
                                    'span',
                                    {
                                        style: {
                                            textAlign: 'left'
                                        },
                                    },
                                    "所在地区:"+'河北省廊坊市'
                                ),
                                this.$createElement(
                                    'br',
                                ),
                                this.$createElement(
                                    'span',
                                    {
                                        style: {
                                            textAlign: 'left',
                                            fontSize:'5px'
                                        },
                                    },
                                    "左上角经纬度:("+message.topLeftLatitude+","+message.topLeftLongitude+")"
                                ),
                                this.$createElement(
                                    'br',
                                ),
                                this.$createElement(
                                    'span',
                                    {
                                        style: {
                                            textAlign: 'left',
                                            fontSize:'5px'
                                        },
                                    },
                                    "左下角经纬度:("+message.bottomLeftLatitude+","+message.bottomLeftLongitude+")"
                                ),
                                this.$createElement(
                                    'br',
                                ),
                                this.$createElement(
                                    'span',
                                    {
                                        style: {
                                            textAlign: 'left',
                                            fontSize:'5px'
                                        },
                                    },
                                    "右上角经纬度:("+message.topRightLatitude+","+message.topRightLongitude+")"
                                ),
                                this.$createElement(
                                    'br',
                                ),
                                this.$createElement(
                                    'span',
                                    {
                                        style: {
                                            textAlign: 'left',
                                            fontSize:'5px'
                                        },
                                    },
                                    "右下角经纬度:("+message.bottomRightLatitude+","+message.bottomRightLongitude+")"
                                ),
                            ]
                        )
                    ]
                ),
                duration: 0,
            });
            //将messageId和通知实例放入字典中
            this.notifications[message.messageId] = notify;
        },
        //添加影像到图层
        addImageToLayer({centerLongitude,centerLatitude}) {
            console.log(transform([centerLongitude,centerLatitude],'EPSG:4326','EPSG:3857'));
            this.map.getView().fit(transformExtent([this.currentImgExtent[0],this.currentImgExtent[1],this.currentImgExtent[2],this.currentImgExtent[3]], 'EPSG:4326', 'EPSG:3857'),{duration:1000});//最接近范围
            this.map.addLayer(this.imageLayer)
        },
        //从图层中移除影像
        removeImageFromLayer() {
            if(this.imageLayer === null) return
            console.log('romove')
            this.map.removeLayer(this.imageLayer) 
            this.imageLayer = null
            // this.closeAllNotification()
        },
        //事件：复选框状态改变
        handleCheckedChange(index,row) {
            //this.$store.commit('removeImageFromLayer')
            console.log(row);
            this.removeImageFromLayer()
            this.removerResultImageLayer()
            console.log(this.listData[index].flag);
            for(let i = 0;i < this.listData.length;i++){
                if(i === index){
                continue
                }else {
                this.listData[i].flag = false
                }
            }
            console.log(this.listData[index].flag);
            if(!this.listData[index].flag){
                this.extractBtnState = true
                this.image.faram = false

                return
            }
            console.log('1111111');

            this.image.city = row.city
            this.image.satelliteId = row.satelliteId
            this.image.sensorId = row.sensorId
            this.image.faram = true

            const btmLtLongitude = Number(row.bottomLeftLongitude)
            const btmLtLatitude = Number(row.bottomLeftLatitude)
            const topRtLongitude = Number(row.topRightLongitude)
            const topRtLatitude = Number(row.topRightLatitude)

            const centerLongitude = (btmLtLongitude + topRtLongitude)/2
            const centerLatitude = (btmLtLatitude + topRtLatitude)/2
            
            this.originalImage.polygon.splice(0)
            this.originalImage.polygon.push(
                transform([btmLtLongitude,topRtLatitude],'EPSG:4326','EPSG:3857'),
                transform([topRtLongitude,topRtLatitude],'EPSG:4326','EPSG:3857'),
                transform([topRtLongitude,btmLtLatitude],'EPSG:4326','EPSG:3857'),
                transform([btmLtLongitude,btmLtLatitude],'EPSG:4326','EPSG:3857'),
                transform([btmLtLongitude,topRtLatitude],'EPSG:4326','EPSG:3857'))
            const extent = [btmLtLongitude,btmLtLatitude,topRtLongitude,topRtLatitude]
            this.currentImgExtent = extent
            // console.log(extent);
            console.log(row)
            this.uploadFileName = row.uploadFilename
            const imageSuffix = row.uploadFilename.split('.').slice(-1)
            this.algParam.fileName =row.saveFilename+'.'+imageSuffix
            this.algParam.satelliteId  = row.satelliteId
            console.log(row.imageUrl)
            this.imageLayer = new ImageLayer({
                source: new ImageStatic({
                url: row.imageUrl,
                projection: 'EPSG:3857',
                imageExtent: transformExtent(extent,'EPSG:4326','EPSG:3857')
                })
            })
            //this.$store.commit('addImageToLayer',{imageLayer,centerLongitude,centerLatitude})
            this.addImageToLayer({centerLongitude,centerLatitude})
            //按钮disabled属性
            this.extractBtnState = false
            // this.openMessageTips(row)

        },
            //移除历史结果数据
        removerResultImageLayer() {
            if(this.resultLayer === null) return
            this.map.removeLayer(this.resultLayer)
            this.resultLayer = null
            this.semlyFlag = false
        },
        //水体提取结果贴图
        async extractWater() {
            this.semlyFlag = true
            this.removerResultImageLayer()
            this.$store.commit('showLoading')
            await request.post('waterenv-alg/badWater',{
            "filename": this.algParam.fileName,
            "satelliteId": this.algParam.satelliteId,
            "publish": true,
            "thumb": true
            }).then(res => {
            console.log(res);
            this.$store.commit('hideLoading') 
            if(res.code === 200) {
                this.$message({
                message: '分析成功,请耐心等待加载',
                type: 'success'
                })
                res.data.flag = true
                res.data.fileName = this.uploadFileName
                this.listResultData.push(res.data)
                this.setResultImageLayer(this.listResultData.length - 1,res.data)
            }else {
                this.$message.error("算法执行失败")
            }

            })
        },
        //为每一条影像数据添加flag,作为是否添加到图层的标志
        addFlagForRsImage(imageDatas) {
            for(let i = 0;i < imageDatas.length;i++){
                imageDatas[i].flag = false
            }
            return imageDatas
        },
        handleCurrentChange(num) {
            this.paginationData.currentPage = num;
            // this.removeImageFromLayer()
            this.getRsImageData(this.paginationData);
        },
        handleSizeChange(num) {
            this.paginationData.pageSize = num;
            // this.removeImageFromLayer()
            this.getRsImageData(this.paginationData);
        },
        //获取影像数据
        getRsImageData(form) {
            request.get('waterenv-system/rsImage',{
                params:{
                beginTimeUpload: null,
                endTimeUpload: null,
                isAsc: null,
                orderByColumn: null,
                pageNum: form.currentPage,
                pageSize: form.pageSize,
                }
            }).then( res => {
                console.log(res);
                this.listData = this.addFlagForRsImage(res.rows)
                this.paginationData.total = res.total
                console.log(this.listData)
            })
        },
        mapRenderer(){
            this.map = new Map({
                //地图通过map-root的ref属性 进行绑定 也可以使用ID属性
                target: this.$refs["semly-map-root"],
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
<style>
.el-table__body tr.current-row>td.el-table__cell {
    background: rgb(0,0,0);
}
.el-switch__label.is-active {
    color: var(--el-color-primary);
    color: rgb(15,231,255);
}
.el-switch__label {
    transition: var(--el-transition-duration-fast);
    height: var(--el-switch-height);
    display: inline-block;
    font-size: 17px;
    font-weight: 800;
    cursor: pointer;
    vertical-align: middle;
    color: var(--el-text-color-primary);
    color: #fff;
}
.el-switch__label * {
    line-height: 1;
    font-size: 17px;
    display: inline-block;
    font-weight: 800;
}
.waterLegend {
    position: absolute;
    bottom: 50px;
    right: 90px;
    z-index: 1;
    padding: 6px 10px;
    overflow: hidden;
    color: #000;
    background: rgba(0,0,0,0.6);
    border-radius: 10px;
}
.lake-legend-container {
  width: 150px;
  height: 200px;
  background-color: rgba(255,255,255,0);
  display: inline-block;
  transition: 0.5s;
  border-radius: 10px;
}
.lake-legend-container-hide {
  width: 0px;
  height: 200px;
  background-color: rgba(255,255,255,1);
  display: inline-block;
  transition: 0.5s;
  border-radius: 10px;
  overflow: hidden;
}
  .exLegendContain{
    padding: 0px;
    text-align: center;
    border-radius: 10px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

  }
.legendItem{
    width: 90%;
    border-radius: 10px;
    padding: 5px;
    background: rgba(224,224,224,1);
    margin-bottom: 5px;
    display: flex;
    overflow: hidden;
    justify-content: space-around;
  }
  .colorLegend{
  display: inline-block;
  border-radius: 5px;
  margin-right: 5px;
  width: 30px;
  height: 20px;
  cursor: pointer;
}
</style>

<style lang="scss" scoped>
.semly-left-bar{
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
    z-index: 1;
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
}
</style>

