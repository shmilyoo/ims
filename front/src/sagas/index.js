import { all } from 'redux-saga/effects';
import accountSaga from './account';
import systemSaga from './system';
import deptSaga from './dept';
import workSaga from './work';

export default function* rootSaga() {
  yield all([...accountSaga, ...systemSaga, ...deptSaga, ...workSaga]);
}

export const getAuth = state => state.account.auth;
export const getId = state => state.account.id;
