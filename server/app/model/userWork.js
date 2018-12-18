'use strict';

const db = require('../db');

// 大项work工作 和用户表的 关联辅助表
module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM, BOOLEAN, CHAR } = app.Sequelize;

  const UserWork = db.defineModel(
    app,
    'userWork',
    {
      userId: { type: CHAR(32) },
      workId: { type: CHAR(32) },
      isInCharge: { type: BOOLEAN, defaultValue: false }, // 是否负责人
      order: { type: INTEGER, defaultValue: 1 }, // 负责人或者参与人的排序
    },
    { indexes: [{ unique: true, fields: [ 'userId', 'workId' ] }] }
  );

  return UserWork;
};
