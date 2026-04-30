import { apiHelper } from './../utility/helpers'
const getToken = () => localStorage.getItem('token')
const authHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } })

export default {
  signIn({ account, password }) {
    return apiHelper.post('/api/admin/signin', { account, password })
  },
  getTweets() {
    return apiHelper.get('/api/tweets', authHeaders())
  },
  deleteTweet({ id }) {
    return apiHelper.delete(`/api/admin/tweets/${id}`, authHeaders())
  },
  getUsers() {
    return apiHelper.get('/api/admin/users', authHeaders())
  }
}