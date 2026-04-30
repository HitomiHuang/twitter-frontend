<template>
  <div class="PrivateChatContainer">
    <Navbar id="Navbar" />
    <div class="privateChatMain">
      <!-- 頂部：對方資訊 -->
      <div class="chatHeader" v-if="partner">
        <button
          class="backBtn"
          @click="$router.push({ name: 'private-messages' })"
        >
          <img src="../assets/Vector.png" alt="返回" width="17" height="14" />
        </button>
        <img
          class="partnerHeaderAvatar"
          :src="partner.avatar || defaultAvatar"
          alt=""
        />
        <div class="partnerHeaderInfo">
          <span class="partnerHeaderName">{{ partner.name }}</span>
          <span class="partnerHeaderAccount">@{{ partner.account }}</span>
        </div>
      </div>

      <!-- 訊息列表 -->
      <div class="messageList" ref="messageList">
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="messageBubble"
          :class="
            msg.sender && msg.sender.id === currentUser.id
              ? 'selfMessage'
              : 'otherMessage'
          "
        >
          <!-- 他人訊息 -->
          <template v-if="msg.sender && msg.sender.id !== currentUser.id">
            <img
              class="messageAvatar"
              :src="msg.sender.avatar || defaultAvatar"
              alt=""
            />
            <div class="messageBody">
              <div class="bubbleContent otherBubble">{{ msg.content }}</div>
              <span class="messageTime">{{ formatTime(msg.createdAt) }}</span>
            </div>
          </template>
          <!-- 自己的訊息 -->
          <template v-else>
            <div class="bubbleContent selfBubble">{{ msg.content }}</div>
            <span class="messageTime selfTime">{{
              formatTime(msg.createdAt)
            }}</span>
          </template>
        </div>
      </div>

      <!-- 輸入區 -->
      <div class="inputArea">
        <input
          v-model="inputText"
          class="messageInput"
          placeholder="輸入訊息..."
          @keydown.enter.prevent="sendMessage"
        />
        <button
          class="sendBtn"
          @click="sendMessage"
          :disabled="!inputText.trim()"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 2L11 13"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M22 2L15 22L11 13L2 9L22 2Z"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import chatAPI from "../apis/chat";
import usersAPI from "../apis/users";
import chatSocketHandler from "../utility/chatSocketHandler";
import { mapState } from "vuex";

export default {
  components: { Navbar },
  data() {
    return {
      messages: [],
      partner: null,
      inputText: "",
      defaultAvatar: "https://i.imgur.com/q6bwDGO.png",
    };
  },
  computed: {
    ...mapState(["currentUser"]),
  },
  async mounted() {
    const partnerId = Number(this.$route.params.id);
    await Promise.all([
      this.loadMessages(partnerId),
      this.loadPartner(partnerId),
      this.markAsRead(partnerId),
    ]);
    // 清除全域未讀（進入對話後，此對話的未讀已被 markAsRead）
    // 重新從後端 fetch 最新總數（由 App.vue 全域處理就好，這裡不動 store）

    // 監聽即時私人訊息
    chatSocketHandler.onPrivateMessage((message) => {
      if (Number(message.senderId) === partnerId) {
        this.messages.push(message);
        this.$nextTick(this.scrollToBottom);
        // 立即標已讀（因為用戶正在看這個對話）
        chatAPI.markMessagesAsRead({ userId: partnerId }).catch(() => {});
      } else {
        // 別人傳來的，非當前對話，移給全域處理
        this.$store.commit("incrementUnreadPrivateCount");
      }
    });

    // 監聽自己發出的私訊確認
    chatSocketHandler.onPrivateMessageSent((message) => {
      // 避免重複：若 id 已存在就不加
      if (!this.messages.find((m) => m.id === message.id)) {
        this.messages.push(message);
        this.$nextTick(this.scrollToBottom);
      }
    });
  },
  beforeDestroy() {
    chatSocketHandler.off("newPrivateMessage");
    chatSocketHandler.off("privateMessageSent");
  },
  // 同一路由但 id 參數變換時（從一個私訊進到另一個）
  async beforeRouteUpdate(to, from, next) {
    chatSocketHandler.off("newPrivateMessage");
    chatSocketHandler.off("privateMessageSent");
    this.messages = [];
    this.partner = null;
    next();
    const partnerId = Number(to.params.id);
    await Promise.all([
      this.loadMessages(partnerId),
      this.loadPartner(partnerId),
      this.markAsRead(partnerId),
    ]);
    this.setupListeners(partnerId);
  },
  methods: {
    async loadMessages(partnerId) {
      try {
        const { data } = await chatAPI.getPrivateMessages({
          userId: partnerId,
        });
        this.messages = data;
        this.$nextTick(this.scrollToBottom);
      } catch (err) {
        console.error("無法載入私人訊息", err);
      }
    },
    async loadPartner(partnerId) {
      try {
        const { data } = await usersAPI.getUser({ id: partnerId });
        this.partner = data;
      } catch (err) {
        console.error("無法載入對話對象資料", err);
      }
    },
    async markAsRead(partnerId) {
      try {
        await chatAPI.markMessagesAsRead({ userId: partnerId });
        // 重新計算全域未讀（粗略方式：直接從後端 fetch）
        const { data } = await chatAPI.getUnreadPrivateCount();
        this.$store.commit("setUnreadPrivateCount", data.count);
      } catch (err) {
        /* 忽略 */
      }
    },
    setupListeners(partnerId) {
      chatSocketHandler.onPrivateMessage((message) => {
        if (Number(message.senderId) === partnerId) {
          this.messages.push(message);
          this.$nextTick(this.scrollToBottom);
          chatAPI.markMessagesAsRead({ userId: partnerId }).catch(() => {});
        } else {
          this.$store.commit("incrementUnreadPrivateCount");
        }
      });
      chatSocketHandler.onPrivateMessageSent((message) => {
        if (!this.messages.find((m) => m.id === message.id)) {
          this.messages.push(message);
          this.$nextTick(this.scrollToBottom);
        }
      });
    },
    sendMessage() {
      const content = this.inputText.trim();
      if (!content) return;
      const partnerId = Number(this.$route.params.id);
      chatSocketHandler.sendPrivateMessage(partnerId, content);
      this.inputText = "";
    },
    scrollToBottom() {
      const el = this.$refs.messageList;
      if (el) el.scrollTop = el.scrollHeight;
    },
    formatTime(ts) {
      if (!ts) return "";
      const d = new Date(ts);
      const h = d.getHours();
      const m = String(d.getMinutes()).padStart(2, "0");
      return `${h >= 12 ? "下午" : "上午"}${h > 12 ? h - 12 : h}:${m}`;
    },
  },
};
</script>

