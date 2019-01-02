import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  makeDeptTree,
  getNewExpands,
  getLevel1ExpandsfromTreeArray,
  getDeptNamesArraySync
} from '../../services/utility';
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid
} from '@material-ui/core';
import Tree from '../Tree';

class DeptPicker extends PureComponent {
  state = {
    open: false,
    treeData: null,
    expands: null,
    _id: '' // 临时存储选中的dept id
  };
  initTreeData = () => {
    const expands = getLevel1ExpandsfromTreeArray(this.props.deptArray);
    const treeData = makeDeptTree(this.props.deptArray, expands);
    this.setState({
      treeData,
      expands
    });
  };
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
  handleTreeDataChange = treeData => {
    this.setState({ treeData: treeData });
  };
  handleTreeNodeSelected = id => {
    this.setState({ _id: id });
  };
  handleTreeNodeUnSelected = () => {
    this.setState({ _id: '' });
  };
  handleTextFieldClick = () => {
    if (!this.props.deptArray || this.props.disabled) return;
    if (!this.state.treeData) this.initTreeData();
    this.setState({ _id: this.props.id, open: true });
  };
  closeDialog = () => {
    this.setState({ open: false, _id: '' });
  };
  handleCloseBtn = () => {
    this.closeDialog();
  };
  handleOkBtn = () => {
    this.props.onDeptChange(this.state._id);
    this.closeDialog();
  };

  render() {
    const {
      label,
      disabled,
      id,
      deptDic,
      canSelectIdList,
      cantSelectIdList,
      helperText,
      error,
      ...rest
    } = this.props;
    const { treeData, open, _id } = this.state;
    return (
      <React.Fragment>
        <TextField
          disabled={disabled}
          fullWidth
          label={label}
          onClick={this.handleTextFieldClick}
          value={id ? getDeptNamesArraySync(id, deptDic).join('-') : ''}
          error={error}
          helperText={helperText}
        />
        <Dialog fullWidth open={open} style={{ marginBottom: '10rem' }}>
          <DialogTitle>部门选择对话框</DialogTitle>
          <DialogContent style={{ minHeight: '15rem' }}>
            <Grid container>
              <Grid item xs={6}>
                <Tree
                  title="选择部门"
                  isVirtualized={false}
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
                  {...rest}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              // id没有变化
              disabled={id === _id || _id === ''}
              variant="contained"
              color="secondary"
              onClick={this.handleOkBtn}
            >
              确定
            </Button>
            <Button variant="contained" onClick={this.handleCloseBtn}>
              关闭
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

DeptPicker.propTypes = {
  id: PropTypes.string.isRequired, // 确定选择的dept id
  deptArray: PropTypes.array.isRequired, // 初始赋值的部门列表
  deptDic: PropTypes.object.isRequired, // 部门对象集合
  onDeptChange: PropTypes.func.isRequired, // 选择变化时调用的函数,参数为id
  label: PropTypes.string, // 显示的提示文字
  disabled: PropTypes.bool, // 设置附件是否可用，是否可以点击
  canSelectIdList: PropTypes.array, // 允许选择的树节点，其余为不可选择，这两个选项互斥
  cantSelectIdList: PropTypes.array, // 不允许选择的树节点，其余为可选择，这两个选项互斥
  error: PropTypes.bool, // redux-form 的render field空间相关信息
  helperText: PropTypes.string // redux-form 的render field空间相关信息
};

DeptPicker.defaultProps = {
  label: '选取部门',
  id: ''
};

export default DeptPicker;
