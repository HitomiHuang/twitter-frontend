import { apiHelper } from './../utility/helpers'
const getToken = () => localStorage.getItem('token')

export default {
  getUser({id}) {
    return apiHelper.get(`/api/users/${id}`, {
      headers: {Authorization: `Bearer ${getToken()}`}
    })
  },
  getUserTweets({id}) {
    return apiHelper.get(`/api/users/${id}/tweets`, {
      headers: {Authorization: `Bearer ${getToken()}`}
    })
  },
  getUserRepliedTweets({id}) {
    return apiHelper.get(`/api/users/${id}/replied_tweets`, {
      headers: {Authorization: `Bearer ${getToken()}`}
    })
  },
  getUserLikes({id}) {
    return apiHelper.get(`/api/users/${id}/likes`, {
      headers: {Authorization: `Bearer ${getToken()}`}
    })
  },
  editUser({id, data}) {
    return apiHelper.put(`/api/users/${id}`, data, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  getTopUsers() {
    return apiHelper.get('/api/users/top', {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  addFollowing({id}) {
    return apiHelper.post('/api/followships',{id},{
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  deleteFollowing({ id }) {
    return apiHelper.delete(`/api/followships/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  getUserFollowings({ id }) {
    return apiHelper.get(`/api/users/${id}/followings`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  getUserFollowers({ id }) {
    return apiHelper.get(`/api/users/${id}/followers`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
}