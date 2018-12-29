'use strict';

const Controller = require('egg').Controller;

class WorkController extends Controller {
  async addWork() {
    const ctx = this.ctx;
    const {
      title,
      from,
      to,
      tagId,
      deptId,
      content,
      usersInCharge,
      usersAttend,
      phases,
    } = ctx.request.body;
    const transaction = await ctx.model.transaction();
    try {
      const now = ctx.helper.timeFunctions.getNowUnix();
      const work = await ctx.model.Work.create({
        publisherId: ctx.user.id,
        title,
        from,
        to,
        tagId,
        deptId,
        content,
        createTime: now,
        updateTime: now,
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

  async delWork() {
    const ctx = this.ctx;
    const { ids } = ctx.request.body;
    if (!ids || ids.length < 1) {
      ctx.body = ctx.helper.getRespBody(false, '错误的请求参数');
      return;
    }
    // todo 删除相关的phase task 文章 讨论 文件 等
    const transaction = await ctx.model.transaction();
    try {
      await ctx.model.Work.destroy({
        where: {
          id: {
            [ctx.model.Op.in]: ids,
          },
        },
      });
      await transaction.commit();
      ctx.body = ctx.helper.getRespBody(true);
    } catch (error) {
      await transaction.rollback();
      ctx.body = ctx.helper.getRespBody(false, '删除失败');
    }
  }

  async workInfo() {
    const ctx = this.ctx;
    const {
      id,
      withDept,
      withUsersInCharge,
      withUsersAttend,
      withPublisher,
      withChannels,
      withTag,
      withPhases,
    } = ctx.query;
    if (!id) ctx.throw('错误的请求参数-id');
    const include = ctx.service.work.getWorkIncludeModelSync({
      withDept,
      withUsersInCharge,
      withUsersAttend,
      withPublisher,
      withChannels,
      withTag,
      withPhases,
    });
    const work = await ctx.model.Work.findOne({
      where: { id },
      include,
    });
    ctx.body = ctx.helper.getRespBody(!!work, work || '找不到请求的工作记录');
  }

  async workBasicInfo() {
    const ctx = this.ctx;
    const { id } = ctx.query;
    if (!id) ctx.throw('错误的请求参数！');
    const work = await ctx.model.Work.findOne({
      include: [
        {
          model: ctx.model.User,
          as: 'usersInCharge',
          attributes: [ 'id', 'name', 'deptId' ],
        },
        {
          model: ctx.model.User,
          as: 'usersAttend',
          attributes: [ 'id', 'name', 'deptId' ],
        },
        {
          model: ctx.model.User,
          as: 'publisher',
          attributes: [ 'id', 'name', 'deptId' ],
        },
        {
          model: ctx.model.Phase,
          as: 'phases',
        },
      ],
      where: { id },
      order: [
        [
          {
            model: ctx.model.Phase,
            as: 'phases',
          },
          'from',
        ],
      ],
    });
    ctx.body = ctx.helper.getRespBody(!!work, work ? work : '找不到相关的表项');
  }

  async updateWorkBasic() {
    const ctx = this.ctx;
    const {
      id,
      values: {
        title,
        from,
        to,
        tagId,
        deptId,
        content,
        usersInCharge,
        usersAttend,
        phases,
      },
    } = ctx.request.body;
    if (!id) ctx.throw('错误的请求参数！');
    await ctx.service.common.sleep(2);
    const transaction = await ctx.model.transaction();
    try {
      await ctx.model.Work.update(
        { title, from, to, tagId, deptId, content },
        { where: { id } }
      );
      await ctx.model.UserWork.destroy({ where: { workId: id } });
      await ctx.service.work.addUserWorkTaskWithInChargeAndAttendArray(
        usersInCharge,
        usersAttend,
        id,
        true
      );
      await ctx.model.Phase.destroy({ where: { workId: id } });
      await ctx.service.work.addPhases(phases, id);
      await transaction.commit();
      ctx.body = ctx.helper.getRespBody(true);
    } catch (error) {
      await transaction.rollback();
      ctx.body = ctx.helper.getRespBody(false, error.message);
    }
  }
  async getWorkChannels() {
    const ctx = this.ctx;
    const { workId } = ctx.query;
    if (!workId) ctx.throw('错误的请求参数！');
    const channels = await ctx.service.work.getWorkChannel(workId);
    ctx.body = ctx.helper.getRespBody(true, channels);
  }

  async addWorkChannel() {
    const ctx = this.ctx;
    const {
      workId,
      values: { name, content, order },
    } = ctx.request.body;
    if (!workId || !name) ctx.throw('错误的请求参数！');
    await ctx.model.WorkChannel.create({ workId, name, content, order });
    const channels = await ctx.service.work.getWorkChannel(workId);
    ctx.body = ctx.helper.getRespBody(true, channels);
  }

  async updateWorkChannel() {
    const ctx = this.ctx;
    const {
      workId,
      values: { name, content, order, id },
    } = ctx.request.body;
    if (!id || !name) ctx.throw('错误的请求参数！');
    await ctx.model.WorkChannel.update(
      { name, content, order },
      { where: { id } }
    );
    const channels = await ctx.service.work.getWorkChannel(workId);
    ctx.body = ctx.helper.getRespBody(true, channels);
  }

  async deleteWorkChannel() {
    // todo 待验证
    const ctx = this.ctx;
    const { id, workId } = ctx.request.body;
    if (!id || !workId) ctx.throw('错误的请求参数！');
    const count = await ctx.model.Article.count({
      include: [
        {
          model: ctx.model.WorkChannel,
          as: 'channel',
          where: { workId },
        },
      ],
    });
    if (count) {
      ctx.body = ctx.helper.getRespBody(false, '无法删除包含文章的频道');
      return;
    }
    await ctx.model.WorkChannel.destroy({ where: { id } });
    const channels = await ctx.service.work.getWorkChannel(workId);
    ctx.body = ctx.helper.getRespBody(true, channels);
  }

  async getWorkChannelArticles() {
    const ctx = this.ctx;
    const {
      where = 'work', // 获取work的还是channel的文章
      workId,
      channelId,
      numberPerPage,
      currentPage,
      orderBy = 'creatTime',
      orderDirection = 'desc',
      withChannel = true,
      withWork = false,
      withPublisher = true,
    } = ctx.query;
    const include = ctx.service.getArticleIncludeSync(
      withPublisher,
      withChannel,
      withWork
    );
    const perPge = Number.parseInt(numberPerPage);
    const nowPage = Number.parseInt(currentPage);
    const { count, articles } = await ctx.model.Article.findAndCountAll({
      include,
      where: where === 'work' ? { workId } : { channelId },
      limit: perPge,
      offset: (nowPage - 1) * perPge,
      order: [[ orderBy, orderDirection ]],
    });
    ctx.body = ctx.helper.getRespBody(true, {
      articleList: articles,
      totalNumber: count,
    });
  }
}

module.exports = WorkController;
