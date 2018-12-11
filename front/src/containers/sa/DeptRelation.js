import React, { Component } from 'react';
import { Grid, Button, Divider, Typography } from '@material-ui/core';
import Tree from '../../components/Tree';
import {
  makeDeptTree,
  getLevel1ExpandsfromTreeArray,
  getNewExpands,
  getExpandsToNode
} from '../../services/utility';
import Axios from 'axios';
import { actions as systemActions } from '../../reducers/system';

class DeptRelation extends Component {
  constructor(props) {
    super(props);
    const { deptArray, deptDic, deptRelation } = props;
    // let deptArrayLeft = JSON.parse(JSON.stringify(deptArray));
    const deptArrayLeft = deptArray.map(node => ({
      ...node,
      name: deptRelation[node.id]
        ? `${node.name} -> ${deptDic[deptRelation[node.id]].name}`
        : node.name
    }));
    const expandsLeft = getLevel1ExpandsfromTreeArray(deptArrayLeft);
    const treeDataLeft = makeDeptTree(deptArrayLeft, expandsLeft);
    const treeDataRight = makeDeptTree(deptArray, expandsLeft);
    this.state = {
      treeDataListLeft: deptArrayLeft,
      treeDataLeft: treeDataLeft,
      treeDataRight: treeDataRight,
      nodeSelectedLeft: null,
      nodeSelectedRight: null,
      expandsLeft: expandsLeft,
      expandsRight: { ...expandsLeft },
      shineNodeRightId: '' // 左边节点选中时，右边绑定的节点开始闪光
    };
  }

  /**
   * 左边选择节点后，右边绑定到的节点，一路展开，如果有必要的话
   */
  expandRightTreeToNode = _id => {
    if (this.state.expandsRight === true) return;
    const { deptDic, deptArray } = this.props;
    const { hasExpandsChange, newExpands } = getExpandsToNode(
      _id,
      deptDic,
      this.state.expandsRight
    );
    if (hasExpandsChange) {
      this.setState({
        expandsRight: newExpands,
        treeDataRight: makeDeptTree(deptArray, newExpands)
      });
    }
  };

  handleExpandsLeftChange = expands => {
    if (this.state.expandsLeft === expands) return;
    const newExpands = getNewExpands(this.state.expandsLeft, expands);
    typeof expands === 'boolean'
      ? this.setState({
          expandsLeft: newExpands,
          treeDataLeft: makeDeptTree(this.state.treeDataListLeft, newExpands)
        })
      : this.setState({
          expandsLeft: newExpands
        });
  };

  handleExpandsRightChange = expands => {
    if (this.state.expandsRight === expands) return;
    const newExpands = getNewExpands(this.state.expandsRight, expands);
    typeof expands === 'boolean'
      ? this.setState({
          expandsRight: newExpands,
          treeDataRight: makeDeptTree(this.props.deptArray, newExpands)
        })
      : this.setState({
          expandsRight: newExpands
        });
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

  handleTreeDataLeftChange = treeData => {
    this.setState({ treeDataLeft: treeData });
  };
  handleTreeDataRightChange = treeData => {
    this.setState({ treeDataRight: treeData });
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
    const { nodeSelectedLeft, nodeSelectedRight, expandsLeft } = this.state;
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
          // 更改store中的deptRelation 更新左侧树的deptArray
          const newRelation = { ...deptRelation };
          delete newRelation[fromDeptId];
          const newDataList = this.getDeptArrayLeft(
            deptArray,
            newRelation,
            deptDic
          );
          this.setState({
            treeDataListLeft: newDataList,
            treeDataLeft: makeDeptTree(newDataList, expandsLeft),
            shineNodeRightId: ''
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
          const newDataList = this.getDeptArrayLeft(
            deptArray,
            newRelation,
            deptDic
          );
          this.setState({
            treeDataListLeft: newDataList,
            treeDataLeft: makeDeptTree(newDataList, expandsLeft),
            shineNodeRightId: nodeSelectedRight.id
          });
          dispatch(systemActions.setDeptRelation(newRelation));
        }
      });
    }
  };

  updateLeftTree = () => {
    const { deptDic, deptRelation, expandsLeft } = this.props;
    const { treeDataListLeft } = this.state;
    treeDataListLeft.forEach(node => {
      node.name = deptRelation[node.id]
        ? `${deptDic[node.id].name} -> ${deptDic[deptRelation[node.id]].name}`
        : deptDic[node.id].name;
    });
    let treeDataLeft = makeDeptTree(treeDataListLeft, expandsLeft);
    this.setState({
      treeDataListLeft,
      treeDataLeft
    });
  };

  render() {
    const {
      treeDataLeft,
      treeDataRight,
      shineNodeRightId,
      nodeSelectedLeft,
      nodeSelectedRight
    } = this.state;
    const { deptRelation } = this.props;
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
            <Tree
              title="部门绑定结果"
              hideRefresh={true}
              treeData={treeDataLeft}
              onChange={this.handleTreeDataLeftChange}
              onExpandsChange={this.handleExpandsLeftChange}
              onTreeNodeSelected={this.handleTreeNodeLeftSelected}
              onTreeNodeUnSelected={this.handleTreeNodeLeftUnSelected}
            />
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
            <Tree
              title="部门架构"
              hideRefresh={true}
              shineNodeId={shineNodeRightId}
              treeData={treeDataRight}
              onChange={this.handleTreeDataRightChange}
              onExpandsChange={this.handleExpandsRightChange}
              onTreeNodeSelected={this.handleTreeNodeRightSelected}
              onTreeNodeUnSelected={this.handleTreeNodeRightUnSelected}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default DeptRelation;
