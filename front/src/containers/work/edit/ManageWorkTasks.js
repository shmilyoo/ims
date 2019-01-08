import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Grid, withStyles, Typography, IconButton } from '@material-ui/core';
import compose from 'recompose/compose';
import {
  getNumberPerPage,
  getWorkChannels,
  setNumberPerPage,
  delArticles,
  getArticles,
  getWorkTasks,
  timeFunctions
} from '../../../services/utility';
import Edit from '@material-ui/icons/Edit';
import TableList from '../../../components/common/TableList';
import history from '../../../history';

const style = theme => ({
  left: {
    width: '20rem'
  },
  link: theme.sharedClass.link,
  disableLink: theme.sharedClass.disableLink,
  grayLink: theme.sharedClass.grayLink,
  padding0: {
    padding: '0'
  },
  padding5: {
    padding: '.5rem'
  }
});

class ManageWorkTasks extends PureComponent {
  state = {
    rows: null,
    columns: [
      ['title', '标题', false],
      ['from', '开始时间', true],
      ['to', '结束时间', true],
      ['createTime', '创建时间', true],
      ['updateTime', '更新时间', true],
      ['publisher', '发布人', false],
      ['edit', '', false]
    ],
    numberPerPage: getNumberPerPage(),
    currentPage: 1,
    totalNumber: 0,
    selectedIds: [],
    orderBy: 'updateTime',
    orderDirection: 'desc'
  };
  componentDidMount() {
    this.showTasks(1);
  }
  showTasks = (page = 1) => {
    const { id: workId } = this.props;
    const { numberPerPage, orderBy, orderDirection } = this.state;
    getWorkTasks({
      workId,
      numberPerPage,
      currentPage: page,
      withPublisher: true,
      order: { [orderBy]: orderDirection }
    }).then(res => {
      if (res.success) {
        const { totalNumber, taskList } = res.data;
        this.setState({
          rows: this.formatTasks(taskList),
          totalNumber,
          currentPage: page
        });
      }
    });
  };

  formatTasks = taskList => {
    return taskList.map(
      ({ id, title, from, to, createTime, updateTime, publisher }) => ({
        id,
        title: (
          <Link
            className={this.props.classes.link}
            to={`/work/task/info?id=${id}`}
          >
            {title}
          </Link>
        ),
        from: <Typography>{timeFunctions.formatFromUnix(from)}</Typography>,
        to: <Typography>{timeFunctions.formatFromUnix(to)}</Typography>,
        createTime: (
          <Typography>{timeFunctions.formatFromUnix(createTime)}</Typography>
        ),
        updateTime: (
          <Typography>{timeFunctions.formatFromUnix(updateTime)}</Typography>
        ),
        publisher: (
          <Link
            className={this.props.classes.link}
            to={`/user/info?id=${publisher.id}`}
          >
            {publisher.name}
          </Link>
        ),
        edit: (
          <IconButton
            className={this.props.classes.padding5}
            onClick={() => {
              history.push(`/work/task/edit?id=${id}`);
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
        this.showTasks(1);
      }
    );
  };
  handlePageChagne = page => {
    this.setState({ rows: null });
    this.showTasks(page);
  };
  handleChangeOrder = (name, direction) => {
    console.log('on change order', name, direction);
    this.setState(
      {
        orderBy: name,
        orderDirection: direction || 'desc'
      },
      () => this.showTasks(1)
    );
  };
  // todo
  handleMultiDelTasks = () => {
    if (!this.state.selectedIds.length) return;
    delArticles(this.state.selectedIds, 'work').then(res => {
      if (res.success) {
        this.showTasks(1);
        this.setState({ selectedIds: [] });
      }
    });
  };
  render() {
    const { id: workId, classes } = this.props;
    const {
      numberPerPage,
      currentPage,
      totalNumber,
      selectedIds,
      orderBy,
      orderDirection,
      rows,
      columns
    } = this.state;
    return (
      <Grid container spacing={16} direction="column" wrap="nowrap">
        <Grid item container spacing={8} justify="flex-start">
          <Grid item>
            <Link
              className={classes.link}
              to={`/work/task/add?workId=${workId}`}
            >
              添加工作任务
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
                  ? this.handleMultiDelTasks
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
    );
  }
}

ManageWorkTasks.propTypes = {
  id: PropTypes.string.isRequired // workId
};

export default compose(withStyles(style))(ManageWorkTasks);
