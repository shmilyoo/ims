'use strict';

const db = require('../db');

// 大项工作数据表
module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM, BOOLEAN, CHAR } = app.Sequelize;

  const Work = db.defineModel(app, 'work', {
    deptId: { type: CHAR(32) }, // 大项工作关联的部门id
    title: { type: STRING(32) }, // 大项工作名称
    publisherId: { type: CHAR(32) }, // 发布工作的用户
    from: { type: INTEGER }, // 工作开始时间，unix时间戳，秒
    to: { type: INTEGER, allowNull: true }, // 工作结束时间
    content: { type: STRING, defaultValue: '' }, // 大项工作介绍
    createTime: { type: INTEGER }, // 添加时间
    updateTime: { type: INTEGER }, // 修改时间
  });

  Work.associate = function() {
    Work.belongsTo(app.model.User, {
      as: 'publisher',
      foreignKey: 'publisherId',
      constraints: false,
    });
    Work.belongsTo(app.model.Dept, {
      as: 'dept',
      foreignKey: 'deptId',
      constraints: false,
    });
  };

  return Work;
};
