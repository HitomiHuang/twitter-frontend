<template>
  <div class="TweetDetail">
    <div class="tweetContent">
      <div class="tweetUser">
        <router-link :to="{name: 'user-other', params: {id: initialTweet.User.id , type: 'tweets'}}">
          <img class="tweetUserImage" :src="initialTweet.User.avatar | emptyImage" alt="" />
          <div class="tweetUserNameGroup">
            <p class="tweetUserName">{{ initialTweet.User.name }}</p>
            <p class="tweetUserAccount">@{{ initialTweet.User.account }}</p>
          </div>
        </router-link>
      </div>
      <div class="tweetText">
        <p>{{ initialTweet.description }}</p>
      </div>
      <div class="tweetCreatedAt">
        <p>{{ initialTweet.createdAt | date }}</p>
      </div>
      <div class="tweetCommentsLikesCount">
        <p class="tweetCommentsCount">
          <span>{{ initialTweet.Replies }}</span
          >回覆
        </p>
        <p class="tweetLikesCount">
          <span>{{ initialTweet.Likes }}</span
          >喜歡次數
        </p>
      </div>
      <div class="tweetCommentLikeBtn">
        <button :disabled="isProcessing" @click.stop.prevent="openReplyTweetModal" class="tweetCommentBtn">
          <img
            class="tweetCommentIcon"
            src="../assets/comment-icon-large.png"
            alt=""
          />
        </button>
        <button
          :disabled="isProcessing"
          @click.stop.prevent="addLike(initialTweet.id)"
          v-if="!initialTweet.isLiked"
          class="tweetLikeBtn"
        >
          <img
            class="tweetLikeIcon"
            src="../assets/like-icon-large.png"
            alt=""
          />
        </button>
        <button
          :disabled="isProcessing"
          @click.stop.prevent="deleteLike(initialTweet.id)"
          v-else
          class="tweetLikeBtn"
        >
          <img
            class="tweetLikeActiveIcon"
            src="../assets/like-icon-large-active.png"
            alt=""
          />
        </button>
      </div>
    </div>
    <!-- modal -->
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
              :src="initialTweet.User.avatar | emptyImage"
              alt=""
            />
            <div class="replyTweetContent">
              <div class="replyTweetUserNameGroup">
                <router-link
                  class="replyTweetUserName"
                  :to="{
                    name: 'user-other',
                    params: { id: initialTweet.User.id , type: 'tweets' },
                  }"
                  >{{ initialTweet.User.name }}</router-link
                >
                <router-link
                  class="replyTweetUserAccount"
                  :to="{
                    name: 'user-other',
                    params: { id: initialTweet.User.id , type: 'tweets' },
                  }"
                  >@{{ initialTweet.User.account }}</router-link
                >
                <p class="replyTweetCreatedAt">
                  ・{{ initialTweet.createdAt | fromNow }}
                </p>
              </div>
              <p class="replyTweetText">
                {{ initialTweet.description }}
              </p>
              <p class="replyTweetFor">
                回覆給 <span>@{{ initialTweet.User.account }}</span>
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
import tweetsAPI from "../apis/tweets";
import { Toast } from "../utility/helpers";
import { fromNowFilter } from "../utility/mixins";
import { mapState } from "vuex";
import { emptyImageFilter } from "../utility/mixins";

export default {
  props: {
    initialTweet: {
      type: Object,
      required: true,
    },
  },
  mixins: [fromNowFilter, emptyImageFilter],
  data() {
    return {
      isProcessing: false,
      replyTweetModalIsOpen: false,
      replyText: "",
    };
  },
  computed: {
    ...mapState(['currentUser'])
  },
  methods: {
    async addLike(id) {
      try {
        this.isProcessing = true;
        await tweetsAPI.addLike({ id });

        this.initialTweet.isLiked = true
        this.initialTweet.Likes++
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

        this.initialTweet.isLiked = false
        this.initialTweet.Likes--
        this.isProcessing = false;
      } catch (error) {
        this.isProcessing = false;
        Toast.fire({
          icon: "error",
          title: "無法取消按讚推文",
        });
      }
    },
    openReplyTweetModal() {
      this.replyTweetModalIsOpen = true
    },
    closeReplyTweetModal() {
      this.replyText = ''
      this.replyTweetModalIsOpen = false
    },
    async replyTweetModalSubmit() {
      try {
        if (!this.replyText) {
          Toast.fire({
            icon: "warning",
            title: "回覆內容不可留白",
          });
          return
        } else if (this.replyText.length > 140) {
          Toast.fire({
            icon: "warning",
            title: "回覆內容不可超過140字",
          });
          return
        }

        this.isProcessing = true;

        await tweetsAPI.replyTweet({
          id: this.initialTweet.id,
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
  },
};
</script>


<style scoped>
.TweetDetail {
  width: 100%;
  min-height: 350px;
  border-bottom: 1px solid #e6ecf0;
  padding: 16px 16px 0px 16px;
}

.tweetUser a {
  display: flex;
  text-decoration: none;
}

.tweetUserImage {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 8px;
  background-color: #fff;
}

.tweetUserNameGroup {
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.tweetUserName {
  font-size: 16px;
  font-weight: 700;
  color: #171725;
  margin-bottom: 5px;
}

.tweetUserAccount {
  font-size: 14px;
  font-weight: 400;
  color: #6c757d;
}

.tweetText {
  margin-top: 8px;
  min-height: 108px;
}

.tweetText p {
  font-size: 24px;
  font-weight: 400;
  color: #171725;
  line-height: 36px;
  word-break: break-all;
}

.tweetCreatedAt {
  border-bottom: 1px solid #e6ecf0;
  margin-top: 8px;
  padding-bottom: 8px;
}

.tweetCreatedAt p {
  font-size: 14px;
  font-weight: 500;
  color: #6c757d;
  line-height: 22px;
}

.tweetCommentsLikesCount {
  border-bottom: 1px solid #e6ecf0;
  height: 60px;
  display: flex;
  align-items: center;
  font-size: 19px;
  font-weight: 500;
  color: #6c757d;
}

.tweetCommentsCount {
  margin-right: 24px;
}

.tweetCommentsLikesCount span {
  color: #171725;
  font-weight: 700;
}

.tweetCommentLikeBtn {
  height: 68px;
  display: flex;
  align-items: center;
}

.tweetCommentLikeBtn button {
  height: 30px;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 130px;
  border: 0;
  background-color: #fff;
}

.tweetCommentLikeBtn button:disabled:hover {
  cursor: wait;
}

.tweetCommentLikeBtn button:hover {
  cursor: pointer;
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
  object-fit: cover;
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