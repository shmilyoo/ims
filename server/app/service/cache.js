'use strict';

const Service = require('egg').Service;

class CacheService extends Service {
  async getDeptArray() {
    // 从缓存中获取deptArray
    const result = await this.ctx.app.redis.hget('ims:cache', 'deptArray');
    if (result) return result;
    return this.updateDeptArray();
  }

  /**
   * 从CAS获取并更新本地缓存的deptArray
   * @return {Array} deptArray
   */
  async updateDeptArray() {
    const result = await this.service.dept.getDeptArray();
    await this.setCache('deptArray', result);
    return result;
  }

  async setCache(key, value) {
    await this.ctx.app.redis.hset('ims:cache', key, value);
  }
}

module.exports = CacheService;
