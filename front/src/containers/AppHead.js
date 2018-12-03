import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  Person as UserIcon,
  PowerSettingsNew as LogoutIcon
} from '@material-ui/icons';
import { actions as accountActions } from '../reducers/account';
import compose from 'recompose/compose';
import { pathTitle, sysName } from '../config';

class AppHead extends React.PureComponent {
  state = {
    logoutDialogOpen: false
  };
  handleLogout = () => {
    this.setState({ logoutDialogOpen: true });
  };
  closeDialog = () => {
    this.setState({ logoutDialogOpen: false });
  };
  logout = type => {
    // type: all || system || local
    this.props.dispatch(accountActions.sagaLogout(type));
    this.closeDialog();
  };
  render() {
    const {
      onMenuClick,
      name,
      color,
      location: { pathname }
    } = this.props;
    const { logoutDialogOpen } = this.state;
    document.title = `${pathTitle[pathname]} - ${sysName}`;
    return (
      <React.Fragment>
        <AppBar color={color} position="static">
          <Toolbar style={{ display: 'flex' }}>
            <IconButton onClick={onMenuClick}>
              <MenuIcon />
            </IconButton>
            <Typography style={{ flex: 'auto' }} variant="h6">
              {pathTitle[pathname]}
            </Typography>
            <IconButton title={name}>
              <UserIcon />
            </IconButton>
            <IconButton title="注销" onClick={this.handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Dialog
          onClose={this.closeDialog}
          open={logoutDialogOpen}
          onEscapeKeyDown={this.closeDialog}
          style={{ top: '-20rem' }}
        >
          <DialogTitle>请选择注销范围</DialogTitle>
          <DialogActions style={{ padding: '1.5rem' }}>
            <Button
              variant="contained"
              color="secondary"
              title="所有关联到统一认证系统的本用户账号均注销"
              onClick={() => {
                this.logout('all');
              }}
            >
              全统一认证
            </Button>
            <Button
              variant="contained"
              color="secondary"
              title="本用户在所有设备上登录的本系统账号均注销"
              onClick={() => {
                this.logout('system');
              }}
            >
              本系统
            </Button>
            <Button
              variant="contained"
              color="secondary"
              title="只注销本机账号"
              onClick={() => {
                this.logout('local');
              }}
            >
              本机
            </Button>
            <Button variant="contained" onClick={this.closeDialog}>
              取消
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

AppHead.propTypes = {
  onMenuClick: PropTypes.func,
  title: PropTypes.string,
  logout: PropTypes.func,
  color: PropTypes.string
};

AppHead.defaultProps = {
  color: 'secondary',
  type: 'user'
};

function mapStateToProps(state) {
  return {
    username: state.account.username,
    name: state.account.info.name
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps)
)(AppHead);
