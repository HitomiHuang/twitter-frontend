<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import notificationSocketHandler from "./utility/notificationSocketHandler";
import chatAPI from "./apis/chat";
import socketService from "./utility/socketService";
import { mapState } from "vuex";

export default {
  name: "App",
  computed: {
    ...mapState(["currentUser", "isAuthenticated"]),
  },
  watch: {
    isAuthenticated(newValue) {
      console.log("👤 登入狀態變更:", newValue, "用戶ID:", this.currentUser.id);
      if (newValue && this.currentUser.id) {
        // 用戶登入後連接 socket 並載入未讀數量
        notificationSocketHandler.connectAndSetup(this.currentUser.id);
        // 載入私人訊息未讀數
        this._fetchUnreadPrivateCount();
        // 全域監聽私人訊息（當不在對話頁時累計未讀）
        this._bindGlobalPrivateMessageListener();
      } else {
        // 用戶登出後斷開 socket
        notificationSocketHandler.disconnect();
        if (socketService.socket) {
          socketService.socket.off(
            "newPrivateMessage",
            this._onGlobalPrivateMessage
          );
        }
      }
    },
  },
  mounted() {
    console.log(
      "🚀 App mounted - 登入狀態:",
      this.isAuthenticated,
      "用戶:",
      this.currentUser
    );

    // 初始化通知處理器
    notificationSocketHandler.init(this.$store);

    // 如果用戶已經登入，立即連接 socket 並載入未讀數量
    if (this.isAuthenticated && this.currentUser.id) {
      notificationSocketHandler.connectAndSetup(this.currentUser.id);
      this._fetchUnreadPrivateCount();
      this._bindGlobalPrivateMessageListener();
    }
  },
  methods: {
    async _fetchUnreadPrivateCount() {
      try {
        const { data } = await chatAPI.getUnreadPrivateCount();
        this.$store.commit("setUnreadPrivateCount", data.count || 0);
      } catch (e) {
        // silent
      }
    },
    _bindGlobalPrivateMessageListener() {
      // 先移除舊的，避免重複綁定
      if (socketService.socket) {
        socketService.socket.off(
          "newPrivateMessage",
          this._onGlobalPrivateMessage
        );
        socketService.socket.on(
          "newPrivateMessage",
          this._onGlobalPrivateMessage
        );
      }
    },
    _onGlobalPrivateMessage(message) {
      const route = this.$route;
      // 若目前不在該私人聊天頁，累計未讀
      if (
        route.name !== "private-chat" ||
        Number(route.params.id) !== Number(message.senderId)
      ) {
        this.$store.commit("incrementUnreadPrivateCount");
      }
    },
  },
  beforeDestroy() {
    // 組件銷毀前斷開 socket 連接
    notificationSocketHandler.disconnect();
    if (socketService.socket) {
      socketService.socket.off(
        "newPrivateMessage",
        this._onGlobalPrivateMessage
      );
    }
  },
};
</script>

<style>
/* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100;300;400;500;700;900&display=swap");

html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block;
}
body {
  line-height: 1;
}
ol,
ul {
  list-style: none;
}
blockquote,
q {
  quotes: none;
}
blockquote:before,
blockquote:after,
q:before,
q:after {
  content: "";
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
* {
  box-sizing: border-box;
}
html,
* {
  font-family: "Noto Sans TC", sans-serif;
}

#app {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}
</style>