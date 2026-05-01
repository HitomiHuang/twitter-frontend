import { apiHelper } from './../utility/helpers'
const getToken = () => localStorage.getItem('token')
const authHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } })

export default {
  postTweet({ description }) {
    return apiHelper.post('/api/tweets', { description }, authHeaders())
  },
  getTweets({ limit = 10, offset = 0 } = {}) {
    return apiHelper.get('/api/tweets', { ...authHeaders(), params: { limit, offset } })
  },
  getTweet({ id }) {
    return apiHelper.get(`/api/tweets/${id}`, authHeaders())
  },
  getTweetReplies({ id }) {
    return apiHelper.get(`/api/tweets/${id}/replies`, authHeaders())
  },
  replyTweet({ id, comment }) {
    return apiHelper.post(`/api/tweets/${id}/replies`, { comment }, authHeaders())
  },
  addLike({ id }) {
    return apiHelper.post(`/api/tweets/${id}/like`, null, authHeaders())
  },
  deleteLike({ id }) {
    return apiHelper.post(`/api/tweets/${id}/unlike`, null, authHeaders())
  }
}