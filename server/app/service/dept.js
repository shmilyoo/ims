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

  async getRelationDept(fromDeptId, deptDic) {
    const deptRelation = await this.ctx.model.DeptRelation.findOne({
      where: { fromDeptId },
    });
    const workDeptId = deptRelation ? deptRelation.toDeptId : fromDeptId;
    if (!deptDic) deptDic = await this.ctx.service.cache.getDeptDic();
    const workDept = deptDic[workDeptId];
    const workDeptNames = this.getDeptNamesSync(workDeptId, deptDic);
    return {
      id: workDept.id,
      name: workDept.name,
      names: workDeptNames.join('-'),
    };
  }

  getDeptNamesSync(id, deptDic) {
    const names = [];
    let dept = deptDic[id];
    while (true) {
      names.push(dept.name);
      if (dept.parentId === '0') break;
      dept = deptDic[dept.parentId];
    }
    return names.reverse();
  }

  async getDeptRelation() {
    const deptRelations = await this.ctx.model.DeptRelation.findAll({
      attributes: [ 'fromDeptId', 'toDeptId' ],
    });
    const result = {};
    deptRelations.forEach(relation => {
      result[relation.fromDeptId] = relation.toDeptId;
    });
    return result;
  }
}

module.exports = DeptService;
