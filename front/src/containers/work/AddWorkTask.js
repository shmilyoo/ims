import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';
import { Grid, Typography, withStyles, Divider } from '@material-ui/core';
import qs from 'qs';
import {
  toRedirectPage,
  getWorkInfo,
  getDeptArraySync
} from '../../services/utility';
import compose from 'recompose/compose';
import TaskForm from '../../forms/work/TaskForm';
import { actions as workActions } from '../../reducers/work';
import Loading from '../../components/common/Loading';

const style = theme => ({
  link: theme.sharedClass.link
});

class AddWorkArticle extends PureComponent {
  constructor(props) {
    super(props);
    const { workId } = qs.parse(props.location.search, {
      ignoreQueryPrefix: true
    });
    if (!workId) toRedirectPage('错误的请求url参数', document.referrer || '/');
    this.state = { workId, dept: null, work: null };
  }

  componentDidMount() {
    getWorkInfo({ id: this.state.workId, withDept: 1 }).then(res => {
      if (res.success) {
        const work = res.data;
        this.setState({
          work,
          dept: work.dept
        });
      } else {
        toRedirectPage('找不到对应的大项工作记录', '/dept/mine');
      }
    });
  }

  handleSubmit = values => {
    if (values.schedules && values.schedules.length > 0) {
      const error = { schedules: [] };
      values.schedules.forEach(({ from, to }, index) => {
        if (to <= from) {
          error.schedules[index] = { to: '应大于开始' };
        }
      });
      if (error.schedules.length > 0) {
        throw new SubmissionError(error);
      }
    }
    const { dept, work } = this.state;
    return new Promise((resolve, reject) => {
      this.props.dispatch(
        workActions.sagaAddTask(resolve, values, dept.id, work.id)
      );
    });
  };

  render() {
    const { dept, work } = this.state;
    const {
      deptDic,
      deptArray,
      allowExts,
      amFrom,
      amTo,
      pmFrom,
      pmTo,
      classes
    } = this.props;
    if (!dept || !work) return <Loading />;
    return (
      <Grid container justify="center">
        <Grid item container direction="column" wrap="nowrap" spacing={8}>
          <Grid item>
            <Typography variant="h4" align="center">
              添加大项工作的子工作/任务
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
              edit={false}
              enableReinitialize
              onSubmit={this.handleSubmit}
              deptArray={deptArray}
              allowExts={allowExts}
              amFrom={amFrom}
              amTo={amTo}
              pmFrom={pmFrom}
              pmTo={pmTo}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

AddWorkArticle.propTypes = {};

function mapStateToProps(state) {
  return {
    deptDic: state.system.deptDic,
    deptArray: state.system.deptArray,
    allowExts: state.system.allowExts,
    amFrom: state.system.amFrom,
    amTo: state.system.amTo,
    pmFrom: state.system.pmFrom,
    pmTo: state.system.pmTo
  };
}

export default compose(
  withStyles(style),
  connect(mapStateToProps)
)(AddWorkArticle);
