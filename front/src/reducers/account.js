export const types = {
  // LOGIN_SUCCESS: 'ACCOUNT/LOGIN_SUCCESS',
  SAGA_AUTH_REQUEST: 'ACCOUNT/SAGA_AUTH_REQUEST',
  AUTH_OK_SUCCESS: 'ACCOUNT/AUTH_OK_SUCCESS'
};

export const actions = {
  sagaAuthRequest: (token, redirect) => ({
    type: types.SAGA_AUTH_REQUEST,
    token,
    redirect
  }),
  authOkSuccess: (authType, id, active) => ({
    type: types.AUTH_OK_SUCCESS,
    authType,
    id,
    active
  })
};

const initState = {
  authType: '', // sso || local
  id: '', // 和sso user id保持一致 。注册用户在注册时进行绑定，sso用户在授权登录时进行生成
  username: '',
  active: 2, // sso 账户状态: 0正常，1未激活,2禁用
  isSuperAdmin: false,
  info: {} // {basic:{},work:[],education,[]} 从sso中获取的用户详细资料
};

export default function accountReducer(state = initState, action) {
  switch (action.type) {
    case types.AUTH_OK_SUCCESS:
      return {
        ...state,
        authType: action.authType,
        id: action.id,
        active: action.active
      };
    default:
      return state;
  }
}
