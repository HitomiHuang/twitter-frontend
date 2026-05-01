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
      } catch(error) {
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
      localStorage.removeItem('token')
      router.push('/signin')
    }
  },
  actions: {
  },
  modules: {
  }
})
