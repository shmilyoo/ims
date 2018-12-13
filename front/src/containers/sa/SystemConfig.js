import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Button, Divider, Typography } from '@material-ui/core';
import Axios from 'axios';
import SystemConfigTag from './SystemConfigTag';
import SystemTimeScaleForm from '../../forms/system/SystemTimeScaleForm';
import compose from 'recompose/compose';
import { actions as systemActions } from '../../reducers/system';

class SystemConfig extends PureComponent {
  componentDidMount() {
    // 初始化所有配置项
    this.props.dispatch(systemActions.sagaGetSystemConfig());
  }
  updateAllCache = () => {
    // todo 更改store
    Axios.post('/cache/updateAll').then();
  };
  handleTimeScaleSubmit = values => {
    return new Promise(resolve => {
      this.props.dispatch(systemActions.sagaSaveTimeScale(resolve, values));
    });
  };
  render() {
    const { timeScale } = this.props;
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
        <Grid item>tag管理2222</Grid>
      </Grid>
    );
  }
}

SystemConfig.propTypes = {};

function mapStateToProps(state) {
  return {
    timeScale: state.system.timeScale
  };
}

export default compose(connect(mapStateToProps))(SystemConfig);
