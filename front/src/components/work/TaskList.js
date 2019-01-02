import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  Checkbox,
  Typography,
  withStyles,
  TableFooter
} from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import compose from 'recompose/compose';
import classnames from 'classnames';
import history from '../../history';
import { timeFunctions } from '../../services/utility';
import CustomTablePaginationActions from '../CustomTablePaginationActions';
import Loading from '../common/Loading';

const style = theme => ({
  onlyLink: { ...theme.sharedClass.onlyLink },
  orderHead: {
    cursor: 'pointer'
  },
  alterRow: {
    backgroundColor: theme.palette.text.third
  }
});

const Order = ({ orderBy, orderDirection, name }) => {
  return orderBy === name && (orderDirection === 'desc' ? ' ⬇' : ' ⬆');
};

class TaskList extends React.PureComponent {
  state = {
    selectedIds: []
  };
  handleRowClick = (e, id) => {
    e.stopPropagation();
    const { onSelectedChange, selectedIds } = this.props;
    onSelectedChange(
      selectedIds.includes(id)
        ? selectedIds.filter(_id => _id !== id)
        : [...selectedIds, id]
    );
  };

  handleAllCheck = () => {
    const { onSelectedChange, selectedIds, workList } = this.props;
    onSelectedChange(
      selectedIds.length === workList.length
        ? []
        : workList.map(work => work.id)
    );
  };
  handleChangePage = (e, page) => {
    this.props.onPageChange && this.props.onPageChange(page);
  };

  handleChangeRowsPerPage = e => {
    this.props.onChangeRowsPerPage &&
      this.props.onChangeRowsPerPage(e.target.value);
  };

  handleChangeOrder = name => {
    const { orderDirection, orderBy } = this.props;
    this.props.onChangeOrder &&
      this.props.onChangeOrder(
        name,
        orderBy !== name ? 'asc' : orderDirection !== 'asc' ? 'asc' : 'desc'
      );
  };

