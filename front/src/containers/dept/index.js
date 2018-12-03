import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import MyDept from './MyDept';

const Dept = ({ match }) => {
  return (
    <Switch>
      <Route exact path={`${match.path}`} component={MyDept} />
      <Route exact path={`${match.path}/work`} component={null} />
      <Route path="/" render={() => <Redirect to={`${match.path}`} />} />
    </Switch>
  );
};

export default Dept;
