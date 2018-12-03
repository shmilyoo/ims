// redux-form field的format和parse 帮助函数
import moment from 'moment';

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

export const formatUnixTsToMoment = ts => {
  console.log('formatUnixTsToMoment ', ts, '----');
  return Number.isInteger(ts) ? moment.unix(ts) : null;
};

/**
 * @param {moment} m a moment instance
 * @return unix timestamp
 */
export const parseMomentToUnixTs = m => {
  return moment(m).unix();
};

/**
 * 将从0点起经历的秒数转化为Date
 * @param {number} seconds 从0点起经历的秒数
 */
export const formatSecondsToDate = seconds => {
  if (seconds === undefined) seconds = 0;
  const now = new Date();
  const ts = now.setHours(0, 0, 0, 0);
  return new Date(ts + seconds * 1000);
};

/**
 * 将日期实例转化成从当日0点起经历的秒数
 * @param {Date} date 日期实例
 */
export const parseDateToSeconds = date => {
  if (!(date instanceof Date)) return;
  // console.log('parseDateToSeconds ', typeof date, date);
  return Math.floor((date.getTime() - new Date().setHours(0, 0, 0, 0)) / 1000);
};
