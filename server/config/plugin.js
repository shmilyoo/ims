'use strict';

// had enabled by egg
// exports.static = true;

exports.redis = {
  enable: true,
  package: 'egg-redis',
};
exports.sequelize = {
  enabled: true,
  package: 'egg-sequelize',
};
exports.multipart = {
  enabled: true,
  package: 'egg-multipart',
};
