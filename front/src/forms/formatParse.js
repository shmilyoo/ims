// redux-form field的format和parse 帮助函数
// import moment from 'moment';
import { isNumber } from 'util';

export const formatSex = value => {
  // 用户性别：1男性, 2女性, 0未知
  if (value === 1) {
    return 'male';
  } else if (value === 2) {
    return 'female';
  } else return '';
};

export const parseSex = value => {
  if (value === 'male') return 1;
  else return 2;
};

// datepicker 使用原生js替代了moment 减少打包大小
// export const formatUnixTsToMoment = ts => {
//   console.log('formatUnixTsToMoment ', ts, '----');
//   return Number.isInteger(ts) ? moment.unix(ts) : null;
// };

// /**
//  * @param {moment} m a moment instance
//  * @return unix timestamp
//  */
// export const parseMomentToUnixTs = m => {
//   return moment(m).unix();
// };

/**
 * 将从0点起经历的秒数转化为Date
 * @param {number} seconds 从0点起经历的秒数
 */
export const formatSecondsToDate = seconds => {
  if (Number.isInteger(seconds)) {
    return new Date(new Date().setHours(0, 0, 0, 0) + seconds * 1000);
  }
  return null;
};

/**
 * 将日期实例转化成从当日0点起经历的秒数
 * @param {Date} date 日期实例
 */
export const parseDateToSeconds = date => {
  if (!(date instanceof Date)) return '';
  return Math.floor((date.getTime() - new Date().setHours(0, 0, 0, 0)) / 1000);
};

/**
 * 将unix 时间戳转化为Date
 * @param {number} time unix 时间戳
 */
export const formatUnixTimeToDate = time => {
  if (Number.isInteger(time)) return new Date(time * 1000);
  return null;
};

/**
 * 将日期实例转化成unix 时间戳
 * @param {Date} date 日期实例
 */
export const parseDateToUnixTime = date => {
  if (!(date instanceof Date)) return null;
  return Math.floor(date.getTime() / 1000);
};

export const parseStringToNumber = s => {
  return Number(s);
};
export const formatNumberToString = n => {
  return `${n}`;
};
