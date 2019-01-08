import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { SubmissionError } from 'redux-form';
import { Grid } from '@material-ui/core';
import WorkForm from '../../../forms/work/WorkForm';
import { checkArrayDuplicated, checkFromToDate } from '../../../forms/validate';
import { actions as systemActions } from '../../../reducers/system';
import Axios from 'axios';
import {
  getWorkInfo,
  checkCanManageWork,
  toRedirectPage
} from '../../../services/utility';

class EditWorkBasic extends React.PureComponent {
  state = {
    work: null
  };
  componentDidMount() {
    if (!this.props.tags) {
      this.props.dispatch(systemActions.sagaGetTags());
    }
    const { id, accountId, manageDepts } = this.props;
    getWorkInfo({
      id: id,
      withUsers: 1,
      withPublisher: 1,
      withPhases: 1,
      withAttachments: 1,
      order: { phase: 'asc', user: 'asc' }
    }).then(res => {
      if (res.success) {
        const work = { ...res.data, usersInCharge: [], usersAttend: [] };
        res.data.users.forEach(
          ({ id, name, deptId, userWork: { isInCharge } }) => {
            if (isInCharge) work.usersInCharge.push({ id, name, deptId });
            else work.usersAttend.push({ id, name, deptId });
          }
        );
        this.setState({
          work
        });
        const canManageWork = checkCanManageWork(
          manageDepts,
          accountId,
          work.deptId,
          work.usersInCharge
        );
        if (!canManageWork)
          toRedirectPage(
            '没有编辑本工作的权限，重定向到工作信息页',
            `/work/info?id=${work.id}`
          );
      }
    });
  }

  handleSubmit = values => {
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
    return new Promise((resolve, reject) => {
      Axios.post('/work/basic/edit', {
        id: this.props.id,
        values
      }).then(res => {
        if (res.success) {
          resolve();
          this.setState({ work: values });
        } else {
          reject(
            new SubmissionError({
              _error: res.error
            })
          );
        }
      });
    });
  };
  render() {
    const { manageDepts, deptDic, deptArray, tags } = this.props;
    const { work } = this.state;
    return (
      <Grid container direction="column" spacing={8} wrap="nowrap">
        <Grid item>
          <WorkForm
            form="editWorkBasicForm"
            edit={true}
            enableReinitialize
            onSubmit={this.handleSubmit}
            deptArray={deptArray}
            deptDic={deptDic}
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
            initialValues={work}
          />
        </Grid>
      </Grid>
    );
  }
}

EditWorkBasic.propTypes = {
  id: PropTypes.string.isRequired // 需要编辑的work 的id
};

function mapStateToProps(state) {
  return {
    accountId: state.account.id,
    manageDepts: state.account.manageDepts,
    deptDic: state.system.deptDic,
    deptArray: state.system.deptArray,
    tags: state.system.tags
  };
}

export default compose(connect(mapStateToProps))(EditWorkBasic);
