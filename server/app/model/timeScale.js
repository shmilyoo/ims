'use strict';
// 废弃， 用户日程还是决定时间可以自由选择，可以跨日，在界面上加一些快捷键到上午 下午的工作时间即可

const db = require('../db');

// 用户日程每一项会有起始时间和结束时间，还有可能包括多个起始时间结束时间，即多个时间段
module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM, BOOLEAN, CHAR } = app.Sequelize;

  const TimeScale = db.defineModel(app, 'timeScale', {
    scheduleId: { type: CHAR(32) },
    from: { type: INTEGER, allowNull: true }, // 开始时间，秒，unix时间戳
    to: { type: INTEGER, allowNull: true }, // 结束时间，秒，unix时间戳，from to在同一天
    content: { type: STRING(64), defaultValue: '' },
    longTerm: { type: BOOLEAN, defaultValue: false }, // 是否长期日程，比如多日出差，出海，跨度为多于一天的
  });

  return TimeScale;
};
