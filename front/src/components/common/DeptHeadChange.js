import React from 'react';
import PropTypes from 'prop-types';
import { getDeptNamesArraySync, makeDeptTree } from '../../services/utility';
import {
  Grid,
  Typography,
  withStyles,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@material-ui/core';
import compose from 'recompose/compose';
import Tree from '../Tree';

const style = theme => ({
  link: theme.sharedClass.grayLink
});

class DeptHeadChange extends React.PureComponent {
  state = {
    _id: '',
    open: false,
    treeData: null
  };
  handleDialogOk = () => {
    this.setState({ open: false, _id: '' });
    this.props.onSelect && this.props.onSelect(this.state._id);
  };
  handleDialogClose = () => {
    this.setState({ open: false, _id: '' });
  };
  handleOpenChangeDept = () => {
    if (!this.state.treeData) {
      this.setState({
        open: true,
        treeData: makeDeptTree(this.props.deptArray),
        _id: this.props.id
      });
    } else {
      this.setState({ open: true, _id: this.props.id });
    }
  };
  handleTreeDataChange = treeData => {
    this.setState({ treeData });
  };
  handleTreeNodeSelected = (id, title) => {
    this.setState({ _id: id });
  };
  handleTreeNodeUnSelected = () => {
    this.setState({ _id: '' });
  };
  render() {
    const {
      id,
      canSelectIdList,
      cantSelectIdList,
      deptDic,
      classes,
      showSelect,
      ...rest
    } = this.props;
    const { nodeSelected, open, treeData, _id } = this.state;
    const names = getDeptNamesArraySync(id, deptDic);
    return (
      <React.Fragment>
        <Grid container justify="space-between">
          <Grid item>
            <Typography variant="h5">
              部门：
              {names.join(' - ')}
            </Typography>
          </Grid>
          {/* 不限制选取部门或者限制选取部门但可选取的数量大于1的时候出现切换部门链接 */}
          {showSelect && (
            <Grid item>
              <Typography
                className={classes.link}
                color="textSecondary"
                onClick={this.handleOpenChangeDept}
              >
                切换部门
              </Typography>
            </Grid>
          )}
        </Grid>
        {showSelect && (
          <Dialog open={open} fullWidth>
            <DialogTitle>选择部门</DialogTitle>
            <DialogContent style={{ height: '100%', minHeight: '300px' }}>
              <Tree
                title="部门结构"
                selectedId={_id}
                hideRefresh={true}
                treeData={treeData}
                canDrag={false}
                canSelectIdList={canSelectIdList}
                cantSelectIdList={cantSelectIdList}
                onChange={this.handleTreeDataChange}
                onExpandsChange={this.handleExpandsChange}
                onTreeNodeSelected={this.handleTreeNodeSelected}
                onTreeNodeUnSelected={this.handleTreeNodeUnSelected}
                canDrop={() => false}
                isVirtualized={false}
                {...rest}
              />
            </DialogContent>
            <DialogActions>
              <Button
                disabled={!_id || _id === id}
                variant="contained"
                color="secondary"
                onClick={this.handleDialogOk}
              >
                确定
              </Button>
              <Button variant="text" onClick={this.handleDialogClose}>
                取消
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </React.Fragment>
    );
  }
}

DeptHeadChange.propTypes = {
  id: PropTypes.string.isRequired, // 现显示的部门id
  showSelect: PropTypes.bool, // 是否显示右边的选择部门按钮
  deptArray: PropTypes.array.isRequired,
  deptDic: PropTypes.object.isRequired, // dept dic from state.system
  onSelect: PropTypes.func.isRequired, // 选择后执行的回调函数
  canSelectIdList: PropTypes.array, // 弹出选择dept对话框中可以选择的节点id列表
  cantSelectIdList: PropTypes.array
};
DeptHeadChange.defaultProps = {
  showSelect: false
};

export default compose(withStyles(style))(DeptHeadChange);
