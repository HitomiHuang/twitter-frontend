<template>
  <div class="Navbar" :class="{ 'modal-open': postTweetModalIsOpen }">
    <router-link to="/signin">
      <img
        class="navbarLogo"
        src="../assets/Icon.png"
        width="50px"
        height="50px"
        alt=""
      />
    </router-link>
    <div class="navLinkGroup navGroup--home">
      <img
        class="navLinkIcon"
        src="../assets/home-active.png"
        v-if="$route.path === '/main'"
        alt=""
      />
      <img class="navLinkIcon" src="../assets/home.png" v-else alt="" />
      <router-link class="navLinkText" to="/main"> 首頁 </router-link>
    </div>
    <div class="navLinkGroup navGroup--notifications">
      <div class="notificationIconWrapper">
        <svg
          class="navLinkIcon"
          v-if="$route.path === '/notifications'"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
            fill="#FF6600"
            stroke="#FF6600"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
            fill="#FF6600"
            stroke="#FF6600"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg
          class="navLinkIcon"
          v-else
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
            stroke="#44444F"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
            stroke="#44444F"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span v-if="unreadCount > 0" class="notificationBadge">{{
          unreadCount > 99 ? "99+" : unreadCount
        }}</span>
      </div>
      <router-link class="navLinkText" to="/notifications"> 通知 </router-link>
    </div>
    <!-- 公開聊天室 -->
    <div class="navLinkGroup navGroup--publicChat">
      <div class="notificationIconWrapper">
        <svg
          class="navLinkIcon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
            :stroke="
              $route.path.startsWith('/chat/public') ? '#FF6600' : '#44444F'
            "
            :fill="$route.path.startsWith('/chat/public') ? '#FF6600' : 'none'"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <router-link class="navLinkText" to="/chat/public">
        公開聊天室
      </router-link>
    </div>
    <!-- 私人訊息 -->
    <div class="navLinkGroup navGroup--privateChat">
      <div class="notificationIconWrapper">
        <svg
          class="navLinkIcon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
            :stroke="
              $route.path.startsWith('/chat/private') ? '#FF6600' : '#44444F'
            "
            :fill="$route.path.startsWith('/chat/private') ? '#FF6600' : 'none'"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <polyline
            points="22,6 12,13 2,6"
            :stroke="
              $route.path.startsWith('/chat/private') ? 'white' : '#44444F'
            "
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span v-if="unreadPrivateCount > 0" class="notificationBadge">{{
          unreadPrivateCount > 99 ? "99+" : unreadPrivateCount
        }}</span>
      </div>
      <router-link class="navLinkText" to="/chat/private">
        私人訊息
      </router-link>
    </div>
    <div class="navLinkGroup navGroup--profile">
      <img
        class="navLinkIcon"
        src="../assets/selfInfo-active.png"
        v-if="
          ($route.path === '/user/self/tweets') |
            ($route.path === '/user/self/comments') |
            ($route.path === '/user/self/likes')
        "
        alt=""
      />
      <img class="navLinkIcon" src="../assets/selfInfo.png" v-else alt="" />
      <router-link
        class="navLinkText"
        :class="{
          active:
            $route.path === '/user/self/comments' ||
            $route.path === '/user/self/likes',
        }"
        to="/user/self/tweets"
      >
        個人資料
      </router-link>
    </div>
    <div class="navLinkGroup navGroup--settings">
      <img
        class="navLinkIcon"
        src="../assets/setting-active.png"
        v-if="$route.path === '/setting'"
        alt=""
      />
      <img class="navLinkIcon" src="../assets/setting.png" v-else alt="" />
      <router-link class="navLinkText" to="/setting"> 設定 </router-link>
    </div>
    <button
      class="openPostTweetModalBtn"
      @click.stop.prevent="openPostTweetModal"
    >
      推文
    </button>
    <!-- 推文modal -->
    <div
      id="postTweetModal"
      v-show="postTweetModalIsOpen"
      @click.self="closePostTweetModal"
    >
      <div id="postTweetModalWrapper">
        <button
          class="closePostTweetModalBtn"
          @click.stop.prevent="closePostTweetModal"
        >
          ✖
        </button>
        <div class="postTweetModalContent">
          <img
            :src="currentUser.avatar | emptyImage"
            class="postTweetModalUserImg"
            alt=""
          />
          <textarea
            v-model="tweetText"
            class="postTweetModalText"
            placeholder="有什麼新鮮事?"
          >
          </textarea>
          <p
            class="postTweetModalErrorMessage"
            v-if="postTweetModalErrorMessage && !tweetText"
          >
            {{ postTweetModalErrorMessage }}
          </p>
          <p class="postTweetModalErrorMessage" v-if="tweetText.length > 140">
            字數不可超過140字
          </p>
          <button
            @click.stop.prevent="postTweetModalSubmit"
            :disabled="isProcessing"
            class="postTweetModalSubmitBtn"
          >
            推文
          </button>
        </div>
      </div>
    </div>
    <div
      class="navLinkGroup navLogoutLinkGroup navGroup--logout"
      @click.stop.prevent="logout"
    >
      <img class="navLinkIcon" src="../assets/logout.png" alt="" />
      <button class="navLogoutBtn">登出</button>
    </div>

    <!-- Mobile-only: 漢堡排按鈕 -->
    <div
      class="navLinkGroup mobileHamburgerGroup"
      @click.stop.prevent="toggleHamburger"
    >
      <svg
        class="navLinkIcon"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="3"
          y1="6"
          x2="21"
          y2="6"
          stroke="#44444F"
          stroke-width="2"
          stroke-linecap="round"
        />
        <line
          x1="3"
          y1="12"
          x2="21"
          y2="12"
          stroke="#44444F"
          stroke-width="2"
          stroke-linecap="round"
        />
        <line
          x1="3"
          y1="18"
          x2="21"
          y2="18"
          stroke="#44444F"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
      <!-- 漢堡下拉 panel -->
      <div class="hamburgerPanel" :class="{ open: hamburgerOpen }" @click.stop>
        <router-link
          to="/chat/public"
          class="hamburgerItem"
          @click.native="closeHamburger"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
              stroke="#44444F"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          公開聊天室
        </router-link>
        <router-link
          to="/chat/private"
          class="hamburgerItem"
          @click.native="closeHamburger"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
              stroke="#44444F"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <polyline
              points="22,6 12,13 2,6"
              stroke="#44444F"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          私人信息
        </router-link>
        <router-link
          to="/setting"
          class="hamburgerItem"
          @click.native="closeHamburger"
        >
          <img src="../assets/setting.png" width="20" height="20" alt="" />
          設定
        </router-link>
        <button
          class="hamburgerItem hamburgerLogoutBtn"
          @click.stop.prevent="logoutFromHamburger"
        >
          <img src="../assets/logout.png" width="20" height="20" alt="" />
          登出
        </button>
      </div>
    </div>

    <!-- Mobile-only: 通知鈴鐺（fixed 頂部右側） -->
    <div class="mobileNotiBell" @click.stop.prevent="toggleNotificationPanel">
      <div class="notificationIconWrapper">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
            :stroke="unreadCount > 0 ? '#FF6600' : '#44444F'"
            :fill="unreadCount > 0 ? '#FF6600' : 'none'"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
            :stroke="unreadCount > 0 ? '#FF6600' : '#44444F'"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span v-if="unreadCount > 0" class="notificationBadge">{{
          unreadCount > 99 ? "99+" : unreadCount
        }}</span>
      </div>
    </div>

    <!-- Mobile 通知 panel（從右側滑入） -->
    <div
      class="mobileNotiPanel"
      :class="{ open: notificationPanelOpen }"
      @click.stop
    >
      <div class="mobileNotiPanelHeader">
        <span>通知</span>
        <button
          class="mobileNotiCloseBtn"
          @click.stop.prevent="notificationPanelOpen = false"
        >
          ✕
        </button>
      </div>
      <div class="mobileNotiList">
        <div
          v-if="!isFetchingPanel && panelNotifications.length === 0"
          class="mobileNotiEmpty"
        >
          目前沒有通知
        </div>
        <div
          v-for="notification in panelNotifications"
          :key="notification.id"
          class="mobileNotiItem"
          :class="{ unread: !notification.isRead }"
          @click="handlePanelNotificationClick(notification)"
        >
          <img
            class="mobileNotiAvatar"
            :src="notification.sender.avatar || require('@/assets/Icon.png')"
            alt=""
          />
          <div class="mobileNotiContent">
            <div class="mobileNotiText">
              <span class="senderName">{{ notification.sender.name }}</span>
              <span>{{ getNotificationText(notification.type) }}</span>
            </div>
            <p class="mobileNotiTime">{{ notification.createdAt | fromNow }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile 遮罩 -->
    <div
      class="mobileOverlay"
      v-if="hamburgerOpen || notificationPanelOpen"
      @click="closeAllPanels"
    ></div>
  </div>
</template>

<script>
import { Toast } from "../utility/helpers";
import tweetsAPI from "../apis/tweets";
import notificationsAPI from "../apis/notifications";
import { mapState } from "vuex";
import {
  emptyImageFilter,
  fromNowFilter,
  notificationTextMixin,
} from "../utility/mixins";

export default {
  mixins: [emptyImageFilter, fromNowFilter, notificationTextMixin],
  data() {
    return {
      postTweetModalIsOpen: false,
      tweetText: "",
      postTweetModalErrorMessage: "",
      isProcessing: false,
      hamburgerOpen: false,
      notificationPanelOpen: false,
      panelNotifications: [],
      isFetchingPanel: false,
    };
  },
  computed: {
    ...mapState([
      "currentUser",
      "unreadNotificationCount",
      "unreadPrivateMessageCount",
    ]),
    unreadCount() {
      console.log("🔔 Navbar - 未讀通知數:", this.unreadNotificationCount);
      return this.unreadNotificationCount;
    },
    unreadPrivateCount() {
      return this.unreadPrivateMessageCount;
    },
  },
  watch: {
    unreadNotificationCount(newVal, oldVal) {
      console.log("📢 Navbar - 未讀數量變化:", oldVal, "->", newVal);
    },
  },
  methods: {
    openPostTweetModal() {
      this.tweetText = "";
      this.postTweetModalErrorMessage = "";
      this.postTweetModalIsOpen = true;
    },
    closePostTweetModal() {
      this.tweetText = "";
      this.postTweetModalErrorMessage = "";
      this.postTweetModalIsOpen = false;
    },
    async postTweetModalSubmit() {
      try {
        if (!this.tweetText.trim()) {
          this.postTweetModalErrorMessage = "內容不可留白";
          this.tweetText = "";
          return;
        } else if (this.tweetText.length > 140) {
          return;
        }

        this.isProcessing = true;

        await tweetsAPI.postTweet({ description: this.tweetText });

        this.tweetText = "";
        this.postTweetModalIsOpen = false;

        Toast.fire({
          icon: "success",
          title: "推文成功",
        });
        this.isProcessing = false;
        this.$router.go(0);
      } catch (error) {
        this.isProcessing = false;
        Toast.fire({
          icon: "error",
          title: "推文失敗",
        });
      }
    },
    logout() {
      this.$store.commit("revokeAuthentication");
    },
    toggleHamburger() {
      this.hamburgerOpen = !this.hamburgerOpen;
      if (this.hamburgerOpen) this.notificationPanelOpen = false;
    },
    closeHamburger() {
      this.hamburgerOpen = false;
    },
    async toggleNotificationPanel() {
      if (this.notificationPanelOpen) {
        this.notificationPanelOpen = false;
        return;
      }
      this.notificationPanelOpen = true;
      this.hamburgerOpen = false;
      if (this.panelNotifications.length === 0) {
        await this.fetchPanelNotifications();
      }
      this.$store.commit("clearUnreadCount");
    },
    async fetchPanelNotifications() {
      this.isFetchingPanel = true;
      try {
        const { data } = await notificationsAPI.getNotifications();
        this.panelNotifications = data;
      } catch (error) {
        Toast.fire({ icon: "error", title: "無法取得通知" });
      } finally {
        this.isFetchingPanel = false;
      }
    },
    handlePanelNotificationClick(notification) {
      this.notificationPanelOpen = false;
      if (!notification.isRead) {
        notificationsAPI.markAsRead({ notificationId: notification.id });
        notification.isRead = true;
      }
      if (notification.type === "new_tweet" && notification.tweetId) {
        this.$router.push(`/tweets/${notification.tweetId}`);
      } else if (notification.type === "new_follower") {
        this.$router.push(`/user/${notification.senderId}/tweets`);
      } else if (notification.type === "new_reply" && notification.tweetId) {
        this.$router.push(`/tweets/${notification.tweetId}`);
      } else if (notification.type === "new_like" && notification.tweetId) {
        this.$router.push(`/tweets/${notification.tweetId}`);
      }
    },
    closeAllPanels() {
      this.hamburgerOpen = false;
      this.notificationPanelOpen = false;
    },
    logoutFromHamburger() {
      this.hamburgerOpen = false;
      this.$store.commit("revokeAuthentication");
    },
  },
};
</script>

<style scoped>
.Navbar {
  background-color: #fff;
  width: 178px;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.Navbar.modal-open {
  z-index: 10000;
}

.navbarLogo {
  margin-top: 13px;
  margin-left: 13px;
  margin-bottom: 13px;
  width: 40px;
  height: 40px;
}

.navLinkGroup {
  width: 100%;
  height: 58px;
  padding-left: 18px;
  display: flex;
  align-items: center;
}

.navLinkIcon {
  margin-right: 17px;
}

.notificationIconWrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.notificationBadge {
  position: absolute;
  top: -5px;
  right: 10px;
  background-color: #ff6600;
  color: white;
  font-size: 11px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.navLinkText {
  font-size: 18px;
  font-weight: 700;
  text-decoration: none;
  color: #44444f;
}

.navLinkText.active {
  color: #ff6600;
}

.openPostTweetModalBtn {
  margin-top: 8px;
  width: 100%;
  height: 46px;
  border: 0;
  border-radius: 50px;
  background-color: #ff6600;
  font-size: 20px;
  font-weight: 400;
  color: #fff;
}

.openPostTweetModalBtn:hover {
  cursor: pointer;
}

#postTweetModal {
  position: fixed;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
}

#postTweetModalWrapper {
  width: 643px;
  height: 300px;
  background-color: #fff;
  margin-top: 54px;
  border-radius: 14px;
}

.closePostTweetModalBtn {
  height: 24px;
  width: 24px;
  margin-top: 15px;
  margin-left: 15px;
  margin-bottom: 15px;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ff6600;
  border: 0;
  background-color: #fff;
}

.closePostTweetModalBtn:hover {
  cursor: pointer;
}

.postTweetModalContent {
  border-top: 1px solid #e6ecf0;
  height: 245px;
  padding: 15px;
  display: flex;
  position: relative;
}

.postTweetModalUserImg {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 8px;
  background-color: #fff;
}

.postTweetModalText {
  margin-top: 10px;
  width: 528px;
  height: 160px;
  resize: none;
  font-size: 16px;
  font-weight: 400;
  border: 0;
}

.postTweetModalText::placeholder {
  color: #6c757d;
}

.postTweetModalText:focus {
  outline: none;
}

.postTweetModalSubmitBtn {
  position: absolute;
  right: 16px;
  bottom: 16px;
  width: 64px;
  height: 40px;
  border-radius: 50px;
  border: 0;
  background-color: #ff6600;
  color: #fff;
  font-size: 16px;
  font-weight: 400;
}

.postTweetModalSubmitBtn:hover {
  cursor: pointer;
}

.postTweetModalSubmitBtn:disabled:hover {
  cursor: wait;
}

.postTweetModalErrorMessage {
  position: absolute;
  bottom: 28px;
  right: 101px;
  font-size: 15px;
  font-weight: 500;
  color: #fc5a5a;
}

.navLogoutBtn {
  font-size: 18px;
  font-weight: 700;
  border: 0;
  background-color: #fff;
  color: #44444f;
}

.navLogoutBtn:hover {
  cursor: pointer;
}

.navLogoutLinkGroup {
  position: absolute;
  bottom: 0px;
}

/* Mobile-only elements: hidden by default (desktop/tablet) */
.mobileHamburgerGroup,
.mobileNotiBell,
.mobileNotiPanel,
.mobileOverlay {
  display: none;
}

/* ── Tablet (≤ 1399px): icon-only sidebar ── */
@media (max-width: 1399px) {
  .Navbar {
    width: 68px;
  }
  .navLinkGroup {
    position: relative;
    padding-left: 0;
    justify-content: center;
  }
  .navLinkText {
    position: absolute;
    inset: 0;
    font-size: 0;
  }
  .navLinkIcon {
    margin-right: 0;
  }
  .notificationIconWrapper {
    margin: 0 auto;
  }
  /* 平板隱藏撰寫貼文按鈕與側欄通知項目 */
  .openPostTweetModalBtn {
    display: none;
  }
  .navGroup--notifications {
    display: none;
  }
  .navLogoutBtn {
    display: none;
  }
  .navLogoutLinkGroup {
    position: absolute;
    bottom: 0;
    width: 100%;
    justify-content: center;
    padding-left: 0;
    cursor: pointer;
  }
  /* 通知鈴鐺：固定在 header 右側，高度對齊 header (74px) 垂直置中
     right 偏移量由各頁面透過 --bell-right-offset 傳入；預設 0px（全寬佈局頁面） */
  .mobileNotiBell {
    position: fixed;
    top: 0;
    right: var(--bell-right-offset, 0px);
    height: 74px;
    padding-right: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    cursor: pointer;
  }
  /* 通知側滑面板 */
  .mobileNotiPanel {
    position: fixed;
    top: 0;
    right: -320px;
    width: 320px;
    height: 100vh;
    background: #fff;
    z-index: 299;
    transition: right 0.3s ease;
    display: flex;
    flex-direction: column;
    box-shadow: -4px 0 16px rgba(0, 0, 0, 0.12);
  }
  .mobileNotiPanel.open {
    right: 0;
  }
  .mobileNotiPanelHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    height: 56px;
    border-bottom: 1px solid #e6ecf0;
    font-size: 18px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .mobileNotiCloseBtn {
    border: none;
    background: transparent;
    font-size: 18px;
    cursor: pointer;
    color: #44444f;
    line-height: 1;
  }
  .mobileNotiList {
    flex: 1;
    overflow-y: auto;
    padding-bottom: 70px;
  }
  .mobileNotiEmpty {
    padding: 24px;
    text-align: center;
    color: #888;
  }
  .mobileNotiItem {
    display: flex;
    align-items: flex-start;
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
  }
  .mobileNotiItem.unread {
    background-color: #fff8f0;
  }
  .mobileNotiAvatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 10px;
    flex-shrink: 0;
  }
  .mobileNotiContent {
    flex: 1;
  }
  .mobileNotiText {
    font-size: 14px;
    line-height: 1.4;
  }
  .mobileNotiText .senderName {
    font-weight: 700;
    margin-right: 4px;
  }
  .mobileNotiTime {
    font-size: 12px;
    color: #888;
    margin-top: 4px;
  }
  /* 遮罩 */
  .mobileOverlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 298;
  }
}

