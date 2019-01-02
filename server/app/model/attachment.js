'use strict';

const db = require('../db');

// 工作或者部门的 各个频道的文章
module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM, BOOLEAN, CHAR, TEXT } = app.Sequelize;

  const Attachment = db.defineModel(app, 'attachment', {
    relativeId: { type: CHAR(32) }, // 属于的task或work或article或者讨论topic post的id
    name: { type: STRING(32) }, // 附件名称
    path: { type: STRING(128) }, // 附件路径
    ext: { type: STRING(16) }, // 附件路径
  });

  return Attachment;
};
