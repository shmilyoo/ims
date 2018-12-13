import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Loading from '../../components/common/Loading';
import DeptAdmin from './DeptAdmin';

const DeptAdminWrapper = ({ deptArray, deptDic, deptRelation, dispatch }) => {
  return deptArray ? (
    <DeptAdmin deptArray={deptArray} deptDic={deptDic} dispatch={dispatch} />
  ) : (
    <Loading />
  );
};

function mapStateToProps(state) {
  return {
    deptArray: state.system.deptArray,
    deptDic: state.system.deptDic
    // deptRelation: state.system.deptRelation
  };
}

export default compose(connect(mapStateToProps))(DeptAdminWrapper);
