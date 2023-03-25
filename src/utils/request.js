import axios from 'axios'

const request = axios.create({
    baseURL:"http://121.4.131.9:9000/"
	
})

// request 拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['Access-Control-Allow-Methods'] = "OPTIONS, GET, POST";
    //config.headers['token'] = user.token;  // 设置请求头
    //拦截未登录用户访问资源路由的请求 ，依靠Session
   /* const userJSON = sessionStorage.getItem("user")
    // 取出sessionStorage里面缓存的用户信息
    let userJson = sessionStorage.getItem("user")
    if(!userJson) {
        router.push("/login")
    } else {
        let user = JSON.parse(userJson);
        config.headers['token'] = user.token;  // 设置请求头
    }*/

    return config //必须有 靠他返回路由


}, error => {
    return Promise.reject(error)
});

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
    response => {
        let res = response.data;
        // 如果是返回的文件
        if (response.config.responseType === 'blob') {
            return res
        }
        // 兼容服务端返回的字符串数据
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }
        return res;
    },
    error => {
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)


export default request

