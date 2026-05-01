<template>
  <div class="Main">
    <div class="mainRow">
      <Navbar id="Navbar" />
      <div class="mainSection">
        <div class="sticky-header">
          <div class="mainTitle">
            <h1>首頁</h1>
          </div>
          <MainPostTweet :currentUser="currentUser" />
        </div>
        <div ref="scrollContainer" class="mainSectionContent">
          <AllTweets :initialCurrentTweets="currentTweets" />
          <div ref="sentinel" class="sentinel">
            <span v-if="isLoading" class="loading-text">載入中...</span>
            <span v-else-if="!hasMore" class="no-more-text"
              >沒有更多推文了</span
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
import MainPostTweet from "../components/MainPostTweet.vue";
import AllTweets from "../components/AllTweets.vue";
import PopularUsers from "../components/PopularUsers.vue";
import { mapState } from "vuex";
import tweetsAPI from "../apis/tweets";
import { Toast } from "../utility/helpers";

const TWEETS_PER_PAGE = 10;

export default {
  components: {
    Navbar,
    MainPostTweet,
    AllTweets,
    PopularUsers,
  },
  data() {
    return {
      currentTweets: [],
      offset: 0,
      isLoading: false,
      hasMore: true,
      observer: null,
    };
  },
  computed: {
    ...mapState(["currentUser", "token"]),
  },
  methods: {
    async fetchTweets(offset) {
      if (this.isLoading || !this.hasMore) return;
      this.isLoading = true;
      try {
        const { data } = await tweetsAPI.getTweets({
          limit: TWEETS_PER_PAGE,
          offset,
        });
        if (offset === 0) {
          this.currentTweets = data;
        } else {
          this.currentTweets = [...this.currentTweets, ...data];
        }
        this.offset = offset + data.length;
        if (data.length < TWEETS_PER_PAGE) {
          this.hasMore = false;
        }
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "推文取得失敗",
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
          if (entries[0].isIntersecting && this.hasMore && !this.isLoading) {
            this.fetchTweets(this.offset);
          }
        },
        { root: this.$refs.scrollContainer, rootMargin: "200px" }
      );
      if (this.$refs.sentinel) {
        this.observer.observe(this.$refs.sentinel);
      }
    },
  },
  mounted() {
    // observer 在首次資料載入後才設定，避免 race condition
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  async created() {
    await this.fetchTweets(0);
    this.$nextTick(() => {
      this.setupObserver();
    });
  },
};
</script>

<style scoped>
.Main {
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

.mainSection {
  width: 640px;
  margin-left: 332px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #e6ecf0;
  border-right: 1px solid #e6ecf0;
}

.mainSectionContent {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.sticky-header {
  background: #fff;
  flex-shrink: 0;
}

.mainTitle {
  width: 100%;
  height: 74px;
  border-bottom: 1px solid #e6ecf0;
  padding: 24px 23px;
  font-size: 24px;
  font-weight: 700;
  color: #1c1c1c;
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
  .mainSection {
    flex: 1;
    max-width: 900px;
    min-width: 425px;
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
  .mainSection {
    margin-left: 0;
    width: 100%;
    height: 100vh;
  }
  .MainPostTweet {
    display: none;
  }
  .mainSectionContent {
    padding-bottom: 70px;
  }
}
</style>