'use strict';

const db = require('../db');

// 部门或者工作的包含的频道
module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM, BOOLEAN, CHAR } = app.Sequelize;

  const WorkChannel = db.defineModel(app, 'workChannel', {
    workId: { type: CHAR(32) }, // 属于工作的id
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
    WorkChannel.hasMany(app.model.WorkArticle, {
      as: 'articles',
      foreignKey: 'channelId',
      constraints: false,
    });
  };

  return WorkChannel;
};
