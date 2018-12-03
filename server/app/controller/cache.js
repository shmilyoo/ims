'use strict';

const Controller = require('egg').Controller;

class CacheController extends Controller {
  async updateAll() {
    const ctx = this.ctx;
    ctx.service.cache.updateAll();
    ctx.body = ctx.helper.getRespBody(true);
  }
}

module.exports = CacheController;
