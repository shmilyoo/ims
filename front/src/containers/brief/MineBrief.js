import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';

class MineBrief extends PureComponent {
  render() {
    return (
      <Grid container>
        <Grid item>mine</Grid>
      </Grid>
    );
  }
}

MineBrief.propTypes = {};

export default MineBrief;
