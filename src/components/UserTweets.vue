<template>
  <div class="AllTweets">
    <div
      class="singleTweet"
      v-for="tweet in initialCurrentTweets"
      :key="tweet.id"
    >
      <router-link :to="{ name: 'user-other', params: { id: tweet.User.id , type: 'tweets' } }">
        <img
          class="singleTweetUserImage"
          :src="tweet.User.avatar | emptyImage"
          alt=""
        />
      </router-link>
      <div class="singleTweetContent">
        <div class="singleTweetUserNameGroup">
          <router-link
            class="singleTweetUserName"
            :to="{ name: 'user-other', params: { id: tweet.User.id , type: 'tweets' } }"
            >{{ tweet.User.name }}</router-link
          >
          <router-link
            class="singleTweetUserAccount"
            :to="{ name: 'user-other', params: { id: tweet.User.id , type: 'tweets' } }"
            >@{{ tweet.User.account }}</router-link
          >
          <p class="singleTweetCreatedAt">・{{ tweet.createdAt | fromNow }}</p>
        </div>
        <p class="singleTweetText">
          <router-link :to="{ name: 'tweet', params: { id: tweet.id } }">{{
            tweet.description
          }}</router-link>
        </p>
        <div class="singleTweetBtnGroup">
          <button
            class="singleTweetBtn"
            @click.stop.prevent="openReplyTweetModal(tweet.id)"
            :disabled="isProcessing"
          >
            <img src="../assets/comment-icon.png" alt="" />
            <p>{{ tweet.Replies }}</p>
          </button>

          <button
            @click.stop.prevent="deleteLike(tweet.id)"
            :disabled="isProcessing"
            v-if="tweet.isLiked"
            class="singleTweetBtn"
          >
            <img src="../assets/like-icon-active.png" alt="" />
            <p>
              {{ tweet.Likes }}
            </p>
          </button>
          <button
            @click.stop.prevent="addLike(tweet.id)"
            :disabled="isProcessing"
            v-else
            class="singleTweetBtn"
          >
            <img src="../assets/like-icon.png" alt="" />
            <p>
              {{ tweet.Likes }}
            </p>
          </button>
        </div>
      </div>
    </div>
    <!-- replyModal -->
    <div id="replyTweetModal" v-show="replyTweetModalIsOpen">
      <div id="replyTweetModalWrapper">
        <div class="replyTweetModalConnectLine"></div>
        <button
          class="closeReplyTweetModalBtn"
          @click.stop.prevent="closeReplyTweetModal"
        >
          ✖
        </button>
        <div class="replyTweetModalContent">
          <div class="replyTweet">
            <img
              class="replyTweetUserImage"
              :src="replyTweetModalTweetInfo.User.avatar | emptyImage"
              alt=""
            />
            <div class="replyTweetContent">
              <div class="replyTweetUserNameGroup">
                <router-link
                  class="replyTweetUserName"
                  :to="{
                    name: 'user-other',
                    params: { id: replyTweetModalTweetInfo.User.id , type: 'tweets' },
                  }"
                  >{{ replyTweetModalTweetInfo.User.name }}</router-link
                >
                <router-link
                  class="replyTweetUserAccount"
                  :to="{
                    name: 'user-other',
                    params: { id: replyTweetModalTweetInfo.User.id , type: 'tweets' },
                  }"
                  >@{{ replyTweetModalTweetInfo.User.account }}</router-link
                >
                <p class="replyTweetCreatedAt">
                  ・{{ replyTweetModalTweetInfo.createdAt | fromNow }}
                </p>
              </div>
              <p class="replyTweetText">
                {{ replyTweetModalTweetInfo.description }}
              </p>
              <p class="replyTweetFor">
                回覆給 <span>@{{ replyTweetModalTweetInfo.User.account }}</span>
              </p>
            </div>
          </div>
          <div class="currentUserReply">
            <img
              :src="currentUser.avatar | emptyImage"
              width="50px"
              height="50px"
              class="currentUserReplyUserImg"
              alt=""
            />
            <textarea
              v-model="replyText"
              class="currentUserReplyText"
              placeholder="推你的回覆"
            >
            </textarea>
          </div>
          <button
            @click.stop.prevent="replyTweetModalSubmit"
            :disabled="isProcessing"
            class="replyTweetModalSubmitBtn"
          >
            回覆
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "../utility/helpers";
import tweetsAPI from "../apis/tweets";
import { mapState } from "vuex";
import { fromNowFilter } from "../utility/mixins";
import { emptyImageFilter } from "../utility/mixins";

