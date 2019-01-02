import { fork, take, put, call } from 'redux-saga/effects';
import { stopSubmit } from 'redux-form';
import axios from 'axios';
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

function* addTaskFlow() {
  while (true) {
    const { resolve, values, deptId, workId } = yield take(
      workTypes.SAGA_ADD_TASK
    );
    const res = yield axios.post(`/task/add`, { values, deptId, workId });
    if (res.success) {
      const { workId, deptId, taskId } = res.data;
      yield call(resolve);
      yield call(
        history.push,
        `/work/task/add/success?workId=${workId}&&deptId=${deptId}&&taskId=${taskId}`
      ); // 跳转到成功页，提示 是继续添加 or 查看工作 or 查看部门工作
    } else {
      yield put(stopSubmit('taskForm', { _error: res.error }));
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
  fork(addWorkFlow),
  fork(addTaskFlow)
  // , fork(updateWorkBasicFlow)
];
