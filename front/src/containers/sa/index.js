import React, { PureComponent } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import SystemConfig from './SystemConfig';
import DeptAdmin from './DeptAdmin';

class SuperAdmin extends PureComponent {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.path}/system`} component={SystemConfig} />
        <Route exact path={`${match.path}/deptAdmin`} component={DeptAdmin} />
        <Route path="/" render={() => <Redirect to="/sa/system" />} />
      </Switch>
    );
  }
}

export default SuperAdmin;
