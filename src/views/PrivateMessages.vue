<template>
  <div class="PrivateMessagesContainer">
    <Navbar id="Navbar" />
    <div class="privateMessagesLayout">
      <!-- 左側：對話列表 -->
      <div class="conversationPanel">
        <div class="panelHeader">
          <h2>訊息</h2>
        </div>
        <div v-if="conversations.length === 0" class="emptyState">
          尚無私人訊息
        </div>
        <div
          v-for="conv in conversations"
          :key="conv.partner.id"
          class="conversationItem"
          :class="{ activeConversation: selectedPartnerId === conv.partner.id }"
          @click="selectConversation(conv.partner.id)"
        >
          <img
            class="partnerAvatar"
            :src="conv.partner.avatar || defaultAvatar"
            alt=""
          />
          <div class="conversationInfo">
            <div class="convHeader">
              <div class="partnerNames">
                <span class="partnerName">{{ conv.partner.name }}</span>
                <span class="partnerAccount">@{{ conv.partner.account }}</span>
              </div>
              <span class="lastTime">{{
                formatTimeShort(conv.lastMessage.createdAt)
              }}</span>
            </div>
            <div class="lastMessageRow">
              <span class="lastMessagePreview">{{
                conv.lastMessage.content
              }}</span>
              <span v-if="conv.unreadCount > 0" class="unreadBadge">
                {{ conv.unreadCount > 99 ? "99+" : conv.unreadCount }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右側：聊天區 -->
      <div
        class="chatPanel"
        :class="{ mobileChatVisible: isMobile && selectedPartnerId }"
      >
        <!-- 未選擇對話 -->
        <div v-if="!selectedPartnerId" class="noChatSelected">
          <p>選擇一個對話開始聊天</p>
        </div>

        <!-- 已選擇對話 -->
        <template v-else>
          <!-- 對話標題 -->
          <div class="chatHeader" v-if="partner">
            <button v-if="isMobile" class="backBtn" @click="goBackToList">
              &#8592;
            </button>
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
              <template v-if="msg.sender && msg.sender.id !== currentUser.id">
                <img
                  class="messageAvatar"
                  :src="msg.sender.avatar || defaultAvatar"
                  alt=""
                />
                <div class="messageBody">
                  <div
                    v-if="msg.isRecalled"
                    class="recalledBubble otherRecalled"
                  >
                    此訊息已回收
                  </div>
                  <div v-else class="bubbleContent otherBubble">
                    {{ msg.content }}
                  </div>
                  <span class="messageTime">{{
                    formatTime(msg.createdAt)
                  }}</span>
                </div>
              </template>
              <template v-else>
                <div class="selfMsgWrapper">
                  <div v-if="!msg.isRecalled" class="recallMenuContainer">
                    <button
                      class="recallMenuBtn"
                      @click.stop="toggleRecallMenu(msg.id, $event)"
                    >
                      ⋯
                    </button>
                    <div
                      v-if="recallMenuMsgId === msg.id"
                      class="recallDropdown"
                      :style="{
                        top: recallMenuPos.top + 'px',
                        right: recallMenuPos.right + 'px',
                      }"
                      @click.stop
                    >
                      <button
                        class="recallDropdownItem"
                        @click="recallMessage(msg)"
                      >
                        回收訊息
                      </button>
                    </div>
                  </div>
                  <div
                    v-if="msg.isRecalled"
                    class="recalledBubble selfRecalled"
                  >
                    此訊息已回收
                  </div>
                  <div v-else class="bubbleContent selfBubble">
                    {{ msg.content }}
                  </div>
                  <div class="selfMeta">
                    <span
                      v-if="msg.isRead && !msg.isRecalled"
                      class="readReceipt"
                      >已讀</span
                    >
                    <span class="messageTime selfTime">{{
                      formatTime(msg.createdAt)
                    }}</span>
                  </div>
                </div>
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
        </template>
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
import { chatTimeMixin } from "../utility/mixins";
import { DEFAULT_AVATAR } from "../utility/helpers";

