import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import compose from 'recompose/compose';
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  withStyles,
  Paper,
  Typography
} from '@material-ui/core';
import Axios from 'axios';
import ArticleList from '../../../components/common/ArticleList';
import {
  getNumberPerPage,
  setNumberPerPage,
  getArticles
} from '../../../services/utility';

const style = theme => ({
  listItem: {},
  left: {
    width: '20rem'
  },
  link: theme.sharedClass.link,
  disableLink: theme.sharedClass.disableLink
});

class ManageWorkArticles extends React.PureComponent {
  state = {
    channels: null,
    selectedChannel: {},
    articleList: null,
    numberPerPage: getNumberPerPage(),
    currentPage: 1,
    totalNumber: 0,
    selectedIds: [],
    orderBy: 'createTime',
    orderDirection: 'desc'
  };
  componentDidMount() {
    this.getWorkChannels();
  }
  channelItemClick = channel => {
    if (channel.id === this.state.selectedChannel.id) {
      // 取消选择channel
      this.setState({ selectedChannel: {}, currentPage: 1 }, () => {
        this.showChannelArticles();
      });
    } else {
      // 获取对应channel的文章
      this.setState({ selectedChannel: channel, currentPage: 1 }, () => {
        this.showChannelArticles();
      });
    }
  };
  showChannelArticles = () => {
    const { id: workId } = this.props;
    const {
      numberPerPage,
      currentPage,
      orderBy,
      orderDirection,
      selectedChannel
    } = this.state;
    getArticles({
      from: 'work',
      relativeId: workId,
      channelId: selectedChannel.id,
      numberPerPage,
      currentPage,
      orderBy,
      orderDirection,
      withChannel: true,
      withPublisher: true,
      withRelative: false
    }).then(res => {
      if (res.success) {
        const { totalNumber, articleList } = res.data;
        this.setState({ articleList, totalNumber });
      }
    });
  };
  getWorkChannels = () => {
    // 获取work基本信息和phase信息
    Axios.get(`/work/channels?workId=${this.props.id}`).then(res => {
      if (res.success) {
        this.setState({ channels: res.data });
      }
    });
  };
  handleSelectedChange = ids => {
    this.setState({ selectedIds: ids });
  };
  handleChangeRowsPerPage = rowsPerPage => {
    this.setState(
      {
        numberPerPage: setNumberPerPage(rowsPerPage),
        articleList: null,
        currentPage: 1
      },
      () => {
        this.showChannelArticles();
      }
    );
  };
  handlePageChagne = page => {
    this.setState({ workList: null });
    this.getWorkList(page);
  };
  handleChangeOrder = (name, direction) => {
    this.setState(
      {
        orderBy: name,
        orderDirection: direction || 'asc'
      },
      () => this.getWorkList(1)
    );
  };
  handleMultiDelWorks = () => {
    if (!this.state.selectedIds.length) return;
    this.setState({ alertOpen: true });
  };
  render() {
    const { classes, id: workId } = this.props;
    const {
      channels,
      selectedChannel,
      articleList,
      numberPerPage,
      currentPage,
      totalNumber,
      selectedIds,
      orderBy,
      orderDirection
    } = this.state;
    return (
      <Grid container spacing={16} wrap="nowrap" style={{ height: '100%' }}>
        <Grid item className={classes.left}>
          <Paper style={{ height: '100%' }}>
            <List>
              {channels && channels.length > 0 ? (
                channels.map(channel => (
                  <ListItem
                    className={classes.listItem}
                    button
                    divider
                    key={channel.id}
                    selected={
                      selectedChannel && selectedChannel.id === channel.id
                    }
                    onClick={() => {
                      this.channelItemClick(channel);
                    }}
                  >
                    <ListItemText primary={`${channel.name}`} />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="分类为空" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
        <Grid item xs container spacing={16} direction="column" wrap="nowrap">
          <Grid item container spacing={8} justify="flex-start">
            <Grid item>
              <Link
                className={classes.link}
                to={`/work/article/add?workId=${workId}&channelId=${selectedChannel.id ||
                  ''}`}
              >
                添加工作文章
              </Link>
            </Grid>
            <Grid item>
              <Typography className={classes.link}>删除</Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.disableLink}>移动</Typography>
            </Grid>
          </Grid>
          <Grid item>
            <ArticleList
              admin={true}
              selectedIds={selectedIds}
              totalNumber={totalNumber}
              currentPage={currentPage}
              numberPerPage={numberPerPage}
              articleList={articleList}
              // hideColumns={['dept']}
              canChangeOrder={true}
              orderBy={orderBy}
              orderDirection={orderDirection}
              onPageChange={this.handlePageChagne}
              onSelectedChange={this.handleSelectedChange}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
              onChangeOrder={this.handleChangeOrder}
              onDelRows={this.handleMultiDelWorks}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

ManageWorkArticles.propTypes = {
  id: PropTypes.string.isRequired // 需要编辑的work 的id
};

export default compose(withStyles(style))(ManageWorkArticles);
