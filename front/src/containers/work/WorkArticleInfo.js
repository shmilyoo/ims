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
  getWorkArticle,
  checkCanManageArticle,
  delArticles
  // getArticleInfo
  // checkCanManageArticle
} from '../../services/utility';
import compose from 'recompose/compose';
import FileList from '../../components/common/FileList';
import SimpleAlertDialog from '../../components/common/SimpleAlertDialog';
import history from '../../history';

const style = theme => ({
  link: theme.sharedClass.link,
  main: { width: '80%', maxWidth: '100rem' },
  adminContainer: {
    position: 'absolute',
    top: '7rem',
    left: '4rem'
  },
  adminItem: {
    ...theme.sharedClass.grayLink,
    marginLeft: '1rem',
    display: 'inline'
  }
});

class WorkArticleInfo extends PureComponent {
  state = {
    id: '',
    article: null,
    canManage: false,
    alertOpen: false
  };
  componentDidMount() {
    const { id } = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    });
    if (!id) {
      toRedirectPage('错误的请求url参数', '/');
      return;
    }
    getWorkArticle({
      id,
      withPublisher: true,
      withChannel: true,
      withWork: true,
      withAttachments: true
    }).then(res => {
      if (res.success) {
        const article = res.data;
        this.setState({ article, id });
        this.checkAuthority(article);
      }
    });
  }

  /**
   * 获取用户是否可以编辑article的权限
   */
  checkAuthority = article => {
    const { manageDepts, accountId } = this.props;
    checkCanManageArticle(
      accountId,
      manageDepts,
      article.publisher.id,
      article.channel.work.id,
      article.channel.work.deptId
    ).then(canManage => {
      this.setState({ canManage });
    });
  };

  handleDeleteConfirm = () => {
    delArticles([this.state.id], 'work').then(res => {
      if (res.success) {
        if (res.data === 1) {
          history.push(`/work/info?id=${this.state.article.channel.work.id}`);
        }
      }
    });
    this.handleAlertCancel();
  };

  handleAlertOpen = () => {
    this.setState({ alertOpen: true });
  };

  handleAlertCancel = () => {
    this.setState({ alertOpen: false });
  };

  render() {
    const { article, canManage, alertOpen } = this.state;
    const { deptDic, classes } = this.props;
    if (!article) return <Loading />;
    console.log('render work info');
    return (
      <Grid container direction="column" wrap="nowrap" spacing={8}>
        {canManage && (
          <div className={classes.adminContainer}>
            <Link
              className={classes.adminItem}
              to={`/work/article/edit?articleId=${article.id}&&workId=${
                article.channel.work.id
              }`}
            >
              添加
            </Link>
            <Link
              className={classes.adminItem}
              to={`/work/article/edit?articleId=${article.id}&&workId=${
                article.channel.work.id
              }`}
            >
              编辑
            </Link>
            <Typography
              component="span"
              className={classes.adminItem}
              onClick={this.handleAlertOpen}
            >
              删除
            </Typography>
            <SimpleAlertDialog
              title="确认操作"
              content="是否确认删除文章，操作将同时删除文章包含的所有附件、评论和讨论"
              open={alertOpen}
              onConfirm={this.handleDeleteConfirm}
              onCancel={this.handleAlertCancel}
            />
          </div>
        )}
        <Grid item container justify="center">
          <Grid item>
            <Typography variant="h3" align="center" paragraph>
              {article.title}
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Typography variant="h6">
            所属部门:{' '}
            {getDeptArraySync(article.channel.work.deptId, deptDic).map(
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
            所属工作:{' '}
            <Link
              className={classes.link}
              to={`/work/info?id=${article.channel.work.id}`}
            >
              {article.channel.work.title}
            </Link>
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6">
            所属频道:{' '}
            <Link
              className={classes.link}
              to={`/work/channel?id=${article.channel.id}`}
            >
              {article.channel.name}
            </Link>
          </Typography>
        </Grid>
        <Grid item container>
          <Grid item xs={4}>
            <Typography variant="h6">
              发布人:{' '}
              <Link
                className={classes.link}
                to={`/user/info?id=${article.publisher.id}`}
              >
                {article.publisher.name}
              </Link>
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">
              发布时间:{' '}
              {timeFunctions.formatFromUnix(article.createTime, 'datetime')}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">
              修改时间:{' '}
              {timeFunctions.formatFromUnix(article.updateTime, 'datetime')}
            </Typography>
          </Grid>
        </Grid>
        <Grid item container justify="space-between">
          <Grid item>
            <Typography variant="h6">文章内容:</Typography>
          </Grid>
          {article.lastEdit && (
            <Grid item>
              <Typography
                color="textSecondary"
                dangerouslySetInnerHTML={{ __html: article.lastEdit }}
              />
            </Grid>
          )}
        </Grid>
        <Grid item>
          <div
            className={classes.content}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </Grid>

        {article.attachments &&
          article.attachments.length > 0 && (
            <Grid item container direction="column" wrap="nowrap">
              <Grid item>
                <Divider />
              </Grid>
              <Grid item>
                <Typography variant="h6">附件:</Typography>
              </Grid>
              <FileList files={article.attachments} />
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
)(WorkArticleInfo);
