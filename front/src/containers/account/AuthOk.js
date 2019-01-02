import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import qs from 'qs';
import compose from 'recompose/compose';
import history from '../../history';
import { actions as accountActions } from '../../reducers/account';
import Loading from '../../components/common/Loading';

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
    return <Loading title="正在验证授权" />;
  }
}

export default compose(connect())(AuthOk);
