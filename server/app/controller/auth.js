'use strict';

const Controller = require('egg').Controller;
const jwt = require('jsonwebtoken');

class AuthController extends Controller {
  async login() {
    // 前台在登录界面点击使用sso授权登录
    // 302 location:http://cas.com/auth/login?from=sysA&token=xxx.yyy.zzz&redirect=http//A.com/page1
    const {
      ctx,
      config: { ssoKey, ssoLoginPage, sysName, ssoAuthOk },
    } = this;
    const token = jwt.sign(
      { exp: Math.floor(Date.now() / 1000) + 30, data: {} },
      ssoKey
    );
    const redirect = ctx.query.redirect;
    const location = `${ssoLoginPage}?from=${sysName}&authOk=${encodeURIComponent(
      ssoAuthOk
    )}&redirect=${encodeURIComponent(redirect)}&token=${token}`;
    ctx.body = ctx.helper.getRespBody(true, { location });
  }

  async checkAuth() {
    // 根据cookie ims-id 获取缓存与其他cookie比对，判断是sso登录还是local
    // 不成功的话清空cookie
  }

  /**
   * 用户使用单点登录授权，登录后重新导向到原系统，发送给后台token进行验证
   */
  async authOkCheck() {
    console.log('auth ok check');
    const { ctx, config } = this;
    const { token } = ctx.request.body;
    const checkResult = await ctx.service.auth.checkAuthToken(
      config.ssoKey,
      token
    );
    if (typeof checkResult === 'string') {
      ctx.body = await ctx.helper.getRespBody(false, checkResult);
      return;
    }
    const {
      authType,
      user: { active, id },
      remember,
    } = checkResult;
    const [ expires, maxAge ] = ctx.helper.getExpiresAndMaxAge('week', 1);
    await ctx.service.account.setCache(id, authType, maxAge, remember);
    await ctx.service.account.setCookie(
      id,
      authType,
      active,
      maxAge,
      expires,
      remember
    );
    ctx.body = await ctx.helper.getRespBody(true, { authType, id, active });
  }
}

module.exports = AuthController;
