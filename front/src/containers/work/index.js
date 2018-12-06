// 本目录包含个人工作和日程的相关页面
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

const Work = ({ match }) => {
  return (
    <Switch>
      <Route exact path={`${match.path}`} component={null} />
      <Route exact path={`${match.path}/schedule`} component={null} />
      <Route exact path={`${match.path}/schedule/manage`} component={null} />
    </Switch>
  );
};

export default Work;
