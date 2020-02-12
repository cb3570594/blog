const Service = require('egg').Service;
const svgCaptcha = require('svg-captcha');
const nodemailer = require('nodemailer');

class CodeService extends Service {

  async getCode(data) {
    const Op = this.app.Sequelize.Op;
    const res = await this.ctx.model.Code.findOne({
      where: {
        user_email: data.user_email,
        expire_time: {
          [Op.gt]: Date.now()
        }
      }
    })
    return res
  }

  async setEmailCode(data) {
    return this.ctx.model.Code.findOrCreate({
      where: { user_email: data.user_email },
      defaults: data,
    }).then(([code, created]) => {
      if (!created) {
        code.code = data.code;
        code.expire_time = data.expire_time;
        code.save();
      }
    })
  }

  async sendEmail(email, code) {
    let transporter = nodemailer.createTransport({
      host: "smtp.exmail.qq.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "eyxoa@eyuanxing.cn", // generated ethereal user
        pass: "hLJcDkVbBi97SNbj" // generated ethereal password
      }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Welcome to my blog~👻~" <eyxoa@eyuanxing.cn>', // sender address
      to: email, // list of receivers
      subject: "注册验证码", // Subject line
      text: `注册验证码15分钟后失效`, // plain text body
      html: `<b>${code}</b>` // html body
    });

    return info;
  }

  async captcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      color: false, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
      noise: 2, // 干扰线条的数量
      ignoreChars: '0oO1ilI', // 验证码字符中排除 0o1i
    });
    return captcha;
  }
}

module.exports = CodeService;