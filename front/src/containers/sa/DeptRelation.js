import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Button, Divider, Typography } from '@material-ui/core';
import Tree from '../../components/Tree';
import {
  makeDeptTree,
  getLevel1ExpandsfromTreeArray
} from '../../services/utility';
import Axios from 'axios';
import compose from 'recompose/compose';
import { actions as systemActions } from '../../reducers/system';

class DeptRelation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 按照level和order排序的节点数组，非树形数据,左边的树因为要改变文字，所以单独变量
      treeDataListLeft: null,
      // treeDataListRight 就是store中的deptArray
      nodeSelectedLeft: null,
      nodeSelectedRight: null,
      expandsLeft: null,
      expandsRight: null,
      shineNodeRightId: '' // 左边节点选中时，右边绑定的节点开始闪光
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (!preState.treeDataListLeft && nextProps.deptArray) {
      console.log('deptrelation getDerivedStateFromProps 计算');
      const { deptArray, deptDic, deptRelation } = nextProps;
      let deptArrayLeft = JSON.parse(JSON.stringify(deptArray));
      deptArrayLeft = deptArray.map(node => ({
        ...node,
        name: deptRelation[node.id]
          ? `${node.name} -> ${deptDic[deptRelation[node.id]].name}`
          : node.name
      }));
      const _expands = getLevel1ExpandsfromTreeArray(deptArrayLeft);
      return {
        treeDataListLeft: deptArrayLeft,
        expandsLeft: _expands,
        expandsRight: { ..._expands }
      };
    }
    return null;
  }

  /**
   * 左边选择节点后，右边绑定到的节点，一路展开，如果有必要的话
   */
  expandRightTreeToNode = _id => {
    const { deptDic } = this.props;
    let expandsRight = { ...this.state.expandsRight };
    let needChange = false; // 是否有必要展开
    let node = deptDic[deptDic[_id].parentId];
    while (node) {
      // 如果对应展开项不是true（undefined or false）
      if (!expandsRight[node.id]) needChange = true;
      expandsRight[node.id] = true;
      node = deptDic[node.parentId];
    }
    if (needChange) {
      this.setState({ expandsRight });
    }
  };
  handleExpandsLeftChange = expands => {
    this.setState({ expandsLeft: expands });
  };
  handleExpandsRightChange = expands => {
    this.setState({ expandsRight: expands });
  };

  handleTreeNodeLeftSelected = id => {
    const { deptDic, deptRelation } = this.props;
    let node = deptDic[id];
    const shineId = deptRelation[node.id] || node.id;
    this.setState({
      nodeSelectedLeft: {
        id: node.id,
        title: node.name
      },
      shineNodeRightId: shineId
    });
    this.expandRightTreeToNode(shineId);
  };
  handleTreeNodeRightSelected = id => {
    let node = this.props.deptDic[id];
    this.setState({
      nodeSelectedRight: {
        id: node.id,
        title: node.name
      }
    });
  };
  handleTreeNodeLeftUnSelected = () => {
    this.setState({
      nodeSelectedLeft: null,
      shineNodeRightId: ''
    });
  };
  handleTreeNodeRightUnSelected = () => {
    this.setState({
      nodeSelectedRight: null
    });
  };

  /**
   * 根据节点间的绑定关系计算出左侧节点列表
   */
  getDeptArrayLeft = (deptArray, deptRelation, deptDic) => {
    let deptArrayLeft = deptArray.map(node => ({
      ...node,
      name: deptRelation[node.id]
        ? `${node.name} -> ${deptDic[deptRelation[node.id]].name}`
        : node.name
    }));
    return deptArrayLeft;
  };

  bind = () => {
    const { deptRelation, deptArray, deptDic, dispatch } = this.props;
    const { nodeSelectedLeft, nodeSelectedRight } = this.state;
    if (
      nodeSelectedLeft &&
      nodeSelectedRight &&
      deptRelation[nodeSelectedLeft.id] === nodeSelectedRight.id
    ) {
      // 解绑
      Axios.post('/dept/relations/unbind', {
        fromDeptId: nodeSelectedLeft.id,
        toDeptId: nodeSelectedRight.id
      }).then(res => {
        if (res.success) {
          const { fromDeptId } = res.data;
          this.setState({ shineNodeRightId: '' });
          // 更改store中的deptRelation 更新左侧树的deptArray
          const newRelation = { ...deptRelation };
          delete newRelation[fromDeptId];
          this.setState({
            treeDataListLeft: this.getDeptArrayLeft(
              deptArray,
              newRelation,
              deptDic
            )
          });
          dispatch(systemActions.setDeptRelation(newRelation));
        }
      });
    } else {
      // 绑定
      Axios.post('/dept/relations/bind', {
        fromDeptId: nodeSelectedLeft.id,
        toDeptId: nodeSelectedRight.id
      }).then(res => {
        if (res.success) {
          const { fromDeptId, toDeptId } = res.data;
          const newRelation = { ...deptRelation };
          newRelation[fromDeptId] = toDeptId;
          this.setState({ shineNodeRightId: nodeSelectedRight.id });
          this.setState({
            treeDataListLeft: this.getDeptArrayLeft(
              deptArray,
              newRelation,
              deptDic
            )
          });
          dispatch(systemActions.setDeptRelation(newRelation));
        }
      });
    }
  };

  updateLeftTree = () => {
    const { treeDataListLeft, treeDataDic } = this.state;
    treeDataListLeft.forEach(node => {
      node.name = this.deptRelations[node.id]
        ? `${treeDataDic[node.id].name} -> ${
            treeDataDic[this.deptRelations[node.id]].name
          }`
        : treeDataDic[node.id].name;
    });
    let treeDataLeft = makeDeptTree(treeDataListLeft, this.expandsLeft);
    this.setState({
      treeDataListLeft,
      treeDataLeft
    });
  };

  render() {
    const {
      treeDataListLeft,
      expandsLeft,
      expandsRight,
      shineNodeRightId,
      nodeSelectedLeft,
      nodeSelectedRight
    } = this.state;
    const { deptArray, deptRelation } = this.props;
    return (
      <Grid container direction="column">
        <Grid item>
          <Typography>
            1. 默认每个节点绑定自身，不需要再额外绑定添加数据库
          </Typography>
          <Typography>2. 两边节点均选定后才可以绑定/解绑</Typography>
        </Grid>
        <Grid item>
          <Divider style={{ margin: '1rem 0' }} />
        </Grid>
        <Grid item xs container>
          <Grid item xs={5}>
            {treeDataListLeft && (
              <Tree
                title="部门绑定结果"
                hideRefresh={true}
                treeDataList={treeDataListLeft}
                expands={expandsLeft}
                onExpandsChange={this.handleExpandsLeftChange}
                onTreeNodeSelected={this.handleTreeNodeLeftSelected}
                onTreeNodeUnSelected={this.handleTreeNodeLeftUnSelected}
              />
            )}
          </Grid>
          <Grid item xs={2} container direction="column" alignItems="center">
            <Grid item>
              <Button
                style={{ marginTop: '20rem' }}
                disabled={
                  !(nodeSelectedLeft && nodeSelectedRight) ||
                  (nodeSelectedLeft &&
                    nodeSelectedRight &&
                    nodeSelectedLeft.id === nodeSelectedRight.id)
                }
                variant="contained"
                color="secondary"
                onClick={this.bind}
              >
                {nodeSelectedLeft &&
                nodeSelectedRight &&
                deptRelation[nodeSelectedLeft.id] === nodeSelectedRight.id
                  ? '解绑'
                  : '绑定'}
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={5}>
            {deptArray && (
              <Tree
                title="部门架构"
                hideRefresh={true}
                shineNodeId={shineNodeRightId}
                treeDataList={deptArray}
                expands={expandsRight}
                onExpandsChange={this.handleExpandsRightChange}
                onTreeNodeSelected={this.handleTreeNodeRightSelected}
                onTreeNodeUnSelected={this.handleTreeNodeRightUnSelected}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

DeptRelation.propTypes = {};

function mapStateToProps(state) {
  return {
    deptArray: state.system.deptArray,
    deptDic: state.system.deptDic,
    deptRelation: state.system.deptRelation
  };
}

export default compose(connect(mapStateToProps))(DeptRelation);
