'use strict';

const db = require('../db');

// 大项工作数据表
module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM, BOOLEAN, CHAR } = app.Sequelize;

  const Work = db.defineModel(app, 'work', {
    title: { type: STRING(32) }, // 大项工作名称
    publisherId: { type: CHAR(32) }, // 发布工作的用户
    from: { type: INTEGER }, // 工作开始时间，unix时间戳，秒
    to: { type: INTEGER, allowNull: true }, // 工作结束时间
  });

  return Work;
};
