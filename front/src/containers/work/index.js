// 本目录包含个人工作和日程的相关页面
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import WorkInfo from './WorkInfo';
import WorkEdit from './edit';
import AddWorkArticle from './AddWorkArticle';
import AddWorkTask from './AddWorkTask';
import AddTaskSuccess from './AddTaskSuccess';
import AddWorkArticleSuccess from './AddWorkArticleSuccess';
import EditWorkArticle from './EditWorkArticle';
import WorkTaskInfo from './WorkTaskInfo';

const Work = ({ match }) => {
  return (
    <Switch>
      <Route exact path={`${match.path}/mine`} component={null} />
      <Route exact path={`${match.path}/schedule`} component={null} />
      <Route exact path={`${match.path}/schedule/manage`} component={null} />
      <Route exact path={`${match.path}/info`} component={WorkInfo} />
      <Route exact path={`${match.path}/edit`} component={WorkEdit} />
      <Route exact path={`${match.path}/article`} component={null} />
      <Route
        exact
        path={`${match.path}/article/add`}
        component={AddWorkArticle}
      />
      <Route
        exact
        path={`${match.path}/article/edit`}
        component={EditWorkArticle}
      />
      <Route
        exact
        path={`${match.path}/article/add/success`}
        component={AddWorkArticleSuccess}
      />
      <Route exact path={`${match.path}/task/add`} component={AddWorkTask} />
      <Route exact path={`${match.path}/task/edit`} component={null} />
      <Route exact path={`${match.path}/task/info`} component={WorkTaskInfo} />
      <Route
        exact
        path={`${match.path}/task/add/success`}
        component={AddTaskSuccess}
      />
    </Switch>
  );
};

export default Work;
