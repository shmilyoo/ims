import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import compose from 'recompose/compose';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';
import LeftNav from '../components/LeftNav';
import AppHead from './AppHead';
import { sysName, leftMenu } from '../config';
import SuperAdmin from './sa';
import Brief from './brief';
import Dept from './dept';
import User from './user';
import { actions as accountActions } from '../reducers/account';
import { actions as systemActions } from '../reducers/system';
import Work from './work';

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
    padding: 20,
    flex: 'auto',
    display: 'flex'
  },
  footer: {
    padding: 10,
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
    console.log('home mount!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    this.props.dispatch(accountActions.sagaGetAccountInfo());
    this.props.dispatch(systemActions.sagaGetDepts());
  }
  handleMenuClick = () => {
    this.setState({ leftOpen: !this.state.leftOpen });
  };
  render() {
    console.log('render home');
    const { classes } = this.props;
    return (
      <div className={classes.homeRoot}>
        <LeftNav menu={leftMenu} open={this.state.leftOpen} header={sysName} />
        <div
          className={classNames(classes.right, {
            [classes.rightShift]: !this.state.leftOpen
          })}
        >
          <AppHead type="user" onMenuClick={this.handleMenuClick} />
          <div className={classes.main}>
            <Switch>
              <Route path="/brief" component={Brief} />
              <Route path="/work" component={Work} />
              <Route path="/dept" component={Dept} />
              <Route path="/sa" component={SuperAdmin} />
              <Route path="/user" component={User} />
              <Route path="/about" component={null} />
              <Route path="/" component={() => <Redirect to="/brief" />} />
            </Switch>
          </div>
          <div className={classes.footer}>@copyright 2018</div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    // id: state.account.id
  };
}

export default compose(
  withRouter,
  withStyles(style),
  connect(mapStateToProps)
)(Home);
