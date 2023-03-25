<template>
    <div class="right-bar" style="">
        <img class="clicked" :src="svgs.polluteClick" alt="" @click="click">
        <img class="delete" :src="svgs.polluteDelete" alt="" @click="clickDelete">
    </div>
</template>

<script>

import polluteClick from '../../assets/icon/polluteClick.svg'
import polluteDelete from '../../assets/icon/delete.svg'

export default {
    name: 'right-bar',
    props: ['map','polluteW'],
    data() {
        return {
            svgs: {
                polluteClick,
                polluteDelete
            },
            pollute: {
                pointLayer: null
            }
        }
    },
    mounted() {
        console.log(this.map)
    },
    created() {
        
    },
    methods: {
       click() {
        console.log(this.polluteW)
        this.polluteW.flag = true
       },
       clickDelete() {
            this.polluteW.flag = false
            this.polluteW.clearPolluteLayer()
       }
       
    }
}
</script>

<style lang="scss" scoped>
    .right-bar {
        background: rgb(0,0,0,0.7);
        width: 60px;
        height: 180px;
        position: absolute;
        top: 45px;
        left: 0px;
        padding: 10px 20px;
        .clicked:hover {
            box-shadow: 0px 1px 10px rgba(52,210,200);
        }
        .clicked {
            width: 36px;
            height: 36px;
            border: 2px solid rgb(52,210,200);
            border-radius: 8px;
            box-sizing: border-box;
            padding: 5px;
            cursor: pointer;
            margin-bottom: 10px;
        }
        .delete:hover {
            box-shadow: 0px 1px 10px rgba(52,210,200);
        }
        .delete {
            width: 36px;
            height: 36px;
            border: 2px solid rgb(52,210,200);
            border-radius: 8px;
            box-sizing: border-box;
            padding: 5px;
            cursor: pointer;
        }
    }
</style>
