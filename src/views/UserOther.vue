<template>
  <div class="UserSelfContainer">
    <div class="mainRow">
      <Navbar id="Navbar" />
      <div v-show="currentUser.name" class="UserSelfMain">
        <div class="sticky-profile-header">
          <div class="userTitle">
            <router-link to="/main">
              <img class="backIcon" src="../assets/Vector.png" alt="" />
            </router-link>
            <div class="userInfo">
              <h1 class="infoName">{{ currentUser.name }}</h1>
              <span class="infoTweetsNumber"
                >{{ userTweets.length }}則推文</span
              >
            </div>
          </div>
          <UserOtherCard :initialCurrentUser="currentUser" />
          <UserOtherTabs :currentUser="currentUser" />
        </div>
        <div ref="scrollContainer" class="userContentScroll">
          <UserTweets
            v-if="$route.name == 'user-other' && $route.params.type == 'tweets'"
            :initialCurrentTweets="userTweets"
          />
          <Comments
            v-if="
              $route.name == 'user-other' && $route.params.type == 'comments'
            "
            :currentRepliedTweets="userComments"
          />
          <UserLikesTweets
            v-if="$route.name == 'user-other' && $route.params.type == 'likes'"
            :initialCurrentTweets="userLikes"
          />
          <div ref="sentinel" class="sentinel">
            <span v-if="isLoading" class="loading-text">載入中...</span>
            <span v-else-if="!hasMoreForCurrentTab" class="no-more-text"
              >沒有更多了</span
            >
          </div>
        </div>
      </div>
    </div>
    <PopularUsers id="PopularUsers" />
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import PopularUsers from "../components/PopularUsers.vue";
import UserOtherTabs from "../components/UserOtherTabs.vue";
import UserOtherCard from "../components/UserOtherCard.vue";
import UserTweets from "../components/UserTweets.vue";
import usersAPI from "../apis/users";
import { Toast } from "../utility/helpers";
import Comments from "../components/Comments.vue";
import UserLikesTweets from "../components/UserLikesTweets.vue";

const TWEETS_PER_PAGE = 10;

