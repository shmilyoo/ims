'use strict';

const db = require('../db');

// 大项工作的具体子工作
module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM, BOOLEAN, CHAR } = app.Sequelize;

  const WorkChannel = db.defineModel(app, 'workChannel', {
    workId: { type: CHAR(32) }, // 属于的大项工作id
    name: { type: STRING(8) }, // 频道名称
    content: { type: STRING(255), defaultValue: '' }, // 频道介绍
    order: { type: INTEGER, defaultValue: 1 }, // 频道排序
  });

  WorkChannel.associate = function() {
    WorkChannel.belongsTo(app.model.Work, {
      as: 'work',
      foreignKey: 'workId',
      constraints: false,
    });
  };

  return WorkChannel;
};
