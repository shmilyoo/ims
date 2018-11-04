import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import qs from 'qs';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  withStyles
} from '@material-ui/core';
import compose from 'recompose/compose';
import axios from 'axios';
import LoginForm from '../../forms/account/LoginForm';
import history from '../../history';
import { types as accountTypes } from '../../reducers/account';

const style = theme => ({
  card: {
    width: '35rem'
  },
  root: {
    height: '80%'
  },
  title: theme.typography.title3,
  links: {
    marginTop: '1rem'
  }
});

class Login extends PureComponent {
  handleSubmit = values => {
    return new Promise(resolve => {
      this.props.dispatch({
        type: accountTypes.SAGA_LOGIN_REQUEST,
        resolve,
        values
      });
    });
  };
  ssoLogin = () => {
    const { redirect } = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    });
    axios
      .get(`/auth/login?redirect=${encodeURIComponent(redirect || '/')}`)
      .then(res => {
        if (res.success && res.data.location) {
          global.location = res.data.location;
        }
      });
  };
  render() {
    const { classes, username } = this.props;
    console.log(`login page username is ${username}`);
    return username ? (
      <Redirect to="/" />
    ) : (
      <Grid
        className={classes.root}
        container
        justify="center"
        alignItems="center"
      >
        <Grid item>
          <Card className={classes.card}>
            <CardContent>
              <Typography align="center" className={classes.title}>
                登录
              </Typography>
              <LoginForm
                form="loginForm"
                initialValues={{ username: 'dddd', remember: true }}
                onSubmit={this.handleSubmit}
              />
              <Typography
                className={classes.links}
                align="right"
                color="textSecondary"
              >
                没有账户,
                <Link to="/reg">注册</Link> |{' '}
                <Link onClick={this.ssoLogin} to="#">
                  统一授权登录
                </Link>{' '}
                | <Link to="/bind">添加绑定</Link>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

Login.propTypes = {};

function mapStateToProps(state) {
  return {
    username: state.account.username
  };
}

export default compose(
  withStyles(style),
  connect(mapStateToProps)
)(Login);
