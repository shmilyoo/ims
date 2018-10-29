'use strict';

module.exports = app => {
  app.logger.info('应用启动，进程id： ' + process.pid);
  if (app.config.env === 'local' || app.config.env === 'unittest') {
    app.beforeStart(async () => {
      app.logger.info('开始同步数据库表');
      await app.model.sync({ force: true });
      await app.model.User.create();
      await app.model.User.create();
      app.logger.info('同步数据库表完毕');
    });
  }
};
