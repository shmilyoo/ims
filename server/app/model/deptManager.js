'use strict';

const db = require('../db');

module.exports = app => {
  const { CHAR } = app.Sequelize;

  const DeptManager = db.defineModel(app, 'deptManager', {
    // 部门的管理员映射列表
    deptId: { type: CHAR(32), unique: 'uniqueRelation' },
    userId: { type: CHAR(32), unique: 'uniqueRelation' },
  });

  return DeptManager;
};
