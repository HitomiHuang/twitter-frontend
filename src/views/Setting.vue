<template>
  <div class="Setting">
    <Navbar id="Navbar" />
    <div class="settingSection">
      <div class="settingSectionContent">
        <div class="settingTitle">
          <h1 class="settingTitleText">帳戶設定</h1>
        </div>

        <form @submit.stop.prevent="submitForm" class="settingForm">
          <div class="labelInputGroup">
            <label for="account" class="formLabel">帳號</label>
            <input
              v-model="account"
              type="text"
              name="account"
              class="formInput"
              :class="{ error: account.length > 50 }"
              id="account"
              required
            />
            <div class="errorMessage" v-if="account.length > 50">
              <p class="errorText">字數超出上限!</p>
              <p>{{ account.length }}/50</p>
            </div>
          </div>
          <div class="labelInputGroup">
            <label for="name" class="formLabel">名稱</label>
            <input
              v-model="name"
              type="text"
              name="name"
              class="formInput"
              :class="{ error: name.length > 50 }"
              id="name"
              required
            />
            <div class="errorMessage" v-if="name.length > 50">
              <p class="errorText">字數超出上限!</p>
              <p>{{ name.length }}/50</p>
            </div>
          </div>
          <div class="labelInputGroup">
            <label for="email" class="formLabel">Email</label>
            <input
              v-model="email"
              type="email"
              name="email"
              class="formInput"
              id="email"
              required
            />
          </div>
          <div class="labelInputGroup">
            <label for="password" class="formLabel">密碼</label>
            <input
              v-model="password"
              type="password"
              name="password"
              class="formInput"
              id="password"
              placeholder="請填寫想要更改的密碼"
              required
            />
          </div>

          <div class="labelInputGroup">
            <label for="password" class="formLabel">密碼確認</label>
            <input
              v-model="passwordCheck"
              type="password"
              name="passwordCheck"
              class="formInput"
              id="passwordCheck"
              placeholder="請再輸入一次密碼"
              required
            />
          </div>
          <button
            :disabled="isProcessing"
            type="submit"
            class="settingFormSubmitBtn"
          >
            儲存
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import { mapState } from "vuex";
import usersAPI from "../apis/users";
import { Toast } from "../utility/helpers";

export default {
  components: {
    Navbar,
  },
  data() {
    return {
      account: "",
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
      isProcessing: false,
    };
  },
  computed: {
    ...mapState(["currentUser"]),
  },
  methods: {
    fetchData() {
      this.account = this.currentUser.account;
      this.name = this.currentUser.name;
      this.email = this.currentUser.email;
    },
    async submitForm() {
      try {
        if (
          !this.account.trim() ||
          !this.name.trim() ||
          !this.email.trim() ||
          !this.password.trim() ||
          !this.passwordCheck.trim()
        ) {
          Toast.fire({
            icon: "warning",
            title: "請確實填寫全部欄位",
          });
          return;
        } else if (this.account.length > 50) {
          Toast.fire({
            icon: "warning",
            title: "帳號不可超過50字",
          });
          return;
        } else if (this.name.length > 50) {
          Toast.fire({
            icon: "warning",
            title: "名稱不可超過50字",
          });
          return;
        } else if (this.password !== this.passwordCheck) {
          Toast.fire({
            icon: "error",
            title: "密碼與密碼確認欄位不相符",
          });
          return;
        }

        this.isProcessing = true;

        const {data} = await usersAPI.editUser({
          id: this.currentUser.id,
          data: {
            account: this.account,
            name: this.name,
            email: this.email,
            password: this.password,
            checkPassword: this.passwordCheck
          },
        });

        localStorage.setItem("token", data.token);

        this.$store.commit("setCurrentUser", data.token);
        this.$store.commit("setToken");


        Toast.fire({
          icon: "success",
          title: "使用者資料更改成功",
        });

        this.isProcessing = false;
      } catch (error) {
        this.isProcessing = false;
        Toast.fire({
          icon: "error",
          title: "無法更改使用者資料",
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
.Setting {
  width: 100%;
  height: 100vh;
  display: grid;
}

#Navbar {
  justify-self: start;
  position: fixed;
  margin-left: 130px;
}

.settingSection {
  width: 1068px;
  margin-left: 332px;
}

.settingSectionContent {
  width: 100%;
  height: 100%;
  border-left: 1px solid #e6ecf0;
}

.settingTitle {
  width: 100%;
  height: 74px;
  border-bottom: 1px solid #e6ecf0;
  padding: 24px 23px;
  font-size: 24px;
  font-weight: 700;
  color: #1c1c1c;
}

.settingForm {
  padding: 30px 16px;
}

.labelInputGroup {
  background-color: #f5f8fa;
  width: 642px;
  height: 52px;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.formLabel {
  font-size: 15px;
  font-weight: 500;
  color: #657786;
  margin-top: 5px;
  margin-left: 10px;
}

.formInput {
  border: 0;
  background-color: #f5f8fa;
  width: 100%;
  height: 30px;
  padding: 0 10px;
  line-height: 30;
  font-size: 15px;
  border-bottom: 2px solid #657786;
  font-size: 19px;
  font-weight: 500;
}

.formInput::placeholder {
  color: #b5b5be;
  font-size: 14px;
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

.errorText {
  color: #fc5a5a;
}

.settingFormSubmitBtn {
  width: 116px;
  height: 46px;
  border: 0;
  border-radius: 50px;
  background-color: #ff6600;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  margin-left: 526px;
}

.settingFormSubmitBtn:hover {
  cursor: pointer;
}

.settingFormSubmitBtn:disabled:hover {
  cursor: wait;
}
</style>