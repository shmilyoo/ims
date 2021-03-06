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
      content = '',
      attachments,
      usersInCharge,
      usersAttend,
      phases,
    } = ctx.request.body;
    const transaction = await ctx.model.transaction();
    try {
      const now = ctx.helper.timeFunctions.getNowUnix();
      const _content = content.startsWith('<div>')
        ? content
        : `<div>${content}</div>`;
      const work = await ctx.model.Work.create({
        publisherId: ctx.user.id,
        title,
        from,
        to,
        tagId,
        deptId,
        content: _content,
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
        work.phases = await ctx.service.work.dealPhases(phases, work.id);
      }
      if (attachments && attachments.length > 0) {
        await ctx.service.work.dealAttachments(attachments, work.id);
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
    const transaction = await ctx.model.transaction();
    try {
      const works = await ctx.model.Work.findAll({
        where: {
          id: ids.length > 1 ? { [ctx.model.Op.in]: ids } : ids[0],
        },
        include: [
          {
            model: ctx.model.WorkChannel,
            as: 'channels',
            attributes: [ 'id' ],
            include: [
              {
                model: ctx.model.WorkArticle,
                as: 'articles',
                attributes: [ 'id' ],
              },
            ],
          },
          {
            model: ctx.model.Task,
            as: 'tasks',
            attributes: [ 'id' ],
          },
          {
            model: ctx.model.Phase,
            as: 'phases',
            attributes: [ 'id' ],
          },
          {
            model: ctx.model.Attachment,
            as: 'attachments',
            attributes: [ 'id' ],
          },
        ],
      });
      const tasksInWorks = [];
      const channelsInWorks = [];
      const articlesInWorks = [];
      const attachmentsInWorks = [];
      works.forEach(({ channels, tasks, attachments }) => {
        channels.forEach(({ id, articles }) => {
          channelsInWorks.push(id);
          articles.forEach(({ id }) => {
            articlesInWorks.push(id);
          });
        });
        tasks.forEach(({ id }) => {
          tasksInWorks.push(id);
        });
        attachments.forEach(({ id }) => {
          attachmentsInWorks.push(id);
        });
      });
      if (tasksInWorks.length) {
        await ctx.service.work.delTasks(tasksInWorks);
      }
      if (articlesInWorks.length) {
        await ctx.service.work.delArticles(articlesInWorks);
      }
      if (channelsInWorks.length) {
        await ctx.service.work.delChannels(channelsInWorks);
      }
      if (attachmentsInWorks.length) {
        await ctx.service.work.delAttachments(attachmentsInWorks);
      }
      const number = await ctx.model.Work.destroy({
        where: {
          id: ids.length > 1 ? { [ctx.model.Op.in]: ids } : ids[0],
        },
      });
      await transaction.commit();
      ctx.body = ctx.helper.getRespBody(true, number);
    } catch (error) {
      console.log(error.message);
      await transaction.rollback();
      ctx.body = ctx.helper.getRespBody(false, '删除失败');
    }
  }

  async workInfo() {
    const ctx = this.ctx;
    const {
      id,
      withDept,
      withUsers,
      withUsersInCharge,
      withUsersAttend,
      withPublisher,
      withChannels, // 如果同时获取频道尤其是文章的时候，orm会另开一个sql查询，比较麻烦，
      // withChannelsArticles, // 实现中还是单独获取文章频道列表为好
      withTag,
      withPhases,
      withAttachments,
      order,
    } = ctx.request.body;
    if (!id) ctx.throw('错误的请求参数-id');
    const include = ctx.service.work.getWorkIncludeModelSync({
      withDept,
      withUsers,
      withUsersInCharge,
      withUsersAttend,
      withPublisher,
      withChannels,
      withTag,
      withPhases,
      withAttachments,
    });
    const _order = ctx.service.work.getWorkOrderSync(order);
    const work = await ctx.model.Work.findOne({
      where: { id },
      include,
      order: _order,
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
          required: false,
          through: {
            attributes: [],
          },
          attributes: [ 'id', 'name', 'deptId' ],
        },
        {
          model: ctx.model.User,
          as: 'usersAttend',
          through: {
            attributes: [],
          },
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
        // 使用col函数也可以，或者使用级联的model获取many to many through model的键值排序
        // [ ctx.model.col('usersInCharge->userWork.order'), 'asc' ],
        [
          {
            model: ctx.model.User,
            as: 'usersInCharge',
          },
          ctx.model.UserWork,
          'order',
        ],
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
        content = '',
        attachments,
        usersInCharge,
        usersAttend,
        phases,
      },
    } = ctx.request.body;
    if (!id) ctx.throw('错误的请求参数！');
    // await ctx.service.common.sleep(2);
    const transaction = await ctx.model.transaction();
    try {
      const _content = content.startsWith('<div>')
        ? content
        : `<div>${content}</div>`;
      await ctx.model.Work.update(
        { title, from, to, tagId, deptId, content: _content },
        { where: { id } }
      );
      await ctx.model.UserWork.destroy({ where: { workId: id } });
      await ctx.service.work.addUserWorkTaskWithInChargeAndAttendArray(
        usersInCharge,
        usersAttend,
        id,
        true
      );
      if (attachments && attachments.length > 0) {
        await ctx.service.work.dealAttachments(attachments, id);
      }
      if (phases && phases.length > 0) {
        await ctx.service.work.dealPhases(phases, id);
      }
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
    const channels = await ctx.service.channel.getChannels('work', workId);
    ctx.body = ctx.helper.getRespBody(true, channels);
  }

  async addWorkChannel() {
    const ctx = this.ctx;
    const {
      workId,
      values: { name, content, order },
    } = ctx.request.body;
    if (!workId || !name) ctx.throw('错误的请求参数！');
    await ctx.model.WorkChannel.create({
      workId,
      name,
      content,
      order,
    });
    const channels = await ctx.service.channel.getChannels('work', workId);
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
    const channels = await ctx.service.channel.getChannels('work', workId);
    ctx.body = ctx.helper.getRespBody(true, channels);
  }

  async getWorkTasks() {
    const ctx = this.ctx;
    const {
      workId,
      numberPerPage,
      currentPage,
      withPublisher,
      withUsers,
      withWork,
      withDept,
      order,
      filter,
    } = ctx.request.body;
    if (!workId) ctx.throw('错误的任务请求参数');
    const _order = ctx.service.work.getWorkTaskOrderSync(order);
    const include = ctx.service.work.getWorkTasksIncludeSync({
      withPublisher,
      withUsers,
      withWork,
      withDept,
    });
    const where = { workId };
    if (filter.searchValue && filter.searchType) {
      if (filter.searchType === 'title') {
        const searchTitleFragments = filter.searchValue
          .split(/\s+/)
          .map(key => `%${key}%`);
        where[filter.searchType] = {
          [ctx.model.Op.like]: { [ctx.model.Op.any]: searchTitleFragments },
        };
      }
      if (
        [ 'from', 'to', 'createTime', 'updateTime' ].includes(filter.searchType)
      ) {
        where[filter.searchType] = {
          [ctx.model.Op.lt]: filter.searchValue.to,
          [ctx.model.Op.gt]: filter.searchValue.from,
        };
      }
    }
    const { count, rows } = await ctx.model.Task.findAndCountAll({
      where,
      include,
      attributes: { exclude: [ 'content' ] },
      limit: numberPerPage,
      offset: (currentPage - 1) * numberPerPage,
      order: _order,
    });
    ctx.body = ctx.helper.getRespBody(true, {
      totalNumber: count,
      taskList: rows || [],
    });
  }

  async getTaskInfo() {
    const ctx = this.ctx;
    const {
      id,
      withWork,
      withDept,
      withUsers,
      withUsersInCharge,
      withUsersAttend,
      withPublisher,
      withAttachments,
      order,
    } = ctx.request.body;
    if (!id) ctx.throw('错误的请求参数-id');
    const include = ctx.service.work.getTaskIncludeModelSync({
      withWork,
      withDept,
      withUsers,
      withUsersInCharge,
      withUsersAttend,
      withPublisher,
      withAttachments,
    });
    const _order = ctx.service.work.getTaskOrderSync(order);
    const task = await ctx.model.Task.findOne({
      where: { id },
      include,
      order: _order,
    });
    ctx.body = ctx.helper.getRespBody(!!task, task || '找不到请求的任务记录');
  }

  async addTask() {
    const ctx = this.ctx;
    const {
      values: {
        from,
        to,
        title,
        content,
        usersInCharge,
        usersAttend,
        attachments,
        addSchedules,
        schedules,
      },
      deptId,
      workId,
    } = ctx.request.body;
    const transaction = await ctx.model.transaction();
    try {
      const now = ctx.helper.timeFunctions.getNowUnix();
      const task = await ctx.model.Task.create({
        publisherId: ctx.user.id,
        title,
        from,
        to,
        workId,
        content,
        createTime: now,
        updateTime: now,
      });
      task.userWorks = await ctx.service.work.addUserWorkTaskWithInChargeAndAttendArray(
        usersInCharge,
        usersAttend,
        task.id,
        false
      );
      if (attachments && attachments.length > 0) {
        await ctx.service.work.dealAttachments(attachments, task.id);
      }
      if (addSchedules && schedules && schedules.length > 0) {
        // schedules:[{title,date,from,to,content,toUsers:[{id,name}..]}]
        // database:{userId,fromUserId,title,content,workId,taskId,from,to,createTime,accepted}
        const fromUserId = ctx.user.id;
        const saveSchedules = [];
        const now = ctx.helper.timeFunctions.getNowUnix();
        schedules.forEach(({ title, date, from, to, content, toUsers }) => {
          const fromUnix = date + from;
          const toUnix = date + to;
          toUsers.forEach(({ id: userId }) => {
            saveSchedules.push({
              userId,
              fromUserId,
              title,
              content,
              workId,
              taskId: task.id,
              from: fromUnix,
              to: toUnix,
              createTime: now,
              accepted: false,
            });
          });
        });
        await ctx.model.Schedule.bulkCreate(saveSchedules);
      }
      await transaction.commit();
      ctx.body = ctx.helper.getRespBody(true, {
        taskId: task.id,
        workId,
        deptId,
      });
    } catch (error) {
      await transaction.rollback();
      ctx.body = ctx.helper.getRespBody(false, error.message);
    }
  }

  async editTask() {
    const ctx = this.ctx;
    const {
      id,
      title,
      from,
      to,
      content = '',
      attachments,
      usersInCharge,
      usersAttend,
    } = ctx.request.body;
    if (!id) ctx.throw('错误的请求参数！');
    const transaction = await ctx.model.transaction();
    try {
      const _content = content.startsWith('<div>')
        ? content
        : `<div>${content}</div>`;
      await ctx.model.Task.update(
        { title, from, to, content: _content },
        { where: { id } }
      );
      await ctx.model.UserTask.destroy({ where: { taskId: id } });
      await ctx.service.work.addUserWorkTaskWithInChargeAndAttendArray(
        usersInCharge,
        usersAttend,
        id,
        false
      );
      if (attachments && attachments.length > 0) {
        await ctx.service.work.dealAttachments(attachments, id);
      }
      await transaction.commit();
      ctx.body = ctx.helper.getRespBody(true);
    } catch (error) {
      await transaction.rollback();
      ctx.body = ctx.helper.getRespBody(false, error.message);
    }
  }

  async addWorkArticle() {
    const ctx = this.ctx;
    const {
      values: { title, channelId, content, attachments },
    } = ctx.request.body;
    const transaction = await ctx.model.transaction();
    try {
      const now = ctx.helper.timeFunctions.getNowUnix();
      const article = await ctx.service.article.addArticle(
        {
          publisherId: ctx.user.id,
          title,
          content,
          channelId,
          createTime: now,
          updateTime: now,
        },
        'work'
      );
      if (attachments && attachments.length > 0) {
        await ctx.service.work.dealAttachments(attachments, article.id);
      }
      await transaction.commit();
      ctx.body = ctx.helper.getRespBody(true, {
        articleId: article.id,
        channelId,
      });
    } catch (error) {
      await transaction.rollback();
      ctx.body = ctx.helper.getRespBody(false, error.message);
    }
  }

  async updateWorkArticle() {
    const ctx = this.ctx;
    const { channelId, title, content, id, attachments } = ctx.request.body;
    if (!id) ctx.throw('错误的请求参数');
    const transaction = await ctx.model.transaction();
    try {
      const now = ctx.helper.timeFunctions.getNowUnix();
      const nowFormat = ctx.helper.timeFunctions.formatFromUnix(
        now,
        'datetime'
      );
      const { name } = await ctx.model.User.findOne({
        where: { id: ctx.user.id },
      });
      const [ count ] = await ctx.model.WorkArticle.update(
        {
          channelId,
          title,
          content,
          updateTime: now,
          lastEdit: `文章在${nowFormat}由<a href='/user/info?id=${
            ctx.user.id
          }'>${name}</a>进行编辑`,
        },
        { where: { id } }
      );
      if (count !== 1) throw `错误的更新数量，更新了${count}个文章`;
      if (attachments && attachments.length > 0) {
        await ctx.service.work.dealAttachments(attachments, id);
      }
      await transaction.commit();
      ctx.body = ctx.helper.getRespBody(true);
    } catch (error) {
      await transaction.rollback();
      ctx.body = ctx.helper.getRespBody(false, error.message);
    }
  }

  async getWorkArticle() {
    const ctx = this.ctx;
    const {
      id,
      withPublisher,
      withChannel,
      withWork,
      withDept,
      withAttachments,
    } = ctx.request.body;
    if (!id) ctx.throw('错误的请求参数');
    const include = ctx.service.work.getWorkArticleIncludeSync({
      withPublisher,
      withChannel,
      withWork,
      withDept,
      withAttachments,
    });
    const article = await ctx.model.WorkArticle.findOne({
      where: { id },
      include,
    });
    ctx.body = ctx.helper.getRespBody(true, article);
  }
}

module.exports = WorkController;