export default {
  props: {
    initialCurrentTweets: {
      type: Array,
      required: true,
    },
  },
  mixins: [fromNowFilter, emptyImageFilter],
  data() {
    return {
      replyTweetModalIsOpen: false,
      replyTweetModalTweetInfo: {
        id: -1,
        UserId: -1,
        description: "",
        createdAt: "",
        updatedAt: "",
        Likes: -1,
        Replies: -1,
        User: {
          id: -1,
          email: "",
          password: "",
          name: "",
          role: "",
          account: "",
          cover: "",
          avatar: "",
          introduction: "",
          createdAt: "",
          updatedAt: "",
        },
        isLiked: false,
      },
      replyText: "",
      isProcessing: false,
    };
  },
  computed: {
    ...mapState(["currentUser"]),
  },
  methods: {
    async openReplyTweetModal(id) {
      try {
        this.isProcessing = true;
        const { data } = await tweetsAPI.getTweet({ id });

        this.replyTweetModalTweetInfo = data;

        this.replyTweetModalIsOpen = true;
        this.isProcessing = false;
      } catch (error) {
        this.isProcessing = false;
        Toast.fire({
          icon: "error",
          title: "推文資料取得失敗",
        });
      }
    },
    closeReplyTweetModal() {
      this.isProcessing = true;
      this.replyTweetModalTweetInfo = {
        id: -1,
        UserId: -1,
        description: "",
        createdAt: "",
        updatedAt: "",
        Likes: -1,
        Replies: -1,
        User: {
          id: -1,
          email: "",
          password: "",
          name: "",
          role: "",
          account: "",
          cover: "",
          avatar: "",
          introduction: "",
          createdAt: "",
          updatedAt: "",
        },
        isLiked: false,
      };
      this.replyTweetModalIsOpen = false;
      this.replyText = ''
      this.isProcessing = false;
    },
    async replyTweetModalSubmit() {
      try {
        if (!this.replyText.trim()) {
          Toast.fire({
            icon: "warning",
            title: "回覆內容不可留白",
          });
          this.replyText = ''
          return;
        } else if (this.replyText.length > 140) {
          Toast.fire({
            icon: "warning",
            title: "回覆內容不可超過140字",
          });
          return;
        }

        this.isProcessing = true;

        await tweetsAPI.replyTweet({
          id: this.replyTweetModalTweetInfo.id,
          comment: this.replyText,
        });

        Toast.fire({
          icon: "success",
          title: "回覆推文成功",
        });

        this.replyText = "";
        this.replyTweetModalIsOpen = false;
        this.isProcessing = false;
        this.$router.go(0);
      } catch (error) {
        this.isProcessing = false;
        Toast.fire({
          icon: "error",
          title: "回復推文失敗",
        });
      }
    },
    async addLike(id) {
      try {
        this.isProcessing = true;
        await tweetsAPI.addLike({ id });

        const tweet = this.initialCurrentTweets.find((item) => item.id === id);
        tweet.isLiked = true;
        tweet.Likes++;
        this.isProcessing = false;
      } catch (error) {
        this.isProcessing = false;
        Toast.fire({
          icon: "error",
          title: "無法按讚推文",
        });
      }
    },
    async deleteLike(id) {
      try {
        this.isProcessing = true;
        await tweetsAPI.deleteLike({ id });

        const tweet = this.initialCurrentTweets.find((item) => item.id === id);
        tweet.isLiked = false;
        tweet.Likes--;
        this.isProcessing = false;
      } catch (error) {
        this.isProcessing = false;
        Toast.fire({
          icon: "error",
          title: "無法取消按讚推文",
        });
      }
    },
  },
};
</script>

