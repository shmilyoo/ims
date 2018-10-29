import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import qs from 'qs';
import { Grid, Typography, CircularProgress } from '@material-ui/core';
import compose from 'recompose/compose';
import history from '../../history';
import { actions as accountActions } from '../../reducers/account';

class AuthOk extends PureComponent {
  constructor(props) {
    super(props);
    const { token, redirect = '/login' } = qs.parse(props.location.search, {
      ignoreQueryPrefix: true
    });
    if (!token) {
      history.push('/login');
    }
    this.state = {
      token,
      redirect
    };
  }

  componentDidMount() {
    this.props.dispatch(
      accountActions.sagaAuthRequest(this.state.token, this.state.redirect)
    );
  }

  render() {
    return (
      <Grid
        style={{ height: '100%' }}
        container
        justify="center"
        alignItems="center"
      >
        <Grid item xs={3} container direction="column">
          <Grid item>
            <Typography color="primary" variant="h4" align="center">
              正在验证授权
              <CircularProgress style={{ marginLeft: '2rem' }} size="2rem" />
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

AuthOk.propTypes = {};

export default compose(connect())(AuthOk);
