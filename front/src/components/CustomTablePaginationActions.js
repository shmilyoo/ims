import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { range } from '../services/utility';
import classnames from 'classnames';

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5
  },
  number: {
    width: '2rem',
    height: '2rem',
    cursor: 'pointer',
    display: 'inline-block',
    textAlign: 'center',
    lineHeight: '2rem',
    marginLeft: theme.spacing.unit
  },
  numberDot: {
    marginLeft: theme.spacing.unit
  },
  currentPage: {
    backgroundColor: theme.palette.secondary.light
  },
  jumpInput: {
    width: '2rem',
    height: '2rem',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    marginLeft: '0',
    border: `1px solid ${theme.palette.text.secondary}`
  },
  jump: {
    width: '2rem',
    height: '2rem',
    cursor: 'pointer',
    margin: '0 5px',
    '&:hover': {
      color: theme.palette.primary.main
    }
  }
});

class TablePaginationActions extends React.Component {
  constructor(props) {
    super(props);
    this.jump = React.createRef();
  }

  handlePageClick = (e, n) => {
    this.props.onChangePage(e, n);
  };
  handleJumpClick = e => {
    const page = Number.parseInt(this.jump.current.value);
    const totalPages = Math.ceil(this.props.count / this.props.rowsPerPage);
    if (
      Number.isInteger(page) &&
      page > 0 &&
      page <= totalPages &&
      page !== this.props.page + 1
    ) {
      this.jump.current.value = '';
      this.props.onChangePage(e, page);
    }
  };

  render() {
    const { classes, count, page, rowsPerPage } = this.props;
    // const range_num = 3; // 当前页页码左右各显示几页
    const totalPages = Math.ceil(count / rowsPerPage);
    const pageFrom1 = page + 1; // page 是基于0的
    let pageNumbers = [];
    if (totalPages < 7) pageNumbers = range(1, totalPages);
    else {
      if (pageFrom1 > 5) {
        pageNumbers =
          pageFrom1 < totalPages - 4
            ? [
                1,
                '...',
                ...range(pageFrom1 - 3, pageFrom1 + 3),
                '...',
                totalPages
              ]
            : [1, '...', ...range(pageFrom1 - 3, totalPages)];
      } else {
        pageNumbers = [...range(1, pageFrom1 + 3), '...', totalPages];
      }
    }
    return (
      <div className={classes.root}>
        <input ref={this.jump} className={classes.jumpInput} />
        <span onClick={this.handleJumpClick} className={classes.jump}>
          跳转
        </span>
        {pageNumbers.map(n => {
          if (typeof n === 'number') {
            return (
              <span
                onClick={e => {
                  this.handlePageClick(e, n);
                }}
                className={classnames(classes.number, {
                  [classes.currentPage]: n === page + 1
                })}
              >
                {n}
              </span>
            );
          } else {
            return <span className={classes.numberDot}>{n}</span>;
          }
        })}
      </div>
    );
  }
}
TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired, // 显示页码发生变化调用
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};

export default withStyles(actionsStyles)(TablePaginationActions);
