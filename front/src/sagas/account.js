import { fork, take, put, call, select } from 'redux-saga/effects';
import { stopSubmit } from 'redux-form';
import { md5Passwd, checkCookieLocal } from '../services/utility';
import axios from 'axios';
import { types as accountTypes } from '../reducers/account';
import { actions as accountActions } from '../reducers/account';
import history from '../history';
import { ssoLoginPage } from '../config';
import { getAuth } from '.';

/**
 * auth/ok 页面发出的验证请求
 */
function* ssoAuth() {
  console.log('begin sso auth');
  const { token, redirect } = yield take(accountTypes.SAGA_AUTH_REQUEST);
  console.log('take sso auth');
  const response = yield axios.post('/auth/ok-check', { token });
  if (response.success) {
    const { authType, user } = response.data;
    yield put(accountActions.authSuccess(authType, user));
    yield call(history.push, redirect);
  } else {
    yield call(history.push, '/login');
  }
}

function* regFlow() {
  while (true) {
    const { resolve, values } = yield take(accountTypes.SAGA_REG_REQUEST);
    let { username, password1: password, casUsername } = values;
    username = username.toLowerCase();
    password = md5Passwd(password);
    const response = yield axios.post('account/reg', {
      username,
      password,
      casUsername
    });
    if (response.success) {
      yield call(resolve);
      yield call(
        history.push,
        `/redirect?content=${encodeURIComponent(
          '绑定用户请求需要登录统一认证系统进行确认'
        )}&to=${encodeURIComponent(ssoLoginPage)}`
      );
    } else {
      yield put(stopSubmit('regForm', { _error: response.error }));
    }
  }
}

function* bindFlow() {
  while (true) {
    const { resolve, values } = yield take(accountTypes.SAGA_BIND_REQUEST);
    let { username, password, casUsername } = values;
    username = username.toLowerCase();
    password = md5Passwd(password);
    const response = yield axios.post('account/bind', {
      username,
      password,
      casUsername
    });
    if (response.success) {
      yield call(resolve);
      yield call(
        history.push,
        `/redirect?content=${encodeURIComponent(
          '绑定用户请求需要登录统一认证系统进行确认'
        )}&to=${encodeURIComponent(ssoLoginPage)}`
      );
    } else {
      yield put(stopSubmit('bindForm', { _error: response.error }));
    }
  }
}

/**
 * 处理用户注册页面username焦点消失时的唯一性验证
 */
function* checkUsernameFlow() {
  while (true) {
    const { values, resolve, reject } = yield take(
      accountTypes.SAGA_CHECK_USERNAME
    );
    const response = yield axios.get(`account/check/${values.username}`);
    if (response.success) {
      if (response.data.isNameExist) {
        yield call(reject, { username: `用户名${values.username}已存在` });
      } else {
        yield call(resolve);
      }
    } else {
      yield call(reject, { username: ' ' }); // 空格用于保持textField的error提示行高度
    }
  }
}

function* loginFlow() {
  while (true) {
    console.log('login flow start');
    let { resolve, values, redirect } = yield take(
      accountTypes.SAGA_LOGIN_REQUEST
    );
    const username = values.username.toLowerCase();
    const password = md5Passwd(values.password);
    const remember = !!values.remember;
    const response = yield axios.post('account/login', {
      username,
      password,
      remember
    });
    if (response.success) {
      yield call(resolve);
      yield put(
        accountActions.authSuccess(response.data.authType, response.data.user)
      );
      yield call(history.push, redirect); // 根据url的redirect进行跳转
    } else {
      yield put(stopSubmit('loginForm', { _error: response.error }));
    }
  }
}

/**
 * app.js 在didMount的时候，如果account auth不是true，初始化校验用户是否登录
 */
function* checkAuthFlow() {
  const { redirect } = yield take(accountTypes.SAGA_CHECK_AUTH);
  const auth = yield select(getAuth);
  if (auth === false) {
    history.push(`/login?redirect=${redirect}`);
  } else {
    // auth为初始化状态，undefined，在此进行用户权限校验
    const hasCookie = checkCookieLocal();
    if (hasCookie) {
      const res = yield axios.get('/auth/check-auth');
      if (res.success) {
        // user.keys='id', username', 'active', 'name', 'sex', 'deptId','authType',
        yield put(accountActions.authSuccess(res.data.authType, res.data.user));
      } else {
        // 后台验证失败，重定向到登录页，清除cookie(http响应中做)
        history.push(`/login?redirect=${redirect}`);
      }
    } else {
      // 本地cookie不存在或不正确，
      history.push(`/login?redirect=${redirect}`);
    }
  }
}

export default [
  fork(ssoAuth),
  fork(regFlow),
  fork(bindFlow),
  fork(checkUsernameFlow),
  fork(loginFlow),
  fork(checkAuthFlow)
];
