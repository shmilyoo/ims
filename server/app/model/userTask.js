'use strict';

const db = require('../db');

// task 和用户表的 关联辅助表
module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM, BOOLEAN, CHAR } = app.Sequelize;

  const UserTask = db.defineModel(
    app,
    'userTask',
    {
      userId: { type: CHAR(32) },
      taskId: { type: CHAR(32) },
      isInCharge: { type: BOOLEAN, defaultValue: false }, // 是否负责人
      order: { type: INTEGER, defaultValue: 1 }, // 负责人或者参与人的排序
    },
    { indexes: [{ unique: true, fields: [ 'userId', 'taskId' ] }] }
  );

  return UserTask;
};
