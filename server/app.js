'use strict';

const configureAxios = require('./axios');

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
        id: 'f3762080cb9911e884eec9a890da67bf',
        username: 'admin',
        password: 'c584033b9997e3b8c8efe585e4973397',
        is_super_admin: true,
      });
      app.logger.info('同步数据库表完毕');
    });
  }
};
