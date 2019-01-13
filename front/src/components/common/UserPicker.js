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
  },
  checkTextLink: {
    ...theme.sharedClass.grayLink,
    marginLeft: '0.5rem'
  }
});

class UserPicker extends PureComponent {
  state = {
    open: false,
    treeData: null,
    expands: null,
    users: null,
    deptId: ''
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
    this.setState({ deptId: id });
    axios.get(`/dept/users?offspring=1&id=${id}`).then(res => {
      if (res.success) {
        const users = res.data;
        this.setState({ users });
      }
    });
  };
  handleTreeNodeUnSelected = () => {
    this.setState({ users: null, deptId: '' });
  };
  handleClick = () => {
    if (!this.props.deptArray || this.props.disabled) return;
    if (!this.state.treeData) this.initTreeData();
    this.setState({ open: true, deptId: '' });
  };
  handleCloseBtn = () => {
    this.setState({ open: false, users: null });
  };

  handleCheck = type => {
    const { selectedUsers, onUserPickerChange } = this.props;
    const { users } = this.state;
    const allUsers = []; // 包含以下三个
    const selectedUserDic = {}; // form已经选择的用户
    const usersSelectedDic = {}; // dialog中list列表中用户已经选择的
    const usersUnSelectedDic = {}; // dialog中list列表中用户未选择的
    (selectedUsers || []).forEach(user => {
      selectedUserDic[user.id] = 1;
      allUsers.push(user);
    });
    users.forEach(user => {
      if (selectedUserDic[user.id]) usersSelectedDic[user.id] = 1;
      else {
        usersUnSelectedDic[user.id] = 1;
        allUsers.push(user);
      }
    });
    let result = allUsers;
    if (type === 'none') {
      result = allUsers.filter(
        user =>
          selectedUserDic[user.id] &&
          !usersSelectedDic[user.id] &&
          !usersUnSelectedDic[user.id]
      );
    }
    if (type === 'reverse') {
      result = allUsers.filter(
        user =>
          (selectedUserDic[user.id] &&
            !usersSelectedDic[user.id] &&
            !usersUnSelectedDic[user.id]) ||
          (usersUnSelectedDic[user.id] && !selectedUserDic[user.id])
      );
    }
    onUserPickerChange && onUserPickerChange(result);
  };
  handleAllCheck = () => {
    this.handleCheck('all');
  };
  handleNoneCheck = () => {
    this.handleCheck('none');
  };
  handleReverseCheck = () => {
    this.handleCheck('reverse');
  };

  /**
   * @param {object} user 点中的用户 {id,name,...}
   * @param {bool} isSelected 点中时此listitem的状态，是否已经被选中
   */
  userItemClick = (user, isSelected) => {
    const { selectedUsers, onUserPickerChange, single } = this.props;
    let newSelectedUsers = null;
    if (single) {
      newSelectedUsers = isSelected ? [] : [{ id: user.id, name: user.name }];
    } else {
      if (isSelected) {
        // 已经被选取，这里取消选择
        newSelectedUsers = selectedUsers.filter(_user => _user.id !== user.id);
      } else {
        // user对象中还包含dept的键，这里在新选user的时候把无用的value过滤掉
        newSelectedUsers = [...selectedUsers, { id: user.id, name: user.name }];
      }
    }
    onUserPickerChange && onUserPickerChange(newSelectedUsers);
  };
  render() {
    const {
      classes,
      label,
      single,
      disabled,
      // 最上级的selectedUsers或admins 初始化为undefined而不是null，如果是null，这里的默认值不会生效
      selectedUsers = [],
      canSelectIdList,
      cantSelectIdList,
      helperText,
      error,
      ...rest
    } = this.props;
    const { treeData, open, users, deptId } = this.state;
    const selectedIds = {};
    selectedUsers &&
      selectedUsers.forEach(user => {
        selectedIds[user.id] = 1;
      });
    return (
      <React.Fragment>
        <TextField
          disabled={disabled}
          fullWidth
          label={label}
          InputProps={{ onClick: this.handleClick }}
          value={
            selectedUsers ? selectedUsers.map(user => user.name).join(', ') : ''
          }
          error={error}
          helperText={helperText}
        />
        <Dialog fullWidth open={open} style={{ marginBottom: '10rem' }}>
          <DialogTitle>
            部门用户选择对话框
            <div>{`已选用户: ${
              selectedUsers ? selectedUsers.map(user => user.name + ' ') : ''
            }`}</div>
          </DialogTitle>
          <DialogContent style={{ minHeight: '30rem' }}>
            <Grid container>
              <Grid item xs={6}>
                <Tree
                  title="选择部门"
                  isVirtualized={false}
                  hideRefresh={true}
                  treeData={treeData}
                  selectedId={deptId}
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
                <Grid item container alignItems="center">
                  <Typography align="center" variant="h6">
                    选择用户
                  </Typography>
                  {!single &&
                    users &&
                    users.length > 1 && (
                      <React.Fragment>
                        <Typography
                          align="center"
                          color="secondary"
                          variant="body2"
                          onClick={this.handleAllCheck}
                          className={classes.checkTextLink}
                        >
                          全选
                        </Typography>
                        <Typography
                          align="center"
                          color="secondary"
                          variant="body2"
                          onClick={this.handleNoneCheck}
                          className={classes.checkTextLink}
                        >
                          全不选
                        </Typography>
                        <Typography
                          align="center"
                          color="secondary"
                          variant="body2"
                          onClick={this.handleReverseCheck}
                          className={classes.checkTextLink}
                        >
                          反选
                        </Typography>
                      </React.Fragment>
                    )}
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
  single: PropTypes.bool, // 是否只允许选择一个用户
  selectedUsers: PropTypes.array.isRequired, // 在文本框和对话框中显示的用户列表 [{id,name},{id,name}]
  deptArray: PropTypes.array.isRequired, // 初始赋值的部门列表
  onUserPickerChange: PropTypes.func.isRequired, // 选择变化时调用的函数,参数为selectedUsers
  label: PropTypes.string, // 显示的提示文字
  disabled: PropTypes.bool, // 设置附件是否可用，是否可以点击
  canSelectIdList: PropTypes.array, // 允许选择的树节点，其余为不可选择，这两个选项互斥
  cantSelectIdList: PropTypes.array, // 不允许选择的树节点，其余为可选择，这两个选项互斥
  error: PropTypes.bool, // redux-form 的render field空间相关信息
  helperText: PropTypes.string // redux-form 的render field空间相关信息
};

UserPicker.defaultProps = {
  label: '选取用户',
  single: false,
  selectedUsers: []
};

export default compose(withStyles(styles))(UserPicker);
