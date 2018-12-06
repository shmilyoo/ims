'use strict';

const Service = require('egg').Service;

class CacheService extends Service {
  async updateAll() {
    await this.updateDeptArray();
  }

  async getDeptArray() {
    // 从缓存中获取deptArray
    const result = await this.getCache('deptArray');
    if (result) return result;
    return await this.updateDeptArray();
  }

  async getDeptDic() {
    // 从缓存中获取deptArray
    const result = await this.getCache('deptDic');
    if (result) return result;
    await this.updateDeptArray();
    return await this.getCache('deptDic');
  }

  /**
   * 从CAS获取并更新本地缓存的deptArray
   * @return {Array} deptArray
   */
  async updateDeptArray() {
    const result = await this.service.dept.getDeptArray();
    if (result.success) {
      await this.setCache('deptArray', result.data);
      const deptDic = {};
      result.data.forEach(dept => {
        deptDic[dept.id] = dept;
      });
      await this.setCache('deptDic', deptDic);
    }
    return result.success ? result.data : null;
  }

  async setCache(key, value, serialze = true) {
    await this.ctx.app.redis.hset(
      'ims:cache',
      key,
      serialze ? JSON.stringify(value) : value
    );
  }

  async getCache(key, serialze = true) {
    const value = await this.ctx.app.redis.hget('ims:cache', key);
    return serialze ? JSON.parse(value) : value;
  }
}

module.exports = CacheService;
