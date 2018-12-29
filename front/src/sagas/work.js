import { fork, take, put, call, select } from 'redux-saga/effects';
import { stopSubmit, initialize } from 'redux-form';
import { md5Passwd, checkCookieLocal } from '../services/utility';
import axios from 'axios';
import { types as accountTypes } from '../reducers/account';
import { actions as accountActions } from '../reducers/account';
import { types as systemTypes } from '../reducers/system';
import { actions as systemActions } from '../reducers/system';
import { types as workTypes } from '../reducers/work';
import history from '../history';

function* addWorkFlow() {
  //values: {title,from,to,deptId,usersInCharge,usersAttend,content,phases}
  while (true) {
    const { resolve, values } = yield take(workTypes.SAGA_ADD_WORK);
    const res = yield axios.post(`/work/add`, values);
    if (res.success) {
      const { id, deptId } = res.data;
      yield call(resolve);
      yield call(
        history.push,
        `/dept-manage/work/add/success?workId=${id}&&deptId=${deptId}`
      ); // 跳转到成功页，提示 是继续添加 or 查看工作 or 查看部门工作
    } else {
      yield put(stopSubmit('addWorkForm', { _error: res.error }));
    }
  }
}

// function* updateWorkBasicFlow() {
//   while (true) {
//     const { resolve, id, values } = yield take(
//       workTypes.SAGA_UPDATE_WORK_BASIC
//     );
//     const res = yield axios.post('/work/edit/basic', { id, values });
//     if(res.success){

//     }
//   }
// }

export default [
  fork(addWorkFlow)
  // , fork(updateWorkBasicFlow)
];
