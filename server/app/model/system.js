'use strict';

const db = require('../db');

module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM, BOOLEAN, CHAR } = app.Sequelize;

  const System = db.defineModel(app, 'System', {
    name: { type: STRING(16), unique: true },
    value: { type: STRING(64), defaultValue: '' },
  });

  return System;
};
