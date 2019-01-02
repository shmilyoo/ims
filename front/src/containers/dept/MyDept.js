import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Grid, Typography, Divider } from '@material-ui/core';
import compose from 'recompose/compose';

class MyDept extends PureComponent {
  render() {
    return (
      <Grid container direction="column" spacing={8} wrap="nowrap">
        <Grid item justify="center">
          <Typography variant="h6">部门：</Typography>
        </Grid>
        <Grid item>
          <Divider />
        </Grid>
        <Grid item>
          <Typography variant="h6">部门公告</Typography>
        </Grid>
        <Grid item>部门新闻</Grid>
        <Grid item>人员在位</Grid>
      </Grid>
    );
  }
}

MyDept.propTypes = {};

function mapStateToProps(state) {
  return {
    user: state.account,
    deptId: state.account.deptId,
    info: state.account.info
  };
}

export default compose(connect(mapStateToProps))(MyDept);
