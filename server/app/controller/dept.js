'use strict';

const Controller = require('egg').Controller;

class DeptController extends Controller {
  async all() {
    // 获取deptArray
    const ctx = this.ctx;
    const deptArray = await ctx.service.cache.getDeptArray();
    ctx.body = ctx.helper.getRespBody(true, deptArray);
  }

  /**
   * 用户初次加载主页面时，获取depts列表和dept关系绑定对象
   */
  async deptsAndRelation() {
    const ctx = this.ctx;
    const deptArray = await ctx.service.cache.getDeptArray();
    const deptRelation = await ctx.service.dept.getDeptRelation();
    ctx.body = ctx.helper.getRespBody(true, { deptArray, deptRelation });
  }

  // async getWorkDeptInfo() {
  //   // 从query的deptid获取关联的部门相关信息
  //   const ctx = this.ctx;
  //   const { fromDeptId } = ctx.query;
  //   if (!fromDeptId) throw '请求参数部门id不正确';
  //   const relation = await ctx.model.DeptRelation.findOne({
  //     where: { fromDeptId },
  //   });
  //   const realDeptId = relation ? relation.toDeptId : fromDeptId;
  //   const deptDic = await ctx.service.cache;
  // }

  // async relations() {
  //   const ctx = this.ctx;
  //   const result = await ctx.service.dept.getDeptRelation();
  //   ctx.body = ctx.helper.getRespBody(true, result);
  // }

  // async relationsBind() {
  //   const ctx = this.ctx;
  //   const { fromDeptId, toDeptId } = ctx.request.body;
  //   await ctx.model.DeptRelation.upsert({ fromDeptId, toDeptId });
  //   ctx.body = ctx.helper.getRespBody(true, { fromDeptId, toDeptId });
  // }
  // async relationsUnbind() {
  //   const ctx = this.ctx;
  //   const { fromDeptId, toDeptId } = ctx.request.body;
  //   await ctx.model.DeptRelation.destroy({ where: { fromDeptId, toDeptId } });
  //   ctx.body = ctx.helper.getRespBody(true, { fromDeptId, toDeptId });
  // }

  async deptUsers() {
    // todo relation 废弃后，使用关联deptId level order 来查找user
    const ctx = this.ctx;
    const { offspring, id } = ctx.query;
    if (!id) throw '错误的请求参数';
    const ids = [ id ];
    if (offspring === '1') {
      // const fromDeptIds = await ctx.service.dept.getRelationDeptsFrom(id);
      // ids = ids.concat(fromDeptIds);
    }
    const users = await ctx.model.User.findAll({
      attributes: [ 'id', 'name', 'deptId' ],
      where: { deptId: { [ctx.model.Op.in]: ids } },
    });
    ctx.body = ctx.helper.getRespBody(true, users);
  }
}

module.exports = DeptController;
