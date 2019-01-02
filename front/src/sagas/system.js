import { fork, take, put, call } from 'redux-saga/effects';
import { stopSubmit } from 'redux-form';
import axios from 'axios';
import { types as systemTypes } from '../reducers/system';
import { actions as systemActions } from '../reducers/system';

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
  while (true) {
    yield take(systemTypes.SAGA_GET_SYSTEM_CONFIG);
    const res = yield axios.get('/system/all');
    const configs = {};
    if (res.success) {
      res.data.forEach(config => {
        configs[config.name] = config.value;
      });
      configs.amFrom = Number.parseInt(configs.amFrom) || 0;
      configs.amTo = Number.parseInt(configs.amTo) || 0;
      configs.pmFrom = Number.parseInt(configs.pmFrom) || 0;
      configs.pmTo = Number.parseInt(configs.pmTo) || 0;
      yield put(systemActions.setCommonConfig(configs));
    }
  }
}

function* saveCommonConfig() {
  while (true) {
    const {
      values, // {amFrom,amTo,pmFrom,pmTo}
      resolve
    } = yield take(systemTypes.SAGA_SAVE_COMMON_CONFIG);
    if (values.allowExts) {
      values.allowExts = values.allowExts.toLowerCase();
    }
    const res = yield axios.post('/system/config', values);
    if (res.success) {
      yield put(systemActions.setCommonConfig(values));
      yield call(resolve);
    } else {
      yield put(stopSubmit('systemCommonConfigForm', { _error: res.error }));
    }
  }
}

/**
 * 用户进入系统主页面home，初始化获取deptArray、deptDic和deptRelation信息
 */
function* getDepts() {
  while (true) {
    yield take(systemTypes.SAGA_GET_DEPTS);
    const res = yield axios.get('/dept/all');
    if (res.success) {
      const deptArray = res.data;
      const deptDic = {};
      deptArray.forEach(dept => {
        deptDic[dept.id] = dept;
      });
      yield put(systemActions.setDepts(deptArray, deptDic));
    }
  }
}

export default [
  fork(getTags),
  fork(updateTag),
  fork(addTag),
  fork(deleteTag),
  fork(saveTimeScale),
  fork(getSystemConfig),
  fork(saveCommonConfig),
  fork(getDepts)
];
