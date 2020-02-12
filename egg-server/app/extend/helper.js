module.exports = {
  success({ m = '', d }) {
    // this 是 helper 对象，在其中可以调用其他 helper 方法
    // this.ctx => context 对象
    // this.app => application 对象
    this.ctx.body = {
      s: true,
      m,
      d
    }
  },
  fail({ m = '' }) {
    this.ctx.body = {
      s: false,
      m,
      d: null
    }
  }
};