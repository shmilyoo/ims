import React from 'react';
import { Grid, Typography, CircularProgress } from '@material-ui/core';

const Loading = ({ showTitle, title }) => {
  return (
    <Grid container justify="center" alignItems="center">
      <Grid item container alignItems="center" direction="column">
        {showTitle && (
          <Grid item>
            <Typography color="textSecondary" variant="h4" align="center">
              {title}
            </Typography>
          </Grid>
        )}
        <Grid item>
          <CircularProgress style={{ color: 'rgba(0, 0, 0, 0.54)' }} />
        </Grid>
      </Grid>
    </Grid>
  );
};

Loading.defaultProps = {
  showTitle: true,
  title: '正在加载'
};

export default Loading;