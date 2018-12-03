'use strict';

const db = require('../db');

module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM, BOOLEAN, CHAR } = app.Sequelize;

  const Tag = db.defineModel(app, 'tag', {
    name: { type: STRING(16), unique: true },
    color: { type: STRING(16) },
    order: { type: INTEGER, defaultValue: 9999 },
  });

  return Tag;
};
