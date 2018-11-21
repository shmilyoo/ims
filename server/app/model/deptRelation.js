'use strict';

const db = require('../db');

module.exports = app => {
  const { CHAR } = app.Sequelize;

  const DeptRelation = db.defineModel(app, 'deptRelation', {
    // 用户设置的dept可能是部门下面的组，此表将不同级别组用户映射到一个部门
    fromDeptId: { type: CHAR(32) },
    toDeptId: { type: CHAR(32) },
  });

  return DeptRelation;
};
