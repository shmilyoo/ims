import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import axios from 'axios';
import { checkCookieLocal } from './services/utility';
import history from './history';
import { actions as accountActions } from './reducers/account';
import Home from './containers/Home';
import { Grid, Typography, CircularProgress } from '@material-ui/core';

class App extends Component {
  state = {
    isCheckAuthOver: false
  };

  componentDidMount() {
    const { location, dispatch } = this.props;
    const path = location.pathname;
    if (checkCookieLocal()) {
      // 本地cookie存在，发送到服务器进行下一步验证
      axios
        .get('/auth/check-auth')
        // 后台可以根据origin获取来源网页地址
        // .get(`/account/check-auth?redirect=${this.props.location.pathname}`)
        .then(res => {
          this.setState({ isCheckAuthOver: true });
          if (res.success) {
            // user.keys='id', username', 'active', 'name', 'sex', 'dept_id','authType'
            dispatch(
              accountActions.checkAuthSuccess(res.data.authType, res.data.user)
            );
          } else {
            // 后台验证失败，重定向到登录页，清除cookie(http响应中做)
            console.log('后台验证失败，重定向到登录页');
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
      <Route path="/" component={Home} />
    ) : (
      <Grid
        style={{ height: '70%' }}
        container
        justify="center"
        alignItems="center"
      >
        <Grid item xs={3} container direction="column">
          <Grid item>
            <Typography color="primary" variant="h4" align="center">
              正在验证
              <CircularProgress style={{ marginLeft: '2rem' }} size="2rem" />
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default compose(
  withRouter,
  connect()
)(App);
