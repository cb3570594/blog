/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
// console.log(process.env.NODE_ENV, process.env.EGG_SERVER_ENV);
const sequelizeConfig = require('./config.json');
const env = process.env.NODE_ENV;
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};
  config.cluster = {
    listen: {
      port: 7001,
      hostname: '127.0.0.1', // 不建议设置 hostname 为 '0.0.0.0'，它将允许来自外部网络和来源的连接，请在知晓风险的情况下使用
      // path: '/var/run/egg.sock',
    }
  }
  // console.log(appInfo.name) demo
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1575169700149_4945';
  config.jwt = {
    secret: "cboy"
  };
  // config.cors = {
    // origin: 'http://localhost:3000',
    // credentials: true,  //允许Cook可以跨域
    // allowMethods: 'GET,POST'
  // };
  config.cookies = {
    httpOnly: true,
    encrypt: true,
  };
  config.session = {
    key: 'auth2',
    maxAge: 24 * 3600 * 1000 * 7, // 1 天
    httpOnly: true,
    encrypt: true,
  };
  config.security = {
    csrf: {
      // queryName: '_csrf', // 通过 query 传递 CSRF token 的默认字段为 _csrf
      // bodyName: '_csrf', // 通过 body 传递 CSRF token 的默认字段为 _csrf
      // headerName: '_csrf'
      enable: false,
      ignoreJSON: true
    },
    // domainWhiteList: ['http://localhost:3000']
  };
  config.sequelize = sequelizeConfig[env];
  // add your middleware config here
  config.middleware = ['getUser', 'intercept'];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  config.proxy = true;
  config.maxProxyCount = 1;
  return {
    ...config,
    ...userConfig,
  };
};
