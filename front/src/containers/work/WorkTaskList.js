import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import TableList from '../../components/common/TableList';
import {
  getWorkTasks,
  getNumberPerPage,
  setNumberPerPage,
  timeFunctions
} from '../../services/utility';
import { Typography, IconButton, withStyles } from '@material-ui/core';
import createTypography from '@material-ui/core/styles/createTypography';
import history from '../../history';

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

class WorkTaskList extends PureComponent {
  state = {
    rows: null,
    columns: [
      ['title', '标题', false],
      ['from', '开始时间', true],
      ['to', '结束时间', true],
      ['createTime', '创建时间', true],
      ['updateTime', '更新时间', true],
      ['publisher', '发布人', false]
    ],
    numberPerPage: getNumberPerPage(),
    currentPage: 1,
    totalNumber: 0,
    selectedIds: [],
    orderBy: 'updateTime',
    orderDirection: 'desc'
  };
  componentDidMount() {
    const { workId } = this.props;
    const { numberPerPage, currentPage } = this.state;
    getWorkTasks({
      workId,
      numberPerPage,
      currentPage,
      withPublisher: true,
      order: { updateTime: 'desc' }
    }).then(res => {
      const { totalNumber, taskList } = res.data;
      if (res.success) {
        this.setState({
          rows: this.formatTasks(taskList),
          totalNumber
        });
      }
    });
  }
  showTasks = (page = 1) => {
    const { workId } = this.props;
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
          <Typography
            onClick={() => {
              history.push(`/user/info?id=${publisher.id}`);
            }}
          >
            {publisher.name}
          </Typography>
        )
      })
    );
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
    this.setState(
      {
        orderBy: name,
        orderDirection: direction || 'desc'
      },
      () => this.showTasks(1)
    );
  };
  render() {
    const { workId, classes } = this.props;
    const {
      numberPerPage,
      currentPage,
      totalNumber,
      orderBy,
      orderDirection,
      rows,
      columns
    } = this.state;
    return (
      <TableList
        rows={rows}
        columns={columns}
        showCheckbox={false}
        totalNumber={totalNumber}
        currentPage={currentPage}
        numberPerPage={numberPerPage}
        orderBy={orderBy}
        orderDirection={orderDirection}
        onPageChange={this.handlePageChagne}
        onChangeRowsPerPage={this.handleChangeRowsPerPage}
        onChangeOrder={this.handleChangeOrder}
      />
    );
  }
}

WorkTaskList.propTypes = {
  workId: PropTypes.string.isRequired
};

export default withStyles(style)(WorkTaskList);
