import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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
  Button,
  withStyles,
  TableFooter
} from '@material-ui/core';
import Info from '@material-ui/icons/Info';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import compose from 'recompose/compose';
import history from '../../history';
import { timeFunctions } from '../../services/utility';
import CustomTablePaginationActions from '../CustomTablePaginationActions';
import Loading from '../common/Loading';

const style = theme => ({
  multiDelBtn: { ...theme.sharedClass.alertBtn },
  onlyLink: { ...theme.sharedClass.onlyLink }
});

class WorkList extends React.PureComponent {
  state = {
    selectedIds: []
  };
  handleRowClick = (e, id) => {
    e.stopPropagation();
    this.setState({
      selectedIds: this.state.selectedIds.includes(id)
        ? this.state.selectedIds.filter(_id => _id !== id)
        : [...this.state.selectedIds, id]
    });
  };
  handleMultiDelWorks = () => {};

  handleAllCheck = () => {
    this.setState({
      selectedIds:
        this.state.selectedIds.length === this.props.workList.length
          ? []
          : this.props.workList.map(work => work.id)
    });
  };
  handleChangePage = (e, page) => {
    this.props.onPageChange && this.props.onPageChange(page);
  };

  handleChangeRowsPerPage = e => {
    this.props.onChangeRowsPerPage &&
      this.props.onChangeRowsPerPage(e.target.value);
  };

  render() {
    const {
      workList,
      numberPerPage,
      currentPage,
      totalNumber,
      hideColumns,
      admin,
      selectedIds,
      classes
    } = this.props;
    if (!workList) {
      return <Loading />;
    }
    return workList.length > 0 ? (
      <Table padding="checkbox">
        <TableHead>
          <TableRow>
            {admin && (
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedIds.length === workList.length}
                  onClick={this.handleAllCheck}
                />
              </TableCell>
            )}
            {!hideColumns.includes('sNumber') && <TableCell>序号</TableCell>}
            <TableCell>大项工作名称</TableCell>
            {!hideColumns.includes('dept') && <TableCell>所属部门</TableCell>}
            {!hideColumns.includes('from') && <TableCell>起始日期</TableCell>}
            {!hideColumns.includes('to') && <TableCell>结束日期</TableCell>}
            {!hideColumns.includes('publisher') && (
              <TableCell>添加人</TableCell>
            )}
            {!hideColumns.includes('createTime') && (
              <TableCell>添加时间</TableCell>
            )}
            {!hideColumns.includes('updateTime') && (
              <TableCell>修改时间</TableCell>
            )}
            {admin && <TableCell style={{ width: '15rem', padding: '0' }} />}
          </TableRow>
        </TableHead>
        <TableBody>
          {workList.map((work, index) => (
            <TableRow key={work.id}>
              {admin && (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.includes(work.id)}
                    onClick={e => this.handleRowClick(e, work.id)}
                  />
                </TableCell>
              )}
              {!hideColumns.includes('sNumber') && (
                <TableCell scope="row">
                  {numberPerPage * (currentPage - 1) + index + 1}
                </TableCell>
              )}
              <TableCell title={work.content}>
                <Typography
                  className={classes.onlyLink}
                  onClick={() => {
                    history.push(`/work/info?id=${work.id}`);
                  }}
                >
                  {work.title}
                </Typography>
              </TableCell>
              {!hideColumns.includes('dept') && (
                <TableCell>
                  <Typography
                    className={classes.onlyLink}
                    onClick={() => {
                      history.push(`/dept/info?id=${work.dept.id}`);
                    }}
                  >
                    {work.dept.name}
                  </Typography>
                </TableCell>
              )}
              {!hideColumns.includes('from') && (
                <TableCell>{timeFunctions.formatFromUnix(work.from)}</TableCell>
              )}
              {!hideColumns.includes('to') && (
                <TableCell>
                  {work.to
                    ? timeFunctions.formatFromUnix(work.to)
                    : '未定/至今'}
                </TableCell>
              )}
              {!hideColumns.includes('publisher') && (
                <TableCell>
                  <Typography
                    className={classes.onlyLink}
                    onClick={() => {
                      history.push(`/user/info?id=${work.publisher.id}`);
                    }}
                  >
                    {work.publisher.name}
                  </Typography>
                </TableCell>
              )}
              {!hideColumns.includes('createTime') && (
                <TableCell>
                  {timeFunctions.formatFromUnix(work.createTime)}
                </TableCell>
              )}
              {!hideColumns.includes('updateTime') && (
                <TableCell>
                  {timeFunctions.formatFromUnix(work.updateTime)}
                </TableCell>
              )}
              {admin && (
                <TableCell style={{ padding: '0' }}>
                  <IconButton
                    onClick={() => {
                      history.push(`/work/edit?id=${work.id}`);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      this.handleMultiDelWorks([work.id]);
                    }}
                  >
                    <Delete className={classes.multiDelBtn} />
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
      <Typography variant="h6" style={{ lineHeight: '5rem' }}>
        没有结果
      </Typography>
    );
  }
}

WorkList.propTypes = {
  admin: PropTypes.bool, // 是否具有管理权限，是否显示管理列
  hideColumns: PropTypes.array, // 需要隐藏的列名
  totalNumber: PropTypes.number.isRequired, // 一共有多少条work，用于分页
  workList: PropTypes.array, // 显示的work list
  numberPerPage: PropTypes.number.isRequired, // 每页显示多少条
  currentPage: PropTypes.number.isRequired, // 当前是多少页
  onChangeRowsPerPage: PropTypes.func,
  onPageChange: PropTypes.func
};

WorkList.defaultProps = {
  admin: false,
  hideColumns: []
};

export default compose(withStyles(style))(WorkList);
