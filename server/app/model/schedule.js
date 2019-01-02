'use strict';

const db = require('../db');

module.exports = app => {
  const { STRING, INTEGER, CHAR, BOOLEAN } = app.Sequelize;

  const Schedule = db.defineModel(app, 'schedule', {
    userId: { type: CHAR(32) }, // 日程所属用户id
    fromUserId: { type: CHAR(32) }, // 发布日程的用户，自身或者别人
    title: { type: STRING(32) }, // 日程的标题
    content: { type: STRING(64), defaultValue: '' }, // 日程的内容介绍
    workId: { type: CHAR(32), allowNull: true }, // 日程所属于的大项工作
    taskId: { type: CHAR(32), allowNull: true }, // 日程所属于的任务
    from: { type: INTEGER }, // 日程开始时间
    to: { type: INTEGER }, // 日程结束时间
    createTime: { type: INTEGER }, // 日程创建时间
    accepted: { type: BOOLEAN }, // 是否已经接受，用于别人派发任务的场景 超过一天默认接受 在计划任务中执行
  });

  return Schedule;
};
