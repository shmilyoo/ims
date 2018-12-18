import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography } from '@material-ui/core';
import history from '../history';
import qs from 'qs';
import compose from 'recompose/compose';
import { sysName } from '../config';

const style = theme => ({
  root: {
    height: '90%'
  },
  link: {
    ...theme.sharedClass.link,
    marginLeft: '1rem'
  }
});

/**
 * /redirect?content=xx&to=xx&count=5
 */
class CountDownRedirect extends PureComponent {
  constructor(props) {
    super(props);
    const {
      content = '遇到未知错误，重定向中',
      to = '/',
      count = 5
    } = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    });
    this.state = { content, to, countDown: count };
    this.timer = setInterval(this.count, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }
  count = () => {
    this.setState({ countDown: this.state.countDown - 1 });
  };
  redirect = () => {
    const to = this.state.to;
    if (to.startsWith('http://') || to.startsWith('https://')) {
      global.location = to;
    } else history.push(to);
  };

  render() {
    document.title = `页面重定向 - ${sysName}`;
    const { classes, auth } = this.props;
    const { countDown, content } = this.state;
    if (countDown === 0) {
      clearInterval(this.timer);
      this.redirect();
    }
    return (
      <Grid
        className={classes.root}
        container
        justify="center"
        alignItems="center"
      >
        <Grid item xs={4} />
        <Grid item xs={4} container justify="center" spacing={24}>
          <Grid item>{countDown}</Grid>
          <Grid item xs container direction="column">
            <Grid item>{content}</Grid>
            <Grid item container>
              <Grid item>
                <Typography>正在为您跳转到目标页,</Typography>
              </Grid>
              <Grid item>
                <Typography className={classes.link} onClick={this.redirect}>
                  直接跳转
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  className={classes.link}
                  onClick={() => {
                    history.goBack();
                  }}
                >
                  返回上一页
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  className={classes.link}
                  onClick={() => {
                    history.push('/');
                  }}
                >
                  首页
                </Typography>
              </Grid>
              {!auth && (
                <React.Fragment>
                  <Grid item>
                    <Typography
                      className={classes.link}
                      onClick={() => {
                        history.push('/reg');
                      }}
                    >
                      注册
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      className={classes.link}
                      onClick={() => {
                        history.push('/login');
                      }}
                    >
                      登录
                    </Typography>
                  </Grid>
                </React.Fragment>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4} />
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.account.auth
  };
}

export default compose(
  withStyles(style),
  connect(mapStateToProps)
)(CountDownRedirect);
