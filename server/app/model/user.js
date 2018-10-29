'use strict';

const db = require('../db');

module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM, BOOLEAN, CHAR } = app.Sequelize;

  const User = db.defineModel(app, 'user', {
    username: { type: STRING(16), unique: true, allowNull: true }, // 用户名
    password: { type: STRING, allowNull: true }, // 密码
    isSuperAdmin: { type: BOOLEAN, defaultValue: false }, // 是否是超级管理员
  });

  // User.associate = function() {
  //   User.belongsTo(app.model.Dept, {
  //     as: 'dept',
  //     foreignKey: 'dept_id',
  //     constraints: false,
  //   });
  // User.hasMany(app.model.Exp, {
  //   as: 'educations',
  //   foreignKey: 'user_id',
  //   constraints: false,
  //   scope: {
  //     type: 'education',
  //   },
  // });
  // User.hasMany(app.model.Exp, {
  //   as: 'works',
  //   foreignKey: 'user_id',
  //   constraints: false,
  //   scope: {
  //     type: 'work',
  //   },
  // });
  // };

  return User;
};
