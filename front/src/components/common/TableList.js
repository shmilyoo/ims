import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Checkbox,
  Typography,
  withStyles,
  TableFooter
} from '@material-ui/core';
import compose from 'recompose/compose';
import classnames from 'classnames';
import CustomTablePaginationActions from '../CustomTablePaginationActions';
import Loading from '../common/Loading';

const style = theme => ({
  link: { ...theme.sharedClass.link },
  orderHead: {
    cursor: 'pointer'
  },
  alterRow: {
    backgroundColor: theme.palette.text.third
  },
  padding0: {
    padding: '0px'
  }
});

const Order = ({ orderBy, orderDirection, name }) => {
  return orderBy === name && (orderDirection === 'desc' ? ' ⬇' : ' ⬆');
};

class TableList extends React.PureComponent {
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
    const { onSelectedChange, selectedIds, rows } = this.props;
    onSelectedChange(
      selectedIds.length === rows.length ? [] : rows.map(row => row.id)
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
        orderBy !== name ? 'desc' : orderDirection !== 'asc' ? 'asc' : 'desc'
      );
  };

  render() {
    const {
      rows,
      columns,
      showCheckbox,
      showNumber,
      numberPerPage,
      currentPage,
      totalNumber,
      selectedIds,
      orderBy,
      orderDirection,
      classes
    } = this.props;
    if (!rows || !columns) {
      return <Loading />;
    }
    return rows.length > 0 ? (
      <Table padding="checkbox">
        <TableHead>
          <TableRow>
            {showCheckbox && (
              <TableCell className={classes.padding0}>
                <Checkbox
                  checked={selectedIds.length === rows.length}
                  onClick={this.handleAllCheck}
                />
              </TableCell>
            )}
            {showNumber && (
              <TableCell
                className={classes.padding0}
                style={{ textAlign: 'center' }}
              >
                序号
              </TableCell>
            )}
            {columns.map(([name, title, canOrder]) => (
              <TableCell
                key={name}
                className={classnames({ [classes.orderHead]: canOrder })}
                onClick={
                  canOrder
                    ? () => {
                        this.handleChangeOrder(name);
                      }
                    : null
                }
              >
                {title}
                {canOrder && (
                  <Order
                    orderBy={orderBy}
                    orderDirection={orderDirection}
                    name={name}
                  />
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={row.id}
              className={classnames({ [classes.alterRow]: index % 2 === 0 })}
            >
              {showCheckbox && (
                <TableCell className={classes.padding0}>
                  <Checkbox
                    checked={selectedIds.includes(row.id)}
                    onClick={e => this.handleRowClick(e, row.id)}
                  />
                </TableCell>
              )}
              {showNumber && (
                <TableCell className={classes.padding0} align="center">
                  <Typography align="center">
                    {numberPerPage * (currentPage - 1) + index + 1}
                  </Typography>
                </TableCell>
              )}
              {columns.map(([name]) => (
                <TableCell key={name}>{row[name]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[1, 5, 10, 20, 50]}
              colSpan={
                columns.length + (showCheckbox ? 1 : 0) + (showNumber ? 1 : 0)
              }
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
      <Typography variant="h6" style={{ lineHeight: '5rem' }}>
        没有结果
      </Typography>
    );
  }
}

TableList.propTypes = {
  rows: PropTypes.array, // 数据列表
  columns: PropTypes.array, // 列名列表 [[name,title,canOrder]...] name识别符 title中文名称 canOrder是否可以点击排序
  showCheckbox: PropTypes.bool, // 是否显示第一列选择框
  showNumber: PropTypes.bool, // 是否显示第二列序号
  totalNumber: PropTypes.number.isRequired, // 一共有多少条work，用于分页
  numberPerPage: PropTypes.number.isRequired, // 每页显示多少条
  currentPage: PropTypes.number.isRequired, // 当前是多少页
  orderBy: PropTypes.string, // 排序列名称
  orderDirection: PropTypes.string, // 排序方向
  onSelectedChange: PropTypes.func, // 勾选的条目有变化时的回调
  onChangeRowsPerPage: PropTypes.func, // 修改每页显示多少行时的回调
  onPageChange: PropTypes.func, // 变更页码回调
  onChangeOrder: PropTypes.func // 排序变化的回调函数
};

TableList.defaultProps = {
  showCheckbox: true,
  showNumber: true
};

export default compose(withStyles(style))(TableList);
