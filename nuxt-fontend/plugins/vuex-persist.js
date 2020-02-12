import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  window.onNuxtReady(() => {
    new VuexPersistence({
    /* your options */
      reducer: (state) => ({
        loginVisible: state.loginVisible,
        countDownStartTime: state.countDownStartTime,
        waitSeconds: state.waitSeconds,
        // isLogin: state.isLogin
      })
    }).plugin(store);
  });
}