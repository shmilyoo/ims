'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const checkUser = app.middleware.checkUser(null, app);

  router.get('/auth/login', controller.auth.login);
  router.post('/auth/ok-check', controller.auth.authOkCheck);
  router.get('/auth/check-auth', checkUser, controller.auth.checkAuth); // checkUser
  router.post('/account/reg', controller.account.reg);
  router.post('/account/bind', controller.account.bind);
  router.get('/account/check/:username', controller.account.checkUser);
  router.post('/account/login', controller.account.login);
  router.post('/account/logout', checkUser, controller.account.logout);
  router.get('/account/info', checkUser, controller.account.accountInfo);
  router.post('/account/info', checkUser, controller.account.setUserInfo);
  router.get('/dept/all', controller.dept.all);
  router.get('/dept/users', checkUser, controller.dept.deptUsers);
  router.get('/dept/managers', checkUser, controller.dept.deptManagers);
  router.post('/dept/managers', checkUser, controller.dept.setDeptManagers);
  router.get('/dept/works', checkUser, controller.dept.deptWorks);
  router.post('/work/add', checkUser, controller.work.addWork);
  router.post('/work/del', checkUser, controller.work.delWork);
  router.get('/work/info', checkUser, controller.work.workInfo);
  router.get('/work/basic', checkUser, controller.work.workBasicInfo);
  router.post('/work/basic/edit', checkUser, controller.work.updateWorkBasic);
  router.get('/work/channels', checkUser, controller.work.getWorkChannels);
  router.post('/work/channel/add', checkUser, controller.work.addWorkChannel);
  router.post(
    '/work/channel/update',
    checkUser,
    controller.work.updateWorkChannel
  );
  router.post(
    '/work/channel/delete',
    checkUser,
    controller.work.deleteWorkChannel
  );
  router.get(
    '/work/channel/articles',
    checkUser,
    controller.work.getWorkChannelArticles
  );
  router.post('/cache/updateAll', controller.cache.updateAll);
  router.get('/system/all', controller.system.allConfig);
  router.post('/system/config', controller.system.setConfig);
  router.get('/system/tag/all', controller.system.tags);
  router.post('/system/tag/add', controller.system.addTag);
  router.post('/system/tag/update', controller.system.updateTag);
  router.post('/system/tag/delete', controller.system.deleteTag);
  router.post('/system/time-scale', controller.system.timeScale);
  router.post('/upload/attachment', controller.common.uploadAttachment);
};
