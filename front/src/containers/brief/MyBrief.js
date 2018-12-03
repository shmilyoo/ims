import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';

class MyBrief extends PureComponent {
  render() {
    return (
      <Grid container>
        <Grid item>我参与的大项工作</Grid>
        <Grid item>我需要接受的日程</Grid>
        <Grid item>正在进行中的日程</Grid>
      </Grid>
    );
  }
}

MyBrief.propTypes = {};

export default MyBrief;
