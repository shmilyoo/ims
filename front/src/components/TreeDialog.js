import React from 'react';
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@material-ui/core';
import Tree from './Tree';
import PropTypes from 'prop-types';

const TreeDialog = ({
  open,
  treeData,
  nodeSelected,
  dialogTitle,
  treeTitle,
  onTreeDataChange,
  onTreeNodeSelected,
  onTreeNodeUnSelected,
  onDialogOk,
  onDialogClose,
  ...rest
}) => {
  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent style={{ height: '100%', minHeight: '300px' }}>
        <Tree
          title={treeTitle}
          canDrop={() => false}
          treeData={treeData}
          nodeSelected={nodeSelected}
          isVirtualized={false}
          onChange={onTreeDataChange}
          onTreeNodeSelected={onTreeNodeSelected}
          onTreeNodeUnSelected={onTreeNodeUnSelected}
          {...rest}
        />
      </DialogContent>
      <DialogActions>
        <Button
          disabled={!nodeSelected}
          variant="contained"
          color="secondary"
          onClick={onDialogOk}
        >
          确定
        </Button>
        <Button variant="text" onClick={onDialogClose}>
          取消
        </Button>
      </DialogActions>
    </Dialog>
  );
};

TreeDialog.propTypes = {
  open: PropTypes.bool.isRequired, // dialog 的open
  treeTitle: PropTypes.string, // 树组件标题
  dialogTitle: PropTypes.string, // 对话框标题
  onDialogOk: PropTypes.func.isRequired,
  onDialogClose: PropTypes.func.isRequired,
  onTreeDataChange: PropTypes.func.isRequired,
  onTreeNodeSelected: PropTypes.func,
  onTreeNodeUnSelected: PropTypes.func,
  nodeSelected: PropTypes.object, // 选中的节点对象 {id,title}或null
  treeData: PropTypes.array.isRequired, // 树形节点数据列表
  disableOkBtn: PropTypes.bool // 禁止点击确定按钮
};

TreeDialog.defaultProps = {
  title: '选择工作部门',
  disableOkBtn: false
};

export default TreeDialog;
