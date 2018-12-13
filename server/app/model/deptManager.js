'use strict';

const db = require('../db');

module.exports = app => {
  const { CHAR } = app.Sequelize;

  const DeptManager = db.defineModel(app, 'deptManager', {
    // 部门的管理员映射列表
    deptId: { type: CHAR(32), unique: 'uniqueRelation' },
    userId: { type: CHAR(32), unique: 'uniqueRelation' },
  });

  // DeptManager.associate = function() {
  //   DeptManager.hasMany(app.model.User, {
  //     as: 'manageDepts',
  //     foreignKey: 'userId',
  //     constraints: false,
  //   });
  // };

  return DeptManager;
};
