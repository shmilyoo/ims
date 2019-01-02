'use strict';
const path = require('path');
const os = require('os');

const CASURL = 'http://localhost:3000';
const IMSURL = 'http://localhost:4000';

exports.keys = 'ims-backend_1540020800270_169';
exports.middleware = [];
exports.sequelize = {
  dialect: 'mysql',
  hostname: 'localhost',
  port: 3306,
  database: 'ims',
  username: 'root',
  password: 'root',
};
exports.redis = {
  client: {
    host: '127.0.0.1',
    port: 6379,
    password: null,
    db: '0',
  },
  agent: true,
};
exports.multipart = {
  mode: 'file',
  tmpdir: path.join(os.tmpdir(), 'egg-multipart-tmp', 'ims'),
  cleanSchedule: {
    // run tmpdir clean job on every day 04:30 am
    // cron style see https://github.com/eggjs/egg-schedule#cron-style-scheduling
    cron: '0 30 4 * * *',
  },
  fileSize: '5000mb',
  // whitelist:[],  // 会覆盖默认配置，和前端限制保持一致
  // will append to whilelist
  fileExtensions: [
    '.doc',
    '.docx',
    '.ppt',
    '.pptx',
    '.xls',
    '.xlsx',
    '.tar',
    '.rar',
    '.7zip',
  ],
};
exports.logger = {
  dir: '/var/log/ims-backend',
};
exports.security = {
  // domainWhiteList: [ 'http://localhost:3000' ],
  csrf: {
    enable: false,
  },
};
exports.onerror = {
  all(err, ctx) {
    ctx.body = { success: false, error: `发生错误，${err.message}` };
    ctx.status = 200;
  },
};
exports.salt = 'ddsfddsfds#4%#$3@kfd'; // 用户密码加盐 md5(md5-password+salt)
exports.usernameBlackList = [ 'admin' ]; // 不允许注册的用户名
exports.cluster = {
  listen: {
    port: 8002,
  },
};
exports.sysName = 'ims';
exports.ssoKey = '111111'; // sso服务器生成的和本服务端之间的通信密钥/认证密码
exports.uploadRoot = '/var/www/ims/upload';
exports.urlRoot = 'http://localhost:4000/static/upload';
exports.ssoAuthLoginPage = `${CASURL}/auth/login`;
exports.ssoCheckPage = `${CASURL}/auth/check`;
exports.ssoCheckBind = `${CASURL}/auth/check/bind`;
exports.ssoUserBind = `${CASURL}/auth/user/bind`;
exports.ssoAuthOk = `${IMSURL}/auth/ok`; // 用户单点登录认证时发送给CAS的本机auth-ok地址，以便成功后回调
exports.ssoDepts = `${CASURL}/sso-api/depts`; // sso获取deptArray地址
