import { io } from 'socket.io-client'

const SOCKET_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000'

class SocketService {
  constructor() {
    this.socket = null
    this.isConnected = false
  }

  connect(userId) {
    if (this.socket && this.isConnected) {
      console.log('Socket already connected')
      return
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    })

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id)
      this.isConnected = true

      // 註冊用戶
      if (userId) {
        this.socket.emit('register', userId)
      }
    })

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected')
      this.isConnected = false
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  onNotification(callback) {
    if (this.socket) {
      this.socket.on('new_notification', callback)
    }
  }

  offNotification() {
    if (this.socket) {
      this.socket.off('new_notification')
    }
  }
}

export default new SocketService()
