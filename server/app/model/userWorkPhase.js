'use strict';

const db = require('../db');

// 大项/阶段 和用户表的 关联辅助表
module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM, BOOLEAN, CHAR } = app.Sequelize;

  const UserWorkPhase = db.defineModel(app, 'userWorkPhase', {
    userId: { type: CHAR(32) },
    workPhaseId: { type: CHAR(32) }, // ？这里好像有问题，怎么区别work和phase
    isInCharge: { type: BOOLEAN, defaultValue: false }, // 是否负责人
    order: { type: INTEGER, defaultValue: 1 }, // 负责人或者参与人的排序
  });

  return UserWorkPhase;
};
