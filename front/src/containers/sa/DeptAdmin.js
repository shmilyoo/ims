import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { Grid, Button, Divider, Typography } from '@material-ui/core';
import Tree from '../../components/Tree';
import {
  makeDeptTree,
  getLevel1ExpandsfromTreeArray,
  getNewExpands,
  getDeptManagersAsync,
  setDeptManagersAsync
} from '../../services/utility';
import Axios from 'axios';
import compose from 'recompose/compose';
import { actions as systemActions } from '../../reducers/system';
import DeptAdminForm from '../../forms/system/DeptAdminForm';
import UserPicker from '../../components/common/UserPicker';
import { actions as deptActions } from '../../reducers/dept';

class DeptAdmin extends Component {
  constructor(props) {
    super(props);
    const { deptArray } = props;
    const expands = getLevel1ExpandsfromTreeArray(deptArray);
    const treeData = makeDeptTree(deptArray, expands);
    this.state = {
      treeData: treeData,
      nodeSelected: null,
      expands: expands,
      admins: null // 部门管理员 [{id,name},{id,name}...]
    };
  }

  handleExpandsChange = expands => {
    if (this.state.expands === expands) return;
    const newExpands = getNewExpands(this.state.expands, expands);
    typeof expands === 'boolean'
      ? this.setState({
          expands: newExpands,
          treeData: makeDeptTree(this.props.deptArray, newExpands)
        })
      : this.setState({
          expands: newExpands
        });
  };

  handleTreeNodeSelected = (id, title) => {
    getDeptManagersAsync(id).then(res => {
      if (res.success) {
        this.setState({
          nodeSelected: { id, title },
          admins: res.data.managers
        });
      }
    });
  };

  handleTreeNodeUnSelected = () => {
    this.setState({
      nodeSelected: null,
      admins: null
    });
  };

  handleTreeDataChange = treeData => {
    this.setState({ treeData });
  };

  handleAdminFormSubmit = values => {
    return new Promise(resolve => {
      this.props.dispatch(
        deptActions.sagaSetDeptManager(
          resolve,
          this.state.nodeSelected.id,
          values.admins
        )
      );
    });
  };

  render() {
    const { treeData, admins, nodeSelected } = this.state;
    const { deptArray } = this.props;
    return (
      <Grid container direction="column" wrap="nowrap">
        <Grid item>
          <Typography>
            1. 默认每个节点绑定自身，不需要再额外绑定添加数据库
          </Typography>
          <Typography>2. 两边节点均选定后才可以绑定/解绑</Typography>
        </Grid>
        <Grid item>
          <Divider style={{ margin: '1rem 0' }} />
        </Grid>
        <Grid item container>
          <Grid item xs={4}>
            <Tree
              title="部门列表"
              isVirtualized={false}
              hideRefresh={true}
              treeData={treeData}
              canDrop={() => false}
              onChange={this.handleTreeDataChange}
              onExpandsChange={this.handleExpandsChange}
              onTreeNodeSelected={this.handleTreeNodeSelected}
              onTreeNodeUnSelected={this.handleTreeNodeUnSelected}
            />
          </Grid>
          <Grid item xs>
            <DeptAdminForm
              enableReinitialize
              onSubmit={this.handleAdminFormSubmit}
              nodeSelected={nodeSelected}
              deptArray={deptArray}
              initialValues={{
                admins: admins || []
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default DeptAdmin;
