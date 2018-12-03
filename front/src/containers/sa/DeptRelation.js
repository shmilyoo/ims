import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Divider, Typography } from '@material-ui/core';
import Tree from '../../components/Tree';
import {
  makeDeptTree,
  getDeptArray,
  getDeptRelations,
  getLevel1ExpandsfromTreeArray,
  treeDataWithRelation
} from '../../services/utility';
import Axios from 'axios';

class DeptRelation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeDataListLeft: [], // 按照level和order排序的节点数组，非树形数据
      treeDataListRight: [],
      treeDataDic: null, // {id:node,id2:node2,...} 用于选择node时获取节点和父节点信息
      treeDataLeft: [],
      treeDataRight: [],
      nodeSelectedLeft: null,
      nodeSelectedRight: null,
      shineNodeRightId: '' // 左边节点选中时，右边绑定的节点开始闪光
    };
    this.expandsLeft = {};
    this.expandsRight = {};
    this.deptRelations = {};
  }

  componentDidMount() {
    this.initDeptTreeData(true);
  }

  handleTreeDataLeftChange = treeData => {
    this.setState({ treeDataLeft: treeData });
  };
  handleTreeDataRightChange = treeData => {
    this.setState({ treeDataRight: treeData });
  };

  expandRightTreeToNode = _id => {
    let node = this.state.treeDataDic[this.state.treeDataDic[_id].parentId];
    while (node) {
      console.log(node.name);
      this.expandsRight[node.id] = true;
      node = this.state.treeDataDic[node.parentId];
    }
    this.setState({
      treeDataRight: makeDeptTree(
        this.state.treeDataListRight,
        this.expandsRight
      )
    });
  };

  handleTreeNodeLeftSelected = id => {
    let node = this.state.treeDataDic[id];
    this.setState({
      nodeSelectedLeft: {
        id: node.id,
        title: node.name
      },
      shineNodeRightId: this.deptRelations[node.id] || node.id
    });
    this.expandRightTreeToNode(this.deptRelations[node.id] || node.id);
  };
  handleTreeNodeRightSelected = id => {
    let node = this.state.treeDataDic[id];
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

  handleLeftVisibilityToggle = ({ node: { id: nodeId }, expanded }) => {
    typeof this.expandsLeft === 'boolean'
      ? (this.expandsLeft = { [nodeId]: expanded })
      : (this.expandsLeft = { ...this.expands, [nodeId]: expanded });
  };
  handleRightVisibilityToggle = ({ node: { id: nodeId }, expanded }) => {
    typeof this.expandsRight === 'boolean'
      ? (this.expandsRight = { [nodeId]: expanded })
      : (this.expandsRight = { ...this.expands, [nodeId]: expanded });
  };
  handleLeftExpandCollapseAll = expand => {
    if (this.expandsLeft === expand) return;
    this.expandsLeft = expand;
    const result = makeDeptTree(this.state.treeDataListLeft, this.expandsLeft);
    this.setState({ treeDataLeft: result });
  };
  handleRightExpandCollapseAll = expand => {
    if (this.expandsRight === expand) return;
    this.expandsRight = expand;
    const result = makeDeptTree(
      this.state.treeDataListRight,
      this.expandsRight
    );
    this.setState({ treeDataRight: result });
  };

  /**
   * 根据state中的dept list和expands计算出树形数据，只有本地计算
   */
  makeDeptTreeData = () => {
    const result = makeDeptTree(this.state.treeDataList, this.expands);
    this.setState({ treeData: result });
  };

  /**
   * 从后台重新获取dept数据，并计算出树形数据
   * @param {boolean} isMount 是否第一次加载，用来将level1设置为展开
   */
  initDeptTreeData = () => {
    Promise.all([getDeptRelations(), getDeptArray()]).then(res => {
      const treeDataList = res[1].data;
      this.deptRelations = res[0].data;
      let treeDataDic = {};
      treeDataList.forEach(node => {
        treeDataDic[node.id] = node;
      });
      const treeDataListLeft = treeDataList.map(node => ({
        ...node,
        name: this.deptRelations[node.id]
          ? `${node.name} -> ${treeDataDic[this.deptRelations[node.id]].name}`
          : node.name
      }));
      this.expandsLeft = getLevel1ExpandsfromTreeArray(treeDataList);
      this.expandsRight = { ...this.expandsLeft };
      const treeDataRight = makeDeptTree(treeDataList, this.expandsRight);
      let treeDataLeft = makeDeptTree(treeDataListLeft, this.expandsLeft);
      this.setState({
        treeDataListLeft,
        treeDataListRight: treeDataList,
        treeDataLeft,
        treeDataRight: treeDataRight,
        treeDataDic
      });
    });
  };

  bind = () => {
    const { nodeSelectedLeft, nodeSelectedRight } = this.state;
    if (
      nodeSelectedLeft &&
      nodeSelectedRight &&
      this.deptRelations[nodeSelectedLeft.id] === nodeSelectedRight.id
    ) {
      // 解绑
      Axios.post('/dept/relations/unbind', {
        fromDeptId: nodeSelectedLeft.id,
        toDeptId: nodeSelectedRight.id
      }).then(res => {
        if (res.success) {
          const { fromDeptId } = res.data;
          delete this.deptRelations[fromDeptId];
          if (
            this.state.nodeSelectedLeft &&
            this.state.nodeSelectedLeft.id === fromDeptId
          ) {
            this.setState({ shineNodeRightId: '' });
          }
          this.updateLeftTree();
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
          this.deptRelations[fromDeptId] = toDeptId;
          if (
            this.state.nodeSelectedLeft &&
            this.state.nodeSelectedLeft.id === fromDeptId
          ) {
            this.setState({ shineNodeRightId: nodeSelectedRight.id });
          }
          this.updateLeftTree();
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
      treeDataLeft,
      treeDataRight,
      shineNodeRightId,
      nodeSelectedLeft,
      nodeSelectedRight
    } = this.state;
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
              onVisibilityToggle={this.handleLeftVisibilityToggle}
              onExpandCollapseAll={this.handleLeftExpandCollapseAll}
              onTreeNodeSelected={this.handleTreeNodeLeftSelected}
              onTreeNodeUnSelected={this.handleTreeNodeLeftUnSelected}
              onMoveNode={this.handleTreeNodeMove}
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
                this.deptRelations[nodeSelectedLeft.id] === nodeSelectedRight.id
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
              onVisibilityToggle={this.handleRightVisibilityToggle}
              onExpandCollapseAll={this.handleRightExpandCollapseAll}
              onTreeNodeSelected={this.handleTreeNodeRightSelected}
              onTreeNodeUnSelected={this.handleTreeNodeRightUnSelected}
              onMoveNode={this.handleTreeNodeMove}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

DeptRelation.propTypes = {};

export default DeptRelation;
