<template>
  <div class="navigation">
    <a-row type="flex" justify="space-between" align="middle">
      <a-col :span="14" class="pc-nav">
        <div class="ant-row-flex">
          <logo width="64" height="64" style="padding:10px;" />
          <nuxt-link to="/" class="nav-item" :class="{active: $route.path === '/'}"><span>首页</span></nuxt-link>
          <nuxt-link to="/activity" class="nav-item" :class="{active: $route.path === '/activity'}"><span>活动</span></nuxt-link>
          <nuxt-link to="/hotspot" class="nav-item" :class="{active: $route.path === '/hotspot'}"><span>热点</span></nuxt-link>
        </div>
      </a-col>
      <a-col :span="8" class="mobile-nav">
        <a-row type="flex" align="middle">
          <a-icon
            :type="visible ? 'menu-fold' : 'menu-unfold'"
            style="color:white;fontSize:1.6rem;"
            @click="visible = !visible"
          />
        </a-row>
        <a-drawer
          placement="left"
          :closable="false"
          @close="visible = false"
          :visible="visible"
          :bodyStyle="{padding: 0, textAlign: 'center'}"
        >
          <div slot="title" style="padding-top: 64px;">
            <a-row type="flex" justify="space-around" align="middle">
              <logo width="38" height="38" />
              <nuxt-link to="/" v-if="userInfo.user_email">{{userInfo.user_email}}</nuxt-link>
            </a-row>
          </div>
          <nuxt-link class="drawer-item" to="/" @click.native="visible = false">首页</nuxt-link>
          <nuxt-link class="drawer-item" to="/activity" @click.native="visible = false">活动</nuxt-link>
          <nuxt-link class="drawer-item" to="/hotspot" @click.native="visible = false">热点</nuxt-link>
          <template v-if="isLogin">
            <nuxt-link class="drawer-item" to="/" @click.native="visible = false">我的主页</nuxt-link>
            <nuxt-link class="drawer-item" to="/" @click.native="visible = false">我赞过的</nuxt-link>
            <a-button type="link" @click="logout" style="margin-top:20px;">登出</a-button>
          </template>
        </a-drawer>
      </a-col>
      <a-col :span="10" class="ant-row-flex flex-end nav-info" v-if="isLogin">
        <a-dropdown class="pc-nav" placement="bottomCenter">
          <a class="ant-dropdown-link" href="javascript:;">{{userInfo.user_email}}&nbsp;&nbsp;</a>
          <a-menu slot="overlay" class="nav-dropdown">
            <a-menu-item>
              <a href="javascript:;">我的主页</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">我赞过的</a>
            </a-menu-item>
            <!-- <a-menu-item>
              <a href="javascript:;">我收藏的</a>
            </a-menu-item> -->
            <a-menu-item>
              <a-button type="link" @click="logout">登出</a-button>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <nuxt-link to="/edit/new" v-if="showPublish">
          <a-button type="primary">发布文章</a-button>
        </nuxt-link>
      </a-col>
      <a-col :span="10" class="flex-end" v-else>
        <a-button type="primary" plain @click="showLogin(true)">注册/登录</a-button>
      </a-col>
    </a-row>
    <a-modal v-model="loginVisible" title="注册/登录">
      <a-input
        auto-focus
        ref="accountInput"
        size="large"
        id="user_email"
        name="user_email"
        class="input"
        v-model="user_email"
        placeholder="邮箱就是你的登录用户名~"
      />
      <a-input
        size="large"
        class="input"
        id="user_mobile"
        name="user_mobile"
        v-model="user_mobile"
        v-if="registerVisible"
        placeholder="手机号也要填~"
      />
      <a-input-password
        size="large"
        class="input"
        id="user_password"
        name="user_password"
        v-model="user_password"
        placeholder="输入的时候要小心被盗哦~"
      />
      <a-input 
        size="large"
        class="input"
        id="svgCaptchaCode"
        name="svgCaptchaCode"
        v-if="registerVisible"
        v-model="svgCaptchaCode"
        placeholder="验证码看不清可以点击更换~">
        <div style="height: 40px;" slot="suffix" @click="getSvgCaptchaCodeImg" v-html="svgCaptchaCodeImg"></div>
      </a-input>
      <a-input 
        size="large"
        class="input"
        id="emailCode"
        name="emailCode"
        v-if="registerVisible"
        v-model="emailCode"
        placeholder="输入邮箱验证码的地方~">
        <div class="send-btn" slot="suffix" @click="sendEmailCode">{{waitSeconds > 0 ? waitSeconds + 's' : '发送验证码'}}</div>
      </a-input>
      <a-row type="flex" justify="center" align="middle" class="input">
        <a-col>
          <a-button type="link" @click="showRegister" v-if="registerVisible">有账号了，我要登录</a-button>
          <a-button type="link" @click="showRegister" v-else>没有账号，注册吧</a-button>
        </a-col>
      </a-row>
      <template slot="footer">
        <a-button key="back" size="large" @click="showLogin(false)">算了吧</a-button>
        <a-button
          key="submit"
          size="large"
          type="primary"
          :loading="loading"
          @click="loginOrRegister"
        >走你┏ (゜ω゜)=☞</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import Logo from "./Logo.vue";
