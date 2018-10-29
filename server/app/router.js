'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/auth/login', controller.auth.login);
  router.get('/auth/check-auth', controller.auth.checkAuth);
  router.post('/auth/ok-check', controller.auth.authOkCheck);
};
