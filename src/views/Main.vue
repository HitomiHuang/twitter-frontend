<template>
  <div class="Main">
    <div class="mainRow">
      <Navbar id="Navbar" />
      <div class="mainSection">
        <div class="mainSectionContent">
          <div class="mainTitle">
            <h1>首頁</h1>
          </div>
          <MainPostTweet :currentUser="currentUser" />
          <AllTweets :initialCurrentTweets="currentTweets" />
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
    };
  },
  computed: {
    ...mapState(["currentUser", "token"]),
  },
  methods: {
    async fetchData() {
      try {
        const { data } = await tweetsAPI.getTweets();

        this.currentTweets = data;
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "推文取得失敗",
        });
      }
    },
  },
  created() {
    this.fetchData();
  },
};
</script>

<style scoped>
.Main {
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
  /* width: 178px; */
}

#PopularUsers {
  position: fixed;
  justify-self: end;
  margin-right: 130px;
  margin-top: 16px;
  /* width: 273px; */
}

.mainSection {
  width: 640px;
  margin-left: 332px;
}

.mainSectionContent {
  border-left: 1px solid #e6ecf0;
  border-right: 1px solid #e6ecf0;
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
  .mainSection {
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
  .mainSection {
    margin-left: 0;
    width: 100%;
    padding-bottom: 70px;
  }
}
</style>