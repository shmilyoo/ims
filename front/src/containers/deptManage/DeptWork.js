import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DeptHeadChange from '../../components/common/DeptHeadChange';
import compose from 'recompose/compose';
import { Grid, Divider, Button, withStyles } from '@material-ui/core';
import { actions as accountActions } from '../../reducers/account';
import WorkList from '../../components/work/WorkList';
import {
  getDeptWorksReq,
  getNumberPerPage,
  setNumberPerPage
} from '../../services/utility';
import history from '../../history';

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
    selectedIds: []
  };
  componentDidMount() {
    this.getWorkList(1);
  }

  /**
   * 获取指定页的workList，并设置相关state
   */
  getWorkList = getPage => {
    const { manageDept } = this.props;
    const { numberPerPage } = this.state;
    getDeptWorksReq(manageDept, numberPerPage, getPage, true, true).then(
      res => {
        if (res.success) {
          const { workList, totalNumber } = res.data;
          this.setState({ workList, totalNumber, currentPage: getPage });
        }
      }
    );
  };
  handleDeptChange = id => {
    this.props.dispatch(accountActions.setManageDept(id));
  };
  handleSelectedChange = ids => {
    this.setState({ selectedIds: ids });
  };
  handleChangeRowsPerPage = rowsPerPage => {
    this.setState({ numberPerPage: setNumberPerPage(rowsPerPage) }, () => {
      this.getWorkList(1);
    });
  };
  handlePageChagne = page => {
    this.getWorkList(page);
  };
  render() {
    const { manageDept, manageDepts, deptDic, deptArray, classes } = this.props;
    const {
      workList,
      numberPerPage,
      currentPage,
      totalNumber,
      selectedIds
    } = this.state;
    return (
      <Grid
        container
        direction="column"
        wrap="nowrap"
        spacing={8}
        className={classes.root}
      >
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
              添加工作
            </Button>
            {selectedIds &&
              selectedIds.length > 0 && (
                <Button
                  className={classes.multiDelBtn}
                  size="small"
                  onClick={() => {
                    this.handleMultiDelWorks(selectedIds);
                  }}
                >
                  批量删除
                </Button>
              )}
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
            onPageChange={this.handlePageChagne}
            onSelectedChange={this.handleSelectedChange}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Grid>
      </Grid>
    );
  }
}

DeptWork.propTypes = {};

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
