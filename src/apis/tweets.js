import { apiHelper } from './../utility/helpers'
const getToken = () => localStorage.getItem('token')

export default {
  postTweet({description}) {
    return apiHelper.post('/api/tweets', {
      description
    }, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  getTweets() {
    return apiHelper.get(`/api/tweets`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  getTweet({id}) {
    return apiHelper.get(`/api/tweets/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  getTweetReplies({id}) {
    return apiHelper.get(`/api/tweets/${id}/replies`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  replyTweet({id, comment}) {
    return apiHelper.post(`/api/tweets/${id}/replies`, {comment}, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  addLike({id}) {
    return apiHelper.post(`/api/tweets/${id}/like`,null, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  deleteLike({ id }) {
    return apiHelper.post(`/api/tweets/${id}/unlike`, null, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  }

}