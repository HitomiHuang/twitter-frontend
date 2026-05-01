<template>
  <div class="userCard">
    <img
      class="userBackgroundImage"
      :src="currentUser.cover | emptyCover"
      width="639px"
      height="200px"
      alt=""
    />
    <img
      class="userImage"
      :src="currentUser.avatar | emptyImage"
      width="140px"
      height="140px"
      alt=""
    />
    <div class="buttons">
      <router-link class="mailBorder" to="/#">
        <img class="mail" src="../assets/mail.png" alt="" />
      </router-link>
      <div class="bellBorder" v-if="false">
        <img class="bell" src="../assets/bell.png" alt="" />
      </div>
      <div class="bellActiveBorder" v-else>
        <img class="bellActive" src="../assets/bell-active.png" alt="" />
      </div>
      <button
        :disabled="isProcessing"
        @click.stop.prevent="deleteFollowing(currentUser.id)"
        class="otherUserFollowedBtn"
        v-if="currentUser.isFollowed"
      >
        正在跟隨
      </button>
      <button
        :disabled="isProcessing"
        @click.stop.prevent="addFollowing(currentUser.id)"
        class="otherUserFollowBtn"
        v-else
      >
        跟隨
      </button>
    </div>

    <div class="userInformation">
      <p class="userName">{{ currentUser.name }}</p>
      <p class="userAccount">@{{ currentUser.account }}</p>
      <p class="userDescription">
        {{ currentUser.introduction }}
      </p>
      <router-link
        class="userFollowingsCount"
        :to="{ name: 'user-followings', params: { id: currentUser.id } }"
        >{{ currentUser.Followings }}&nbsp;個<span>跟隨中</span></router-link
      >
      <router-link
        class="userFollowersCount"
        :to="{ name: 'user-followers', params: { id: currentUser.id } }"
        >{{ currentUser.Followers }}&nbsp;個<span>跟隨者</span></router-link
      >
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
      isProcessing: false,
      currentUser: this.initialCurrentUser,
    };
  },
  props: {
    initialCurrentUser: {
      type: Object,
      required: true,
    },
  },
  watch: {
    initialCurrentUser(newValue) {
      this.currentUser = {
        ...this.currentUser,
        ...newValue,
      };
    },
  },
  methods: {
    async addFollowing(id) {
      try {
        this.isProcessing = true;
        await usersAPI.addFollowing({ id });

        this.currentUser.isFollowed = true;

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

        this.currentUser.isFollowed = false;

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
};
</script>


<style scoped>
.userCard {
  min-height: 375px;
  /* border: 1px solid black; */
  position: relative;
  margin-bottom: 31px;
}

.userBackgroundImage {
  object-fit: cover;
}

.userImage {
  position: absolute;
  top: 124px;
  left: 14px;
  z-index: 10;
  border-radius: 50%;
  border: 4px solid #ffffff;
  object-fit: cover;
}

.userEdit {
  position: absolute;
  right: 30px;
  top: 220px;
  border: 1px solid #ff6600;
  border-radius: 50px;
  color: #ff6600;
  font-size: 16px;
  padding: 8px 16px;
  background: #ffffff;
}

.userInformation {
  margin-top: 16px;
  margin-left: 16px;
}

.userName {
  font-weight: 700;
  line-height: 26px;
  font-size: 18px;
}

.userAccount {
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #6c757d;
}

.userDescription {
  margin-top: 6px;
  font-size: 14px;
  line-height: 22px;
  margin-bottom: 8px;
  min-height: 22px;
}

.userFollowersCount,
.userFollowingsCount {
  text-decoration: none;
  color: black;
  font-size: 14px;
  margin-right: 20px;
}

.userFollowingsCount {
  margin-right: 20px;
}

span {
  color: #6c757d;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  margin-right: 17px;
}

.mailBorder,
.bellBorder,
.bellActiveBorder {
  width: 40px;
  height: 40px;
  border: 1px solid #ff6600;
  border-radius: 50%;
  position: relative;
  margin-right: 16px;
  cursor: pointer;
}

.mail {
  width: 20px;
  height: 18px;
  position: absolute;
  top: 11px;
  left: 9px;
}

.bell,
.bellActive {
  width: 24px;
  height: 24px;
  position: absolute;
  top: 7px;
  left: 8px;
}

.bellActiveBorder {
  background-color: #ff6600;
}

.otherUserFollowedBtn {
  width: 96px;
  height: 40px;
  border-radius: 50px;
  border: 0;
  background-color: #ff6600;
  color: #fff;
  font-size: 16px;
  font-weight: 400;
}

.otherUserFollowBtn {
  width: 64px;
  height: 40px;
  border-radius: 50px;
  border: 1px solid #ff6600;
  background-color: #fff;
  color: #ff6600;
  font-size: 16px;
  font-weight: 400;
}

.otherUserFollowedBtn:hover,
.otherUserFollowBtn:hover {
  cursor: pointer;
}
</style>