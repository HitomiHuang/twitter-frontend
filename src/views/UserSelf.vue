<template>
  <div class="UserSelfContainer">
    <div class="mainRow">
      <Navbar id="Navbar" />
      <div v-show="currentUser.name" class="UserSelfMain">
      <div class="userTitle">
        <router-link to="/main">
          <img class="backIcon" src="../assets/Vector.png" alt="" />
        </router-link>
        <div class="userInfo">
          <h1 class="infoName">{{ currentUser.name }}</h1>
          <span class="infoTweetsNumber">{{ userTweets.length }}則推文</span>
        </div>
      </div>
      <UserSelfCard :initialCurrentUser="currentUser" />
      <UserTabs />
      <UserTweets
        v-if="$route.path == '/user/self/tweets'"
        :initialCurrentTweets="userTweets"
      />
      <Comments
        v-if="$route.path == '/user/self/comments'"
        :currentRepliedTweets="userComments"
      />
      <UserLikesTweets
        v-if="$route.path == '/user/self/likes'"
        :initialCurrentTweets="userLikes"
      />
      </div>
    </div>
    <PopularUsers id="PopularUsers" />
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import PopularUsers from "../components/PopularUsers.vue";
import UserTabs from "../components/UserTabs.vue";
import UserSelfCard from "../components/UserSelfCard.vue";
import UserTweets from "../components/UserTweets.vue";
import usersAPI from "../apis/users";
import { Toast } from "../utility/helpers";
import Comments from "../components/Comments.vue";
import UserLikesTweets from "../components/UserLikesTweets.vue";

export default {
  components: {
    Navbar,
    PopularUsers,
    UserTabs,
    UserSelfCard,
    UserTweets,
    Comments,
    UserLikesTweets,
  },

  data() {
    return {
      userTweets: [],
      userComments: [],
      userLikes: [],
      currentUser: {
        Followers: -1,
        Followings: -1,
        account: "",
        avatar: "",
        cover: "",
        createdAt: "",
        email: "",
        id: -1,
        introduction: "",
        name: "",
        role: "",
        updatedAt: "",
      },
    };
  },

  methods: {
    async fetchData(id) {
      try {
        const { data } = await usersAPI.getUser({ id });
        this.currentUser = data;

        const responseUserTweets = await usersAPI.getUserTweets({
          id,
        });
        this.userTweets = responseUserTweets.data;

        const responseUserComments = await usersAPI.getUserRepliedTweets({
          id,
        });
        this.userComments = responseUserComments.data.filter(
          (item) => item.Tweet !== null
        );

        const responseUserLikes = await usersAPI.getUserLikes({
          id,
        });
        this.userLikes = responseUserLikes.data;
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "無法取得使用者推文",
        });
      }
    },
  },

  created() {
    const id = this.$store.state.currentUser.id;
    this.fetchData(id);
  },
};
</script>

<style scoped>
.UserSelfContainer {
  width: 100%;
  display: grid;
}

.mainRow {
  display: contents;
}

#Navbar {
  justify-self: start;
  position: fixed;
  margin-left: 130px;
  /* width: 210px; */
}

#PopularUsers {
  position: fixed;
  justify-self: end;
  margin-right: 130px;
  margin-top: 16px;
  /* width: 350px; */
}

.UserSelfMain {
  width: 640px;
  margin-left: 332px;
  border-left: 1px solid #e6ecf0;
  border-right: 1px solid #e6ecf0;
  /* display: flex;
  flex-direction: column;
  align-items: center; */
  /* border: 1px solid black; */
}

.userTitle {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 28px;
  height: 74px;
  border-bottom: 1px solid #e6ecf0;
}

.backIcon {
  width: 17px;
  height: 14px;
}

.userInfo {
  margin-left: 19px;
}

.infoName {
  font-weight: 700;
  font-size: 18px;
  height: 24px;
  line-height: 26px;
}

.infoTweetsNumber {
  font-weight: 500;
  font-size: 13px;
  line-height: 19px;
  color: #6c757d;
}

/* ── Tablet (≤ 1399px) ── */
@media (max-width: 1399px) {
  .mainRow {
    display: flex;
    flex-direction: row;
    width: 100%;
    max-width: 968px;
    margin: 0 auto;
  }
  #Navbar {
    position: sticky;
    top: 0;
    height: 100vh;
    align-self: flex-start;
    flex-shrink: 0;
    margin-left: 0;
  }
  #PopularUsers {
    display: none;
  }
  .UserSelfMain {
    flex: 1;
    max-width: 900px;
    margin-left: 0;
    width: auto;
  }
}

/* ── Mobile (≤ 767px) ── */
@media (max-width: 767px) {
  .mainRow {
    display: contents;
  }
  #Navbar {
    position: fixed;
    margin-left: 0;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 65px;
  }
  #PopularUsers {
    display: none;
  }
  .UserSelfMain {
    margin-left: 0;
    width: 100%;
    padding-bottom: 70px;
  }
}
</style>

