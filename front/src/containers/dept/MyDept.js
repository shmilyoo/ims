import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';

class MyDept extends PureComponent {
  render() {
    return (
      <Grid container direction="column" spacing={8} wrap="nowrap">
        <Grid item>部门公告</Grid>
        <Grid item>部门新闻</Grid>
        <Grid item>人员在位</Grid>
      </Grid>
    );
  }
}

MyDept.propTypes = {};

export default MyDept;
