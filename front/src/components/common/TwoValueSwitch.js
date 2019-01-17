import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Switch, withStyles, Grid } from '@material-ui/core';

const style = theme => ({
  colorSwitchBase: {
    height: 'auto',
    // color: purple[300],
    color: theme.palette.primary.main,
    '&$colorChecked': {
      color: theme.palette.secondary.main,
      '& + $colorBar': {
        backgroundColor: theme.palette.secondary.light
      }
    }
  },
  colorBar: { backgroundColor: theme.palette.primary.light },
  colorChecked: {}
});

const TwoValueSwitch = ({
  primaryTypoProps,
  secondaryTypoProps,
  primaryLabel,
  sencondaryLabel,
  primaryValue,
  sencondaryValue,
  value,
  onChange,
  classes
}) => {
  return (
    <Grid container alignItems="center">
      <Grid item>
        <Typography
          color={value === primaryValue ? 'textSecondary' : 'textPrimary'}
          {...secondaryTypoProps}
        >
          {sencondaryLabel}
        </Typography>
      </Grid>
      <Grid item>
        <Switch
          checked={value === primaryValue}
          onChange={() => {
            onChange(value === primaryValue ? sencondaryValue : primaryValue);
          }}
          classes={{
            switchBase: classes.colorSwitchBase,
            checked: classes.colorChecked,
            bar: classes.colorBar
          }}
        />
      </Grid>
      <Grid item>
        <Typography
          color={value === primaryValue ? 'textPrimary' : 'textSecondary'}
          {...primaryTypoProps}
        >
          {primaryLabel}
        </Typography>
      </Grid>
    </Grid>
  );
};

TwoValueSwitch.propTypes = {
  primaryTypoProps: PropTypes.object,
  secondaryTypoProps: PropTypes.object,
  primaryLabel: PropTypes.string,
  sencondaryLabel: PropTypes.string,
  primaryValue: PropTypes.string,
  sencondaryValue: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

export default withStyles(style)(TwoValueSwitch);
