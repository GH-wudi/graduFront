<template>
    <div>
        <div id="map-quality" v-show="true" ref='quality-map' style="width: 98%;height: 100%;background: rgba(0,0,0);color: #fff;position: absolute;padding: 8px 10px 12px;box-sizing: border-box;">
            <img src="../../assets/icon/return.svg" v-show="mapFlag" @click="hideMap" style="position: absolute;top: 20px;z-index: 1;" alt="">
            <div class="right">
                <!-- <div>
                    <img src="../../assets/icon/analysisInt.svg" alt="">
                    <span style="color: #fff;font-size: 16px;vertical-align: super;margin-left: 5px;">统计分析</span>
                </div> -->
                <div style="height: 28%;">
                    <dv-border-box-12 >
                        <div style="padding: 15px 20px;font-weight: 600;">详细信息</div>
                        <div style="padding: 0 25px;">
                            <el-image 
                                style="width: 172px; height: 118px;display: inline-block;border: 2px dashed #fff;border-radius: 4px;vertical-align: top;"
                                :src="image.url" 
                                :preview-src-list="[image.url]">
                            </el-image>
                            <div style="display:inline-block;padding-left: 42px;"> 
                                <!-- <span>位置：</span>
                                <span>省份：{{image.province}}</span>
                                <span>区县：{{image.city}}</span>
                                <span>乡镇：{{image.county}}</span> -->
                                <span :class="{'borderLieFive': image.waterGrade == '劣','borderFive': image.waterGrade == 'Ⅴ','borderFour': image.waterGrade == 'Ⅳ','borderThree': image.waterGrade == 'Ⅲ','borderTwo': image.waterGrade == 'Ⅱ','borderOne': image.waterGrade == 'Ⅰ'}" style="display: inline-block; width: 122px;height: 122px;border-radius: 50%;font-size: 75px;box-sizing: border-box;text-align: center;">
                                    {{image.waterGrade}}
                                </span>
                            </div>
                        </div>
                    
                    </dv-border-box-12>
                </div>
                <div style="height: 36%;">
                    <dv-border-box-12 >
                        <div style="padding: 15px 20px;font-weight: 600;">
                            <span>各类水质占比</span> 
                            <!-- <select class="chart-select" style="margin-left: 100px;width: 140px;height: 28px;"  v-model="chart.oneCity" @change="chartChangeOneRenderer">
                                <option style="text-align: center; border-radius: 5px;" v-for="item in cities" :label="item.label" :value ="item.value" :key="item.value"></option>
                            </select> -->
                        </div>
                        <div class="one-chart1" style="width: 100%;height: 80%;">

                        </div>
                    </dv-border-box-12>
                </div>
                <div style="height: 36%;">
                    <dv-border-box-12 >
                        <div style="padding: 15px 20px;font-weight: 600;">
                            <span>各类水质数量</span> 
                        </div>
                        <div class="two-chart1" style="width: 100%;height: 80%;">


                        </div>
                    </dv-border-box-12>
                </div>
            </div>
        </div>
        <div id="quality" v-show="!mapFlag"  style="width: 98%;height: 100%;background: rgba(0,0,0);color: #fff;position: absolute;padding: 8px 10px 12px;box-sizing: border-box;">
            <dv-border-box-13  :color="['rgb(15,231,255)']">
            
            </dv-border-box-13>
            <div class="left" >
                <div style="padding: 5px 0;">
                    <img src="../../assets/icon/manageInt.svg" alt="">
                    <span style="color: #fff;font-size: 18px;vertical-align: super;font-weight: 600;">水质识别</span>
                </div>
                <div style="height: 94%;border-sizing: border-box;padding: 0 6px;position: relative;">
                    <!-- <dv-border-box-12 ></dv-border-box-12> -->
                    <span :class="{ 'span-btn': true, 'span-btn-show': !containerFlag}"  @click="containerFlag = false">图片信息</span> 
                    <span :class="{ 'span-btn': true, 'span-btn-show': containerFlag}" style="left: 125px;" @click="containerFlag = true">图片上传</span>
                    <div class="table-container" style="padding: 10px 5px;box-sizing: border-box;" v-show="!containerFlag">
                            <div style="padding: 5px 20px 13px;">
                            <!--  <select class="chart-select"  v-model="params.city" >
                                    <option style="text-align: center; border-radius: 5px;" v-for="item in cities" :label="item.label" :value ="item.value" :key="item.value"></option>
                                </select>
                                <select class="chart-select" style="margin-left: 20px;width: 140px;" v-model="params.grade" >
                                    <option style="text-align: center; border-radius: 5px;" v-for="item in grade" :label="item.label" :value ="item.value" :key="item.value"></option>
                                </select> -->
                                <div style="display: inline-block;padding-top: 5px;">
                                        <el-date-picker
                                            v-model="time"
                                            type="daterange"
                                            start-placeholder="开始时间"
                                            end-placeholder="结束时间"
                                            value-format="YYYY-MM-DD"
                                        />
                                </div>
                                <span @click="searchImageData" style="display: inline-block;padding: 3px 10px 2px;font-size: 15px;border-radius: 8px;border: 2px solid rgb(15,240,255);background: rgba(15,231,255,0.6);margin-left: 20px;cursor: pointer;">
                                    <img src="../../assets/icon/searchInt.svg" style="vertical-align: bottom;" alt="">
                                    <span>搜索</span>
                                </span>
                                <img :src="earthImageFlag? image.earth1 : image.earth2" @click="showMap" @mouseover="earthImageFlag = false"  @mouseout="earthImageFlag = true" style="vertical-align: bottom;float: right;cursor: pointer;" alt="">
                            </div>
                            <el-table
                                :data="imageData"
                                style="width: 100%"
                                :cell-class-name="addClass"
                                height="500"
                                >
                                <el-table-column label="序号" width="70" align="center" >
                                    <template #default="scope">
                                        {{ scope.$index +1 }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="province"  label="省份" width="100"></el-table-column>
                                <el-table-column prop="city" label="市区" width="100"></el-table-column>
                                <el-table-column prop="county" label="镇（乡）" width="100"></el-table-column>
                                <el-table-column prop="uploadTime" label="上传时间" width="180"></el-table-column>
                                <el-table-column prop="status" label="状态" width="100"></el-table-column>
                                <el-table-column prop="waterGrade" label="级别" align="center" width="100"></el-table-column>
                                <el-table-column prop="latitude" label="纬度" width="100"></el-table-column>
                                <el-table-column prop="longitude" label="经度" align="center" width="100"></el-table-column>
                                <el-table-column prop="type" label="操作" align="center">
                                    <template  #default="scope">
                                        <span class="operate-btn" style="border: 2px solid rgba(73,163,255);" @click="imageEditEvent(scope.row)">编辑</span>
                                        <span class="operate-btn" style="margin: 0 10px;" @click="imageShow(scope.row)">详情</span>
                                        <span class="operate-btn" style="border: 2px solid rgba(255,0,0);" @click="deleteImage(scope.row)">删除</span>
                                    </template>
                                </el-table-column>
                            
                            
                            </el-table>
                            <div class="pagination-wrap" style="padding: 10px 5px 10px 650px;">
                                <el-pagination
                                background
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="paginationData.total"
                                :page-sizes="[7, 10, 15,20]"
                                small
                                ></el-pagination>
                            </div>
                    </div>
                    <div class="upload-container" v-show="containerFlag">
                        <div class="uploader"
                            @dragenter="onDragEnter"
                            @dragleave="onDragLeave"
                            @dragover.prevent
                            @drop="onDrop"
                            :class="{dragging: isDragging,'uploader-color': images.length}">
                            <div class="upload-control" v-show="images.length">
                                <label for="file">选择一个文件</label>
                                <label style="margin: 0;" @click="upload">上传</label>
                            </div>
                        <div v-show="!images.length">
                                <img :src="isDragging? upload2Img : uploadImg" alt="">
                                <p>拖拽图片或者点击上传</p>
                                <div class="file-input">
                                    <label for="file" class="label">选择文件</label>
                                    <input type="file" id="file" @change="onInputChange" multiple style="display: none;">
                                </div>
                        </div>

                        <div class="images-preview" v-show="images.length">
                                <div class="img-wrapper" v-for="(image,index) in images" :key="index">
                                    <img :src="image" alt="`Image UPloader ${index}`">
                                    <div class="details">
                                        <span class="name" v-text="files[index].name"></span>
                                        <span class="size" v-text="files[index].size"></span>
                                    </div>
                                </div>
                        </div>

                        </div>
                    </div>
                </div>
                
            </div>
            <div class="right">
                <!-- <div>
                    <img src="../../assets/icon/analysisInt.svg" alt="">
                    <span style="color: #fff;font-size: 16px;vertical-align: super;margin-left: 5px;">统计分析</span>
                </div> -->
                <div style="height: 28%;">
                    <dv-border-box-12 >
                        <div style="padding: 15px 20px;font-weight: 600;">详细信息</div>
                        <div style="padding: 0 25px;">
                            <el-image 
                                style="width: 172px; height: 118px;display: inline-block;border: 2px dashed #fff;border-radius: 4px;vertical-align: top;"
                                :src="image.url" 
                                :preview-src-list="[image.url]">
                            </el-image>
                            <div style="display:inline-block;padding-left: 42px;"> 
                                <!-- <span>位置：</span>
                                <span>省份：{{image.province}}</span>
                                <span>区县：{{image.city}}</span>
                                <span>乡镇：{{image.county}}</span> -->
                                <span :class="{'borderLieFive': image.waterGrade == '劣','borderFive': image.waterGrade == 'Ⅴ','borderFour': image.waterGrade == 'Ⅳ','borderThree': image.waterGrade == 'Ⅲ','borderTwo': image.waterGrade == 'Ⅱ','borderOne': image.waterGrade == 'Ⅰ'}" style="display: inline-block; width: 122px;height: 122px;border-radius: 50%;font-size: 75px;box-sizing: border-box;text-align: center;">
                                    {{image.waterGrade}}
                                </span>
                            </div>
                        </div>
                    
                    </dv-border-box-12>
                </div>
                <div style="height: 36%;">
                    <dv-border-box-12 >
                        <div style="padding: 15px 20px;font-weight: 600;">
                            <span>各类水质占比</span> 
                            <!-- <select class="chart-select" style="margin-left: 100px;width: 140px;height: 28px;"  v-model="chart.oneCity" @change="chartChangeOneRenderer">
                                <option style="text-align: center; border-radius: 5px;" v-for="item in cities" :label="item.label" :value ="item.value" :key="item.value"></option>
                            </select> -->
                        </div>
                        <div class="one-chart" style="width: 100%;height: 80%;">

                        </div>
                    </dv-border-box-12>
                </div>
                <div style="height: 36%;">
                    <dv-border-box-12 >
                        <div style="padding: 15px 20px;font-weight: 600;">
                            <span>各类水质数量</span> 
                        </div>
                        <div class="two-chart" style="width: 100%;height: 80%;">


                        </div>
                    </dv-border-box-12>
                </div>
            </div>
              <el-dialog v-model="imageEdit" title="编辑信息" width="30%" center>
                <div style="display: inline-block; width: 210px;margin: 10px 10px;">
                    <span >省份：</span> 
                    <div style="display: inline-block; width: 168px;">
                        <el-input v-model="params.province"  class="w-50 m-2" size="middle" placeholder="省份"/>
                    </div>
                </div>
                <div style="display: inline-block; width: 210px;margin: 10px 10px;">
                    <span >市区：</span> 
                    <div style="display: inline-block; width: 168px;">
                        <el-input v-model="params.city" class="w-50 m-2" size="middle" placeholder="市区" />
                    </div>
                </div>
                <div style="display: inline-block; width: 210px;margin: 10px 10px;">
                    <span >乡镇：</span> 
                    <div style="display: inline-block; width: 168px;">
                        <el-input v-model="params.county" class="w-50 m-2" size="middle" placeholder="乡镇" />
                    </div>
                    
                </div>
                <div style="display: inline-block; width: 210px;margin: 10px 10px;">
                    <span >纬度：</span> 
                    <div style="display: inline-block; width: 168px;">
                        <el-input v-model="params.latitude" class="w-50 m-2" size="middle" placeholder="纬度" />
                    </div>
                    
                </div>
                <div style="display: inline-block; width: 210px;margin: 10px 10px 0;">
                    <span >经度：</span> 
                    <div style="display: inline-block; width: 168px;">
                        <el-input v-model="params.longitude" class="w-50 m-2" size="middle" placeholder="经度" />
                    </div>
                    
                </div>
                <template #footer>
                <span class="dialog-footer">
                    <el-button @click="imageEdit = false">取消</el-button>
                    <el-button type="primary" @click="submitImageEdit"
                    >确认</el-button
                    >
                </span>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import uploadImg from "../../assets/icon/upload.svg"
import upload2Img from "../../assets/icon/upload2.svg"
import earth1 from "../../assets/icon/earth1.svg"
import earth2 from "../../assets/icon/earth2.svg"
import wclassify1 from "../../assets/icon/wclassify1-2.svg"
import wclassify2 from "../../assets/icon/wclassify2-2.svg"
import wclassify3 from "../../assets/icon/wclassify3-2.svg"
import wclassify4 from "../../assets/icon/wclassify4-2.svg"
import wclassify5 from "../../assets/icon/wclassify5-2.svg"
import wclassifyl5 from "../../assets/icon/wclassifyl5-2.svg"
import closeW from "../../assets/icon/closeW.svg"

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
    name: 'quality',
    data() {
        return {
            dialogFlag: true,
            isDragging: false,
            uploadImg,
            upload2Img,
            dragCount: 0,
            files: [],
            images: [],
            containerFlag: false,
            imageData: [],
            paginationData: {
                total: 0,
                currentPage: 1,
                pageSize: 11
            },
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
            grade: [
                {
                    value:  "劣Ⅴ",
                    label: "劣Ⅴ"
                },{
                    value:  "Ⅴ",
                    label: "Ⅴ"
                },{
                    value:  "Ⅳ",
                    label: "Ⅳ"
                },{
                    value:  "Ⅲ",
                    label: "Ⅲ"
                },{
                    value:  "Ⅱ",
                    label: "Ⅱ"
                },{
                    value:  "Ⅰ",
                    label: "Ⅰ"
                }
            ],
            params: {
                year: '2021',
                month: '2',
                city: '廊坊市',
                classicFlag: true,
                tysonFlag: true,
                grade: '劣Ⅴ'
            },
            socket: null,
            changeData: null,
            image: {
                url: '',
                waterGrade: '',
                borderClass: ''
            },
            chart: {
                one:[0,0,0,0,0,0],
                oneCity: '廊坊市'
            },
            imageAll: null,
            time: '',
            map: null,
            converLayer: null,
            image:{
                earth1,
                earth2,
            },
            earthImageFlag: true,
            mapFlag:true,
            classicLayer: null,
            classify: {
                wclassify1,
                wclassify2,
                wclassify3,
                wclassify4,
                wclassify5,
                wclassifyl5
            },
            overlay: null,
            closeW,
            imageEdit: false,
            params: {
                province: '',
                city: '',
                county: '',
                latitude: '',
                longitude: '',
                sid: '',
                overlayText: []
            },
            classic: {
                ele: null,
                overLay: null
            }
        }
    },
    created() {
        console.log(this.dialogFlag)
        this.getImageData(this.paginationData)
        this.init()
    },
    mounted() {
        this.mapRenderer()
        this.mapFlag = false
        this.closeOverlayText()
    },
    methods: {
        submitImageEdit() {
            request.put('waterenv-system/grade/recognition',this.params
            ).then(res => {
                console.log(res)
                this.getImageData(this.paginationData)
            })
            this.imageEdit = false
        },
        imageEditEvent(row) {
            this.imageEdit = true
            this.params.province = row.province
            this.params.city = row.city
            this.params.county = row.county
            this.params.latitude = row.latitude
            this.params.longitude = row.longitude
            this.params.sid = row.sid
        },
        //删除记录
        deleteImage(row) {
            console.log(row)
            request.delete('waterenv-system/grade/recognition/info/one',{
                params: {
                    sid:row.sid
                }
            }).then(res => {
                console.log(res)
                this.getImageData(this.paginationData)
            })
        },
        //事件：关闭overlay
        closeOverlayText() {
            const that = this
            this.map.on('click',function (e) {
                //再点击时获取像素区域
                const pixel = that.map.getEventPixel(e.originalEvent)
                that.map.forEachFeatureAtPixel(pixel,function (feature) {
                    //清除上一次弹出的窗口
                    if(document.querySelector('.overlay'+feature.getId()) !== null) {
                        document.querySelector('.overlay'+feature.getId()).style.display = "none"
                        // delete that.overlayText[feature.getId()]
                    }
                    console.log(feature.getId())
                    //coodinate存放了点击时的坐标信息
                    const coordinate = e.coordinate
                    let imageObj = null
                    console.log(coordinate,feature);
                    for(let i in that.imageData) {
                        if(that.imageData[i].sid == feature.getId())
                        imageObj = that.imageData[i]
                    }
                    //设置弹出框内容，可以html自定义/* 
                    if(typeof feature.getId() === "undefined") return
                    // that.overlayText[feature.getId()] = feature.getId()
                    const div = document.createElement('div')
                    div.className = `overlay-container overlay`+feature.getId()
                    div.innerHTML = `
                    <div style="padding-bottom: 3px; margin-bottom: 7px;border-bottom: 1px dashed #fff;">
                        <p style="display: inline-block;width: 200px;margin: 0;">详细位置信息</p>
                        <img id="text-${feature.getId()}" style="cursor: pointer;width: 16px;height: 16px;vertical-align: middle;" src="${that.closeW}"/>
                    </div>
                    <img src= ${imageObj.url}/>
                    <p style="margin: 7px 0;">地址：${imageObj.province+imageObj.city+imageObj.county}</p>
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
                    //显示overlay
                    that.map.addOverlay(that.overlay)
                    console.log(document.getElementById("text-"+feature.getId()));
                    document.getElementById("text-"+feature.getId()).onclick = function () {
                        document.querySelector('.overlay'+feature.getId()).style.display = "none"
                        // delete that.overlayText[feature.getId()]

                    }                    
                })
            })

        },
        //设置扩散点效果
        setPlashPoint(data) {
            console.log(data)
            let classColor = ""
            if(data.waterGrade === 'Ⅴ') {
                classColor = 'other'
            }else if(data.waterGrade === '劣Ⅴ') {
                classColor = 'other'
            }else if(data.waterGrade === 'Ⅳ') {
                classColor = 'other'
            }else if(data.waterGrade === 'Ⅰ'){
                classColor = 'other'
            }else if(data.waterGrade === 'Ⅱ'){
                classColor = 'other'
            }else if(data.waterGrade === 'Ⅲ'){
                classColor = 'other'
            }else {
                return
            }
            if(this.classic.ele !== null) {
                this.classic.ele.parentNode.removeChild(this.classic.ele)
            }
            // console.log('全省')

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
            console.log(this.classic.overLay)
            this.map.addOverlay(this.classic.overLay)
            this.classic.overLay.setPosition(transform([data.longitude,data.latitude],'EPSG:4326','EPSG:3857'))
            // this.classic.ele = ele	 
            console.log(ele.parentNode.parentNode)
        },
        //水质分类分析显示
        waterClassify() {
            // this.createTaiSenLayer(this.params.year,this.params.month)
            this.classicLayer = new VectorLayer({
                source: new VectorSource()
            })
            this.map.addLayer(this.classicLayer)
            for(let i in this.imageData) {
                let siteStyle = null
                    
                if(this.imageData[i].waterGrade === 'Ⅰ') {
                    siteStyle = new Style({
                        image: new Icon({
                            src:this.classify.wclassify1
                        })
                    })
                }else if(this.imageData[i].waterGrade === 'Ⅱ') {
                    siteStyle = new Style({
                        image: new Icon({
                            src:this.classify.wclassify2
                        })
                    })
                }else if(this.imageData[i].waterGrade === 'Ⅲ') {
                    siteStyle = new Style({
                        image: new Icon({
                            src:this.classify.wclassify3
                        })
                    })
                }else if(this.imageData[i].waterGrade === 'Ⅳ') {
                    siteStyle = new Style({
                        image: new Icon({
                            src:this.classify.wclassify4
                        })
                    })
                }else if(this.imageData[i].waterGrade === 'Ⅴ') {
                    siteStyle = new Style({
                        image: new Icon({
                            src:this.classify.wclassify5
                        })
                    })
                }else {
                    siteStyle = new Style({
                        image: new Icon({
                            src:this.classify.wclassifyl5
                        })
                    })
                }
                // console.log(classify,this.classify.wclassify2)
            
                const siteSource = this.classicLayer.getSource()
                let feature = new Feature({
                    geometry: new Point(transform([this.imageData[i].longitude,this.imageData[i].latitude],"EPSG:4326","EPSG:3857")),
                })
                
                feature.setStyle(siteStyle)
                feature.setId(this.imageData[i].sid)
                siteSource.addFeature(feature)
                // this.setPlashPoint(this.imageData[i])
                   
            }
        },
        hideMap() {
            this.mapFlag = false
            this.map.removeLayer(this.classicLayer)
        },
        showMap() {
            this.mapFlag = true
            this.waterClassify()
        },
        mapRenderer(){
            this.map = new Map({
                //地图通过map-root的ref属性 进行绑定 也可以使用ID属性
                target: this.$refs["quality-map"],
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
        searchImageData() {
            console.log(this.time)
            request.get('waterenv-system/grade/recognition/info',{
              params: {
                beginTime: this.time[0]+" 00:00:00",
                endTime: this.time[1]+" 00:00:00",
              }
            }).then(res => {
                console.log(res)
                this.imageData = res.rows
                this.chartChangeOneRenderer()
                this.imageShow(this.imageData[0])
            })
        },
        chartChangeTwoRenderer() {
            let chart = this.$echarts.init(document.querySelector('.two-chart'),'dark',{width:'380%',height:'180%'})
            const _this = this
            chart.setOption({
                backgroundColor: 'rgba(0,0,0,0)',
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                    type: 'shadow'
                    }
                },
                title: {
                    text: '',
                    textStyle: {
                        fontSize: 16,
                    },
                    left: 'center'
                },
                grid: {
                    top: '10px',
                    left: '40px',
                    right: '10px',
                    bottom: '15px'
                },
                legend: {
                    data: ['line', 'bar'],
                    textStyle: {
                    color: '#ccc'
                    }
                },
                xAxis: {
                    data: ['劣Ⅴ','Ⅴ','Ⅳ','Ⅲ','Ⅱ','Ⅰ'],
                    axisLine: {
                        lineStyle: {
                            color: '#ccc'
                        },
                        fontSize: 6
                    },
                    axisLabel: {
                        fontSize: 8,
                        interval:0,
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
                        data: _this.chart.one,
                        center: ['50%','80%'],
                        itemStyle: {
                            normal: {
                                //每根柱子颜色设置
                                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    /* { offset: 0, color: '#14c8d4' },
                                    { offset: 1, color: '#43eec6' } */
                                    { offset: 0, color: "#52E5E7" },
                                    { offset: 1, color: "#130CB7" }
                                ]),
                                barBorderRadius: 5
                            } 
                        }
                    },
                ]
            })
            let chart1 = this.$echarts.init(document.querySelector('.two-chart1'),'dark',{width:'380%',height:'180%'})
            chart1.setOption({
                backgroundColor: 'rgba(0,0,0,0)',
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                    type: 'shadow'
                    }
                },
                title: {
                    text: '',
                    textStyle: {
                        fontSize: 16,
                    },
                    left: 'center'
                },
                grid: {
                    top: '10px',
                    left: '40px',
                    right: '10px',
                    bottom: '15px'
                },
                legend: {
                    data: ['line', 'bar'],
                    textStyle: {
                    color: '#ccc'
                    }
                },
                xAxis: {
                    data: ['劣Ⅴ','Ⅴ','Ⅳ','Ⅲ','Ⅱ','Ⅰ'],
                    axisLine: {
                        lineStyle: {
                            color: '#ccc'
                        },
                        fontSize: 6
                    },
                    axisLabel: {
                        fontSize: 8,
                        interval:0,
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
                        data: _this.chart.one,
                        center: ['50%','80%'],
                        itemStyle: {
                            normal: {
                                //每根柱子颜色设置
                                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    /* { offset: 0, color: '#14c8d4' },
                                    { offset: 1, color: '#43eec6' } */
                                    { offset: 0, color: "#52E5E7" },
                                    { offset: 1, color: "#130CB7" }
                                ]),
                                barBorderRadius: 5
                            } 
                        }
                    },
                ]
            })

        },
        chartChangeOneRenderer() {

            this.chart.one[0] =0;this.chart.one[1] =0;this.chart.one[2] =0;this.chart.one[3] =0;this.chart.one[4] =0;this.chart.one[5] =0;
            for(let i in this.imageData) {
                if(this.imageData[i].waterGrade == "劣Ⅴ") {   // 如果是低风险背景色蓝色，字体色白色
                    this.chart.one[5]++ 
                }else if(this.imageData[i].waterGrade == 'Ⅴ') {       // 较大风险
                    this.chart.one[4]++ 
                }else if(this.imageData[i].waterGrade == 'Ⅳ') {       // 较大风险
                    this.chart.one[3]++  
                }else if(this.imageData[i].waterGrade == 'Ⅲ') {       // 较大风险
                    this.chart.one[2]++  
                }else if(this.imageData[i].waterGrade == 'Ⅱ') {       // 较大风险
                    this.chart.one[1]++  
                }else if(this.imageData[i].waterGrade == 'Ⅰ') {       // 较大风险
                    this.chart.one[0]++  
                }
            }
            let chart = this.$echarts.init(document.querySelector('.one-chart'),'dark',{width:'360%',height:'250%'})
            chart.setOption({
                backgroundColor: 'rgba(0,0,0,0)',
                tooltip: {
                    trigger: 'item'
                },
                title: {
                    text: '',
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
                    top: '5%',
                    left: '15%',
                    orient: 'vertical'
                },
                series: [
                    {
                    name: '水质类别',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['75%','36%'],
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
                        { value: this.chart.one[0], name: 'Ⅰ类',itemStyle:{color: 'rgb(56,150,253)'}},
                        { value: this.chart.one[1], name: 'Ⅱ类',itemStyle:{color: 'rgb(79,198,77)'}},
                        { value: this.chart.one[2], name: 'Ⅲ类',itemStyle:{color: 'rgb(255,204,0)'}},
                        { value: this.chart.one[3], name: 'Ⅳ类',itemStyle:{color: 'rgb(255,136,0)'}},
                        { value: this.chart.one[4], name: 'Ⅴ类',itemStyle:{color: 'rgb(255,0,0)'}},
                        { value: this.chart.one[5], name: '劣Ⅴ类',itemStyle:{color: 'rgb(160,37,0)'}},
                    /*  { value: 484, name: 'Union Ads'},
                        { value: 300, name: 'Video Ads'} */
                    ]
                    }
                ]
            })
            let chart1 = this.$echarts.init(document.querySelector('.one-chart1'),'dark',{width:'360%',height:'250%'})
            chart1.setOption({
                backgroundColor: 'rgba(0,0,0,0)',
                tooltip: {
                    trigger: 'item'
                },
                title: {
                    text: '',
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
                    top: '5%',
                    left: '15%',
                    orient: 'vertical'
                },
                series: [
                    {
                    name: '水质类别',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['75%','36%'],
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
                        { value: this.chart.one[0], name: 'Ⅰ类',itemStyle:{color: 'rgb(56,150,253)'}},
                        { value: this.chart.one[1], name: 'Ⅱ类',itemStyle:{color: 'rgb(79,198,77)'}},
                        { value: this.chart.one[2], name: 'Ⅲ类',itemStyle:{color: 'rgb(255,204,0)'}},
                        { value: this.chart.one[3], name: 'Ⅳ类',itemStyle:{color: 'rgb(255,136,0)'}},
                        { value: this.chart.one[4], name: 'Ⅴ类',itemStyle:{color: 'rgb(255,0,0)'}},
                        { value: this.chart.one[5], name: '劣Ⅴ类',itemStyle:{color: 'rgb(160,37,0)'}},
                    /*  { value: 484, name: 'Union Ads'},
                        { value: 300, name: 'Video Ads'} */
                    ]
                    }
                ]
            })
            this.chartChangeTwoRenderer()
        },
        imageShow(row) {
            this.image.url = row.url
            this.image.waterGrade = row.waterGrade
            if(this.image.waterGrade == '劣Ⅴ')
            this.image.waterGrade = '劣'
        },
        init: function () {
            if(typeof(WebSocket) === "undefined"){
                alert("您的浏览器不支持socket")
            }else{
                // 实例化socket
                this.socket = new WebSocket('ws://121.4.131.9:9000/waterenv-alg-manage/webSocket/gradeRecognize')
                // 监听socket连接
                this.socket.onopen = this.open
                // 监听socket错误信息
                this.socket.onerror = this.error
                // 监听socket消息
                this.socket.onmessage = this.getMessage
            }
        },
        open: function () {
            console.log("socket连接成功")
        },
        error: function () {
            console.log("连接错误")
        },
        getMessage: function (msg) {
            console.log(JSON.parse(msg.data))
            console.log(this.imageData)
            for(let key in this.imageData) {
                console.log(this.imageData[key].sid,this.imageData[key].status)
                if(this.imageData[key].sid == JSON.parse(msg.data).sid && this.imageData[key].status != JSON.parse(msg.data).status) {
                    console.log('1111')
                    this.imageData[key].status = JSON.parse(msg.data).status
                    this.imageData[key].waterGrade = JSON.parse(msg.data).waterGrade
                }
            }
            // this.chartChangeOneRenderer()
        },
        send: function () {
            this.socket.send()
        },
        close: function () {
            console.log("socket已经关闭")
        },
        handleCurrentChange(num) {
            this.paginationData.currentPage = num;
            this.getImageData(this.paginationData);

        },
        handleSizeChange(num) {
            this.paginationData.pageSize = num;
            this.getImageData(this.paginationData);
        },
        addClass({row,column,rowIndex,columnIndex}) {
            // if(column.label === "级别") {   
            if( columnIndex == 1 || columnIndex == 2 || columnIndex == 3 || columnIndex == 4 || columnIndex == 6) {   
                if(row.waterGrade == "劣Ⅴ") {   // 如果是低风险背景色蓝色，字体色白色
                    return 'colorBadFive' 
                }else if(row.waterGrade == 'Ⅴ') {       // 较大风险
                    return 'colorFive' 
                }else if(row.waterGrade == 'Ⅳ') {       // 较大风险
                    return 'colorFour' 
                }else if(row.waterGrade == 'Ⅲ') {       // 较大风险
                    return 'colorThree' 
                }else if(row.waterGrade == 'Ⅱ') {       // 较大风险
                    return 'colorTwo' 
                }else if(row.waterGrade == 'Ⅰ') {       // 较大风险
                    return 'colorOne' 
                }
            }
        },
        getImageData(form) {
            request.get('waterenv-system/grade/recognition/info',{
              params: {
                pageNum: form.currentPage,
                pageSize: form.pageSize,
              }
            }).then(res => {
                console.log(res)
                this.imageData = res.rows
                form.total = res.total
                this.chartChangeOneRenderer()
                this.imageShow(this.imageData[0])
            })
        },
       //上传
       onDragEnter(e) {
            this.isDragging = true
            e.preventDefault();
            this.dragCount++
       },
       onDragLeave(e) {
            e.preventDefault();
            this.dragCount--
            
            if(this.dragCount <= 0)
            this.isDragging = false
       },
       onInputChange(e) {
            const files = e.target.files

             Array.from(files).forEach(file => this.addImage(file))
       },
       onDrop(e) {
            e.preventDefault()
            e.stopPropagation()

            this.isDragging = false
            const files = e.dataTransfer.files

            Array.from(files).forEach(file => this.addImage(file))
            
       },
       addImage(file) {
            if(!file.type.match('image.*')) {
                console.log(`${file.name} 不是一张图片`)
                return
            }
            this.files.push(file)
            const img = new Image(),reader = new FileReader()
            reader.onload = (e) => this.images.push(e.target.result)
            reader.readAsDataURL(file)
       },
       upload() {
            const formData = new FormData()

            this.files.forEach(file => {
                formData.append('file',file)
            })

            request.post('waterenv-file/upload/mult?type=image',formData)
                .then(res => {
                    console.log(res)
                    this.images = []
                    this.files = []
                    request.post('waterenv-system/grade/recognition/info',res.data)
                    .then(res2 => {
                        console.log(res.data)
                        console.log(res2)
                        this.containerFlag = false
                        request.get('waterenv-system/grade/recognition/info',{
                            params: {
                                pageNum: 1,
                                pageSize: 11,
                            }
                            }).then(res => {
                                console.log(res)
                                this.imageData = res.rows
                                this.send()
                            })
                    })
                })
            
       }
    },
    destroyed () {
        // 销毁监听
        this.socket.onclose = this.close
    }
}
</script>



<style >
.el-input--small .el-input__inner {
    height: 24px;
    line-height: 24px;
    padding: 0 7px;
    border: 1px solid rgb(192,196,204);
}
.el-input__inner {
    box-shadow: 0px 0px 0px;
    border: 2px solid rgb(192,196,204);
}
.overlay-container {
    width: 230px;
    background-color: rgba(0,0,0,0.5);
    border-radius: 8px 8px;
    padding: 10px;
    border: 1px solid rgba(52,220,200,0.8);
    color: #fff;
    overflow: hidden;
}
.overlay-container img {
    width: 228px;
    height: 120px;
}
.el-scrollbar__wrap {
    overflow: auto;
    background: rgb(0,0,0);
    height: 100%;
}
.el-range-editor.el-input__inner {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    background: #000;
    border: 2px solid rgb(15,231,255);
}
.el-date-editor .el-range-input {
    color: rgb(15, 231, 255);
    background: #000;
}
.el-input__inner:focus {
    outline: 0;
    box-shadow: 0 0 0 1pxvar(--el-input-focus-border-color) inset;
    border: 1px solid rgb(15,240,255);
}
.el-input__inner {
    box-shadow: 0px 0px 0px;
}
.el-input__inner:hover {
    box-shadow: 0px 0px 0px;
}
.el-icon {
    color: rgb(15,231,255) !important;
}
.el-date-editor .el-range-separator {
    color: rgb(15,231,255);
}


.el-pagination.is-background .el-pager li:not(.is-disabled).is-active {
    background-color: var(--el-color-primary);
    color: var(--el-color-white);
    font-weight: 700;
    background: rgb(15,240,255);
}
.el-pagination__total,.el-pagination__jump {
    color: #fff !important;
    margin-right: 16px;
    font-weight: 400;
    color: var(--el-text-color-regular);
}
.el-table .colorBadFive {
    color:rgb(160,37,0)  !important;
}
.el-table .colorFive{
    color:rgb(255,0,0) !important;
}
.el-table .colorFour {
    color: rgb(255,136,0) !important;
}
.el-table .colorThree{
    color:rgb(255,204,0) !important;
}
.el-table .colorTwo {
    color:rgb(79,198,77)  !important;
}
.el-table .colorOne{
    color:rgb(56,150,253) !important;
}

.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf {
    border-bottom: var(--el-table-border);
    background: #000;
    color: #fff;
    /* border-bottom: 1px solid rgba(15,240,255); */
}
.el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell {
    background-color: var(--el-table-row-hover-bg-color);
    background-color: rgba(0,0,0,0.8);
    color: #fff;
}
.uploader {
    position: relative;
    background: #000;
    color: #fff;
    padding: 65px 15px;
    text-align: center;
    border-radius: 10px;
    border: 3px dashed f;
    font-size: 30px;
    height: 78%;
    /* background: rgb(15,231,255); */
}
.uploader-color {
    background: rgba(255,255,255);
}
.label {
    background: #fff;
    /* color: rgb(15,231,255); */
    color: #000;
    width: 100%;
    padding: 12px 58px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
}
.dragging {
    background: #fff;
    color: rgb(15,231,255);
}
.dragging .file-input label {
    background: rgb(15,231,255);
    color: #fff;
}
.images-preview {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;  
}
.images-preview .img-wrapper {
    width: 200px;
    display: flex;
    flex-direction: column;
    margin: 10px;
    height: 145px;
    justify-content: space-between;
    background: #fff;
    box-shadow: 5px 5px 20px #3e3737;
}
.images-preview .img-wrapper img {
    max-height: 105px;
}
.images-preview .details {
    font-size: 12px;
    background: #fff;
    color: #000;
    display: flex;
    flex-direction: column;
    align-items: self-start;
    padding: 3px 6px;

}
.images-preview .details  .name {
    overflow: hidden;
    height: 18px;
}
.upload-control {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: #000;
    border-radius: 10px 10px 0 0;
    padding: 15px;
    text-align: right;
    box-sizing: border-box;
    border-bottom: 7px solid rgb(15,231,255);
}
.upload-control label {
    background: rgb(15, 220, 255,0);
    border: 2px solid rgb(15, 231, 255);
    color: #ffffff;
    font-size: 16px;
    padding: 8px 18px;
    margin-right: 10px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
}
.upload-control label:hover {
    background: rgb(15, 231, 255,0.5);
}

.other {
    border: 4px solid rgba(13,231,253);
	box-shadow: 1px 1px 30px rgba(15,231,253);
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
.pulse {
width: 40px;
height: 40px;
-webkit-border-radius: 50%;
-moz-border-radius: 50%;
border-radius: 50%;
z-index: -2;
opacity: 0;
-webkit-animation: warn 2s ease-out;
-moz-animation: warn 2s ease-out;
animation: warn 2s ease-out;
-webkit-animation-iteration-count: infinite;
-moz-animation-iteration-count: infinite;
animation-iteration-count: infinite;
}

</style>

<style lang="scss" scoped>

#quality,#map-quality {
    .chart-select {
        width: 160px;
        height: 32px;
        border-radius: 5px;
        outline: none;
        margin: 0 12px;
        background: rgba(0,0,0,0.7);
        color: rgb(15,231,255);
        font-weight: 600;
        border: 1px solid rgba(15,231,255);
    }
    .left {
        position: absolute;
        top: 10px;
        width: 74%;
        height: 96%;
        box-sizing: border-box;
        padding: 18px 20px 10px;
        .span-btn {
            display: inline-block;
            padding: 5px 24px;
            border: 2px solid rgb(15, 231, 255);
            font-weight: 600;
            font-size: 15px;
            z-index: 22;
            position: absolute;
            cursor: pointer;
            border-radius: 7px;
        }
        .span-btn:hover {
            background: rgba(15,231,255,0.5);
        }
        .span-btn-show {
            border-radius: 7px 7px 0 0;
            padding-bottom: 8px;
            border-bottom: 2px solid #000;
        }
        .table-container, .upload-container {
            height: 93%;
            width: 100%;
            border: 2px solid rgb(15,231,255);
            border-radius: 0 10px 10px 10px;
            position: absolute;
            z-index: 0;
            top: 35px;
            box-sizing: border-box;
        }
        .operate-btn {
            padding: 0px 7px;
            border: 2px solid rgb(15, 240, 255);
            font-size: 12px;
            display: inline-block;
            color: #fff;
            border-radius: 7px;
            cursor: pointer;
        }
        .operate-btn:hover {
           background: rgba(15,240,255,0.3);
        }
        
    }
    .right {
        position: absolute;
        right: 0px;
        top: 10px;
        width: 26%;
        height: 96%;
        box-sizing: border-box;
        padding: 18px 20px 10px;
        z-index: 1;
        .borderLieFive {
            border: 10px solid rgb(160,37,0);
            color: rgb(160,37,0);
        }
        .borderFive {
            border: 10px solid rgb(255,0,0);
            color: rgb(255,0,0);
        }
        .borderFour {
            border: 10px solid rgb(255,136,0);
            color: rgb(255,136,0);
        }
        .borderThree{
            border: 10px solid rgb(255,204,0);
            color: rgb(255,204,0);
        }
        .borderTwo {
            border: 10px solid rgb(79,198,77);
            color: rgb(79,198,77);
        }
        .borderOne {
            border: 10px solid rgb(56,150,253);
            color: rgb(56,150,253);
        }
    }
}
</style>

