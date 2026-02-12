<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import notificationSocketHandler from "./utility/notificationSocketHandler";
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
      } else {
        // 用戶登出後斷開 socket
        notificationSocketHandler.disconnect();
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
    }
  },
  beforeDestroy() {
    // 組件銷毀前斷開 socket 連接
    notificationSocketHandler.disconnect();
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
  width: 1400px;
  margin: 0 auto;
}
</style>