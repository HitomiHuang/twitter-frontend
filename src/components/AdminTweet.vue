<template>
  <div class="AdminTweet">
    <router-link to="">
      <img class="adminTweetUserImage" :src="tweet.User.avatar | emptyImage" alt="">
    </router-link>
    <div class="adminTweetContent">
      <div class="adminTweetUserNameGroup">
        <router-link class="adminTweetUserName" to="">{{tweet.User.name}}</router-link>
        <router-link class="adminTweetUserAccount" to="">@{{tweet.User.account}}</router-link>
        <p class="adminTweetCreatedAt">・{{tweet.createdAt | fromNow}}</p>
      </div>
      <div class="adminTweetText">
        <p>{{tweet.description}}</p>
      </div>
    </div>
    <button @click.stop.prevent="deleteTweet(tweet.id)" :disabled="isProcessing" class="deleteTweetBtn"><img src="../assets/delete-icon.png" alt=""></button>
  </div>
</template>

<script>
import { fromNowFilter } from '../utility/mixins'
import adminAPI from '../apis/admin'
import { Toast } from '../utility/helpers'
import { emptyImageFilter } from '../utility/mixins'

export default {
  props: {
    tweet: {
      type: Object,
      required: true
    }
  },
  mixins: [fromNowFilter, emptyImageFilter],
  data() {
    return {
      isProcessing: false
    }
  },
  methods: {
    async deleteTweet(id) {
      try {
        this.isProcessing = true
        await adminAPI.deleteTweet({id})
        Toast.fire({
          icon: 'success',
          title: '刪除推文成功'
        })
        this.$emit('deleteTweet',id)
        this.isProcessing = false
      }
      catch(error) {
        this.isProcessing = false
        Toast.fire({
          icon: 'error',
          title: '刪除推文失敗'
        })
      }
    }
  }
}
</script>

<style scoped>
.AdminTweet {
  border-bottom: 1px solid #E6ECF0;
  width: 100%;
  min-height: 118px;
  padding: 16px 23px;
  display: flex;
  position: relative;
}

.adminTweetUserImage {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 8px;
  background-color: #fff;
}

.adminTweetContent {
  width: 839px;
}

.adminTweetUserNameGroup {
  display: flex;
  width: 100%;
  height: 26px;
  line-height: 26px;
}

.adminTweetUserName {
  font-size: 16px;
  font-weight: 700;
  color: #171725;
  text-decoration: none;
  margin-right: 8px;
}

.adminTweetUserAccount {
  font-size: 14px;
  font-weight: 400;
  color: #6C757D;
  text-decoration: none;
}

.adminTweetCreatedAt {
  font-size: 14px;
  font-weight: 400;
  color: #6C757D;
}

.adminTweetText {
  font-size: 16px;
  font-weight: 400;
  color: #171725;
  line-height: 26px;
}

.deleteTweetBtn {
  width: 24px;
  height: 24px;
  border: 0;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
}

.deleteTweetBtn:disabled:hover {
  cursor: wait;
}

.deleteTweetBtn:hover {
  cursor: pointer;
}
</style>