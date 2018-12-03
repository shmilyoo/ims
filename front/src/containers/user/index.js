import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import ChangeDept from './ChangeDept';

const User = ({ match }) => {
  return (
    <Switch>
      <Route exact path={`${match.path}/info`} component={null} />
      <Route exact path={`${match.path}/dept/change`} component={ChangeDept} />
      <Route path="/" render={() => <Redirect to={`${match.path}/info`} />} />
    </Switch>
  );
};

export default User;
