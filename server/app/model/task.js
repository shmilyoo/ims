'use strict';

const db = require('../db');

// 大项工作的具体子工作/任务
module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT, BOOLEAN, CHAR } = app.Sequelize;

  const Task = db.defineModel(app, 'task', {
    workId: { type: CHAR(32) }, // 属于的大项工作id
    publisherId: { type: CHAR(32) }, // 发布工作的用户
    title: { type: STRING(32) }, // 子工作名称
    from: { type: INTEGER }, // 子工作开始时间
    to: { type: INTEGER }, // 子工作结束时间 不允许不填
    content: { type: TEXT, defaultValue: '' }, // 任务介绍
    createTime: { type: INTEGER }, // 添加时间
    updateTime: { type: INTEGER }, // 修改时间
  });

  Task.associate = function() {
    Task.belongsTo(app.model.Work, {
      as: 'work',
      foreignKey: 'workId',
      constraints: false,
    });
    Task.belongsTo(app.model.User, {
      as: 'publisher',
      foreignKey: 'publisherId',
      constraints: false,
    });
    Task.belongsToMany(app.model.User, {
      as: 'users',
      constraints: false,
      through: app.model.UserTask,
      foreignKey: 'taskId',
      otherKey: 'userId',
    });
    Task.belongsToMany(app.model.User, {
      as: 'usersInCharge',
      constraints: false,
      through: {
        model: app.model.UserTask,
        scope: {
          isInCharge: true,
        },
      },
      foreignKey: 'taskId',
      otherKey: 'userId',
    });
    Task.belongsToMany(app.model.User, {
      as: 'usersAttend',
      constraints: false,
      through: {
        model: app.model.UserTask,
        scope: {
          isInCharge: false,
        },
      },
      foreignKey: 'taskId',
      otherKey: 'userId',
    });
    Task.hasMany(app.model.Attachment, {
      as: 'attachments',
      foreignKey: 'relativeId',
      constraints: false,
    });
  };

  return Task;
};
