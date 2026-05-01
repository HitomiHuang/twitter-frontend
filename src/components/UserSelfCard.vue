<template>
  <div class="userCard">
    <img
      class="userBackgroundImage"
      :src="initialCurrentUser.cover | emptyCover"
      width="600px"
      height="200px"
      alt=""
    />
    <img
      class="userImage"
      :src="initialCurrentUser.avatar | emptyImage"
      width="140px"
      height="140px"
      alt=""
    />
    <button class="userEdit" @click.stop.prevent="openUserEditModal">
      編輯個人資料
    </button>
    <!-- modal -->
    <div id="userEditModal" v-show="userEditModalIsOpen">
      <form @submit.stop.prevent="userEditModalSave" id="userEditModalWrapper">
        <div class="editHeader">
          <button
            class="closeUserEditModalBtn"
            @click.stop.prevent="closeUserEditModal"
          >
            ✖
          </button>
          <p class="title">編輯個人資料</p>
          <button :disabled="isProcessing" type="submit" class="save" >
            儲存
          </button>
        </div>
        <div class="userEditModalContent">
          <div class="backgroundImageGroup">
            <img
              :src="userEditModalCover | emptyCover"
              class="modalBackgroundImage"
              alt=""
            />
            <label for="modalCoverInput">
              <img src="../assets/camera.png" class="backgroundCamera" alt="" />
              <input
                @change="handleCoverChange"
                type="file"
                name="cover"
                id="modalCoverInput"
              />
            </label>
            <img
              @click.stop.prevent="recoverDefaultCover"
              src="../assets/x.png"
              class="backgroundX"
              alt=""
            />
          </div>
          <div class="userImageGroup">
            <img class="modalUserImage" :src="userEditModalAvatar | emptyImage" alt="" />
            <label for="modalImageInput">
              <input
                @change="handleAvatarChange"
                type="file"
                name="avatar"
                id="modalImageInput"
              />
              <img src="../assets/camera.png" class="userCamera" alt="" />
            </label>
          </div>
          <div class="inputName">
            <label for="modalName" class="formLabel">名稱</label>
            <input
              type="text"
              name="name"
              class="formInput"
              :class="{
                error:
                  userEditModalName.length > 50 ||
                  userEditModalName.length === 0,
              }"
              id="modalName"
              v-model="userEditModalName"
              required
            />
            <div class="nameReminder">
              <p v-if="userEditModalName.length > 50" class="errorText">
                字數超出上限
              </p>
              <p v-if="userEditModalName.length === 0" class="errorText">
                不可為空白
              </p>
              <span class="nameLength">{{ userEditModalName.length }}/50</span>
            </div>
          </div>
          <div class="inputDescription">
            <label for="modalDescription" class="formLabel">自我介紹</label>
            <textarea
              v-model="userEditModalIntroduction"
              rows="4"
              name="introduction"
              class="formInput formInputDes"
              :class="{
                error: userEditModalIntroduction.length > 160,
              }"
              id="modalDescription"
            />
            <div class="descriptionReminder">
              <p
                v-if="userEditModalIntroduction.length > 160"
                class="errorText"
              >
                字數超出上限
              </p>
              <span class="descriptionLength"
                >{{ userEditModalIntroduction.length }}/160</span
              >
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="userInformation">
      <p class="userName">{{ initialCurrentUser.name }}</p>
      <p class="userAccount">@{{ initialCurrentUser.account }}</p>
      <p class="userDescription">
        {{ initialCurrentUser.introduction }}
      </p>
      <router-link
        class="userFollowingsCount"
        :to="{ name: 'user-followings', params: { id: initialCurrentUser.id } }"
        >{{ initialCurrentUser.Followings }}&nbsp;個<span>跟隨中</span></router-link
      >
      <router-link
        class="userFollowersCount"
        :to="{ name: 'user-followers', params: { id: initialCurrentUser.id } }"
        >{{ initialCurrentUser.Followers }}&nbsp;個<span>跟隨者</span></router-link
      >
    </div>
  </div>
</template>

<script>
import usersAPI from "../apis/users";
import { Toast } from "../utility/helpers";
import { emptyImageFilter
 } from "../utility/mixins";
