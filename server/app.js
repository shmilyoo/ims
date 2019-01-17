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
      await app.model.User.create({
        id: 'c360d5f0ceef11e8b013f53754442777',
        name: '室领导1',
        username: 'admin',
        password: 'c584033b9997e3b8c8efe585e4973397',
        deptId: 'c360d5f0ceef11e8b013f53754442dd4',
        isSuperAdmin: true,
      });
      await app.model.User.create({
        id: 'f3762080cb9911e884eec9a890da22bf',
        name: '总体1',
        username: 'cccc',
        password: getCryptoPasswdSync(md5('cccc'), 'cccc'),
        deptId: 'c360d5f0ceef11e8b013f53754442dd5',
      });
      await app.model.User.create({
        id: 'f3762080cb9911e884eec9a890da67bf',
        name: '总体2',
        username: 'dddd',
        password: getCryptoPasswdSync(md5('dddd'), 'dddd'),
        deptId: 'c360d5f0ceef11e8b013f53754442dd5',
      });
      await app.model.User.create({
        id: 'f3762080cb9911e884eec9a890da2222',
        username: 'eeee',
        password: getCryptoPasswdSync(md5('eeee'), 'eeee'),
        name: '网络1',
        deptId: 'c360d5f0ceef11e8b013f53754442666',
      });
      await app.model.User.create({
        id: 'f3762080cb9911e884eec9a890da2233',
        username: 'ffff',
        password: getCryptoPasswdSync(md5('ffff'), 'ffff'),
        name: '网络2',
        deptId: 'c360d5f0ceef11e8b013f53754442666',
      });
      await app.model.DeptManager.create({
        deptId: 'c360d5f0ceef11e8b013f53754442dd4',
        userId: 'c360d5f0ceef11e8b013f53754442777',
      });
      await app.model.DeptManager.create({
        deptId: 'c360d5f0ceef11e8b013f53754442dd4',
        userId: 'f3762080cb9911e884eec9a890da22bf',
      });
      const defaultTag = await app.model.Tag.create({
        name: '其他',
        color: '#666',
        order: 1000,
      });
      const works = new Array(16).fill(0).map((n, i) => ({
        deptId: 'c360d5f0ceef11e8b013f53754442dd4',
        id: `c360d5f0cfff11e8b013f53754442d${i + 10}`,
        tagId: defaultTag.id,
        content: '<div><p>测试工作内容数据</p></div>',
        title: new Array(i + 1).fill('a').join(),
        from: 1745267600 + i * 1000000,
        to: 1845267600 + i * 1000000,
        createTime: 1545267600 + i * 1000000,
        updateTime: 1555267600 + i * 1000000,
        publisherId: 'c360d5f0ceef11e8b013f53754442777',
      }));

      // console.log(works);
      const worksModel = await app.model.Work.bulkCreate(works);
      const workId = worksModel[2].id;
      const channel1 = await app.model.WorkChannel.create({
        workId,
        name: 'channel1',
      });
      const channel2 = await app.model.WorkChannel.create({
        workId,
        name: 'channel2',
        order: 2,
      });
      const channel3 = await app.model.WorkChannel.create({
        workId,
        name: 'channel3',
        order: 3,
      });
      const deptId4s = 'c360d5f0ceef11e8b013f53754442dd4';
      const channel11 = await app.model.DeptChannel.create({
        deptId: deptId4s,
        name: 'channel1',
      });
      const channel12 = await app.model.DeptChannel.create({
        deptId: deptId4s,
        name: 'channel2',
        order: 2,
      });
      const channel13 = await app.model.DeptChannel.create({
        deptId: deptId4s,
        name: 'channel3',
        order: 3,
      });
      const title =
        '一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二';
      const articles = new Array(21).fill(0).map((n, i) => ({
        id: `c360d5f0c12311e8b013f53754442d${i + 10}`,
        channelId: channel1.id,
        title: title.substring(0, i + 12),
        createTime: 1545267600 + i * 1000000,
        updateTime: 1545267600 + i * 1000000,
        publisherId: 'c360d5f0ceef11e8b013f53754442777',
      }));
      const articles2 = new Array(21).fill(0).map((n, i) => ({
        id: `c360d5f0c17311e8b013f53754442d${i + 10}`,
        channelId: channel2.id,
        title: title.substring(0, 21 - i),
        createTime: 1545267600 + i * 1000000,
        updateTime: 1545267600 + i * 1000000,
        publisherId: 'f3762080cb9911e884eec9a890da2222',
      }));
      const articles3 = new Array(3).fill(0).map((n, i) => ({
        id: `c360d5f0c19311e8b013f53754442d${i + 10}`,
        channelId: channel3.id,
        title: title.substring(0, i + 1),
        createTime: 1545267600 + i * 1000000,
        updateTime: 1545267600 + i * 1000000,
        publisherId: 'f3762080cb9911e884eec9a890da2222',
      }));
      await app.model.WorkArticle.bulkCreate(articles);
      await app.model.WorkArticle.bulkCreate(articles2);
      await app.model.WorkArticle.bulkCreate(articles3);
      await app.model.Phase.bulkCreate([
        {
          title: 'phase 1',
          workId,
          from: '1545267600',
        },
        {
          title: 'phase 4',
          workId,
          from: '1655267602',
        },
        {
          title: 'phase 3',
          workId,
          from: '1565267602',
        },
        {
          title: 'phase 2',
          workId,
          from: '1555267602',
        },
      ]);
      const tasks = new Array(16).fill(0).map((n, i) => ({
        workId,
        id: `c360d5f0cef211e8b013f53754442d${i + 10}`,
        title: new Array(i + 1).fill('a').join(),
        from: 1535267600 + i * 10000,
        to: 1555467600 + i * 10000,
        content: '<div><p>测试工作任务内容数据</p></div>',
        createTime: 1545267600 + i * 10000,
        updateTime: 1545367600 + i * 10000,
        publisherId: 'c360d5f0ceef11e8b013f53754442777',
      }));
      await app.model.Task.bulkCreate(tasks);
      await app.model.System.create({
        name: 'allowExts',
        value: '.rar;.zip;.7zip;.tar;.doc;.docx;.jpg;.png;.bmp;.gif',
      });
      await app.runSchedule('updateCache');
      app.logger.info('同步数据库表完毕');
    });
  }
};
