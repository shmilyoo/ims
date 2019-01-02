'use strict';

const db = require('../db');

// 工作或者部门的 各个频道的文章
module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM, BOOLEAN, CHAR, TEXT } = app.Sequelize;

  const Article = db.defineModel(app, 'article', {
    channelId: { type: CHAR(32) }, // 属于的频道id
    relativeId: { type: CHAR(32) }, // 属于的工作或者work的id
    title: { type: STRING(32) }, // 文章标题
    content: { type: TEXT, defaultValue: '' }, // 文章正文
    createTime: { type: INTEGER }, // 添加时间
    updateTime: { type: INTEGER }, // 修改时间
    publisherId: { type: CHAR(32) }, // 发布文章的用户
  });
  Article.associate = function() {
    Article.belongsTo(app.model.Channel, {
      as: 'channel',
      foreignKey: 'channelId',
      constraints: false,
    });
    Article.belongsTo(app.model.Work, {
      as: 'work',
      foreignKey: 'relativeId',
      constraints: false,
    });
    Article.belongsTo(app.model.Dept, {
      as: 'dept',
      foreignKey: 'relativeId',
      constraints: false,
    });
    Article.belongsTo(app.model.User, {
      as: 'publisher',
      foreignKey: 'publisherId',
      constraints: false,
    });
  };
  return Article;
};
