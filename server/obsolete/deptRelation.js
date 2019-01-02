'use strict';
// 废弃，本地同步一份最新的dept数据表，不需要部门关系表了

const db = require('../db');

module.exports = app => {
  const { CHAR } = app.Sequelize;

  const DeptRelation = db.defineModel(app, 'deptRelation', {
    // 用户设置的dept可能是部门下面的组，此表将不同级别组用户映射到一个部门
    fromDeptId: { type: CHAR(32), unique: true },
    toDeptId: { type: CHAR(32) },
  });

  return DeptRelation;
};
