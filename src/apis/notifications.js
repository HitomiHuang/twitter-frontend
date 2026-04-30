import { apiHelper } from './../utility/helpers'
const getToken = () => localStorage.getItem('token')
const authHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } })

export default {
  getNotifications() {
    return apiHelper.get('/api/notifications', authHeaders())
  },
  getUnreadCount() {
    return apiHelper.get('/api/notifications/unread-count', authHeaders())
  },
  markAsRead({ notificationId }) {
    return apiHelper.put(`/api/notifications/${notificationId}/read`, {}, authHeaders())
  },
  markAllAsRead() {
    return apiHelper.put('/api/notifications/read-all', {}, authHeaders())
  },
  deleteNotification({ notificationId }) {
    return apiHelper.delete(`/api/notifications/${notificationId}`, authHeaders())
  }
}
