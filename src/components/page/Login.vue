<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">安徽三源种猪改良</div>
      <el-form
        :model="param"
        :rules="rules"
        ref="login"
        label-width="0px"
        class="ms-content"
      >
        <el-form-item prop="username">
          <el-input v-model="param.id" placeholder="username">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="password"
            v-model="param.password"
            @keyup.enter.native="submitForm()"
          >
            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </div>
        <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
      </el-form>
    </div>
  </div>
</template>

<script>
import { httpGET } from '../../api/fetch'
export default {
  data: function () {
    return {
      param: {
        // username: 'admin',
        // password: '123123',
      },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
    }
  },
  methods: {
    submitForm() {
      // this.$message.success('登录成功')
      httpGET(`/staffs/${this.param.id}`)
        .then((res) => {
          console.log("res",res)
          if(this.param.password === res.data.password){
            localStorage.setItem('ms_username', res.data.name)
            this.$router.push('/')
          }else{
            alert("密码错误")
          }
        })
        .catch((err) => {
          console.log("login err:", err)
        })
      // this.$refs.login.validate(valid => {
      //   if (valid) {
      //     this.$message.success('登录成功')
      //     localStorage.setItem('ms_username', this.param.username)
      //     this.$router.push('/')
      //   } else {
      //     this.$message.error('请输入账号和密码')
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
    },
  },
}
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../../assets/img/pig.jpg);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #000;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>
