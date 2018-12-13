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
  ListItemText,
  withStyles
} from '@material-ui/core';
import Tree from '../Tree';
import compose from 'recompose/compose';

const styles = theme => ({
  listRoot: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.default
  },
  listItem: {
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem'
  }
});

class UserPicker extends PureComponent {
  state = {
    open: false,
    treeData: null,
    expands: null,
    users: null
    // selectedUsers: [] // [user1,user2...], user1= {id,name} 放在props中，做成受控组件
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
    console.log('user picker tree data change');
    this.setState({ treeData: treeData });
  };
  handleTreeNodeSelected = id => {
    axios.get(`/dept/users?offspring=1&id=${id}`).then(res => {
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
  handleCloseBtn = () => {
    this.setState({ open: false, users: null });
  };
  userItemClick = (user, isSelected) => {
    const { selectedUsers, onUserPickerChange } = this.props;
    let newSelectedUsers = null;
    if (isSelected) {
      // 已经被选取，这里取消选择
      newSelectedUsers = selectedUsers.filter(_user => _user.id !== user.id);
    } else {
      // user对象中还包含dept的键，这里在新选user的时候把无用的value过滤掉
      newSelectedUsers = [...selectedUsers, { id: user.id, name: user.name }];
    }
    onUserPickerChange && onUserPickerChange(newSelectedUsers);
  };
  render() {
    const {
      classes,
      label,
      disabled,
      // 最上级的selectedUsers或admins 初始化为undefined而不是null，如果是null，这里的默认值不会生效
      selectedUsers = [],
      canSelectIdList,
      cantSelectIdList,
      helperText,
      error,
      ...rest
    } = this.props;
    const { treeData, open, users } = this.state;
    const selectedIds = {};
    selectedUsers.forEach(user => {
      selectedIds[user.id] = 1;
    });
    return (
      <React.Fragment>
        <TextField
          disabled={disabled}
          fullWidth
          label={label}
          onClick={this.handleClick}
          value={selectedUsers.map(user => user.name).join(',')}
          error={error}
          helperText={helperText}
        />
        <Dialog fullWidth open={open} style={{ marginBottom: '10rem' }}>
          <DialogTitle>
            部门用户选择对话框
            <div>{`已选用户: ${selectedUsers.map(
              user => user.name + ' '
            )}`}</div>
          </DialogTitle>
          <DialogContent style={{ minHeight: '15rem' }}>
            <Grid container>
              <Grid item xs={6}>
                <Tree
                  title="选择部门"
                  isVirtualized={false}
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
              <Grid item xs={1} />
              <Grid item xs={5} container direction="column">
                <Grid item>
                  <Typography align="center" variant="h6">
                    选择用户
                  </Typography>
                </Grid>
                <Grid item className={classes.listRoot}>
                  {users && (
                    <List>
                      {users.map(user => (
                        <ListItem
                          className={classes.listItem}
                          button
                          divider
                          key={user.id}
                          selected={!!selectedIds[user.id]}
                          onClick={() => {
                            this.userItemClick(user, !!selectedIds[user.id]);
                          }}
                        >
                          <ListItemText
                            primary={`${user.name}(${user.dept.name})`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
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
  selectedUsers: PropTypes.array.isRequired, // 在文本框和对话框中显示的用户列表 [{id,name},{id,name}]
  label: PropTypes.string, // 显示的提示文字
  disabled: PropTypes.bool, //
  deptArray: PropTypes.array.isRequired, // 初始赋值的部门列表
  onUserPickerChange: PropTypes.func.isRequired, // 选择变化时调用的函数,参数为selectedUsers
  canSelectIdList: PropTypes.array, // 允许选择的节点，其余为不可选择
  cantSelectIdList: PropTypes.array, // 不允许选择的节点，其余为可选择
  error: PropTypes.bool, // redux-form 的render field空间相关信息
  helperText: PropTypes.string // redux-form 的render field空间相关信息
};

UserPicker.defaultProps = {
  label: '选取用户'
};

export default compose(withStyles(styles))(UserPicker);
