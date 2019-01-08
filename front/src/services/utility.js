// 一些辅助函数
import { actions as accountActions } from '../reducers/account';
import md5 from 'md5';
import axios from 'axios';
import Cookies from 'js-cookie';
import history from '../history';
import qs from 'qs';
import { numberPerPage } from '../config';

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

export const checkInUsers = (users, id) => {
  let result = false;
  users.some(({ id: _id }) => {
    if (id === _id) {
      result = true;
      return true;
    }
    return false;
  });
  return result;
};

/**
 * 检查用户是否具有管理work权限
 * @param {array} manageDepts 用户具有管理权限的dept id 列表
 * @param {string} userId 用户id
 * @param {string} workDeptId work所属的dept id
 * @param {array} usersInCharge work的负责人，[{id,name}...]
 */
export const checkCanManageWork = (
  manageDepts,
  userId,
  workDeptId,
  usersInCharge
) => {
  let canManage = false; // 是否可以编辑work的主要信息
  if (manageDepts.includes(workDeptId)) {
    canManage = true;
  } else {
    canManage = checkInUsers(usersInCharge, userId);
  }
  return canManage;
};

/**
 * 检查用户是否可以在work中发布task和article，如果用户可以管理work，就不需要调用本函数
 * @param {string} userId 用户id
 * @param {array} usersAttend work的參加人，[{id,name}...]
 */
export const checkCanAddTaskArticle = (userId, usersAttend) => {
  let canAddTaskArticle = false; // 是否可以添加文章，任务，除了管理者外，参与者也可以
  canAddTaskArticle = checkInUsers(usersAttend, userId);
  return canAddTaskArticle;
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

/**
 * 获取部门层次对象列表
 * @param {string} id dept id
 * @param {object} deptDic dept plain object
 * @returns {array} 部门层次对象列表
 */
export const getDeptArraySync = (id, deptDic) => {
  const depts = [];
  let dept = deptDic[id];
  while (true) {
    depts.push({ name: dept.name, id: dept.id });
    if (dept.parentId === '0') break;
    dept = deptDic[dept.parentId];
  }
  return depts.reverse();
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

export const getWorkInfo = ({
  id,
  withDept,
  withUsers,
  withUsersInCharge,
  withUsersAttend,
  withPublisher,
  withChannels,
  withTag,
  withPhases,
  withAttachments,
  order
}) => {
  return axios.post('/work/info', {
    id,
    withDept,
    withUsers,
    withUsersInCharge,
    withUsersAttend,
    withPublisher,
    withChannels,
    withTag,
    withPhases,
    withAttachments,
    order
  });
};

export const getWorkTasks = ({
  workId,
  numberPerPage = 10,
  currentPage = 1,
  withPublisher,
  withUsers,
  withWork,
  withDept,
  order = { updateTime: 'desc' }
}) => {
  return axios.post('/work/tasks', {
    workId,
    numberPerPage,
    currentPage,
    withPublisher,
    withUsers,
    withWork,
    withDept,
    order
  });
};

/**
 * 获取work频道列表
 * @param {string} workId work的id
 */
export const getWorkChannels = workId => {
  return axios.get(`/work/channels?workId=${workId}`);
};
/**
 * 获取dept频道列表
 * @param {string} workId work的id
 */
export const getDeptChannels = deptId => {
  return axios.get(`/dept/channels?deptId=${deptId}`);
};

export const getArticles = ({
  from = 'work', // work or dept
  channelParentId, //  work id or dept id
  channelId, // 是否限定只获取指定channel 的文章,all代表获取整个work或dept的articles
  numberPerPage,
  currentPage,
  withChannel = true,
  withPublisher = true,
  withChannelParent = false,
  order = { updateTime: 'desc' }
}) => {
  return axios.post(`/articles`, {
    from,
    channelParentId,
    channelId,
    numberPerPage,
    currentPage,
    withChannel,
    withPublisher,
    withChannelParent,
    order
  });
};

export const getWorkArticle = ({
  id,
  withPublisher,
  withChannel,
  withWork,
  withDept,
  withAttachments
}) => {
  return axios.post('/work/article', {
    id,
    withPublisher,
    withChannel,
    withWork,
    withDept,
    withAttachments
  });
};

/**
 * @param {string[]} ids 删除的workarticle id列表
 */
export const deleteWorkArticle = ids => {
  return axios.post('/work/article/delete', { ids });
};

export const getDeptWorks = ({
  deptId,
  numberPerPage,
  currentPage,
  withDept = true,
  withPublisher = true,
  orderBy = 'createTime',
  orderDirection = 'desc'
}) => {
  return axios.post(`/dept/works`, {
    deptId,
    numberPerPage,
    currentPage,
    withDept,
    withPublisher,
    orderBy,
    direction: orderDirection
  });
};

/**
 * 获取用户在localstorage设置的numberPerPage，如果没有则
 */
export const getNumberPerPage = () => {
  const _numberPerPage = Number.parseInt(localStorage.getItem('numberPerPage'));
  return _numberPerPage || numberPerPage;
};
export const setNumberPerPage = number => {
  localStorage.setItem('numberPerPage', number);
  return number;
};

/**
 * 批量删除大项工作
 * @param {array} ids work id 列表
 */
export const delWorks = ids => {
  return axios.post('/work/del', { ids });
};

export const delArticles = (ids, from = 'work') => {
  return axios.post('/article/delete', { ids, from });
};

export const delChannel = (from = 'work', id, channelParentId) => {
  return axios.post('/channel/delete', { id, from, channelParentId });
};

export const timeFunctions = {
  getNowUnix: () => Math.floor(new Date().getTime() / 1000),
  /**
   * 从unix时间戳返回日期字符串
   * @param {number} unix unix 时间戳
   * @param {string} type 返回的格式，date,datetime,time
   */
  formatFromUnix: (unix, type = 'date') => {
    const date = new Date(unix * 1000);
    switch (type) {
      case 'datetime':
        return `${date.getFullYear()}-${date.getMonth() +
          1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
      case 'time':
        return `${date.getHours()}:${date.getMinutes()}`;
      default:
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
  }
};

export const range = (start, end, step) => {
  var range = [];
  var typeofStart = typeof start;
  var typeofEnd = typeof end;

  if (step === 0) {
    throw TypeError('Step cannot be zero.');
  }

  if (typeofStart === 'undefined' || typeofEnd === 'undefined') {
    throw TypeError('Must pass start and end arguments.');
  } else if (typeofStart !== typeofEnd) {
    throw TypeError('Start and end arguments must be of same type.');
  }

  typeof step == 'undefined' && (step = 1);

  if (end < start) {
    step = -step;
  }

  if (typeofStart === 'number') {
    while (step > 0 ? end >= start : end <= start) {
      range.push(start);
      start += step;
    }
  } else if (typeofStart === 'string') {
    if (start.length !== 1 || end.length !== 1) {
      throw TypeError('Only strings with one character are supported.');
    }

    start = start.charCodeAt(0);
    end = end.charCodeAt(0);

    while (step > 0 ? end >= start : end <= start) {
      range.push(String.fromCharCode(start));
      start += step;
    }
  } else {
    throw TypeError('Only string and number types are supported');
  }

  return range;
};
