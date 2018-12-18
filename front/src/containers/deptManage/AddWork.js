import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { SubmissionError } from 'redux-form';
import { Grid, Divider, Typography, TextField } from '@material-ui/core';
import WorkForm from '../../forms/work/WorkForm';
import { actions as workActions } from '../../reducers/work';

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
          usersInCharge: '负责人和参加人有重复'
        });
    }
    // todo 检查结束时间要比开始时间晚
    return new Promise(resolve => {
      this.props.dispatch(workActions.sagaAddWork(resolve, values));
    });
  };
  render() {
    const { manageDepts, deptDic, deptArray } = this.props;
    return (
      <Grid container direction="column" spacing={8} wrap="nowrap">
        <Grid item>
          <Typography variant="subtitle1">
            1.
            本页面用来发布部门的大项工作，日常工作应作为大项工作的子集进行发布
          </Typography>
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

function mapStateToProps(state) {
  return {
    manageDepts: state.account.manageDepts,
    deptDic: state.system.deptDic,
    deptArray: state.system.deptArray
  };
}

export default compose(connect(mapStateToProps))(AddWork);
