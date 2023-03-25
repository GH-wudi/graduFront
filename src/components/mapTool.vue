<template>
    <div @mousedown.stop="move" class="maptool">
        <!-- <span class="el-icon-edit" @click="measure('distence')"></span> -->
        <div  class="iconContainer">
            
            <div :class='[isShowIcon? "icon-show":"icon-hide"]'>
                <el-tooltip class="item" effect="dark" content="定位" placement="bottom-start">
                    <span :class='[isShowIcon? "icon-span-show":"icon-span-hide"]'  @click="changeDrawType({ type: 'Point' })">
                        <img draggable="false" src="../assets/img/icon1.svg" alt="">
                    </span>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="测量距离" placement="bottom">
                    <span  :class='[isShowIcon? "icon-span-show":"icon-span-hide"]' @click="measure('distence')">
                        <img draggable="false" src="../assets/img/distance.svg" alt="">
                    </span>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="测量面积" placement="bottom">
                    <span :class='[isShowIcon? "icon-span-show":"icon-span-hide"]' @click="measure('area')">
                        <img draggable="false" src="../assets/img/area.svg" alt="">
                    </span>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="测量角度" placement="bottom">
                    <span :class='[isShowIcon? "icon-span-show":"icon-span-hide"]' @click="measure('angle')">
                        <img draggable="false" src="../assets/img/angle.svg" alt="">
                     </span>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="放大" placement="bottom">
                  <span :class='[isShowIcon? "icon-span-show":"icon-span-hide"]' @click="zoomin">
                    <img draggable="false" src="../assets/img/big.svg" alt="">
                  </span>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="缩小" placement="bottom">
                  <span :class='[isShowIcon? "icon-span-show":"icon-span-hide"]' @click="zoomout">
                    <img draggable="false" src="../assets/img/small.svg" alt="">
                  </span>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="全屏" placement="bottom">
                  <span :class='[isShowIcon? "icon-span-show":"icon-span-hide"]' @click="fullmap">
                    <img draggable="false" src="../assets/img/icon6.svg" alt="">
                  </span>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="清除" placement="bottom-end">
                  <span :class='[isShowIcon? "icon-span-show":"icon-span-hide"]' @click="clearMeasure">
                    <img draggable="false" src="../assets/img/icon4.svg" alt="">
                  </span>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="经纬度，rgb值" placement="bottom">
                  <span :class='[isShowIcon? "icon-span-show":"icon-span-hide"]' @click="showLlRgb">
                    <img draggable="false" :src="llRgbFlag? llrgb:close" alt="">
                  </span>
                </el-tooltip>
            </div>
            <span  class="icon-tool" @click="spreadTool">
                <img draggable="false" :src='!isShowIcon? toolopen : toolclose' alt="">
            </span>
        </div>
    </div>
</template>

