<template>
  <a-layout>
    <a-layout-header>
      <Navigation />
    </a-layout-header>
    <a-layout-content>
      <nuxt />
    </a-layout-content>
    <a-layout-footer>
      <Footer />
    </a-layout-footer>
  </a-layout>
</template>
<script>
import Navigation from "~/components/Navigation.vue";
import Footer from "~/components/Footer.vue";
export default {
  components: {
    Navigation,
    Footer
  },
  data(){
    return{
      env: process.env.NODE_ENV
    }
  },
  mounted(){
    window.resize = () => {
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 1000);
    },
    // this.env !== 'development' && navigator.userAgent.indexOf('Mobile') && eruda && eruda.init();
    this.$store.commit("setLoginStatus", this.userInfo && this.userInfo.user_email);
  }
};
</script>
<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

body{
  min-width: 320px;
}
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
a:focus{
  text-decoration:none;
}
ol,ul{
  list-style: none;
}
.ant-layout{
  padding-top: 64px;
}
.ant-layout-header{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99999;
  min-width: 320px;
  padding: 0 20px;
}
.ant-layout-content{
  padding: 0 10px;
}
.ant-layout-content > div {
  margin: 15px auto;
  min-height: calc(100vh - 294px);
  /* padding: 20px; */
  width: 100%;
  max-width: 960px;
  border-radius: 5px;
  background-color: white;
}
.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

.ant-layout-footer {
  background-color: white;
}

.Pd20{
  padding: 20px;
}

.post_time {
  font-size: 10px;
  color: #999;
}
</style>
