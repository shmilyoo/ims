import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import SystemConfig from './SystemConfig';
import DeptRelationWrapper from './DeptRelationWrapper';
import DeptAdminWrapper from './DeptAdminWrapper';

class SuperAdmin extends PureComponent {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.path}/system`} component={SystemConfig} />
        <Route
          exact
          path={`${match.path}/deptRelation`}
          component={DeptRelationWrapper}
        />
        <Route
          exact
          path={`${match.path}/deptAdmin`}
          component={DeptAdminWrapper}
        />
        <Route path="/" render={() => <Redirect to="/sa/system" />} />
      </Switch>
    );
  }
}

SuperAdmin.propTypes = {};

export default SuperAdmin;
