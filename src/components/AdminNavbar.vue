<template>
  <div class="AdminNavbar">
    <router-link to="/admin/tweets">
      <img
        class="adminNavbarLogo"
        src="../assets/Icon.png"
        width="50px"
        height="50px"
        alt=""
      />
    </router-link>
    <div class="adminNavLinkGroup">
      <img
        class="adminNavLinkIcon"
        src="../assets/home-active.png"
        v-if="$route.path === '/admin/tweets'"
        alt=""
      />
      <img class="adminNavLinkIcon" src="../assets/home.png" v-else alt="" />
      <router-link class="adminNavLinkText" to="/admin/tweets">
        推文清單
      </router-link>
    </div>
    <div class="adminNavLinkGroup">
      <img
        class="adminNavLinkIcon"
        src="../assets/selfInfo-active.png"
        v-if="$route.path === '/admin/users'"
        alt=""
      />
      <img
        class="adminNavLinkIcon"
        src="../assets/selfInfo.png"
        v-else
        alt=""
      />
      <router-link class="adminNavLinkText" to="/admin/users">
        使用者列表
      </router-link>
    </div>
    <div class="adminNavLinkGroup adminNavLogoutLinkGroup">
      <img class="adminNavLinkIcon" src="../assets/logout.png" alt="" />
      <button @click.stop.prevent="logout" class="adminNavLogoutBtn">
        登出
      </button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.commit("revokeAuthentication");
    },
  },
};
</script>


<style scoped>
.AdminNavbar {
  background-color: #fff;
  width: 178px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.adminNavbarLogo {
  margin-top: 13px;
  margin-left: 13px;
  margin-bottom: 13px;
  width: 40px;
  height: 40px;
}

.adminNavLinkGroup {
  width: 100%;
  height: 58px;
  padding-left: 18px;
  display: flex;
  align-items: center;
}

.adminNavLinkIcon {
  margin-right: 17px;
}

.adminNavLinkText {
  font-size: 18px;
  font-weight: 700;
  text-decoration: none;
  color: #44444f;
}

.adminNavLinkText.active {
  color: #ff6600;
}

.adminNavLogoutBtn {
  font-size: 18px;
  font-weight: 700;
  border: 0;
  background-color: #fff;
  color: #44444f;
}

.adminNavLogoutBtn:hover {
  cursor: pointer;
}

.adminNavLogoutLinkGroup {
  position: absolute;
  bottom: 0px;
}

/* ── Tablet (≤ 1399px): icon-only sidebar ── */
@media (max-width: 1399px) {
  .AdminNavbar {
    width: 68px;
  }
  .adminNavLinkGroup {
    position: relative;
    padding-left: 0;
    justify-content: center;
  }
  .adminNavLinkText {
    position: absolute;
    inset: 0;
    font-size: 0;
  }
  .adminNavLinkIcon {
    margin-right: 0;
  }
  .adminNavLogoutBtn {
    display: none;
  }
  .adminNavLogoutLinkGroup {
    justify-content: center;
    padding-left: 0;
  }
}

/* ── Mobile (≤ 767px): fixed bottom horizontal bar ── */
@media (max-width: 767px) {
  .AdminNavbar {
    width: 100%;
    height: 58px;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid #e6ecf0;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
  }
  .adminNavbarLogo {
    display: none;
  }
  .adminNavLinkGroup {
    position: relative;
    height: 100%;
    padding: 0 8px;
    width: auto;
    justify-content: center;
    align-items: center;
  }
  .adminNavLinkText {
    position: absolute;
    inset: 0;
    font-size: 0;
  }
  .adminNavLinkIcon {
    margin-right: 0;
  }
  .adminNavLogoutBtn {
    display: none;
  }
  .adminNavLogoutLinkGroup {
    position: static;
    justify-content: center;
    padding-left: 0;
  }
}
</style>