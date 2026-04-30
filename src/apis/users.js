import { apiHelper } from './../utility/helpers'
const getToken = () => localStorage.getItem('token')
const authHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } })

export default {
  getUser({ id }) {
    return apiHelper.get(`/api/users/${id}`, authHeaders())
  },
  getUserTweets({ id }) {
    return apiHelper.get(`/api/users/${id}/tweets`, authHeaders())
  },
  getUserRepliedTweets({ id }) {
    return apiHelper.get(`/api/users/${id}/replied_tweets`, authHeaders())
  },
  getUserLikes({ id }) {
    return apiHelper.get(`/api/users/${id}/likes`, authHeaders())
  },
  editUser({ id, data }) {
    return apiHelper.put(`/api/users/${id}`, data, authHeaders())
  },
  getTopUsers() {
    return apiHelper.get('/api/users/top', authHeaders())
  },
  addFollowing({ id }) {
    return apiHelper.post('/api/followships', { id }, authHeaders())
  },
  deleteFollowing({ id }) {
    return apiHelper.delete(`/api/followships/${id}`, authHeaders())
  },
  getUserFollowings({ id }) {
    return apiHelper.get(`/api/users/${id}/followings`, authHeaders())
  },
  getUserFollowers({ id }) {
    return apiHelper.get(`/api/users/${id}/followers`, authHeaders())
  },
  toggleFollowingNotification({ followingId, notificationEnabled }) {
    return apiHelper.put(
      `/api/followships/${followingId}/notification`,
      { notificationEnabled },
      authHeaders()
    )
  }
}