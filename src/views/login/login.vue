<template>
  <div class="login">
    <div class="container">
      <div class="loginPage">
        <div class="loginBox">
          <div class="loginWelcome">
            <h2>{{text}}</h2>
            <p>欢迎使用数智兴华后台管理系统</p>
          </div>
          <div class="form">
            <el-form ref="form" :model="form" @keyup.enter="loginForm">
              <el-form-item>
<<<<<<< HEAD
                <el-input v-model="form.username" placeholder="请输入用户名或手机号" prefix-icon="User"></el-input>
=======
                <el-input v-model="form.account" placeholder="请输入用户名或手机号" prefix-icon="User"></el-input>
>>>>>>> 95f56df9cdc6da77f16f47c43af7ffdbe127b0c9
              </el-form-item>
              <el-form-item>
                <el-input v-model="form.password" placeholder="请输入密码" prefix-icon="Lock" show-password></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="loginForm">登 录</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="loginBg">
          <img src="./bg.svg" width="350">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
<<<<<<< HEAD
        username: "",
=======
        account: "",
>>>>>>> 95f56df9cdc6da77f16f47c43af7ffdbe127b0c9
        password: "",
      },
      text: "你好",
    };
  },
  created() {
    this.getTimeState();
  },
  methods: {
    getTimeState() {
      let timeNow = new Date();
      let hours = timeNow.getHours();
      let hello = "";
      if (hours < 6) hello = "凌晨好";
      else if (hours < 9) hello = "早上好";
      else if (hours < 12) hello = "上午好";
      else if (hours < 14) hello = "中午好";
      else if (hours < 17) hello = "下午好";
      else if (hours < 19) hello = "傍晚好";
      else if (hours < 22) hello = "晚上好";
      else {
        hello = "夜深了";
      }
      this.text = hello;
    },
    async loginForm() {
<<<<<<< HEAD
      if(!this.form.username || !this.form.password){
        return
      }
      const res = await this.$request.get("/mall/cms/api/v1/cms_user/login",{params:this.form})
      if(res.data.code === 200){
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("nickname", res.data.data.username);
=======
      if(!this.form.account || !this.form.password){
        return
      }
      const res = await this.$request.get("/api-mall/admin/api/v1/user/user_login",{params:this.form})
      if(res.data.code === 200){
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("nickname", res.data.data.nickname);
>>>>>>> 95f56df9cdc6da77f16f47c43af7ffdbe127b0c9
        this.$message.success("登陆成功")
        this.$router.push('/order/list')
      }
    },
  },
};
</script>

<style scoped>
.login {
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
}

.container {
  position: relative;
  width: 1031px;
  height: 720px;
}

.loginPage {
  display: flex;
  width: 100%;
  height: 100%;
  background: #fff;
  box-shadow: 3px 4px 16px 0 #e3e3e3;
  flex-flow: row nowrap;
}

.loginBox {
  flex: 1;
  padding: 70px;
}

.loginBg {
  display: flex;
  background-image: linear-gradient(180deg, #ecf5ff, #53a8ff);
  justify-content: center;
  align-items: center;
  width: 530px;
}

.loginWelcome {
  margin-top: 10px;
  margin-bottom: 50px;
}

.loginWelcome h2 {
  font-size: 36px;
  margin: 0;
  color: #1f2d3d;
}

.loginWelcome p {
  font-size: 14px;
  font-weight: 600;
  color: #475669;
}

.el-button {
  margin-top: 30px;
  width: 100%;
  color: #fff;
  background-color: #66b1ff;
  font-size: 15px;
  font-weight: 500;
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
}
</style>