import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';
import { Grid, Typography, withStyles, Divider } from '@material-ui/core';
import qs from 'qs';
import {
  toRedirectPage,
  getDeptArraySync,
  getTaskInfo
} from '../../services/utility';
import compose from 'recompose/compose';
import TaskForm from '../../forms/work/TaskForm';
import Loading from '../../components/common/Loading';
import Axios from 'axios';
import { checkFromToDate, checkArrayDuplicated } from '../../forms/validate';
import history from '../../history';

const style = theme => ({
  link: theme.sharedClass.link
});

class EditWorkTask extends PureComponent {
  state = {
    id: '',
    task: null
  };
  componentDidMount() {
    const { id } = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    });
    if (!id) {
      toRedirectPage('错误的请求url参数', '/');
      return;
    }
    getTaskInfo({
      id,
      withUsers: true,
      withWork: true,
      withPublisher: true,
      withAttachments: true,
      order: { user: 'asc' }
    }).then(res => {
      if (res.success) {
        const task = { ...res.data, usersInCharge: [], usersAttend: [] };
        res.data.users.forEach(
          ({ id, name, deptId, userTask: { isInCharge } }) => {
            if (isInCharge) task.usersInCharge.push({ id, name, deptId });
            else task.usersAttend.push({ id, name, deptId });
          }
        );
        this.setState({
          task,
          id
        });
      }
    });
  }

  handleSubmit = values => {
    const { usersInCharge, usersAttend } = values;
    let error;
    if (checkArrayDuplicated(user => user.id, usersInCharge, usersAttend)) {
      throw new SubmissionError({
        usersInCharge: '负责人和参加人不能重复'
      });
    }
    if ((error = checkFromToDate(values.from, values.to, true))) {
      throw new SubmissionError({
        from: error
      });
    }
    return new Promise((resolve, reject) => {
      Axios.post('/task/edit', values).then(res => {
        if (res.success) {
          resolve();
          history.push(`/work/task/info?id=${values.id}`);
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
    const { task } = this.state;
    const { deptDic, deptArray, allowExts, classes } = this.props;
    if (!task) return <Loading />;
    const work = task.work;
    const dept = deptDic[work.deptId];
    return (
      <Grid container justify="center">
        <Grid item container direction="column" wrap="nowrap" spacing={8}>
          <Grid item>
            <Typography variant="h4" align="center">
              编辑大项工作的子工作/任务
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6">
              所属部门：
              {dept &&
                getDeptArraySync(dept.id, deptDic).map(
                  ({ id, name }, index) => (
                    <span key={id}>
                      {index > 0 && ' - '}
                      <Link className={classes.link} to={`/dept?id=${id}`}>
                        {name}
                      </Link>
                    </span>
                  )
                )}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6">
              <span className={classes.icon} />
              所属大项工作：
              {work && (
                <Link className={classes.link} to={`/work/info?id=${work.id}`}>
                  {work.title}
                </Link>
              )}
            </Typography>
          </Grid>
          <Grid item>
            <Divider />
          </Grid>
          <Grid item>
            <TaskForm
              edit={true}
              enableReinitialize
              initialValues={task}
              onSubmit={this.handleSubmit}
              deptArray={deptArray}
              allowExts={allowExts}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

EditWorkTask.propTypes = {};

function mapStateToProps(state) {
  return {
    deptDic: state.system.deptDic,
    deptArray: state.system.deptArray,
    allowExts: state.system.allowExts
  };
}

export default compose(
  withStyles(style),
  connect(mapStateToProps)
)(EditWorkTask);
