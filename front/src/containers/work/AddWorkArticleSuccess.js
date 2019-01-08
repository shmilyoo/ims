import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import qs from 'qs';
import { toRedirectPage } from '../../services/utility';
import { Grid } from '@material-ui/core';

class AddWorkArticleSuccess extends PureComponent {
  constructor(props) {
    super(props);
    const { articleId, channelId, workId } = qs.parse(
      this.props.location.search,
      {
        ignoreQueryPrefix: true
      }
    );
    if (!(articleId && channelId && workId)) toRedirectPage('错误的url参数');
    this.state = { articleId, channelId, workId };
  }

  render() {
    const { articleId, channelId, workId } = this.state;
    return (
      <Grid
        style={{ height: '80%' }}
        container
        justify="center"
        alignItems="center"
        direction="column"
      >
        <Grid item>新增工作文章成功，请选择下一步操作：</Grid>
        <Grid item container spacing={16} justify="center">
          <Grid item>
            <Link
              to={`/work/article/add?workId=${workId}&&channelId=${channelId}`}
            >
              继续添加文章
            </Link>
          </Grid>
          <Grid item>
            <Link to={`/work/article?id=${articleId}`}>查看此文章</Link>
          </Grid>
          <Grid item>
            <Link
              to={`/work/article/edit?articleId=${articleId}&&workId=${workId}`}
            >
              编辑此文章
            </Link>
          </Grid>
          <Grid item>
            <Link to={`/work/info?id=${workId}`}>查看所属工作</Link>
          </Grid>
          <Grid item>
            <Link to={`/work/channel?id=${channelId}`}>查看所属频道</Link>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default AddWorkArticleSuccess;
