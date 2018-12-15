'use strict';

const db = require('../db');

// 大项工作的具体子工作
module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM, BOOLEAN, CHAR } = app.Sequelize;

  const Phase = db.defineModel(app, 'phase', {
    workId: { type: CHAR(32) }, // 属于的大项工作id
    title: { type: STRING(32) }, // 阶段名称
    from: { type: INTEGER }, // 阶段开始时间
    to: { type: INTEGER, allowNull: true }, // 阶段结束时间
  });

  return Phase;
};
