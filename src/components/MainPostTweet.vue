<template>
  <div class="MainPostTweet">
    <img
      class="mainPostTweetUserImage"
      :src="currentUser.avatar | emptyImage"
      width="50px"
      height="50px"
      alt=""
    />
    <textarea
      v-model="tweetText"
      class="mainPostTweetText"
      placeholder="有什麼新鮮事?"
    ></textarea>
    <p
      class="mainPostTweetErrorMessage"
      v-if="mainPostTweetErrorMessage && !tweetText"
    >
      {{ mainPostTweetErrorMessage }}
    </p>
    <p class="mainPostTweetErrorMessage" v-if="tweetText.length > 140">
      字數不可超過140字
    </p>

    <button
      class="mainPostTweetSubmitBtn"
      @click.stop.prevent="postTweetModalSubmit"
    >
      推文
    </button>
  </div>
</template>

<script>
import { mapState } from "vuex";
import tweetsAPI from "../apis/tweets";
import {Toast} from '../utility/helpers'
import { emptyImageFilter } from "../utility/mixins";

export default {
  mixins: [emptyImageFilter],
  computed: {
    ...mapState(["currentUser"]),
  },
  data() {
    return {
      tweetText: "",
      mainPostTweetErrorMessage: "",
    };
  },
  methods: {
    async postTweetModalSubmit() {
      try {
        if (!this.tweetText.trim()) {
          this.mainPostTweetErrorMessage = "內容不可留白";
          this.tweetText = ''
          return;
        }
        if (this.tweetText.length > 140) {
          return;
        }

        await tweetsAPI.postTweet({description: this.tweetText})


        this.tweetText = "";

        Toast.fire({
          icon: 'success',
          title: '推文成功'
        })
        this.$router.go(0);
      } catch (error) {
        Toast.fire({
          icon: 'error',
          title: '推文失敗'
        })
      }
    },
  },
};
</script>

<style scoped>
.MainPostTweet {
  width: 100%;
  height: 146px;
  padding: 16px 26px;
  position: relative;
  display: flex;
  border-bottom: 10px solid #e6ecf0;
}

.mainPostTweetUserImage {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #fff;
}

.mainPostTweetText {
  width: 460px;
  height: 60px;
  margin-left: 8px;
  margin-top: 12px;
  resize: none;
  font-size: 18px;
  font-weight: 700;
  border: 0;
  outline: 0;
}

.mainPostTweetText::placeholder {
  color: #6c757d;
}

.mainPostTweetSubmitBtn {
  width: 64px;
  height: 40px;
  border-radius: 50px;
  background-color: #ff6600;
  color: #fff;
  font-size: 16px;
  font-weight: 400;
  position: absolute;
  bottom: 16px;
  right: 25px;
  border: 0;
}

.mainPostTweetSubmitBtn:hover {
  cursor: pointer;
}

.mainPostTweetErrorMessage {
  position: absolute;
  bottom: 20px;
  right: 101px;
  font-size: 15px;
  font-weight: 500;
  color: #fc5a5a;
}
</style>