import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import DeptHeadChange from '../../components/common/DeptHeadChange';
import compose from 'recompose/compose';
import { Grid, Divider, Button, withStyles } from '@material-ui/core';
import { actions as accountActions } from '../../reducers/account';
import WorkList from '../../components/work/WorkList';
import {
  getDeptWorks,
  getNumberPerPage,
  setNumberPerPage,
  delMultiWorks
} from '../../services/utility';
import history from '../../history';
import SimpleAlertDialog from '../../components/common/SimpleAlertDialog';

const style = theme => ({
  multiDelBtn: { ...theme.sharedClass.alertBtn },
  // onlyLink: { ...theme.sharedClass.onlyLink },
  root: { height: '100%' }
});

class DeptWork extends PureComponent {
  state = {
    workList: null,
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
    getDeptWorks(
      manageDept,
      numberPerPage,
      getPage,
      orderBy,
      orderDirection,
      true,
      true
    ).then(res => {
      if (res.success) {
        const { workList, totalNumber } = res.data;
        this.setState({ workList, totalNumber, currentPage: getPage });
      }
    });
  };
  handleDeptChange = id => {
    this.props.dispatch(accountActions.setManageDept(id));
  };
  handleSelectedChange = ids => {
    this.setState({ selectedIds: ids });
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
        orderDirection: direction || 'asc'
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
    delMultiWorks(this.state.selectedIds).then(res => {
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
      workList,
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
          <WorkList
            admin={true}
            selectedIds={selectedIds}
            totalNumber={totalNumber}
            currentPage={currentPage}
            numberPerPage={numberPerPage}
            workList={workList}
            hideColumns={['dept']}
            canChangeOrder={true}
            orderBy={orderBy}
            orderDirection={orderDirection}
            onPageChange={this.handlePageChange}
            onSelectedChange={this.handleSelectedChange}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            onChangeOrder={this.handleChangeOrder}
            onDelRows={this.handleMultiDelWorks}
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
)(DeptWork);