export default {
  components: { Navbar },
  mixins: [chatTimeMixin],
  data() {
    return {
      conversations: [],
      selectedPartnerId: null,
      partner: null,
      messages: [],
      inputText: "",
      defaultAvatar: DEFAULT_AVATAR,
      recallMenuMsgId: null,
      recallMenuPos: { top: 0, right: 0 },
      isMobile: false,
    };
  },
  computed: {
    ...mapState(["currentUser"]),
  },
  async mounted() {
    this._checkMobile = () => {
      this.isMobile = window.innerWidth <= 767;
    };
    this._checkMobile();
    window.addEventListener("resize", this._checkMobile);

    await this.loadConversations();
    this._bindSocketListeners();

    // 點擊其他地方時關閉回收選單
    this._closeRecallMenu = () => {
      this.recallMenuMsgId = null;
    };
    document.addEventListener("click", this._closeRecallMenu);

    // 若從路由直接帶 id（e.g. /chat/private/:id），自動選取
    const routeId = Number(this.$route.params.id);
    if (routeId) {
      await this.selectConversation(routeId);
    }
  },
  beforeDestroy() {
    chatSocketHandler.off("newPrivateMessage");
    chatSocketHandler.off("privateMessageSent");
    chatSocketHandler.off("messageRecalled");
    document.removeEventListener("click", this._closeRecallMenu);
    window.removeEventListener("resize", this._checkMobile);
  },
  async beforeRouteUpdate(to, from, next) {
    next();
    const newId = Number(to.params.id);
    if (newId && newId !== this.selectedPartnerId) {
      await this.selectConversation(newId);
    }
  },
  methods: {
    goBackToList() {
      this.selectedPartnerId = null;
      this.partner = null;
      this.messages = [];
    },
    async loadConversations() {
      try {
        const { data } = await chatAPI.getConversations();
        this.conversations = data;
      } catch (err) {
        console.error("無法載入對話列表", err);
      }
    },
    async selectConversation(partnerId) {
      this.selectedPartnerId = partnerId;
      this.messages = [];
      this.partner = null;

      // 從對話列表找 partner
      const conv = this.conversations.find((c) => c.partner.id === partnerId);
      if (conv) {
        this.partner = conv.partner;
      }

      await Promise.all([
        this.loadMessages(partnerId),
        this.loadPartner(partnerId),
        this.markAsRead(partnerId),
      ]);

      // 清除該對話的本地未讀數
      if (conv) conv.unreadCount = 0;
    },
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
        const { data } = await chatAPI.getUnreadPrivateCount();
        this.$store.commit("setUnreadPrivateCount", data.count);
      } catch (err) {
        /* 忽略 */
      }
    },
    _bindSocketListeners() {
      chatSocketHandler.onPrivateMessage((message) => {
        const senderId = Number(message.senderId);
        if (senderId === this.selectedPartnerId) {
          // 目前正在看這個對話，直接顯示並標已讀
          this.messages.push(message);
          this.$nextTick(this.scrollToBottom);
          chatAPI
            .markMessagesAsRead({ userId: this.selectedPartnerId })
            .catch(() => {});
        } else {
          // 其他對話：更新對話列表中的未讀數
          const conv = this.conversations.find(
            (c) => c.partner.id === senderId
          );
          if (conv) {
            conv.unreadCount = (conv.unreadCount || 0) + 1;
            conv.lastMessage = message;
          } else {
            // 新對話，重新載入列表
            this.loadConversations();
          }
          this.$store.commit("incrementUnreadPrivateCount");
        }
      });

      chatSocketHandler.onPrivateMessageSent((message) => {
        if (!this.messages.find((m) => m.id === message.id)) {
          this.messages.push(message);
          this.$nextTick(this.scrollToBottom);
          // 更新對話列表最後一筆訊息
          const conv = this.conversations.find(
            (c) => c.partner.id === this.selectedPartnerId
          );
          if (conv) conv.lastMessage = message;
        }
      });

      chatSocketHandler.onMessagesRead(({ readBy }) => {
        // 對方讀了傳給他的訊息，將所有自己發出的訊息標為已讀
        if (Number(readBy) === this.selectedPartnerId) {
          this.messages.forEach((m) => {
            if (m.sender && m.sender.id === this.currentUser.id) {
              this.$set(m, "isRead", true);
            }
          });
        }
      });

      chatSocketHandler.onMessageRecalled(({ id }) => {
        const msg = this.messages.find((m) => m.id === id);
        if (msg) this.$set(msg, "isRecalled", true);
      });
    },
    toggleRecallMenu(msgId, event) {
      if (this.recallMenuMsgId === msgId) {
        this.recallMenuMsgId = null;
        return;
      }
      const rect = event.currentTarget.getBoundingClientRect();
      this.recallMenuPos = {
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      };
      this.recallMenuMsgId = msgId;
    },
    async recallMessage(msg) {
      this.recallMenuMsgId = null;
      try {
        await chatAPI.recallMessage({ id: msg.id });
        this.$set(msg, "isRecalled", true);
      } catch (err) {
        console.error("回收訊息失敗", err);
      }
    },
    sendMessage() {
      const content = this.inputText.trim();
      if (!content || !this.selectedPartnerId) return;
      chatSocketHandler.sendPrivateMessage(this.selectedPartnerId, content);
      this.inputText = "";
    },
    scrollToBottom() {
      const el = this.$refs.messageList;
      if (el) el.scrollTop = el.scrollHeight;
    },
  },
};
</script>

