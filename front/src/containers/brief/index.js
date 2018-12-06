import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import DeptBrief from './DeptBrief';
import ScheduleBrief from './ScheduleBrief';
import MyBrief from './MyBrief';

class Brief extends PureComponent {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.path}`} component={MyBrief} />
        <Route exact path={`${match.path}/department`} component={DeptBrief} />
        <Route
          exact
          path={`${match.path}/schedule`}
          component={ScheduleBrief}
        />
        <Route path="/" render={() => <Redirect to="/brief/mine" />} />
      </Switch>
    );
  }
}

Brief.propTypes = {};

export default Brief;
