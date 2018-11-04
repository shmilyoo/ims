'use strict';

const axios = require('axios');

const configureAxios = () => {
  // 设置全局参数，如响应超市时间，请求前缀等。
  axios.defaults.timeout = 5000;
  // axios.defaults.withCredentials = true;

  // 添加一个返回拦截器
  axios.interceptors.response.use(
    response => {
      response.data.status = response.status;
      return response.data;
    },
    error => {
      console.log(error);
      return {
        success: false,
        error: error.message,
        status: error.response ? error.response.status || 500 : 500,
      };
    }
  );
};

module.exports = configureAxios;
