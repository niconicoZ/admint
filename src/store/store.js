//引入vue和vuex
import Vue from 'vue'
import Vuex from 'vuex'

//注册vuex
Vue.use(Vuex)

//创建vuex实例, 并暴露出来
const state = {
    username : ''
}
const mutations = {
    SetUsername: (state,username) => {
        state.username = username
        //把取到的用户名存放在本地储存中
        localStorage.setItem('username',username)
    }
}
const actions = {}
const getters = {
    //通过计算数据，从本地储存中取出用户名
    GetUsername: (state) => localStorage.getItem('username')
}

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters
})