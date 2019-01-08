import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { SubmissionError } from 'redux-form';
import { Grid, Divider, Typography } from '@material-ui/core';
import WorkForm from '../../forms/work/WorkForm';
import { actions as systemActions } from '../../reducers/system';
import { actions as workActions } from '../../reducers/work';
import { checkArrayDuplicated, checkFromToDate } from '../../forms/validate';

class AddWork extends PureComponent {
  componentDidMount() {
    if (!this.props.tags) {
      this.props.dispatch(systemActions.sagaGetTags());
    }
  }
  handleSubmit = values => {
    // 后台需要重新处理phases逻辑，根据type是add还是delete等判断
    const { usersInCharge, usersAttend } = values;
    let error;
    if (
      (error = checkArrayDuplicated(
        user => user.id,
        usersInCharge,
        usersAttend
      ))
    ) {
      throw new SubmissionError({
        usersInCharge: error
      });
    }
    if ((error = checkFromToDate(values.from, values.to, true))) {
      throw new SubmissionError({
        from: error
      });
    }
    return new Promise(resolve => {
      this.props.dispatch(workActions.sagaAddWork(resolve, values));
    });
  };
  render() {
    const { manageDepts, deptDic, deptArray, allowExts, tags } = this.props;
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
            form="addWorkForm"
            edit={false}
            onSubmit={this.handleSubmit}
            deptArray={deptArray}
            deptDic={deptDic}
            allowExts={allowExts}
            tags={
              tags
                ? tags.map(tag => ({
                    value: tag.id,
                    label: tag.name,
                    color: tag.color
                  }))
                : []
            }
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
    deptArray: state.system.deptArray,
    tags: state.system.tags,
    allowExts: state.system.allowExts
  };
}

export default compose(connect(mapStateToProps))(AddWork);