/* ── Mobile (≤ 767px): fixed bottom horizontal bar ── */
@media (max-width: 767px) {
  .Navbar {
    width: 100%;
    height: 58px;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid #e6ecf0;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
    overflow: visible;
  }
  .navbarLogo {
    display: none;
  }
  .navLinkGroup {
    position: relative;
    height: 100%;
    padding: 0 6px;
    width: auto;
    min-width: 36px;
    justify-content: center;
    align-items: center;
  }
  .navLinkText {
    position: absolute;
    inset: 0;
    font-size: 0;
  }
  .navLinkIcon {
    margin-right: 0;
    width: 24px;
    height: 24px;
  }
  .notificationIconWrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .openPostTweetModalBtn {
    width: 44px;
    height: 44px;
    font-size: 0;
    border-radius: 50%;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .openPostTweetModalBtn::after {
    content: "✎";
    font-size: 20px;
    color: white;
  }
  .navLogoutLinkGroup {
    position: static;
    justify-content: center;
    padding-left: 0;
  }
  .navLogoutBtn {
    display: none;
  }

  /* Hide mobile-unused nav groups */
  .navGroup--notifications,
  .navGroup--publicChat,
  .navGroup--privateChat,
  .navGroup--settings,
  .navGroup--logout {
    display: none;
  }

  /* Reorder bottom nav items */
  .navGroup--home {
    order: 1;
  }
  .openPostTweetModalBtn {
    order: 2;
  }
  .navGroup--profile {
    order: 3;
  }
  .mobileHamburgerGroup {
    order: 4;
  }

  /* Mobile hamburger group */
  .mobileHamburgerGroup {
    display: flex;
    position: relative;
    height: 100%;
    padding: 0 6px;
    width: auto;
    min-width: 36px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  /* Hamburger dropdown panel (expands upward from bottom-right) */
  .hamburgerPanel {
    display: none;
    position: absolute;
    bottom: calc(100% + 4px);
    right: 0;
    background: #fff;
    border: 1px solid #e6ecf0;
    border-radius: 8px;
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.12);
    flex-direction: column;
    z-index: 300;
    overflow: hidden;
  }
  .hamburgerPanel.open {
    display: flex;
  }
  .hamburgerItem {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 16px;
    height: 52px;
    text-decoration: none;
    color: #44444f;
    font-size: 15px;
    font-weight: 600;
    border: none;
    background: transparent;
    width: 100%;
    text-align: left;
    cursor: pointer;
    white-space: nowrap;
  }
  .hamburgerItem:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
  .hamburgerLogoutBtn {
    color: #44444f;
  }

  /* Mobile notification bell (fixed top-right, vertically centered in header) */
  .mobileNotiBell {
    position: fixed;
    top: 0;
    right: 16px;
    height: 74px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    cursor: pointer;
  }

  /* Mobile notification panel (slides in from right) */
  .mobileNotiPanel {
    position: fixed;
    top: 0;
    right: -320px;
    width: 320px;
    height: 100vh;
    background: #fff;
    z-index: 299;
    transition: right 0.3s ease;
    display: flex;
    flex-direction: column;
    box-shadow: -4px 0 16px rgba(0, 0, 0, 0.12);
  }
  .mobileNotiPanel.open {
    right: 0;
  }
  .mobileNotiPanelHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    height: 56px;
    border-bottom: 1px solid #e6ecf0;
    font-size: 18px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .mobileNotiCloseBtn {
    border: none;
    background: transparent;
    font-size: 18px;
    cursor: pointer;
    color: #44444f;
    line-height: 1;
  }
  .mobileNotiList {
    flex: 1;
    overflow-y: auto;
    padding-bottom: 70px;
  }
  .mobileNotiEmpty {
    padding: 24px;
    text-align: center;
    color: #888;
  }
  .mobileNotiItem {
    display: flex;
    align-items: flex-start;
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
  }
  .mobileNotiItem.unread {
    background-color: #fff8f0;
  }
  .mobileNotiAvatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 10px;
    flex-shrink: 0;
  }
  .mobileNotiContent {
    flex: 1;
  }
  .mobileNotiText {
    font-size: 14px;
    line-height: 1.4;
  }
  .mobileNotiText .senderName {
    font-weight: 700;
    margin-right: 4px;
  }
  .mobileNotiTime {
    font-size: 12px;
    color: #888;
    margin-top: 4px;
  }

  /* Mobile overlay */
  .mobileOverlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 298;
  }
  /* PostTweet Modal: bottom sheet on mobile */
  #postTweetModal {
    align-items: flex-end;
  }
  #postTweetModalWrapper {
    width: 100%;
    height: auto;
    max-height: 85vh;
    border-radius: 14px 14px 0 0;
    margin-top: 0;
  }
  .postTweetModalText {
    width: 100%;
  }
}
</style>