  render() {
    const {
      taskList,
      numberPerPage,
      currentPage,
      totalNumber,
      hideColumns,
      admin,
      selectedIds,
      canChangeOrder,
      orderBy,
      orderDirection,
      classes
    } = this.props;
    if (!taskList) {
      return <Loading />;
    }
    return taskList.length > 0 ? (
      <Table padding="checkbox">
        <TableHead>
          <TableRow>
            {admin && (
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedIds.length === taskList.length}
                  onClick={this.handleAllCheck}
                />
              </TableCell>
            )}
            {!hideColumns.includes('sNumber') && <TableCell>序号</TableCell>}
            <TableCell
              className={canChangeOrder ? classes.orderHead : null}
              onClick={() => {
                canChangeOrder && this.handleChangeOrder('title');
              }}
            >
              任务名称
              {canChangeOrder && (
                <Order
                  orderBy={orderBy}
                  orderDirection={orderDirection}
                  name="title"
                />
              )}
            </TableCell>
            {!hideColumns.includes('from') && (
              <TableCell
                className={canChangeOrder ? classes.orderHead : null}
                onClick={() => {
                  canChangeOrder && this.handleChangeOrder('from');
                }}
              >
                起始日期
                {canChangeOrder && (
                  <Order
                    orderBy={orderBy}
                    orderDirection={orderDirection}
                    name="from"
                  />
                )}
              </TableCell>
            )}
            {!hideColumns.includes('to') && <TableCell>结束日期</TableCell>}
            {!hideColumns.includes('publisher') && (
              <TableCell>添加人</TableCell>
            )}
            {!hideColumns.includes('createTime') && (
              <TableCell
                className={canChangeOrder ? classes.orderHead : null}
                onClick={() => {
                  canChangeOrder && this.handleChangeOrder('createTime');
                }}
              >
                添加时间
                {canChangeOrder && (
                  <Order
                    orderBy={orderBy}
                    orderDirection={orderDirection}
                    name="createTime"
                  />
                )}
              </TableCell>
            )}
            {!hideColumns.includes('updateTime') && (
              <TableCell
                className={canChangeOrder ? classes.orderHead : null}
                onClick={() => {
                  canChangeOrder && this.handleChangeOrder('updateTime');
                }}
              >
                修改时间
                {canChangeOrder && (
                  <Order
                    orderBy={orderBy}
                    orderDirection={orderDirection}
                    name="updateTime"
                  />
                )}
              </TableCell>
            )}
            {admin && <TableCell style={{ width: '15rem', padding: '0' }} />}
          </TableRow>
        </TableHead>
        <TableBody>
          {taskList.map((task, index) => (
            <TableRow
              key={task.id}
              className={classnames({ [classes.alterRow]: index % 2 === 0 })}
            >
              {admin && (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.includes(task.id)}
                    onClick={e => this.handleRowClick(e, task.id)}
                  />
                </TableCell>
              )}
              {!hideColumns.includes('sNumber') && (
                <TableCell scope="row">
                  {numberPerPage * (currentPage - 1) + index + 1}
                </TableCell>
              )}
              <TableCell title={task.content}>
                <Typography
                  className={classes.onlyLink}
                  onClick={() => {
                    history.push(`/work/info?id=${task.id}`);
                  }}
                >
                  {task.title}
                </Typography>
              </TableCell>
              {!hideColumns.includes('from') && (
                <TableCell>{timeFunctions.formatFromUnix(task.from)}</TableCell>
              )}
              {!hideColumns.includes('to') && (
                <TableCell>{timeFunctions.formatFromUnix(task.to)}</TableCell>
              )}
              {!hideColumns.includes('publisher') && (
                <TableCell>
                  <Typography
                    className={classes.onlyLink}
                    onClick={() => {
                      history.push(`/user/info?id=${task.publisher.id}`);
                    }}
                  >
                    {task.publisher.name}
                  </Typography>
                </TableCell>
              )}
              {!hideColumns.includes('createTime') && (
                <TableCell>
                  {timeFunctions.formatFromUnix(task.createTime)}
                </TableCell>
              )}
              {!hideColumns.includes('updateTime') && (
                <TableCell>
                  {timeFunctions.formatFromUnix(task.updateTime)}
                </TableCell>
              )}
              {admin && (
                <TableCell style={{ padding: '0' }}>
                  <IconButton
                    onClick={() => {
                      history.push(`/work/task/edit?id=${task.id}`);
                    }}
                  >
                    <Edit />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[1, 5, 10, 20, 50]}
              colSpan={10 - (admin ? 0 : 2) - hideColumns.length}
              count={totalNumber}
              rowsPerPage={numberPerPage}
              labelRowsPerPage="每页显示:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from} - ${to}  共 ${count}`
              }
              page={currentPage - 1}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
              ActionsComponent={CustomTablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    ) : (
      <Typography variant="body1" color="textSecondary">
        没有结果
      </Typography>
    );
  }
}

TaskList.propTypes = {
  admin: PropTypes.bool, // 是否具有管理权限，是否显示管理列
  hideColumns: PropTypes.array, // 需要隐藏的列名
  totalNumber: PropTypes.number.isRequired, // 一共有多少条task，用于分页
  taskList: PropTypes.array, // 显示的task list
  numberPerPage: PropTypes.number.isRequired, // 每页显示多少条
  currentPage: PropTypes.number.isRequired, // 当前是多少页
  onChangeRowsPerPage: PropTypes.func,
  onPageChange: PropTypes.func,
  canChangeOrder: PropTypes.bool, // 是否支持排序
  onChangeOrder: PropTypes.func // 排序变化的回调函数
};

TaskList.defaultProps = {
  admin: false,
  hideColumns: [],
  canChangeOrder: false
};

export default compose(withStyles(style))(TaskList);
