'use strict';

const db = require('../db');

// 工作或者部门的 各个频道的文章
module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM, BOOLEAN, CHAR, TEXT } = app.Sequelize;

  const DeptArticle = db.defineModel(app, 'deptArticle', {
    channelId: { type: CHAR(32) }, // 属于的频道id
    title: { type: STRING(32) }, // 文章标题
    content: { type: TEXT, defaultValue: '' }, // 文章正文
    createTime: { type: INTEGER }, // 添加时间
    updateTime: { type: INTEGER }, // 修改时间
    publisherId: { type: CHAR(32) }, // 发布文章的用户
    lastEdit: { type: STRING(64), allowNull: true }, // 文章在。。时间由xxx修改
  });
  DeptArticle.associate = function() {
    DeptArticle.belongsTo(app.model.DeptChannel, {
      as: 'channel',
      foreignKey: 'channelId',
      constraints: false,
    });
    DeptArticle.belongsTo(app.model.User, {
      as: 'publisher',
      foreignKey: 'publisherId',
      constraints: false,
    });
    DeptArticle.hasMany(app.model.Attachment, {
      as: 'attachments',
      foreignKey: 'relativeId',
      constraints: false,
    });
  };
  return DeptArticle;
};
