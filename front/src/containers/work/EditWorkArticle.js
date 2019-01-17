import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid, Typography, withStyles, Divider } from '@material-ui/core';
import qs from 'qs';
import { SubmissionError } from 'redux-form';
import {
  toRedirectPage,
  getDeptArraySync,
  getWorkArticle,
  getWorkChannels
} from '../../services/utility';
import compose from 'recompose/compose';
import ArticleForm from '../../forms/work/ArticleForm';
import Loading from '../../components/common/Loading';
import Axios from 'axios';
import history from '../../history';

const style = theme => ({
  link: theme.sharedClass.link
});

class EditWorkArticle extends PureComponent {
  constructor(props) {
    super(props);
    const { articleId, workId } = qs.parse(props.location.search, {
      ignoreQueryPrefix: true
    });
    if (!articleId || !workId)
      toRedirectPage('错误的请求url参数', document.referrer || '/');
    this.state = { articleId, workId, channels: null };
  }

  componentDidMount() {
    const { articleId, workId } = this.state;
    Promise.all([
      getWorkChannels(workId),
      getWorkArticle({
        id: articleId,
        withChannel: true,
        withAttachments: true,
        withWork: true,
        withDept: true
      })
    ]).then(([resChannels, resArticle]) => {
      if (resChannels.success && resArticle.success) {
        const article = resArticle.data;
        const channels = resChannels.data.map(channel => ({
          label: channel.name,
          value: channel.id
        }));
        this.setState({ channels, article });
      }
    });
  }

  handleSubmit = values => {
    return new Promise((resolve, reject) => {
      Axios.post('/work/article/update', values).then(res => {
        if (res.success) {
          resolve();
          history.push(`/work/article/info?id=${values.id}`);
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
    const { channels, article } = this.state;
    const { deptDic, classes } = this.props;
    if (!article) return <Loading />;
    const {
      channel: { work },
      ...values
    } = article;
    const dept = work.dept;
    return (
      <Grid container justify="center">
        <Grid
          item
          className={classes.main}
          container
          direction="column"
          wrap="nowrap"
          spacing={16}
        >
          <Grid item>
            <Typography variant="h4" align="center">
              编辑大项工作的文章
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6">
              部门：
              {getDeptArraySync(dept.id, deptDic).map(({ id, name }, index) => (
                <span key={id}>
                  {index > 0 && ' - '}
                  <Link className={classes.link} to={`/dept?id=${id}`}>
                    {name}
                  </Link>
                </span>
              ))}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6">
              <span className={classes.icon} />
              所属大项工作：
              <Link className={classes.link} to={`/work/info?id=${work.id}`}>
                {work.title}
              </Link>
            </Typography>
          </Grid>
          <Grid item>
            <Divider />
          </Grid>
          <Grid item>
            <ArticleForm
              edit={true}
              enableReinitialize
              onSubmit={this.handleSubmit}
              channels={channels}
              initialValues={values}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    deptDic: state.system.deptDic
  };
}

export default compose(
  withStyles(style),
  connect(mapStateToProps)
)(EditWorkArticle);
