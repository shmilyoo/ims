'use strict';

const Controller = require('egg').Controller;

class DeptController extends Controller {
  async depts() {
    // 获取deptArray
    const ctx = this.ctx;
    const deptArray = await ctx.service.cache.getDeptArray();
    ctx.body = ctx.helper.getRespBody(true, deptArray);
  }
}

module.exports = DeptController;
