import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import DeptHeadChange from '../../components/common/DeptHeadChange';
import compose from 'recompose/compose';
import {
  Grid,
  Divider,
  Typography,
  IconButton,
  Button,
  withStyles
} from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import { actions as accountActions } from '../../reducers/account';
import WorkList from '../../components/work/WorkList';
import {
  getDeptWorks,
  getNumberPerPage,
  setNumberPerPage,
  delWorks,
  timeFunctions
} from '../../services/utility';
import history from '../../history';
import SimpleAlertDialog from '../../components/common/SimpleAlertDialog';
import TableList from '../../components/common/TableList';

const style = theme => ({
  multiDelBtn: { ...theme.sharedClass.alertBtn },
  root: { height: '100%' },
  link: theme.sharedClass.link
});

class DeptWorks extends PureComponent {
  state = {
    rows: null,
    // 大项工作名称	起始日期	结束日期	添加人	添加时间 ⬇	修改时间
    columns: [
      ['title', '大项工作名称', false],
      ['from', '开始时间', true],
      ['to', '结束时间', true],
      ['publisher', '发布人', false],
      ['createTime', '创建时间', true],
      ['updateTime', '更新时间', true],
      ['edit', '', false]
    ],
    numberPerPage: getNumberPerPage(),
    currentPage: 1,
    totalNumber: 0,
    selectedIds: [],
    orderBy: 'createTime',
    orderDirection: 'desc',
    alertOpen: false // 警告窗口开关
  };

  componentDidMount() {
    this.getWorkList(1);
  }

  /**
   * 获取指定页的workList，并设置相关state
   */
  getWorkList = getPage => {
    const { manageDept } = this.props;
    const { numberPerPage, orderBy, orderDirection } = this.state;
    getDeptWorks({
      deptId: manageDept,
      numberPerPage,
      currentPage: getPage,
      withDept: true,
      withPublisher: true,
      orderBy,
      orderDirection
    }).then(res => {
      if (res.success) {
        const { workList, totalNumber } = res.data;
        this.setState({
          rows: this.formatWorks(workList),
          totalNumber,
          currentPage: getPage
        });
      }
    });
  };

  formatWorks = workList => {
    return workList.map(
      ({ id, title, from, to, createTime, updateTime, publisher }) => ({
        id,
        title: (
          <Link className={this.props.classes.link} to={`/work/info?id=${id}`}>
            {title}
          </Link>
        ),
        from: <Typography>{timeFunctions.formatFromUnix(from)}</Typography>,
        to: <Typography>{timeFunctions.formatFromUnix(to)}</Typography>,
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
              history.push(`/work/edit?id=${id}`);
            }}
          >
            <Edit />
          </IconButton>
        )
      })
    );
  };

  handleDeptChange = id => {
    this.props.dispatch(accountActions.setManageDept(id));
  };
  handleSelectedChange = ids => {
    this.setState({ selectedIds: ids });
  };
  handlePageChagne = page => {
    this.setState({ rows: null });
    this.getWorkList(page);
  };
  handleChangeRowsPerPage = rowsPerPage => {
    this.setState(
      { numberPerPage: setNumberPerPage(rowsPerPage), workList: null },
      () => {
        this.getWorkList(1);
      }
    );
  };
  handlePageChange = page => {
    this.setState({ workList: null });
    this.getWorkList(page);
  };
  handleChangeOrder = (name, direction) => {
    this.setState(
      {
        orderBy: name,
        orderDirection: direction || 'desc'
      },
      () => this.getWorkList(1)
    );
  };
  handleMultiDelWorks = () => {
    if (!this.state.selectedIds.length) return;
    this.setState({ alertOpen: true });
  };
  closeAlert = () => {
    this.setState({ alertOpen: false });
  };
  handleConfirmAlert = () => {
    this.closeAlert();
    delWorks(this.state.selectedIds).then(res => {
      if (res.success) {
        this.setState({ workList: null });
        this.getWorkList(1);
      }
    });
  };
  render() {
    const { manageDept, manageDepts, deptDic, deptArray, classes } = this.props;
    const {
      alertOpen,
      rows,
      columns,
      numberPerPage,
      currentPage,
      totalNumber,
      selectedIds,
      orderBy,
      orderDirection
    } = this.state;
    return (
      <Grid
        container
        direction="column"
        wrap="nowrap"
        spacing={8}
        className={classes.root}
      >
        <SimpleAlertDialog
          title="警告"
          content="删除大项工作会一并删除其下的所有内容（阶段、日常工作、文章、讨论、文件等）,确定删除么？"
          onCancel={this.closeAlert}
          onConfirm={this.handleConfirmAlert}
          open={alertOpen}
        />
        <Grid item>
          <DeptHeadChange
            id={manageDept}
            deptArray={deptArray}
            deptDic={deptDic}
            showSelect={manageDepts.length > 0}
            canSelectIdList={manageDepts}
            onSelect={this.handleDeptChange}
          />
        </Grid>
        <Grid item>
          <Divider />
        </Grid>
        <Grid item>
          <div>
            <Button
              color="secondary"
              size="small"
              onClick={() => {
                history.push('/dept-manage/work/add');
              }}
            >
              添加
            </Button>

            <Button
              disabled={!(selectedIds && selectedIds.length > 0)}
              className={classes.multiDelBtn}
              size="small"
              onClick={() => {
                this.handleMultiDelWorks(selectedIds);
              }}
            >
              删除
            </Button>
          </div>
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

function mapStateToProps(state) {
  return {
    manageDept: state.account.manageDept,
    manageDepts: state.account.manageDepts,
    deptDic: state.system.deptDic,
    deptArray: state.system.deptArray
  };
}

export default compose(
  withStyles(style),
  connect(mapStateToProps)
)(DeptWorks);
