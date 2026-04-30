<template>
  <div class="Notifications">
    <Navbar id="Navbar" />
    <div class="notificationsSection">
      <div class="notificationsSectionContent">
        <div class="mainTitle">
          <h1>通知</h1>
        </div>
        <div class="notificationsList">
          <div v-if="notifications.length === 0" class="emptyState">
            <p>目前沒有通知</p>
          </div>
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="notificationItem"
            :class="{ unread: !notification.isRead }"
            @click="handleNotificationClick(notification)"
          >
            <img
              class="notificationAvatar"
              :src="notification.sender.avatar || require('@/assets/Icon.png')"
              alt=""
            />
            <div class="notificationContent">
              <div class="notificationText">
                <span class="senderName">{{ notification.sender.name }}</span>
                <span class="actionText">{{
                  getNotificationText(notification.type)
                }}</span>
              </div>
              <p class="notificationTime">
                {{ notification.createdAt | fromNow }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import notificationsAPI from "../apis/notifications";
import { Toast } from "../utility/helpers";
import { mapState } from "vuex";
import { fromNowFilter, notificationTextMixin } from "../utility/mixins";

export default {
  components: {
    Navbar,
  },
  mixins: [fromNowFilter, notificationTextMixin],
  data() {
    return {
      notifications: [],
    };
  },
  computed: {
    ...mapState(["currentUser"]),
  },
  methods: {
    async fetchNotifications() {
      try {
        const { data } = await notificationsAPI.getNotifications();
        this.notifications = data;
      } catch (error) {
        console.error(error);
        Toast.fire({
          icon: "error",
          title: "無法取得通知",
        });
      }
    },
    async handleNotificationClick(notification) {
      try {
        // 標記為已讀
        if (!notification.isRead) {
          await notificationsAPI.markAsRead({
            notificationId: notification.id,
          });
          notification.isRead = true;
        }

        // 根據通知類型導航到相關頁面
        if (notification.type === "new_tweet" && notification.tweetId) {
          this.$router.push(`/tweets/${notification.tweetId}`);
        } else if (notification.type === "new_follower") {
          this.$router.push(`/user/${notification.senderId}/tweets`);
        } else if (notification.type === "new_reply" && notification.tweetId) {
          this.$router.push(`/tweets/${notification.tweetId}`);
        } else if (notification.type === "new_like" && notification.tweetId) {
          this.$router.push(`/tweets/${notification.tweetId}`);
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
  created() {
    this.fetchNotifications();
    // 進入通知頁面時清除未讀計數
    this.$store.commit("clearUnreadCount");
  },
};
</script>

<style scoped>
.Notifications {
  width: 100%;
  display: grid;
}

#Navbar {
  justify-self: start;
  position: fixed;
  margin-left: 130px;
}

#PopularUsers {
  position: fixed;
  justify-self: end;
  margin-right: 130px;
  margin-top: 16px;
}

.notificationsSection {
  width: 634px;
  margin-left: 378px;
  border: 1px solid #e6ecf0;
}

.notificationsSectionContent {
  min-height: 100vh;
}

.mainTitle {
  height: 75px;
  border-bottom: 1px solid #e6ecf0;
  display: flex;
  align-items: center;
  padding-left: 24px;
}

.mainTitle h1 {
  font-size: 18px;
  font-weight: 700;
  color: #1c1c1c;
}

.notificationsList {
  width: 100%;
}

.emptyState {
  padding: 40px 24px;
  text-align: center;
  color: #6c757d;
}

.notificationItem {
  display: flex;
  padding: 16px 24px;
  border-bottom: 1px solid #e6ecf0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notificationItem:hover {
  background-color: #f5f8fa;
}

.notificationItem.unread {
  background-color: #fff5f0;
}

.notificationAvatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 16px;
}

.notificationContent {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.notificationText {
  font-size: 16px;
  line-height: 26px;
  color: #171725;
}

.senderName {
  font-weight: 700;
  margin-right: 4px;
}

.actionText {
  font-weight: 400;
}

.notificationTime {
  font-size: 14px;
  color: #6c757d;
  margin-top: 4px;
}

/* ── Tablet (≤ 1399px) ── */
@media (max-width: 1399px) {
  #Navbar {
    margin-left: 0;
  }
  #PopularUsers {
    display: none;
  }
  .notificationsSection {
    margin-left: 68px;
    width: calc(100% - 68px);
    max-width: 900px;
  }
}

/* ── Mobile (≤ 767px) ── */
@media (max-width: 767px) {
  #Navbar {
    margin-left: 0;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
  }
  #PopularUsers {
    display: none;
  }
  .notificationsSection {
    margin-left: 0;
    width: 100%;
    padding-bottom: 70px;
  }
}
</style>
