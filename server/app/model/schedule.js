'use strict';

const db = require('../db');

module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM, BOOLEAN, CHAR } = app.Sequelize;

  const Schedule = db.defineModel(app, 'schedule', {
    userId: { type: CHAR(32) }, // 日程所属用户id
    title: { type: STRING(32) }, // 日程的标题
    content: { type: STRING(64), defaultValue: '' }, // 日程的内容介绍
    workId: { type: CHAR(32), allowNull: true }, // 日程所属于的大项工作
    from: { type: INTEGER }, // 日程开始时间
    to: { type: INTEGER }, // 日程结束时间
  });

  return Schedule;
};
