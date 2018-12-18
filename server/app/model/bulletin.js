'use strict';

const db = require('../db');

// 大项工作的分阶段
module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM, BOOLEAN, CHAR } = app.Sequelize;

  const Bulletin = db.defineModel(
    app,
    'bulletin',
    {
      content: { type: STRING },
      createTime: { type: INTEGER }, // 阶段开始时间
      to: { type: INTEGER, allowNull: true }, // 阶段结束时间
    },
    { updatedAt: 'updateTime', createdAt: 'createTime' }
  );

  return Bulletin;
};
