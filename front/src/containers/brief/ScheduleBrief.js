import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';

class ScheduleBrief extends PureComponent {
  render() {
    return (
      <Grid container direction="column">
        <Grid item>
          <Link to="/sa/system">system</Link>
        </Grid>
      </Grid>
    );
  }
}

ScheduleBrief.propTypes = {};

export default ScheduleBrief;
