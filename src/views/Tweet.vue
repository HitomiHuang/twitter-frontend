<template>
  <div class="Tweet">
    <Navbar id="Navbar" />
    <div v-show="tweet.id !== -1" class="tweetSection">
      <div class="tweetSectionContent">
        <div class="tweetTitle">
          <router-link to="/main">
            <img src="../assets/prev-icon.png" alt="" />
            <p>推文</p>
          </router-link>
        </div>
        <TweetDetail
          id="TweetDetail"
          :initialTweet="tweet"
        />
        <Comments id="TweetComments" :currentRepliedTweets="tweetReplies" />
      </div>
    </div>
    <PopularUsers id="PopularUsers" />
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import PopularUsers from "../components/PopularUsers.vue";
import TweetDetail from "../components/TweetDetail.vue";
import Comments from "../components/Comments.vue";
import tweetsAPI from "../apis/tweets";
import { Toast } from "../utility/helpers";

export default {
  components: {
    Navbar,
    PopularUsers,
    TweetDetail,
    Comments,
  },
  data() {
    return {
      tweet: {
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
      tweetReplies: [],
    };
  },
  methods: {
    async fetchData(id) {
      try {
        const tweetInfoResponse = await tweetsAPI.getTweet({
          id
        });

        this.tweet = tweetInfoResponse.data;

        const tweetRepliesResponse = await tweetsAPI.getTweetReplies({
          id
        });

        this.tweetReplies = tweetRepliesResponse.data;
        this.tweetReplies = this.tweetReplies.map((item) => {
          item = {
            ...item,
            userAvatar: item.userAvatar ? item.userAvatar : 'https://d29fhpw069ctt2.cloudfront.net/icon/image/84587/preview.svg'
          }
          return item
        })
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "無法取得推文資料",
        });
      }
    },
  },
  created() {
    const { id } = this.$route.params;
    this.fetchData(id);
  },
  beforeRouteUpdate(to, from, next) {
    const { id } = to.params;
    this.fetchData(id);
    next();
  },
};
</script>

<style scoped>
.Tweet {
  width: 100%;
  display: grid;
}

#Navbar {
  justify-self: start;
  position: fixed;
  margin-left: 130px;
  /* width: 178px; */
}

#PopularUsers {
  position: fixed;
  justify-self: end;
  margin-right: 130px;
  margin-top: 16px;
  /* width: 273px; */
}

.tweetSection {
  width: 640px;
  margin-left: 332px;
}

.tweetSectionContent {
  border-left: 1px solid #e6ecf0;
  border-right: 1px solid #e6ecf0;
}

.tweetTitle {
  width: 100%;
  height: 74px;
  border-bottom: 1px solid #e6ecf0;
  padding: 24px 23px;
}

.tweetTitle a {
  display: flex;
  text-decoration: none;
}

.tweetTitle p {
  margin-left: 16px;
  font-size: 24px;
  font-weight: 700;
  color: #1c1c1c;
}

.TweetDetail {
}
</style>