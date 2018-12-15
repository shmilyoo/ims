import React from 'react';
import PropTypes from 'prop-types';
import SortableTree from 'react-sortable-tree';
import { withStyles, Typography, IconButton } from '@material-ui/core';
import Autorenew from '@material-ui/icons/Autorenew';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import 'react-sortable-tree/style.css';
import '../assets/css/customDeptTree.css'; // 自定义的一些样式

const style = {
  refreshBtn: { padding: '0.5rem' },
  refreshIcon: { fontSize: '2rem' },
  root: { display: 'flex', flexDirection: 'column', height: '100%' },
  head: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  tree: { flex: '1', display: 'flex', flexDirection: 'column' }
};
class Tree extends React.PureComponent {
  handleRefreshClick = e => {
    e.stopPropagation();
    this.props.onRefreshData();
  };

  /**
   * 点击控件空白处触发的事件，用户撤销选中节点
   */
  rootDivClickHandle = () => {
    this.props.selectedId && this.handleUnSelected();
  };

  /**
   * tree的node 文本被点击后调用的方法，传入node的id title属性
   * 触发上层组件的选中和撤销选中方法
   */
  handleSelected = (id, title) => {
    // 选中节点，并激活上级组件事件
    this.props.onTreeNodeSelected && this.props.onTreeNodeSelected(id, title);
  };
  handleUnSelected = () => {
    // 取消选中节点 ，并激活上级组件事件
    this.props.onTreeNodeUnSelected && this.props.onTreeNodeUnSelected();
  };

  handleExpandAllClick = e => {
    e.stopPropagation();
    this.props.onExpandsChange && this.props.onExpandsChange(true);
  };
  handleCollapseAllClick = e => {
    e.stopPropagation();
    this.props.onExpandsChange && this.props.onExpandsChange(false);
  };

  /**
   * 点击节点旁按钮展开收缩节点时，回调 expands change 事件
   */
  handleVisibilityToggle = ({ node: { id: nodeId }, expanded }) => {
    this.props.onExpandsChange &&
      this.props.onExpandsChange({ [nodeId]: expanded });
  };

  generateNodeProps = ({ node }) => {
    const {
      selectedId,
      shineNodeId,
      canSelectIdList,
      cantSelectIdList
    } = this.props;
    let color = 'rgba(0, 0, 0, 0.87)';
    if (
      (canSelectIdList && !canSelectIdList.includes(node.id)) ||
      (cantSelectIdList && cantSelectIdList.includes(node.id))
    ) {
      color = 'rgba(0, 0, 0, 0.54)';
    }
    return {
      style: {
        boxShadow: node.id === shineNodeId ? '0 0 15px red' : '',
        border: selectedId && node.id === selectedId ? 'solid blue 2px' : '',
        color: color
      },
      onClick: e => {
        e.stopPropagation();
        if (
          e.target.className === 'rst__collapseButton' ||
          e.target.className === 'rst__expandButton' ||
          e.target.className === 'rst__moveHandle'
        ) {
          return; // 略过点击折叠按钮/移动手柄 触发选择事件
        }
        if (canSelectIdList && !canSelectIdList.includes(node.id)) return;
        if (cantSelectIdList && cantSelectIdList.includes(node.id)) return;
        if (selectedId && node.id === selectedId) {
          // 点击的节点id等于已经选中的id，触发取消选中事件
          this.handleUnSelected && this.handleUnSelected();
        } else {
          // 触发选中事件
          this.handleSelected && this.handleSelected(node.id, node.title);
        }
      }
    };
  };

  render() {
    const {
      classes,
      treeData,
      onChange,
      hideHead,
      hideRefresh,
      hideExpandCollapse,
      onMoveNode,
      title,
      ...rest
    } = this.props;
    return (
      <div className={classes.root} onClick={this.rootDivClickHandle}>
        {!hideHead && (
          <div className={classes.head}>
            <Typography variant="h6" align="center">
              {title}
            </Typography>
            {!hideRefresh && (
              <IconButton
                title="刷新"
                className={classes.refreshBtn}
                onClick={this.handleRefreshClick}
              >
                <Autorenew className={classes.refreshIcon} />
              </IconButton>
            )}
            {!hideExpandCollapse && (
              <span>
                <IconButton
                  title="全部折叠"
                  className={classes.refreshBtn}
                  onClick={this.handleCollapseAllClick}
                >
                  <ExpandLess className={classes.refreshIcon} />
                </IconButton>
                <IconButton
                  title="全部展开"
                  className={classes.refreshBtn}
                  onClick={this.handleExpandAllClick}
                >
                  <ExpandMore
                    fontSize="default"
                    className={classes.refreshIcon}
                  />
                </IconButton>
              </span>
            )}
          </div>
        )}
        <div className={classes.tree}>
          <SortableTree
            {...rest}
            treeData={treeData || []}
            rowHeight={50}
            onChange={onChange}
            onVisibilityToggle={this.handleVisibilityToggle}
            onMoveNode={onMoveNode}
            getNodeKey={({ node }) => node.id}
            generateNodeProps={this.generateNodeProps}
          />
        </div>
      </div>
    );
  }
}

Tree.propTypes = {
  title: PropTypes.string, // 标题
  selectedId: PropTypes.string, // 选中的节点对象 {id,title}或null
  treeData: PropTypes.array.isRequired, // 树形节点数据列表
  onTreeNodeSelected: PropTypes.func, // 选中节点，并激活上级组件事件
  onTreeNodeUnSelected: PropTypes.func, // 取消选中节点，并激活上级组件事件
  onRefreshData: PropTypes.func, // 刷新按钮事件
  onChange: PropTypes.func.isRequired, // treeData在change的时候回调
  onExpandsChange: PropTypes.func, // 在expands变化的时候回调,如果上级组件不定义此函数，则全部展开收缩按钮也不可用
  onExpandCollapseAll: PropTypes.func,
  onMoveNode: PropTypes.func,
  // 以下两个props不可同时存在
  canSelectIdList: PropTypes.array, // 允许选择的节点，其余为不可选择
  cantSelectIdList: PropTypes.array, // 不允许选择的节点，其余为可选择
  hideHead: PropTypes.bool,
  hideRefresh: PropTypes.bool,
  hideExpandCollapse: PropTypes.bool,
  shineNodeId: PropTypes.string // 节点发出红色光晕的id
};

Tree.defaultProps = {
  hideHead: false,
  hideRefresh: false,
  hideExpandCollapse: false
};

export default withStyles(style)(Tree);
