'use strict';

module.exports = {
  schedule: {
    interval: '1h',
    type: 'worker',
    // immediate: true,  // todo app.js中设置了执行，是否在生产模式下生效且此处是否有效，还要检验
  },
  async task(ctx) {
    await ctx.service.cache.updateDeptArray();
  },
};

// todo 每十分钟执行一次，把超过一天的未接受日程置为接受
