import React from 'react';
import PropTypes from 'prop-types';
import { getDeptNamesArraySync } from '../../services/utility';
import { Grid, Typography, withStyles } from '@material-ui/core';
import TreeDialog from '../TreeDialog';
import compose from 'recompose/compose';

const style = theme => ({
  link: { ...theme.sharedClass.link, color: theme.palette.text.secondary }
});

class DeptHeadChange extends React.PureComponent {
  state = {
    nodeSelected: null,
    open: false
  };
  handleDialogOk = () => {
    this.setState({ open: false });
    this.props.onSelect && this.props.onSelect(this.state.nodeSelected);
  };
  handleDialogClose = () => {
    this.setState({ open: false });
  };
  handleOpenChangeDept = () => {
    this.setState({ open: true });
  };
  handleTreeNodeSelected = (id, title) => {
    this.setState({ nodeSelected: { id, title } });
  };
  handleTreeNodeUnSelected = () => {
    this.setState({ nodeSelected: null });
  };
  render() {
    const { id, canSelectIdList, deptDic, treeData, classes } = this.props;
    const { nodeSelected, open } = this.state;
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
          {(!canSelectIdList || canSelectIdList.length > 1) && (
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
        <TreeDialog
          open={open}
          treeData={treeData}
          hideHead={true}
          dialogTitle="选择部门节点"
          nodeSelected={nodeSelected}
          onTreeDataChange={() => {}}
          onDialogOk={this.handleDialogOk}
          onDialogClose={this.handleDialogClose}
          onTreeNodeSelected={this.handleTreeNodeSelected}
          onTreeNodeUnSelected={this.handleTreeNodeUnSelected}
          canSelectIdList={canSelectIdList}
        />
      </React.Fragment>
    );
  }
}

DeptHeadChange.propTypes = {
  treeData: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired, // 现显示的部门id
  deptDic: PropTypes.object.isRequired, // dept dic from state.system
  onSelect: PropTypes.func.isRequired, // 选择后执行的回调函数
  canSelectIdList: PropTypes.array // 弹出选择dept对话框中可以选择的节点id列表
};

export default compose(withStyles(style))(DeptHeadChange);
