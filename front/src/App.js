import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import axios from 'axios';
import themeProvider from './services/themeProvider';
import { checkCookieLocal } from './services/utility';
import history from './history';
import Login from './containers/account/Login';

class App extends Component {
  state = {
    isCheckAuthOver: false
  };

  componentDidMount() {
    console.log('初始化check cookie');
    console.log(this.props.location);
    const path = this.props.location.pathname;
    if (checkCookieLocal()) {
      // 本地cookie存在，发送到服务器进行下一步验证
      axios
        .get('/auth/check-auth')
        // 后台可以根据origin获取来源网页地址
        // .get(`/account/check-auth?redirect=${this.props.location.pathname}`)
        .then(res => {
          this.setState({ isCheckAuthOver: true });
          if (res.success) {
            if (res.data.type === 'sso') {
              // cookie 是本地登录的信息，直接访问目的页面
            } else {
              // cookie 是通过sso登录的信息
              // 不在这里处理，后台直接返回302，重定向到sso的授权页面
            }
          } else {
            // 后台验证失败，重定向到登录页，清除cookie(http响应中做)
            history.push(
              `/login?redirect=${encodeURIComponent(
                path === '/login' ? '/' : path
              )}`
            );
          }
        });
    } else {
      this.setState({ isCheckAuthOver: true });
      // 本地cookie不存在或不正确，
      history.push(
        `/login?redirect=${encodeURIComponent(path === '/login' ? '/' : path)}`
      );
    }
  }

  render() {
    const { isCheckAuthOver } = this.state;
    return isCheckAuthOver ? (
      <React.Fragment>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/reg" component={() => <div>reg</div>} />
          <Route exact path="/" component={() => <div>index</div>} />
        </Switch>
      </React.Fragment>
    ) : null;
  }
}

export default compose(
  withRouter,
  themeProvider,
  connect()
)(App);
