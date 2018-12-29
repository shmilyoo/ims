// 本目录包含个人工作和日程的相关页面
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import WorkInfo from './WorkInfo';
import WorkEdit from './edit';
import AddWorkArticle from './AddWorkArticle';

const Work = ({ match }) => {
  return (
    <Switch>
      <Route exact path={`${match.path}/mine`} component={null} />
      <Route exact path={`${match.path}/schedule`} component={null} />
      <Route exact path={`${match.path}/schedule/manage`} component={null} />
      <Route exact path={`${match.path}/info`} component={WorkInfo} />
      <Route exact path={`${match.path}/edit`} component={WorkEdit} />
      <Route
        exact
        path={`${match.path}/article/add`}
        component={AddWorkArticle}
      />
    </Switch>
  );
};

export default Work;
