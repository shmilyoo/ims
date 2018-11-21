'use strict';

const Controller = require('egg').Controller;
const axios = require('axios');

class AccountController extends Controller {
  async reg() {
    const { ctx, config } = this;
    const { username, password, casUsername } = ctx.request.body;
    const reqConfig = await ctx.service.auth.addSsoTokenToConfig();
    const res = await axios.post(
      config.ssoUserBind,
      {
        sysName: config.sysName,
        casUsername, // 需要绑定的cas用户名
        username, // 第三方系统的用户名
      },
      reqConfig
    );
    if (res.success) {
      const passwordCrypto = this.service.common.getCryptoPasswdSync(
        password,
        username
      );
      try {
        const id = res.data.id;
        const user = await ctx.model.User.findOne({ where: { id } });
        if (user) {
          // 用户使用授权登录方式使用过系统，数据库存在指定id用户，更新用户名密码即可、
          if (user.username || user.password) {
            throw '用户注册服务端处理时，这里的用户名密码应该都为空';
          }
          await ctx.model.User.update(
            {
              username,
              password: passwordCrypto,
            },
            { where: { id } }
          );
        } else {
          await ctx.model.User.create({
            username,
            password: passwordCrypto,
            deptId: res.data.deptId,
            id, // 创建本地用户和绑定的cas用户id一致
          });
        }
      } catch (e) {
        ctx.body = ctx.helper.getRespBody(
          false,
          `统一认证系统用户有效，但本地注册出错:${
            e.message
          }，请到统一认证系统删除绑定关系`
        );
        return;
      }
    }
    ctx.body = ctx.helper.getRespBody(
      res.success,
      res.success ? res.data : res.error
    );
  }

  async bind() {
    const { ctx, config } = this;
    const { username, password, casUsername } = ctx.request.body;
    const user = await ctx.service.account.checkUserPasswd(username, password);
    if (!user) {
      ctx.body = ctx.helper.getRespBody(false, '用户名密码不正确');
      return;
    }
    const reqConfig = await ctx.service.auth.addSsoTokenToConfig();
    const res = await axios.post(
      config.ssoUserBind,
      {
        sysName: config.sysName,
        casUsername, // 需要绑定的cas用户名
        username, // 第三方系统的用户名
      },
      reqConfig
    );
    ctx.body = ctx.helper.getRespBody(
      res.success,
      res.success ? res.data : res.error
    );
  }

  /**
   * 用户注册时后台异步验证用户名是否已经占用/是否可用
   */
  async checkUser() {
    const ctx = this.ctx;
    const username = ctx.params.username.toLowerCase();
    const user = await ctx.model.User.findOne({ where: { username } });
    ctx.body = ctx.helper.getRespBody(true, {
      isNameExist: !!user,
    });
  }

  async login() {
    const ctx = this.ctx;
    const body = ctx.request.body;
    const { username, password, remember } = body;
    const user = await ctx.service.account.checkUserPasswd(username, password);
    if (user) {
      const res = await ctx.service.auth.checkBind(user.id, username);
      // 验证绑定失败包括用户未激活被禁用或者没有对应用户，未同意绑定等
      if (!res.success) {
        ctx.body = res;
        return;
      }
      // 登录认证通过，设置cookie，服务端session
      const authType = 'local';
      const [ expires, maxAge ] = ctx.helper.getExpiresAndMaxAge('week', 1);
      await ctx.service.account.setCache(user.id, authType, maxAge, remember);
      await ctx.service.account.setCookie(
        user.id,
        authType,
        maxAge,
        expires,
        remember
      );
      const _user = Object.assign(res.data.user, {
        isSuperAdmin: user.isSuperAdmin,
        username: user.username,
        // 用户实际工作所在部门
        deptId: user.deptId,
      });
      ctx.body = ctx.helper.getRespBody(true, {
        authType,
        user: _user,
      });
    } else {
      ctx.body = ctx.helper.getRespBody(false, '用户名或密码不正确');
    }
  }
}

module.exports = AccountController;
