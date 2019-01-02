import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { actions as accountActions } from '../../reducers/account';
import {
  Grid,
  Divider,
  FormControlLabel,
  Switch,
  Typography
} from '@material-ui/core';
import UserInfoForm from '../../forms/user/UserInfoForm';

class ChangeDept extends PureComponent {
  state = {
    edit: false
  };
  handleSwitchClick = () => {
    this.setState({ edit: !this.state.edit });
  };
  handleUserInfoFormSubmit = values => {
    return new Promise(resolve => {
      this.props.dispatch(
        accountActions.sagaSetAccountInfo(resolve, values, this.props.id)
      );
    });
  };
  render() {
    const { edit } = this.state;
    const { deptId, info, deptArray, deptDic } = this.props;
    return (
      <Grid container direction="column" wrap="nowrap" spacing={8}>
        <Grid item>
          <Typography variant="subtitle1">
            1. 不在位时，在我的位置注明所在地点-联系方式等简要信息
          </Typography>
          <Typography variant="subtitle1">2. 222</Typography>
        </Grid>
        <Grid item>
          <Divider />
        </Grid>
        <Grid item container justify="flex-start">
          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  value="edit"
                  checked={!!edit}
                  onClick={this.handleSwitchClick}
                />
              }
              label={
                <Typography color={edit ? 'textPrimary' : 'textSecondary'}>
                  编辑
                </Typography>
              }
              labelPlacement="end"
            />
          </Grid>
        </Grid>
        <Grid item>
          <UserInfoForm
            edit={edit}
            enableReinitialize
            deptArray={deptArray}
            deptDic={deptDic}
            onSubmit={this.handleUserInfoFormSubmit}
            initialValues={{
              status: info.status,
              position: info.position,
              deptId: deptId
            }}
          />
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    deptId: state.account.deptId,
    info: state.account.info,
    id: state.account.id,
    deptDic: state.system.deptDic,
    deptArray: state.system.deptArray
  };
}

export default compose(connect(mapStateToProps))(ChangeDept);
