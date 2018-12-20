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

  async deptWorks() {
    const ctx = this.ctx;
    const {
      deptId,
      numberPerPage,
      currentPage,
      withDept,
      withPublisher,
    } = ctx.request.query;
    const include = [];
    if (withDept) {
      include.push({
        model: ctx.model.Dept,
        as: 'dept',
        attributes: [ 'id', 'name' ],
      });
    }
    if (withPublisher) {
      include.push({
        model: ctx.model.User,
        as: 'publisher',
        attributes: [ 'id', 'name' ],
      });
    }
    const perPge = Number.parseInt(numberPerPage);
    const nowPage = Number.parseInt(currentPage);
    const { count, rows } = await ctx.model.Work.findAndCountAll({
      include,
      where: { deptId },
      limit: perPge,
      offset: (nowPage - 1) * perPge,
    });
    ctx.body = ctx.helper.getRespBody(true, {
      workList: rows,
      totalNumber: count,
    });
  }
}

module.exports = DeptController;
