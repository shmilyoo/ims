// 本目录包含部门管理等界面
import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import AddWork from './AddWork';
import compose from 'recompose/compose';
import Loading from '../../components/common/Loading';
import AddWorkSuccess from './AddWorkSuccess';
import DeptWorks from './DeptWorks';
import EditDeptChannel from './EditDeptChannel';
import DeptBulletin from './DeptBulletin';

const DeptManage = ({ match, manageDept }) => {
  return (
    <React.Fragment>
      {manageDept ? (
        <Switch>
          <Route exact path={`${match.path}`} component={null} />
          <Route
            exact
            path={`${match.path}/bulletin`}
            component={DeptBulletin}
          />
          <Route
            exact
            path={`${match.path}/channels`}
            component={EditDeptChannel}
          />
          <Route exact path={`${match.path}/work/add`} component={AddWork} />
          <Route exact path={`${match.path}/work/edit`} component={null} />
          <Route exact path={`${match.path}/work`} component={DeptWorks} />
          <Route
            exact
            path={`${match.path}/work/add/success`}
            component={AddWorkSuccess}
          />
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
