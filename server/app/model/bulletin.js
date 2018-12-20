'use strict';

const db = require('../db');

// 部门公告表
module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM, BOOLEAN, CHAR } = app.Sequelize;

  const Bulletin = db.defineModel(
    app,
    'bulletin',
    {
      content: { type: STRING },
      createTime: { type: INTEGER }, // 阶段开始时间
      to: { type: INTEGER, allowNull: true }, // 阶段结束时间
    }
    // { timestamps: true, updatedAt: 'updateTime', createdAt: 'createTime' }
  );

  return Bulletin;
};
