import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import {
  Grid,
  Typography,
  withStyles,
  Paper,
  Divider
} from '@material-ui/core';
import Loading from './Loading';
import { timeFunctions, getArticlesChannels } from '../../services/utility';

const style = theme => ({
  link: theme.sharedClass.link,
  grayLink: theme.sharedClass.grayLink,
  channelContainer: { padding: '1rem' },
  articleDivider: { borderTop: '1px rgba(0,0,0,0.12) dashed' },
  articleLine: { paddingTop: '0.5rem', paddingBottom: '0.5rem' },
  articleTitle: { ...theme.sharedClass.lineCut, marginRight: '2rem' }
});

class ChannelsArticles extends PureComponent {
  state = {
    channels: null
  };
  componentDidMount() {
    const { articleNumber, from, fromId } = this.props;
    getArticlesChannels(fromId, from, articleNumber).then(res => {
      if (res.success) {
        this.setState({ channels: res.data });
      }
    });
  }
  render() {
    const { articleNumber, columns, from, classes } = this.props;
    const { channels } = this.state;
    if (!channels) return <Loading />;
    if (channels.length === 0)
      return <Typography>没有可以显示的频道</Typography>;
    const colSpan = 12 / columns;
    const _fakeNumberList = new Array(articleNumber).fill(0);
    const nowUnix = timeFunctions.getNowUnix();
    return (
      <Grid container spacing={16}>
        {channels.map(({ id, name, articles }) => (
          <Grid key={id} item xs={12} lg={colSpan}>
            <Paper className={classes.channelContainer}>
              <Grid container direction="column" wrap="nowrap">
                <Grid item container justify="space-between">
                  <Grid>
                    <Typography>{name}</Typography>
                  </Grid>
                  <Grid>
                    <Link
                      className={classes.grayLink}
                      to={`/${from}/channel?id=${id}`}
                    >
                      更多...
                    </Link>
                  </Grid>
                </Grid>
                <Grid item>
                  <Divider />
                </Grid>
                {_fakeNumberList.map(
                  (_, i) =>
                    articles[i] ? (
                      <Grid
                        key={articles[i].id}
                        item
                        container
                        justify="space-between"
                        alignItems="center"
                        wrap="nowrap"
                        className={classnames(classes.articleLine, {
                          [classes.articleDivider]: i > 0
                        })}
                      >
                        <Grid className={classes.articleTitle}>
                          <Link
                            className={classes.link}
                            to={`/${from}/article?id=${articles[i].id}`}
                          >
                            {articles[i].title}
                          </Link>
                        </Grid>
                        <Grid>
                          <Typography noWrap>
                            {timeFunctions.formatRelative(
                              articles[i].createTime,
                              nowUnix,
                              'date'
                            )}
                          </Typography>
                        </Grid>
                      </Grid>
                    ) : (
                      <Grid
                        item
                        key={i}
                        className={classnames(classes.articleLine, {
                          [classes.articleDivider]: i > 0
                        })}
                      >
                        {i === 0 ? (
                          <Typography>结果为空</Typography>
                        ) : (
                          <Typography>&nbsp;</Typography>
                        )}
                      </Grid>
                    )
                )}
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  }
}

ChannelsArticles.propTypes = {
  columns: PropTypes.oneOf([1, 2, 3]), // 分几列显示
  channels: PropTypes.array, // 要显示的频道列表
  articleNumber: PropTypes.number, // 每个频道下显示几个文章
  from: PropTypes.oneOf(['work', 'dept'])
};

ChannelsArticles.defaultProps = {
  columns: 2,
  articleNumber: 5
};

export default withStyles(style)(ChannelsArticles);
