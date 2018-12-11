'use strict';

const Service = require('egg').Service;
const axios = require('axios');

class DeptService extends Service {
  async getDeptArrayFromDb() {
    // 从CAS获取部门列表 body: {success:true,data:deptArray}
    const deptArray = await this.ctx.model.Dept.findAll({
      order: [ 'level', 'order' ],
    });
    return deptArray;
  }

  /**
   * 获取被绑定方dept的信息，包括id name names
   * @param {string} fromDeptId 绑定起始方的dept id
   * @param {object} deptDic dept dic 信息
   * @return {object}  被绑定方dept的信息
   */
  // async getRelationDept(fromDeptId, deptDic) {
  //   const deptRelation = await this.ctx.model.DeptRelation.findOne({
  //     where: { fromDeptId },
  //   });
  //   const workDeptId = deptRelation ? deptRelation.toDeptId : fromDeptId;
  //   if (!deptDic) deptDic = await this.ctx.service.cache.getDeptDic();
  //   const workDept = deptDic[workDeptId];
  //   const workDeptNames = this.getDeptNamesSync(workDeptId, deptDic);
  //   return {
  //     id: workDept.id,
  //     name: workDept.name,
  //     names: workDeptNames.join('-'),
  //   };
  // }

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

  // async getDeptRelation() {
  //   const deptRelations = await this.ctx.model.DeptRelation.findAll({
  //     attributes: [ 'fromDeptId', 'toDeptId' ],
  //   });
  //   const result = {};
  //   deptRelations.forEach(relation => {
  //     result[relation.fromDeptId] = relation.toDeptId;
  //   });
  //   return result;
  // }

  /**
   * 获取绑定到指定deptid 的 depts id 列表
   * @param {string} id relation to 的dept id
   * @return {array} 绑定到指定deptid 的 depts id 列表
   */
  // async getRelationDeptsFrom(id) {
  //   const deptRelations = await this.ctx.model.DeptRelation.findAll({
  //     attributes: [ 'fromDeptId', 'toDeptId' ],
  //     where: { toDeptId: id },
  //   });
  //   return deptRelations.map(relation => relation.fromDeptId);
  // }
}

module.exports = DeptService;
