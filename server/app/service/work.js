'use strict';

const Service = require('egg').Service;

class WorkService extends Service {
  /**
   * 将工作负责人和参加人列表加入到相应的工作或者task中
   * @param {array} usersInCharge 工作负责人列表
   * @param {array} usersAttend 工作参加人列表
   * @param {string} workTaskId  work或者task的id
   * @param {?bool} isWork 是否是work,还是task
   * @return {array} 返回创建的userWork或者userTask 列表
   */
  async addUserWorkTaskWithInChargeAndAttendArray(
    usersInCharge,
    usersAttend,
    workTaskId,
    isWork = true
  ) {
    const usersArrayInWorkTask = usersInCharge.map((user, index) => ({
      userId: user.id,
      [isWork ? 'workId' : 'taskId']: workTaskId,
      isInCharge: true,
      order: index + 1,
    }));
    if (usersAttend && usersAttend.length > 0) {
      usersAttend.forEach((user, index) => {
        usersArrayInWorkTask.push({
          userId: user.id,
          [isWork ? 'workId' : 'taskId']: workTaskId,
          isInCharge: false,
          order: index + 1,
        });
      });
    }
    return await (isWork
      ? this.ctx.model.UserWork
      : this.ctx.model.UserTask
    ).bulkCreate(usersArrayInWorkTask);
  }

  async addPhases(phases, workId) {
    if (phases && phases.length > 0) {
      return this.ctx.model.Phase.bulkCreate(
        phases.map(phase => Object.assign(phase, { workId }))
      );
    }
    return null;
  }
  async getWorkChannel(workId) {
    const channels = await this.ctx.model.WorkChannel.findAll({
      where: { workId },
      order: [ 'order' ],
    });
    return channels;
  }

  getArticleIncludeSync(withPublisher, withChannel, withWork) {
    const ctx = this.ctx;
    const include = [];
    if (withPublisher) {
      include.push({
        model: ctx.model.User,
        as: 'publisher',
        attributes: [ 'id', 'name' ],
      });
    }
    if (withChannel) {
      include.push({
        model: ctx.model.WorkChannel,
        as: 'channel',
        attributes: [ 'id', 'name' ],
      });
    }
    if (withWork) {
      include.push({
        model: ctx.model.Work,
        as: 'work',
        attributes: [ 'id', 'title' ],
      });
    }
    return include;
  }

  getWorkIncludeModelSync({
    withDept = false,
    withUsersInCharge = false,
    withUsersAttend = false,
    withPublisher = false,
    withChannels = false,
    withTag = false,
    withPhases = false,
  }) {
    const ctx = this.ctx;
    const include = [];
    if (withDept) {
      include.push({
        model: ctx.model.Dept,
        as: 'dept',
        attributes: [ 'id', 'name' ],
      });
    }
    if (withUsersInCharge) {
      include.push({
        model: ctx.model.User,
        as: 'usersInCharge',
        attributes: [ 'id', 'name', 'deptId' ],
      });
    }
    if (withUsersAttend) {
      include.push({
        model: ctx.model.User,
        as: 'usersAttend',
        attributes: [ 'id', 'name', 'deptId' ],
      });
    }
    if (withPublisher) {
      include.push({
        model: ctx.model.User,
        as: 'publisher',
        attributes: [ 'id', 'name', 'deptId' ],
      });
    }
    if (withChannels) {
      include.push({
        model: ctx.model.WorkChannel,
        as: 'channels',
        attributes: [ 'id', 'name' ],
      });
    }
    if (withTag) {
      include.push({
        model: ctx.model.Tag,
        as: 'tag',
      });
    }
    if (withPhases) {
      include.push({
        model: ctx.model.Phase,
        as: 'phases',
      });
    }
    return include;
  }
}

module.exports = WorkService;
