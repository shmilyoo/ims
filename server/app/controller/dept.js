'use strict';

const Controller = require('egg').Controller;

class DeptController extends Controller {
  async all() {
    // 获取deptArray
    const ctx = this.ctx;
    const deptArray = await ctx.service.cache.getDeptArray();
    ctx.body = ctx.helper.getRespBody(true, deptArray);
  }

  // /**
  //  * 用户初次加载主页面时，获取depts列表和dept关系绑定对象
  //  */
  // async deptsAndRelation() {
  //   const ctx = this.ctx;
  //   const deptArray = await ctx.service.cache.getDeptArray();
  //   ctx.body = ctx.helper.getRespBody(true, { deptArray });
  // }

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

  /**
   * query: offspring=1 包含下级所有部门的用户
   * query: id 必须，部门id
   */
  async deptUsers() {
    // todo relation 废弃后，使用关联deptId level order 来查找user
    const ctx = this.ctx;
    const { offspring, id } = ctx.query;
    if (!id) throw '错误的请求参数';
    const depts =
      offspring === '1'
        ? await ctx.service.dept.getDeptWithOffspring(id)
        : [ id ];
    const ids = depts.map(dept => dept.id);
    const users = await ctx.model.User.findAll({
      include: [
        {
          model: ctx.model.Dept,
          as: 'dept',
          attributes: [ 'name' ], // 为了在用户名后面显示部门名称
        },
      ],
      attributes: [ 'id', 'name' ],
      where: { deptId: { [ctx.model.Op.in]: ids } },
      order: [[ ctx.model.Dept, 'level' ], [ ctx.model.Dept, 'order' ]],
    });
    ctx.body = ctx.helper.getRespBody(true, users);
  }

  async deptManagers() {
    const ctx = this.ctx;
    const { id } = ctx.query;
    if (!id) throw '错误的请求参数';
    const dept = await ctx.model.Dept.findOne({
      include: [
        {
          model: ctx.model.User,
          as: 'managers',
          attributes: [ 'id', 'name' ],
          required: false,
          through: {
            attributes: [],
          },
        },
      ],
      where: { id },
    });
    ctx.body = ctx.helper.getRespBody(!!dept, dept ? dept : '找不到相应的部门');
  }

  async setDeptManagers() {
    const ctx = this.ctx;
    const { id, managers } = ctx.request.body;
    let ok = false;
    const transaction = await ctx.model.transaction();
    try {
      await ctx.model.DeptManager.destroy({ where: { deptId: id } });
      await ctx.model.DeptManager.bulkCreate(
        managers.map(user => ({ deptId: id, userId: user.id }))
      );
      await transaction.commit();
      ok = true;
    } catch (error) {
      await transaction.rollback();
      ok = false;
    }
    ctx.body = ctx.helper.getRespBody(ok, ok ? managers : '后台错误');
  }
}

module.exports = DeptController;
