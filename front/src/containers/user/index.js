import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import UserInfo from './UserInfo';

const User = ({ match }) => {
  return (
    <Switch>
      <Route exact path={`${match.path}/info`} component={UserInfo} />
      {/* <Route exact path={`${match.path}/info`} component={UserInfo} /> */}
      <Route path="/" render={() => <Redirect to={`${match.path}/info`} />} />
    </Switch>
  );
};

export default User;
