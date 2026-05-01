<template>
  <div class="AdminUsers">
    <AdminNavbar id="AdminNavbar" />
    <div class="adminUsersSection">
      <div class="adminUsersSectionContent">
        <div class="adminUsersTitle">
          <h1 class="adminUsersTitleText">使用者列表</h1>
        </div>
        <div class="adminUsersTable">
          <AdminUser v-for="user in users" :key="user.id" :user="user" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminNavbar from "../components/AdminNavbar.vue";
import AdminUser from '../components/AdminUser.vue'
import adminAPI from '../apis/admin'
import { Toast } from "../utility/helpers";

export default {
  components: {
    AdminNavbar,
    AdminUser
  },
  data() {
    return {
      users: [],
    }
  },
  methods: {
    async fetchData() {
      try {
        const {data} = await adminAPI.getUsers()

        this.users = data
      }
      catch(error) {
        Toast.fire({
          icon: 'error',
          title: '無法取得使用者列表'
        })
      }
    }
  },
  created() {
    this.fetchData()
  }
};
</script>

<style scoped>
.AdminUsers {
  width: 100%;
  display: grid;
}

#AdminNavbar {
  justify-self: start;
  position: fixed;
  margin-left: 130px;
}

.adminUsersSection {
  width: 1068px;
  margin-left: 332px;
}

.adminUsersSectionContent {
  width: 100%;
  border-left: 1px solid #e6ecf0;
  border-right: 1px solid #e6ecf0;
}

.adminUsersTitle {
  width: 100%;
  height: 74px;
  border-bottom: 1px solid #E6ECF0;
  padding: 24px 23px;
  font-size: 24px;
  font-weight: 700;
  color: #1c1c1c;
}

.adminUsersTable {
  padding: 16px 8px 16px 15px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-auto-rows: 314px;
  grid-gap: 16px;
}

</style>