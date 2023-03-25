<template>
  <div style="width: 100%;height: 100%;overflow: hidden;position:relative;">
    <div class="homeContainer" ref="map-container" >

      <!--    <dv-border-box-10 class="leftShowFirst">dv-border-box-10</dv-border-box-10>-->
      <!--    <dv-border-box-10 class="leftShowSecond">dv-border-box-10</dv-border-box-10>-->



    </div>
    <div class="homeItems">
      <div style="height: 100%;width: 25%;margin-left: 1%">
        <waterWarning></waterWarning>
        <dv-border-box-10 class="showItem leftShow waterStationTable">
          <waterStationTable></waterStationTable>
        </dv-border-box-10>
        <dv-border-box-10 class="leftShow showItem">
          <pieDayChart style="padding-top: 2%;padding-left: 2%;"></pieDayChart>
        </dv-border-box-10>
        <dv-border-box-10 class="leftShow showItem" style="overflow:hidden;">
          <resultCarousel style="" ></resultCarousel>
        </dv-border-box-10>
      </div>
      <div style="height: 100%;width: 25%;margin-right: 1%">
        <dv-border-box-10 class="rightShow showItem" >
          <dashboard style="position: absolute;display: inline-block"></dashboard>
          <div style="width: 65%;padding-top: 38%;text-align: center;display: inline-block" class="dashboardSum">
            <span >水体质量等级：{{dashboardNewData.status}}</span>
            <br>
            <span >今日主要污染物：高锰酸盐</span>
            <br>
            <span >更新时间：{{dashboardNewData.time}}</span>
          </div>
          <div style="width: 32%;text-align: center;display: inline-block;float: right;margin-right: 11px" class="dashboardParameter">
            <span >IMn : {{dashboardNewData.waterItemValue.codmii}}mg/L</span>
            <br>
            <span >NH4 : {{dashboardNewData.waterItemValue.nh4}}mg/L</span>
            <br>
            <span >TP : {{dashboardNewData.waterItemValue.tp}}mg/L</span>
            <br>
            <span >TN : {{dashboardNewData.waterItemValue.tn}}mg/L</span>
            <br>
            <span>PH&nbsp;: {{dashboardNewData.waterItemValue.ph}}</span>
            <br>
            <span >水温：{{dashboardNewData.waterItemValue.waterTemp}}°C</span>
          </div>
        </dv-border-box-10>
        <dv-border-box-10 class="rightShow showItem" >
          <pollutantLineChart style="padding-top: 2%;padding-left: 2%;"></pollutantLineChart>
        </dv-border-box-10>
        <dv-border-box-10 class="rightShow showItem" style="overflow:hidden;">
          <wordCloud style="padding-top: 2%;padding-left: 2%;"></wordCloud>
        </dv-border-box-10>
      </div>

    </div>
    <div id="popup" class="ol-popup">
      <a href="#"  id="popup-closer" class="ol-popup-closer"></a>
      <div id="popup-content" class="popup-content">

      </div>
    </div>
  </div>

</template>

