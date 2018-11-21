import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';

class UserManager extends PureComponent {
  render() {
    return (
      <Grid container>
        <Grid item>显示用户列表</Grid>
      </Grid>
    );
  }
}

UserManager.propTypes = {};

export default UserManager;
