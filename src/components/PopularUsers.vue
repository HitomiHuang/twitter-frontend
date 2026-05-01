<template>
  <div class="PopularUsers">
    <h1 class="popularUsersTitle">跟隨誰</h1>
    <div class="popularUser" v-for="user in popularUsers" :key="user.id">
      <router-link :to="{ name: 'user-other', params: { id: user.id , type: 'tweets' } }">
        <img :src="user.avatar | emptyImage" class="popularUsersImage" alt="" />
      </router-link>
      <div class="popularUsersNameGroup">
        <router-link
          :to="{ name: 'user-other', params: { id: user.id , type: 'tweets' } }"
          class="popularUsersName"
          >{{ user | nameIsTooLong }}</router-link
        >
        <router-link
          :to="{ name: 'user-other', params: { id: user.id , type: 'tweets' } }"
          class="popularUsersAccount"
          >@{{ user | accountIsTooLong }}</router-link
        >
      </div>
      <button
        :disabled="isProcessing"
        @click.stop.prevent="deleteFollowing(user.id)"
        class="popularUsersFollowedBtn"
        v-if="user.isFollowed"
      >
        正在跟隨
      </button>
      <button
        :disabled="isProcessing"
        @click.stop.prevent="addFollowing(user.id)"
        class="popularUsersFollowBtn"
        v-else
      >
        跟隨
      </button>
    </div>
  </div>
</template>

<script>
import usersAPI from "../apis/users";
import { Toast } from "../utility/helpers";
import { emptyImageFilter } from "../utility/mixins";

export default {
  mixins: [emptyImageFilter],
  data() {
    return {
      popularUsers: [],
      isProcessing: false,
    };
  },
  methods: {
    async fetchData() {
      try {
        const { data } = await usersAPI.getTopUsers();
        this.popularUsers = data;
        this.popularUsers = this.popularUsers.filter((item) => item.id !== this.$store.state.currentUser.id).slice(0, 8)
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "無法取得熱門使用者",
        });
      }
    },
    async addFollowing(id) {
      try {
        this.isProcessing = true;
        await usersAPI.addFollowing({ id });

        const user = this.popularUsers.find((item) => item.id === id);

        user.isFollowed = true;

        Toast.fire({
          icon: "success",
          title: "跟隨成功",
        });
        this.isProcessing = false;
      } catch (error) {
        this.isProcessing = false;
        Toast.fire({
          icon: "error",
          title: "跟隨失敗",
        });
      }
    },
    async deleteFollowing(id) {
      try {
        this.isProcessing = true;
        await usersAPI.deleteFollowing({ id });

        const user = this.popularUsers.find((item) => item.id === id);

        user.isFollowed = false;

        Toast.fire({
          icon: "success",
          title: "取消跟隨成功",
        });
        this.isProcessing = false;
      } catch (error) {
        this.isProcessing = false;
        Toast.fire({
          icon: "error",
          title: "取消跟隨失敗",
        });
      }
    },
  },
  created() {
    this.fetchData();
  },
  filters: {
    nameIsTooLong(User) {
      if (User.isFollowed) {
        if (User.name.length > 5) {
          return User.name.substr(0, 4) + "...";
        }
      }
      if (!User.isFollowed) {
        if (User.name.length > 7) {
          return User.name.substr(0, 6) + "...";
        }
      }
      return User.name;
    },
    accountIsTooLong(User) {
      if (User.isFollowed) {
        if (User.account.length > 7) {
          return User.account.substr(0, 6) + "...";
        }
      }
      if (!User.isFollowed) {
        if (User.account.length > 10) {
          return User.account.substr(0, 9) + "...";
        }
      }
      return User.account;
    },
  },
};
</script>

<style scoped>
.PopularUsers {
  width: 273px;
  height: 731px;
  border-radius: 16px;
  background-color: #f5f8fa;
  z-index: 50;
}

.popularUsersTitle {
  width: 100%;
  height: 74px;
  padding: 24px;
  font-size: 24px;
  font-weight: 700;
  border-bottom: 1px solid #e6ecf0;
}
.popularUser {
  width: 100%;
  height: 82px;
  display: flex;
  align-items: center;
  padding: 16px;
  position: relative;
}

.popularUsersImage {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
  background-color: #fff;
}

.popularUsersNameGroup {
  display: flex;
  flex-direction: column;
  margin-left: 8px;
}

.popularUsersName {
  font-size: 16px;
  font-weight: 700;
  color: #171725;
  text-decoration: none;
}

.popularUsersAccount {
  font-size: 14px;
  font-weight: 500;
  color: #92929d;
  text-decoration: none;
}

.popularUsersFollowedBtn {
  width: 96px;
  height: 40px;
  border-radius: 50px;
  border: 0;
  background-color: #ff6600;
  color: #fff;
  font-size: 16px;
  font-weight: 400;
}

.popularUsersFollowBtn {
  width: 64px;
  height: 40px;
  border-radius: 50px;
  border: 1px solid #ff6600;
  background-color: #f5f8fa;
  color: #ff6600;
  font-size: 16px;
  font-weight: 400;
}

.popularUsersFollowedBtn,
.popularUsersFollowBtn {
  position: absolute;
  right: 15px;
}

.popularUsersFollowedBtn:hover,
.popularUsersFollowBtn:hover {
  cursor: pointer;
}

.popularUsersFollowedBtn:disabled:hover,
.popularUsersFollowBtn:disabled:hover {
  cursor: wait;
}
</style>