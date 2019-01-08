'use strict';

const db = require('../db');

// 部门或者工作的包含的频道
module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM, BOOLEAN, CHAR } = app.Sequelize;

  const DeptChannel = db.defineModel(app, 'deptChannel', {
    deptId: { type: CHAR(32) }, // 属于的部门或者工作的id
    name: { type: STRING(8) }, // 频道名称
    content: { type: STRING(255), defaultValue: '' }, // 频道介绍
    order: { type: INTEGER, defaultValue: 1 }, // 频道排序
  });

  DeptChannel.associate = function() {
    DeptChannel.belongsTo(app.model.Dept, {
      as: 'dept',
      foreignKey: 'deptId',
      constraints: false,
    });
    DeptChannel.hasMany(app.model.DeptArticle, {
      as: 'articles',
      foreignKey: 'channelId',
      constraints: false,
    });
  };

  return DeptChannel;
};
