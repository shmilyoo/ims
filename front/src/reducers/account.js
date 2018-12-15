// import { types as systemTypes } from './system';

export const types = {
  SAGA_AUTH_REQUEST: 'ACCOUNT/SAGA_AUTH_REQUEST',
  SAGA_CHECK_AUTH: 'ACCOUNT/SAGA_CHECK_AUTH',
  SAGA_REG_REQUEST: 'ACCOUNT/SAGA_REG_REQUEST',
  SAGA_BIND_REQUEST: 'ACCOUNT/SAGA_BIND_REQUEST',
  SAGA_LOGIN_REQUEST: 'ACCOUNT/SAGA_LOGIN_REQUEST',
  SAGA_CHECK_USERNAME: 'ACCOUNT/SAGA_CHECK_USERNAME',
  SAGA_LOGOUT: 'ACCOUNT/SAGA_LOGOUT',
  // SAGA_GET_DEPT_INFO: 'ACCOUNT/SAGA_GET_DEPT_INFO',
  SAGA_GET_ACCOUNT_INFO: 'ACCOUNT/SAGA_GET_ACCOUNT_INFO',
  SAGA_SET_ACCOUNT_INFO: 'ACCOUNT/SAGA_SET_ACCOUNT_INFO',
  AUTH_OK_SUCCESS: 'ACCOUNT/AUTH_OK_SUCCESS',
  CLEAR_AUTH: 'ACCOUNT/CLEAR_AUTH',
  CHECK_AUTH_SUCCESS: 'ACCOUNT/CHECK_AUTH_SUCCESS',
  AUTH_SUCCESS: 'ACCOUNT/AUTH_SUCCESS',
  CHECK_AUTH_FAILURE: 'ACCOUNT/CHECK_AUTH_FAILURE',
  LOGIN_SUCCESS: 'ACCOUNT/LOGIN_SUCCESS',
  SET_ACCOUNT_INFO: 'ACCOUNT/SET_ACCOUNT_INFO', // 进入主页面的时候初始化用户相关信息
  UPDATE_ACCOUNT_INFO: 'ACCOUNT/UPDATE_ACCOUNT_INFO', // 只更新info
  UPDATE_ACCOUNT_DEPT: 'ACCOUNT/UPDATE_ACCOUNT_DEPT', // 更新dept
  SET_DEPT_SHOW: 'ACCOUNT/SET_DEPT_SHOW', // 设置显示哪个部门信息
  SET_MANAGE_DEPT: 'ACCOUNT/SET_MANAGE_DEPT' // 设置管理哪个部门信息
};

export const actions = {
  sagaAuthRequest: (token, redirect) => ({
    type: types.SAGA_AUTH_REQUEST,
    token,
    redirect
  }),
  sagaLogout: kind => ({
    type: types.SAGA_LOGOUT,
    kind
  }),
  // sagaGetDeptInfo: id => ({
  //   type: types.SAGA_GET_DEPT_INFO,
  //   id
  // }),
  sagaGetAccountInfo: () => ({
    type: types.SAGA_GET_ACCOUNT_INFO
  }),
  sagaSetAccountInfo: (resolve, values, id) => ({
    type: types.SAGA_SET_ACCOUNT_INFO,
    resolve,
    values,
    id
  }),
  setAccountInfo: (dept, info, manageDepts) => ({
    type: types.SET_ACCOUNT_INFO,
    dept,
    info,
    manageDepts
  }),
  updateInfo: info => ({ type: types.UPDATE_ACCOUNT_INFO, info }),
  updateDept: dept => ({
    type: types.UPDATE_ACCOUNT_DEPT,
    dept
  }),
  authSuccess: (authType, user) => ({
    // 'id', 'username', 'active', 'name', 'sex', 'deptId','authType'
    type: types.AUTH_SUCCESS,
    authType,
    user
  }),
  clearAuth: () => ({
    type: types.CLEAR_AUTH
  }),
  setDeptShow: id => ({
    type: types.SET_DEPT_SHOW,
    id
  }),
  setManageDept: id => ({
    type: types.SET_MANAGE_DEPT,
    id
  })
  // loginSuccess: (id, authType, username, active) => ({
  //   type: types.LOGIN_SUCCESS,
  //   id,
  //   authType,
  //   username,
  //   active
  // })
};

const initState = {
  auth: undefined,
  authType: '', // sso || local
  id: '', // 和sso user id保持一致 。注册用户在注册时进行绑定，sso用户在授权登录时进行生成
  username: '',
  active: 2, // sso 账户状态: 0正常，1未激活,2禁用
  isSuperAdmin: false,
  info: { name: '', sex: 0 }, // {basic:{},work:[],education,[]} 从sso中获取的用户详细资料
  dept: {},
  deptShow: '', // 在我的部门等地显示的部门id
  manageDept: '', // 用户选中管理的部门id
  manageDepts: [] // 用户具有管理权限的部门id列表
};

export default function accountReducer(state = initState, action) {
  switch (action.type) {
    // case systemTypes.SET_DEPTS:

    case types.AUTH_SUCCESS:
      return {
        ...state,
        auth: true,
        authType: action.authType,
        id: action.user.id,
        active: action.user.active,
        username: action.user.username,
        isSuperAdmin: action.user.isSuperAdmin || false,
        info: { ...state.info, name: action.user.name, sex: action.user.sex },
        dept: { ...state.dept, id: action.user.deptId }
      };
    case types.CHECK_AUTH_FAILURE:
      return {
        ...initState,
        auth: false
      };
    case types.SET_ACCOUNT_INFO:
      return {
        ...state,
        // 系统进入主界面home后，获取dept，如果deptShow有的话，就不赋值
        deptShow: state.deptShow ? state.deptShow : action.dept.id,
        dept: { ...state.dept, ...action.dept },
        info: { ...state.info, ...action.info },
        manageDept: state.manageDept
          ? state.manageDept
          : action.manageDepts.length
            ? action.manageDepts[0]
            : '',
        manageDepts: action.manageDepts
      };
    case types.UPDATE_ACCOUNT_INFO:
      return {
        ...state,
        info: { ...state.info, ...action.info }
      };
    case types.UPDATE_ACCOUNT_DEPT:
      return {
        ...state,
        dept: { ...state.dept, ...action.dept }
      };

    case types.SET_DEPT_SHOW:
      return {
        ...state,
        deptShow: action.id
      };
    case types.SET_MANAGE_DEPT:
      return {
        ...state,
        manageDept: action.id
      };
    case types.CLEAR_AUTH:
      return initState;
    default:
      return state;
  }
}
