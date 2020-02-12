const cookieparser = process.server ? require('cookieparser') : undefined
let timer = null;
export const state = () => ({
  loginVisible: false,
  isLogin: false,
  userInfo: {},
  countDownStartTime: 0,
  waitSeconds: 0
})

export const mutations = {
  setLoginStatus(state, param) {
    state.isLogin = param
  },
  setUserInfo(state, param) {
    state.userInfo = param
  },
  showLogin(state, loginVisible) {
    state.loginVisible = loginVisible
  },
  setCountDownTime(state, param) {
    state.countDownStartTime = parseInt(param)
  },
  setWaitSeconds(state, param) {
    state.waitSeconds = Math.floor(param)
  }
}

export const actions = {
  startCountDown({ commit, state }) {
    let d = parseInt(Date.now() / 1000) - state.countDownStartTime;
    let s = 60;
    let waitSeconds = s - d > 0 ? s - d : 0;
    commit("setWaitSeconds", waitSeconds);
    clearInterval(timer);
    timer = setInterval(() => {
      if (waitSeconds >= 0) {
        commit("setWaitSeconds", --waitSeconds)
      } else {
        clearInterval(timer);
        timer = null;
      }
    }, 1000);
  },

  async nuxtServerInit({ commit }, { app, req }) {
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      if (parsed && parsed.auth2) {
        const res = await app.$axios.get('/api/user/getUserInfo')
        if(res && res.data.d){
          commit('setUserInfo', res.data.d)
          commit('setLoginStatus', false)
        }
      } else {
        commit('setUserInfo', {})
        commit('setLoginStatus', false)
      }
    } else {
      commit('setUserInfo', {})
      commit('setLoginStatus', false)
    }
  }
}