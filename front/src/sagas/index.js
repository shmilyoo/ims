import { all } from 'redux-saga/effects';
import accountSaga from './account';
import systemSaga from './system';
import deptSaga from './dept';

export default function* rootSaga() {
  yield all([...accountSaga, ...systemSaga, ...deptSaga]);
}

export const getAuth = state => state.account.auth;
export const getId = state => state.account.id;
