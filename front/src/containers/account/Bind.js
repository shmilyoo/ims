// @flow
import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { types as accountTypes } from '../../reducers/account';
import { Card, withStyles, CardContent, Typography } from '@material-ui/core';
import compose from 'recompose/compose';
import Cookies from 'js-cookie';
import history from '../../history';
import { ssoRegUrl, sysName } from '../../config';
import BindForm from '../../forms/account/BindForm';

const styles = theme => ({
  card: {
    width: '35rem',
    margin: 'auto'
  },
  container: {
    height: '80%',
    display: 'flex'
  },
  title: theme.typography.title3
});

class Bind extends React.Component {
  constructor(props) {
    super(props);
    if (Cookies.get('ims_authType')) {
      history.push('/');
    }
  }
  handleLinkToSsoReg = () => {
    global.location = ssoRegUrl;
  };
  handleSubmit = values => {
    return new Promise(resolve => {
      this.props.dispatch({
        type: accountTypes.SAGA_BIND_REQUEST,
        resolve,
        values
      });
    });
  };

  render() {
    document.title = `绑定统一授权系统用户 - ${sysName}`;
    console.log('render bind');
    const { classes, username } = this.props;
    return (
      <div className={classes.container}>
        {username ? (
          <Redirect to="/" />
        ) : (
          <Card className={classes.card}>
            <CardContent>
              <Typography align="center" className={classes.title}>
                绑定统一认证系统用户
              </Typography>
              <BindForm onSubmit={this.handleSubmit} />
              <Typography align="right" className={classes.buttomText}>
                已有账户?
                <Link to="/login">登录</Link>
              </Typography>
              <Typography align="right" className={classes.buttomText}>
                没有用户?
                <Link to="/reg">注册</Link>
              </Typography>
              <Typography align="right" className={classes.buttomText}>
                没有统一认证系统用户?
                <Link to="#" onClick={this.handleLinkToSsoReg}>
                  去注册
                </Link>
              </Typography>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    username: state.account.username
  };
}

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(Bind);
