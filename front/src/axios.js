// request.js
import axios from 'axios';
import NProgress from 'nprogress';
// import { actions as commonActions } from './reducers/common';
// import { actions as accountActions } from './reducers/account';

const configureAxios = (dispatch, history) => {
  // 设置全局参数，如响应超市时间，请求前缀等。
  axios.defaults.timeout = 5000;
  axios.defaults.withCredentials = true;

  // 添加一个请求拦截器，用于设置请求过渡状态
  axios.interceptors.request.use(
    config => {
      // 请求开始，蓝色过渡滚动条开始出现
      NProgress.start();
      return config;
    },
    error => {
      console.error('error at axios request');
      return Promise.reject(error);
    }
  );

  // 添加一个返回拦截器
  axios.interceptors.response.use(
    response => {
      // 如果请求结果为200，且success为false，在这里统一报错
      if (!response.data.success) {
        // todo 可以在res中多加一个字段 show，代表是否在用户界面显示，还是记在日志中
        // dispatch(commonActions.showMessage(response.data.error, 'error'));
      }
      // 请求结束，蓝色过渡滚动条消失
      NProgress.done();
      return response.data;
    },
    error => {
      // 非2xx响应在这里处理
      if (error.response && error.response.status === 402) {
        // 自定义402 重定向代替302重定向,用于服务器主动向客户端发送重定向。
        // 服务器响应客户端重定向在前台代码中处理，使用200status，并有redirect字段
        NProgress.done();
        global.location = error.response.data.data.location;
        return { success: true, message: 'redirect by server' };
      }
      // 401 auth fail响应在这里处理
      if (error.response && error.response.status === 401) {
        // 自定义401 auth 失败处理
        // dispatch(accountActions.clearAuth());
        // dispatch(accountActions.sagaForceLogout());
        NProgress.done();
        return { success: false, error: error.message };
        // 这里throw错误需要在saga中处理，要不然saga会死掉
        // throw new axios.Cancel('cancel request and redirect');
      }
      // dispatch(
      //   commonActions.showMessage(
      //     process.env.NODE_ENV === 'production' ? '请求失败' : error.message,
      //     'error'
      //   )
      // );
      // 请求结束，蓝色过渡滚动条消失
      // 即使出现异常，也要调用关闭方法，否则一直处于加载状态很奇怪
      NProgress.done();
      // return Promise.reject(error);
      console.log(error.response.data, error.response.status);
      // 如果是在saga调用，throw会导致saga死掉
      throw new axios.Cancel('cancel request and redirect');
    }
  );
};

export default configureAxios;