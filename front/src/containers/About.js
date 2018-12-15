import React from 'react';
import { Grid, Typography } from '@material-ui/core';

const About = props => {
  return (
    <Grid container direction="column" wrap="nowrap">
      <Grid item>
        <Typography variant="h1" gutterBottom>
          h1. Heading
        </Typography>
        <Typography variant="h2" gutterBottom>
          h2. Heading
        </Typography>
        <Typography variant="h3" gutterBottom>
          h3. Heading
        </Typography>
        <Typography variant="h4" gutterBottom>
          h4. Heading
        </Typography>
        <Typography variant="h5" gutterBottom>
          h5. Heading
        </Typography>
        <Typography variant="h6" gutterBottom>
          h6. Heading
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          subtitle1.{' '}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          subtitle2.{' '}
        </Typography>
        <Typography variant="body1" gutterBottom>
          body1.{' '}
        </Typography>
        <Typography variant="body2" gutterBottom>
          body2.{' '}
        </Typography>
        <Typography variant="button" gutterBottom>
          button text
        </Typography>
        <Typography variant="caption" gutterBottom>
          caption text
        </Typography>
        <Typography variant="overline" gutterBottom>
          overline text
        </Typography>
      </Grid>
    </Grid>
  );
};

About.propTypes = {};

export default About;
