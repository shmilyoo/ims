// obsolete because it alreadly have tableList

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
import { Link } from 'react-router-dom';
import Edit from '@material-ui/icons/Edit';
import compose from 'recompose/compose';
import classnames from 'classnames';
import history from '../../history';
import { timeFunctions } from '../../services/utility';
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

class ArticleList extends React.PureComponent {
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
    const { onSelectedChange, selectedIds, articleList } = this.props;
    onSelectedChange(
      selectedIds.length === articleList.length
        ? []
        : articleList.map(article => article.id)
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
      articleList,
      from,
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
    if (!articleList) {
      return <Loading />;
    }
    return articleList.length > 0 ? (
      <Table padding="checkbox">
        <TableHead>
          <TableRow>
            {admin && (
              <TableCell className={classes.padding0}>
                <Checkbox
                  checked={selectedIds.length === articleList.length}
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
              文章标题
              {canChangeOrder && (
                <Order
                  orderBy={orderBy}
                  orderDirection={orderDirection}
                  name="title"
                />
              )}
            </TableCell>
            {!hideColumns.includes('channel') && (
              <TableCell>所属频道</TableCell>
            )}
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
            {admin && (
              <TableCell
              //  style={{ width: 'auto', padding: '0' }}
              />
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {articleList.map((article, index) => (
            <TableRow
              key={article.id}
              className={classnames({ [classes.alterRow]: index % 2 === 0 })}
            >
              {admin && (
                <TableCell className={classes.padding0}>
                  <Checkbox
                    checked={selectedIds.includes(article.id)}
                    onClick={e => this.handleRowClick(e, article.id)}
                  />
                </TableCell>
              )}
              {!hideColumns.includes('sNumber') && (
                <TableCell scope="row">
                  <Typography>
                    {numberPerPage * (currentPage - 1) + index + 1}
                  </Typography>
                </TableCell>
              )}
              <TableCell>
                <Link
                  className={classes.link}
                  to={`/${from}/article?id=${article.id}`}
                >
                  {article.title}
                </Link>
              </TableCell>
              {!hideColumns.includes('channel') && (
                <TableCell>
                  <Typography>{article.channel.name}</Typography>
                </TableCell>
              )}
              {!hideColumns.includes('publisher') && (
                <TableCell>
                  <Link
                    className={classes.link}
                    to={`/user/info?id=${article.publisher.id}`}
                  >
                    {article.publisher.name}
                  </Link>
                </TableCell>
              )}
              {!hideColumns.includes('createTime') && (
                <TableCell>
                  <Typography>
                    {timeFunctions.formatFromUnix(article.createTime)}
                  </Typography>
                </TableCell>
              )}
              {!hideColumns.includes('updateTime') && (
                <TableCell>
                  <Typography>
                    {timeFunctions.formatFromUnix(article.updateTime)}
                  </Typography>
                </TableCell>
              )}
              {admin && (
                <TableCell className={classes.padding0}>
                  <IconButton
                    className={classes.padding0}
                    onClick={() => {
                      history.push(`/${from}/article/edit?id=${article.id}`);
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
              colSpan={8 - (admin ? 0 : 2) - hideColumns.length}
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

ArticleList.propTypes = {
  admin: PropTypes.bool, // 是否具有管理权限，是否显示管理列
  hideColumns: PropTypes.array, // 需要隐藏的列名
  totalNumber: PropTypes.number.isRequired, // 一共有多少条work，用于分页
  workList: PropTypes.array, // 显示的work list
  numberPerPage: PropTypes.number.isRequired, // 每页显示多少条
  currentPage: PropTypes.number.isRequired, // 当前是多少页
  onChangeRowsPerPage: PropTypes.func,
  onPageChange: PropTypes.func,
  canChangeOrder: PropTypes.bool, // 是否支持排序
  onChangeOrder: PropTypes.func // 排序变化的回调函数
};

ArticleList.defaultProps = {
  admin: false,
  hideColumns: [],
  canChangeOrder: false
};

export default compose(withStyles(style))(ArticleList);
