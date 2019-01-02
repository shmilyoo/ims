'use strict';

const db = require('../db');

// 部门或者工作的包含的频道
module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM, BOOLEAN, CHAR } = app.Sequelize;

  const Channel = db.defineModel(app, 'channel', {
    relativeId: { type: CHAR(32) }, // 属于的部门或者工作的id
    name: { type: STRING(8) }, // 频道名称
    content: { type: STRING(255), defaultValue: '' }, // 频道介绍
    order: { type: INTEGER, defaultValue: 1 }, // 频道排序
  });

  Channel.associate = function() {
    Channel.belongsTo(app.model.Work, {
      as: 'work',
      foreignKey: 'relativeId',
      constraints: false,
    });
    Channel.belongsTo(app.model.Dept, {
      as: 'dept',
      foreignKey: 'relativeId',
      constraints: false,
    });
    Channel.hasMany(app.model.Article, {
      as: 'articles',
      foreignKey: 'channelId',
      constraints: false,
    });
  };

  return Channel;
};
