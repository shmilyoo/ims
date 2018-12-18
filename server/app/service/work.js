'use strict';

const Service = require('egg').Service;

class WorkService extends Service {
  /**
   * 将工作负责人和参加人列表加入到相应的工作或者task中
   * @param {array} usersInCharge 工作负责人列表
   * @param {array} usersAttend 工作参加人列表
   * @param {string} workTaskId  work或者task的id
   * @param {?bool} isWork 是否是work,模式是work
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
    return this.ctx.model.Phase.bulkCreate(
      phases.map(phase => Object.assign(phase, { workId }))
    );
  }
}

module.exports = WorkService;
