<template>
  <div class="SignIn">
    <form @submit.stop.prevent="handleSubmit">
      <img
        class="logo"
        src="../assets/Icon.png"
        height="40px"
        width="40px"
        alt=""
      />
      <h1 class="title">後台登入</h1>
      <div class="labelInputGroup">
        <label for="account" class="formLabel">帳號</label>
        <input
          v-model="account"
          type="text"
          name="account"
          class="formInput"
          :class="{ error: (!isFirstTry && !account) || account.length > 50 }"
          id="account"
          placeholder="請輸入帳號"
          required
        />
        <div
          class="errorMessage"
          v-if="account.length === 0 || account.length > 50"
        >
          <p class="errorText" v-if="account.length === 0">
            {{ errorMessage }}
          </p>
          <p class="errorText" v-if="account.length > 50">字數超出上限!</p>
          <p class="wordsCount" v-if="account.length > 50">
            {{ account.length }}/50
          </p>
        </div>
      </div>
      <div class="labelInputGroup">
        <label for="password" class="formLabel">密碼</label>
        <input
          v-model="password"
          type="password"
          name="password"
          class="formInput"
          :class="{ error: (!isFirstTry && !password) || password.length > 50 }"
          id="password"
          placeholder="請輸入密碼"
          required
        />
      </div>
      <button :disabled="isProcessing" type="submit" class="signInBtn">
        登入
      </button>
      <div class="linkGroup">
        <router-link :is="isProcessing ? 'span' : 'router-link'" class="link" to="/signin">前台登入</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import adminAPI from "../apis/admin.js";
import { Toast } from "../utility/helpers";

export default {
  data() {
    return {
      account: "",
      password: "",
      isFirstTry: true,
      errorMessage: "",
      isProcessing: false,
    };
  },
  methods: {
    async handleSubmit() {
      try {
        this.isProcessing = true;

        if (!this.account | !this.password) {
          this.isProcessing = false;
          Toast.fire({
            icon: "warning",
            title: "請輸入帳號密碼",
          });
          return;
        }

        if (this.account.length > 50) {
          this.isProcessing = false;
          Toast.fire({
            icon: "warning",
            title: "帳號超出字數上限",
          });
          return;
        }

        const { data } = await adminAPI.signIn({
          account: this.account,
          password: this.password,
        });

        if (data.status !== "success") {
          throw new Error(data.message);
        }

        localStorage.setItem("token", data.token);

        this.$store.commit("setCurrentUser", data.token);
        this.$store.commit("setToken");

        Toast.fire({
          icon: "success",
          title: "成功登入，跳轉至後台首頁",
        });

        this.$router.push({ name: "admin-tweets" });
      } catch (error) {
        if (
          error.response.data.message === "Error: Account or Password Error!"
        ) {
          this.errorMessage = "帳號或密碼錯誤";
        } else if (
          error.response.data.message === "Error: User didn't exists!"
        ) {
          this.errorMessage = "帳號不存在!";
        }else if(error.response.data.message === 'account is not exist') {
          this.errorMessage = '此帳號沒有權限'
        }

        this.isProcessing = false;
        this.isFirstTry = false;
        this.account = "";
        this.password = "";
        Toast.fire({
          icon: "error",
          title: "無法登入",
        });
      }
    },
  },
};
</script>

<style scoped>
.SignIn {
  padding-top: 65px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 356px;
}

.logo {
  margin-bottom: 29px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #1c1c1c;
  margin-bottom: 40px;
}

.labelInputGroup {
  background-color: #f5f8fa;
  width: 100%;
  height: 54px;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.formLabel {
  font-size: 14px;
  font-weight: 400;
  color: #696974;
  margin-top: 5px;
  margin-left: 10px;
}

.formInput {
  border: 0;
  background-color: #f5f8fa;
  width: 100%;
  padding: 2px 10px;
  line-height: 26px;
  font-size: 16px;
  border-bottom: 2px solid #657786;
  font-weight: 400;
  position: absolute;
  bottom: 0px;
}

.formInput::placeholder {
  color: #b5b5be;
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
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  color: #657786;
}

.errorText {
  color: #fc5a5a;
  position: absolute;
  left: 0px;
}

.wordsCount {
  position: absolute;
  right: 0px;
}

.signInBtn {
  margin-top: 8px;
  margin-bottom: 22px;
  width: 100%;
  height: 46px;
  border: 0;
  border-radius: 50px;
  background-color: #ff6600;
  font-size: 20px;
  font-weight: 400;
  color: #ffffff;
}

.signInBtn:hover {
  cursor: pointer;
}

.signInBtn:disabled:hover {
  cursor: wait;
}

.linkGroup {
  width: 100%;
  text-align: right;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.link {
  text-decoration: underline;
  color: #0062ff;
}
</style>