<style scoped>
.PrivateChatContainer {
  width: 100%;
  display: flex;
}

#Navbar {
  position: fixed;
  margin-left: 130px;
}

.privateChatMain {
  display: flex;
  flex-direction: column;
  margin-left: 332px;
  width: 640px;
  height: 100vh;
  border-left: 1px solid #e6ecf0;
  border-right: 1px solid #e6ecf0;
}

/* 頂部 */
.chatHeader {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-bottom: 1px solid #e6ecf0;
  flex-shrink: 0;
}

.backBtn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
}

.partnerHeaderAvatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
}

.partnerHeaderInfo {
  display: flex;
  flex-direction: column;
}

.partnerHeaderName {
  font-size: 15px;
  font-weight: 700;
  color: #0f1419;
}

.partnerHeaderAccount {
  font-size: 13px;
  color: #657786;
}

/* 訊息列表 */
.messageList {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.messageBubble {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-bottom: 8px;
}

.selfMessage {
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
}

.otherMessage {
  flex-direction: row;
  align-items: flex-end;
}

.messageAvatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  margin-bottom: 16px;
}

.messageBody {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.bubbleContent {
  padding: 8px 14px;
  border-radius: 18px;
  max-width: 320px;
  word-break: break-word;
  font-size: 14px;
  line-height: 1.5;
}

.selfBubble {
  background-color: #ff6600;
  color: #fff;
  border-bottom-right-radius: 4px;
}

.otherBubble {
  background-color: #f0f0f0;
  color: #0f1419;
  border-bottom-left-radius: 4px;
}

.messageTime {
  font-size: 11px;
  color: #aab8c2;
  margin-top: 3px;
}

.selfTime {
  text-align: right;
}

/* 輸入區 */
.inputArea {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid #e6ecf0;
  gap: 10px;
  flex-shrink: 0;
}

.messageInput {
  flex: 1;
  border: 1px solid #e6ecf0;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  outline: none;
  color: #0f1419;
}

.messageInput:focus {
  border-color: #ff6600;
}

.sendBtn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ff6600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sendBtn:disabled {
  background-color: #ffb380;
  cursor: not-allowed;
}

/* ── Tablet (≤ 1399px) ── */
@media (max-width: 1399px) {
  #Navbar {
    margin-left: 0;
  }
  .privateChatMain {
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
  .privateChatMain {
    margin-left: 0;
    width: 100%;
    padding-bottom: 70px;
  }
}
</style>
