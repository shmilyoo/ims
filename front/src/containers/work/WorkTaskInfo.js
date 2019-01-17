import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import qs from 'qs';
import { Grid, Divider, Typography, withStyles } from '@material-ui/core';
import Loading from '../../components/common/Loading';
import {
  getDeptArraySync,
  timeFunctions,
  toRedirectPage,
  getTaskInfo,
  checkCanManageTask
} from '../../services/utility';
import compose from 'recompose/compose';
import FileList from '../../components/common/FileList';

const style = theme => ({
  link: theme.sharedClass.link,
  grayLink: theme.sharedClass.grayLink,
  main: { width: '80%', maxWidth: '100rem' }
});

class WorkTaskInfo extends PureComponent {
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
        this.checkAuthority(task);
        this.setState({
          task,
          id
        });
      }
    });
  }

  /**
   * 获取用户是否有编辑work的权限，以及添加task article的权限
   * work所属部门管理员和work的负责人可以编辑work
   * 另外work的参加者可以发article和task
   * 所有注册用户均可以发讨论
   */
  checkAuthority = task => {
    const { manageDepts, accountId } = this.props;
    // const { work } = this.state;
    let canManage = false; // 是否可以编辑work的主要信息
    canManage = checkCanManageTask(
      manageDepts,
      accountId,
      task.work.deptId,
      task.usersInCharge,
      task.publisher.id
    );
    this.setState({ canManage });
  };

  render() {
    const { task, canManage } = this.state;
    const { deptDic, classes } = this.props;
    if (!task) return <Loading />;
    console.log('render work info');
    return (
      <Grid container direction="column" wrap="nowrap" spacing={8}>
        <Grid item container justify="center">
          <Grid item>
            <Typography variant="h3" align="center" paragraph>
              {task.title}
            </Typography>
          </Grid>
          {canManage && (
            <Grid item>
              <Link
                className={classes.grayLink}
                to={`/work/task/edit?id=${task.id}`}
              >
                编辑
              </Link>
            </Grid>
          )}
        </Grid>
        <Grid item>
          <Typography variant="h6">
            所属工作:{' '}
            {task.work && (
              <Link
                className={classes.link}
                to={`/work/info?id=${task.work.id}`}
              >
                {task.work.title}
              </Link>
            )}
          </Typography>
        </Grid>
        <Grid item container>
          <Grid item xs={6} lg={3}>
            <Typography variant="h6">
              发布人:{' '}
              {task.publisher && (
                <Link
                  className={classes.link}
                  to={`/user/info?id=${task.publisher.id}`}
                >
                  {task.publisher.name}
                </Link>
              )}
            </Typography>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Typography variant="h6">
              部门:{' '}
              {task.work.deptId &&
                getDeptArraySync(task.work.deptId, deptDic).map(
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
        </Grid>
        <Grid item container>
          <Grid item xs={6} lg={3}>
            <Typography variant="h6">
              开始时间: {timeFunctions.formatFromUnix(task.from, 'date')}
            </Typography>
          </Grid>
          <Grid item xs={6} lg={3}>
            <Typography variant="h6">
              结束时间: {timeFunctions.formatFromUnix(task.to, 'date')}
            </Typography>
          </Grid>
          <Grid item xs={6} lg={3}>
            <Typography variant="h6">
              添加时间: {timeFunctions.formatFromUnix(task.createTime, 'date')}
            </Typography>
          </Grid>
          <Grid item xs={6} lg={3}>
            <Typography variant="h6">
              修改时间: {timeFunctions.formatFromUnix(task.updateTime, 'date')}
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Typography variant="h6">
            负责人:{' '}
            {task.usersInCharge &&
              task.usersInCharge.map(({ id, name }, index) => (
                <span key={id}>
                  {index > 0 && ' , '}
                  <Link className={classes.link} to={`/user/info?id=${id}`}>
                    {name}
                  </Link>
                </span>
              ))}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6">
            参加人:{' '}
            {task.usersAttend &&
              task.usersAttend.map(({ id, name }, index) => (
                <span key={id}>
                  {index > 0 && ' , '}
                  <Link className={classes.link} to={`/user/info?id=${id}`}>
                    {name}
                  </Link>
                </span>
              ))}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6">工作介绍:</Typography>
        </Grid>
        <Grid item>
          <div dangerouslySetInnerHTML={{ __html: task.content }} />
        </Grid>

        {task.attachments &&
          task.attachments.length > 0 && (
            <Grid item container direction="column" wrap="nowrap">
              <Grid item>
                <Divider />
              </Grid>
              <Grid item>
                <Typography variant="h6">附件:</Typography>
              </Grid>
              <FileList files={task.attachments} />
            </Grid>
          )}
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    deptDic: state.system.deptDic,
    manageDepts: state.account.manageDepts,
    accountId: state.account.id,
    articleNumber: state.system.articleNumber
  };
}

export default compose(
  withStyles(style),
  connect(mapStateToProps)
)(WorkTaskInfo);
