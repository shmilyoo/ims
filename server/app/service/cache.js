'use strict';

const Service = require('egg').Service;
const axios = require('axios');

class CacheService extends Service {
  async updateAll() {
    await this.updateDeptArray();
  }

  async getDeptArray() {
    // 从缓存中获取deptArray
    const result = await this.getCache('deptArray');
    if (result) return result;
    await this.updateDeptArray();
    return (await this.getCache('deptArray')) || [];
  }

  async getDeptDic() {
    // 从缓存中获取deptArray
    const result = await this.getCache('deptDic');
    if (result) return result;
    await this.updateDeptArray();
    return await this.getCache('deptDic');
  }

  /**
   * 从CAS获取并更新本地缓存deptArray和dept数据表的
   */
  async updateDeptArray() {
    const { config, ctx, service } = this;
    const updateTimeConfig = await service.cache.getDeptUpdateTime();
    const imsDeptUpdateTime = updateTimeConfig || '1'; // 随便起一个值
    const reqConfig = await service.auth.addSsoTokenToConfig();
    const res = await axios.get(
      `${config.ssoDepts}?time=${imsDeptUpdateTime}`,
      reqConfig
    );
    if (res.success) {
      if (res.data.hasChanged) {
        const transaction = await ctx.model.transaction();
        try {
          const num = res.data.deptArray.length;
          await ctx.model.Dept.destroy({ where: {} });
          const createDepts = await ctx.model.Dept.bulkCreate(
            res.data.deptArray
          );
          if (num !== createDepts.length) {
            throw '获取的depts长度与本地添加不一致，撤回事物';
          }
          await service.system.setDeptUpdateTime(res.data.time);
          await this.setCache('deptArray', res.data.deptArray);
          await transaction.commit();
          // log 本地dept缓存和表与CAS不一致，成功更新
        } catch (error) {
          console.log(error);
          await transaction.rollback();
          // log 与CAS更新本地dept缓存和表时在写本地数据时出错，事物已回滚 error.message
        }
      } else {
        console.log('自上次更新以后，cas的dept表没有变化');
        // log 自上次更新以后，cas的dept表没有变化
      }
    } else {
      // log 与CAS更新本地dept缓存和表时CAS返回错误信号
    }
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