<style scoped>
.PrivateMessagesContainer {
  width: 100%;
  display: flex;
}

#Navbar {
  position: fixed;
  margin-left: 130px;
}

.privateMessagesLayout {
  display: flex;
  margin-left: 332px;
  width: calc(100% - 332px);
  max-width: 960px;
  height: 100vh;
  border-left: 1px solid #e6ecf0;
}

/* ── 左側對話列表 ── */
.conversationPanel {
  width: 350px;
  flex-shrink: 0;
  border-right: 1px solid #e6ecf0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panelHeader {
  min-height: 64px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #e6ecf0;
  flex-shrink: 0;
}

.panelHeader h2 {
  font-size: 18px;
  font-weight: 700;
  color: #0f1419;
  margin: 0;
}

.emptyState {
  padding: 40px;
  text-align: center;
  color: #657786;
  font-size: 14px;
}

.conversationItem {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid #e6ecf0;
  cursor: pointer;
  transition: background-color 0.15s;
  border-left: 3px solid transparent;
}

.conversationItem:hover {
  background-color: #f7f7f7;
}

.activeConversation {
  border-left: 3px solid #ff6600;
  background-color: #fff8f5;
}

.partnerAvatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.conversationInfo {
  flex: 1;
  min-width: 0;
}

.convHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
  gap: 8px;
}

.partnerNames {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.partnerName {
  font-size: 15px;
  font-weight: 700;
  color: #0f1419;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.partnerAccount {
  font-size: 13px;
  color: #657786;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lastTime {
  font-size: 12px;
  color: #657786;
  flex-shrink: 0;
  margin-top: 2px;
}

.lastMessageRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.lastMessagePreview {
  font-size: 13px;
  color: #657786;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.unreadBadge {
  background-color: #ff6600;
  color: white;
  border-radius: 10px;
  padding: 1px 7px;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}

/* ── 右側聊天區 ── */
.chatPanel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.noChatSelected {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #657786;
  font-size: 15px;
}

.chatHeader {
  min-height: 64px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #e6ecf0;
  flex-shrink: 0;
}

.partnerHeaderInfo {
  display: flex;
  flex-direction: column;
}

.partnerHeaderName {
  font-size: 18px;
  font-weight: 700;
  color: #0f1419;
}

.partnerHeaderAccount {
  font-size: 13px;
  color: #657786;
}

.messageList {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.messageBubble {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.selfMessage {
  flex-direction: row-reverse;
}

.otherMessage {
  flex-direction: row;
}

.messageAvatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.messageBody {
  display: flex;
  flex-direction: column;
  max-width: 60%;
}

.bubbleContent {
  border-radius: 18px;
  padding: 10px 14px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
  white-space: pre-wrap;
}

.otherBubble {
  background-color: #e1e8ed;
  color: #0f1419;
  border-bottom-left-radius: 4px;
}

.selfBubble {
  background-color: #ff6600;
  color: white;
  border-bottom-right-radius: 4px;
  max-width: 300px;
}

.messageTime {
  font-size: 11px;
  color: #657786;
  margin-top: 4px;
  padding-left: 4px;
}

.selfTime {
  text-align: right;
  padding-right: 4px;
  padding-left: 0;
}

.selfMsgWrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  max-width: 300px;
}

.selfMeta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 4px;
}

.readReceipt {
  font-size: 11px;
  color: #ff6600;
  font-weight: 500;
}

.inputArea {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-top: 1px solid #e6ecf0;
  flex-shrink: 0;
}

.messageInput {
  flex: 1;
  border: 1px solid #e6ecf0;
  border-radius: 24px;
  padding: 10px 16px;
  font-size: 14px;
  outline: none;
  background: #f5f8fa;
}

.messageInput:focus {
  border-color: #ff6600;
  background: #fff;
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
  transition: background-color 0.15s;
}

.sendBtn:disabled {
  background-color: #ffb380;
  cursor: not-allowed;
}

.sendBtn:hover:not(:disabled) {
  background-color: #e55a00;
}

/* ── 回收訊息 ── */
.recallMenuContainer {
  position: relative;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 4px;
}

.recallMenuBtn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #657786;
  padding: 0 4px;
  line-height: 1;
  border-radius: 50%;
  transition: color 0.15s;
}

