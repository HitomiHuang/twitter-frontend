import { apiHelper } from './../utility/helpers'
const getToken = () => localStorage.getItem('token')

export default {
  getNotifications() {
    return apiHelper.get('/api/notifications', {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  getUnreadCount() {
    return apiHelper.get('/api/notifications/unread-count', {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  markAsRead({ notificationId }) {
    return apiHelper.put(`/api/notifications/${notificationId}/read`, {}, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  markAllAsRead() {
    return apiHelper.put('/api/notifications/read-all', {}, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  deleteNotification({ notificationId }) {
    return apiHelper.delete(`/api/notifications/${notificationId}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  }
}
