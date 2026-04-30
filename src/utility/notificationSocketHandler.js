import socketService from "./socketService";
import notificationsAPI from "../apis/notifications";
import { Toast } from "./helpers";

class NotificationSocketHandler {
  constructor() {
    this.store = null;
  }

  /**
   * 初始化通知處理器
   * @param {Object} store - Vuex store 實例
   */
  init(store) {
    this.store = store;
  }

  /**
   * 連接 socket 並設定監聽器
   * @param {Number} userId - 使用者 ID
   */
  async connectAndSetup(userId) {
    if (!userId) {
      console.warn("⚠️ 無法連接 socket：缺少用戶 ID");
      return;
    }

    // 連接 socket
    socketService.connect(userId);

    // 設定通知監聽器
    this.setupNotificationListener();

    // 載入未讀數量
    await this.fetchUnreadCount();
  }

  /**
   * 斷開 socket 連接
   */
  disconnect() {
    socketService.disconnect();
  }

  /**
   * 設定通知監聽器
   */
  setupNotificationListener() {
    socketService.onNotification((notification) => {

      // 增加未讀通知數量
      if (this.store) {
        this.store.commit("incrementUnreadCount");
      }

      // 使用 Toast 元件顯示通知
      const notificationText = this.getNotificationText(notification.type);

      Toast.fire({
        icon: "info",
        title: `${notification.sender.name} ${notificationText}`,
        timerProgressBar: true,
      });
    });
  }

  /**
   * 取得未讀通知數量
   */
  async fetchUnreadCount() {
    try {
      const { data } = await notificationsAPI.getUnreadCount();

      if (this.store) {
        this.store.commit("setUnreadCount", data.count || 0);
      }
    } catch (error) {
      console.error("❌ 無法取得未讀通知數量:", error);
      console.error("📝 錯誤詳情:", error.response?.data || error.message);
    }
  }

  /**
   * 根據通知類型取得對應文字
   * @param {String} type - 通知類型
   * @returns {String} 通知文字
   */
  getNotificationText(type) {
    const typeMap = {
      new_tweet: "發布了新推文",
      new_follower: "開始追蹤你",
      new_reply: "回覆了你的推文",
      new_like: "喜歡你的推文",
    };
    return typeMap[type] || "";
  }
}

// 導出單例
export default new NotificationSocketHandler();
