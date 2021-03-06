import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import compose from 'recompose/compose';
import classNames from 'classnames';
import { withStyles, Grid } from '@material-ui/core';
import LeftNav from '../components/LeftNav';
import AppHead from './AppHead';
import { sysName, leftMenu } from '../config';
// import SuperAdmin from './sa';
// import Brief from './brief';
// import Dept from './dept';
// import User from './user';
import { actions as accountActions } from '../reducers/account';
import { actions as systemActions } from '../reducers/system';
// import Work from './work';
// import DeptManage from './deptManage';
// import About from './About';
import Loading from '../components/common/Loading';
import Loadable from 'react-loadable';

const LoadableBrief = Loadable({
  loader: () => import('./brief'),
  loading: Loading
});
const LoadableWork = Loadable({
  loader: () => import('./work'),
  loading: Loading
});
const LoadableDept = Loadable({
  loader: () => import('./dept'),
  loading: Loading
});
const LoadableDeptManage = Loadable({
  loader: () => import('./deptManage'),
  loading: Loading
});
const LoadableSuperAdmin = Loadable({
  loader: () => import('./sa'),
  loading: Loading
});
const LoadableUser = Loadable({
  loader: () => import('./user'),
  loading: Loading
});
const LoadableAbout = Loadable({
  loader: () => import('./About'),
  loading: Loading
});

const drawerWidth = 250;

const style = theme => ({
  homeRoot: {
    height: '100%',
    width: '100%'
  },

  right: {
    position: 'absolute',
    top: 0,
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    height: '100%',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  rightShift: {
    width: '100%',
    marginLeft: 0
  },

  main: {
    padding: '4rem'
  },
  footer: {
    padding: '1rem',
    textAlign: 'right'
  },
  white: {
    color: 'white'
  }
});

class Home extends React.Component {
  state = {
    leftOpen: true
  };
  componentDidMount() {
    if (!this.props.prerequisite) {
      this.props.dispatch(accountActions.sagaGetAccountInfo());
      this.props.dispatch(systemActions.sagaGetDepts());
      this.props.dispatch(systemActions.sagaGetSystemConfig());
    }
  }
  handleMenuClick = () => {
    this.setState({ leftOpen: !this.state.leftOpen });
  };
  render() {
    const { classes, prerequisite } = this.props;
    return (
      <div className={classes.homeRoot}>
        <LeftNav menu={leftMenu} open={this.state.leftOpen} header={sysName} />
        <Grid
          container
          direction="column"
          wrap="nowrap"
          className={classNames(classes.right, {
            [classes.rightShift]: !this.state.leftOpen
          })}
        >
          <Grid item>
            <AppHead type="user" onMenuClick={this.handleMenuClick} />
          </Grid>
          <Grid item xs className={classes.main} style={{ height: '400' }}>
            {prerequisite ? (
              <Switch>
                <Route path="/brief" component={LoadableBrief} />
                <Route path="/work" component={LoadableWork} />
                <Route path="/dept" component={LoadableDept} />
                <Route path="/dept-manage" component={LoadableDeptManage} />
                <Route path="/sa" component={LoadableSuperAdmin} />
                <Route path="/user" component={LoadableUser} />
                <Route path="/about" component={LoadableAbout} />
                <Route path="/" component={() => <Redirect to="/brief" />} />
              </Switch>
            ) : (
              <Loading />
            )}
          </Grid>
          <Grid item className={classes.footer}>
            @copyright 2018 - {new Date().getFullYear()}
          </Grid>
        </Grid>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    prerequisite: state.system.prerequisite
  };
}

export default compose(
  withRouter,
  withStyles(style),
  connect(mapStateToProps)
)(Home);
