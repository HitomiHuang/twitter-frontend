import Vue from 'vue'
import VueRouter from 'vue-router'
import SignIn from '../views/SignIn.vue'
import Main from '../views/Main.vue'
import store from '../store'
import NotFound from '../views/NotFound.vue'


Vue.use(VueRouter)

const authorizeIsAdmin = (to, from, next) => {
  const currentUser = store.state.currentUser
  if (currentUser && (currentUser.role !== 'admin')) {
    next('/not-found')
    return
  }

  next()
}

const authorizeIsUser = (to, from, next) => {
  const currentUser = store.state.currentUser
  if (currentUser && (currentUser.role !== 'user')) {
    next('/not-found')
    return
  }

  next()
}

const routes = [
  {
    path: '/',
    name: 'root',
    redirect: '/main'
  },
  {
    path: '/main',
    name: 'main',
    component: Main,
    beforeEnter: authorizeIsUser
  },
  {
    path: '/tweets/:id',
    name: 'tweet',
    component: () => import('../views/Tweet.vue'),
    beforeEnter: authorizeIsUser
  },
  {
    path: '/user/self/:type',
    name: 'user-self',
    component: () => import('../views/UserSelf.vue'),
    beforeEnter: authorizeIsUser
  },
  // {
  //   path: '/user/self/comments',
  //   name: 'user-self-comments',
  //   component: () => import('../views/UserSelfComments.vue'),
  //   beforeEnter: authorizeIsUser
  // },
  // {
  //   path: '/user/self/likes',
  //   name: 'user-self-likes',
  //   component: () => import('../views/UserSelfLikes.vue'),
  //   beforeEnter: authorizeIsUser
  // },
  {
    path: '/user/:id/:type',
    name: 'user-other',
    component: () => import('../views/UserOther.vue'),
    beforeEnter: (to, from, next) => {
      const currentUser = store.state.currentUser
      if (currentUser && (currentUser.role !== 'user')) {
        next('/not-found')
        return
      } else if (to.params.id == store.state.currentUser.id) {
        next('/user/self/tweets')
      }

      next()
    }
  },
  // {
  //   path: '/user/:id/comments',
  //   name: 'user-comments',
  //   component: () => import('../views/UserOtherComments.vue'),
  //   beforeEnter: (to, from, next) => {
  //     const currentUser = store.state.currentUser
  //     if (currentUser && (currentUser.role !== 'user')) {
  //       next('/not-found')
  //       return
  //     } else if (to.params.id == store.state.currentUser.id) {
  //       next('/user/self/comments')
  //     }

  //     next()
  //   }
  // },
  // {
  //   path: '/user/:id/likes',
  //   name: 'user-likes',
  //   component: () => import('../views/UserOtherLikes.vue'),
  //   beforeEnter: (to, from, next) => {
  //     const currentUser = store.state.currentUser
  //     if (currentUser && (currentUser.role !== 'user')) {
  //       next('/not-found')
  //       return
  //     } else if (to.params.id == store.state.currentUser.id) {
  //       next('/user/self/likes')
  //     }

  //     next()
  //   }
  // },
  {
    path: '/user/:id/followings',
    name: 'user-followings',
    component: () => import('../views/UserFollowings.vue'),
    beforeEnter: authorizeIsUser
  },
  {
    path: '/user/:id/followers',
    name: 'user-followers',
    component: () => import('../views/UserFollowers'),
    beforeEnter: authorizeIsUser
  },
  {
    path: '/admin/signin',
    name: 'admin-sign-in',
    component: () => import('../views/AdminSignIn.vue'),
  },
  {
    path: '/admin/tweets',
    name: 'admin-tweets',
    component: () => import('../views/AdminTweets.vue'),
    beforeEnter: authorizeIsAdmin
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: () => import('../views/AdminUsers.vue'),
    beforeEnter: authorizeIsAdmin
  },
  {
    path: '/signin',
    name: 'sign-in',
    component: SignIn
  },
  {
    path: '/signup',
    name: 'sign-up',
    component: () => import('../views/SignUp.vue')
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('../views/Setting.vue')
  },
  {
    path: '*',
    name: 'not-found',
    component: NotFound
  }
]


const router = new VueRouter({
  routes,
  linkExactActiveClass: 'active'
})


router.beforeEach(async (to, from, next) => {
  // 從 localStorage 取出 token
  const tokenInLocalStorage = localStorage.getItem('token')
  const tokenInStore = store.state.token


  // 在登入的情況下 如果token存在且不相符時自動登出
  if (tokenInLocalStorage && tokenInStore && tokenInStore !== tokenInLocalStorage) {
    store.commit('revokeAuthentication')
  }
  // 在登入的情況下 按下重新整理 store.state.token會變回空值 重新給store.state賦值
  else if (tokenInLocalStorage && !tokenInStore) {
    store.commit('setCurrentUser', tokenInLocalStorage)
    store.commit('setToken')
  }


  let isAuthenticated = store.state.isAuthenticated


  const pathsWithoutAuthentication = ['sign-in', 'sign-up', 'admin-sign-in']

  // 如果 token 無效，且要去除了登入和註冊以外的其他頁面，則轉址到登入頁
  if (!isAuthenticated && !pathsWithoutAuthentication.includes(to.name)) {
    next('/signin')
    return
  }

  // 如果 token 有效，且要去登入和註冊頁，則轉址到首頁
  if (isAuthenticated && pathsWithoutAuthentication.includes(to.name)) {
    next('/main')
    return
  }

  next()
})
export default router
