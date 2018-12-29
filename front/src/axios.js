// request.js
import axios from 'axios';
import NProgress from 'nprogress';
import { actions as commonActions } from './reducers/common';
import { actions as accountActions } from './reducers/account';

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
      if (!response) return { success: false, error: '远程服务器没有响应' };
      // 如果请求结果为200，且success为false，在这里统一报错
      if (response.data && !response.data.success) {
        // todo 可以在res中多加一个字段 show，代表是否在用户界面显示，还是记在日志中
        dispatch(commonActions.showMessage(response.data.error, 'error'));
      }
      // 请求结束，蓝色过渡滚动条消失
      NProgress.done();
      return response.data;
    },
    error => {
      console.log('error at response interceptor', JSON.stringify(error));
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
        dispatch(accountActions.clearAuth());
        NProgress.done();
        return { success: false, error: error.message };
      }
      NProgress.done();
      if (axios.isCancel(error)) {
        // fileupload 组件中有cancel 将error传递过去自行处理
        throw error;
      }
      // todo 后续根据status不同值，导向不同的页面 404 500等
      // console.log(error.response.data, error.response.status);
      dispatch(
        commonActions.showMessage(`请求返回错误：${error.message}`, 'error')
      );
      return { success: false, error: error.message };
      // 如果是在saga调用，throw会导致saga死掉
      // throw new axios.Cancel('cancel request and redirect');
    }
  );
};

export default configureAxios;
