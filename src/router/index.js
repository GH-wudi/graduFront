import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/system/login.vue'
import Index from '../views/system/index.vue'
import Test from '../views/test'


const routes = [
    {
        path: '/',
        name: '',
        component: Login,
        hidden: true,
        meta: {
            requireAuth: false,
            title: '登录'
        }
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        hidden: true,
        meta: {
            requireAuth: false,
            title: '登录'
        }
    },
    {
        path: '/test',
        name: '',
        component: Test,
        hidden: true,
        meta: {
            requireAuth: false
        }
    },
    {
        path: '/index',
        name: '',
        component: Index,
        hidden: true,
        meta: {
            requireAuth: false
        },
        children: [{
            path: '/home',
            name: 'Home',
            component: Home,
            meta: {
                requireAuth: false,
                title: "空地一体化水环境智能监测平台",
            },
        },{
            path: '/analysis',
            name: 'analysis',
            meta: {
                requireAuth: false,
                title: "数据分析",
            },
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ '../views/Analysis.vue')
        },{
            path: '/spaceTime',
            name: 'spaceTime',
            meta: {
                requireAuth: false,
                title: "水域时空变化",
            },
            component: () => import(/* webpackChunkName: "about" */ '../views/spaceTime.vue')
        },{
            path: '/intelligence',
            name: 'intelligence',
            meta: {
                requireAuth: false,
                title: "污染智能识别",
            },
            component: () => import('../views/IntelligenceDis.vue')
        },{
            path: '/reciprocal',
            name: 'reciprocal',
            meta: {
                requireAuth: false,
                title: "水质参数反演",
            },
            component: () => import('../views/WaterReciprocal')
        }]
    },


]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})
// 当一个导航触发时，全局的 before 钩子按照创建顺序调用。钩子是异步解析执行，此时导航在所有钩子 resolve 完之前一直处于等待中。
router.beforeEach((to, from, next) => {
    // 自动化修改页面标签的 title
    document.title = to.meta.title;
    next();
    // 如果已经登录，并且要去登录页，就不让TA去登录页，重定向到首页
    // if (to.path === "/signin" && localStorage.token) {
    //   next("/dashboard");
    // } else {
    //   next();
    // }
});
export default router
