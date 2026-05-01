<template>
  <div>
    <ul class="tabs">
      <li>
        <router-link
          class="tweet"
          :to="{ name: 'user-other', params: { id: newCurrentUser.id , type: 'tweets' } }"
          >推文</router-link
        >
      </li>
      <li>
        <router-link
          class="response"
          :to="{ name: 'user-other', params: { id: newCurrentUser.id , type: 'comments' } }"
          >回覆</router-link
        >
      </li>
      <li>
        <router-link
          class="likedContent"
          :to="{ name: 'user-other', params: { id: newCurrentUser.id , type: 'likes' } }"
          >喜歡的內容</router-link
        >
      </li>
    </ul>
  </div>
</template>

<script>
export default {  
  data() {
    return {
      newCurrentUser: this.currentUser,
    };
  },

  props: {
    currentUser: {
      type: Object,
      required: true,
    },
  },

  watch: {
    currentUser(newValue) {
      this.newCurrentUser = {
        ...this.newCurrentUser,
        ...newValue,
      };
    },
  },
};
</script>


<style scoped>
.tabs {
  display: flex;
}

li {
  padding-bottom: 15px;
}

.tweet {
  padding-left: 50px;
}

.response {
  padding-left: 99px;
}

.likedContent {
  padding-left: 78px;
}

.tweet,
.response,
.likedContent {
  text-decoration: none;
  font-weight: 700;
  font-size: 15px;
  line-height: 22px;
  color: #657786;
}

.tweet.active,
.response.active,
.likedContent.active {
  color: #ff6600;
  position: relative;
}

.tweet.active::after,
.response.active::after,
.likedContent.active::after {
  content: "";
  position: absolute;
  bottom: -15px;
  left: 0px;
  height: 2px;
  width: 130px;
  background-color: #ff6600;
  border-radius: 100px;
}

.response.active::after {
  left: 50px;
}

.likedContent.active::after {
  left: 51px;
}

.tabs {
  border-bottom: 1px solid #e6ecf0;
}
</style>