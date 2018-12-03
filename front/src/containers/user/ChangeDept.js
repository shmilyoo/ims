import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { actions as accountActions } from '../../reducers/account';
import { Grid, Divider, Button } from '@material-ui/core';

class ChangeDept extends PureComponent {
  state = {
    open: false
  };
  componentDidMount() {
    if (!this.props.dept.name) {
      this.props.dispatch(accountActions.sagaGetDeptInfo(this.props.dept.id));
    }
  }
  render() {
    const { open } = this.state;
    const { dept } = this.props;
    return (
      <Grid container direction="column" wrap="nowrap" spacing={8}>
        <Grid item container>
          <Grid item>在我的资料中直接改</Grid>
        </Grid>
        {open && <Divider />}
      </Grid>
    );
  }
}

ChangeDept.propTypes = {};

function mapStateToProps(state) {
  return {
    dept: state.account.dept
  };
}

export default compose(connect(mapStateToProps))(ChangeDept);
