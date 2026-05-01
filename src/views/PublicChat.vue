<template>
  <div class="PublicChatContainer">
    <Navbar id="Navbar" />
    <div class="publicChatMain">
      <!-- 左側：上線使用者 -->
      <div class="onlinePanel">
        <h3 class="onlinePanelTitle">上線使用者 ({{ onlineUsers.length }})</h3>
        <div class="onlineUserList">
          <div
            v-for="user in onlineUsers"
            :key="user.id"
            class="onlineUserItem"
          >
            <img
              class="onlineUserAvatar"
              :src="user.avatar || defaultAvatar"
              alt=""
            />
            <div class="onlineUserInfo">
              <span class="onlineUserName">{{ user.name }}</span>
              <span class="onlineUserAccount">@{{ user.account }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右側：聊天區 -->
      <div class="chatPanel">
        <h3 class="chatPanelTitle">公開聊天室</h3>
        <div class="messageList" ref="messageList">
          <!-- 系統訊息（上線/離線） -->
          <template v-for="(item, idx) in displayMessages">
            <div v-if="item.isSystem" :key="'sys-' + idx" class="systemMessage">
              {{ item.text }}
            </div>
            <!-- 自己的訊息（靠右） -->
            <div
              v-else-if="item.sender && item.sender.id === currentUser.id"
              :key="'msg-' + item.id"
              class="messageBubble selfMessage"
            >
              <div class="bubbleContent selfBubble">{{ item.content }}</div>
              <span class="messageTime">{{ formatTime(item.createdAt) }}</span>
            </div>
            <!-- 他人的訊息（靠左） -->
            <div
              v-else
              :key="'msg-other-' + item.id"
              class="messageBubble otherMessage"
            >
              <img
                class="messageAvatar"
                :src="
                  item.sender && item.sender.avatar
                    ? item.sender.avatar
                    : defaultAvatar
                "
                alt=""
              />
              <div class="messageBody">
                <span class="senderName">{{
                  item.sender && item.sender.name
                }}</span>
                <div class="bubbleContent otherBubble">{{ item.content }}</div>
                <span class="messageTime">{{
                  formatTime(item.createdAt)
                }}</span>
              </div>
            </div>
          </template>
        </div>

        <!-- 輸入區 -->
        <div class="inputArea">
          <input
            v-model="inputText"
            class="messageInput"
            placeholder="輸入訊息..."
            @keydown.enter.prevent="sendMessage"
            :disabled="isSending"
          />
          <button
            class="sendBtn"
            @click="sendMessage"
            :disabled="!inputText.trim() || isSending"
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
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import chatAPI from "../apis/chat";
import chatSocketHandler from "../utility/chatSocketHandler";
import { mapState } from "vuex";
import { chatTimeMixin } from "../utility/mixins";
import { DEFAULT_AVATAR } from "../utility/helpers";

export default {
  components: { Navbar },
  mixins: [chatTimeMixin],
  data() {
    return {
      messages: [], // DB 歷史訊息 + socket 新訊息
      systemMessages: [], // 系統訊息（上線/離線）合併後的 display list
      onlineUsers: [],
      inputText: "",
      isSending: false,
      defaultAvatar: DEFAULT_AVATAR,
    };
  },
  computed: {
    ...mapState(["currentUser"]),
    // 將訊息和系統訊息按時間合併顯示
    displayMessages() {
      const all = [
        ...this.messages.map((m) => ({ ...m, isSystem: false })),
        ...this.systemMessages,
      ];
      all.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      return all;
    },
  },
  async mounted() {
    await this.loadHistory();
    chatSocketHandler.joinPublicChat({
      id: this.currentUser.id,
      name: this.currentUser.name,
      account: this.currentUser.account,
      avatar: this.currentUser.avatar || null,
    });
    chatSocketHandler.onOnlineUsersUpdate((users) => {
      this.onlineUsers = users;
    });
    chatSocketHandler.onSystemMessage((msg) => {
      this.systemMessages.push({ ...msg, isSystem: true });
      this.$nextTick(this.scrollToBottom);
    });
    chatSocketHandler.onPublicMessage((message) => {
      this.messages.push(message);
      this.$nextTick(this.scrollToBottom);
    });
  },
  beforeDestroy() {
    chatSocketHandler.leavePublicChat();
    chatSocketHandler.off("onlineUsersUpdate");
    chatSocketHandler.off("systemMessage");
    chatSocketHandler.off("publicMessage");
  },
  methods: {
    async loadHistory() {
      try {
        const { data } = await chatAPI.getPublicMessages();
        this.messages = data;
        this.$nextTick(this.scrollToBottom);
      } catch (err) {
        console.error("無法載入公開聊天記錄", err);
      }
    },
    async sendMessage() {
      const content = this.inputText.trim();
      if (!content || this.isSending) return;
      this.isSending = true;
      chatSocketHandler.sendPublicMessage(content);
      this.inputText = "";
      this.isSending = false;
    },
    scrollToBottom() {
      const el = this.$refs.messageList;
      if (el) el.scrollTop = el.scrollHeight;
    },
  },
};
</script>

<style scoped>
.PublicChatContainer {
  width: 100%;
  display: flex;
}

#Navbar {
  position: fixed;
  margin-left: 130px;
}

.publicChatMain {
  display: flex;
  margin-left: 332px;
  width: calc(100% - 332px);
  max-width: 960px;
  height: 100vh;
  border-left: 1px solid #e6ecf0;
}

/* ── 左側 ── */
.onlinePanel {
  width: 350px;
  min-width: 350px;
  border-right: 1px solid #e6ecf0;
  display: flex;
  flex-direction: column;
}

.onlinePanelTitle {
  min-height: 64px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  font-size: 18px;
  font-weight: 700;
  border-bottom: 1px solid #e6ecf0;
  color: #0f1419;
}

.onlineUserList {
  overflow-y: auto;
  flex: 1;
}

.onlineUserItem {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.onlineUserAvatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.onlineUserInfo {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.onlineUserName {
  font-size: 14px;
  font-weight: 700;
  color: #0f1419;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.onlineUserAccount {
  font-size: 12px;
  color: #657786;
}

/* ── 右側 ── */
.chatPanel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.chatPanelTitle {
  min-height: 64px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  font-size: 18px;
  font-weight: 700;
  border-bottom: 1px solid #e6ecf0;
  color: #0f1419;
}

.messageList {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 系統訊息 */
.systemMessage {
  text-align: center;
  color: #aab8c2;
  font-size: 12px;
  padding: 4px 0;
}

/* 訊息氣泡基礎 */
.messageBubble {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-bottom: 8px;
}

.selfMessage {
  flex-direction: column;
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

.senderName {
  font-size: 12px;
  font-weight: 700;
  color: #657786;
  margin-bottom: 3px;
  padding-left: 4px;
}

.messageTime {
  font-size: 11px;
  color: #aab8c2;
  margin-top: 3px;
}

/* 輸入區 */
.inputArea {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid #e6ecf0;
  gap: 10px;
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
  .publicChatMain {
    margin-left: 68px;
    width: calc(100% - 68px);
  }
  .onlinePanel {
    width: 260px;
    min-width: 260px;
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
  .publicChatMain {
    margin-left: 0;
    width: 100%;
    padding-bottom: 70px;
  }
  .onlinePanel {
    display: none;
  }
}
</style>
