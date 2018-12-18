import React from 'react';
import PropTypes from 'prop-types';

const WorkList = props => {
  return <div />;
};

WorkList.propTypes = {
  totalNumber: PropTypes.number.isRequired, // 一共有多少条work，用于分页
  workList: PropTypes.array.isRequired, // 显示的work list
  numberPerPage: PropTypes.number.isRequired, // 每页显示多少条
  currentPage: PropTypes.number.isRequired // 当前是多少页
};

export default WorkList;
