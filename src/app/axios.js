//引入axios
import axios from 'axios'

//设置axios统一的请求路径
const baseURL = 'http://localhost:8888/api/private/v1/'
axios.defaults.baseURL = baseURL

//添加axios拦截器
axios.interceptors.request.use(function(config){
    //将token给到一个前后台约定好的key中，作为请求中的请求头发送到后台
    let token = localStorage.getItem('mytoken')
    //如果本地存储中含有token，就加入到请求头中
    if(token) {
        config.headers['Authorization'] = token
    }
    return config
},function(error) {
   return Promise.reject(error) 
})


//登陆验证--提交用户的表单信息 
export const checkUser = params => {
    return axios.post('login', params).then(res => res.data)
}
//获取用户列表
export const getUserList = params => {
    return axios.get('users', params).then(res => res.data)
}
//更改用户状态
export const changeUserState = params => {
    return axios.put(`users/${params.uid}/state/${params.type}`).then( res => res.data )
}
//添加用户
export const addUser = params => {
    return axios.post('users',params).then( res => res.data )
}
//根据ID获取用户信息
export const getUserById = params => {
    return axios.get(`users/${params.id}`).then( res => res.data )
}
//编辑用户信息
export const editUser = params => {
    return axios.put(`users/${params.id}`,params).then( res => res.data )
}
//删除用户信息
export const deletetUser = params => {
    return axios.delete(`users/${params}`).then( res => res.data )
}
//获取全部角色列表
export const rolesUser = params => {
    return axios.get('roles').then( res => res.data )
}
//分配用户角色
export const grantUser = params => {
    return axios.put(`users/${params.id}/role`,{id:params.id, rid:params.rid}).then( res => res.data )
}