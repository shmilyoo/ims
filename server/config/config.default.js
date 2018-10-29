'use strict';

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
exports.salt = 'ddsfsdfadsfds#4%#$3@kfd'; // 用户密码加盐 md5(md5-password+salt)
exports.usernameBlackList = [ 'admin' ]; // 不允许注册的用户名
exports.cluster = {
  listen: {
    port: 8002,
  },
};
exports.sysName = 'ims';
exports.ssoKey = '111111'; // sso服务器生成的和本服务端之间的通信密钥
exports.ssoLoginPage = 'http://localhost:3000/auth/login';
exports.ssoCheckPage = 'http://localhost:3000/auth/check';
exports.ssoAuthOk = 'http://localhost:4000/auth/ok';
