import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Grid, Button, Divider, Typography } from '@material-ui/core';
import Axios from 'axios';
import SystemConfigTag from './SystemConfigTag';
import SystemTimeScaleForm from '../../forms/system/SystemTimeScaleForm';
import compose from 'recompose/compose';
import { actions as systemActions } from '../../reducers/system';
import SystemCommonConfigForm from '../../forms/system/SystemCommonConfigForm';

class SystemConfig extends PureComponent {
  updateAllCache = () => {
    // todo 更改store
    Axios.post('/cache/updateAll').then();
  };
  handleTimeScaleSubmit = values => {
    return new Promise(resolve => {
      this.props.dispatch(systemActions.sagaSaveTimeScale(resolve, values));
    });
  };
  handleCommonConfigSubmit = values => {
    return new Promise(resolve => {
      this.props.dispatch(systemActions.sagaSaveCommonConfig(resolve, values));
    });
  };
  render() {
    const { timeScale, allowExts } = this.props;
    return (
      <Grid container direction="column" spacing={16} wrap="nowrap">
        <Grid item>
          <Button variant="contained" onClick={this.updateAllCache}>
            手动更新所有缓存
          </Button>
        </Grid>
        <Grid item>
          <Divider />
        </Grid>
        <Grid item>
          <SystemTimeScaleForm
            enableReinitialize
            onSubmit={this.handleTimeScaleSubmit}
            initialValues={timeScale}
          />
        </Grid>
        <Grid item>
          <Divider />
        </Grid>
        <Grid item>
          <SystemConfigTag />
        </Grid>
        <Grid item>
          <Divider />
        </Grid>
        <Grid item>
          <Typography variant="h6">通用配置:</Typography>
        </Grid>
        <Grid item>
          <SystemCommonConfigForm
            enableReinitialize
            onSubmit={this.handleCommonConfigSubmit}
            initialValues={{ allowExts }}
          />
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    timeScale: {
      amFrom: state.system.amFrom,
      amTo: state.system.amTo,
      pmFrom: state.system.pmFrom,
      pmTo: state.system.pmTo
    },
    allowExts: state.system.allowExts
  };
}

export default compose(connect(mapStateToProps))(SystemConfig);
