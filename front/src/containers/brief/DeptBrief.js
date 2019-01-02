import React, { PureComponent } from 'react';
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

export default DeptBrief;
