'use strict';

module.exports = {
  schedule: {
    interval: '1h',
    type: 'worker',
  },
  async task(ctx) {
    await ctx.service.cache.updateDeptArray();
  },
};
