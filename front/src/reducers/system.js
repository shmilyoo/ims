export const types = {
  SAGA_GET_TAGS: 'SYSTEM/SAGA_GET_TAGS',
  SAGA_UPDATE_TAG: 'SYSTEM/SAGA_UPDATE_TAG',
  SAGA_ADD_TAG: 'SYSTEM/SAGA_ADD_TAG',
  SAGA_DELETE_TAG: 'SYSTEM/SAGA_DELETE_TAG',
  SAGA_GET_SYSTEM_CONFIG: 'SYSTEM/SAGA_GET_SYSTEM_CONFIG',
  SAGA_SAVE_TIME_SCALE: 'SYSTEM/SAGA_SAVE_TIME_SCALE',
  SAGA_GET_DEPTS: 'SYSTEM/SAGA_GET_DEPTS',
  SET_DEPTS: 'SYSTEM/SET_DEPTS',
  SET_DEPT_RELATION: 'SYSTEM/SET_DEPT_RELATION',
  SET_TIME_SCALE: 'SYSTEM/SET_TIME_SCALE',
  SET_TAGS: 'SYSTEM/SET_TAGS'
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
  setDepts: (deptArray, deptDic, deptRelation) => ({
    type: types.SET_DEPTS,
    deptArray,
    deptDic,
    deptRelation
  }),
  setDeptRelation: deptRelation => ({
    type: types.SET_DEPT_RELATION,
    deptRelation
  }),
  setTimeScale: timeScale => ({
    type: types.SET_TIME_SCALE,
    timeScale
  })
};

const initState = {
  tags: null,
  // 默认上午8点到11:30，下午14:30到17:30。数字是从0点经过的秒数
  // { amFrom: 28800, amTo: 41400, pmFrom: 52200, pmTo: 63000 }
  timeScale: null,
  deptArray: null,
  deptDic: null,
  deptRelation: null
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
        timeScale: action.timeScale
      };
    case types.SET_DEPTS:
      return {
        ...state,
        deptArray: action.deptArray,
        deptDic: action.deptDic,
        deptRelation: action.deptRelation
      };
    case types.SET_DEPT_RELATION:
      return {
        ...state,
        deptRelation: action.deptRelation
      };
    default:
      return state;
  }
};