export default {
  components: {
    Navbar,
    PopularUsers,
    UserOtherTabs,
    UserOtherCard,
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
      // per-tab pagination
      userTweetsOffset: 0,
      userTweetsHasMore: true,
      userCommentsOffset: 0,
      userCommentsHasMore: true,
      userLikesOffset: 0,
      userLikesHasMore: true,
      isLoading: false,
      observer: null,
      profileUserId: null,
    };
  },

  computed: {
    currentTab() {
      const type = this.$route.params.type;
      if (type === "comments") return "comments";
      if (type === "likes") return "likes";
      return "tweets";
    },
    hasMoreForCurrentTab() {
      if (this.currentTab === "comments") return this.userCommentsHasMore;
      if (this.currentTab === "likes") return this.userLikesHasMore;
      return this.userTweetsHasMore;
    },
  },

  methods: {
    resetPagination() {
      this.userTweets = [];
      this.userComments = [];
      this.userLikes = [];
      this.userTweetsOffset = 0;
      this.userTweetsHasMore = true;
      this.userCommentsOffset = 0;
      this.userCommentsHasMore = true;
      this.userLikesOffset = 0;
      this.userLikesHasMore = true;
    },
    async fetchUserProfile(id) {
      const { data } = await usersAPI.getUser({ id });
      this.currentUser = data;
    },
    async loadMoreForTab(tab) {
      if (this.isLoading) return;
      const id = this.profileUserId;
      this.isLoading = true;
      try {
        if (tab === "tweets" && this.userTweetsHasMore) {
          const { data } = await usersAPI.getUserTweets({
            id,
            limit: TWEETS_PER_PAGE,
            offset: this.userTweetsOffset,
          });
          this.userTweets = [...this.userTweets, ...data];
          this.userTweetsOffset += data.length;
          if (data.length < TWEETS_PER_PAGE) {
            this.userTweetsHasMore = false;
          }
        } else if (tab === "comments" && this.userCommentsHasMore) {
          const { data } = await usersAPI.getUserRepliedTweets({
            id,
            limit: TWEETS_PER_PAGE,
            offset: this.userCommentsOffset,
          });
          const filtered = data.filter((item) => item.Tweet !== null);
          this.userComments = [...this.userComments, ...filtered];
          this.userCommentsOffset += data.length;
          if (data.length < TWEETS_PER_PAGE) {
            this.userCommentsHasMore = false;
          }
        } else if (tab === "likes" && this.userLikesHasMore) {
          const { data } = await usersAPI.getUserLikes({
            id,
            limit: TWEETS_PER_PAGE,
            offset: this.userLikesOffset,
          });
          this.userLikes = [...this.userLikes, ...data];
          this.userLikesOffset += data.length;
          if (data.length < TWEETS_PER_PAGE) {
            this.userLikesHasMore = false;
          }
        }
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "無法取得資料",
        });
      } finally {
        this.isLoading = false;
      }
    },
    setupObserver() {
      if (this.observer) {
        this.observer.disconnect();
      }
      this.observer = new IntersectionObserver(
        (entries) => {
          if (
            entries[0].isIntersecting &&
            this.hasMoreForCurrentTab &&
            !this.isLoading
          ) {
            this.loadMoreForTab(this.currentTab);
          }
        },
        { root: this.$refs.scrollContainer, rootMargin: "200px" }
      );
      if (this.$refs.sentinel) {
        this.observer.observe(this.$refs.sentinel);
      }
    },
  },

  async created() {
    const { id } = this.$route.params;
    this.profileUserId = id;
    try {
      await this.fetchUserProfile(id);
    } catch (error) {
      Toast.fire({ icon: "error", title: "無法取得使用者資料" });
    }
    await this.loadMoreForTab(this.currentTab);
    this.$nextTick(() => {
      this.setupObserver();
    });
  },

  mounted() {},

  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },

  beforeRouteUpdate(to, from, next) {
    const toId = to.params.id;
    const fromId = from.params.id;
    const toType = to.params.type || "tweets";

    if (toId !== fromId) {
      // 切換到不同使用者，重置所有狀態
      this.profileUserId = toId;
      this.resetPagination();
      this.fetchUserProfile(toId).catch(() => {
        Toast.fire({ icon: "error", title: "無法取得使用者資料" });
      });
      next();
      this.$nextTick(() => {
        this.loadMoreForTab(toType);
        this.setupObserver();
      });
    } else {
      // 同使用者不同 tab
      next();
      this.$nextTick(() => {
        const isEmpty =
          (toType === "tweets" && this.userTweets.length === 0) ||
          (toType === "comments" && this.userComments.length === 0) ||
          (toType === "likes" && this.userLikes.length === 0);
        if (isEmpty) {
          this.loadMoreForTab(toType);
        }
        this.setupObserver();
      });
    }
  },
};
</script>

<style scoped>
.UserSelfContainer {
  width: 100%;
  display: grid;
  height: 100vh;
  overflow: hidden;
}

.mainRow {
  display: contents;
}

#Navbar {
  justify-self: start;
  position: fixed;
  margin-left: 130px;
}

#PopularUsers {
  position: fixed;
  justify-self: end;
  margin-right: 130px;
  margin-top: 16px;
}

.UserSelfMain {
  width: 640px;
  margin-left: 332px;
  border-left: 1px solid #e6ecf0;
  border-right: 1px solid #e6ecf0;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.userContentScroll {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.sticky-profile-header {
  flex-shrink: 0;
  background: #fff;
  z-index: 10;
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

.sentinel {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-text,
.no-more-text {
  font-size: 13px;
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
    --bell-right-offset: max(0px, calc((100vw - 968px) / 2));
  }
  #PopularUsers {
    display: none;
  }
  .UserSelfMain {
    flex: 1;
    max-width: 900px;
    margin-left: 0;
    width: auto;
    height: 100vh;
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
    height: 100vh;
  }
  .userContentScroll {
    padding-bottom: 70px;
  }
}
</style>

