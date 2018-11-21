'use strict';

const Service = require('egg').Service;
const axios = require('axios');

class DeptService extends Service {
  async getDeptArray() {
    // 从CAS获取部门列表 body: {success:true,data:deptArray}
    const { config } = this;
    const reqConfig = await this.service.auth.addSsoTokenToConfig();
    const res = await axios.get(config.ssoDepts, reqConfig);
    return res;
  }
}

module.exports = DeptService;
