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
};
