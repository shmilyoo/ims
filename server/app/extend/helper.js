'use strict';
// 项目中在helper中定义一些不需要app/ctx等上下文的帮助函数,但会在app/ctx中调用

module.exports = {
  /**
   *
   * @param {boolean} success 返回请求是否成功
   * @param {Object} dataOrError success为true时为object，false时为错误描述字符串
   * @return {object} {success:true,{...data}}或者{success:false,error:string}
   */
  getRespBody(success, dataOrError) {
    return success
      ? { success, data: dataOrError }
      : { success, error: dataOrError };
  },

  /**
   * set cookies时根据参数获取expires, maxAge
   * @param {'week'|'day'|'month'|'hour'|'minute'} type 时间单位，周月日等
   * @param {number} num 倍数
   * @return {array} [ expires:utcstring, maxAge:million seconds ]
   */
  getExpiresAndMaxAge(type, num) {
    let maxAge;
    switch (type) {
      case 'week':
        maxAge = 3600 * 24 * 7 * 1000 * num;
        break;
      case 'day':
        maxAge = 3600 * 24 * 1000 * num;
        break;
      case 'month':
        maxAge = 3600 * 24 * 30 * 1000 * num;
        break;
      case 'hour':
        maxAge = 3600 * 1000 * num;
        break;
      case 'minute':
        maxAge = 60 * 1000 * num;
        break;
      default:
        maxAge = 1000 * num;
        break;
    }
    let expires = new Date();
    expires.setTime(expires.getTime() + maxAge);
    expires = expires.toUTCString();
    return [ expires, maxAge ];
  },

  getCookie(key) {
    return this.ctx.cookies.get(key, { signed: false });
  },

  setCookie(key, value, option = {}) {
    this.ctx.cookies.set(
      key,
      value,
      Object.assign({ signed: false, httpOnly: false }, option)
    );
  },

  clearCookie() {
    this.setCookie('ims_id', '');
    this.setCookie('ims_authType', '');
  },

  timeFunctions: {
    getNowUnix: () => Math.floor(new Date().getTime() / 1000),
    /**
     * 从unix时间戳返回日期字符串
     * @param {number} unix unix 时间戳
     * @param {string} type 返回的格式，date,datetime,time
     * @return {string}  返回的时间格式化字符串
     */
    formatFromUnix: (unix, type = 'date') => {
      const date = new Date(unix * 1000);
      switch (type) {
        case 'datetime':
          return `${date.getFullYear()}-${date.getMonth() +
            1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
        case 'time':
          return `${date.getHours()}:${date.getMinutes()}`;
        default:
          return `${date.getFullYear()}-${date.getMonth() +
            1}-${date.getDate()}`;
      }
    },
  },
};
