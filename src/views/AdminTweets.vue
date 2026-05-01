<template>
  <div class="AdminTweets">
    <AdminNavbar id="AdminNavbar" />
    <div class="adminTweetsSection">
      <div class="adminTweetsSectionContent">
        <div class="adminTweetsTitle">
          <h1 class="adminTweetsTitleText">推文清單</h1>
        </div>
        <div class="adminTweetsTable">
          <AdminTweet
            @deleteTweet="deleteTweet"
            v-for="tweet in tweets"
            :key="tweet.id"
            :tweet="tweet"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminNavbar from "../components/AdminNavbar.vue";
import AdminTweet from "../components/AdminTweet.vue";
import adminAPI from "../apis/admin";
import { Toast } from "../utility/helpers";

export default {
  components: {
    AdminNavbar,
    AdminTweet,
  },
  data() {
    return {
      tweets: [],
    };
  },
  methods: {
    async fetchData() {
      try {
        const { data } = await adminAPI.getTweets();

        this.tweets = data;
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "無法取得推文列表",
        });
      }
    },
    deleteTweet(id) {
      this.tweets = this.tweets.filter((item) => item.id !== id);
    },
  },
  created() {
    this.fetchData();
  },
};
</script>

<style scoped>
.AdminTweets {
  width: 100%;
  display: grid;
}

#AdminNavbar {
  justify-self: start;
  position: fixed;
  margin-left: 130px;
}

.adminTweetsSection {
  width: 937px;
  margin-left: 332px;
}

.adminTweetsSectionContent {
  width: 100%;
  border-left: 1px solid #e6ecf0;
  border-right: 1px solid #e6ecf0;
}

.adminTweetsTitle {
  width: 100%;
  height: 74px;
  border-bottom: 1px solid #e6ecf0;
  padding: 24px 23px;
  font-size: 24px;
  font-weight: 700;
  color: #1c1c1c;
}

.adminTweetsTable {
  width: 100%;
}
</style>