<script>
  import Map from 'ol/Map'
  import View from 'ol/View'
  import TileLayer from 'ol/layer/Tile'
  import {defaults,FullScreen,ScaleLine,ZoomSlider,MousePosition} from 'ol/control'
  import ImageStatic from 'ol/source/ImageStatic';
  import ImageLayer from 'ol/layer/Image'
  import {OSM, ImageArcGISRest,TileWMS,ImageWMS} from 'ol/source';
  import XYZ from 'ol/source/XYZ'
  import 'ol/ol.css'
  import {TileArcGISRest} from "ol/source";
  import {Logo, TileSuperMapRest} from '@supermap/iclient-ol';
  import OverviewMap from 'ol/control/OverviewMap'
  import {Vector as VectorLayer}  from 'ol/layer'
  import VectorSource from 'ol/source/Vector';
  import GeoJSON from "ol/format/GeoJSON";
  import {createRegularPolygon,createBox} from 'ol/interaction/Draw'
  import Draw from 'ol/interaction/Draw';
  import Polygon from 'ol/geom/Polygon'
  import Feature from 'ol/Feature'
  import {tile,bbox} from 'ol/loadingstrategy';
  import { fromLonLat, transform, toLonLat } from "ol/proj";
  import EChartsLayer from 'ol-echarts'

  import {Style,Stroke,Fill,Text,Icon,Circle} from 'ol/style';
  import Point from 'ol/geom/Point'
  import echarts from 'echarts'
  import { getVectorContext } from "ol/render";
  import Overlay from 'ol/Overlay.js'
  import { toStringHDMS } from "ol/coordinate";
  //引入图片
  import bluePoint from "../assets/img/bluePoint.png"
  import redPoint from "../assets/img/redPoint.png"
  import yellowPoint from "../assets/img/yellowPoint.png"
  import greenPoint from "../assets/img/green.png"
  import magnifyingGlass from "../assets/icon/magnifyingGlass.svg"
  import lightMagnifyingGlass from "../assets/icon/lightMagnifyingGlass.svg"
  import weChat from "../assets/icon/weChat.svg"
  // 引入组件
  import waterStationTable from "../components/dashboard/waterStationTable";
  import pieDayChart from "../components/dashboard/pieDayChart";
  import dashboard from "../components/dashboard/dashboard";
  import pollutantLineChart from "../components/dashboard/pollutantLIneChart";
  import resultCarousel from "../components/dashboard/resultCarousel";
  import wordCloud from "../components/dashboard/worldCloud";
  import request from "../utils/request";
  import waterWarning from "../components/dashboard/waterWarning";
  export default {
    data() {
      return {
        magnifyingGlass:magnifyingGlass,
        lightMagnifyingGlass:lightMagnifyingGlass,
        weChat:weChat,
        echartslayer:'',
        echartsOption:'',
        dashboardNewData:{
          waterItemValue:{
            codmii:'',
            nh4:'',
            tn:'',
            tp:'',
            ph:'',
            waterTemp:''
          }
        },
        pointXYList:[],
        overlayText: [],
        overlay: null,
        clickedPointMsg:{
          dataTime:null,

        },
        riverManager:{},
        coordinate:null,

      }
    },
    // 注册组件
    components: {
      waterStationTable,
      pieDayChart,
      dashboard,
      pollutantLineChart,
      resultCarousel,
      wordCloud,
      waterWarning
    },
    /**
     * 数据发生改变
     */

    /**
     * 创建完毕
     */
    created() {
      this.getNewestData()
      this.getPointXY()
    },
    mounted(){
      this.mapRenderer()
      this.$store.commit('showLoading')
            
      const that = this
      let time = window.setTimeout(function (){
          that.$store.commit('hideLoading')
      },1000);
      // this.createECharts()

    },
    /**
     * 里面的方法只有被调用才会执行
     */
    methods: {

      setInnerHtml(){
        var content = document.getElementById("popup-content");
        let hdms = toStringHDMS(toLonLat(this.coordinate)); // 转换为经纬度显示
        console.log(this.riverManager)
        console.log(this.clickedPointMsg.manager)
        let url =true
        content.innerHTML =`
                <span>站点名称：${this.clickedPointMsg.sectionName}站点</span>
                <br>
                <span>监测时间：${this.clickedPointMsg.dateTime}</span>
                <br>

                <span class="waterQuality">水质等级：${this.clickedPointMsg.waterQuality}</span>
                <br>

                <span>经度：${hdms.split(' N ')[1].split('E')[0]}</span>
                <br>
                <span>纬度：${hdms.split(' N ')[0]}</span>
                <br>
                <span>河长姓名：${this.clickedPointMsg.manager.name}</span>
                <br>
                <span>联系方式：${this.clickedPointMsg.manager.call}</span>
                <br>

                <img style="width: 25px;height: 25px;float: left" src=${weChat}  alt="">
                <img style="width: 75px;height: 75px;margin-left: 20px" src=${this.clickedPointMsg.manager.img}  alt="">
                <img  class="zoomPoint" style="float: right;width: 25px;height: 25px;cursor: pointer" src=${magnifyingGlass}  alt="">
                <br>
                `;

        const zoomPoint = document.getElementsByClassName('zoomPoint')[0]
        const _that = this
        console.log(zoomPoint.src)
        console.log()
        zoomPoint.onclick=function () {
          _that.setMapZoom(12)
        }
        zoomPoint.onmouseover=function () {
          console.log(this.lightMagnifyingGlass)
          zoomPoint.setAttribute("src",_that.lightMagnifyingGlass);
        }
        zoomPoint.onmouseout=function () {
          console.log('gg')
          zoomPoint.src = _that.magnifyingGlass
        }
        this.overlay.setPosition(this.coordinate); //把 overlay 显示到指定的 x,y坐标
      },
      setMapZoom(num){
        // 获取当前view对象
        this.map.getView().animate({ // 只设置需要的属性即可
          center: [this.coordinate[0],this.coordinate[1]], // 中心点
          zoom: num, // 缩放级别
          rotation: undefined, // 缩放完成view视图旋转弧度
          duration: 1000 // 缩放持续时间，默认不需要设置
        })

      },
      //获取当前点击站点信息
      getClickedPoint(code){
        request.get('waterenv-monitor/auto/data/detail/now',{
          params:{
            siteCode:code
          }
        }).then(res=>{
          console.log(res)
          this.clickedPointMsg =res.data

          this.setInnerHtml()
        })
      },
      addPopup() {
        // 使用变量存储弹窗所需的 DOM 对象
        var container = document.getElementById("popup");
        var closer = document.getElementById("popup-closer");


        // 创建一个弹窗 Overlay 对象
        this.overlay = new Overlay({
          element: container, //绑定 Overlay 对象和 DOM 对象的
          autoPan: true, // 定义弹出窗口在边缘点击时候可能不完整 设置自动平移效果
          autoPanAnimation: {
            duration: 300 //自动平移效果的动画时间 9毫秒
          }
        });
        // 将弹窗添加到 map 地图中
        this.map.addOverlay(this.overlay);
        let _that = this;
        /**
         * 添加单击响应函数来处理弹窗动作
         */

        this.map.on("singleclick", function(evt) {

          // "EPSG:3857", "EPSG:4326" 转换
          let coordinate = transform(
                  evt.coordinate,
                  "EPSG:3857",
                  "EPSG:4326"
          );
          let select =false
          const pixel = _that.map.getEventPixel(evt.originalEvent)
          // 点击尺 （这里是尺(米)，并不是经纬度
          _that.coordinate = evt.coordinate
          _that.map.forEachFeatureAtPixel(pixel,function (feature) {

            let sectionCode = null

            if(feature.getId()==undefined){
              return
            }else{
              console.log(feature.getId())
              select =true
              sectionCode=feature.getId()

              _that.getClickedPoint(sectionCode)


            }

          })
        });
        this.map.on("pointermove", function(evt) {
          let select =false
          const pixel = _that.map.getEventPixel(evt.originalEvent)
          _that.map.forEachFeatureAtPixel(pixel,function (feature) {
            select =true
            _that.map.getTargetElement().style.cursor='pointer'
          })
          if(!select){
            _that.map.getTargetElement().style.cursor=''
          }
        });
        /**
         * 为弹窗添加一个响应关闭的函数
         */
        closer.onclick = function() {
          _that.overlay.setPosition(undefined);
          closer.blur();
          return false;
        };
      },

      addDynamicPoints(coordinates) {
        // 设置图层
        let pointLayer = new VectorLayer({ source: new VectorSource() });
        // 添加图层
        this.map.addLayer(pointLayer);
        // 循环添加feature
        let pointFeature = [];
        for (let i = 0; i < coordinates.length; i++) {
          // 创建feature，一个feature就是一个点坐标信息
          if(coordinates[i].type=='劣Ⅴ'||coordinates[i].type=='Ⅴ'){
            const feature = new Feature({
              geometry: new Point(
                      fromLonLat([coordinates[i].longitude,coordinates[i].latitude])
              )
            });
            feature.setId(coordinates[i].type)
            pointFeature.push(feature);
          }else{
            continue
          }



        }
        //把要素集合添加到图层
        pointLayer.getSource().addFeatures(pointFeature);
        // 关键的地方在此：监听postrender事件，在里面重新设置circle的样式
        let radius = 0;
        pointLayer.on("postrender", (evt) => {
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


      //获取站点坐标
      getPointXY(){
        request.get('waterenv-monitor/auto/data/getRear').then(res=>{
          console.log(res.data.waterData)
          this.pointXYList=[]
          for(let i=0;i<res.data.waterData.length;i++){
            let pointXY={
              latitude:'',
              longitude:'',
              type:'1',
              sectionName:''
            }
            pointXY.latitude = res.data.waterData[i].latitude
            pointXY.longitude =res.data.waterData[i].longitude
            pointXY.type =res.data.waterData[i].waterQuality
            pointXY.sectionName =res.data.waterData[i].sectionCode
            this.pointXYList.push(pointXY)
          }
          console.log(this.pointXYList)
          this.createSitePointLayer()
          this.addDynamicPoints(this.pointXYList)
        })
      },
      createPlotLayer(){
        this.siteLayer = new VectorLayer({
          source: new VectorSource(),
          zIndex:2,
        })
        this.map.addLayer(this.siteLayer)
      },

      //创建站点监测图层
      createSitePointLayer() {
        this.createPlotLayer()
        //创建图表特性

        const siteStyle = new Style({
          // 设置图片效果
          image: new Icon({
            src:bluePoint,
            scale: 1
          })
        })
        const badSiteStyle = new Style({
          // 设置图片效果
          image: new Icon({
            src:redPoint,
            scale: 1.1
          })
        })
        const commonSiteStyle = new Style({
          // 设置图片效果
          image: new Icon({
            src:yellowPoint,
            scale: 0.4
          })
        })
        console.log(siteStyle)

        const dataPlotList = this.pointXYList//当前所画区域包含站点
        console.log('dataPlotList',dataPlotList)
        for(let i =0 ; i < dataPlotList.length;i++) {

          let siteFeature = new Feature({
            geometry: new Point(
                    fromLonLat([dataPlotList[i].longitude,dataPlotList[i].latitude])
            ),
          })
          siteFeature.setId(dataPlotList[i].sectionName)
          if(dataPlotList[i].type=='Ⅰ'){
            siteFeature.setStyle(siteStyle)
          }else if(dataPlotList[i].type=='劣Ⅴ'||dataPlotList[i].type=='Ⅴ'){
            siteFeature.setStyle(badSiteStyle)
          }else{
            siteFeature.setStyle(commonSiteStyle)
          }

          this.siteLayer.getSource().addFeature(siteFeature)
        }
      },
      getNewestData(){
        request.get('waterenv-monitor/auto/data/area/newest',{params:{
            province:'河北省'
          }}).then(res=>{
          console.log(res.data)
          this.dashboardNewData = res.data
          console.log(this.dashboardNewData)

        })
      },
      createECharts(){
        this.echartslayer = new EChartsLayer(null, {
          hideOnMoving: true,
          hideOnZooming: true
        });
        this.echartslayer.appendTo(this.map);
        this.getJsonToLine()
        this.echartslayer.setChartOptions(this.echartsOption)

      },
      //将json表转化为要素
      getJsonToLine(){

        let data = require('../assets/json/waterWay')
        console.log(data.features)
        let hStep = 300 / (data.features.length - 1);
        let waterLines=[]
        for(let i in data.features){
          let item ={}
          item.coords = data.features[i].geometry.coordinates[0]

          item.lineStyle={
            normal: {
              color: echarts.color.modifyHSL('#5A94DF', Math.round(hStep * 10*i))
            }
          }
          console.log(item)
          waterLines.push(item)
        }
        console.log('waterLines',waterLines)
        this.echartsOption = {
          series: [
            {
              type: 'lines',
              polyline: true,
              data: waterLines,
              silent: true,
              lineStyle: {
                normal: {
                  opacity: 0.2,
                  width: 1
                }
              },
              progressiveThreshold: 500,
              progressive: 200,
              zlevel: 2
            },
            {
              type: 'lines',
              polyline: true,
              data: waterLines,
              lineStyle: {
                normal: {
                  width: 0
                }
              },
              effect: {
                constantSpeed: 20,
                show: true,
                trailLength: 0.1,
                symbolSize: 1.5
              },
              zlevel: 1
            }]
        };
      },
      mapRenderer(){
        let test = new TileLayer({
          source:new TileArcGISRest({
            url:'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
          })
        })
        let test3 = new TileLayer({
          source:new TileArcGISRest({
            url:'http://localhost:6080/arcgis/rest/services/MyMapService/MapServer'
          })
        })
        let test2 = new TileLayer({
          source:new TileArcGISRest({
            url:'http://localhost:6080/arcgis/rest/services/webgis/testGIS/MapServer'
          })
        })
        let baiYangDian = new TileLayer({

          source: new TileSuperMapRest({
            url:'http://121.4.131.9:8090/iserver/services/map-base_map/rest/maps/%E7%99%BD%E6%B4%8B%E6%B7%80@water_base_map'+'?prjCoordSys=%7B%22epsgCode%22:3857%7D',
            transparent: true
          }),
          projection: 'EPSG:3857'
        })
        let sectionPlot = new TileLayer({

          source: new TileSuperMapRest({
            url:'http://121.4.131.9:8090/iserver/services/map-monitor-2/rest/maps/R20220401@monitor'+'?prjCoordSys=%7B%22epsgCode%22:3857%7D',
            transparent: true
          }),
          projection: 'EPSG:3857'
        })
        let sectionPlotLabel = new TileLayer({

          source: new TileSuperMapRest({
            url:'http://121.4.131.9:8090/iserver/services/map-monitor/rest/maps/sectionShow'+'?prjCoordSys=%7B%22epsgCode%22:3857%7D',
            transparent: true
          }),
          projection: 'EPSG:3857'
        })
        let test1 = new TileLayer({

          source: new TileSuperMapRest({
            url:'http://121.4.131.9:8090/iserver/services/map-base_map/rest/maps/water_2@water_base_map'+'?prjCoordSys=%7B%22epsgCode%22:3857%7D',
            transparent: true
          }),
          projection: 'EPSG:3857'
        })
        var untiled = new TileLayer({
          source: new TileSuperMapRest({
            url:'http://121.4.131.9:8090/iserver/services/map-china400/rest/maps/ChinaDark'+'?prjCoordSys=%7B%22epsgCode%22:3857%7D',
            transparent: true
          }),
          projection: 'EPSG:3857'
        });
        var waterLayer = new TileLayer({
          source: new TileSuperMapRest({
            url:'http://121.4.131.9:8090/iserver/services/map-base_map/rest/maps/%E6%B2%B3%E5%8C%97%E7%9C%81_water'+'?prjCoordSys=%7B%22epsgCode%22:3857%7D',
            transparent: true
          }),
          projection: 'EPSG:3857'
        });
        this.baseLayer = new TileLayer({
          visible:true,
          source: new XYZ({
            url: 'http://t{0-7}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=1d109683f4d84198e37a38c442d68311',

            wrapX:true
          })

        })
        this.map = new Map({
          //地图通过map-root的ref属性 进行绑定 也可以使用ID属性
          target: this.$refs["map-container"],
          layers: [
          ],
          view: new View({
            zoom: 7,
            center: transform([116.5,39.35],'EPSG:4326','EPSG:3857'),
            //center: [116.5,39.5],
            //projection: 'EPSG:4326',
            constrainResolution: true //确保OSM缩放到正确的级别
          }),
          controls: defaults({attribution: false, zoom: false, rotate: false }).extend(new Logo())
        })
        // this.map.addControl(overview)
        const labelLayer = new TileLayer({
          visible:true,
          source: new XYZ({
            url: 'http://t{0-7}.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=1d109683f4d84198e37a38c442d68311',

            wrapX:true
          })

        })
        const converLayer = new VectorLayer({
          source: new VectorSource({
            wrapX:false,
            useSpatialIndex: false,
            updateWhileAnimating: true,
            updateWhileInteracting:true

          }),
        });
        let features = (new GeoJSON()).readFeatures(require('@/assets/json/河北省.json'))
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

          converLayer.getSource().addFeature(element)
        })
        // this.map.addLayer(this.baseLayer);
        this.map.addLayer(test)
        this.map.addLayer(test1)
        // this.map.addLayer(test2)
        this.map.addLayer(baiYangDian)
        // this.map.addLayer(labelLayer)
        this.map.addLayer(converLayer);
        // this.map.addLayer(test3)
        // this.map.addLayer(sectionPlot)
        this.map.addLayer(sectionPlotLabel)
        // this.openOverLay()
        this.addPopup()
      }
    }
  }
</script>

<style scoped>
  *{
    margin: 0;
    padding: 0;
  }

  .homeContainer{
    width: 100%;
    height: 100%;
    position: absolute;

  }
  .homeContainer::-webkit-scrollbar {
    display: none;
  }
  .homeItems{
    height: 98%;
    width: 100%;
    justify-content: space-between;
    display: flex;
    display: -webkit-flex;

  }
  .showItem{
    background-color: rgba(255,255,250,.2);
  }


  .leftShow{
    width: 100%;
    height: 32%;
    margin-top: 2.9%;
    z-index: 5;

  }

  .rightShow{
    width: 100%;
    height: 32%;
    margin-top: 3%;
    z-index: 5;
  }
  .dashboardSum>span{
    font-size: 10px;
    color: white;

  }
  .dashboardParameter{
    margin-top: 15px;
  }
  .dashboardParameter>span{
    color: whitesmoke;
    line-height: 32px;

  }
</style>
<style lang="scss" scoped>

  .ol-popup {
    position: absolute;
    background-color: rgba(255,255,255,.5);
    -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
    filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
  }
  .ol-popup:after,
  .ol-popup:before {
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }
  .ol-popup:after {
    border-top-color: white;
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
  }
  .ol-popup:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 48px;
    margin-left: -11px;
  }
  .ol-popup-closer {
    text-decoration: none;
    position: absolute;
    top: 2px;
    right: 8px;
  }
  .popup-content {
    width: 240px;
  }
  .ol-popup-closer:after {
    content: "✖";
  }


</style>


