import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import MyDept from './MyDept';

const Dept = ({ match }) => {
  return (
    <Switch>
      <Route exact path={`${match.path}/mine`} component={MyDept} />
      <Route exact path={`${match.path}/work`} component={null} />
      <Route exact path={`${match.path}`} component={null} />
      <Route path="/" render={() => <Redirect to={`${match.path}/mine`} />} />
    </Switch>
  );
};

export default Dept;
