import socketService from './socketService'

class ChatSocketHandler {
  constructor() {
    this._boundEvents = new Set()
  }

  // 進入公開聊天室
  joinPublicChat(userData) {
    if (socketService.socket) {
      socketService.socket.emit('joinPublicChat', userData)
    }
  }

  // 離開公開聊天室
  leavePublicChat() {
    if (socketService.socket) {
      socketService.socket.emit('leavePublicChat')
    }
  }

  // 發送公開訊息
  sendPublicMessage(content) {
    if (socketService.socket) {
      socketService.socket.emit('publicMessage', content)
    }
  }

  // 發送私人訊息
  sendPrivateMessage(receiverId, content) {
    if (socketService.socket) {
      socketService.socket.emit('privateMessage', { receiverId, content })
    }
  }

  // 監聽公開訊息（廣播）
  onPublicMessage(callback) {
    this._on('publicMessage', callback)
  }

  // 監聽私人訊息（對方主動推來的）
  onPrivateMessage(callback) {
    this._on('newPrivateMessage', callback)
  }

  // 監聽自己發送的私人訊息確認回傳
  onPrivateMessageSent(callback) {
    this._on('privateMessageSent', callback)
  }

  // 監聽已讀回執（對方讀了我的訊息）
  onMessagesRead(callback) {
    this._on('messagesRead', callback)
  }

  // 監聽上線用戶列表更新
  onOnlineUsersUpdate(callback) {
    this._on('onlineUsersUpdate', callback)
  }

  // 監聽系統訊息（上線/離線）
  onSystemMessage(callback) {
    this._on('systemMessage', callback)
  }

  // 監聽訊息回收事件
  onMessageRecalled(callback) {
    this._on('messageRecalled', callback)
  }

  // 移除特定事件監聽
  off(event) {
    if (socketService.socket) {
      socketService.socket.off(event)
      this._boundEvents.delete(event)
    }
  }

  // 移除所有聊天室相關事件監聽
  offAll() {
    const chatEvents = [
      'publicMessage', 'newPrivateMessage', 'privateMessageSent',
      'messagesRead', 'onlineUsersUpdate', 'systemMessage', 'messageRecalled'
    ]
    chatEvents.forEach(event => this.off(event))
  }

  // 內部：確保不重複綁定同一事件
  _on(event, callback) {
    if (!socketService.socket) return
    if (this._boundEvents.has(event)) {
      socketService.socket.off(event)
    }
    socketService.socket.on(event, callback)
    this._boundEvents.add(event)
  }
}

export default new ChatSocketHandler()