import cookies from "js-cookie";
export default {
  components: {
    Logo
  },
  data() {
    return {
      visible: false,
      registerVisible: false,
      user_email: "",
      user_mobile: "",
      user_password: "",
      loading: false,
      showPublish: false,
      svgCaptchaCode: '',
      svgCaptchaCodeImg: '',
      emailCode: '',
    };
  },
  computed: {
    loginVisible: {
      get() {
        return this.$store.state.loginVisible;
      },
      set(value) {
        this.$store.commit("showLogin", value);
        if (value) {
          this.$nextTick(() => {
            this.$refs.accountInput && this.$refs.accountInput.focus();
          });
        }
      }
    },
    waitSeconds(){
      return this.$store.state.waitSeconds
    }
  },
  mounted() {
    this.$message.config({
      top: `100px`,
      duration: 2,
      maxCount: 3
    });
    this.showPublishFn(location.href);
  },
  watch: {
    $route: {
      handler: function(to, from) {
        this.showPublishFn(to.path)
      }
    }
  },
  methods: {
    showPublishFn(path){
      this.showPublish = path.indexOf('edit') === -1
    },
    showLogin(status) {
      this.$store.commit("showLogin", status);
      // this.loginVisible = !this.loginVisible;
    },
    showRegister() {
      this.registerVisible = !this.registerVisible;
      if(this.registerVisible){
        this.getSvgCaptchaCodeImg()
        this.$store.dispatch("startCountDown");
      }
    },
    loginOrRegister() {
      let { user_email, user_mobile, user_password, emailCode, svgCaptchaCode } = this;

      if (!user_email || !user_password) {
        this.$message.info("填全一点吧！");
        return;
      }
      if (!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(user_email)) {
        this.$message.error("邮箱错误");
        return;
      }
      if (this.registerVisible) {
        if (!/^1[3-9][0-9]{9}$/.test(user_mobile)) {
          this.$message.info("要填手机号！");
          return;
        }
        if(svgCaptchaCode.length !== 4){
          this.$message.error("验证码错误！");
          return;
        }
        if (emailCode.length !== 10) {
          this.$message.error("邮箱验证码错误！");
          return;
        }
        this.loading = true;
        this.$axios
          .$post("/api/user/register", {
            user_email,
            user_mobile,
            user_password,
            emailCode,
            svgCaptchaCode
          })
          .then(res => this.loginResult(res))
          .catch(err => this.loginResult());
      } else {
        this.loading = true;
        this.$axios
          .$post("/api/user/login", {
            user_email,
            user_password
          })
          .then(res => this.loginResult(res))
          .catch(err => this.loginResult());
      }
    },
    loginResult(res) {
      this.loading = false;
      if (res && res.s) {
        this.$message.success(res.m);
        this.$store.commit("setLoginStatus", true);
        this.$store.commit("setUserInfo", res.d);
        this.showLogin(false);
        location.reload();
      } else if (res) {
        this.$message.error(res.m);
      } else {
        this.$message.error("服务端出错了");
      }
    },
    logout() {
      this.$axios.$get("/api/user/logout").then(res => {
        if (res.d) {
          location.reload();
          this.$store.commit("setLoginStatus", false)
        }
      });
    },
    getSvgCaptchaCodeImg(){
      this.$axios.$get("/api/getSvgCaptcha").then(res=>{
        this.svgCaptchaCodeImg = res.d
      })
    },
    sendEmailCode(){
      if(this.waitSeconds > 0){
        return
      }
      let { user_email, svgCaptchaCode } = this;
      if(!this.svgCaptchaCode){
        this.$message.info("请输入验证码");
        return;
      }
      if (!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(user_email)) {
        this.$message.error("邮箱错误");
        return;
      }
      this.$store.commit('setCountDownTime', Date.now()/1000);
      this.$store.dispatch("startCountDown");
      this.$axios.$post("/api/sendEmailCode", {
        user_email,
        svgCaptchaCode
      }).then(res=>{
        if(res.s){
          this.$message.success(res.m);
        }else{
          this.$message.error(res.m);
        }
      })
    },
  }
};
</script>

<style>
.navigation {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
}
.navigation a {
  color: white;
  text-align: center;
}
.navigation a.active>span{
  text-shadow: -1px -1px 3px #1890ff, -1px 1px 3px #1890ff, 1px -1px 3px #1890ff, 1px 1px 3px #1890ff;
}
.navigation div.ant-col-4 {
  height: 64px;
  text-align: center;
}
.mobile-nav {
  display: none;
}
.drawer-item {
  margin-bottom: 0;
  padding: 20px;
  display: block;
  border-bottom: 1px solid #eee;
  color: #333;
}
.nav-item {
  min-width: 50px;
  width: 20%;
}
.nav-info {
  white-space: nowrap;
  overflow: hidden;
}
.nav-dropdown .ant-dropdown-menu-item {
  line-height: 30px;
  text-align: center;
}
.input {
  margin: 10px 0;
}
.flex-end {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 64px;
}
.send-btn{
  color: #1890ff;
  cursor: pointer;
}
@media screen and (max-width: 480px) {
  .pc-nav {
    display: none;
  }
  .mobile-nav {
    display: block;
  }
}
</style>