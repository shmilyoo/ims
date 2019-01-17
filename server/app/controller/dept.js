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
    const ctx = this.ctx;
    const { offspring, id } = ctx.query;
    if (!id) throw '错误的请求参数';
    const depts =
      offspring === '1'
        ? await ctx.service.dept.getDeptWithOffspring(id)
        : [ id ];
    const ids = depts.map(dept => dept.id);
    const order =
      offspring === '1'
        ? [[ ctx.model.Dept, 'level' ], [ ctx.model.Dept, 'order' ], [ 'name' ]]
        : [[ 'name' ]];
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
      order,
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
      orderBy,
      direction,
    } = ctx.request.body;
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
    const { count, rows } = await ctx.model.Work.findAndCountAll({
      include,
      attributes: { exclude: [ 'content' ] },
      where: { deptId },
      limit: numberPerPage,
      offset: (currentPage - 1) * numberPerPage,
      order: [[ orderBy, direction ]],
    });
    ctx.body = ctx.helper.getRespBody(true, {
      workList: rows || [],
      totalNumber: count,
    });
  }

  async getDeptChannels() {
    const ctx = this.ctx;
    const { deptId } = ctx.query;
    if (!deptId) ctx.throw('错误的请求参数！');
    const channels = await ctx.service.channel.getChannels('dept', deptId);
    ctx.body = ctx.helper.getRespBody(true, channels);
  }

  async updateDeptChannel() {
    const ctx = this.ctx;
    const {
      DeptId,
      values: { name, content, order, id },
    } = ctx.request.body;
    if (!id || !name) ctx.throw('错误的请求参数！');
    await ctx.model.DeptChannel.update(
      { name, content, order },
      { where: { id } }
    );
    const channels = await ctx.service.channel.getChannels('dept', DeptId);
    ctx.body = ctx.helper.getRespBody(true, channels);
  }

  async addDeptChannel() {
    const ctx = this.ctx;
    const {
      deptId,
      values: { name, content, order },
    } = ctx.request.body;
    if (!deptId || !name) ctx.throw('错误的请求参数！');
    await ctx.model.DeptChannel.create({
      deptId,
      name,
      content,
      order,
    });
    const channels = await ctx.service.channel.getChannels('dept', deptId);
    ctx.body = ctx.helper.getRespBody(true, channels);
  }
}

module.exports = DeptController;
