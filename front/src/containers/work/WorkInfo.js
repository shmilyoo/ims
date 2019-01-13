import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import qs from 'qs';
import { Grid, Divider, Typography, withStyles } from '@material-ui/core';
import Loading from '../../components/common/Loading';
import {
  getWorkInfo,
  getDeptArraySync,
  timeFunctions,
  checkCanManageWork,
  checkCanAddTaskArticle,
  toRedirectPage
} from '../../services/utility';
import compose from 'recompose/compose';
import FileList from '../../components/common/FileList';
import WorkTaskList from './WorkTaskList';
import ChannelsArticles from '../../components/common/ChannelsArticles';

const style = theme => ({
  link: theme.sharedClass.link,
  grayLink: theme.sharedClass.grayLink,
  main: { width: '80%', maxWidth: '100rem' },
  workEdit: {}
});

class WorkInfo extends PureComponent {
  state = {
    id: '',
    work: null
  };
  componentDidMount() {
    const { id } = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    });
    if (!id) {
      toRedirectPage('错误的请求url参数', '/work/mine');
      return;
    }
    getWorkInfo({
      id: id,
      // withChannels: 1,
      // withChannelsArticles: this.state.articleNumber,
      withUsers: 1,
      withPublisher: 1,
      withTag: 1,
      withPhases: 1,
      withAttachments: 1,
      order: { phase: 'asc', user: 'asc', channel: 'asc', article: 'desc' }
    }).then(res => {
      if (res.success) {
        const work = { ...res.data, usersInCharge: [], usersAttend: [] };
        res.data.users.forEach(
          ({ id, name, deptId, userWork: { isInCharge } }) => {
            if (isInCharge) work.usersInCharge.push({ id, name, deptId });
            else work.usersAttend.push({ id, name, deptId });
          }
        );
        this.checkAuthority(work);
        this.setState({
          work,
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
  checkAuthority = work => {
    const { manageDepts, accountId } = this.props;
    // const { work } = this.state;
    let canManage = false; // 是否可以编辑work的主要信息
    let canAddTaskArticle = false; // 是否可以添加文章，任务，除了管理者外，参与者也可以
    canManage = checkCanManageWork(
      manageDepts,
      accountId,
      work.deptId,
      work.usersInCharge
    );
    if (!canManage) {
      // 没有管理work的权限，才有必要验证是否有权限添加task article
      canAddTaskArticle = checkCanAddTaskArticle(accountId, work.usersAttend);
    }
    this.setState({ canManage, canAddTaskArticle });
  };

  render() {
    const { work, canManage, canAddTaskArticle } = this.state;
    const { deptDic, classes, articleNumber } = this.props;
    const now = timeFunctions.getNowUnix();
    if (!work) return <Loading />;
    console.log('render work info');
    return (
      <Grid container direction="column" wrap="nowrap" spacing={8}>
        <Grid item container justify="center">
          <Grid item>
            <Typography variant="h3" align="center" paragraph>
              {work.title}
            </Typography>
          </Grid>
          {canManage && (
            <Grid item>
              {/* // todo 验证下canManage 是否正确 */}
              <Link
                className={classes.grayLink}
                to={`/work/edit?id=${work.id}`}
              >
                编辑
              </Link>
            </Grid>
          )}
        </Grid>
        <Grid item container>
          <Grid item xs={6} lg={3}>
            <Typography variant="h6">
              发布人:{' '}
              {work.publisher && (
                <Link
                  className={classes.link}
                  to={`/user/info?id=${work.publisher.id}`}
                >
                  {work.publisher.name}
                </Link>
              )}
            </Typography>
          </Grid>
          <Grid item xs={6} lg={3}>
            <Typography variant="h6">
              标签:{' '}
              {work.tag && (
                <Link
                  className={classes.link}
                  to={`#`}
                  style={{ color: work.tag.color }}
                >
                  {work.tag.name}
                </Link>
              )}
            </Typography>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Typography variant="h6">
              部门:{' '}
              {work.deptId &&
                getDeptArraySync(work.deptId, deptDic).map(
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
              开始时间: {timeFunctions.formatFromUnix(work.from, 'date')}
            </Typography>
          </Grid>
          <Grid item xs={6} lg={3}>
            <Typography variant="h6">
              结束时间:{' '}
              {work.to
                ? timeFunctions.formatFromUnix(work.to, 'date')
                : '未定/至今'}
            </Typography>
          </Grid>
          <Grid item xs={6} lg={3}>
            <Typography variant="h6">
              添加时间: {timeFunctions.formatFromUnix(work.createTime, 'date')}
            </Typography>
          </Grid>
          <Grid item xs={6} lg={3}>
            <Typography variant="h6">
              修改时间: {timeFunctions.formatFromUnix(work.updateTime, 'date')}
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Typography variant="h6">
            负责人:{' '}
            {work.usersInCharge &&
              work.usersInCharge.map(({ id, name }, index) => (
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
            {work.usersAttend &&
              work.usersAttend.map(({ id, name }, index) => (
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
          <div dangerouslySetInnerHTML={{ __html: work.content }} />
        </Grid>
        {work.phases &&
          work.phases.length > 0 && (
            <Grid item container direction="column" wrap="nowrap">
              <Grid item>
                <Divider />
              </Grid>
              <Grid item>
                <Typography variant="h6">阶段:</Typography>
              </Grid>
              <Grid item container>
                <Grid item xs={2}>
                  <Typography color="textSecondary" variant="body1">
                    开始时间
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography color="textSecondary" variant="body1">
                    结束时间
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography color="textSecondary" variant="body1">
                    名称
                  </Typography>
                </Grid>
              </Grid>
              {work.phases.map(({ id, title, from, to }) => {
                const nowInPhase = now > from && (!to || now < to);
                return (
                  <Grid item container key={id}>
                    <Grid item xs={2}>
                      <Typography
                        variant="body1"
                        style={{ fontWeight: nowInPhase ? 'bold' : 'normal' }}
                      >
                        {timeFunctions.formatFromUnix(from)}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography
                        variant="body1"
                        style={{ fontWeight: nowInPhase ? 'bold' : 'normal' }}
                      >
                        {to ? timeFunctions.formatFromUnix(to) : '未定/至今'}
                      </Typography>
                    </Grid>
                    <Grid item xs>
                      <Typography
                        variant="body1"
                        style={{ fontWeight: nowInPhase ? 'bold' : 'normal' }}
                      >
                        {title}
                      </Typography>
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          )}
        {work.attachments &&
          work.attachments.length > 0 && (
            <Grid item container direction="column" wrap="nowrap">
              <Grid item>
                <Divider />
              </Grid>
              <Grid item>
                <Typography variant="h6">附件:</Typography>
              </Grid>
              <FileList files={work.attachments} />
            </Grid>
          )}

        <Grid item container direction="column" wrap="nowrap">
          <Grid item>
            <Divider />
          </Grid>
          <Grid item container justify="space-between">
            <Grid item>
              <Grid container spacing={16} alignItems="center">
                <Grid item>
                  <Typography variant="h6">子项工作/任务:</Typography>
                </Grid>
                {(canManage || canAddTaskArticle) && (
                  <Grid item>
                    <Link
                      className={classes.grayLink}
                      to={`/work/task/add?workId=${work.id}`}
                    >
                      添加
                    </Link>
                  </Grid>
                )}
                {canManage && (
                  <Grid item>
                    <Link
                      className={classes.grayLink}
                      to={`/work/edit?type=task&id=${work.id}`}
                    >
                      管理
                    </Link>
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="h6">列表/时间线</Typography>
            </Grid>
          </Grid>
          <Grid item>
            <WorkTaskList workId={work.id} />
          </Grid>
        </Grid>

        <Grid item>
          <Divider />
        </Grid>
        <Grid item container direction="column" wrap="nowrap">
          <Grid container spacing={16} alignItems="center">
            <Grid item>
              <Typography variant="h6">频道文章:</Typography>
            </Grid>
            {(canManage || canAddTaskArticle) && (
              <Grid item>
                <Link
                  className={classes.grayLink}
                  to={`/work/article/add?workId=${work.id}`}
                >
                  添加
                </Link>
              </Grid>
            )}
            {canManage && (
              <Grid item>
                <Link
                  className={classes.grayLink}
                  to={`/work/edit?type=article&id=${work.id}`}
                >
                  管理
                </Link>
              </Grid>
            )}
          </Grid>
          <ChannelsArticles
            articleNumber={articleNumber}
            from="work"
            fromId={work.id}
            columns={2}
            channels={work.channels}
          />
        </Grid>
        <Grid item>
          <Divider />
        </Grid>
        <Grid item container direction="column" wrap="nowrap">
          <Grid item>
            <Typography variant="h6">讨论:</Typography>
          </Grid>
          {/* <FileList files={work.attachments} /> */}
        </Grid>
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
)(WorkInfo);
