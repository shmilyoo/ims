// 本目录包含部门管理等界面
import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import AddWork from './AddWork';
import compose from 'recompose/compose';
import Loading from '../../components/common/Loading';

const DeptManage = ({ match, manageDept }) => {
  return (
    <React.Fragment>
      {manageDept ? (
        <Switch>
          <Route exact path={`${match.path}`} component={null} />
          <Route exact path={`${match.path}/work/add`} component={AddWork} />
          <Route exact path={`${match.path}/work/edit`} component={null} />
        </Switch>
      ) : (
        <Loading />
      )}
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return {
    manageDept: state.account.manageDept
  };
}

export default compose(connect(mapStateToProps))(DeptManage);
