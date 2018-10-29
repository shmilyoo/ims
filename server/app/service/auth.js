'use strict';

const Service = require('egg').Service;
const jwt = require('jsonwebtoken');
const util = require('util');

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
}

module.exports = AuthService;
