import { fork, take, put, call, select } from 'redux-saga/effects';
import { stopSubmit } from 'redux-form';
import { md5Passwd, checkCookieLocal } from '../services/utility';
import axios from 'axios';
import { types as accountTypes } from '../reducers/account';
import { actions as accountActions } from '../reducers/account';
import { types as systemTypes } from '../reducers/system';
import { actions as systemActions } from '../reducers/system';
import history from '../history';

function* getTags() {
  while (true) {
    yield take(systemTypes.SAGA_GET_TAGS);
    const res = yield axios.get('/system/tag/all');
    if (res.success) {
      yield put(systemActions.setTags(res.data));
    }
  }
}

function* updateTag() {
  while (true) {
    const { id, name, color, order } = yield take(systemTypes.SAGA_UPDATE_TAG);
    const res = yield axios.post('/system/tag/update', {
      id,
      name,
      color,
      order
    });
    if (res.success) {
      yield put(systemActions.setTags(res.data));
    }
  }
}
function* deleteTag() {
  while (true) {
    const { id } = yield take(systemTypes.SAGA_DELETE_TAG);
    const res = yield axios.post('/system/tag/delete', { id });
    if (res.success) {
      yield put(systemActions.setTags(res.data));
    }
  }
}
function* addTag() {
  while (true) {
    const { name, color, order } = yield take(systemTypes.SAGA_ADD_TAG);
    const res = yield axios.post('/system/tag/add', {
      name,
      color,
      order
    });
    if (res.success) {
      yield put(systemActions.setTags(res.data));
    }
  }
}

function* saveTimeScale() {
  while (true) {
    const {
      values, // {amFrom,amTo,pmFrom,pmTo}
      resolve
    } = yield take(systemTypes.SAGA_SAVE_TIME_SCALE);
    console.log('saga time scale');
    const res = yield axios.post('/system/time-scale', values);
    if (res.success) {
      yield put(systemActions.setTimeScale(values));
      yield call(resolve);
    } else {
      yield put(stopSubmit('systemTimeScaleForm', { _error: res.error }));
    }
  }
}

function* getSystemConfig() {
  yield take(systemTypes.SAGA_GET_SYSTEM_CONFIG);
  const res = yield axios.get('/system/all');
  const configs = {};
  if (res.success) {
    res.data.forEach(config => {
      configs[config.name] = config.value;
    });
    const { amFrom, amTo, pmFrom, pmTo } = configs;
    if (amTo)
      yield put(
        systemActions.setTimeScale({
          amFrom: Number.parseInt(amFrom) || 0,
          amTo: Number.parseInt(amTo) || 0,
          pmFrom: Number.parseInt(pmFrom) || 0,
          pmTo: Number.parseInt(pmTo) || 0
        })
      );
  }
}

/**
 * 用户进入系统主页面home，初始化获取deptArray、deptDic和deptRelation信息
 */
function* getDepts() {
  yield take(systemTypes.SAGA_GET_DEPTS);
  const res = yield axios.get('/dept/depts-and-relation');
  if (res.success) {
    const { deptArray, deptRelation } = res.data;
    const deptDic = {};
    deptArray.forEach(dept => {
      deptDic[dept.id] = dept;
    });
    yield put(systemActions.setDepts(deptArray, deptDic, deptRelation));
  }
}

export default [
  fork(getTags),
  fork(updateTag),
  fork(addTag),
  fork(deleteTag),
  fork(saveTimeScale),
  fork(getSystemConfig),
  fork(getDepts)
];
