import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  makeDeptTree,
  getNewExpands,
  getLevel1ExpandsfromTreeArray
} from '../../services/utility';
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';
import Tree from '../Tree';

class UserPicker extends PureComponent {
  state = {
    treeData: null,
    expands: null,
    users: null,
    selectedUser: {} // {userId1:1,userId2:1}
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
    this.setState({ treeData });
  };
  handleTreeNodeSelected = id => {
    axios.get('/dept/users?offspring=1').then(res => {
      if (res.success) {
        const users = res.data;
        this.setState({ users });
      }
    });
  };
  handleTreeNodeUnSelected = () => {
    this.setState({ users: null });
  };
  handleClick = () => {
    if (!this.props.deptArray || this.props.disabled) return;
    if (!this.state.treeData) this.initTreeData();
    this.setState({ open: true });
  };
  handleOkBtn = () => {};
  handleCloseBtn = () => {
    this.setState({ open: false });
  };
  render() {
    const {
      label,
      disabled,
      canSelectIdList,
      cantSelectIdList,
      ...rest
    } = this.props;
    const { treeData, open, users, selectedUser } = this.state;
    return (
      <React.Fragment>
        <TextField
          disabled={disabled}
          fullWidth
          label={label}
          onClick={this.handleClick}
        />
        <Dialog fullWidth open={open} style={{ marginBottom: '10rem' }}>
          <DialogTitle>部门用户选择对话框</DialogTitle>
          <DialogContent style={{ minHeight: '30rem' }}>
            <Grid container>
              <Grid item xs={6}>
                <Tree
                  title="选择部门"
                  isVirtualized={false}
                  hideRefresh={true}
                  treeData={treeData}
                  canDrop={() => false}
                  canSelectIdList={canSelectIdList}
                  cantSelectIdList={cantSelectIdList}
                  onChange={this.handleTreeDataChange}
                  onExpandsChange={this.handleExpandsChange}
                  onTreeNodeSelected={this.handleTreeNodeSelected}
                  onTreeNodeUnSelected={this.handleTreeNodeUnSelected}
                  {...rest}
                />
              </Grid>
              <Grid item xs={6} container direction="column">
                <Grid item>
                  <Typography variant="h6">选择用户</Typography>
                </Grid>
                <Grid item>
                  {users && (
                    <List>
                      {users.map(user => (
                        <ListItem
                          key={user.id}
                          selected={!!selectedUser[user.id]}
                        >
                          <ListItemText primary={user.name} />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.handleOkBtn}
              style={{ marginRight: '1rem' }}
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

UserPicker.propTypes = {
  label: PropTypes.string, // 显示的提示文字
  disabled: PropTypes.bool, //
  deptArray: PropTypes.array, // 初始赋值的部门列表
  onChange: PropTypes.func.isRequired, // 选择变化时调用的函数
  canSelectIdList: PropTypes.array, // 允许选择的节点，其余为不可选择
  cantSelectIdList: PropTypes.array // 不允许选择的节点，其余为可选择
};

UserPicker.defaultProps = {
  label: '选取用户'
};

export default UserPicker;
