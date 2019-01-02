import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import TaskList from '../../components/work/TaskList';
import {
  getNumberPerPage,
  setNumberPerPage,
  getWorkTasks
} from '../../services/utility';
import { Grid, Typography, withStyles } from '@material-ui/core';
import compose from 'recompose/compose';

const style = theme => ({
  link: theme.sharedClass.link,
  delLink: theme.sharedClass.grayLink
});

class TaskListWrapper extends PureComponent {
  state = {
    taskList: null,
    numberPerPage: getNumberPerPage(),
    currentPage: 1,
    totalNumber: 0,
    selectedIds: []
  };
  componentDidMount() {
    this.getTaskList(1);
  }
  getTaskList = getPage => {
    const { workId } = this.props;
    const { numberPerPage, currentPage, orderBy, orderDirection } = this.state;
    getWorkTasks({
      workId,
      numberPerPage,
      currentPage,
      orderBy,
      orderDirection
    }).then(res => {
      if (res.success) {
        const { totalNumber, taskList } = res.data;
        this.setState({
          taskList,
          totalNumber,
          currentPage: getPage
        });
      }
    });
  };
  handlePageChange = page => {
    this.setState({ taskList: null });
    this.getTaskList(page);
  };
  handleChangeRowsPerPage = rowsPerPage => {
    this.setState(
      { numberPerPage: setNumberPerPage(rowsPerPage), taskList: null },
      () => {
        this.getTaskList(1);
      }
    );
  };
  handleMultiDelTasks = () => {
    //
  };
  render() {
    const { canChangeOrder, admin, hideColumns, workId, classes } = this.props;
    const {
      taskList,
      numberPerPage,
      currentPage,
      totalNumber,
      selectedIds
    } = this.state;
    return (
      <Grid container direction="column" wrap="nowrap">
        {admin && (
          <Grid item container spacing={16}>
            <Grid item>
              <Link
                className={classes.link}
                to={`/work/task/add?workId=${workId}`}
              >
                添加
              </Link>
            </Grid>
            <Grid item>
              <Typography
                disabled={!(selectedIds && selectedIds.length > 0)}
                className={classes.delLink}
                onClick={() => {
                  this.handleMultiDelTasks();
                }}
              >
                删除
              </Typography>
            </Grid>
          </Grid>
        )}
        <Grid item>
          <TaskList
            hideColumns={hideColumns}
            taskList={taskList}
            canChangeOrder={canChangeOrder}
            admin={admin}
            numberPerPage={numberPerPage}
            currentPage={currentPage}
            totalNumber={totalNumber}
            onPageChange={this.handlePageChange}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Grid>
      </Grid>
    );
  }
}

TaskListWrapper.propTypes = {
  workId: PropTypes.string.isRequired,
  canChangeOrder: PropTypes.bool,
  admin: PropTypes.bool,
  hideColumns: PropTypes.array
};

TaskListWrapper.defaultProps = {
  canChangeOrder: false,
  admin: false,
  hideColumns: []
};

export default compose(withStyles(style))(TaskListWrapper);
