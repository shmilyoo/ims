'use strict';

const Service = require('egg').Service;

class SystemService extends Service {
  async setDeptUpdateTime(time) {
    await this.ctx.model.System.upsert({ name: 'deptUpdateTime', value: time });
  }
  async getDeptUpdateTime() {
    const config = await this.ctx.model.System.findOne({
      where: { name: 'deptUpdateTime' },
    });
    return config ? config.value : '1';
  }
}

module.exports = SystemService;