<script>
    import { Draw } from "ol/interaction";
    import { Vector as VectorSource } from "ol/source";
    import { Vector as VectorLayer } from "ol/layer";
    import Overlay from 'ol/Overlay';
    import { Polygon, LineString } from 'ol/geom';
    import Feature from 'ol/Feature';
    import { unByKey } from 'ol/Observable'
    import { getLength, getArea } from 'ol/sphere';
    import Style from "ol/style/Style";
    import Stroke from "ol/style/Stroke";
    import Fill from "ol/style/Fill";
    import Circle from "ol/style/Circle";
    import View from 'ol/View'
    import {transform,transformExtent} from 'ol/proj'
    import { format } from 'ol/coordinate';
    import MousePosition from "ol/control/MousePosition.js";

    import toolopen from "../assets/img/tool.svg"
    import toolclose from "../assets/img/tool2.svg"
    import close from "../assets/img/close.svg"
    import llrgb from "../assets/img/llrgb.svg"

    export default {
        name: "mapTool",
        props: ["map","llRgb","baseLayer","container"],
        data() {
            return {
                close,
                llrgb,
                toolopen,
                toolclose,
                measureType: "diatence",
                draw: null,
                vectorLayer: null,
                tipDiv: null,
                pointermoveEvent: null, // 地图pointermove事件
                sketchFeature: null, // 绘制的要素
                geometryListener: null, // 要素几何change事件
                measureResult: "0", // 测量结果
                isShowIcon: false,
                positionX:0,
                positionY:0,
                isMouseDown: true,
                llRgbFlag: true,
                mousePositionControl: null
            }
        },
        mounted () {
        },
        methods: {
            //显示rgb和经纬度
            showLlRgb() {
                this.llRgbFlag = !this.llRgbFlag
                if(this.llRgbFlag) {
                    this.llRgb.style.display = 'none'
                    this.map.removeControl(this.mousePositionControl);
                    return
                }
                this.llRgb.style.display = 'inline-block'
                const that = this
                this.map.on('pointermove', function(evt) {
                    // if()
                    var xy = evt.pixel;
                    console.log(xy);
                    let length = document.querySelectorAll('.ol-layer').length
                    console.log(length)
                    var canvasContext = document.querySelectorAll('.ol-layer')[length-2].firstChild.getContext('2d');
                    var pixelAtClick = canvasContext.getImageData(xy[0]+150, xy[1]+30,1,1).data;
                    var red = pixelAtClick[0]; // green is [1] , blue is [2] , alpha is [4]
                    console.log(red,pixelAtClick[1],pixelAtClick[2])
                    //$('#box').css('background-color', "rgb("+red+","+pixelAtClick[1]+","+pixelAtClick[2]+")");
                    let color = "rgb("+red+","+pixelAtClick[1]+","+pixelAtClick[2]+")"
                    that.llRgb.firstChild.firstChild.style.backgroundColor = color
                    that.llRgb.firstChild.lastChild.innerHTML = color
                    console.log(that.map.getLayers())
                });

                //鼠标获取坐标控件
                this.mousePositionControl = new MousePosition({
                    coordinateFormat: function (coordinate) {
                        return format(coordinate, '经度:{x} 纬度:{y}', 2);
                    },
                    projection: 'EPSG:4326',
                    className: 'custom-mouse-position',
                    target: this.llRgb.lastChild,
                    undefinedHTML: '&nbsp;&nbsp;&nbsp;'
                });
                //添加控件到地图
                this.map.addControl(this.mousePositionControl);

            },
            /**
             * 工具栏点击事件
             */
            spreadTool() {
                if(this.isMouseDown) return
                this.isShowIcon = !this.isShowIcon
            },
            /**
             * 拖拽效果
             */
            move(e){
                this.isMouseDown = false
                let odiv = document.querySelector('.maptool');    //获取目标元素
                console.log(document);
                //算出鼠标相对元素的位置
                let disX = e.clientX - odiv.offsetLeft;
                let disY = e.clientY - odiv.offsetTop;
                document.onmousemove = (e)=>{    //鼠标按下并移动的事件
                    //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                    let left = e.clientX - disX;
                    let top = e.clientY - disY;
                    let leftWidth = 180
                    if(this.$store.state.common.isCollapse) leftWidth = 64
                    console.log(this.$store.state.common.isCollapse);

                    if(left<=0){//左右边界限定
                        left=0;
                    }else if(left>=document.documentElement.clientWidth-leftWidth-odiv.offsetWidth){//元素在最右边时的判定，屏幕的宽度减去元素自身的宽度
                        left=document.documentElement.clientWidth-leftWidth-odiv.offsetWidth;
                    }if(top<=0){//上下边界限定
                        top=0;
                    }else if(top>=document.documentElement.clientHeight-116-odiv.offsetHeight){//元素在最下边时的判定，屏幕的高度减去元素自身的高度
                        top=document.documentElement.clientHeight-116-odiv.offsetHeight;
                    }

                    //绑定元素位置到positionX和positionY上面
                    this.positionX = top;
                    this.positionY = left;

                    //移动当前元素
                    odiv.style.left = left + 'px';
                    odiv.style.top = top + 'px';
                    console.log(left,top);
                    this.isMouseDown = true
                };

                document.onmouseup = (e) => {
                    console.log('2222');
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            },

            /**
             * 工具栏
             */
            fullmap() {
                if(this.isMouseDown) return
                this.map.setView(new View({
                    center: transform([116.5,39.5],'EPSG:4326','EPSG:3857'),
                    zoom: 4
                }));
            },
            zoomin() {
                if(this.isMouseDown) return
                const view = this.map.getView();
                let zoom = view.getZoom();
                view.setZoom(zoom + 1);
            },
            zoomout() {
                if(this.isMouseDown) return
                const view = this.map.getView();
                let zoom = view.getZoom();
                view.setZoom(zoom - 1);
            },
            creatDraw(type) {
                let maxPoints = null;
                if (this.measureType == "angle") maxPoints = 3
                else maxPoints = null

                // 矢量图层源
                let vectorSource = new VectorSource({
                    wrapX: false
                });
                // 矢量图层
                this.vectorLayer = new VectorLayer({
                    source: vectorSource,
                    style: new Style({
                        fill: new Fill({
                            color: 'rgba(252, 86, 49, 0.1)'
                        }),
                        stroke: new Stroke({
                            color: '#fc5531',
                            width: 3
                        }),
                        image: new Circle({
                            radius: 0,
                            fill: new Fill({
                                color: '#fc5531'
                            })
                        })
                    }),
                    name: "测量图层"
                });
                this.map.addLayer(this.vectorLayer)
                this.draw = new Draw({
                    source: vectorSource,
                    type: type,
                    maxPoints: maxPoints,
                    style: new Style({
                        fill: new Fill({
                            color: 'rgba(252, 86, 49, 0.1)'
                        }),
                        stroke: new Stroke({
                            color: '#fc5531',
                            lineDash: [10, 10],
                            width: 3
                        }),
                        image: new Circle({
                            radius: 0,
                            fill: new Fill({
                                color: '#fc5531'
                            })
                        })
                    }),
                    // 绘制时点击处理事件
                    condition: (evt) => {
                        // 测距时添加点标注
                        if (this.measureResult != "0" && !this.map.getOverlayById(this.measureResult) && this.measureType == "distence")
                            this.creatMark(null, this.measureResult, this.measureResult).setPosition(evt.coordinate)
                        return true
                    }
                });
                this.map.addInteraction(this.draw);

                /**
                 * 绘制开始事件
                 */
                this.draw.on("drawstart", e => {
                    this.sketchFeature = e.feature
                    let proj = this.map.getView().getProjection()
                    //******距离测量开始时*****//
                    if (this.measureType == "distence") {
                        this.creatMark(null, "起点", "start").setPosition(this.map.getCoordinateFromPixel(e.target.downPx_))
                        this.tipDiv.innerHTML = "总长：0 m</br>单击确定地点，双击结束";
                        this.geometryListener = this.sketchFeature.getGeometry().on('change', (evt) => {
                            this.measureResult = this.distenceFormat(getLength(evt.target, { "projection": proj, "radius": 6378137 }))
                            this.tipDiv.innerHTML = "总长：" + this.measureResult + "</br>单击确定地点，双击结束";
                        })
                    }
                    //******面积测量开始时*****//
                    else if (this.measureType == "area") {
                        this.tipDiv.innerHTML = "面积：0 m<sup>2</sup></br>继续单击确定地点";
                        this.geometryListener = this.sketchFeature.getGeometry().on('change', (evt) => {
                            if (evt.target.getCoordinates()[0].length < 4) this.tipDiv.innerHTML = "面积：0m<sup>2</sup></br>继续单击确定地点";
                            else {
                                this.measureResult = this.formatArea(getArea(evt.target, { "projection": proj, "radius": 6378137 }))
                                this.tipDiv.innerHTML = "面积：" + this.measureResult + "</br>单击确定地点，双击结束";
                            }
                        })
                    }
                    //******角度测量开始时*****//
                    else if (this.measureType == "angle") {
                        this.tipDiv.innerHTML = "继续单击确定顶点";
                        this.geometryListener = this.sketchFeature.getGeometry().on('change', (evt) => {
                            if (evt.target.getCoordinates().length < 3) this.tipDiv.innerHTML = "继续单击确定顶点";
                            else {
                                this.measureResult = this.formatAngle(evt.target)
                                this.tipDiv.innerHTML = "角度：" + this.measureResult + "</br>继续单击结束";
                            }
                        })
                    }
                });

                /**
                 * 绘制开始事件
                 */
                this.draw.on("drawend", e => {
                    let closeBtn = document.createElement('span');
                    /*closeBtn.innerHTML = "×";
                    closeBtn.style = `width: 14px;
                    height:14px;
                    line-height: 14px;
                    text-align: center;
                    border-radius: 10px;
                    display: inline-block;
                    padding: 2px;
                    color: rgb(255, 255, 255);
                    border: 1px solid rgb(255, 0, 0);
                    background-color: rgba(0, 0, 0,0.5);
                    font-weight: 600;
                    position: absolute;
                    top: -25px;right: -2px;
                    cursor: pointer;`*/
                    closeBtn.addEventListener('click', () => {
                        this.clearMeasure()
                    })
                    //******距离测量结束时*****//
                    if (this.measureType == "distence") {
                        this.creatMark(closeBtn, null, "close1").setPosition(e.feature.getGeometry().getLastCoordinate());
                        this.creatMark(null, "总长：" + this.measureResult + "", "length").setPosition(e.feature.getGeometry().getLastCoordinate())
                        this.map.removeOverlay(this.map.getOverlayById(this.measureResult))
                    }
                    //******面积测量结束时*****//
                    else if (this.measureType == "area") {
                        this.creatMark(closeBtn, null, "close2").setPosition(e.feature.getGeometry().getInteriorPoint().getCoordinates());
                        this.creatMark(null, "总面积：" + this.measureResult + "", "area").setPosition(e.feature.getGeometry().getInteriorPoint().getCoordinates())
                    }
                    //******角度测量结束时*****//
                    else if (this.measureType == "angle") {
                        this.creatMark(closeBtn, null, "close3").setPosition(e.feature.getGeometry().getCoordinates()[1]);
                        this.creatMark(null, "角度：" + this.measureResult + "", "angle").setPosition(e.feature.getGeometry().getCoordinates()[1])
                    }
                    // 停止测量
                    this.stopMeasure();
                });
            },
            /**
             * 测量
             */
            measure(type) {
                if(this.isMouseDown) return
                if (this.draw != null) return false; // 防止在绘制过程再创建测量
                this.measureType = type;
                if (this.vectorLayer != null) this.clearMeasure();
                this.tipDiv = document.createElement('div');
                this.tipDiv.innerHTML = '单击确定起点';
                this.tipDiv.className = "tipDiv";
                this.tipDiv.style = `width:auto;
                        height:auto;
                        padding:4px;
                        border:1px solid #fc5531;
                        border-radius: 10px;
                        font-size:12px;
                        background-color:rgba(0,0,0,0.5);
                        position:relative;
                        top:60%;left:60%;
                        font-weight:600;
                        color: #fff;`

                let overlay = new Overlay({
                    element: this.tipDiv,
                    autoPan: false,
                    positioning: "bottom-center",
                    id: "tipLay",
                    stopEvent: false //停止事件传播到地图
                });
                this.map.addOverlay(overlay);

                this.pointermoveEvent = this.map.on("pointermove", evt => {
                    overlay.setPosition(evt.coordinate)
                })
                if (this.measureType == "distence" || this.measureType == "angle") {
                    this.creatDraw("LineString")
                }
                else if (this.measureType == "area") {
                    this.creatDraw("Polygon")
                }
            },
            /**
             * 创建标记
             */
            creatMark(markDom, txt, idstr) {
                if (markDom == null) {
                    markDom = document.createElement('div');
                    markDom.innerHTML = txt
                    markDom.style = `width:auto;
        height:auto;
        padding:4px;
        border:1px solid #fc5531;
        font-size:12px;
        background-color:rgba(0,0,0,0.5);
        border-radius: 10px;
        position:relative;
        top:60%;left:60%;
        font-weight:600;
        color: #fff;`
                }
                let overlay = new Overlay({
                    element: markDom,
                    autoPan: false,
                    positioning: "bottom-center",
                    id: idstr,
                    stopEvent: false
                });
                this.map.addOverlay(overlay)
                return overlay;
            },
            /**
             * 格式化距离结果输出
             */
            distenceFormat(length) {
                let output;
                if (length > 100) {
                    output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km'; //换算成km单位
                } else {
                    output = (Math.round(length * 100) / 100) + ' ' + 'm'; //m为单位
                }
                return output;//返回线的长度
            },
            /**
             * 格式化面积输出
             */
            formatArea(area) {
                let output;
                if (area > 10000) {
                    output = (Math.round(area / 1000000 * 100) / 100) + ' ' + 'km<sup>2</sup>'; //换算成km单位
                } else {
                    output = (Math.round(area * 100) / 100) + ' ' + 'm<sup>2</sup>';//m为单位
                }
                return output; //返回多边形的面积
            },
            /**
             * 计算角度输出
             */
            formatAngle(line) {
                var coordinates = line.getCoordinates();
                var angle = '0°';
                if (coordinates.length == 3) {
                    const disa = getLength(new Feature({
                        geometry: new LineString([coordinates[0], coordinates[1]])
                    }).getGeometry(), {
                        radius: 6378137,
                        projection: this.map.getView().getProjection()
                    });

                    const disb = getLength(new Feature({
                        geometry: new LineString([coordinates[1], coordinates[2]])
                    }).getGeometry(), {
                        radius: 6378137,
                        projection: this.map.getView().getProjection()
                    });

                    const disc = getLength(new Feature({
                        geometry: new LineString([coordinates[0], coordinates[2]])
                    }).getGeometry(), {
                        radius: 6378137,
                        projection: this.map.getView().getProjection()
                    });
                    var cos = (disa * disa + disb * disb - disc * disc) / (2 * disa * disb); // 计算cos值
                    angle = (Math.acos(cos) * 180) / Math.PI; // 角度值
                    angle = angle.toFixed(2); // 结果保留两位小数
                }
                if (isNaN(angle)) return "0°"
                else return angle + "°"; // 返回角度
            },
            /**
             * 停止测量
             */
            stopMeasure() {
                this.tipDiv = null
                this.map.removeInteraction(this.draw); // 移除绘制组件
                this.draw = null;
                this.map.removeOverlay(this.map.getOverlayById("tipLay")) // 移除动态提示框
            },
            /**
             * 清除测量
             */
            clearMeasure() {
                if(this.isMouseDown) return
                this.vectorLayer.getSource().clear()
                this.map.getOverlays().clear()
                //移除监听事件
                unByKey(this.pointermoveEvent) // 清除鼠标在地图的pointermove事件
                unByKey(this.geometryListener) // 清除绘制图像change事件
                this.pointermoveEvent = null;
                this.geometryListener = null;
                this.measureResult = "0"
            },
            /**
             * 定点
             */



        },
    }
</script>

<style scoped lang="scss">
    .item {
        margin: 4px;
    }
    .icon-show {
        width: 298px;
        height: 30px;
        transition: width 0.3s;
        overflow: hidden;
    }
    .icon-hide {
        width: 0px;
        height: 30px;
        transition: width 0.3s;
        overflow: hidden;
    }
    .maptool {
        position: absolute;
        top: 35px;
        right: 48px;
        z-index: 1;
        .iconContainer {
            display: flex;
            .icon-tool {
                display: inline-block;
                width: 30px;
                height: 30px;

                background-color: #fff;
                box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.8);
                border-radius: 8px;
                margin-right: 2px;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            div {
                /*  display: flex;
                 align-items: center; */
                .icon-span-show {
                    /* display: flex; */
                    // flex: 1;
                    display: inline-block;
                    width: 27px;
                    height: 27px;
                    border-radius: 50%;
                    background-color: #fff;
                    margin: 1px 3px;
                    line-height: 27px;
                    text-align: center;
                    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
                    //transition: all 0.5s linear;
                    overflow: hidden;
                    img {
                        margin-top: 3px;
                        width: 70%;
                        height: 70%;
                    }
                }
                .icon-span-hide {
                    //flex: 1;
                    display: inline-block;
                    width: 27px;
                    height: 27px;
                    border-radius: 50%;
                    background-color: #fff;
                    margin: 1px 3px;
                    line-height: 27px;
                    text-align: center;
                    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
                    // transition: all 0.5s linear;
                    overflow: hidden;
                    img {
                        margin-top: 3px;
                        width: 70%;
                        height: 70%;
                    }
                }
            }
        }
    }
</style>
