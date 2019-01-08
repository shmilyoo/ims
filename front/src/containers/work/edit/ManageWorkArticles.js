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
  Typography,
  IconButton
} from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import {
  getNumberPerPage,
  setNumberPerPage,
  getArticles,
  getWorkChannels,
  delArticles,
  timeFunctions
} from '../../../services/utility';
import history from '../../../history';
import TableList from '../../../components/common/TableList';

const style = theme => ({
  left: {
    width: '20rem'
  },
  link: theme.sharedClass.link,
  disableLink: theme.sharedClass.disableLink
});

class ManageWorkArticles extends React.PureComponent {
  state = {
    rows: null,
    columns: [
      ['title', '标题', false],
      ['channel', '所属频道', false],
      ['publisher', '发布人', false],
      ['createTime', '创建时间', true],
      ['updateTime', '更新时间', true],
      ['edit', '', false]
    ],
    channels: null,
    selectedChannel: null,
    numberPerPage: getNumberPerPage(),
    currentPage: 1,
    totalNumber: 0,
    selectedIds: [],
    orderBy: 'createTime',
    orderDirection: 'desc'
  };
  componentDidMount() {
    const { id } = this.props;
    const { numberPerPage, currentPage } = this.state;
    Promise.all([
      getWorkChannels(id),
      getArticles({
        from: 'work',
        channelParentId: id,
        channelId: 'all',
        numberPerPage,
        currentPage,
        withPublisher: true,
        withChannel: true,
        order: { updateTime: 'desc' }
      })
    ]).then(([resChannels, resArticles]) => {
      if (resChannels.success && resArticles.success) {
        const { totalNumber, articleList } = resArticles.data;
        this.setState({
          channels: resChannels.data,
          totalNumber,
          rows: this.formatArticles(articleList)
        });
      }
    });
  }
  channelItemClick = channel => {
    if (
      !this.state.selectedChannel ||
      channel.id !== this.state.selectedChannel.id
    ) {
      // 获取对应channel的文章
      this.setState({ selectedChannel: channel }, () => {
        this.showChannelArticles(1);
      });
    } else {
      // 取消选择channel
      this.setState({ selectedChannel: null }, () => {
        this.showChannelArticles(1);
      });
    }
  };
  showChannelArticles = (page = 1) => {
    const { id: workId } = this.props;
    const {
      numberPerPage,
      selectedChannel,
      orderBy,
      orderDirection
    } = this.state;
    getArticles({
      from: 'work',
      channelParentId: workId,
      channelId: selectedChannel ? selectedChannel.id : 'all',
      numberPerPage,
      currentPage: page,
      withPublisher: true,
      withChannel: true,
      order: { [orderBy]: orderDirection }
    }).then(res => {
      if (res.success) {
        const { totalNumber, articleList } = res.data;
        this.setState({
          rows: this.formatArticles(articleList),
          totalNumber,
          currentPage: page
        });
      }
    });
  };

  formatArticles = articleList => {
    return articleList.map(
      ({ id, title, channel, publisher, createTime, updateTime }) => ({
        id,
        title: (
          <Link
            className={this.props.classes.link}
            to={`/work/article?id=${id}`}
          >
            {title}
          </Link>
        ),
        channel: <Typography>{channel.name}</Typography>,
        publisher: (
          <Link
            className={this.props.classes.link}
            to={`/user/info?id=${publisher.id}`}
          >
            {publisher.name}
          </Link>
        ),
        createTime: (
          <Typography>{timeFunctions.formatFromUnix(createTime)}</Typography>
        ),
        updateTime: (
          <Typography>{timeFunctions.formatFromUnix(updateTime)}</Typography>
        ),
        edit: (
          <IconButton
            className={this.props.classes.padding5}
            onClick={() => {
              history.push(`/work/article/edit?id=${id}`);
            }}
          >
            <Edit />
          </IconButton>
        )
      })
    );
  };

  handleSelectedChange = ids => {
    this.setState({ selectedIds: ids });
  };

  handleChangeRowsPerPage = rowsPerPage => {
    this.setState(
      {
        numberPerPage: setNumberPerPage(rowsPerPage),
        articleList: null
      },
      () => {
        this.showChannelArticles(1);
      }
    );
  };
  handlePageChagne = page => {
    this.setState({ rows: null });
    this.showChannelArticles(page);
  };
  handleChangeOrder = (name, direction) => {
    this.setState(
      {
        orderBy: name,
        orderDirection: direction || 'desc'
      },
      () => this.showChannelArticles(1)
    );
  };
  handleMultiDelArticles = () => {
    if (!this.state.selectedIds.length) return;
    delArticles(this.state.selectedIds, 'work').then(res => {
      if (res.success) {
        this.showChannelArticles(1);
        this.setState({ selectedIds: [] });
      }
    });
  };
  render() {
    const { classes, id: workId } = this.props;
    const {
      rows,
      columns,
      channels,
      selectedChannel,
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
                to={`/work/article/add?workId=${workId}&channelId=${
                  selectedChannel ? selectedChannel.id : ''
                }`}
              >
                添加工作文章
              </Link>
            </Grid>
            <Grid item>
              <Typography
                className={
                  selectedIds && selectedIds.length > 0
                    ? classes.link
                    : classes.disableLink
                }
                onClick={
                  selectedIds && selectedIds.length > 0
                    ? this.handleMultiDelArticles
                    : () => {}
                }
              >
                删除
              </Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.disableLink}>移动</Typography>
            </Grid>
          </Grid>
          <Grid item xs>
            <TableList
              rows={rows}
              columns={columns}
              selectedIds={selectedIds}
              totalNumber={totalNumber}
              currentPage={currentPage}
              numberPerPage={numberPerPage}
              orderBy={orderBy}
              orderDirection={orderDirection}
              onPageChange={this.handlePageChagne}
              onSelectedChange={this.handleSelectedChange}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
              onChangeOrder={this.handleChangeOrder}
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
