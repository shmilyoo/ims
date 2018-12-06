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

class DeptManager extends Component {
  state = {
    nodeSelected: null
  };

  handleTreeNodeSelected = id => {
    let node = this.props.deptDic[id];
    this.setState({
      nodeSelected: {
        id: node.id,
        title: node.name
      }
    });
  };
  handleTreeNodeUnSelected = () => {
    this.setState({
      nodeSelected: null
    });
  };

  render() {
    const { nodeSelected } = this.state;
    const { deptArray } = this.props;
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
            {deptArray && (
              <Tree
                title="部门绑定结果"
                hideRefresh={true}
                treeDataList={deptArray}
                // expands={expands}
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
                variant="contained"
                color="secondary"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

DeptManager.propTypes = {};

function mapStateToProps(state) {
  return {
    deptArray: state.system.deptArray,
    deptDic: state.system.deptDic,
    deptRelation: state.system.deptRelation
  };
}

export default compose(connect(mapStateToProps))(DeptManager);
