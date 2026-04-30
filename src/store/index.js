import Vue from 'vue'
import Vuex from 'vuex'
import jwt_decode from "jwt-decode";
import router from '../router/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: {
      id: -1,
      email: "",
      name: "",
      role: "",
      account: "",
      cover: "",
      avatar: "",
      introduction: "",
      createdAt: "",
      updatedAt: ""
    },
    isAuthenticated: false,
    token: '',
    unreadNotificationCount: 0,
    unreadPrivateMessageCount: 0,
  },
  getters: {
  },
  mutations: {
    async setCurrentUser(state, token) {
      try {
        const currentUser = jwt_decode(token)

        state.currentUser = {
          ...state.currentUser,
          ...currentUser
        }
        state.isAuthenticated = true
      } catch (error) {
        this.commit('revokeAuthentication')
      }
    },
    setToken(state) {
      state.token = localStorage.getItem('token')
    },
    revokeAuthentication(state) {
      state.currentUser = {}
      state.isAuthenticated = false
      state.token = ''
      state.unreadNotificationCount = 0
      state.unreadPrivateMessageCount = 0
      localStorage.removeItem('token')
      router.push('/signin')
    },
    incrementUnreadCount(state) {
      state.unreadNotificationCount++
    },
    setUnreadCount(state, count) {
      state.unreadNotificationCount = count
    },
    clearUnreadCount(state) {
      state.unreadNotificationCount = 0
    },
    setUnreadPrivateCount(state, count) {
      state.unreadPrivateMessageCount = count
    },
    incrementUnreadPrivateCount(state) {
      state.unreadPrivateMessageCount++
    },
    clearUnreadPrivateCount(state) {
      state.unreadPrivateMessageCount = 0
    }
  },
  actions: {
  },
  modules: {
  }
})
