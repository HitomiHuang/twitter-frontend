import { apiHelper } from './../utility/helpers'
const getToken = () => localStorage.getItem('token')

export default {
  signIn({ account, password }) {
    return apiHelper.post('/api/admin/signin', {
      account,
      password
    })
  },
  getTweets() {
    return apiHelper.get('/api/tweets', {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  deleteTweet({id}) {
    return apiHelper.delete(`/api/admin/tweets/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  getUsers() {
    return apiHelper.get('/api/admin/users', {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  }
}