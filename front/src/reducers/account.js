export const types = {
  // LOGIN_SUCCESS: 'ACCOUNT/LOGIN_SUCCESS',
  SAGA_AUTH_REQUEST: 'ACCOUNT/SAGA_AUTH_REQUEST',
  AUTH_OK_SUCCESS: 'ACCOUNT/AUTH_OK_SUCCESS',
  CLEAR_AUTH: 'ACCOUNT/CLEAR_AUTH',
  CHECK_AUTH_SUCCESS: 'ACCOUNT/CHECK_AUTH_SUCCESS',
  AUTH_SUCCESS: 'ACCOUNT/AUTH_SUCCESS',
  CHECK_AUTH_FAILURE: 'ACCOUNT/CHECK_AUTH_FAILURE',
  LOGIN_SUCCESS: 'ACCOUNT/LOGIN_SUCCESS',
  SAGA_CHECK_AUTH: 'ACCOUNT/SAGA_CHECK_AUTH',
  SAGA_REG_REQUEST: 'ACCOUNT/SAGA_REG_REQUEST',
  SAGA_BIND_REQUEST: 'ACCOUNT/SAGA_BIND_REQUEST',
  SAGA_LOGIN_REQUEST: 'ACCOUNT/SAGA_LOGIN_REQUEST',
  SAGA_CHECK_USERNAME: 'ACCOUNT/SAGA_CHECK_USERNAME'
};

export const actions = {
  sagaAuthRequest: (token, redirect) => ({
    type: types.SAGA_AUTH_REQUEST,
    token,
    redirect
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
  loginSuccess: (id, authType, username, active) => ({
    type: types.LOGIN_SUCCESS,
    id,
    authType,
    username,
    active
  })
};

const initState = {
  auth: undefined,
  authType: '', // sso || local
  id: '', // 和sso user id保持一致 。注册用户在注册时进行绑定，sso用户在授权登录时进行生成
  username: '',
  active: 2, // sso 账户状态: 0正常，1未激活,2禁用
  isSuperAdmin: false,
  info: { name: '', sex: 0 }, // {basic:{},work:[],education,[]} 从sso中获取的用户详细资料
  dept: {}
};

export default function accountReducer(state = initState, action) {
  switch (action.type) {
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
    case types.CLEAR_AUTH:
      return initState;
    case types.LOGIN_SUCCESS:
      return {
        ...state,
        id: action.id,
        username: action.username,
        active: action.active,
        authType: action.authType
      };
    default:
      return state;
  }
}
