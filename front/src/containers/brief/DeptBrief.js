import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';

class DeptBrief extends PureComponent {
  render() {
    return (
      <Grid container direction="column">
        <Grid item>部门公告</Grid>
        <Grid item>人员在位</Grid>
        <Grid item>大项工作</Grid>
        <Grid item>121</Grid>
      </Grid>
    );
  }
}

DeptBrief.propTypes = {};

export default DeptBrief;
