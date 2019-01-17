'use strict';

const db = require('../db');

// 大项工作数据表
module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM, TEXT, CHAR } = app.Sequelize;

  const Work = db.defineModel(app, 'work', {
    deptId: { type: CHAR(32) }, // 大项工作关联的部门id
    tagId: { type: CHAR(32) }, // 大项工作关联的tagid 用来分类和标记颜色
    title: { type: STRING(32) }, // 大项工作名称
    publisherId: { type: CHAR(32) }, // 发布工作的用户
    from: { type: INTEGER }, // 工作开始时间，unix时间戳，秒
    to: { type: INTEGER, allowNull: true }, // 工作结束时间
    content: { type: TEXT, defaultValue: '' }, // 大项工作介绍
    createTime: { type: INTEGER }, // 添加时间
    updateTime: { type: INTEGER }, // 修改时间
  });

  Work.associate = function() {
    Work.belongsTo(app.model.User, {
      as: 'publisher',
      foreignKey: 'publisherId',
      constraints: false,
    });
    Work.belongsTo(app.model.Tag, {
      as: 'tag',
      foreignKey: 'tagId',
      constraints: false,
    });
    Work.belongsTo(app.model.Dept, {
      as: 'dept',
      foreignKey: 'deptId',
      constraints: false,
    });
    Work.hasMany(app.model.Phase, {
      as: 'phases',
      foreignKey: 'workId',
      constraints: false,
    });
    Work.hasMany(app.model.Task, {
      as: 'tasks',
      foreignKey: 'workId',
      constraints: false,
    });
    Work.hasMany(app.model.WorkChannel, {
      as: 'channels',
      foreignKey: 'workId',
      constraints: false,
    });
    Work.belongsToMany(app.model.User, {
      as: 'users',
      constraints: false,
      through: app.model.UserWork,
      foreignKey: 'workId',
      otherKey: 'userId',
    });
    Work.belongsToMany(app.model.User, {
      as: 'usersInCharge',
      constraints: false,
      through: {
        model: app.model.UserWork,
        scope: {
          isInCharge: true,
        },
      },
      foreignKey: 'workId',
      otherKey: 'userId',
    });
    Work.belongsToMany(app.model.User, {
      as: 'usersAttend',
      constraints: false,
      through: {
        model: app.model.UserWork,
        scope: {
          isInCharge: false,
        },
      },
      foreignKey: 'workId',
      otherKey: 'userId',
    });
    Work.hasMany(app.model.Attachment, {
      as: 'attachments',
      foreignKey: 'relativeId',
      constraints: false,
    });
  };

  return Work;
};
