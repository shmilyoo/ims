import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { SubmissionError } from 'redux-form';
import PropTypes from 'prop-types';
import { Grid, Divider, Typography } from '@material-ui/core';
import DeptHeadChange from '../../components/common/DeptHeadChange';
import WorkForm from '../../forms/work/WorkForm';
import { userInfo } from 'os';

class AddWork extends PureComponent {
  handleSubmit = values => {
    const { usersInCharge, usersAttend } = values;
    if (usersAttend) {
      const userIdChargeArray = usersInCharge.map(user => user.id);
      const userIdAttendArray = usersAttend.map(user => user.id);
      if (
        new Set([...userIdChargeArray, ...userIdAttendArray]).size !==
        userIdChargeArray.length + userIdAttendArray.length
      )
        throw new SubmissionError({
          usersInCharge: '负责人和参加人有重复',
          usersAttend: '负责人和参加人有重复'
        });
    }
  };
  render() {
    const { manageDept, manageDepts, deptDic, deptArray } = this.props;
    return (
      <Grid container direction="column" spacing={8} wrap="nowrap">
        <Grid item>
          <Typography variant="subtitle1">1. 发布工作提醒1</Typography>
          <Typography variant="subtitle1">2. 发布工作提醒2</Typography>
        </Grid>
        <Grid item>
          <Divider />
        </Grid>
        <Grid item>
          <WorkForm
            form="workForm"
            onSubmit={this.handleSubmit}
            deptArray={deptArray}
            deptDic={deptDic}
            canSelectIdList={manageDepts}
          />
        </Grid>
      </Grid>
    );
  }
}

AddWork.propTypes = {};

function mapStateToProps(state) {
  return {
    manageDept: state.account.manageDept,
    manageDepts: state.account.manageDepts,
    deptDic: state.system.deptDic,
    deptArray: state.system.deptArray
  };
}

export default compose(connect(mapStateToProps))(AddWork);
