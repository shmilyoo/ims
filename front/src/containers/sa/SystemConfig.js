import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';

class SystemConfig extends PureComponent {
  render() {
    return (
      <Grid container>
        <Grid item>手动更新缓存</Grid>
      </Grid>
    );
  }
}

SystemConfig.propTypes = {};

export default SystemConfig;
