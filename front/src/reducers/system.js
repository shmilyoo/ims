export const types = {
  SAGA_GET_TAGS: 'SYSTEM/SAGA_GET_TAGS',
  SAGA_UPDATE_TAG: 'SYSTEM/SAGA_UPDATE_TAG',
  SAGA_ADD_TAG: 'SYSTEM/SAGA_ADD_TAG',
  SAGA_DELETE_TAG: 'SYSTEM/SAGA_DELETE_TAG',
  SAGA_GET_SYSTEM_CONFIG: 'SYSTEM/SAGA_GET_SYSTEM_CONFIG',
  SAGA_SAVE_TIME_SCALE: 'SYSTEM/SAGA_SAVE_TIME_SCALE',
  SAGA_SAVE_COMMON_CONFIG: 'SYSTEM/SAGA_SAVE_COMMON_CONFIG',
  SAGA_GET_DEPTS: 'SYSTEM/SAGA_GET_DEPTS',
  SET_COMMON_CONFIG: 'SYSTEM/SET_COMMON_CONFIG',
  SET_DEPTS: 'SYSTEM/SET_DEPTS',
  SET_DEPT_RELATION: 'SYSTEM/SET_DEPT_RELATION',
  SET_TIME_SCALE: 'SYSTEM/SET_TIME_SCALE',
  SET_TAGS: 'SYSTEM/SET_TAGS',
  SET_PREREQUISITE: 'SYSTEM/SET_PREREQUISITE',
  PREREQUISITE_ACCOUNT: 'SYSTEM/PREREQUISITE_ACCOUNT',
  PREREQUISITE_DEPT: 'SYSTEM/PREREQUISITE_DEPT',
  PREREQUISITE_SYSTEM: 'SYSTEM/PREREQUISITE_SYSTEM'
};
export const actions = {
  sagaGetTags: () => ({
    type: types.SAGA_GET_TAGS
  }),
  sagaAddTag: (name, color, order) => ({
    type: types.SAGA_ADD_TAG,
    name,
    order,
    color
  }),
  sagaUpdateTag: (id, name, color, order) => ({
    type: types.SAGA_UPDATE_TAG,
    id,
    name,
    order,
    color
  }),
  sagaDeleteTag: id => ({
    type: types.SAGA_DELETE_TAG,
    id
  }),
  setTags: tags => ({
    type: types.SET_TAGS,
    tags
  }),
  sagaSaveTimeScale: (resolve, values) => ({
    type: types.SAGA_SAVE_TIME_SCALE,
    values,
    resolve
  }),
  sagaGetSystemConfig: () => ({
    type: types.SAGA_GET_SYSTEM_CONFIG
  }),
  sagaGetDepts: () => ({
    type: types.SAGA_GET_DEPTS
  }),
  sagaSaveCommonConfig: (resolve, values) => ({
    type: types.SAGA_SAVE_COMMON_CONFIG,
    values,
    resolve
  }),
  setDepts: (deptArray, deptDic) => ({
    type: types.SET_DEPTS,
    deptArray,
    deptDic
  }),
  setTimeScale: timeScale => ({
    type: types.SET_TIME_SCALE,
    timeScale
  }),
  setCommonConfig: values => ({
    type: types.SET_COMMON_CONFIG,
    values
  }),
  setPrerequisite: () => ({
    type: types.SET_PREREQUISITE
  }),
  prerequisiteAccount: () => ({
    type: types.PREREQUISITE_ACCOUNT
  }),
  prerequisiteSystem: () => ({
    type: types.PREREQUISITE_SYSTEM
  }),
  prerequisiteDept: () => ({
    type: types.PREREQUISITE_DEPT
  })
};

const initState = {
  tags: null,
  // 默认上午8点到11:30，下午14:30到17:30。数字是从0点经过的秒数
  // { amFrom: 28800, amTo: 41400, pmFrom: 52200, pmTo: 63000 }
  deptArray: null,
  deptDic: null,
  prerequisite: false
};

export default (state = initState, action) => {
  switch (action.type) {
    case types.SET_TAGS:
      return {
        ...state,
        tags: action.tags
      };
    case types.SET_TIME_SCALE:
      return {
        ...state,
        ...action.timeScale
      };
    case types.SET_DEPTS:
      return {
        ...state,
        deptArray: action.deptArray,
        deptDic: action.deptDic
      };
    case types.SET_COMMON_CONFIG:
      return {
        ...state,
        ...action.values
      };
    case types.SET_PREREQUISITE:
      return {
        ...state,
        prerequisite: true
      };
    default:
      return state;
  }
};
