import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { actions as accountActions } from '../../reducers/account';
import {
  Grid,
  Divider,
  Button,
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
    const { dept, info } = this.props;
    return (
      <Grid container direction="column" wrap="nowrap" spacing={8}>
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
            onSubmit={this.handleUserInfoFormSubmit}
            initialValues={{
              status: info.status,
              position: info.position,
              dept: { id: dept.id, name: dept.name, names: dept.names }
            }}
          />
        </Grid>
      </Grid>
    );
  }
}

ChangeDept.propTypes = {};

function mapStateToProps(state) {
  return {
    dept: state.account.dept,
    info: state.account.info,
    id: state.account.id
  };
}

export default compose(connect(mapStateToProps))(ChangeDept);
