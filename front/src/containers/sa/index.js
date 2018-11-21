import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import SystemConfig from './SystemConfig';
import DeptRelation from './DeptRelation';

class SuperAdmin extends PureComponent {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.path}/system`} component={SystemConfig} />
        <Route
          exact
          path={`${match.path}/deptRelation`}
          component={DeptRelation}
        />
        <Route path="/" render={() => <Redirect to="/sa/system" />} />
      </Switch>
    );
  }
}

SuperAdmin.propTypes = {};

export default SuperAdmin;
