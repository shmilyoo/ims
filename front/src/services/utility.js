// 一些辅助函数
import { actions as accountActions } from '../reducers/account';
import md5 from 'md5';
import axios from 'axios';
import Cookies from 'js-cookie';
import history from '../history';
import qs from 'qs';

export const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
};

/**
 * 本地初步验证cookie是否有效，后续还需要在服务器进一步验证，因为存在httponly的id等
 */
export const checkCookieLocal = () => {
  const hasCookie = !!Cookies.get('ims_authType');
  return hasCookie;
};

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * client端启动前加载本地用户token信息，设置相关state
 */
export const initAuthInfoAtStart = dispatch => {
  // todo 修改为cookie 存储
  // decode token， state中dispatch设置username active 等信息，判断过期时间等
  const username = Cookies.get('username');
  const active = Number.parseInt(Cookies.get('active'), 10);
  if (username && active) {
    dispatch(accountActions.userAuth(username, active));
    // 如果本地保存有用户信息，则从服务器获取用户实时相关信息，避免本地信息过期或被篡改
    // todo 暂时取消下行，因为后端中间件会检查对比cookie和session信息，不一致则返回401
    // dispatch(accountActions.getUserAuthInfo());
  }
};

/**
 *
 * @param {string|Buffer|Array|Uint8Array} message
 * @return {string} md5值，32位
 */
export const md5Passwd = message => md5(message);

/**
 * @return {Array} 获取部门结构列表
 */
export const getDeptArray = async () => {
  const response = await axios.get('/dept/all');
  return response;
};

/**
 * 根据dept list 返回第一级别展开的对象
 * @param {{id:string,level:number}[]} treeArray tree的按照level order 排列的dept数据array
 * @return {{string:boolean}} {1stLevel1Id:true,2ndLevel1Id:true...}
 */
export const getLevel1ExpandsfromTreeArray = treeArray => {
  if (!treeArray) return null;
  let level1Expands = {};
  const length = treeArray.length;
  for (let i = 0; i < length; i++) {
    if (treeArray[i].level === 1) {
      level1Expands[treeArray[i].id] = true;
    }
    if (treeArray[i].level > 1) break;
  }
  return level1Expands;
};

/**
 * 从旧的expands和新更新的expands生成新的expands
 * @param {boolean|object} oldExpands
 * @param {boolean|object} expands
 * @return {boolean|object} 返回新的expands
 */
export const getNewExpands = (oldExpands, expands) => {
  if (typeof expands === 'boolean') return expands;
  return typeof oldExpands === 'boolean'
    ? expands
    : { ...oldExpands, ...expands };
};

/**
 *
 * @param {string} toNodeId 要展开到的节点id
 * @param {object} deptDic 节点的对象集合
 * @param {any} expands 原先的展开对象
 */
export const getExpandsToNode = (toNodeId, deptDic, expands = {}) => {
  if (expands === true) return { hasExpandsChange: false, newExpands: true };
  let newExpands = { ...expands };
  let hasExpandsChange = false;
  let node = deptDic[deptDic[toNodeId].parentId];
  while (node) {
    // 如果对应展开项不是true（undefined or false）
    if (!newExpands[node.id]) hasExpandsChange = true;
    newExpands[node.id] = true;
    node = deptDic[node.parentId];
  }
  return { hasExpandsChange: hasExpandsChange, newExpands: newExpands };
};

/**
 *
 * @param {Array} deptArray 按照level从小到大排列的dept object数组
 * @param {(boolean|Object)} expanded 可选,id:bool 对象 设置各个节点是否展开,如果是Boolean则代表全展开或全折叠
 * @return {Array} [符合react-sortable-tree数据格式的数组,如果是第一次mount后返回的新expands值]
 */
export const makeDeptTree = (deptArray, expanded) => {
  // [{name,intro,parent,path,level,id,sid},{},{}]
  if (expanded === undefined)
    expanded = getLevel1ExpandsfromTreeArray(deptArray);
  const result = [];
  const tmp = {};
  for (let i = 0; i < deptArray.length; i++) {
    const dept = deptArray[i];
    tmp[dept.id] = { title: dept.name, id: dept.id };
    // 如果expanded 为true或者 为Object且对应dept.id的key值为true
    if (expanded === true || expanded[dept.id] === true) {
      tmp[dept.id].expanded = true;
    }
    if (dept.parentId !== '0') {
      tmp[dept.parentId].children
        ? tmp[dept.parentId].children.push(tmp[dept.id])
        : (tmp[dept.parentId].children = [tmp[dept.id]]);
    } else {
      result.push(tmp[dept.id]);
    }
  }
  return result;
};

/**
 * 获取指定部门的管理员列表
 * @param {string} id 部门id
 */
export const getDeptManagersAsync = id => {
  return axios.get(`/dept/managers?id=${id}`);
};

/**
 * 获取部门层次名称，比如 技术部-科技处-质量办
 * @param {string} id dept id
 * @param {object} deptDic dept plain object
 * @returns {array} 部门层次名称字符串列表
 */
export const getDeptNamesArraySync = (id, deptDic) => {
  const names = [];
  let dept = deptDic[id];
  while (true) {
    names.push(dept.name);
    if (dept.parentId === '0') break;
    dept = deptDic[dept.parentId];
  }
  return names.reverse();
};

export const toRedirectPage = (content, to, count) => {
  history.push(
    `/redirect?${qs.stringify(
      {
        content,
        to,
        count
      },
      { encodeValuesOnly: true }
    )}`
  );
};

// export const treeDataWithRelation = (treeData, relations, treeDataDic) => {
//   let result = [];
//   for (let i = 0; i < treeData.length; i++) {
//     const node = Object.assign({}, treeData[i]);
//     const toNodeId = relations[node.id];
//     if (toNodeId) {
//       node.title = `${node.title} -> ${treeDataDic[toNodeId].name}`;
//     }
//     if (node.children)
//       node.children = treeDataWithRelation(
//         node.children,
//         relations,
//         treeDataDic
//       );
//     result.push(node);
//   }
//   return result;
// };

// /**
//  *  全部展开或者折叠树
//  * @param {Object[]} treeData tree的数据结构
//  * @param {boolean} expand 是否展开
//  */
// export const toggleExpandTreeData = (treeData, expand) => {
//   for (let i = 0; i < treeData.length; i++) {
//     if (treeData[i].children) {
//       treeData[i].expanded = expand;
//       toggleExpandTreeData(treeData[i].children, expand);
//     }
//   }
//   return [...treeData];
// };
