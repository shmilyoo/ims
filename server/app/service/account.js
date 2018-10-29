'use strict';

const Service = require('egg').Service;

class AccountService extends Service {
  /**
   * 设置ims用户缓存，用于标记用户已经授权且登录的第三方系统，并可以辅助统一退出
   * @param {string} id user id
   * @param {string} authType sso || local
   * @param {number} maxAge 过期时间
   * @param {boolean} remember 是否记住用户
   */
  async setCache(id, authType, maxAge, remember) {
    const userId = `ims-user-${id}`;
    const cacheStr = await this.ctx.app.redis.get(userId);
    const cache = JSON.parse(cacheStr) || {};
    cache.authType = authType;
    await this.ctx.app.redis.set(
      userId,
      JSON.stringify(cache),
      'ex',
      remember ? maxAge / 1000 : 3600
    );
  }

  async setCookie(id, authType, active, maxAge, expires, remember) {
    const ctx = this.ctx;
    ctx.helper.setCookie(
      'ims_id',
      id,
      remember ? { maxAge, expires, httpOnly: true } : { httpOnly: true }
    );
    ctx.helper.setCookie(
      'ims_authType',
      authType,
      remember ? { maxAge, expires, httpOnly: true } : { httpOnly: true }
    );
  }
}

module.exports = AccountService;
