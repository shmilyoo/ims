import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { types as accountTypes } from './reducers/account';
import Home from './containers/Home';
import Loading from './components/common/Loading';

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
      <Loading showTitle={true} title="正在验证授权" />
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
