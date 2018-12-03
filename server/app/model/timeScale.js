'use strict';

const db = require('../db');

// 用户日程每一项会有起始时间和结束时间，还有可能包括多个起始时间结束时间，即多个时间段
module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM, BOOLEAN, CHAR } = app.Sequelize;

  const TimeScale = db.defineModel(app, 'timeScale', {
    scheduleId: { type: CHAR(32) },
    from: { type: INTEGER, allowNull: true }, // 开始时间，秒，unix时间戳
    to: { type: INTEGER, allowNull: true }, // 结束时间，秒，unix时间戳，from to在同一天
    comment: { type: STRING(64), defaultValue: '' },
  });

  return TimeScale;
};
