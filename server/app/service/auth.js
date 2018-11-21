'use strict';

const Service = require('egg').Service;
const jwt = require('jsonwebtoken');
const util = require('util');
const axios = require('axios');

class AuthService extends Service {
  async checkAuthToken(key, token) {
    const verify = util.promisify(jwt.verify);
    try {
      const data = await verify(token, key);
      return data;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return 'token已经过期，请从原系统重新进入';
      }
      if (error instanceof jwt.JsonWebTokenError) return 'token不正确';
      return `token验证发生未知错误，error:${error}`;
    }
  }

  /**
   * 在axios请求的headers中添加token
   * @param {object} config 初始axios的config
   * @param {object} data token中需要封装的data
   * @param {object} expire jwt token 过期时间，默认10秒
   * @return {object} 包含 headers键值的config object
   */
  async addSsoTokenToConfig(config = {}, data = {}, expire = 10) {
    const sign = util.promisify(jwt.sign);
    data.exp = Math.floor(Date.now() / 1000) + expire;
    data.symbol = this.config.sysName;
    const token = await sign(data, this.config.ssoKey);
    config.headers = Object.assign(config.headers || {}, {
      Authorization: 'bearer ' + token,
    });
    return config;
  }

  async checkBind(id, username) {
    const { ctx, config } = this;
    const reqConfig = await ctx.service.auth.addSsoTokenToConfig();
    const res = await axios.post(
      config.ssoCheckBind,
      { userId: id, ssoUsername: username },
      reqConfig
    );
    return res;
  }
}

module.exports = AuthService;
