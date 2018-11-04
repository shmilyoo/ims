'use strict';

const Controller = require('egg').Controller;
const jwt = require('jsonwebtoken');
const axios = require('axios');

class AuthController extends Controller {
  async login() {
    // 前台在登录界面点击使用sso授权登录
    // 302 location:http://cas.com/auth/login?from=sysA&token=xxx.yyy.zzz&redirect=http//A.com/page1
    const {
      ctx,
      config: { ssoKey, ssoAuthLoginPage, sysName, ssoAuthOk },
    } = this;
    const token = jwt.sign(
      { exp: Math.floor(Date.now() / 1000) + 30, data: {} },
      ssoKey
    );
    const redirect = ctx.query.redirect;
    const location = `${ssoAuthLoginPage}?from=${sysName}&authOk=${encodeURIComponent(
      ssoAuthOk
    )}&redirect=${encodeURIComponent(redirect)}&token=${token}`;
    ctx.body = ctx.helper.getRespBody(true, { location });
  }

  async checkAuth() {
    // 已经过中间件验证cookie session
    // 根据authType进行验证
    // 是否在此获取用户相关信息？
    // 不成功的话清空cookie,
    const ctx = this.ctx;
    const { id, authType } = ctx.user;
    const config = await ctx.service.auth.addSsoTokenToConfig();
    const { ssoCheckPage, sysName } = this.config;
    const response = await axios.post(
      ssoCheckPage,
      { id, authType, symbol: sysName },
      config
    );
    if (response.success) {
      // 系统发送给sso的验证信息，确认正确
      // response.data.user.keys=['id', 'username', 'active', 'name', 'sex', 'dept_id','authType' ]
      ctx.body = ctx.helper.getRespBody(true, response.data);
    } else {
      ctx.helper.clearCookie();
      ctx.body = ctx.helper.getRespBody(
        false,
        response.error || '授权验证错误'
      );
    }
  }

  /**
   * 用户使用单点登录授权，登录后重新导向到原系统auth/ok，发送给后台token进行验证
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
      user: { active, id, sex, dept_id, name },
      remember,
    } = checkResult;
    const [ expires, maxAge ] = ctx.helper.getExpiresAndMaxAge('week', 1);
    await ctx.service.account.setCache(id, authType, maxAge, remember);
    await ctx.service.account.setCookie(
      id,
      authType,
      maxAge,
      expires,
      remember
    );
    // 用户使用统一授权登录，系统并不知道数据库中是否有用户条目，即用户是否以注册方式进行了登录
    // 所以要尝试创建相应的用户
    await ctx.model.User.findOrCreate({
      where: { id },
      defaults: { id },
    });
    ctx.body = await ctx.helper.getRespBody(true, {
      authType,
      user: {
        active,
        id,
        sex,
        dept_id,
        name,
      },
    });
  }
}

module.exports = AuthController;
