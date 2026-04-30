import { apiHelper } from '../utility/helpers'
const getToken = () => localStorage.getItem('token')
const authHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } })

export default {
  getPublicMessages() {
    return apiHelper.get('/api/chat/public', authHeaders())
  },
  getPrivateMessages({ userId }) {
    return apiHelper.get(`/api/chat/private/${userId}`, authHeaders())
  },
  getConversations() {
    return apiHelper.get('/api/chat/conversations', authHeaders())
  },
  getUnreadPrivateCount() {
    return apiHelper.get('/api/chat/unread-count', authHeaders())
  },
  markMessagesAsRead({ userId }) {
    return apiHelper.put(`/api/chat/private/${userId}/read`, {}, authHeaders())
  },
  recallMessage({ id }) {
    return apiHelper.delete(`/api/chat/messages/${id}`, authHeaders())
  }
}
