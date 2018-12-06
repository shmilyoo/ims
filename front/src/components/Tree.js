import React from 'react';
import PropTypes from 'prop-types';
import SortableTree from 'react-sortable-tree';
import { withStyles, Typography, IconButton } from '@material-ui/core';
import Autorenew from '@material-ui/icons/Autorenew';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import 'react-sortable-tree/style.css';
import '../assets/css/customDeptTree.css'; // 自定义的一些样式
import { makeDeptTree } from '../services/utility';

const style = {
  refreshBtn: { padding: '0.5rem' },
  refreshIcon: { fontSize: '2rem' },
  root: { display: 'flex', flexDirection: 'column', height: '100%' },
  head: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  tree: { flex: '1', display: 'flex', flexDirection: 'column' }
};
class Tree extends React.PureComponent {
  state = {
    treeNodeSelectedId: '',
    treeNodeSelectedTitle: ''
    // treeData: null,
    // treeDataList: null, // 用在getDerivedStateFromProps中辅助判断是否需要计算treedata
    // expands: null // 用在getDerivedStateFromProps中辅助判断是否需要计算treedata
  };

  static getDerivedStateFromProps(nextProps, preState) {
    const { treeDataList, expands } = nextProps;
    if (
      treeDataList !== preState.treeDataList ||
      expands !== preState.expands
    ) {
      return {
        treeData: treeDataList ? makeDeptTree(treeDataList, expands) : null,
        treeDataList: treeDataList,
        expands: expands
      };
    }
    return null;
  }

  handleRefreshClick = e => {
    e.stopPropagation();
    this.props.onRefreshData();
  };

  /**
   * 点击控件空白处触发的事件，用户撤销选中节点
   */
  rootDivClickHandle = () => {
    this.state.treeNodeSelectedId && this.handleUnSelected();
  };

  /**
   * tree的node 文本被点击后调用的方法，传入node的id title属性
   * 触发上层组件的选中和撤销选中方法
   */
  handleSelected = (id, title) => {
    // 选中节点，并激活上级组件事件
    this.props.onTreeNodeSelected && this.props.onTreeNodeSelected(id, title);
    this.setState({
      treeNodeSelectedId: id,
      treeNodeSelectedTitle: title
    });
  };
  handleUnSelected = () => {
    // 取消选中节点 ，并激活上级组件事件
    this.props.onTreeNodeUnSelected && this.props.onTreeNodeUnSelected();
    this.setState({
      treeNodeSelectedId: '',
      treeNodeSelectedTitle: ''
    });
  };

  handleExpandAllClick = e => {
    e.stopPropagation();
    this.props.onExpandsChange(true);
  };
  handleCollapseAllClick = e => {
    e.stopPropagation();
    this.props.onExpandsChange(false);
  };

  /**
   * 点击节点旁按钮展开收缩节点时，回调 expands change 事件
   */
  handleVisibilityToggle = ({ node: { id: nodeId }, expanded }) => {
    const { expands, onExpandsChange } = this.props;
    typeof expands === 'boolean'
      ? onExpandsChange({ [nodeId]: expanded })
      : onExpandsChange({ ...expands, [nodeId]: expanded });
  };

  generateNodeProps = ({ node }) => {
    return {
      style: {
        boxShadow: node.id === this.props.shineNodeId ? '0 0 15px red' : '',
        border:
          node.id === this.state.treeNodeSelectedId ? 'solid blue 2px' : ''
      },
      onClick: e => {
        // console.log(node, path, e.target.className, e);
        e.stopPropagation();
        if (
          e.target.className === 'rst__collapseButton' ||
          e.target.className === 'rst__expandButton' ||
          e.target.className === 'rst__moveHandle'
        ) {
          return; // 略过点击折叠按钮/移动手柄 触发选择事件
        }
        const { canSelectIdList, cantSelectIdList } = this.props;
        if (canSelectIdList && !canSelectIdList.includes(node.id)) return;
        if (cantSelectIdList && cantSelectIdList.includes(node.id)) return;
        if (node.id === this.state.treeNodeSelectedId) {
          // 点击的节点id等于已经选中的id，触发取消选中事件
          this.handleUnSelected && this.handleUnSelected();
        } else {
          // 触发选中事件
          this.handleSelected && this.handleSelected(node.id, node.title);
        }
      }
    };
  };

  handleTreeChange = treeData => {
    this.setState({ treeData });
  };

  render() {
    const {
      classes,
      hideHead,
      hideRefresh,
      hideExpandCollapse,
      onMoveNode,
      title,
      ...rest
    } = this.props;
    // console.log(title, 'tree render');
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
            treeData={this.state.treeData || []}
            rowHeight={50}
            onChange={this.handleTreeChange}
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
  treeDataList: PropTypes.array, // 树形节点数据列表
  expands: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]), // 展开数据
  onTreeNodeSelected: PropTypes.func, // 选中节点，并激活上级组件事件
  onTreeNodeUnSelected: PropTypes.func, // 取消选中节点，并激活上级组件事件
  onRefreshData: PropTypes.func, // 刷新按钮事件
  // onChange: PropTypes.func.isRequired, // treeData在change的时候回调
  onExpandsChange: PropTypes.func, // 在expands变化的时候回调
  onExpandCollapseAll: PropTypes.func,
  onMoveNode: PropTypes.func,
  // 以下两个props不可同时存在
  canSelectIdList: PropTypes.array, // 允许选择的节点，其余为不可选择
  cantSelectIdList: PropTypes.array, // 不允许选择的节点，其余为可选择
  hideHead: PropTypes.bool,
  hideRefresh: PropTypes.bool,
  hideExpandCollapse: PropTypes.bool,
  shineNodeId: PropTypes.string
};

Tree.defaultProps = {
  hideHead: false,
  hideRefresh: false,
  hideExpandCollapse: false
};

export default withStyles(style)(Tree);
