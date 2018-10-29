import { fork, take, put, call } from 'redux-saga/effects';
import axios from 'axios';
import { types as accountTypes } from '../reducers/account';
import { actions as accountActions } from '../reducers/account';
import history from '../history';

function* ssoAuth() {
  console.log('begin sso auth');
  const { token, redirect } = yield take(accountTypes.SAGA_AUTH_REQUEST);
  console.log('take sso auth');
  const response = yield axios.post('/auth/ok-check', { token });
  if (response.success) {
    const { authType, id, active } = response.data;
    yield put(accountActions.authOkSuccess(authType, id, active));
  } else {
    yield call(history.push, '/login');
  }
}

export default [fork(ssoAuth)];
