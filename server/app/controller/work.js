'use strict';

const Controller = require('egg').Controller;

class WorkController extends Controller {
  async addWork() {
    const ctx = this.ctx;
    const {
      title,
      from,
      to,
      deptId,
      content,
      usersInCharge,
      usersAttend,
      phases,
    } = ctx.request.body;
    const transaction = await ctx.model.transaction();
    try {
      const work = await ctx.model.Work.create({
        publisherId: ctx.user.id,
        title,
        from,
        to,
        deptId,
        content,
      });
      work.userWorks = await ctx.service.work.addUserWorkTaskWithInChargeAndAttendArray(
        usersInCharge,
        usersAttend,
        work.id,
        true
      );
      if (phases && phases.length > 0) {
        work.phases = await ctx.service.work.addPhases(phases, work.id);
      }
      await transaction.commit();
      ctx.body = ctx.helper.getRespBody(true, work);
    } catch (error) {
      await transaction.rollback();
      ctx.body = ctx.helper.getRespBody(false, error.message);
    }
  }
}

module.exports = WorkController;
