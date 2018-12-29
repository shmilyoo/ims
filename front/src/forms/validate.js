import axios from 'axios';
import { types as accountTypes } from '../reducers/account';

export const required = value => {
  console.log('check required', JSON.stringify(value));
  if (value === undefined || value === null) return '不能为空';
  const type = typeof value;
  switch (type) {
    case 'object':
      // 针对数组或者plain object
      return Array.isArray(value)
        ? value.length
          ? undefined
          : '不能为空'
        : Object.keys(value).length
          ? undefined
          : '不能为空';
    case 'number':
      return isNaN(value) ? '不能为空' : undefined;
    case 'string':
      return !!value.trim() ? undefined : '不能为空';
    default:
      return;
  }
};

export const checkPositiveInteger = value => {
  if (!Number.isInteger(value)) return '必须是正整数';
  if (value < 1) return '必须是正整数';
};

export const checkMaxStringLength = max => value => {
  console.log('checkMaxStringLength', JSON.stringify(value));
  if (!value) return;
  if (value.length > max) return `最大长度不能超过${max}个字符`;
};

// 直接在field的validate中使用checkMaxStringLength(8)等，会造成field组件的频繁render
// 在field的值或者form的value等变化的时候
export const checkMaxStringLength8 = checkMaxStringLength(8);
export const checkMaxStringLength16 = checkMaxStringLength(16);
export const checkMaxStringLength32 = checkMaxStringLength(32);
export const checkMaxStringLength64 = checkMaxStringLength(64);
export const checkMaxStringLength255 = checkMaxStringLength(255);

export const checkUsername = value => {
  // console.log(`checkUsername =${value}=`);
  if (value && !/^[a-zA-Z][a-zA-Z0-9_]{3,15}$/.test(value)) {
    return '4-16字符,字母开头,允许字母/数字/_';
  }
};

/**
 * 同步验证regForm的数据
 *
 * @param {{username:string,password1:string,password2:string}} values form提交的表单数据
 * @returns {*} errors
 */
export const syncCheckRegForm = values => {
  const errors = {};
  if (
    values.password1 &&
    values.password2 &&
    values.password1 !== values.password2
  ) {
    errors.password1 = errors.password2 = '两次密码需要相同';
  }
  return errors;
};

/**
 * 服务端验证注册的用户名是否冲突
 * @param {{username:string}} values 包含username的对象
 */
export const asyncCheckUsername = (values, dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: accountTypes.SAGA_CHECK_USERNAME,
      values,
      resolve,
      reject
    });
  });
};

export const syncCheckTimeScale = values => {
  const errors = {};
  const { amFrom, amTo, pmFrom, pmTo } = values;
  if (amTo <= amFrom || pmTo <= pmFrom) {
    errors._error = '结束时间应大于起始时间';
    return errors;
  }
  if (amTo > 43200 || pmFrom < 43200) {
    errors._error = '上午结束时间和下午开始时间不能越过中午12时';
    return errors;
  }
  return errors;
};

/**
 * deptForm的同步验证函数
 * @param {object} values form values
 */
export const syncCheckDeptForm = values => {
  const errors = {};
  if (values.name && values.name.length > 32) errors.name = '名称最多32个字符';
  if (!/^[a-zA-Z0-9]{1,16}$/.test(values.symbol))
    errors.symbol = '代号最多16个字符,字母或数字';
  if (values.intro && values.intro.length > 64)
    errors.intro = '介绍最多64个字符';
  return errors;
};

/**
 * 服务端验证dept的symbol是否冲突
 * @param {{symbol:string}} values 包含symbol的对象
 */
export const asyncCheckDeptSymbol = values => {
  return new Promise((resolve, reject) => {
    axios.get(`/dept/check-symbol/${values.symbol}`).then(res => {
      if (res.success) {
        if (res.data) {
          reject({ symbol: '代号已存在' });
        }
        resolve();
      } else {
        reject({ symbol: ' ' });
      }
    });
  });
};

/**
 * 函数作为redux-form的参数，确保在submit的时候，不需要先async validate
 */
export const shouldAsyncValidate = params => {
  if (!params.syncValidationPasses) {
    return false;
  }
  switch (params.trigger) {
    case 'blur':
      // blurring
      return true;
    case 'submit':
      // submitting, so only async validate if form is dirty or was never initialized
      // conversely, DON'T async validate if the form is pristine just as it was initialized
      return false;
    default:
      return false;
  }
};

/**
 * submit的时候，验证结束时间to，必须大于起始时间from。或者to为null
 * @param {array[]} values form submit values
 * @return {?{[fieldName:string]:string}} null代表验证通过
 */
export const syncCheckExpDate = values => {
  if (!values.exps) return null;
  let result = {};
  // fieldarray 返回的错误对象 {exps:{0:{to:'error'}}}
  values.exps.forEach((exp, index) => {
    if (exp.to === null) return false;
    if (exp.to < exp.from)
      result['exps'] = {
        ...result.exps,
        [index]: { to: '结束时间必须大于开始时间' }
      };
  });
  return JSON.stringify(result) === '{}' ? null : result;
};

/**
 * 比较多个列表，是否重复，
 * @param {Function} valueGetFuc  从列表中取出比较关键值的函数
 * @param {array} arrays 比较的列表合集
 * @returns {string | undefined} 通过返回空，不通过返回字符串说明
 */
export const checkArrayDuplicated = (valueGetFuc, ...arrays) => {
  let arraysNumberNotEmpty = 0;
  arrays.forEach(array => {
    if (array && array.length) {
      arraysNumberNotEmpty++;
    }
  });
  if (arraysNumberNotEmpty <= 1) return; // 只有一个数组有数据，不需要比较重复
  const checkValueArrays = arrays.map(array => array.map(valueGetFuc));
  const conflate = [];
  checkValueArrays.forEach(array => {
    array.forEach(value => {
      conflate.push(value);
    });
  });
  if (new Set(conflate).size !== conflate.length) return '列表重复';
  return;
};

/**
 * 比较开始和结束时间，结束时间为空或者比开始时间大正常
 * @param {number | Date} from 起始时间
 * @param {number | Date} to 结束时间
 * @param {Boolean} allowToEmpty 结束时间是否允许空
 * @returns {string | undefined} 通过返回空，不通过返回字符串说明
 */
export const checkFromToDate = (from, to, allowToEmpty = true) => {
  if (!to && !allowToEmpty) return '结束时间不能为空';
  if (from && to && from >= to) return '结束时间应为空或者大于开始时间';
};

export const checkCommonConfig = values => {
  const { allowExts } = values;
  const error = {};
  if (allowExts) {
    if (allowExts.includes('；')) {
      error.allowExts = '不能使用中文分号字符';
      return error;
    }
    const exts = allowExts.split(';');
    exts.forEach(ext => {
      if (!ext.startsWith('.')) {
        error.allowExts = '扩展名需要以 "." 开头';
        return;
      }
      if (ext.length < 2) {
        error.allowExts = `错误的扩展名 ${ext}`;
        return;
      }
    });
  }
  return error;
};
