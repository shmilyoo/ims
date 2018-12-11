'use strict';

const configureAxios = require('./axios');
const md5 = require('md5');
const crypto = require('crypto');

const getCryptoPasswdSync = (password, username) => {
  const usernameMd5 = crypto
    .createHash('md5')
    .update(username)
    .digest('hex');
  const salt = 'ddsfddsfds#4%#$3@kfd' + usernameMd5;
  return crypto
    .createHash('md5')
    .update(password + salt)
    .digest('hex');
};

module.exports = app => {
  app.logger.info('应用启动，进程id： ' + process.pid);
  app.beforeStart(async () => {
    configureAxios();
  });
  if (app.config.env === 'local' || app.config.env === 'unittest') {
    app.beforeStart(async () => {
      app.logger.info('开始同步数据库表');
      await app.model.sync({ force: true });
      app.model.User.create({
        id: 'c360d5f0ceef11e8b013f53754442777',
        name: '室领导1',
        username: 'admin',
        password: 'c584033b9997e3b8c8efe585e4973397',
        deptId: 'c360d5f0ceef11e8b013f53754442dd4',
        isSuperAdmin: true,
      });
      app.model.User.create({
        id: 'f3762080cb9911e884eec9a890da22bf',
        name: '总体1',
        username: 'cccc',
        password: getCryptoPasswdSync(md5('cccc'), 'cccc'),
        deptId: 'c360d5f0ceef11e8b013f53754442dd5',
      });
      app.model.User.create({
        id: 'f3762080cb9911e884eec9a890da67bf',
        name: '总体2',
        username: 'dddd',
        password: getCryptoPasswdSync(md5('dddd'), 'dddd'),
        deptId: 'c360d5f0ceef11e8b013f53754442dd5',
      });
      app.model.User.create({
        id: 'f3762080cb9911e884eec9a890da2222',
        username: 'eeee',
        password: getCryptoPasswdSync(md5('eeee'), 'eeee'),
        name: '网络1',
        deptId: 'c360d5f0ceef11e8b013f53754442666',
      });
      app.model.User.create({
        id: 'f3762080cb9911e884eec9a890da2233',
        username: 'ffff',
        password: getCryptoPasswdSync(md5('ffff'), 'ffff'),
        name: '网络2',
        deptId: 'c360d5f0ceef11e8b013f53754442666',
      });
      // app.model.DeptRelation.create({
      //   fromDeptId: 'c360d5f0ceef11e8b013f53754442dd5',
      //   toDeptId: 'c360d5f0ceef11e8b013f53754442dd4',
      // });
      app.model.Tag.create({ name: '其他', color: '#666', order: 1000 });
      app.logger.info('同步数据库表完毕');
    });
  }
};
