import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import TableList from '../../components/common/TableList';
import {
  getWorkTasks,
  getNumberPerPage,
  setNumberPerPage,
  timeFunctions
} from '../../services/utility';
import { withStyles, Grid, Select, MenuItem } from '@material-ui/core';
import SearchTextField from '../../components/common/SearchTextField';
import SearchTextFieldWithType from '../../components/common/SearchTextFieldWithType';
import WorkTaskSearchForm from '../../forms/work/WorkTaskSearchForm';
import { resolve } from 'url';

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
  },
  lineCut: theme.sharedClass.lineCut
});

class WorkTaskList extends PureComponent {
  state = {
    rows: null,
    columns: [
      ['title', '标题', false],
      ['from', '开始时间', true, { width: '10rem' }],
      ['to', '结束时间', true, { width: '10rem' }],
      ['createTime', '创建时间', true, { width: '10rem' }],
      ['updateTime', '更新时间', true, { width: '10rem' }],
      ['publisher', '发布人', false, { width: '10rem' }]
    ],
    numberPerPage: getNumberPerPage(),
    currentPage: 1,
    totalNumber: 0,
    selectedIds: [],
    orderBy: 'updateTime',
    orderDirection: 'desc',
    searchType: '',
    searchValue: ''
  };

  componentDidMount() {
    this.showTasks();
  }

  showTasks = (page = 1) => {
    const { workId } = this.props;
    const {
      numberPerPage,
      orderBy,
      orderDirection,
      searchType,
      searchValue
    } = this.state;
    return getWorkTasks({
      workId,
      numberPerPage,
      currentPage: page,
      withPublisher: true,
      order: { [orderBy]: orderDirection },
      filter: { searchType, searchValue }
    }).then(res => {
      if (res.success) {
        const { totalNumber, taskList } = res.data;
        this.setState({
          rows: this.formatTasks(taskList),
          totalNumber,
          currentPage: page
        });
      }
      return new Promise(resolve => {
        resolve(res.success);
      });
    });
  };
  formatTasks = taskList => {
    return taskList.map(
      ({ id, title, from, to, createTime, updateTime, publisher }) => ({
        id,
        title: (
          <Link
            className={classnames(
              this.props.classes.link,
              this.props.classes.lineCut
            )}
            to={`/work/task/info?id=${id}`}
          >
            {title}
          </Link>
        ),
        from: timeFunctions.formatFromUnix(from),
        to: timeFunctions.formatFromUnix(to),
        createTime: timeFunctions.formatFromUnix(createTime),
        updateTime: timeFunctions.formatFromUnix(updateTime),
        publisher: (
          <Link
            className={this.props.classes.link}
            to={`/user/info?id=${publisher.id}`}
          >
            {publisher.name}
          </Link>
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
  handleTaskSearchSubmit = values => {
    const { value, name } = values;
    let _value = value;
    if (typeof value === 'string') {
      _value = value.trim();
    } else if (typeof value === 'object') {
      _value = {
        from: timeFunctions.getDateUnix(value.from),
        to: timeFunctions.getDateUnix(value.to)
      };
    }
    this.setState({ searchType: name, searchValue: _value }, () => {
      this.showTasks(1);
    });
  };
  handleTaskSearchReset = () => {
    this.setState({ searchType: '', searchValue: '' }, () => {
      this.showTasks(1);
    });
  };
  render() {
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
      <Grid container direction="column" wrap="nowrap">
        {rows &&
          rows.length > 0 && (
            <Grid item>
              <WorkTaskSearchForm
                selectData={[
                  { value: 'title', label: '标题', kind: 'text' },
                  { value: 'from', label: '开始时间', kind: 'date' },
                  { value: 'to', label: '结束时间', kind: 'date' },
                  {
                    value: 'createTime',
                    label: '创建时间',
                    kind: 'date'
                  },
                  {
                    value: 'updateTime',
                    label: '更新时间',
                    kind: 'date'
                  }
                ]}
                onSubmit={this.handleTaskSearchSubmit}
                onReset={this.handleTaskSearchReset}
                // initialValues={{ name: 'title' }}
              />
            </Grid>
          )}
        <Grid item>
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
        </Grid>
      </Grid>
    );
  }
}

WorkTaskList.propTypes = {
  workId: PropTypes.string.isRequired,
  showSearch: PropTypes.bool
};
WorkTaskList.defaultProps = {
  showSearch: true
};

export default withStyles(style)(WorkTaskList);
