import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import DeptHeadChange from '../../components/common/DeptHeadChange';
import compose from 'recompose/compose';
import { Grid, Divider } from '@material-ui/core';
import { actions as accountActions } from '../../reducers/account';
// import WorkList from '../../components/work/WorkList';
import { getNumberPerPage } from '../../services/utility';

class DeptBulletin extends PureComponent {
  state = {
    bulletinList: [],
    numberPerPage: getNumberPerPage(),
    currentPage: 1,
    totalNumber: 0,
    edit: false // 编辑模式还是添加模式
  };
  componentDidMount() {}

  handleDeptChange = id => {
    this.props.dispatch(accountActions.setManageDept(id));
  };
  render() {
    const { manageDept, manageDepts, deptDic, deptArray } = this.props;
    return (
      <Grid container direction="column" wrap="nowrap" spacing={8}>
        <Grid item>
          <DeptHeadChange
            id={manageDept}
            deptArray={deptArray}
            deptDic={deptDic}
            showSelect={manageDepts.length > 1}
            canSelectIdList={manageDepts}
            onSelect={this.handleDeptChange}
          />
        </Grid>
        <Grid item>
          <Divider />
        </Grid>
        <Grid item>
          {/* <WorkList
            admin={true}
            totalNumber={totalNumber}
            currentPage={currentPage}
            numberPerPage={numberPerPage}
            workList={workList}
            hideColumns={['dept']}
          /> */}
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
