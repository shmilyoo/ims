import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import qs from 'qs';
import { Grid, Divider, Typography, withStyles } from '@material-ui/core';
import history from '../../history';
import Loading from '../../components/common/Loading';
import {
  getWorkInfo,
  getDeptArraySync,
  timeFunctions
} from '../../services/utility';
import compose from 'recompose/compose';
const style = theme => ({
  link: theme.sharedClass.link,
  main: { width: '80%', maxWidth: '100rem' },
  icon: {
    content: '\\e90d'
  }
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
      history.push('/work/mine');
      return;
    }
    getWorkInfo({
      id: id,
      withDept: 1,
      withChannels: 1,
      withUsersAttend: 1,
      withUsersInCharge: 1,
      withPublisher: 1,
      withTag: 1,
      withPhases: 1
    }).then(res => {
      if (res.success) {
        this.setState({
          work: res.data,
          id
        });
      }
    });
  }

  render() {
    const { work } = this.state;
    const { deptDic, classes } = this.props;
    if (!work) return <Loading />;
    return (
      <Grid container direction="column" wrap="nowrap" spacing={8}>
        <Grid item>
          <Typography variant="h3" align="center" paragraph>
            {work.title}
          </Typography>
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
              {work.dept &&
                getDeptArraySync(work.dept.id, deptDic).map(
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
          <Divider />
        </Grid>
        {work.phases &&
          work.phases.length > 0 && (
            <Grid item container direction="column" wrap="nowrap">
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
              {work.phases.map(({ id, title, from, to }) => (
                <Grid item container key={id}>
                  <Grid item xs={2}>
                    <Typography variant="body1">
                      {timeFunctions.formatFromUnix(from)}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="body1">
                      {to ? timeFunctions.formatFromUnix(to) : '未定/至今'}
                    </Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="body1">{title}</Typography>
                  </Grid>
                </Grid>
              ))}
              <Grid item>
                <Divider />
              </Grid>
            </Grid>
          )}
        <Grid item container direction="column" wrap="nowrap">
          <Grid item container justify="space-between">
            <Grid item>
              <Typography variant="h6">子项工作/任务:</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6">列表/时间线</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

WorkInfo.propTypes = {};
function mapStateToProps(state) {
  return {
    deptDic: state.system.deptDic
  };
}

export default compose(
  withStyles(style),
  connect(mapStateToProps)
)(WorkInfo);