<style scoped>
.AllTweets {
  width: 100%;
}
.singleTweet {
  border-bottom: 1px solid #e6ecf0;
  min-height: 168px;
  display: flex;
  padding: 16px 24px;
  position: relative;
}

.singleTweetUserImage {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 10px;
  background-color: #fff;
}

.singleTweetContent {
  width: 510px;
}

.singleTweetUserNameGroup {
  height: 26px;
  line-height: 26px;
  display: flex;
}

.singleTweetUserName {
  font-size: 16px;
  font-weight: 700;
  color: #171725;
  margin-right: 8px;
  text-decoration: none;
}

.singleTweetUserAccount {
  font-size: 14px;
  font-weight: 400;
  color: #6c757d;
  text-decoration: none;
}

.singleTweetCreatedAt {
  font-size: 14px;
  font-weight: 400;
  color: #6c757d;
}

.singleTweetText {
  word-break: break-all;
  width: 100%;
  min-height: 78px;
  margin-top: 8px;
}

.singleTweetText a {
  text-decoration: none;
  font-size: 16px;
  font-weight: 400;
  color: #171725;
  line-height: 26px;
}

.singleTweetBtnGroup {
  height: 16px;
  display: flex;
  margin-top: 14px;
  left: 82px;
  bottom: 16px;
}

.singleTweetBtn {
  padding: 0;
  width: 40px;
  border: 0;
  margin-right: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  font-size: 13px;
  font-weight: 500;
  color: #657786;
}

.singleTweetBtn .active {
  color: #e0245e;
}
.singleTweetBtn:hover {
  cursor: pointer;
}

.singleTweetBtn:disabled:hover {
  cursor: wait;
}

#replyTweetModal {
  position: fixed;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
}

#replyTweetModalWrapper {
  width: 634px;
  height: 500px;
  background-color: #fff;
  margin-top: 56px;
  border-radius: 14px;
  position: relative;
}

.closeReplyTweetModalBtn {
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

.closeReplyTweetModalBtn:hover {
  cursor: pointer;
}

.replyTweetModalContent {
  border-top: 1px solid #e6ecf0;
  height: 443px;
}

.currentUserReply {
  display: flex;
  padding-left: 24px;
  margin-top: 45px;
}

.currentUserReplyUserImg {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 8px;
  background-color: #fff;
}

.currentUserReplyText {
  margin-top: 12px;
  width: 510px;
  height: 100px;
  resize: none;
  font-size: 16px;
  font-weight: 400;
  border: 0;
}

.currentUserReplyText::placeholder {
  color: #6c757d;
}

.currentUserReplyText:focus {
  outline: none;
}

.replyTweetModalSubmitBtn {
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

.replyTweetModalSubmitBtn:hover {
  cursor: pointer;
}

.replyTweetModalSubmitBtn:disabled:hover {
  cursor: wait;
}

.replyTweet {
  display: flex;
  height: 129px;
  margin-top: 16px;
  padding-left: 24px;
  position: relative;
}

.replyTweetUserImage {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: #fff;
}

.replyTweetUserNameGroup {
  display: flex;
  height: 26px;
  line-height: 26px;
}

.replyTweetUserName {
  font-size: 16px;
  font-weight: 700;
  color: #171725;
  margin-right: 8px;
  text-decoration: none;
}

.replyTweetUserAccount {
  font-size: 14px;
  font-weight: 400;
  color: #6c757d;
  text-decoration: none;
}

.replyTweetCreatedAt {
  font-size: 14px;
  font-weight: 400;
  color: #6c757d;
}

.replyTweetText {
  word-break: break-all;
  width: 528px;
  height: 78px;
  margin-top: 8px;
}

.replyTweetFor {
  position: absolute;
  top: 100%;
  font-size: 14px;
  font-weight: 400;
  color: #6c757d;
}

.replyTweetFor span {
  color: #ff6600;
}

.replyTweetModalConnectLine {
  width: 2px;
  height: 86px;
  background-color: #b5b5be;
  position: absolute;
  left: 48px;
  top: 139px;
}
</style>