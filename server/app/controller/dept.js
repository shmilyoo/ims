'use strict';

const Controller = require('egg').Controller;

class DeptController extends Controller {
  async all() {
    // 获取deptArray
    const ctx = this.ctx;
    const deptArray = await ctx.service.cache.getDeptArray();
    ctx.body = ctx.helper.getRespBody(true, deptArray);
  }

  async relations() {
    const ctx = this.ctx;
    const deptRelations = await ctx.model.DeptRelation.findAll({
      attributes: [ 'fromDeptId', 'toDeptId' ],
    });
    const result = {};
    deptRelations.forEach(relation => {
      result[relation.fromDeptId] = relation.toDeptId;
    });
    ctx.body = ctx.helper.getRespBody(true, result);
  }

  async relationsBind() {
    const ctx = this.ctx;
    const { fromDeptId, toDeptId } = ctx.request.body;
    await ctx.model.DeptRelation.upsert({ fromDeptId, toDeptId });
    ctx.body = ctx.helper.getRespBody(true, { fromDeptId, toDeptId });
  }
  async relationsUnbind() {
    const ctx = this.ctx;
    const { fromDeptId, toDeptId } = ctx.request.body;
    await ctx.model.DeptRelation.destroy({ where: { fromDeptId, toDeptId } });
    ctx.body = ctx.helper.getRespBody(true, { fromDeptId, toDeptId });
  }
}

module.exports = DeptController;
