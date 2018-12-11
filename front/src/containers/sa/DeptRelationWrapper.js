import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Loading from '../../components/common/Loading';
import DeptRelation from './DeptRelation';

const DeptRelationWrapper = ({
  deptArray,
  deptDic,
  deptRelation,
  dispatch
}) => {
  return deptArray ? (
    <DeptRelation
      deptArray={deptArray}
      deptDic={deptDic}
      deptRelation={deptRelation}
      dispatch={dispatch}
    />
  ) : (
    <Loading />
  );
};

function mapStateToProps(state) {
  return {
    deptArray: state.system.deptArray,
    deptDic: state.system.deptDic,
    deptRelation: state.system.deptRelation
  };
}

export default compose(connect(mapStateToProps))(DeptRelationWrapper);