.recallMenuBtn:hover {
  color: #0f1419;
}

.recallDropdown {
  position: fixed;
  background: #fff;
  border: 1px solid #e6ecf0;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  z-index: 9999;
  min-width: 100px;
  overflow: hidden;
}

.recallDropdownItem {
  display: block;
  width: 100%;
  padding: 10px 16px;
  background: none;
  border: none;
  text-align: left;
  font-size: 14px;
  color: #e0245e;
  cursor: pointer;
  white-space: nowrap;
}

.recallDropdownItem:hover {
  background-color: #fef0f4;
}

.recalledBubble {
  border-radius: 18px;
  padding: 10px 14px;
  font-size: 13px;
  font-style: italic;
  color: #aab8c2;
  border: 1px dashed #ccd6dd;
}

.selfRecalled {
  border-bottom-right-radius: 4px;
}

.otherRecalled {
  border-bottom-left-radius: 4px;
}

/* ── RWD 行動版 ── */
@media (max-width: 767px) {
  #Navbar {
    margin-left: 0;
  }

  .privateMessagesLayout {
    margin-left: 0;
    width: 100%;
    max-width: 100%;
    position: relative;
    overflow: hidden;
  }

  .conversationPanel {
    width: 100%;
    flex-shrink: 0;
    transition: transform 0.3s ease;
  }

  .chatPanel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    background: #fff;
  }

  .chatPanel.mobileChatVisible {
    transform: translateX(0);
  }
}

.backBtn {
  display: none;
}

@media (max-width: 767px) {
  .backBtn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    font-size: 20px;
    color: #0f1419;
    cursor: pointer;
    margin-right: 12px;
    padding: 4px 8px;
    border-radius: 50%;
    transition: background-color 0.15s;
  }

  .backBtn:hover {
    background-color: #f7f7f7;
  }

  .chatHeader {
    display: flex;
    align-items: center;
  }
}

/* ── Tablet (≤ 1399px) ── */
@media (max-width: 1399px) {
  #Navbar {
    margin-left: 0;
  }
  .privateMessagesLayout {
    margin-left: 68px;
    width: calc(100% - 68px);
  }
  .conversationPanel {
    width: 260px;
    min-width: 260px;
  }
}

/* ── Mobile (≤ 767px) ── */
@media (max-width: 767px) {
  #Navbar {
    position: fixed;
    margin-left: 0;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 200;
    height: 65px;
  }
  .privateMessagesLayout {
    margin-left: 0;
    width: 100%;
    height: calc(100vh - 58px);
    padding-bottom: 0;
  }
  .conversationPanel {
    width: 100%;
    min-width: unset;
    overflow-y: auto;
  }
}
</style>
