import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid, Typography, withStyles, Divider } from '@material-ui/core';
import qs from 'qs';
import {
  toRedirectPage,
  getWorkInfo,
  getDeptNamesArraySync,
  getDeptArraySync
} from '../../services/utility';
import history from '../../history';
import Axios from 'axios';
import compose from 'recompose/compose';
import ArticleForm from '../../forms/work/ArticleForm';
import FileUpload from '../../components/common/FileUpload';

const style = theme => ({
  link: theme.sharedClass.link,
  main: { width: '80%', maxWidth: '100rem' },
  icon: {
    content: '\\e90d'
  }
});

class AddWorkArticle extends PureComponent {
  constructor(props) {
    super(props);
    const { workId, channelId } = qs.parse(props.location.search, {
      ignoreQueryPrefix: true
    });
    if (!workId) toRedirectPage('错误的请求url参数', document.referrer || '/');
    this.state = { workId, channelId, channels: null, dept: null, work: null };
  }

  componentDidMount() {
    getWorkInfo({ id: this.state.workId, withDept: 1, withChannels: 1 }).then(
      res => {
        if (res.success) {
          const work = res.data;
          this.setState({
            channels: work.channels.map(channel => ({
              label: channel.name,
              value: channel.id
            })),
            work,
            dept: work.dept
          });
        }
      }
    );
  }

  render() {
    const { dept, work, channelId, channels } = this.state;
    const { deptDic, classes } = this.props;
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
          <Grid item>//</Grid>
          <Grid item>
            <Typography variant="h4" align="center">
              添加大项工作的文章
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6">
              部门：
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
            <ArticleForm
              edit={false}
              enableReinitialize
              onSubmit={this.handleSubmit}
              channels={channels}
              initialValues={{ channelId }}
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
    deptDic: state.system.deptDic
  };
}

export default compose(
  withStyles(style),
  connect(mapStateToProps)
)(AddWorkArticle);
