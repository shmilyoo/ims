'use strict';

module.exports = (options, app) => {
  // 验证user本地cookie信息与session是否一致
  return async function checkUser(ctx, next) {
    const id = ctx.helper.getCookie('ims_id');
    const authType = ctx.helper.getCookie('ims_authType');
    const session = JSON.parse(await app.redis.get(`ims:user:${id}`));
    if (session && session.authType === authType) {
      ctx.user = { id, authType };
      await next();
    } else {
      // 验证失败，清除cookie，返回401错误
      ctx.helper.clearCookie();
      ctx.status = 401;
      ctx.body = ctx.helper.getRespBody(false, '用户认证失败');
    }
  };
};
