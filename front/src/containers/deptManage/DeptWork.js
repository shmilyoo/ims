import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DeptHeadChange from '../../components/common/DeptHeadChange';
import compose from 'recompose/compose';
import { Grid, Divider } from '@material-ui/core';
import { actions as accountActions } from '../../reducers/account';

class DeptWork extends PureComponent {
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
            showSelect={manageDepts.length > 0}
            canSelectIdList={manageDepts}
            onSelect={this.handleDeptChange}
          />
        </Grid>
        <Grid item>
          <Divider />
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

export default compose(connect(mapStateToProps))(DeptWork);
