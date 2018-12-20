import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DeptHeadChange from '../../components/common/DeptHeadChange';
import compose from 'recompose/compose';
import { Grid, Divider } from '@material-ui/core';
import { actions as accountActions } from '../../reducers/account';
import WorkList from '../../components/work/WorkList';
import { getDeptWorksReq, getNumberPerPage } from '../../services/utility';

class DeptBulletin extends PureComponent {
  state = {
    workList: [],
    numberPerPage: getNumberPerPage(),
    currentPage: 1,
    totalNumber: 0
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
  render() {
    const { manageDept, manageDepts, deptDic, deptArray } = this.props;
    const { workList, numberPerPage, currentPage, totalNumber } = this.state;
    return (
      <Grid container direction="column" wrap="nowrap" spacing={8}>
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
          <WorkList
            admin={true}
            totalNumber={totalNumber}
            currentPage={currentPage}
            numberPerPage={numberPerPage}
            workList={workList}
            hideColumns={['dept']}
          />
        </Grid>
      </Grid>
    );
  }
}

DeptBulletin.propTypes = {};

function mapStateToProps(state) {
  return {
    manageDept: state.account.manageDept,
    manageDepts: state.account.manageDepts,
    deptDic: state.system.deptDic,
    deptArray: state.system.deptArray
  };
}

export default compose(connect(mapStateToProps))(DeptBulletin);
