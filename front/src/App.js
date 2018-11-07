import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import axios from 'axios';
import { checkCookieLocal } from './services/utility';
import history from './history';
import { actions as accountActions } from './reducers/account';
import { types as accountTypes } from './reducers/account';
import Home from './containers/Home';
import { Grid, Typography, CircularProgress } from '@material-ui/core';

class App extends Component {
  componentDidMount() {
    const { location, dispatch, auth } = this.props;
    const path = location.pathname;
    if (!auth) {
      // auth 为初始值undefined或者false
      dispatch({
        type: accountTypes.SAGA_CHECK_AUTH,
        redirect: encodeURIComponent(path)
      });
    }
  }

  render() {
    return this.props.auth ? (
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

function mapStateToProps(state) {
  return {
    auth: state.account.auth
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps)
)(App);
