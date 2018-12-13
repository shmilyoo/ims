import { fork, take, put, call, select } from 'redux-saga/effects';
import { stopSubmit, initialize } from 'redux-form';
import { md5Passwd, checkCookieLocal } from '../services/utility';
import axios from 'axios';
import { types as accountTypes } from '../reducers/account';
import { actions as accountActions } from '../reducers/account';
import { types as systemTypes } from '../reducers/system';
import { actions as systemActions } from '../reducers/system';
import { types as deptTypes } from '../reducers/dept';
import history from '../history';

function* setDeptManager() {
  while (true) {
    const { resolve, id, managers } = yield take(
      deptTypes.SAGA_SET_DEPT_MANAGER
    );
    const res = yield axios.post(`/dept/managers`, { id, managers });
    if (res.success) {
      yield call(resolve);
      yield put(initialize('deptAdminForm', { admins: res.data }));
    } else {
      yield put(stopSubmit('deptAdminForm', { _error: res.error }));
    }
  }
}

export default [fork(setDeptManager)];