export default {
  mixins: [emptyImageFilter],
  props: {
    initialCurrentUser: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      nameErrorMessage: "",
      descriptionErrorMessage: "",
      userEditModalIsOpen: false,
      userEditModalName: "",
      userEditModalIntroduction: "",
      userEditModalCover: "",
      userEditModalAvatar: "",
      isProcessing: false
    };
  },
  methods: {
    fetchData() {
      this.userEditModalName = this.initialCurrentUser.name;
      this.userEditModalIntroduction = this.initialCurrentUser.introduction? this.initialCurrentUser.introduction : ''
      this.userEditModalCover = this.initialCurrentUser.cover;
      this.userEditModalAvatar = this.initialCurrentUser.avatar;
    },
    openUserEditModal() {
      this.userEditModalIsOpen = true;
      this.fetchData()
    },
    closeUserEditModal() {
      this.postTweetModalErrorMessage = "";
      this.userEditModalIsOpen = false;
    },
    async userEditModalSave(e) {
      try {
        if (!this.userEditModalName.trim()) {
          this.nameErrorMessage = "名稱不可留白";
          return;
        } else if (this.userEditModalName.length > 50) {
          this.nameErrorMessage = "名稱字數超過50字";
          return;
        }
        if (this.userEditModalIntroduction.length > 160) {
          this.descriptionErrorMessage = "自我介紹超過160字";
          return;
        }

        this.isProcessing = true

        const form = e.target
        const formData = new FormData(form)

        const {data} = await usersAPI.editUser({
          id: this.initialCurrentUser.id,
          data: formData,
        });

        
        localStorage.setItem("token", data.token);

        this.$store.commit("setCurrentUser", data.token);
        this.$store.commit("setToken");

        this.userEditModalIsOpen = false;
        this.isProcessing = false
        this.$router.go(0);
      } catch (error) {
        this.isProcessing = false
        Toast.fire({
          icon: "error",
          title: "無法保存使用者資訊",
        });
      }
    },
    handleAvatarChange(e) {
      const { files } = e.target;

      if (files.length === 0) {
        // 使用者沒有選擇上傳的檔案
        this.userEditModalAvatar = "";
      } else {
        // 否則產生預覽圖
        const imageURL = window.URL.createObjectURL(files[0]);
        this.userEditModalAvatar = imageURL;
      }
    },
    handleCoverChange(e) {
      const { files } = e.target;

      if (files.length === 0) {
        // 使用者沒有選擇上傳的檔案
        this.userEditModalCover = "";
      } else {
        // 否則產生預覽圖
        const imageURL = window.URL.createObjectURL(files[0]);
        this.userEditModalCover = imageURL;
      }
    },
    recoverDefaultCover() {
      this.userEditModalCover = this.initialCurrentUser.cover;
    },
  },
  watch: {
    initialCurrentUser() {
      this.fetchData();
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
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.userImage {
  position: absolute;
  top: 124px;
  left: 14px;
  z-index: 10;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #ffffff;
  background-color: #fff;
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
  cursor: pointer;
}

.userInformation {
  margin-top: 72px;
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
  word-break: break-all;
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
span {
  color: #6c757d;
}

#userEditModal {
  position: fixed;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
}

#userEditModalWrapper {
  width: 634px;
  height: 610px;
  background-color: #fff;
  margin: 56px auto;
  border-radius: 14px;
}

.editHeader {
  width: 100%;
  height: 57px;
  display: flex;
  border-bottom: 1px solid #e6ecf0;
}

.closeUserEditModalBtn {
  height: 15px;
  width: 15px;
  margin-top: 20.5px;
  margin-left: 19.5px;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ff6600;
  border: 0;
  background-color: #fff;
}

.closeUserEditModalBtn:hover,
.save:hover {
  cursor: pointer;
}

.title {
  margin-left: 36.5px;
  margin-top: 15px;
  font-weight: 700;
  font-size: 18px;
  line-height: 26px;
  color: #1c1c1c;
}

.save {
  width: 64px;
  height: 40px;
  margin-left: 375px;
  margin-top: 8px;
  background: #ff6600;
  border-radius: 50px;
  border: none;
  color: #ffffff;
  font-size: 16px;
  line-height: 24px;
}

.save:disabled:hover {
  cursor: wait;
}

.userEditModalContent {
  position: relative;
}

.backgroundImageGroup {
  position: relative;
  background-color: #444444;
  width: 100%;
  height: 200px;
}

.modalBackgroundImage {
  width: 100%;
  height: 200px;
  object-fit: cover;
  opacity: 0.5;
}

.backgroundCamera {
  position: absolute;
  top: 90px;
  left: 279px;
  width: 21px;
  height: 20px;
  z-index: 10;
}

.backgroundX {
  position: absolute;
  top: 92.5px;
  left: 335px;
  width: 15px;
  height: 15px;
  z-index: 10;
}

.backgroundCamera:hover,
.backgroundX:hover {
  cursor: pointer;
}

.userImageGroup {
  position: absolute;
  top: 124px;
  left: 14px;
  background-color: #555555;
  border-radius: 50%;
  width: 140px;
  height: 140px;
  border: 4px solid #ffffff;
}

.modalUserImage {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 10;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  opacity: 0.5;
  background-color: #fff;
}

.userCamera {
  position: absolute;
  top: 56px;
  left: 56px;
  width: 21px;
  height: 20px;
  z-index: 20;
}

.userCamera:hover {
  cursor: pointer;
}

.inputName,
.inputDescription {
  width: 602px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
}

.inputName {
  margin-top: 80px;
}

.inputDescription {
  margin-top: 32px;
  min-height: 22px;
}

.formLabel {
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #696974;
  padding-top: 2px;
  padding-left: 10px;
  background-color: #f5f8fa;
}

.formInput {
  border: 0;
  background-color: #f5f8fa;
  width: 100%;
  line-height: 26px;
  padding: 0 10px 2px;
  font-size: 16px;
  border-bottom: 2px solid #657786;
  font-weight: 400;
}

.formInputDes {
  padding-bottom: 15px;
  resize: none;
}

.formInput:focus,
.formInput:hover {
  outline: 0;
  border-bottom: 2px solid #50b5ff;
}

.formInput.error {
  border-bottom: 2px solid #fc5a5a;
}

.errorMessage {
  position: absolute;
  width: 100%;
  top: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  font-weight: 500;
  color: #657786;
}

.nameReminder,
.descriptionReminder {
  position: relative;
}

.errorText {
  color: #fc5a5a;
  position: absolute;
  left: 0;
  top: 4px;
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
}

.nameLength,
.descriptionLength {
  position: absolute;
  right: 0;
  top: 4px;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
}

#modalCoverInput,
#modalImageInput {
  display: none;
}
</style>