import { fork, take, put, call } from 'redux-saga/effects';
import { stopSubmit, initialize } from 'redux-form';
import axios from 'axios';
import { types as deptTypes } from '../reducers/dept';

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
