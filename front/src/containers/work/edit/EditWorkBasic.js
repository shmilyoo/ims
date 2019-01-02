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

class EditWorkBasic extends React.PureComponent {
  state = {
    work: null
  };
  componentDidMount() {
    if (!this.props.tags) {
      this.props.dispatch(systemActions.sagaGetTags());
    }
    this.getWorkInfo();
  }
  // todo 使用utility中的getworkinfo
  getWorkInfo = () => {
    // 获取work基本信息和phase信息
    Axios.get(`/work/basic?id=${this.props.id}`).then(res => {
      if (res.success) {
        this.setState({ work: res.data });
      }
    });
  };
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
    manageDepts: state.account.manageDepts,
    deptDic: state.system.deptDic,
    deptArray: state.system.deptArray,
    tags: state.system.tags
  };
}

export default compose(connect(mapStateToProps))(EditWorkBasic);
